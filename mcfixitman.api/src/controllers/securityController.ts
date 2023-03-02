import * as memberDao from '../dao/memberDao';
import * as refreshTokenDao from 'src/dao/refreshTokenDao';

import { MemberPayload, MemberTokenPayload } from 'mcfixitman.shared/models/payloads/memberPayload';
import { createAccessTokens, getMemberFromAccessToken, getMemberIdFromRefreshToken } from 'src/utility/tokenUtility';

import { ControllerAction } from 'src/types/controllerAction';
import { HttpStatusCode } from 'mcfixitman.shared/constants/httpStatusCode';
import { MemberScopes } from 'src/models/dataModels/member';
import { Transaction } from 'sequelize';
import { sequelizeInstance } from 'src/models/dataModels';
import { stringMatchesHashedString } from 'src/utility/cryptoUtility';

class SecurityController {
    login: ControllerAction<MemberTokenPayload, { email: string; password: string; }> = async (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const deviceUUID = req.headers['device-uuid'] as string;

        try {
            if (!email || !password) {
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        isError: true,
                        key: 'Common.missing_required_parameters',
                        defaultMessage: 'Missing required parameters',
                    });
            }

            // Find the member in DB
            const member = await memberDao.getMemberByEmailAddress({ emailAddress: email, scope: MemberScopes.withPassword });

            if (!member) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.incorrect_username_or_password',
                        defaultMessage: 'Incorrect username or password',
                    });
            }

            const isPasswordValid = await stringMatchesHashedString(password, member.passwordHash ?? '');

            if (!isPasswordValid) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.incorrect_username_or_password',
                        defaultMessage: 'Incorrect username or password',
                    });
            }

            // Remove password from the member!
            delete member.passwordHash;

            const { accessToken, refreshToken } = createAccessTokens(member);

            const payload: MemberTokenPayload = {
                member: member,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };

            // No need to create refreshTokens for one time use
            let transaction: Transaction | undefined;

            try {
                transaction = await sequelizeInstance.transaction();

                await refreshTokenDao.destroyRefreshTokensByMemberIdAndDeviceUUID({
                    memberId: member.id,
                    deviceUUID: deviceUUID,
                    transaction: transaction,
                });

                await refreshTokenDao.createRefreshToken({
                    memberId: member.id,
                    deviceUUID: deviceUUID,
                    token: refreshToken,
                    transaction: transaction,
                });

                await transaction.commit();
            } catch (err) {
                if (!!transaction) {
                    await transaction.rollback();
                }

                throw err;
            }

            return res
                .status(HttpStatusCode.OK)
                .send(payload);

        } catch (err) {
            return next(err);
        }
    };

    logout: ControllerAction<void> = async (req, res, next) => {
        try {
            const member = req.member;
            const deviceUUID = req.headers['device-uuid'] as string;

            if (!member) {
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        isError: true,
                        key: 'SecurityController.not_logged_in',
                        defaultMessage: 'Not logged in',
                    });
            }
            if (!deviceUUID) {
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        isError: true,
                        key: 'SecurityController.missing_uuid',
                        defaultMessage: 'No UUID provided',
                    });
            }

            await refreshTokenDao.destroyRefreshTokensByMemberIdAndDeviceUUID({
                memberId: member.id,
                deviceUUID: deviceUUID,
            });

            return res
                .status(HttpStatusCode.OK)
                .send();
        } catch (err) {
            return next(err);
        }
    };

    refreshToken: ControllerAction<MemberTokenPayload> = async (req, res, next) => {
        const refreshToken = req.body.refreshToken;
        const deviceUUID = req.body.deviceUUID;

        try {
            if (!refreshToken) {
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        isError: true,
                        key: 'SecurityController.no_token_provided',
                        defaultMessage: 'No token provided',
                    });
            }

            const memberId = await getMemberIdFromRefreshToken(refreshToken);

            if (!memberId) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.invalid_token',
                        defaultMessage: 'Invalid token',
                    });
            }

            const dbToken = await refreshTokenDao.getRefreshTokenByMemberIdAndDeviceUUID({
                memberId: memberId,
                deviceUUID: deviceUUID,
            });

            if (!dbToken) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.token_not_found',
                        defaultMessage: 'Token not found',
                    });
            }

            if (!await stringMatchesHashedString(refreshToken, dbToken.tokenHash)) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.invalid_token',
                        defaultMessage: 'Invalid token',
                    });
            }

            const member = await memberDao.getMemberById({ memberId: memberId });
            if (!member) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.user_not_found',
                        defaultMessage: 'User not found',
                    });
            }

            const newTokens = createAccessTokens(member);

            const payload: MemberTokenPayload = {
                member: member,
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            };

            let transaction: Transaction | undefined;

            try {
                transaction = await sequelizeInstance.transaction();

                // Destroy existing tokens for this deviceConfigId and UUID
                await refreshTokenDao.destroyRefreshTokensByMemberIdAndDeviceUUID({
                    memberId: memberId,
                    deviceUUID: req.deviceUUID ?? '',
                    transaction: transaction,
                });

                // Create the new token 
                await refreshTokenDao.createRefreshToken({
                    memberId: memberId,
                    deviceUUID: req.deviceUUID ?? '',
                    token: newTokens.refreshToken,
                    transaction: transaction,
                });

                await transaction.commit();
            } catch (err) {
                if (!!transaction) {
                    await transaction.rollback();
                }

                throw err;
            }

            return res
                .status(HttpStatusCode.OK)
                .send(payload);

        } catch (err) {
            return next(err);
        }
    };

    authenticate: ControllerAction<MemberPayload> = async (req, res, next) => {
        const token = req.headers.authorization;

        try {
            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        isError: true,
                        key: 'SecurityController.no_token_provided',
                        defaultMessage: 'No token provided',
                    });
            }

            const member = await getMemberFromAccessToken(token);

            return res
                .status(HttpStatusCode.OK)
                .send({
                    member: member,
                });
        } catch (err) {
            return next(err);
        }
    };
}

const securityController = new SecurityController();
export { securityController };
export default securityController;
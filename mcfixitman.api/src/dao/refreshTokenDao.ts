import { Op, Transaction } from 'sequelize';

import { RefreshToken } from 'mcfixitman.shared/models/dataModels/refreshToken';
import { RefreshTokens } from 'src/models/dataModels/refreshToken';
import { hashString } from 'src/utility/cryptoUtility';

export const getRefreshTokenByMemberIdAndDeviceUUID = async (params: { memberId: number, deviceUUID: string, transaction?: Transaction }): Promise<RefreshToken | undefined> => {
    const token = await RefreshTokens.findOne({
        where: {
            memberId: params.memberId,
            deviceUUID: params.deviceUUID,
        },
        transaction: params.transaction,
    });

    return token?.get();
};

export const destroyRefreshTokensByMemberIdAndDeviceUUID = async (params: { memberId: number, deviceUUID: string, transaction?: Transaction }): Promise<void> => {
    await RefreshTokens.destroy({
        where: {
            memberId: params.memberId,
            deviceUUID: params.deviceUUID,
        },
        transaction: params.transaction,
    });
};

export const destroyOtherDeviceRefreshTokensByMemberIdAndDeviceUUID = async (params: { memberId: number, deviceUUID: string, transaction?: Transaction }): Promise<void> => {
    await RefreshTokens.destroy({
        where: {
            memberId: params.memberId,
            deviceUUID: {
                [Op.ne]: params.deviceUUID,
            },
        },
        transaction: params.transaction,
    });
};

export const destroyRefreshTokensByMemberId = async (params: { memberId: number, transaction?: Transaction }): Promise<void> => {
    await RefreshTokens.destroy({
        where: {
            memberId: params.memberId,
        },
        transaction: params.transaction,
    });
};

export const createRefreshToken = async (params: { memberId: number, deviceUUID: string, token: string, transaction?: Transaction }): Promise<RefreshToken> => {
    const newToken = await RefreshTokens.create({
        memberId: params.memberId,
        deviceUUID: params.deviceUUID,
        tokenHash: await hashString(params.token),
    }, {
        transaction: params.transaction,
    });

    return newToken;
};
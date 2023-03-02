import * as jwt from 'jsonwebtoken';

import { Member } from 'mcfixitman.shared/models/dataModels/member';
import { config } from 'src/config';

const defaultSignOptions: jwt.SignOptions = {
    issuer: config.security.issuer,
    audience: config.security.audience,
    algorithm: 'HS256',
};

export const createAccessTokens = (member: Member): { refreshToken: string; accessToken: string } => {
    const refreshToken = jwt.sign({ memberId: member.id }, config.security.jwtSecret, {
        ...defaultSignOptions,
        expiresIn: `${config.security.refreshTokenDurationDays}d`,
    });


    const accessToken = jwt.sign({ member: member }, config.security.jwtSecret, {
        ...defaultSignOptions,
        expiresIn: `${config.security.accessTokenDurationMinutes}m`,
    });

    return {
        refreshToken: refreshToken,
        accessToken: accessToken,
    };
};

export const getMemberFromAccessToken = (accessToken?: string): Promise<Member> => {
    return new Promise((resolve, reject) => {
        if (!accessToken) {
            const error = new Error('No access token provided');

            reject(error);

            return;
        }

        const bearerPrefix = 'bearer ';
        let t = accessToken;

        if (t.toLowerCase().startsWith(bearerPrefix)) {
            t = t.substring(bearerPrefix.length);
        }

        jwt.verify(t, config.security.jwtSecret, {
            ...defaultSignOptions,
        }, (err, decoded) => {
            if (err) {
                reject(err);

                return;
            } else {
                // TODO: This is gross, find a way to type jwt payload.

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const anyDecoded = decoded as any;
                if (!anyDecoded?.member) {
                    reject(new Error('Invalid token'));

                    return;
                }

                resolve(anyDecoded.member as Member);

                return;
            }
        });
    });
};

export const getMemberIdFromRefreshToken = (refreshToken?: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        if (!refreshToken) {
            const error = new Error('No refresh token provided');

            reject(error);

            return;
        }

        jwt.verify(refreshToken, config.security.jwtSecret, {
            ...defaultSignOptions,
        }, (err, decoded) => {
            if (err) {
                reject(err);

                return;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const anyDecoded = decoded as any;
                if (!anyDecoded?.memberId) {
                    reject(new Error('Invalid refresh token'));

                    return;
                }

                resolve(anyDecoded.memberId);

                return;
            }
        });
    });
};
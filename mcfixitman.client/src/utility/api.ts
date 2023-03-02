import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Buffer } from 'buffer';
import { HttpMethod } from 'mcfixitman.shared/constants/httpMethod';
import axiosRetry from 'axios-retry';
import { config } from 'src/config';
import { convertDates } from 'mcfixitman.shared/utility/objectHelpers';
import { refreshToken } from 'src/store/modules/securityModule';
import { store } from 'src/app';

axiosRetry(axios, {
    retries: 0,
    retryCondition: (axiosError) => {
        return false;
    },
});

axios.interceptors.response.use((originalResponse) => {
    // Interceptor to parse dates back into date objects
    convertDates(originalResponse.data);

    return originalResponse;
});

function tokenRefreshRequired(token?: string): boolean {
    const MILLISECONDS_IN_SECOND: number = 1000;

    if (!token) {
        return true;
    }

    try {
        // JWT Structure is:
        // [headers].[payload].[signature]
        // We're after the payload to find our expiration
        const [_headerPortion, payloadPortion, _signaturePortion] = token.split('.');

        const decodedToken: undefined | { exp: number } = !!payloadPortion ? JSON.parse(Buffer.from(payloadPortion, 'base64').toString('utf-8')) : undefined;

        if (!decodedToken || !decodedToken.exp) {
            // If we couldn't get our token or the expiry, return true so that they try to authenticate again anyway
            return true;
        }

        // Our expiry is in unix seconds, but Dates in js use unix MILLISECONDS
        // Multiply our expiry by 1000 to make them comparable
        const expiryDate = new Date(decodedToken.exp * MILLISECONDS_IN_SECOND);
        const nowDate = new Date(Date.now());

        // Return true if our token is expired, false otherwise
        return expiryDate.getTime() <= nowDate.getTime();
    } catch (ex) {
        // If we ran into an issue, return true so that the user must try to authenticate again anyway
        return true;
    }
}


/**
 * Use to call the API without attempting to refresh any tokens
 * 
 * Don't use this directly for any requests aside from the very few edge cases that don't require any authentication (i.e. user logging in, refreshing tokens, etc)
 * @param path 
 * @param method 
 * @param body 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function callApi<T>(path: string, method?: HttpMethod, body?: any, headers?: { [key: string]: string }): Promise<AxiosResponse<T>> {
    const { security } = store.getState();

    // eslint-disable-next-line
    const defaultHeaders: { [key: string]: string } = {
        'Content-Type': 'application/json',
    };

    let requestHeaders = !!headers
        ? headers
        : defaultHeaders;

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (security.isAuthenticated && !!security.member && !!security.accessToken) {
        requestHeaders = {
            ...requestHeaders,
            authorization: `Bearer ${security.accessToken}`,
        };
    }
    requestHeaders = {
        ...requestHeaders,
        'device-uuid': security.deviceUUID ?? '',
    };

    const retryConfig: AxiosRequestConfig | undefined =
        path.endsWith('deviceConfig/refreshDeviceToken') || path.endsWith('security/refresh')
            ?
            {
                'axios-retry': {
                    retries: Infinity,
                    retryCondition: (error) => {
                        return error.response === undefined;
                    },
                    retryDelay: (retryCount, error) => {
                        // We'll back off on our retries slightly based on how many retries have been attempted
                        // Max delay = 5 seconds
                        const maxDelayMilliseconds = 1000 * 5;

                        const delayMilliseconds = retryCount * 1000; // Add 1 second for each retry until we hit our max

                        return delayMilliseconds <= maxDelayMilliseconds
                            ? delayMilliseconds
                            : maxDelayMilliseconds;
                    },
                },
            }
            :
            undefined;

    return axios.request<T>({
        data: body,
        headers: requestHeaders,
        method: method || HttpMethod.GET,
        url: `${config.apiBaseUrl}${cleanPath}`,
        ...retryConfig,
    });
}

/**
 * Use to call the API for routes that require user authentication
 * 
 * I.e. Any actions that an administrator would need to perform should use this function to call the API
 * @param path 
 * @param method 
 * @param body 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function callUserAuthApi<T>(path: string, method?: HttpMethod, body?: any, headers?: { [key: string]: string }): Promise<AxiosResponse<T>> {
    const securityState = store.getState().security;

    // Check if we're already refreshing the token...
    if (securityState.isRefreshingToken && securityState.refreshPromise !== undefined) {
        // We are! Wait for it to finish first, and then continue with the api call that got us here
        const refresh = await securityState.refreshPromise;
        if (refresh.error) {
            throw refresh;
        } else {
            return callApi<T>(path, method, body, headers);
        }
    } else if (tokenRefreshRequired(securityState.accessToken)) {
        // We're not refreshing the token, but we need to!
        const refresh = await store.dispatch(refreshToken(false));

        if (refreshToken.rejected.match(refresh)) {
            throw refresh;
        } else {
            return callApi<T>(path, method, body, headers);
        }
    } else {
        return callApi<T>(path, method, body, headers);
    }
}
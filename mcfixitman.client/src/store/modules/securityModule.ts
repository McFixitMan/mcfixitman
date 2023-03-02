import { MemberPayload, MemberTokenPayload } from 'mcfixitman.shared/models/payloads/memberPayload';
import { callApi, callUserAuthApi } from 'src/utility/api';
import { createAction, createReducer } from '@reduxjs/toolkit';

import { HttpMethod } from 'mcfixitman.shared/constants/httpMethod';
import { SecurityState } from 'src/store/state/securityState';
import { createApiThunk } from 'src/types/reduxHelpers';
import { v4 as uuidv4 } from 'uuid';

export const login = createApiThunk<MemberTokenPayload, { email: string, password: string }>('/security/login', async (args, thunkApi) => {
    const response = await callApi<MemberTokenPayload>('/security/login', HttpMethod.POST, {
        email: args.email,
        password: args.password,
    });

    return response.data;
});
export const setIsLogoutRequested = createAction<boolean>('security/requestLogout');
export const logout = createApiThunk<void, void>('security/logout', async (arg, thunkAPI) => {
    await callUserAuthApi('/security/logout', HttpMethod.POST);
});

const refreshTokenPromise = createAction<Promise<MemberTokenPayload>>('/security/refreshTokenPromise');
const refreshComplete = createAction<MemberTokenPayload>('/security/refreshComplete');
export const refreshToken = createApiThunk<MemberTokenPayload, boolean>('/security/refreshToken', (autoLogOut, thunkApi) => {
    const { refreshToken, deviceUUID } = thunkApi.getState().security;

    const promise = callApi<MemberTokenPayload>('/security/refresh', HttpMethod.POST, {
        refreshToken: refreshToken,
        deviceUUID: deviceUUID,
    }).then((response) => {
        thunkApi.dispatch(refreshComplete(response.data));

        return response.data;
    }).catch((err) => {
        if (autoLogOut) {
            thunkApi.dispatch(logout());
        }

        throw (err);
    });

    thunkApi.dispatch(refreshTokenPromise(promise));

    return promise;
});

export const authenticate = createApiThunk<MemberPayload, void>('/security/authenticate', async (_noInput, thunkApi) => {
    const { data } = await callUserAuthApi<MemberPayload>('/security/authenticate');

    return data;
});

const initialState: SecurityState = {
    hasError: false,
    isAuthenticated: false,
    isAuthenticating: false,
    isLoggingOut: false,
    isRefreshingToken: false,
    message: undefined,
    refreshPromise: undefined,
    member: undefined,
    accessToken: undefined,
    refreshToken: undefined,
    deviceUUID: uuidv4(),
};

export const securityReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(login.pending, (state, action) => {
            state.isAuthenticating = true;
            // state.message = '';
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isAuthenticating = false;
            state.hasError = false;
            state.isAuthenticated = true;
            state.isRefreshingToken = false;
            state.member = action.payload.member;
            state.refreshToken = action.payload.refreshToken;
            state.accessToken = action.payload.accessToken;
        })
        .addCase(login.rejected, (state, action) => {
            state.isAuthenticating = false;
            state.isAuthenticated = false;
            state.hasError = true;
            state.isRefreshingToken = false;
            // state.message = action.payload?.response.data.message ?? action?.error?.message;
            state.member = undefined;
            state.accessToken = undefined;
            state.refreshPromise = undefined;
            state.refreshToken = undefined;
        })
        .addCase(refreshTokenPromise, (state, action) => {
            state.refreshPromise = action.payload;
            state.isRefreshingToken = true;
        })
        .addCase(refreshToken.pending, (state, action) => {
            state.isRefreshingToken = true;
            // state.refreshPromise = action.payload;
        })
        .addCase(refreshToken.fulfilled, (state, action) => {
            // state.hasError = false;
            // state.isAuthenticated = true;
            // state.isRefreshingToken = false;
            // state.message = '';
            // state.refreshPromise = undefined;
            // state.adUser = action.payload.adUser;
            // state.accessToken = action.payload.accessToken;
            // state.refreshToken = action.payload.refreshToken;
            // state.isAuthenticating = false;
        })
        .addCase(refreshComplete, (state, action) => {
            state.isRefreshingToken = false;
            state.refreshPromise = undefined;
            state.member = action.payload.member;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticating = false;
            state.isAuthenticated = true;
        })
        .addCase(refreshToken.rejected, (state, action) => {
            if (action.payload?.noResponse === true) {
                // We didn't actually get a response from our API.
                // It turns out its super annoying to log out people if they just can't hit the server, lets let this pass...
                return;
            }
            state.hasError = true;
            state.isAuthenticated = false;
            state.isRefreshingToken = false;
            // state.message = action.payload?.response.data.message ?? action.error.message;
            state.refreshPromise = undefined;
            state.member = undefined;
            state.refreshToken = undefined;
            state.accessToken = undefined;
        })
        .addCase(logout.pending, (state, action) => {
            state.isLoggingOut = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.accessToken = undefined;
            state.member = undefined;
            state.isAuthenticated = false;
            state.isAuthenticating = false;
            state.isLoggingOut = false;
            state.isRefreshingToken = false;
            state.message = undefined;
            state.refreshPromise = undefined;
            state.refreshToken = undefined;
        })
        .addCase(logout.rejected, (state, action) => {
            // Even if the logout call to the server is rejected,
            // we still want to effectively log out in the client!
            state.accessToken = undefined;
            state.member = undefined;
            state.isAuthenticated = false;
            state.isAuthenticating = false;
            state.isLoggingOut = false;
            state.isRefreshingToken = false;
            state.message = undefined;
            state.refreshPromise = undefined;
            state.refreshToken = undefined;
        })
        .addCase(authenticate.pending, (state, action) => {
            state.isAuthenticating = true;
        })
        .addCase(authenticate.fulfilled, (state, action) => {
            state.isAuthenticating = false;
            state.isAuthenticated = true;
            state.member = action.payload.member;
        })
        .addCase(authenticate.rejected, (state, action) => {
            if (action.payload?.noResponse === true) {
                // We didn't actually get a response from our API.
                // It turns out its super annoying to log out people if they just can't hit the server, lets let this pass...
                return;
            }
            state.isAuthenticating = false;
            state.isAuthenticated = false;
            state.member = undefined;
            state.refreshToken = undefined;
            state.accessToken = undefined;
            state.hasError = true;
        });
});
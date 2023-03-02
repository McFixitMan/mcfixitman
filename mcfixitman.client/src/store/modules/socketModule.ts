import { createAction, createReducer } from '@reduxjs/toolkit';

import { SocketState } from 'src/store/state/socketState';

export const connectSocket = createAction<{ token?: string; deviceToken?: string; }>('socket/connect');
export const disconnectSocket = createAction<void>('socket/disconnect');
export const connectionChanged = createAction<boolean>('socket/connectionChanged');
export const connectionError = createAction<string | undefined>('socket/connectionError');

const initialState: SocketState = {
    isConnecting: false,
    isConnected: false,
    hasError: false,
    errorMessage: undefined,
};

export const socketReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(connectSocket, (state, action) => {
            state.isConnecting = true;
            state.isConnected = false;
            state.hasError = false;
            state.errorMessage = undefined;
        })
        .addCase(connectionChanged, (state, action) => {
            state.isConnecting = false;
            state.isConnected = action.payload;
            state.hasError = false;
            state.errorMessage = undefined;
        })
        .addCase(connectionError, (state, action) => {
            state.isConnected = false;
            state.isConnecting = false;
            state.hasError = true;
            state.errorMessage = action.payload;
        });
});
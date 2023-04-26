import { AnyAction, Middleware } from 'redux';
import { chatUpdateInProgressChanged, chatUpdated } from 'src/store/modules/chatModule';
import { connectSocket, connectionChanged, connectionError, disconnectSocket } from 'src/store/modules/socketModule';
import { login, logout, refreshToken } from 'src/store/modules';

import { AppDispatch } from 'src/types/reduxHelpers';
import { AppSocket } from 'src/utility/socket';
import { RootState } from 'src/store/createStore';

export const socketMiddleware: Middleware<Record<string, unknown>, RootState, AppDispatch> = (store) => {
    const appSocket = new AppSocket({
        // Here's where we'll handle the dispatched actions for socket events coming through
        // As new events are added to the ServerToClientEvents type in the shared project, they'll be available to be handled here
        connectionChanged: (isConnected) => {
            store.dispatch(connectionChanged(isConnected));
        },
        connectionFailed: async (message) => {
            store.dispatch(connectionError(message));

            // Our token can expire independently from our socket connection
            // E.g. If a client has been idle long enough for the token to expire, and the connection to the server breaks, reconnect will fail because of the expired token
            // If we failed to connect because of a socket authentication error, try to refresh the token.
            // The result of the refresh will already handle a new connection via the action interceptors below
            if (message?.toLowerCase() === 'socket user authentication error') {
                await store.dispatch(refreshToken(false));
            }
        },

        chatUpdated: (chat) => {
            store.dispatch(chatUpdated(chat));
        },
        chatUpdateInProgressChanged: (isInProgress) => {
            store.dispatch(chatUpdateInProgressChanged(isInProgress));
        },
    });

    return (next) => <A extends AnyAction>(action: A) => {
        if (login.fulfilled.match(action)) {
            // User logged in: Update socket connection
            appSocket.disconnect();
            store.dispatch(connectSocket({
                token: action.payload.accessToken,
            }));
        }

        if (refreshToken.fulfilled.match(action)) {
            // User token was refreshed: Update socket connection
            appSocket.disconnect();
            store.dispatch(connectSocket({
                token: action.payload.accessToken,
            }));
        }

        if (logout.pending.match(action)) {
            // User is logging out: Update socket connection with device auth only
            appSocket.disconnect();
            store.dispatch(connectSocket({
                token: undefined,
            }));
        }

        if (connectSocket.match(action)) {
            appSocket.connect(action.payload.token);
        }

        if (disconnectSocket.match(action)) {
            appSocket.disconnect();
        }

        /**
         * Client socket actions can be handled below
         */


        return next(action);
    };
};
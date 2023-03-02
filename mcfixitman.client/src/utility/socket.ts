import { ClientToServerEvents, ServerToClientEvents } from 'mcfixitman.shared/types/socketEvents';
import { Socket, io } from 'socket.io-client';

import { config } from 'src/config';
import { convertDates } from 'mcfixitman.shared/utility/objectHelpers';

interface SocketHandlers extends Partial<ServerToClientEvents> {
    // Special client-side events can go here, otherwise we're already extending the ServerToClientEvents type to make all events coming
    // from the server available to be configured for the AppSocket
    connectionChanged?: (isConnected: boolean) => void;
    connectionFailed?: (message?: string) => void;
}

export class AppSocket {
    private socketHandlers: SocketHandlers;
    public socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;

    constructor(socketHandlers: SocketHandlers) {
        this.socketHandlers = socketHandlers;
    }

    public connect = (token: string | undefined): void => {
        this.socket = io(config.socketIoUrl, {
            path: '/sockets',
            auth: {
                token: token ?? '',
            },
            autoConnect: false,
        });

        // Separate 
        const { connectionChanged, connectionFailed, ...serverSocketHandlers } = this.socketHandlers;

        this.socket.on('connect', () => {
            connectionChanged?.(true);
        });
        this.socket.on('disconnect', () => {
            connectionChanged?.(false);
        });
        this.socket.on('connect_error', (err) => {
            connectionFailed?.(err.message);
        });

        // Handle all of the SocketHandlers configured for the AppSocket dynamically
        for (const key in serverSocketHandlers) {

            (this.socket as Socket).on(key, (payload) => {
                convertDates(payload);

                // You'd think typescript would know that when we're iterating the keys of an object, the keys of that object will be a key of that object.
                // Think again, I guess. 
                serverSocketHandlers[key as keyof typeof serverSocketHandlers]?.(payload);
            });
        }

        // Connect the socket
        this.socket.connect();
    };

    public disconnect = (): void => {
        this.socket?.close();
    };
}
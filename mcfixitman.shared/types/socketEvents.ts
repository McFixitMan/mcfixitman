
export interface ServerToClientEvents {
    // Socket events from server to client
    exampleServerToClient: (message: string) => void;
}

export interface ClientToServerEvents {
    // Socket events from client to server
    exampleClientToServer: (message: string) => void;
}
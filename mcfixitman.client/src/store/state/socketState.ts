
export interface SocketState {
    readonly isConnecting: boolean;
    readonly isConnected: boolean;
    readonly hasError: boolean;
    readonly errorMessage?: string;
}
import { Chat } from '../models/dataModels/chat';

export interface ServerToClientEvents {
    // Socket events from server to client
    chatUpdated: (chat: Chat) => void;
    chatUpdateInProgressChanged: (inProgress: boolean) => void;
}

export interface ClientToServerEvents {
    // Socket events from client to server

}
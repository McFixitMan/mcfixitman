import { ClientToServerEvents, ServerToClientEvents } from 'mcfixitman.shared/types/socketEvents';

import { Chat } from 'mcfixitman.shared/models/dataModels/chat';
import { Server } from 'socket.io';

export type SocketServer = Server<ClientToServerEvents, ServerToClientEvents>;

export const getMemberRoom = (memberId: number): string => {
    return `Member:${memberId}`;
};

export interface SocketMessages {
    sendChatUpdatedMessage: (memberId: number, chat: Chat) => void;
    sendChatUpdateInProgressChangedMessage: (memberId: number, isInProgress: boolean) => void;
}

export const getMessageHelper = (io?: SocketServer): SocketMessages => {
    return {
        sendChatUpdatedMessage: (memberId, chat) => {
            io?.to(getMemberRoom(memberId))
                .emit('chatUpdated', chat);
        },
        sendChatUpdateInProgressChangedMessage: (memberId, isInProgress) => {
            io?.to(getMemberRoom(memberId))
                .emit('chatUpdateInProgressChanged', isInProgress);
        },
    };
};
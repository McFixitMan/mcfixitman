import { Chat } from './chat';
import { ChatRole } from '../../types/chatRole';
import { PartialBy } from '../../types/utilityTypes';

export interface ChatMessage {
    id: number;
    chatId: number;
    messageContent: string;
    role: ChatRole;
    createdAt: Date;
    updatedAt?: Date | null;

    chat?: Chat;
}

export interface ChatMessageDraft extends PartialBy<ChatMessage, 'id' | 'createdAt'> { }
import { ChatMessage } from './chatMessage';
import { Member } from './member';
import { PartialBy } from '../../types/utilityTypes';

export interface Chat {
    id: number;
    memberId: number;
    createdAt: Date;
    updatedAt?: Date | null;

    member?: Member;
    chatMessages?: Array<ChatMessage>;
}

export interface ChatDraft extends PartialBy<Chat, 'id' | 'createdAt'> { }
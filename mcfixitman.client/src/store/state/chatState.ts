import { Chat } from 'mcfixitman.shared/models/dataModels/chat';

export interface ChatState {
    isLoading: boolean;
    isUpdateInProgress: boolean;
    chat?: Chat;
}
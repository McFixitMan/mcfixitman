import { Chat } from 'mcfixitman.shared/models/dataModels/chat';

export interface AiUtility {
    createChatCompletion: (chat: Chat) => Promise<string>;
    createCompletion: (prompt: string) => Promise<string>;
    createEdit: (prompt: string, instruction: string) => Promise<string>;
    createImageUri: (prompt: string) => Promise<string>;
}
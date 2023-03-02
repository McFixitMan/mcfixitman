
export interface AiUtility {
    createCompletion: (prompt: string) => Promise<string>;
    createEdit: (prompt: string, instruction: string) => Promise<string>;
    createImageUri: (prompt: string) => Promise<string>;
}

export interface AiState {
    isLoading: boolean;
    prompts: Array<{ prompt: string; sentAt: Date; isError: boolean; messageType: 'prompt'; }>;
    completions: Array<{ completion: string; sentAt: Date; isError: boolean; messageType: 'completion'; }>;
    lastImageUri?: string;
    lastImagePrompt?: string;
}
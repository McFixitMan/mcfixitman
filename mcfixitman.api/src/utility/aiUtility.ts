import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

import { AiUtility } from 'src/types/aiUtility';
import { Chat } from 'mcfixitman.shared/models/dataModels/chat';
import { config } from 'src/config';

let aiUtility: AiUtility | undefined;

export const getAiUtility = (): AiUtility => {
    if (!aiUtility) {
        const configuration = new Configuration({
            organization: config.openAi.organization,
            apiKey: config.openAi.apiKey,
        });

        const openAi = new OpenAIApi(configuration);

        const createChatCompletion = async (chat: Chat): Promise<string> => {
            try {
                if (!chat.chatMessages || chat.chatMessages.length === 0) {
                    return 'Nooo';
                }

                const previousChatMessages: Array<ChatCompletionRequestMessage> = chat.chatMessages.map((chatMessage) => {
                    return {
                        content: chatMessage.messageContent,
                        role: chatMessage.role,
                    };
                });

                const { data } = await openAi.createChatCompletion({
                    model: config.openAi.model,
                    messages: previousChatMessages,
                    temperature: 1,
                    max_tokens: config.openAi.maxTokens,
                });

                if (data.choices.length > 0) {
                    let chosenCompletion = data.choices[0].message?.content ?? '';

                    while (chosenCompletion.charAt(0) === '\n') {
                        // Remove leading newline characters
                        chosenCompletion = chosenCompletion.substring(1);
                    }

                    return chosenCompletion ?? '[No text provided by the AI]';
                }

                return '[No choices were provided by the AI]';
            } catch (err) {
                return `[Something went wrong]`;
            }
        };

        const createCompletion = async (prompt: string): Promise<string> => {
            try {
                const { data } = await openAi.createCompletion({
                    // model: 'text-ada-001',
                    model: 'gpt-3.5-turbo',
                    prompt: prompt,
                    temperature: 0.2,
                    max_tokens: 4096,
                });

                if (data.choices.length > 0) {
                    let chosenCompletion = data.choices[0].text ?? '';

                    while (chosenCompletion.charAt(0) === '\n') {
                        // Remove leading newline characters
                        chosenCompletion = chosenCompletion.substring(1);
                    }

                    return chosenCompletion ?? '[No text provided by the AI]';
                }

                return '[No choices were provided by the AI]';
            } catch (err) {
                return `[Something went wrong]`;
            }
        };

        const createEdit = async (input: string, instruction: string): Promise<string> => {
            try {
                const { data } = await openAi.createEdit({
                    model: 'text-davinci-003',
                    instruction: instruction,
                    input: input,
                    temperature: 0,
                });

                if (data.choices.length > 0) {
                    const chosenEdit = data.choices[0];

                    return chosenEdit.text ?? '[No text provided by the AI]';
                }

                return '[No choices were provided by the AI]';
            } catch (err) {
                return `[Something went wrong]`;
            }
        };

        const createImageUri = async (prompt: string): Promise<string> => {
            try {
                const { data } = await openAi.createImage({
                    prompt: prompt,
                    size: '512x512',
                    response_format: 'url',
                    n: 1,
                });

                if (data.data.length > 0) {
                    const createdImageUrl = data.data[0];

                    return createdImageUrl.url ?? '[No url provided by the AI]';
                }

                return '[No data was generated]';
            } catch (err) {
                return `[Something went wrong]`;
            }
        };

        aiUtility = {
            createChatCompletion: createChatCompletion,
            createCompletion: createCompletion,
            createEdit: createEdit,
            createImageUri: createImageUri,
        };
    }

    return aiUtility;
};
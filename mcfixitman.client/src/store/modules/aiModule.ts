import { createAction, createReducer } from '@reduxjs/toolkit';

import { AiState } from 'src/store/state/aiState';
import { HttpMethod } from 'mcfixitman.shared/constants/httpMethod';
import { callUserAuthApi } from 'src/utility/api';
import { createApiThunk } from 'src/types/reduxHelpers';

export const createCompletion = createApiThunk<{ response: string }, string>('/ai/createCompletion', async (prompt, thunkApi) => {
    const response = await callUserAuthApi<{ response: string }>('/ai/createCompletion', HttpMethod.POST, {
        prompt: prompt,
    });

    return response.data;
});

export const clearChatHistory = createAction<void>('/ai/clearChatHistory');

export const createImage = createApiThunk<{ response: string }, string>('/ai/createImage', async (prompt, thunkApi) => {
    const response = await callUserAuthApi<{ response: string }>('/ai/createImage', HttpMethod.POST, {
        prompt: prompt,
    });

    return response.data;
});

export const clearImageHistory = createAction<void>('/ai/clearImageHistory');

const initialState: AiState = {
    isLoading: false,
    completions: [],
    prompts: [],
    lastImagePrompt: undefined,
    lastImageUri: undefined,
};

export const aiReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(createCompletion.pending, (state, action) => {
            state.isLoading = true;
            state.prompts = [
                ...state.prompts,
                {
                    prompt: action.meta.arg,
                    isError: false,
                    sentAt: new Date(),
                    messageType: 'prompt',
                }];
        })
        .addCase(createCompletion.fulfilled, (state, action) => {
            state.isLoading = false;
            state.completions = [
                ...state.completions,
                {
                    completion: action.payload.response,
                    isError: false,
                    sentAt: new Date(),
                    messageType: 'completion',
                },
            ];
        })
        .addCase(createCompletion.rejected, (state, action) => {
            state.isLoading = false;
        })
        .addCase(createImage.pending, (state, action) => {
            state.isLoading = true;
            state.lastImagePrompt = action.meta.arg;
            state.lastImageUri = undefined;
        })
        .addCase(createImage.fulfilled, (state, action) => {
            state.isLoading = false;
            state.lastImageUri = action.payload.response;
        })
        .addCase(createImage.rejected, (state, action) => {
            state.isLoading = false;
            state.lastImageUri = undefined;
        })
        .addCase(clearChatHistory, (state, action) => {
            state.completions = [];
            state.prompts = [];
        })
        .addCase(clearImageHistory, (state, action) => {
            state.lastImagePrompt = undefined;
            state.lastImageUri = undefined;
        });
});
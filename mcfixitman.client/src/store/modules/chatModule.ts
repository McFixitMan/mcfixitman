import { createAction, createReducer } from '@reduxjs/toolkit';

import { Chat } from 'mcfixitman.shared/models/dataModels/chat';
import { ChatMessageDraft } from 'mcfixitman.shared/models/dataModels/chatMessage';
import { ChatState } from 'src/store/state/chatState';
import { HttpMethod } from 'mcfixitman.shared/constants/httpMethod';
import { callUserAuthApi } from 'src/utility/api';
import { createApiThunk } from 'src/types/reduxHelpers';

export const createChat = createApiThunk<{ chat: Chat }>('chat/createChat', async () => {
    const response = await callUserAuthApi<{ chat: Chat }>('/chat/', HttpMethod.POST);

    return response.data;
});

export const getLatestChat = createApiThunk<{ chat: Chat | undefined }>('chat/getLatestChat', async () => {
    const response = await callUserAuthApi<{ chat: Chat | undefined }>('/chat/');

    return response.data;
});

export const addChatMessage = createApiThunk<{ chat: Chat }, ChatMessageDraft>('chat/addChatMessage', async (chatMessage) => {
    const response = await callUserAuthApi<{ chat: Chat }>('/chat/chatMessage/', HttpMethod.POST, {
        newChatMessage: chatMessage,
    });

    return response.data;
});

export const clearChatHistory = createApiThunk<{ chat: Chat }>('chat/clearChatHistory', async () => {
    const response = await callUserAuthApi<{ chat: Chat }>('/chat/clearHistory', HttpMethod.POST);

    return response.data;
});

export const chatUpdated = createAction<Chat>('chat/chatUpdated');
export const chatUpdateInProgressChanged = createAction<boolean>('chat/chatUpdateInProgressChanged');

const initialState: ChatState = {
    isLoading: false,
    isUpdateInProgress: false,
    chat: undefined,
};

export const chatReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(createChat.fulfilled, (state, action) => {
            state.chat = action.payload.chat;
        })
        .addCase(getLatestChat.fulfilled, (state, action) => {
            state.chat = action.payload.chat;
        })
        .addCase(addChatMessage.fulfilled, (state, action) => {
            state.chat = action.payload.chat;
        })
        .addCase(clearChatHistory.fulfilled, (state, action) => {
            state.chat = action.payload.chat;
        })
        .addCase(chatUpdated, (state, action) => {
            state.chat = action.payload;
        })
        .addCase(chatUpdateInProgressChanged, (state, action) => {
            state.isUpdateInProgress = action.payload;
        });
});
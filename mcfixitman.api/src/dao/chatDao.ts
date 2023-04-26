import { ChatScopes, Chats } from 'src/models/dataModels/chat';
import { Op, Transaction } from 'sequelize';

import { Chat } from 'mcfixitman.shared/models/dataModels/chat';
import { ChatMessageDraft } from 'mcfixitman.shared/models/dataModels/chatMessage';
import { ChatMessages } from 'src/models/dataModels/chatMessage';
import { FailedResponseError } from 'src/types/errors';
import { HttpStatusCode } from 'axios';
import { nameof } from 'ts-simple-nameof';

const initialContext = 'You are McFixitBOT, a sassy, sarcastic, but helpful AI';

export const createChat = async (params: { memberId: number; transaction?: Transaction }): Promise<Chat> => {
    const chat = await Chats
        .scope([
            ChatScopes.includeChatMessages,
        ])
        .create({
            memberId: params.memberId,
        }, {
            transaction: params.transaction,
        });

    // Create initial system message with context
    await ChatMessages.create({
        chatId: chat.id,
        messageContent: initialContext,
        role: 'system',
    }, {
        transaction: params.transaction,
    });

    await chat.reload({
        transaction: params.transaction,
    });

    return chat.get();
};

export const getLatestChatByMemberId = async (params: { memberId: number; transaction?: Transaction }): Promise<Chat | undefined> => {
    const chat = await Chats
        .scope([
            ChatScopes.byMemberId(params.memberId),
            ChatScopes.includeChatMessages,
        ])
        .findOne({
            order: [[nameof<Chat>(x => x.createdAt), 'DESC']],
            transaction: params.transaction,
        });

    return chat?.get();
};

export const addChatMessageToChat = async (params: { chatId: number; chatMessage: ChatMessageDraft; transaction?: Transaction }): Promise<Chat> => {
    const chat = await Chats
        .scope([
            ChatScopes.byId(params.chatId),
            ChatScopes.includeChatMessages,
        ])
        .findOne({
            transaction: params.transaction,
        });

    if (!chat) {
        throw new FailedResponseError({
            status: HttpStatusCode.NotFound,
            defaultMessage: 'Chat not found',
            key: 'Chat.chat_not_found',
            loggedMessage: `Unable to add chat message to chat: Chat with ID ${params.chatId} not found`,
        });
    }

    await ChatMessages.create({
        chatId: params.chatId,
        messageContent: params.chatMessage.messageContent,
        role: params.chatMessage.role,
    }, {
        transaction: params.transaction,
    });

    await chat.reload({
        transaction: params.transaction,
    });

    return chat.get();
};

export const clearChatHistory = async (params: { memberId: number; transaction?: Transaction }): Promise<Chat> => {
    const chat = await Chats
        .scope([
            ChatScopes.byMemberId(params.memberId),
            ChatScopes.includeChatMessages,
        ])
        .findOne({
            order: [[nameof<Chat>(x => x.createdAt), 'DESC']],
            transaction: params.transaction,
        });

    if (!chat) {
        throw new FailedResponseError({
            status: HttpStatusCode.NotFound,
            defaultMessage: 'Chat not found',
            key: 'Chat.chat_not_found',
            loggedMessage: `Unable to clear chat history: Chat with MemberID ${params.memberId} not found`,
        });
    }

    const initialContextMessage = chat.chatMessages?.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        ?.find((msg) => msg.role === 'system');

    await ChatMessages
        .destroy({
            where: {
                chatId: chat.id,
                id: {
                    [Op.ne]: initialContextMessage?.id,
                },
            },
        });

    await chat.reload({
        transaction: params.transaction,
    });

    return chat.get();
};
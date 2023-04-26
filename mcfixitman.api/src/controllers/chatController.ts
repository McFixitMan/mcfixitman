import * as chatDao from 'src/dao/chatDao';

import { Chat } from 'mcfixitman.shared/models/dataModels/chat';
import { ChatMessageDraft } from 'mcfixitman.shared/models/dataModels/chatMessage';
import { ControllerAction } from 'src/types/controllerAction';
import { HttpStatusCode } from 'axios';

class ChatController {
    createChat: ControllerAction<{ chat: Chat }> = async (req, res, next) => {
        if (!req.member) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send({
                    isError: true,
                    defaultMessage: 'Unauthorized',
                    key: 'Common.unauthorized',
                });
        }

        try {
            const chat = await chatDao.createChat({
                memberId: req.member.id,
            });

            res.socketMessageHelper?.sendChatUpdatedMessage(req.member.id, chat);

            return res
                .status(HttpStatusCode.Ok)
                .send({ chat: chat });
        } catch (err) {

        }
    };

    getLatestChat: ControllerAction<{ chat: Chat | undefined }> = async (req, res, next) => {
        if (!req.member) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send({
                    isError: true,
                    defaultMessage: 'Unauthorized',
                    key: 'Common.unauthorized',
                });
        }

        try {
            const chat = await chatDao.getLatestChatByMemberId({
                memberId: req.member.id,
            });

            return res
                .status(HttpStatusCode.Ok)
                .send({
                    chat: chat,
                });
        } catch (err) {
            return next(err);
        }
    };

    addChatMessage: ControllerAction<{ chat: Chat }, { newChatMessage: ChatMessageDraft }> = async (req, res, next) => {
        if (!req.member) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send({
                    isError: true,
                    defaultMessage: 'Unauthorized',
                    key: 'Common.unauthorized',
                });
        }

        if (!req.body.newChatMessage) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send({
                    isError: true,
                    key: 'Common.missing_required_parameters',
                    defaultMessage: 'Missing required parameters',
                });
        }

        try {
            res.socketMessageHelper?.sendChatUpdateInProgressChangedMessage(req.member.id, true);

            const chat = await chatDao.getLatestChatByMemberId({
                memberId: req.member.id,
            });

            if (!chat) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send({
                        isError: true,
                        defaultMessage: 'Chat not found',
                        key: 'Chat.chat_not_found',
                    });
            }

            const updatedChat = await chatDao.addChatMessageToChat({
                chatId: chat.id,
                chatMessage: {
                    ...req.body.newChatMessage,
                    role: 'user',
                },
            });

            const aiResponse = await req.aiUtility?.createChatCompletion(updatedChat) ?? '';

            const finalChat = await chatDao.addChatMessageToChat({
                chatId: chat.id,
                chatMessage: {
                    chatId: chat.id,
                    messageContent: aiResponse,
                    role: 'assistant',
                },
            });

            res.socketMessageHelper?.sendChatUpdatedMessage(req.member.id, finalChat);
            res.socketMessageHelper?.sendChatUpdateInProgressChangedMessage(req.member.id, false);

            return res
                .status(HttpStatusCode.Ok)
                .send({ chat: finalChat });

        } catch (err) {
            return next(err);
        }
    };

    clearChatHistory: ControllerAction<{ chat: Chat }> = async (req, res, next) => {
        if (!req.member) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send({
                    isError: true,
                    defaultMessage: 'Unauthorized',
                    key: 'Common.unauthorized',
                });
        }

        const chat = await chatDao.clearChatHistory({
            memberId: req.member.id,
        });

        res.socketMessageHelper?.sendChatUpdatedMessage(req.member.id, chat);

        return res
            .status(HttpStatusCode.Ok)
            .send({ chat: chat });
    };
}

const chatController = new ChatController();

export { chatController };
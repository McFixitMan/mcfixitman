import { AppRouter } from 'src/routers';
import { authorize } from 'src/routers/middleware';
import { chatController } from 'src/controllers/chatController';

let chatRouter: AppRouter | undefined;

export const getChatRouter = (): AppRouter => {
    if (!chatRouter) {
        chatRouter = new AppRouter('chat');

        chatRouter.router.get('/', authorize(), chatController.getLatestChat);

        chatRouter.router.post('/', authorize(), chatController.createChat);
        chatRouter.router.post('/chatMessage/', authorize(), chatController.addChatMessage);

        chatRouter.router.post('/clearHistory/', authorize(), chatController.clearChatHistory);
    }

    return chatRouter;
};
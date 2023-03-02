import { AppRouter } from 'src/routers';
import { aiController } from 'src/controllers/aiController';
import { authorize } from 'src/routers/middleware';

let aiRouter: AppRouter | undefined;

export const getAiRouter = (): AppRouter => {
    if (!aiRouter) {
        aiRouter = new AppRouter('ai');

        aiRouter.router.post('/createCompletion', authorize(), aiController.createCompletion);
        aiRouter.router.post('/createImage', authorize(), aiController.createImageUri);
    }

    return aiRouter;
};
import { AppRouter } from 'src/routers';
import { securityController } from 'src/controllers/securityController';

let securityRouter: AppRouter | undefined;

export const getSecurityRouter = (): AppRouter => {
    if (!securityRouter) {
        securityRouter = new AppRouter('security');

        // GET Routes
        securityRouter.router.get('/authenticate', securityController.authenticate);
        // POST Routes
        securityRouter.router.post('/login', securityController.login);
        securityRouter.router.post('/refresh', securityController.refreshToken);
        securityRouter.router.post('/logout', securityController.logout);
    }

    return securityRouter;
};



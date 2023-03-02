import { Router } from 'express';
import { config } from 'src/config';

export * from 'src/routers/securityRouter';

// export type AppRouter = Router & { basePath: string } 
// export interface AppRouter extends Router {
//     basePath: string;
// }
export class AppRouter {
    router: Router;
    path: string;

    private getPath(path: string): string {
        let input = path;

        if (!input.startsWith('/')) {
            input = `/${input}`;
        }

        return `${config.baseRoutePath}${input}`;
    }

    constructor(basePath: string) {
        this.router = Router();
        this.path = this.getPath(basePath);
    }
}
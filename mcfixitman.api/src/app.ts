import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';
import * as path from 'path';
import * as socketUtility from 'src/utility/socketUtility';

import { ClientToServerEvents, ServerToClientEvents } from 'mcfixitman.shared/types/socketEvents';

import { FailedResponse } from 'mcfixitman.shared/types/responses';
import { FailedResponseError } from 'src/types/errors';
import { HttpStatusCode } from 'mcfixitman.shared/constants/httpStatusCode';
import { Server as SocketIoServer } from 'socket.io';
import { SocketServer } from 'src/utility/socketUtility';
import { config } from 'src/config';
import { getAiRouter } from 'src/routers/aiRouter';
import { getAiUtility } from 'src/utility/aiUtility';
import { getMemberFromAccessToken } from 'src/utility/tokenUtility';
import {
    getSecurityRouter,
} from 'src/routers/securityRouter';
import { logErrors } from 'src/utility/logErrors';

const DEFAULT_PORT: number = 3000;

class App {
    express: express.Application;
    io: SocketServer | undefined;
    private server: http.Server | undefined;
    private port: number | undefined;

    constructor() {
        this.express = express();

        // The order these are called can be important!!
        this.addExpressMiddleware();
        this.addServeStaticMiddleware();

        this.config();
        this.createHttpServer();
        this.createSocketServer();
        this.configIO();

        this.addDeviceInfoMiddleware();
        this.addVerifyTokenMiddleware();
        this.addAuthenticationMiddleware();
        this.addAiUtilityMiddleware();
        this.addRoutersMiddleware();
        this.addNotFoundMiddleware();
        this.addErrorHandlingMiddleware();

        this.listen();
        this.handleExceptions();
    }

    static bootstrap = (): App => {
        return new App();
    };

    /**
     * General express middleware
     */
    private addExpressMiddleware = (): void => {
        this.express.use(cors({
            origin: [
                'http://localhost:3000',
                'https://mcfixitman.com',
            ],
        }));
        this.express.use(logger('dev'));

        this.express.use(express.json({ limit: '50mb' }));
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.static(path.join(__dirname, 'public')));
    };

    /**
     * Serve static files, i.e. the webclient and/or api documentation
     */
    private addServeStaticMiddleware(): void {
        this.express.use(process.env.BASE_CLIENT_PATH || '/client', express.static(path.join(__dirname, 'client')));
        this.express.use(process.env.BASE_CLIENT_PATH || '/client', (req, res) => {
            const filePath = path.join(__dirname, 'client/index.html');
            res.sendFile(filePath);
        });

        this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            // redirect root to client app
            if (req.url.replace(/^([^/]*)\/?$/, '$1') === (process.env.ROOT_PATH || '')) {
                res.redirect(process.env.BASE_CLIENT_PATH || '/');
                return;
            }
            // always resolve service worker
            if (req.url.endsWith('/service-worker.js')) {
                const url = path.join(
                    config.clientPath || path.join(__dirname, ''),
                    'service-worker.js',
                );

                res.sendFile(path.resolve(url));
                return;
            }
            next();
        });
    }

    private addDeviceInfoMiddleware(): void {
        this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.deviceUUID = req.headers['device-uuid'] as string;

            return next();
        });
    }

    /**
     * Middleware to verify access token provided and assign a value to req.member
     * 
     * This must be called before the {@link addRoutersMiddleware}
     */
    private addVerifyTokenMiddleware = (): void => {
        this.express.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

            // check header or url parameters or post parameters for token
            const authToken: string = req.body.token || req.query.token || req.headers.authorization;

            try {
                const member = await getMemberFromAccessToken(authToken);

                req.member = member;
            } catch (err) {
                // Ignored
            } finally {
                return next();
            }
        });
    };

    /**
     * Middleware to block any requests aside from the allowedPaths without being authenticated either with
     * an admin adUser account, or a logged in deviceConfig
     * 
     * This must be called before the {@link addRoutersMiddleware}
     */
    private addAuthenticationMiddleware = (): void => {
        this.express.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // Entries in allowedPaths are able to bypass authentication.
            // Don't add routes here unless you're absolutely certain they shouldn't have authentication!!
            // Note: This will not override any additional authentication/authorization performed in router middleware
            const allowedPaths: Array<string> = [
                `${getSecurityRouter().path}/login`,
                `${getSecurityRouter().path}/refresh`,
            ];

            try {
                if (!req.member) {
                    // We dont have a deviceConfig or adUser, which means neither auth method is valid...
                    if (!allowedPaths.includes(req.path)) {
                        // ...and we're not accessing one of the allowedRoles. Block the request
                        return res
                            .status(HttpStatusCode.UNAUTHORIZED)
                            .send({
                                isError: true,
                                key: 'Common.unauthorized',
                                defaultMessage: 'Unauthorized',
                            });
                    }
                }
            } catch (err) {
                return next(err);
            }

            return next();
        });
    };

    private addAiUtilityMiddleware = (): void => {
        this.express.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const aiUtility = getAiUtility();

            req.aiUtility = aiUtility;

            return next();
        });
    };

    /**
     * Handle the available routes for the API
     */
    private addRoutersMiddleware = (): void => {
        this.express.use(getSecurityRouter().path, getSecurityRouter().router);
        this.express.use(getAiRouter().path, getAiRouter().router);
    };

    /**
     * Log unexpected errors and return the error to the client
     */
    private addErrorHandlingMiddleware = (): void => {
        // Log errors
        this.express.use(logErrors);

        // return error to user
        this.express.use((err: Error | FailedResponseError, req: express.Request, res: express.Response<FailedResponse>, next: express.NextFunction) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(err.stack);
            }

            if (err instanceof FailedResponseError) {
                return res
                    .status(err.status)
                    .send({
                        isError: true,
                        key: err.key,
                        defaultMessage: err.defaultMessage,
                    });
            } else {
                return res
                    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .send({
                        isError: true,
                        key: 'Common.unexpected_error',
                        defaultMessage: 'An unexpected error occurred',
                    });
            }
        });
    };

    /**
     * Middleware to handle a request that hasn't been caught by any of the other middleware
     * 
     * Should be called last in the chain of middlewares
     */
    private addNotFoundMiddleware = (): void => {
        this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err = new FailedResponseError({
                key: 'Common.resource_not_found',
                defaultMessage: 'The requested resource was not found',
                loggedMessage: `Resource requested at ${req.path} was not found`,
                status: HttpStatusCode.NOT_FOUND,
            });

            return next(err);
        });
    };

    /**
     * Configure the server
     */
    private config = (): void => {
        this.port = config.port || DEFAULT_PORT;
    };

    /**
     * Create the http express server
     */
    private createHttpServer = (): http.Server => {
        this.server = http.createServer(this.express);

        return this.server;
    };

    private createSocketServer = (): SocketServer => {
        this.io = new SocketIoServer<ClientToServerEvents, ServerToClientEvents>(this.server, {
            path: '/sockets',
            cors: {
                origin: config.clientUrl,
                methods: ['GET', 'POST'],
            },
        });

        return this.io;
    };

    private configIO = (): void => {
        let io = this.io;

        if (!io) {
            io = this.createSocketServer();
        }

        // Add our socket server to the response object so that we can access it easily from our controllers
        this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.io = io;
            res.socketMessageHelper = socketUtility.getMessageHelper(io);

            return next();
        });

        // The following middleware is to get the member object from the auth token if it exists
        // Note: This will only block the flow if a token is provided but is invalid
        io.use(async (socket, next) => {
            if (!!socket.handshake.auth && !!socket.handshake.auth.token) {
                try {
                    const member = await getMemberFromAccessToken(socket.handshake.auth.token as string);

                    socket.member = member;

                    return next();
                } catch (err) {
                    return next(new Error('Socket user authentication error'));
                }
            } else {
                return next();
            }
        });

        // The following middleware is where we'll block requests if we're missing authentication.
        // If the socket doesn't have a member object, that means it hasn't been authorized and we'll break the middleware flow here
        // Otherwise, we move on
        io.use(async (socket, next) => {
            if (!socket.member) {
                // ...but we dont have one.
                return next(new Error('Authentication required for socket connection'));
            } else {
                return next();
            }
        });

        io.on('connection', (socket) => {
            // Subscriptions are managed here
            socket.on('exampleClientToServer', (message) => {
                console.log(message);
            });

            socket.on('disconnect', () => {
                // Disconnected
            });

            if (socket.connected) {
                // Connected
            }
        });
    };

    /**
     * Starts listening on configured port
     */
    private listen = (): void => {
        let server = this.server;

        if (!server) {
            server = this.createHttpServer();
        }

        server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        // startDiscordClient();
    };

    /**
     * Handles unhandled exceptions
     */
    private handleExceptions = (): void => {
        (process as NodeJS.EventEmitter).on('uncaughtException', (err: { code: string; message: string }) => {
            if (err.code === 'ECONNRESET') {
                console.log(err.message);
            } else {
                console.log(err);
            }
        });

        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        });
    };
}

const server: App = App.bootstrap();

export default server.express;

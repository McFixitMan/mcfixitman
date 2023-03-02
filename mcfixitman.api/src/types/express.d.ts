
import * as express from 'express'; // eslint-disable-line
import { ClientToServerEvents, ServerToClientEvents } from 'mcfixitman.shared/types/socketEvents';
import { AiUtility } from 'src/types/aiUtility';
import { Member } from 'mcfixitman.shared/models/dataModels/member';
import { SocketMessages } from 'src/utility/socketUtility';
import { Server as SocketServer } from 'socket.io';

declare module 'express' {
    // eslint-disable-next-line
    interface Request {
        member?: Member;
        deviceUUID?: string;
        aiUtility?: AiUtility;
    }

    interface Response {
        io?: SocketServer<ClientToServerEvents, ServerToClientEvents>;
        socketMessageHelper?: SocketMessages;
    }
}

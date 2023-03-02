import { Member } from 'mcfixitman.shared/models/dataModels/member';

declare module 'socket.io' {
    interface Socket {
        member?: Member;
    }
}
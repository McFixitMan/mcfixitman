import { HttpStatusCode } from 'mcfixitman.shared/constants/httpStatusCode';

export class FailedResponseError extends Error {
    status: number;
    defaultMessage: string;
    loggedMessage: string;
    key: string;

    constructor(params: { key: string, defaultMessage: string, loggedMessage?: string, status?: number }) {
        super(params.loggedMessage ?? params.defaultMessage);

        this.status = params.status ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
        this.defaultMessage = params.defaultMessage;
        this.loggedMessage = params.loggedMessage ?? params.defaultMessage;
        this.key = params.key;
    }
}
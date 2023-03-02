import { Member } from 'mcfixitman.shared/models/dataModels/member';
import { MemberTokenPayload } from 'mcfixitman.shared/models/payloads/memberPayload';

export interface SecurityState {
    readonly hasError: boolean;
    readonly isAuthenticated: boolean;
    readonly isAuthenticating: boolean;
    readonly isLoggingOut: boolean;
    readonly isRefreshingToken: boolean;
    readonly message?: string;
    readonly refreshPromise?: Promise<MemberTokenPayload>;
    readonly member?: Member;
    readonly accessToken?: string;
    readonly refreshToken?: string;
    readonly deviceUUID?: string;
}
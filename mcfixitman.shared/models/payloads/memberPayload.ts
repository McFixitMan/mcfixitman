import { ApiResult } from './apiResult';
import { Member } from '../dataModels/member';
import { PartialBy } from '../../types/utilityTypes';

export interface MemberPayload extends PartialBy<ApiResult, 'response'> {
    member?: Member;
}

export interface MemberTokenPayload extends MemberPayload {
    accessToken?: string;
    refreshToken?: string;
}
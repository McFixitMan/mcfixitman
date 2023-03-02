import { FailedResponse } from '../../types/responses';

export interface ApiResult {
    error?: boolean;
    response: {
        data: FailedResponse;
    };
}
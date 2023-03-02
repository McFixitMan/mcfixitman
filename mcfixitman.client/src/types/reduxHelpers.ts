import { AsyncThunk, AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AnyAction } from 'redux';
import { ApiResult } from 'mcfixitman.shared/models/payloads/apiResult';
import { FailedResponse } from 'mcfixitman.shared/types/responses';
import { RootState } from 'src/store/createStore';

type ApiRejectValue = FailedResponse & { noResponse?: boolean };

export interface ThunkAPIConfig {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ApiRejectValue;
}

export const createApiThunk = <ReturnType, InputType = unknown>(
    type: string,
    thunk: AsyncThunkPayloadCreator<ReturnType, InputType, ThunkAPIConfig>,
): AsyncThunk<ReturnType, InputType, ThunkAPIConfig> => {
    return createAsyncThunk<ReturnType, InputType, ThunkAPIConfig>(
        type,
        // TODO: For the life of me I can't figure out why this won't accept a better type given that we know the ReturnType and the ApiRejectValue type
        // But it seems to be working fine so here we are...
        async (arg, thunkAPI): Promise<any> => {
            try {
                // do some stuff here that happens on every action
                return await thunk(arg, thunkAPI);
            } catch (err) {
                const apiResult = err as ApiResult;

                if (!!apiResult?.response?.data) {
                    return thunkAPI.rejectWithValue(apiResult.response.data);
                }
                // do some stuff here that happens on every error
                return thunkAPI.rejectWithValue({
                    key: 'Common.unexpected_error',
                    defaultMessage: 'An unexpected error occurred',
                    isError: true,
                    noResponse: true,
                });
            }
        },
    );
};

export type AppThunkAction<R> = ThunkAction<R, RootState, undefined, AnyAction>;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
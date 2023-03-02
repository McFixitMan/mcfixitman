import { createAction, createReducer } from '@reduxjs/toolkit';

import { ServiceWorkerState } from 'src/store/state/serviceWorkerState';

export const updateServiceWorker = createAction<void>('serviceWorker/update');

const initialState: ServiceWorkerState = {
    isServiceWorkerUpdated: false,
};

export const serviceWorkerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(updateServiceWorker, (state, action) => {
            state.isServiceWorkerUpdated = true;
        });
});
import { createAction, createReducer } from '@reduxjs/toolkit';

import { AppDrawerState } from 'src/store/state/appDrawerState';

export const changeDrawerState = createAction<boolean>('drawer/changeDrawerState');
export const openDrawer = createAction<void>('drawer/openDrawer');
export const closeDrawer = createAction<void>('drawer/closeDrawer');


const initialState: AppDrawerState = {
    isDrawerOpen: false,
};

export const appDrawerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeDrawerState, (state, action) => {
            state.isDrawerOpen = action.payload;
        })
        .addCase(openDrawer, (state) => {
            state.isDrawerOpen = true;
        })
        .addCase(closeDrawer, (state) => {
            state.isDrawerOpen = false;
        });
});
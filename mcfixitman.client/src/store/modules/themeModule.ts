import { createAction, createReducer } from '@reduxjs/toolkit';

import { ThemeState } from 'src/store/state/themeState';

export const setTheme = createAction<{ isDark: boolean }>('theme/toggleDarkMode');
export const setPrimaryColor = createAction<string>('theme/setPrimaryColor');
export const setIsThemeDrawerOpen = createAction<boolean>('theme/setIsThemeDrawerOpen');

const initialState: ThemeState = {
    headerSizePixels: 60,
    isDark: false,
    primaryColor: '#BF4044',
    isThemeDrawerOpen: false,
};

export const themeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setTheme, (state, action) => {
            state.isDark = action.payload.isDark;
        })
        .addCase(setPrimaryColor, (state, action) => {
            state.primaryColor = action.payload;
        })
        .addCase(setIsThemeDrawerOpen, (state, action) => {
            state.isThemeDrawerOpen = action.payload;
        });
});
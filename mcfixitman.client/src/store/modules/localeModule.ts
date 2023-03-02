import 'dayjs/locale/zh-cn';
import 'dayjs/locale/es';

import { createAction, createReducer } from '@reduxjs/toolkit';
import { getObjectFromLocalStorage, saveObjectToLocalStorage } from 'src/utility/localStorage';

import { AppThunkAction } from 'src/types/reduxHelpers';
import { Locale } from 'antd/es/locale-provider';
import { LocaleState } from 'src/store/state/localeState';
import dayJs from 'dayjs';
import enUS from 'antd/locale/en_US';
// import esES from 'antd/locale/es_ES';
import { i18n } from 'src/i18n';

// import zhCN from 'antd/locale/zh_CN';

// *************************
// Notes for adding new languages:
// The majority of the translation work is handled by i18n in src/i18n/config
// This will take care of all of the application-specific translations via translation files in src/i18n/locales/*
// However, antd components need some additional configuration in order to translate strings coming directly from their library.
//
// To add a new langauge to the application:
// 1. Create a new translations.json file for the new language in src/i18n/locales/[language code]/translations.json
// 2. Add the new langauge to 'supportedLanguages' and 'resources' objects in src/i18n/config.ts - Resources are assigned the json file added in the previous step
// 3. Import the respective locale from both dayJs and antd above
// 4. Update the mappings below for getAntdLocale and getDayJsLocale with their respective imports 
// *************************

interface LocalePayload {
    localeKey: string;
    antdLocale: Locale;
    dayJsLocale: string;
}

const changeLanguage = createAction<LocalePayload>('locale/changeLanguage');

const getAntdLocale = (localeKey?: string): Locale => {
    switch (localeKey) {
        // case 'es': {
        //     return esES;
        // }
        // case 'zh': {
        //     return zhCN;
        // }
        case 'en':
        default: {
            return enUS;
        }
    }
};

const getDayJsLocale = (localeKey?: string): string => {
    switch (localeKey) {
        // case 'es': {
        //     return 'es';
        // }
        // case 'zh': {
        //     return 'zh-cn';
        // }
        case 'en':
        default: {
            return 'en';
        }
    }
};

export const updateLanguage = (localeKey: string): AppThunkAction<LocalePayload> => {
    return (dispatch, getState) => {

        const antdLocale = getAntdLocale(localeKey);
        const dayJsLocale = getDayJsLocale(localeKey);

        i18n.changeLanguage(localeKey);
        dayJs.locale(dayJsLocale);

        dispatch(changeLanguage({
            antdLocale: antdLocale,
            localeKey: localeKey,
            dayJsLocale: dayJsLocale,
        }));

        saveObjectToLocalStorage<string>('mcfixitman-locale', getState().locale.currentLocale);

        return {
            antdLocale: antdLocale,
            localeKey: localeKey,
            dayJsLocale: dayJsLocale,
        };
    };
};

const getInitialState = (): LocaleState => {
    // TODO: I'd like to have redux-persist handle this the same way we're persisting other slices of state, but it becomes annoyingly complex
    // to then handle the necessary calls to i18n and dayJs when the state is rehydrated (you'd wind up with either side-effects in the reducer or the need for a middleware)
    // Going to keep as-is for now
    const savedLocale = getObjectFromLocalStorage<string>('mcfixitman-locale') ?? 'en';

    const antdLocale = getAntdLocale(savedLocale);
    const dayJsLocale = getDayJsLocale(savedLocale);

    // Set our saved locale for i18n and dayjs translations
    // Antd-specific component translations will update via the ConfigProvider in CoreLayout.tsx automatically due to our redux props so no changes needed here
    i18n.changeLanguage(savedLocale);
    dayJs.locale(dayJsLocale);

    return {
        currentLocale: savedLocale,
        antdLocale: antdLocale,
        dayJsLocale: dayJsLocale,
    };
};

export const localeReducer = createReducer(getInitialState(), (builder) => {
    builder
        .addCase(changeLanguage, (state, action) => {
            state.currentLocale = action.payload.localeKey;
            state.antdLocale = action.payload.antdLocale;
            state.dayJsLocale = action.payload.dayJsLocale;
        });
});
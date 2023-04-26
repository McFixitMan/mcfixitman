import { AnyAction, Store } from 'redux';
import { PersistConfig, Persistor, persistReducer, persistStore } from 'redux-persist';
import {
    appDrawerReducer,
    localeReducer,
    securityReducer,
    serviceWorkerReducer,
    socketReducer,
} from 'src/store/modules';

import { AppDispatch } from 'src/types/reduxHelpers';
import { SecurityState } from 'src/store/state/securityState';
import { ThemeState } from 'src/store/state/themeState';
import { aiReducer } from 'src/store/modules/aiModule';
import { chatReducer } from 'src/store/modules/chatModule';
import { combineReducers } from 'redux';
import { configureStore as configureReduxStore } from '@reduxjs/toolkit';
import { nameof } from 'ts-simple-nameof';
import { socketMiddleware } from 'src/store/middleware/socketMiddleware';
import storage from 'redux-persist/lib/storage';
import { themeReducer } from 'src/store/modules/themeModule';
import thunk from 'redux-thunk';

// const aiPersistConfig: PersistConfig<AiState> = {
//     key: 'mcfixitman:ai',
//     storage: storage,
//     whitelist: [
//         nameof<AiState>(x => x.completions),
//         nameof<AiState>(x => x.prompts),
//         nameof<AiState>(x => x.lastImagePrompt),
//         nameof<AiState>(x => x.lastImageUri),
//     ],
//     transforms: [dateTransform],
// };

const themePersistConfig: PersistConfig<ThemeState> = {
    key: 'mcfixitman:theme',
    storage: storage,
    whitelist: [
        nameof<ThemeState>(x => x.isDark),
        nameof<ThemeState>(x => x.primaryColor),
    ],
};

const securityPersistConfig: PersistConfig<SecurityState> = {
    key: 'mcfixitman:security',
    storage: storage,
    // Don't persist accessToken (refresh will be used on reloads)
    // Don't persist isRefreshingToken or refreshPromise - saving these can leave us in a 'stuck' state where the app thinks we're already refreshing so we never actually do
    whitelist: [
        nameof<SecurityState>(x => x.isAuthenticated),
        nameof<SecurityState>(x => x.member),
        nameof<SecurityState>(x => x.refreshToken),
        nameof<SecurityState>(x => x.deviceUUID),
    ],
};

const makeRootReducer = combineReducers({
    // ai: persistReducer(aiPersistConfig, aiReducer),
    ai: aiReducer,
    chat: chatReducer,
    drawer: appDrawerReducer,
    locale: localeReducer,
    security: persistReducer(securityPersistConfig, securityReducer),
    serviceWorker: serviceWorkerReducer,
    socket: socketReducer,
    theme: persistReducer(themePersistConfig, themeReducer),
});

export type RootState = ReturnType<typeof makeRootReducer>;

export function configureStore(initialState?: RootState): { store: Store<RootState, AnyAction> & { dispatch: AppDispatch }, persistor: Persistor } {
    const persistedReducer = makeRootReducer;

    const store = configureReduxStore({
        reducer: persistedReducer,
        preloadedState: initialState,
        middleware: [thunk, socketMiddleware],
        devTools: process.env.NODE_ENV === 'development',
    });

    const persistor = persistStore(store);

    return { store, persistor };
}
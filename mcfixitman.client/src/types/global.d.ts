
declare interface Window {
    // A hack for the Redux DevTools Chrome extension.
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
    __INITIAL_STATE__?: any; // eslint-disable-line
    // The redux developer tools window
    devToolsExtension?: any; // eslint-disable-line
    less?: any; // eslint-disable-line
}

declare var NODE_ENV: string; // eslint-disable-line
declare var __DEV__: boolean; // eslint-disable-line
declare var __PROD__: boolean; // eslint-disable-line
declare var __DEBUG__: boolean; // eslint-disable-line
declare var __DEBUG_NEW_WINDOW__: boolean; // eslint-disable-line
declare var __BASENAME__: string; // eslint-disable-line
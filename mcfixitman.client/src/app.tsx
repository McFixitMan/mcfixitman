import 'core-js/stable';
import 'src/i18n/config';
import 'antd/dist/reset.css';

import * as React from 'react';

import { RootState, configureStore } from './store/createStore';

import { AppWrapper } from './appWrapper';

const initialState: RootState = window.__INITIAL_STATE__;

const configuredStore = configureStore(initialState);

export const store = configuredStore.store;
export const persistor = configuredStore.persistor;

export const App: React.FC = (props) => {
    return (
        <AppWrapper store={store} />
    );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

export default App;

import * as React from 'react';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { RootState } from 'src/store/createStore';
import { Spin } from 'antd';
import { Store } from 'redux';
import { ThemeWrapper } from 'src/themeWrapper';
import { persistor } from './app';

interface AppWrapperProps {
    store: Store<RootState>;
}

export const AppWrapper: React.FC<AppWrapperProps> = (props) => {

    return (
        <Provider store={props.store}>
            <PersistGate
                loading={<Spin />}
                persistor={persistor}
            >
                <div style={{ height: '100%' }}>
                    <ThemeWrapper />
                </div>
            </PersistGate>

        </Provider>
    );
};
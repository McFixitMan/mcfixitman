import * as React from 'react';

import { App, ConfigProvider, theme } from 'antd';

import { AppContent } from 'src/appContent';
import { useAppSelector } from 'src/types/reduxHelpers';
import { useFormValidateMessages } from 'src/hooks/useFormValidateMessages';

export const ThemeWrapper: React.FC = () => {
    const validateMessages = useFormValidateMessages();

    const antdLocale = useAppSelector((state) => state.locale.antdLocale);

    const isDark = useAppSelector(state => state.theme.isDark);
    const primaryColor = useAppSelector(state => state.theme.primaryColor);

    const algorithm = React.useMemo(() => {
        return isDark
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm;
    }, [isDark]);

    return (
        <ConfigProvider
            form={{ validateMessages: validateMessages }}
            locale={antdLocale}
            componentSize="large"
            autoInsertSpaceInButton={true}

            theme={{
                algorithm: algorithm,
                token: {
                    colorPrimary: primaryColor,
                },
            }}
        >
            <App>
                <AppContent />
            </App>
        </ConfigProvider>

    );
};
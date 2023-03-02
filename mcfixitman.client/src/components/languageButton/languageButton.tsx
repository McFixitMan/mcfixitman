import * as React from 'react';

import { Button, Popover } from 'antd';

import { GlobalOutlined } from '@ant-design/icons';
import { LanguagePicker } from '../languagePicker';
import { useTranslation } from 'react-i18next';

export const LanguageButton: React.FC = (props) => {
    const { t } = useTranslation();

    return (
        <Popover
            title={<div style={{ width: '100%', textAlign: 'center' }}>{t('Components.LanguageButton.change_language_text')}</div>}
            trigger="click"
            placement="bottomLeft"
            content={
                <LanguagePicker />
            }
        >
            <Button
                type="primary"
                shape="round"
                style={{ width: '75px', height: '50px', padding: 0, margin: 0 }}
            >
                <GlobalOutlined style={{ fontSize: '35px', padding: 0, margin: 0 }} />
            </Button>
        </Popover>
    );
};
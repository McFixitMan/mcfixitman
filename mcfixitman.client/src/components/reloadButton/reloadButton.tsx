import * as React from 'react';

import { Button, ButtonProps } from 'antd';

import { ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface ReloadButtonProps extends ButtonProps {

}

export const ReloadButton: React.FC<ReloadButtonProps> = (props) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            {...props}
        >
            {t('Common.reload')}
        </Button>
    );
};
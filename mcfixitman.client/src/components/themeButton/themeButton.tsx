import * as React from 'react';

import { Button, ButtonProps } from 'antd';

import { FormatPainterOutlined } from '@ant-design/icons';
import { setIsThemeDrawerOpen } from 'src/store/modules/themeModule';
import { useAppDispatch } from 'src/types/reduxHelpers';
import { useTranslation } from 'react-i18next';

interface ThemeButtonProps extends ButtonProps {

}

export const ThemeButton: React.FC<ThemeButtonProps> = (props) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    return (
        <Button
            onClick={() => dispatch(setIsThemeDrawerOpen(true))}
            icon={<FormatPainterOutlined />}
            {...props}
        >
            {t('Components.ThemeButton.button_text')}
        </Button>
    );
};
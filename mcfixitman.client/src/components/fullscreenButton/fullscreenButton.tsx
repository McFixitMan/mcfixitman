import * as React from 'react';

import { Button, ButtonProps } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

import { useFullscreen } from 'src/hooks/useFullscreen';
import { useTranslation } from 'react-i18next';

interface FullscreenButtonProps extends ButtonProps {

}

export const FullscreenButton: React.FC<FullscreenButtonProps> = (props) => {
    const { t } = useTranslation();
    const fullscreen = useFullscreen();

    if (!fullscreen.isFullscreenEnabled) {
        return null;
    }

    return (
        <Button
            type="default"
            icon={
                fullscreen.isFullscreenActive
                    ? <FullscreenExitOutlined />
                    : <FullscreenOutlined />
            }
            onClick={async () => {
                if (fullscreen.isFullscreenActive) {
                    await fullscreen.exitFullscreen();
                } else {
                    await fullscreen.requestFullscreen();
                }
            }}
            {...props}
        >
            {
                fullscreen.isFullscreenActive
                    ? t('Components.FullscreenButton.turn_off_fullscreen_button_text')
                    : t('Components.FullscreenButton.turn_on_fullscreen_button_text')
            }
        </Button>
    );
};
import * as React from 'react';
export const useFullscreen = (): {
    isFullscreenEnabled: boolean;
    isFullscreenActive: boolean;
    requestFullscreen: () => Promise<void>;
    exitFullscreen: () => Promise<void>;
} => {
    const [isFullscreenEnabled, setIsFullscreenEnabled] = React.useState(false);
    const [isFullscreenActive, setIsFullscreenActive] = React.useState(false);

    React.useEffect(() => {
        setIsFullscreenEnabled(document.fullscreenEnabled);
        setIsFullscreenActive(!!document.fullscreenElement);

        document.addEventListener('fullscreenchange', onFullscreenChanged);

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChanged);
        };
    }, []);

    const onFullscreenChanged = (): void => {
        const isFullscreen = getIsFullscreenActive();
        setIsFullscreenActive(isFullscreen);
    };

    const getIsFullscreenActive = (): boolean => {
        return !!document.fullscreenElement;
    };

    const requestFullscreen = async (): Promise<void> => {
        try {
            await document.body.requestFullscreen();
        } catch (err) {
            console.log(err);
        }
    };

    const exitFullscreen = async (): Promise<void> => {
        try {
            await document.exitFullscreen();
        } catch (err) {
            console.log(err);
        }

    };

    return {
        isFullscreenEnabled,
        isFullscreenActive,
        requestFullscreen,
        exitFullscreen,
    };
};
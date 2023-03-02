import * as React from 'react';

import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { Drawer } from 'antd';
import { ThemeChanger } from 'src/components/themeChanger';
import { setIsThemeDrawerOpen } from 'src/store/modules/themeModule';

export const ThemeDrawer: React.FC = () => {
    const dispatch = useAppDispatch();

    const isThemeDrawerOpen = useAppSelector((state) => state.theme.isThemeDrawerOpen);

    return (
        <Drawer
            open={isThemeDrawerOpen}
            onClose={() => dispatch(setIsThemeDrawerOpen(false))}
            title="Theme Settings"
        >
            <ThemeChanger />
        </Drawer>
    );
};
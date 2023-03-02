import * as React from 'react';

import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { AppMenu } from 'src/components/appMenu';
import { Drawer } from 'antd';
import { changeDrawerState } from 'src/store/modules/appDrawerModule';
import { useTranslation } from 'react-i18next';

interface AppDrawerProps {

}

export const AppDrawer: React.FC<AppDrawerProps> = (props) => {
    const dispatch = useAppDispatch();

    const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);

    const { t } = useTranslation();

    return (
        <Drawer
            className="app-drawer"
            open={isDrawerOpen}
            placement="left"
            closable={true}
            title={t('Components.AppDrawer.title')}
            mask={true}
            onClose={() => dispatch(changeDrawerState(false))}
        >
            <AppMenu
                mode="vertical"
            />
        </Drawer>
    );
};
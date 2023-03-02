import * as React from 'react';

import { Menu, MenuProps, theme } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';

import { MenuOutlined } from '@ant-design/icons';
import { changeDrawerState } from 'src/store/modules/appDrawerModule';
import classNames from 'classnames';
import { css } from '@emotion/react';
import { groupBy } from 'src/utility/collections';
import { useAppDispatch } from 'src/types/reduxHelpers';
import { useAppRoutes } from 'src/hooks';

interface AppMenuProps extends MenuProps {

}

type MenuItem = Required<MenuProps>['items'][number];

export const AppMenu: React.FC<AppMenuProps> = (props) => {
    const antdTheme = theme.useToken().token;
    const appRoutes = useAppRoutes();
    const dispatch = useAppDispatch();
    const location = useLocation();

    // Get our routes that have showInMenu set to true
    const menuRoutes = Object.entries(appRoutes).map((entry) => {
        const [_routeName, appRoute] = entry;

        return appRoute;
    }).filter(x => x.showInMenu === true);

    // Group routes by groupName
    const groupedRoutes = groupBy(menuRoutes, x => x.groupName ?? '');

    const menuItems = React.useMemo(() => {
        const menuItems: Array<MenuItem> = [];

        Object.entries(groupedRoutes).map((entry) => {
            const [groupKey, groupRoutes] = entry;

            if (!groupKey) {
                // No key means its a direct route (not a group)
                // groupRoutes will contain all appRoutes that dont have a groupName property
                menuItems.push(...groupRoutes.map((route) => {
                    return {
                        key: route.path,
                        icon: route.icon,
                        label: (
                            <NavLink
                                to={route.path}
                                onClick={() => dispatch(changeDrawerState(false))}
                            >
                                {route.title}
                            </NavLink>
                        ),
                        className: classNames('menu-item', { active: route.path === location.pathname }),
                    };
                }));
            } else {
                // We have a key and therefore a group
                // groupRoutes will contain all appRoutes that belong to the group we're on
                const groupName = groupKey;

                const isActive = groupRoutes.some(x => x.path === location.pathname);
                const sorted = [...groupRoutes].sort((a, b) => (a.groupOrder ?? 999) - (b.groupOrder ?? 999));

                menuItems.push({
                    key: groupName,
                    icon: <MenuOutlined />,
                    label: groupName,
                    className: classNames('sub-menu', { active: isActive }),
                    children: sorted.map((groupRoute) => {
                        return {
                            key: groupRoute.path,
                            icon: groupRoute.icon,
                            label: (
                                <NavLink
                                    to={groupRoute.path}
                                    onClick={() => dispatch(changeDrawerState(false))}
                                >
                                    {groupRoute.title}
                                </NavLink>
                            ),
                            className: classNames('menu-item', { active: groupRoute.path === location.pathname }),
                        };
                    }),
                });
            }
        });

        return menuItems;
    }, [appRoutes, location.pathname]);

    const { ...menuProps } = props;

    return (
        <Menu
            {...menuProps}
            className="app-menu"
            selectable={false}
            defaultSelectedKeys={['']}
            selectedKeys={[location.pathname]}
            disabledOverflow={true}
            theme="light"
            triggerSubMenuAction="click" // Default is hover which does not work well on mobile
            style={{
                background: 'transparent',
                border: 'none',
            }}
            css={css({
                '.menu-item': {
                    color: antdTheme.colorText,
                    // height: '100%',
                    '&.active': {
                        fontWeight: 'bold',
                        color: antdTheme.colorText,
                        '.ant-menu-item-icon': {
                            fontWeight: 'bold',
                            color: antdTheme.colorText,
                        },
                    },
                    '.menu-item-link, .ant-menu-title-content, .menu-item-link-icon, .menu-item-link.active': {
                        transition: 'none',
                    },
                },
                '.sub-menu.active': {
                    '.ant-menu-submenu-title': {
                        color: antdTheme.colorText,
                        fontWeight: 'bold',
                    },
                },
            })}
            items={menuItems}
        />
    );
};
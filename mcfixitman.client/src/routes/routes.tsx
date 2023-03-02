import * as React from 'react';

import { AiPage, HomePage, LoginPage, NotFoundPage } from 'src/routes/pages';
import { HomeOutlined, LoginOutlined, RobotOutlined } from '@ant-design/icons';
import { Route, Routes } from 'react-router-dom';

import { AppRoute } from 'src/types/appRoute';
import { ProtectedRoute } from './protectedRoute';
import { getPath } from 'src/utility/path';

// Helper type to allow for autocomplete AppRoute values when adding routes below, while still allowing property access elsewhere
// See: https://stackoverflow.com/a/73966420/3253311
const typeObjectValues = <T extends Record<string, AppRoute>>(object: T): { [originalPropType in keyof T]: AppRoute } => {
    type propType = keyof typeof object;
    return object as { [originalPropType in propType]: AppRoute };
};

// Add available routes here
// Can be secured with isProtected and allowedRoles props
export const appRoutes = typeObjectValues({
    home: {
        title: 'Home',
        titleKey: 'Pages.HomePage.title',
        path: getPath(''),
        component: <HomePage />,
        icon: <HomeOutlined />,
        showInMenu: true,
        isProtected: true,
    },
    login: {
        title: 'Login',
        titleKey: 'Pages.LoginPage.title',
        path: getPath('/login'),
        component: <LoginPage />,
        icon: <LoginOutlined />,
    },
    ai: {
        title: 'AI',
        titleKey: 'Pages.AiPage.title',
        path: getPath('/ai'),
        component: <AiPage />,
        icon: <RobotOutlined />,
        showInMenu: true,
        isProtected: true,
    },
});

export type RouteType = typeof appRoutes;

export const AppRoutes: React.FC = (props) => {
    const getRouteElement = (appRoute: AppRoute): React.ReactNode => {
        if (appRoute.isProtected) {
            return (
                <ProtectedRoute
                    allowedRoles={appRoute.allowedRoles}
                >
                    {appRoute.component}
                </ProtectedRoute>
            );
        } else {
            return appRoute.component;
        }
    };

    return (
        <>
            <Routes>
                {Object.entries(appRoutes).map((entry) => {
                    const [_routeName, appRoute] = entry;

                    return (
                        <Route
                            key={appRoute.path}
                            path={appRoute.path}
                            element={getRouteElement(appRoute)}
                        />
                    );
                })}

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Routes>
        </>
    );
};
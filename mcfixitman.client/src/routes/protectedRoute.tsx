import * as React from 'react';

import { Navigate, useLocation } from 'react-router-dom';
import { NotAuthorizedPage, NotFoundPage } from 'src/routes/pages';

import { UserRole } from 'mcfixitman.shared/enums/userRole';
import { useAppRoutes } from 'src/hooks';
import { useAppSelector } from 'src/types/reduxHelpers';

interface ProtectedRouteProps {
    allowedRoles?: Array<UserRole>;
}

export const ProtectedRoute: React.FC<React.PropsWithChildren<ProtectedRouteProps>> = (props) => {
    const appRoutes = useAppRoutes();
    const isAuthenticated = useAppSelector((state) => state.security.isAuthenticated);
    // const userRoles = useAppSelector((state) => state.security.member?.roles);
    const location = useLocation();

    // const isUserAllowed = isAuthenticated && (!props.allowedRoles || (userRoles?.some((role) => !!props.allowedRoles && props.allowedRoles.indexOf(role) >= 0)));
    const isUserAllowed = isAuthenticated;

    const ComponentResult = isUserAllowed
        ? !!props.children
            ? props.children
            : <NotFoundPage />
        : isAuthenticated
            ?
            <NotAuthorizedPage />
            :
            <Navigate
                to={appRoutes.login.path}
                state={{ from: location.pathname }}
            />;

    return (
        <>
            {ComponentResult}
        </>
    );
};
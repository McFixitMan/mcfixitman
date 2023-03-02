import * as React from 'react';

import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { authenticate } from 'src/store/modules';

export const useAuthenticate = (): void => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.security.isAuthenticated);

    React.useEffect(() => {
        const authAsync = async (): Promise<void> => {
            if (isAuthenticated) {
                await dispatch(authenticate());

                // await dispatch(getUserFacilities());
            } else {
                // dispatch(clearUserFacilities());
            }
        };

        authAsync();
    }, [isAuthenticated]);
};
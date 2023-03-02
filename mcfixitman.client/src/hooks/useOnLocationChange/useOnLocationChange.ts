import * as React from 'react';

import { Location, useLocation } from 'react-router-dom';

export const useOnLocationChange = (handleLocationChange: (location: Location) => void): void => {
    const location = useLocation();

    React.useEffect(() => {
        handleLocationChange(location);
    }, [location, handleLocationChange]);
};
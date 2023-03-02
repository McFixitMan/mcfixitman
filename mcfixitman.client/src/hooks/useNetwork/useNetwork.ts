import * as React from 'react';

interface NetworkState {
    since?: Date;
    online: boolean;
    rtt?: number;
    type?: ConnectionType;
    saveData?: boolean;
    downlink?: number;
    downlinkMax?: number;
    effectiveType?: EffectiveConnectionType;
}

export const useNetwork = (): NetworkState => {
    const getNetworkConnection = (): NetworkInformation | undefined => {
        return navigator.connection ?? undefined;
    };

    const getNetworkConnectionInfo = (): Pick<NetworkInformation, 'rtt' | 'type' | 'saveData' | 'downlink' | 'downlinkMax' | 'effectiveType'> => {
        const connection = getNetworkConnection();

        return {
            rtt: connection?.rtt,
            type: connection?.type,
            saveData: connection?.saveData,
            downlink: connection?.downlink,
            downlinkMax: connection?.downlinkMax,
            effectiveType: connection?.effectiveType,
        };
    };

    const [state, setState] = React.useState<NetworkState>(() => {
        return {
            since: undefined,
            online: navigator.onLine,
            ...getNetworkConnectionInfo(),
        };
    });

    React.useEffect(() => {
        const handleOnline = (): void => {
            setState((previousState) => ({
                ...previousState,
                online: true,
                since: new Date(),
            }));
        };

        const handleOffline = (): void => {
            setState((previousState) => ({
                ...previousState,
                online: false,
                since: new Date(),
            }));
        };

        const handleConnectionChange = (): void => {
            setState((previousState) => ({
                ...previousState,
                ...getNetworkConnectionInfo(),
            }));
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const connection = getNetworkConnection();

        connection?.addEventListener('change', handleConnectionChange);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);

            connection?.removeEventListener('change', handleConnectionChange);
        };
    }, []);

    return state;
};
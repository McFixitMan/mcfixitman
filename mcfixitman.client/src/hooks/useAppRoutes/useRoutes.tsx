import * as React from 'react';

import { RouteType, appRoutes } from 'src/routes';

import { useTranslation } from 'react-i18next';

export const useAppRoutes = (): RouteType => {
    const { t, i18n } = useTranslation();

    const translatedRoutes = {
        ...appRoutes,
    };

    Object.entries(translatedRoutes).forEach((entry) => {
        const [_key, appRoute] = entry;

        if (!!appRoute.titleKey) {
            if (i18n.exists(appRoute.titleKey)) {
                // Replace title if the translation key for it exists
                appRoute.title = t(appRoute.titleKey) ?? appRoute.title;
            }
        }
    });
    const [routes] = React.useState(translatedRoutes);

    return routes;
};
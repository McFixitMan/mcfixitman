import * as React from 'react';
import * as serviceWorkerRegistration from 'src/serviceWorkerRegistration';

import { App, theme } from 'antd';
import { Global, css } from '@emotion/react';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { AntdBreakpointHelper } from 'src/components/antdBreakpointHelper';
import { AppDrawer } from 'src/components/appDrawer';
import { AppRoutes } from 'src/routes';
import { BrowserRouter } from 'react-router-dom';
import { Header } from 'src/components/header';
import { LocalStorageUsageHelper } from 'src/components/localStorageUsageHelper';
import { PageWrapper } from 'src/components/pageWrapper';
import { ThemeDrawer } from 'src/components/themeDrawer';
import { t } from 'i18next';
import { updateServiceWorker } from 'src/store/modules';
import { useAuthenticate } from 'src/hooks/useAuthenticate';

// Context for the scroll container (layout-routes)
// Useful for child components that may need to have control over page scroll (Affix, etc.)
export const ScrollContext = React.createContext<Partial<{ scrollContainerRef: React.RefObject<HTMLDivElement> }>>({});

export const AppContent: React.FC = () => {
    useAuthenticate();

    const dispatch = useAppDispatch();

    const antdTheme = theme.useToken().token;

    const scrollRef = React.useRef<HTMLDivElement>(null);

    const isDark = useAppSelector((state) => state.theme.isDark);
    const headerSizePixels = useAppSelector((state) => state.theme.headerSizePixels);

    const { modal, message } = App.useApp();

    React.useEffect(() => {
        serviceWorkerRegistration.register({
            onUpdate: async (registration) => {
                modal.info({
                    title: t('App.update_available_title'),
                    okText: t('App.reload_now_text'),
                    content: t('App.update_available_description'),
                    onOk: async () => {
                        // Makes Workbox call skipWaiting()
                        if (!!registration.waiting) {
                            await registration.unregister();
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }

                        // Once the service worker is unregistered, we can reload the page to let
                        // the browser download a fresh copy of our app (invalidating the cache)
                        window.location.reload();

                    },
                    onCancel: () => {
                        message.info(t('App.update_cancelled_message'));
                    },
                });

                dispatch(updateServiceWorker());
            },
        });
    }, []);

    return (
        <BrowserRouter>
            <div
                className="core-layout__viewport main-content"
                style={{
                    color: antdTheme.colorText,
                }}
            >
                <Global
                    // Global CSS styles can go here
                    styles={css({
                        ':root': {
                            colorScheme: isDark ? 'dark' : 'light',
                        },
                        'body': {
                            margin: 0,
                            padding: 0,
                            background: antdTheme.colorBgLayout,
                            '& ::selection': {
                                background: antdTheme.colorPrimary,
                                color: antdTheme.colorWhite,
                            },
                        },

                    })}
                />

                <div
                    className="layout-main"
                    style={{ minWidth: '350px' }}
                >
                    <div
                        className="layout-header"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: headerSizePixels,
                            overflow: 'hidden',
                            width: '100%',
                            minWidth: '100%',
                            maxWidth: '100%',
                            zIndex: 10,
                            boxShadow: `0 -3px 9px 1px ${antdTheme.colorPrimary}`,
                        }}
                    >
                        <Header />
                    </div>


                    <ScrollContext.Provider value={{ scrollContainerRef: scrollRef }}>
                        <div
                            className="layout-routes"
                            ref={scrollRef}
                            style={{
                                position: 'absolute',
                                top: headerSizePixels,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                overflow: 'auto',
                                backgroundColor: antdTheme.colorBgLayout,
                            }}
                        >
                            {/* <div className="nav-buttons-container">
                                <NavButtons />
                            </div> */}
                            <React.Suspense
                                fallback={
                                    <PageWrapper
                                        isLoading={true}
                                        loadingMessage={t('Common.loading') ?? 'Loading...'}
                                    />
                                }
                            >
                                <AppRoutes />
                            </React.Suspense>
                        </div>
                    </ScrollContext.Provider>
                </div>

                <AppDrawer />
                <ThemeDrawer />

                {process.env.REACT_APP_ANTD_GRID_HELPER === 'on' &&
                    <div style={{ position: 'fixed', bottom: 15, left: 15 }}>
                        <AntdBreakpointHelper />
                    </div>
                }

                {process.env.REACT_APP_LOCAL_STORAGE_USAGE_INFO === 'on' &&
                    <div style={{ position: 'fixed', bottom: 15, right: 15 }}>
                        <LocalStorageUsageHelper />
                    </div>
                }
            </div>
        </BrowserRouter>
    );
};
import * as React from 'react';

import { App, Col, Row, theme } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { NonIdealAction, PageWrapperProps } from './pageWrapperProps';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { AppButton } from 'src/components/appButton';
import { HexTransparency } from 'src/utility/themeHelper';
import { PageHeader } from 'src/components/pageHeader';
import classNames from 'classnames';
import { logout } from 'src/store/modules/securityModule';
import { useAppRoutes } from 'src/hooks';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export const PageWrapper: React.FC<React.PropsWithChildren<PageWrapperProps>> = (props) => {
    const { t } = useTranslation();

    const antdTheme = theme.useToken().token;

    const dispatch = useAppDispatch();
    const appRoutes = useAppRoutes();
    const location = useLocation();
    const navigate = useNavigate();

    const topRef = React.createRef<HTMLDivElement>();
    const contentRef = React.createRef<HTMLDivElement>();

    const headerSize = useAppSelector(state => state.theme.headerSizePixels);
    const member = useAppSelector((state) => state.security.member);

    const { modal } = App.useApp();

    React.useEffect(() => {
        const scrollOptions: ScrollIntoViewOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        };

        switch (props.scrollBehaviorOnMount) {
            case 'top': {
                topRef.current?.scrollIntoView(scrollOptions);
                break;
            }
            case 'none': {
                break;
            }
            case 'content': {
                contentRef.current?.scrollIntoView(scrollOptions);
                break;
            }
            case undefined:
            default: {
                // Scroll to top if not supplied
                topRef.current?.scrollIntoView(scrollOptions);
                break;
            }
        }
    }, []);

    const className = classNames('page-wrapper', props.containerClassName);

    const containerStyle: React.CSSProperties = props.isNonIdeal
        ? { ...props.style, overflow: 'hidden' }
        : { ...props.style };

    const overrideActionText = (action?: NonIdealAction): string => {
        switch (action) {
            case 'back': {
                return t('Components.PageWrapper.go_back_text');
            }
            case 'home': {
                return t('Components.PageWrapper.go_home_text');
            }
            case 'login': {
                return t('Components.PageWrapper.login_text');
            }
            case 'logout': {
                return t('Components.PageWrapper.logout_text');
            }
            case 'reload': {
                return t('Components.PageWrapper.reload_text');
            }
            default: {
                if (!!action && !!action.text) {
                    return action.text;
                }
                return '';
            }
        }
    };

    const handleActionClicked = (action: NonIdealAction): void => {
        switch (action) {
            case 'back': {
                navigate(-1);
                break;
            }

            case 'reload': {
                window.location.reload();
                break;
            }

            case 'home': {
                navigate(appRoutes.home.path);
                break;
            }

            case 'logout': {
                modal.confirm({
                    title: `${t('Components.LoggedInAccount.logout_text')}: ${member?.firstName}`,
                    content: t('Components.LoggedInAccount.logout_confirmation_message'),
                    okText: t('Components.LoggedInAccount.logout_confirmation_button_text'),
                    cancelText: t('Common.cancel'),
                    onOk: async () => {
                        await dispatch(logout());
                        navigate(appRoutes.login.path);
                    },
                });

                break;
            }

            case 'login': {
                navigate(appRoutes.login.path, { state: { from: location } });
                break;
            }

            default: {
                // other
                break;
            }
        }
    };

    return (
        <Row
            className={className}
            style={{
                ...containerStyle,
                padding: '0 20px 20px 20px',
            }}
            align="top"
            justify="center"
            ref={topRef}
        >
            <Col
                xxl={14}
                xl={16}
                lg={18}
                md={20}
                sm={24}
                xs={24}
                {...props.customTitleBreakpoints}
                style={{ padding: 5 }}
            >
                <Row
                    align="top"
                    justify="center"
                    className="page"
                >
                    {!!props.pageTitle &&
                        <Col span={24}>
                            {(typeof props.pageTitle === 'string')
                                ?
                                <PageHeader
                                    preContent="McFixitMan"
                                    mainContent={props.pageTitle}
                                />
                                :
                                props.pageTitle
                            }
                        </Col>
                    }

                </Row>
            </Col>

            <Col
                xxl={14}
                xl={16}
                lg={18}
                md={20}
                sm={24}
                xs={24}
                {...props.customContentBreakpoints}
                style={{ padding: 5 }}
            >
                <Row
                    align="top"
                    justify="center"
                >
                    <Col
                        span={24}
                        className="page-wrapper-content"
                        ref={contentRef}
                    >
                        {props.children}
                    </Col>
                </Row>

            </Col>

            {props.isNonIdeal === true &&
                <div
                    className="non-ideal-page"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: headerSize,
                        background: `${antdTheme.colorBgLayout}${HexTransparency[80]}`, // Add alpha to our hex color
                        backdropFilter: 'blur(1.5px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 8,
                    }}
                >
                    <Row
                        align="middle"
                        justify="center"
                        style={{ overflowY: 'auto', overflowX: 'hidden' }}
                    >
                        <Col
                            span={24}
                            style={{ textAlign: 'center' }}
                        >
                            {!!props.nonIdealIconType
                                ?
                                <span
                                    className="non-ideal-icon"
                                    style={{
                                        fontSize: '10em',
                                        color: antdTheme.colorPrimary,
                                    }}
                                >
                                    {props.nonIdealIconType}
                                </span>
                                :
                                <WarningOutlined
                                    className="non-ideal-icon"
                                    style={{
                                        fontSize: '10em',
                                        color: antdTheme.colorPrimary,
                                    }}
                                />
                            }
                        </Col>

                        <Col
                            span={24}
                            className="non-ideal-header"
                            style={{
                                textAlign: 'center',
                                fontSize: '2em',
                                fontWeight: 'bold',
                                color: antdTheme.colorTextHeading,
                                padding: 10,
                                margin: 10,
                            }}
                        >
                            {props.nonIdealHeader}
                        </Col>

                        <Col
                            span={24}
                            className="non-ideal-subheader"
                            style={{
                                textAlign: 'center',
                                padding: '0 10px',
                                fontSize: '1.4em',
                                fontWeight: 'lighter',
                                margin: '10px 0 40px 0',
                            }}
                        >
                            {props.nonIdealSubheader}
                        </Col>

                        <Row
                            align="middle"
                            justify="center"
                        >
                            <Col
                                xxl={24}
                                xl={24}
                                lg={24}
                                md={24}
                                sm={24}
                                xs={24}
                            >
                                <Row
                                    align="middle"
                                    justify="center"
                                    gutter={50}
                                >
                                    {!!props.nonIdealActions &&
                                        props.nonIdealActions.map((action) => {
                                            if (typeof action === 'string') {
                                                return (
                                                    <Col
                                                        key={action}
                                                    >
                                                        <AppButton
                                                            style={{ minWidth: '300px' }}
                                                            key={action}
                                                            size="middle"
                                                            onClick={() => handleActionClicked(action)}
                                                        >
                                                            {overrideActionText(action)}
                                                        </AppButton>
                                                    </Col>
                                                );
                                            }

                                            return (
                                                <Col
                                                    key={action.text}
                                                >
                                                    <AppButton
                                                        style={{ minWidth: '350px' }}
                                                        key={action.text}
                                                        size="middle"
                                                        onClick={() => action.action()}
                                                    >
                                                        {action.text}
                                                    </AppButton>
                                                </Col>
                                            );
                                        })
                                    }
                                </Row>
                            </Col>

                        </Row>

                    </Row>
                </div>

            }

            {!!props.isLoading === true &&
                <div
                    className="page-wrapper-loading"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        background: `${antdTheme.colorBgLayout}${HexTransparency[80]}`, // Add alpha to our hex color
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9,
                    }}
                >
                    <p>
                        <LoadingOutlined
                            className="page-wrapper-loading-icon"
                            style={{
                                fontSize: '10em',
                                color: antdTheme.colorPrimary,
                            }}
                        />
                    </p>
                    <p
                        className="page-wrapper-loading-header"
                        style={{
                            fontSize: '1.8em',
                            fontWeight: 'bold',
                            color: antdTheme.colorPrimary,
                        }}
                    >
                        {props.loadingMessage || 'Loading...'}
                    </p>
                </div>
            }
        </Row>
    );
};
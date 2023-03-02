import * as React from 'react';

import { App, Col, Row } from 'antd';
import { Navigate, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { AnimatedHeader } from 'src/components/animatedHeader';
import { LocationState } from 'src/types/locationState';
import { LoginForm } from 'src/components/forms';
import { PageWrapper } from 'src/components/pageWrapper';
import { UnlockOutlined } from '@ant-design/icons';
import { login } from 'src/store/modules/securityModule';
import { useApiErrorMessage } from 'src/hooks/useApiErrorMessage';
import { useAppRoutes } from 'src/hooks';
import { useTranslation } from 'react-i18next';

interface LoginPageProps {

}

export const LoginPage: React.FC<LoginPageProps> = (props) => {
    const { t } = useTranslation();
    const { getErrorMessage } = useApiErrorMessage();

    const dispatch = useAppDispatch();

    const appRoutes = useAppRoutes();
    const location = useLocation();

    const isAuthenticated = useAppSelector((state) => state.security.isAuthenticated);
    const member = useAppSelector((state) => state.security.member);

    const [isLoading, setIsLoading] = React.useState(false);
    const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

    const { state } = location;
    const from = (state as LocationState)?.from;

    const { notification } = App.useApp();

    if (redirectToReferrer === true) {
        return <Navigate to={from ?? appRoutes.home.path} />;
    }

    return (
        <PageWrapper
            isNonIdeal={isAuthenticated && !redirectToReferrer && !isLoading}
            nonIdealHeader={
                member
                    ? t('Pages.LoginPage.already_logged_in_message_personal', { user: `${member.firstName}` })
                    : t('Pages.LoginPage.already_logged_in_message')
            }
            nonIdealActions={['home', 'logout']}
            nonIdealIconType={<UnlockOutlined />}
            pageTitle={t('Pages.LoginPage.title')}
            scrollBehaviorOnMount="top"
        >
            <Row
                align="middle"
                justify="center"
            >
                <Col>
                    <Row
                        align="middle"
                        justify="center"
                        gutter={[15, 15]}
                    >
                        <Col
                            span={24}
                            style={{ textAlign: 'center' }}
                        >
                            <AnimatedHeader>
                                {t('Pages.LoginPage.login_message')}
                            </AnimatedHeader>
                        </Col>

                        <Col span={24}>
                            <LoginForm
                                isLoading={isLoading}
                                onFinish={async (values) => {
                                    setIsLoading(true);

                                    const action = await dispatch(login({ email: values.email, password: values.password }));

                                    if (login.fulfilled.match(action)) {
                                        setRedirectToReferrer(true);
                                    } else {
                                        notification.error({
                                            description: getErrorMessage(action.payload),
                                            message: t('Pages.LoginPage.login_error'),
                                        });

                                        setIsLoading(false);
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageWrapper>
    );
};
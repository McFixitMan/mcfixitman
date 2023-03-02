import * as React from 'react';

import { App, Button, ButtonProps } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { logout } from 'src/store/modules';
import { useAppRoutes } from 'src/hooks';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LoggedInAccountProps extends ButtonProps {

}

export const LoggedInAccount: React.FC<LoggedInAccountProps> = (props) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const appRoutes = useAppRoutes();

    const member = useAppSelector((state) => state.security.member);
    const isAuthenticated = useAppSelector((state) => state.security.isAuthenticated);

    const { modal } = App.useApp();

    return (
        <div>
            {isAuthenticated
                ?
                <div
                    className="logged-in-account"
                    style={{ cursor: 'pointer', display: 'flex', textAlign: 'right', justifyContent: 'flex-end', alignItems: 'center' }}
                >
                    <Button
                        icon={<LogoutOutlined />}
                        type="primary"
                        danger={true}
                        onClick={() => {
                            modal.confirm({
                                title: `${t('Components.LoggedInAccount.logout_text')}: ${member?.firstName} ${member?.lastName}`,
                                content: t('Components.LoggedInAccount.logout_confirmation_message'),
                                okText: t('Components.LoggedInAccount.logout_confirmation_button_text'),
                                cancelText: t('Common.cancel'),
                                onOk: async () => {
                                    await dispatch(logout());
                                    navigate(appRoutes.login.path);
                                },
                            });
                        }}
                        {...props}
                    >
                        {t('Components.LoggedInAccount.logout_text')}: {`${member?.firstName} ${member?.lastName}`}
                    </Button>
                </div>
                :
                <Button
                    icon={<UserOutlined />}
                    onClick={() => navigate(appRoutes.login.path)}
                    {...props}
                >
                    {t('Components.LoggedInAccount.login_text')}
                </Button>
            }
        </div>
    );
};
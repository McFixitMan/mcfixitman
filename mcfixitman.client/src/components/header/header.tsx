import * as React from 'react';

import { Col, Divider, Row, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { AppControls } from 'src/components/appControls';
import { NavLink } from 'react-router-dom';
import { changeDrawerState } from 'src/store/modules/appDrawerModule';
import { useAppRoutes } from 'src/hooks';

const header: React.FC = (props) => {
    const dispatch = useAppDispatch();

    const appRoutes = useAppRoutes();

    const isAuthenticated = useAppSelector((state) => state.security.isAuthenticated);
    const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);

    const antdTheme = theme.useToken().token;

    return (
        <Row
            className="header"
            justify="space-between"
            align="middle"
            style={{
                zIndex: 9,
                height: '100%',
                width: '100%',
                minWidth: '350px',
                margin: 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: antdTheme.colorBgContainer,
            }}
        >
            <Col>
                <Row
                    align="middle"
                    justify="start"
                >
                    <Col
                        className="header-menu-button"
                    >
                        {isAuthenticated === true &&
                            <div>
                                {isDrawerOpen === true
                                    ?
                                    <MenuFoldOutlined
                                        className="header-icon"
                                        style={{
                                            fontSize: 20,
                                            marginLeft: 16,
                                            marginRight: 16,
                                            cursor: 'pointer',
                                            color: antdTheme.colorPrimary,
                                        }}
                                        onClick={() => dispatch(changeDrawerState(false))}
                                    />
                                    :
                                    <MenuUnfoldOutlined
                                        className="header-icon"
                                        style={{
                                            fontSize: 20,
                                            marginLeft: 16,
                                            marginRight: 16,
                                            cursor: 'pointer',
                                            color: antdTheme.colorPrimary,
                                        }}
                                        onClick={() => dispatch(changeDrawerState(true))}
                                    />
                                }
                            </div>
                        }
                    </Col>

                    <Col>
                        <NavLink
                            to={appRoutes.home.path}
                        >
                            <Row>
                                <div
                                    className="header-title"
                                    style={{
                                        // flex: 0,
                                        alignSelf: 'middle',
                                        marginLeft: 10,
                                        marginRight: 10,
                                        color: antdTheme.colorTextHeading,
                                        fontSize: '25px',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 'lighter',
                                        }}
                                    >
                                        McFixit
                                    </span>

                                    <Divider type="vertical" />

                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            color: antdTheme.colorPrimary,
                                            position: 'relative',
                                            top: '-0.10em',
                                            fontSize: '60%',
                                        }}
                                    >
                                        Man
                                    </span>
                                </div>
                            </Row>
                        </NavLink>
                    </Col>
                </Row>
            </Col>

            <Col>
                <AppControls />
            </Col>
        </Row>
    );
};

export const Header = React.memo(header);
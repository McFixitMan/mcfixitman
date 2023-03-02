import * as React from 'react';

import { Col, Divider, Row, theme } from 'antd';

import { ShellLogo } from '../shellLogo';
import classNames from 'classnames';

export interface PageHeaderProps {
    className?: string;
    preContent?: React.ReactNode;
    mainContent?: React.ReactNode;
}

const pageHeader: React.FC<PageHeaderProps> = (props) => {
    const antdTheme = theme.useToken().token;

    return (
        <Row
            align="middle"
            justify="center"
            gutter={10}
            className={classNames('page-header', props.className)}
        >
            <Col span={24} style={{ textAlign: 'center' }}>
                <Row
                    align="middle"
                    justify="center"
                    gutter={15}
                >
                    <Col
                        span={24}
                    >
                        <Divider />
                    </Col>

                    <Col
                        span={24}
                    >
                        <Row
                            align="middle"
                            justify="center"
                        >
                            <Col>
                                <div
                                    style={{ width: '80px' }}
                                >
                                    <ShellLogo
                                        className="page-header-logo-icon"
                                    />
                                </div>

                            </Col>

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
                                >
                                    <Col span={24}>
                                        {!!props.preContent &&
                                            <span
                                                style={{
                                                    fontSize: 25,
                                                    fontWeight: 'lighter',
                                                    letterSpacing: 5,
                                                    paddingLeft: 5,
                                                }}
                                            >
                                                {props.preContent}
                                            </span>
                                        }
                                    </Col>

                                    <Col span={24}>
                                        {!!props.mainContent &&
                                            <span
                                                style={{
                                                    color: antdTheme.colorPrimary,
                                                    fontSize: 40,
                                                    fontWeight: 'normal',
                                                    letterSpacing: 15,
                                                    paddingLeft: 15,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {props.mainContent}
                                            </span>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                    <Col
                        span={24}
                    >
                        <Divider />
                    </Col>

                </Row>
            </Col>
        </Row>
    );
};

export const PageHeader = React.memo(pageHeader);
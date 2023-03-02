import * as React from 'react';

import { Col, ColProps, Row } from 'antd';

import { Fade } from 'react-awesome-reveal';

interface AnimatedHeaderProps extends ColProps {

}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = (props) => {

    return (
        <Fade
            triggerOnce={true}
            cascade={true}
        >
            <Row
                align="middle"
                justify="center"
            >
                <Col
                    style={{
                        fontWeight: 'lighter',
                        fontSize: '20px',
                        margin: '20px 0',
                        textAlign: 'center',
                        ...props.style,
                    }}
                >
                    {props.children}
                </Col>
            </Row>
        </Fade>

    );
};
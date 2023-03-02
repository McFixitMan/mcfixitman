import * as React from 'react';

import { Button, Col, Row } from 'antd';

import { CaretLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavButtonsProps {

}

export const NavButtons: React.FC<NavButtonsProps> = (props) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <Row
            align="middle"
            justify="space-between"
            className="nav-buttons"
            style={{ background: 'transparent' }}
        >
            <Col>
                <Button
                    icon={<CaretLeftOutlined />}
                    onClick={() => navigate(-1)}
                    type="primary"
                    style={{ borderRadius: '0 0 10px 0' }}
                >
                    {t('Common.back')}
                </Button>
            </Col>
        </Row>
    );
};
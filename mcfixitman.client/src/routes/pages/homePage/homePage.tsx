import * as React from 'react';

import { Button, Col, Row } from 'antd';

import { AnimatedHeader } from 'src/components/animatedHeader';
import { PageWrapper } from 'src/components/pageWrapper';
import { useAppRoutes } from 'src/hooks';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HomePageProps {

}

export const HomePage: React.FC<HomePageProps> = (props) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const appRoutes = useAppRoutes();

    return (
        <PageWrapper
            containerClassName="home-page"
            pageTitle={t('Pages.HomePage.title')}
            scrollBehaviorOnMount="top"
        >
            <AnimatedHeader>
                Quick Links:
            </AnimatedHeader>
            <Row
                align="middle"
                justify="space-around"
                gutter={20}
            >
                <Col>
                    <Button
                        onClick={() => {
                            navigate(appRoutes.ai.path);
                        }}
                        style={{ width: '250px', height: '100px', borderRadius: '15px' }}
                        type="primary"
                    >
                        <Row
                            align="middle"
                            justify="center"
                        >
                            <Col
                                span={24}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '2em',
                                }}
                            >
                                {appRoutes.ai.icon}
                            </Col>

                            <Col>
                                {appRoutes.ai.title} Page
                            </Col>
                        </Row>

                    </Button>
                </Col>
            </Row>
        </PageWrapper>
    );
};
import * as React from 'react';

import { App, Button, Card, CardProps, Col, Input, Row, Skeleton } from 'antd';
import { clearImageHistory, createImage } from 'src/store/modules/aiModule';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { AnimatedHeader } from 'src/components/animatedHeader';
import { css } from '@emotion/react';
import { useApiErrorMessage } from 'src/hooks/useApiErrorMessage';
import { useTranslation } from 'react-i18next';

interface AiImageProps extends CardProps {

}

export const AiImage: React.FC<AiImageProps> = (props) => {
    const { t } = useTranslation();
    const { getErrorMessage } = useApiErrorMessage();

    const dispatch = useAppDispatch();

    const [prompt, setPrompt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [imageHasError, setImageHasError] = React.useState(false);

    const lastImagePrompt = useAppSelector((state) => state.ai.lastImagePrompt);
    const lastImageUri = useAppSelector((state) => state.ai.lastImageUri);

    const { notification, modal, message } = App.useApp();

    const { ...cardProps } = props;

    return (
        <Card
            {...cardProps}
        >
            <Row
                align="middle"
                justify="center"
                gutter={[10, 10]}
            >
                <Col
                    span={24}
                    style={{ height: '45px', margin: 0, textAlign: 'center' }}
                >
                    <Row
                        align="middle"
                        justify="center"
                        style={{ height: '100%' }}
                        onClick={() => {
                            if (!!lastImagePrompt) {
                                navigator.clipboard.writeText(lastImagePrompt);
                                message.info('Copied to clipboard');
                            }

                        }}
                    >
                        <Col
                            style={{ height: '100%' }}
                        >
                            <AnimatedHeader
                                style={{
                                    margin: 0,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                contextMenu="banana"
                                title={lastImagePrompt}
                            >
                                {lastImagePrompt}
                            </AnimatedHeader>
                        </Col>
                    </Row>

                </Col>
                <Col
                    span={24}
                    style={{ overflowY: 'auto', height: 395, overflowX: 'hidden', textAlign: 'center' }}
                    css={css({
                        '.ant-skeleton': {
                            width: '100%',
                        },
                    })}
                >
                    <Row
                        align="middle"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <Col span={24}>
                            {!!lastImageUri && !imageHasError
                                ?
                                <img
                                    src={lastImageUri}
                                    style={{ width: '100%', maxWidth: 390 }}
                                    onError={(e) => setImageHasError(true)}
                                />
                                :
                                <Skeleton.Image
                                    active={isLoading}
                                    style={{ width: '100%', height: '380px' }}
                                />
                            }
                        </Col>
                    </Row>


                </Col>

                <Col
                    span={24}
                >
                    <Input.Search
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        loading={isLoading}
                        placeholder="Describe the image you want"
                        onSearch={async (value) => {
                            setIsLoading(true);

                            setPrompt('');
                            setImageHasError(false);

                            const action = await dispatch(createImage(value));

                            if (createImage.rejected.match(action)) {
                                notification.error({
                                    message: t('Common.error'),
                                    description: getErrorMessage(action.payload),
                                });
                            }

                            setIsLoading(false);
                        }}
                    />
                </Col>

                <Col
                    span={24}
                >
                    <Row
                        align="middle"
                        justify="center"
                        style={{ padding: 10 }}
                    >
                        <Col>
                            <Button
                                danger={true}
                                type="primary"
                                onClick={() => {
                                    modal.confirm({
                                        title: 'Clear Image History',
                                        content: 'Are you sure you want to delete image history?',
                                        onOk: () => {
                                            dispatch(clearImageHistory());
                                        },
                                    });
                                }}
                            >
                                Clear History
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>

    );
};
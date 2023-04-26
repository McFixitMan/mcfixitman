import * as React from 'react';

import { App, Button, Card, CardProps, Col, Empty, Input, Row, Skeleton, Timeline, theme } from 'antd';
import { LoadingOutlined, QuestionOutlined, RobotFilled, SendOutlined } from '@ant-design/icons';
import { addChatMessage, clearChatHistory, createChat, getLatestChat } from 'src/store/modules/chatModule';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import ReactMarkdown from 'react-markdown';
import { css } from '@emotion/react';
import { useApiErrorMessage } from 'src/hooks/useApiErrorMessage';
import { useTranslation } from 'react-i18next';

interface AiChatProps extends CardProps {

}

export const AiChat: React.FC<AiChatProps> = (props) => {
    const { t } = useTranslation();
    const { getErrorMessage } = useApiErrorMessage();

    const dispatch = useAppDispatch();

    const [prompt, setPrompt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const { token: antdTheme } = theme.useToken();

    const { notification, modal } = App.useApp();

    const chat = useAppSelector((state) => state.chat.chat);
    const isUpdateInProgress = useAppSelector((state) => state.chat.isUpdateInProgress);

    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [chat, isUpdateInProgress]);

    React.useEffect(() => {
        const loadAsync = async (): Promise<void> => {
            const action = await dispatch(getLatestChat());

            if (getLatestChat.rejected.match(action)) {
                notification.error({
                    message: t('Common.error'),
                    description: getErrorMessage(action.payload),
                });
            } else {
                if (!action.payload.chat) {
                    const createAction = await dispatch(createChat());

                    if (createChat.rejected.match(createAction)) {
                        notification.error({
                            message: t('Common.error'),
                            description: getErrorMessage(createAction.payload),
                        });
                    }
                }
            }
        };

        loadAsync();
    }, []);

    const { ...cardProps } = props;

    return (
        <Card
            {...cardProps}
        >
            <Row
                align="middle"
                justify="center"
                gutter={[10, 10]}
                css={css({
                    'pre': {
                        background: antdTheme.colorBgElevated,
                        padding: 10,
                    },
                })}
            >
                <Col
                    span={24}
                    style={{ height: '450px', overflowY: 'auto', overflowX: 'hidden' }}
                    ref={scrollRef}
                >
                    {!!chat?.chatMessages && chat.chatMessages.filter(x => x.role !== 'system').length > 0
                        ?
                        <Timeline
                            style={{ padding: 20 }}
                        >
                            {chat.chatMessages.map((chatMessage) => {
                                if (chatMessage.role === 'user') {
                                    return (
                                        <Timeline.Item
                                            key={`${chatMessage.createdAt}`}
                                            style={{ color: antdTheme.colorTextSecondary }}
                                            dot={<QuestionOutlined style={{ transform: 'scale(1.3)' }} />}
                                        >
                                            <div
                                                style={{ fontSize: '0.8em' }}
                                            >
                                                [{chatMessage.createdAt.toLocaleString()}] YOU:
                                            </div>
                                            <div>
                                                {chatMessage.messageContent}
                                            </div>

                                        </Timeline.Item>
                                    );
                                } else if (chatMessage.role === 'assistant') {
                                    return (
                                        <Timeline.Item
                                            key={`${chatMessage.createdAt}`}
                                            color={antdTheme.colorSuccess}
                                            dot={<RobotFilled style={{ transform: 'scale(1.5)' }} />}

                                        >
                                            <div
                                                style={{ fontSize: '0.8em', fontWeight: 'bold' }}
                                            >
                                                [{chatMessage.createdAt.toLocaleString()}] BOT:
                                            </div>
                                            <div
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                <ReactMarkdown>
                                                    {chatMessage.messageContent}
                                                </ReactMarkdown>

                                            </div>
                                        </Timeline.Item>
                                    );
                                }
                            })}

                            {isUpdateInProgress === true &&
                                <Timeline.Item
                                    key="progress"
                                    color={antdTheme.colorWarning}
                                    dot={<LoadingOutlined />}
                                >
                                    <Skeleton
                                        paragraph={{ rows: 1 }}
                                        active={true}
                                    />
                                </Timeline.Item>
                            }
                        </Timeline>
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Send a message to start chatting" />
                    }
                </Col>

                <Col
                    span={24}
                >
                    <Input.Search
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        loading={isLoading || isUpdateInProgress}
                        placeholder="Say something"
                        enterButton={<SendOutlined />}
                        onSearch={async (value) => {
                            if (!chat || prompt.trim() === '') {
                                return;
                            }
                            setIsLoading(true);

                            setPrompt('');
                            const action = await dispatch(addChatMessage({
                                chatId: chat.id,
                                messageContent: value,
                                role: 'user',
                            }));

                            if (addChatMessage.rejected.match(action)) {
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
                                        title: 'Clear Chat History',
                                        content: 'Are you sure you want to delete chat history?',
                                        onOk: () => {
                                            dispatch(clearChatHistory());
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
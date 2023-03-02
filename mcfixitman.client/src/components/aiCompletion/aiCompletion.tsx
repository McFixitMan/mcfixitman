import * as React from 'react';

import { App, Button, Card, CardProps, Col, Empty, Input, Row, Timeline, theme } from 'antd';
import { QuestionOutlined, RobotFilled } from '@ant-design/icons';
import { clearChatHistory, createCompletion } from 'src/store/modules/aiModule';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { TextToSpeech } from 'src/components/textToSpeech';
import { useApiErrorMessage } from 'src/hooks/useApiErrorMessage';
import { useTranslation } from 'react-i18next';

interface AiCompletionProps extends CardProps {

}

export const AiCompletion: React.FC<AiCompletionProps> = (props) => {
    const { t } = useTranslation();
    const { getErrorMessage } = useApiErrorMessage();

    const dispatch = useAppDispatch();

    const [prompt, setPrompt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const prompts = useAppSelector((state) => state.ai.prompts);
    const completions = useAppSelector((state) => state.ai.completions);

    const { token: antdTheme } = theme.useToken();

    const { notification, modal } = App.useApp();

    const scrollRef = React.useRef<HTMLDivElement>(null);

    const messages = React.useMemo(() => {
        const all = [
            ...prompts,
            ...completions,
        ];

        return all.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
    }, [prompts, completions]);

    React.useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const lastCompletion = React.useMemo(() => {
        return completions[completions.length - 1]?.completion;
    }, [completions]);

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
                    style={{ textAlign: 'end' }}
                >
                    <TextToSpeech textToRead={lastCompletion ?? ''} />
                </Col>
                <Col
                    span={24}
                    style={{ height: '450px', overflowY: 'auto', overflowX: 'hidden' }}
                    ref={scrollRef}
                >
                    {messages.length > 0
                        ?
                        <Timeline
                            style={{ padding: 20 }}
                        >
                            {messages.map((message) => {
                                if (message.messageType === 'prompt') {
                                    return (
                                        <Timeline.Item
                                            key={`${message.sentAt}`}
                                            style={{ color: antdTheme.colorTextSecondary }}
                                            dot={<QuestionOutlined style={{ transform: 'scale(1.3)' }} />}
                                        >
                                            <div
                                                style={{ fontSize: '0.8em' }}
                                            >
                                                [{message.sentAt.toLocaleString()}] YOU:
                                            </div>
                                            <div>
                                                {message.prompt}
                                            </div>

                                        </Timeline.Item>
                                    );
                                } else {
                                    return (
                                        <Timeline.Item
                                            key={`${message.sentAt}`}
                                            color={antdTheme.colorSuccess}
                                            dot={<RobotFilled style={{ transform: 'scale(1.5)' }} />}

                                        >
                                            <div
                                                style={{ fontSize: '0.8em', fontWeight: 'bold' }}
                                            >
                                                [{message.sentAt.toLocaleString()}] BOT:
                                            </div>
                                            <div
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {message.completion}
                                            </div>
                                        </Timeline.Item>
                                    );
                                }
                            })}
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
                        loading={isLoading}
                        placeholder="Say something"
                        onSearch={async (value) => {
                            setIsLoading(true);

                            setPrompt('');
                            const action = await dispatch(createCompletion(value));

                            if (createCompletion.rejected.match(action)) {
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
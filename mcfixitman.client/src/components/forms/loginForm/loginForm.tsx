import * as React from 'react';

import { Button, Col, Form, FormProps, Input, Row } from 'antd';
import { LockFilled, LoginOutlined, MailFilled } from '@ant-design/icons';

import { nameof } from 'ts-simple-nameof';
import { useTranslation } from 'react-i18next';

interface LoginFormValues {
    email: string;
    password: string;
}

interface LoginFormProps extends FormProps<LoginFormValues> {
    isLoading?: boolean;
}

export const LoginForm: React.VFC<LoginFormProps> = (props) => {
    const { t } = useTranslation();
    const [form] = Form.useForm<LoginFormValues>();

    const { isLoading, ...formProps } = props;

    return (
        <Form
            style={{ marginTop: '20px', alignSelf: 'center', ...formProps.style }}
            layout="vertical"
            {...formProps}
            form={form}
        >
            <Form.Item
                required={true}
                label={t('Components.Forms.LoginForm.email_label')}
                rules={[{ required: true }]}
                name={nameof<LoginFormValues>(x => x.email)}
            >
                <Input
                    disabled={isLoading}
                    autoComplete="username"
                    prefix={<MailFilled />}
                    placeholder={t('Components.Forms.LoginForm.email_placeholder') ?? ''}
                />
            </Form.Item>

            <Form.Item
                required={true}
                label={t('Components.Forms.LoginForm.password_label')}
                rules={[{ required: true }]}
                name={nameof<LoginFormValues>(x => x.password)}
            >
                <Input.Password
                    type="password"
                    disabled={isLoading}
                    autoComplete="mcfixitman-password"
                    prefix={<LockFilled />}
                    placeholder={t('Components.Forms.LoginForm.password_placeholder') ?? ''}
                />
            </Form.Item>

            <Row
                align="middle"
                justify="center"
            >
                <Col>
                    <Button
                        htmlType="submit"
                        size="large"
                        type="primary"
                        style={{ alignSelf: 'flex-end' }}
                        icon={<LoginOutlined />}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        {t('Components.Forms.LoginForm.login_button_text')}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};
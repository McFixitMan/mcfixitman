import * as React from 'react';

import { ApiOutlined, BulbOutlined, ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, TooltipProps, theme } from 'antd';

import classNames from 'classnames';
import { useAppSelector } from 'src/types/reduxHelpers';

interface ConnectionIndicatorProps {

}

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = (props) => {
    const antdTheme = theme.useToken().token;

    const isConnecting = useAppSelector(state => state.socket.isConnecting);
    const isConnected = useAppSelector(state => state.socket.isConnected);
    const hasError = useAppSelector(state => state.socket.hasError);
    const errorMessage = useAppSelector(state => state.socket.errorMessage);

    const tooltipProps: TooltipProps = {
        placement: 'bottomLeft',
    };

    if (isConnecting) {
        return (
            <Tooltip
                title="Connecting..."
                {...tooltipProps}
            >
                <Avatar
                    size="small"
                    className={classNames('connection-indicator', 'connecting')}
                    style={{ background: antdTheme.colorWarning }}
                    icon={
                        <LoadingOutlined
                            className="connection-indicator-icon"
                        />
                    }
                />
            </Tooltip>
        );
    }

    if (isConnected) {
        return (
            <Tooltip
                title="Connected"
                {...tooltipProps}
            >
                <Avatar
                    size="small"
                    className={classNames('connection-indicator', 'online')}
                    style={{ background: antdTheme.colorSuccess }}
                    icon={
                        <BulbOutlined
                            className="connection-indicator-icon"
                        />
                    }
                />
            </Tooltip>
        );
    } else {
        if (hasError) {
            return (
                <Tooltip
                    title={errorMessage}
                    {...tooltipProps}
                >
                    <Avatar
                        size="small"
                        className={classNames('connection-indicator', 'offline')}
                        style={{ background: antdTheme.colorError }}
                        icon={
                            <ExclamationCircleOutlined
                                className="connection-indicator-icon"
                            />
                        }
                    />
                </Tooltip>
            );
        } else {
            return (
                <Tooltip
                    title="Disconnected"
                    {...tooltipProps}
                >
                    <Avatar
                        size="small"
                        className={classNames('connection-indicator', 'offline')}
                        icon={
                            <ApiOutlined
                                className="connection-indicator-icon"
                            />
                        }
                    />
                </Tooltip>
            );
        }

    }
};
import * as React from 'react';

import { Avatar, Tooltip } from 'antd';
import { BulbOutlined, DisconnectOutlined } from '@ant-design/icons';

import classNames from 'classnames';
import { useNetwork } from '../../hooks/useNetwork';

interface NetworkIndicatorProps {

}

export const NetworkIndicator: React.FC<NetworkIndicatorProps> = (props) => {
    const networkState = useNetwork();

    if (networkState.online) {
        return (
            <Tooltip
                title="Online"
            >
                <Avatar
                    size="small"
                    className={classNames('network-indicator', { online: networkState.online }, { offline: !networkState.online })}
                    icon={
                        <BulbOutlined
                            className="network-indicator-icon"
                        />
                    }
                />
            </Tooltip>
        );
    } else {
        return (
            <Tooltip
                title="Offline"
            >
                <Avatar
                    size="small"
                    className={classNames('network-indicator', { online: networkState.online }, { offline: !networkState.online })}
                    icon={
                        <DisconnectOutlined
                            className="network-indicator-icon"
                        />
                    }
                />
            </Tooltip>
        );
    }
};
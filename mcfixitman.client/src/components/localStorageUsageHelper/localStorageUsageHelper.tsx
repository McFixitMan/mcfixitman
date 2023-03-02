import * as React from 'react';

import { Col, Collapse, Divider, Row, Tag, theme } from 'antd';
import { LocalStorageUsageInfo, getLocalStorageUsageInfo } from 'src/utility/localStorage';

interface LocalStorageUsageHelperProps {

}

export const LocalStorageUsageHelper: React.FC<LocalStorageUsageHelperProps> = (props) => {
    const antdTheme = theme.useToken().token;

    const [localStorageUsageInfo, setLocalStorageUsageInfo] = React.useState<LocalStorageUsageInfo | undefined>();

    React.useEffect(() => {
        setLocalStorageUsageInfo(getLocalStorageUsageInfo());
    }, []);

    return (
        <Collapse
            className="local-storage-usage-helper"
            style={{
                opacity: 0.8,
                width: '300px',
                border: 'none',
            }}
        >
            <Collapse.Panel
                key="ls"
                header={`Local Storage Usage (${localStorageUsageInfo?.totalLabel})`}
            >
                <Row
                    gutter={[5, 10]}
                    style={{ width: '100%' }}
                >
                    {Object.entries(localStorageUsageInfo?.entryLabels ?? []).map(([key, value]) => {
                        return (
                            <Col
                                key={key}
                                span={24}
                            >
                                <Tag
                                    color={antdTheme.colorPrimaryActive}
                                    style={{ margin: 0 }}
                                >
                                    {key}
                                </Tag>
                                <Tag
                                    color={'default'}
                                    style={{ margin: 0 }}
                                >
                                    {value}
                                </Tag>
                            </Col>

                        );
                    })}
                </Row>


                <Divider />

                <Row
                    align="middle"
                    justify="center"
                >
                    <Tag
                        color={antdTheme.colorPrimaryActive}
                        style={{ margin: 0 }}
                    >
                        Total
                    </Tag>
                    <Tag
                        color={'default'}
                        style={{ margin: 0 }}
                    >
                        {localStorageUsageInfo?.totalLabel}
                    </Tag>
                </Row>
            </Collapse.Panel>

        </Collapse>
    );
};
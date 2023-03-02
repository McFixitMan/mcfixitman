import * as React from 'react';

import { Button, Col, ColProps, Divider, Popover, Row } from 'antd';

import { ConnectionIndicator } from 'src/components/connectionIndicator';
import { FullscreenButton } from 'src/components/fullscreenButton';
import { LanguagePicker } from 'src/components/languagePicker';
import { LoggedInAccount } from 'src/components/loggedInAccount';
import { ReloadButton } from 'src/components/reloadButton';
import { ThemeButton } from 'src/components/themeButton';
import { ToolOutlined } from '@ant-design/icons';
import applicationInfo from 'src/utility/applicationInfo';
import { useFullscreen } from 'src/hooks/useFullscreen';

const appControls: React.FC = (props) => {
    const { version } = applicationInfo;
    const { isFullscreenEnabled } = useFullscreen();

    const [areToolsOpen, setAreToolsOpen] = React.useState(false);

    const colProps: ColProps = {
        span: 24,
        style: { margin: '10px 0' },
    };

    const buttonColProps: ColProps = {
        ...colProps,
        onClick: () => setAreToolsOpen(false),
    };

    return (
        <Popover
            destroyTooltipOnHide={true}
            trigger="click"
            placement="bottomRight"
            onOpenChange={(visible) => setAreToolsOpen(visible)}
            open={areToolsOpen}
            content={
                <Row
                    style={{ maxWidth: '300px' }}
                >
                    <Col
                        {...colProps}
                    >
                        <LanguagePicker
                            style={{ width: '100%' }}
                        />
                    </Col>

                    <Divider />

                    <Col
                        {...buttonColProps}
                    >
                        <ThemeButton
                            style={{ width: '100%' }}
                        />
                    </Col>

                    <Col
                        {...buttonColProps}
                    >
                        <ReloadButton
                            style={{ width: '100%' }}
                        />
                    </Col>

                    {isFullscreenEnabled &&
                        <Col
                            {...buttonColProps}
                        >
                            <FullscreenButton
                                style={{ width: '100%' }}
                            />
                        </Col>
                    }

                    <Col
                        {...buttonColProps}
                    >
                        <LoggedInAccount
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
            }
            title={
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>
                        {`McFixitman v${version}`}
                    </Col>

                    <Col>
                        <ConnectionIndicator />
                    </Col>
                </Row>
            }
        >
            <Button
                icon={<ToolOutlined />}
                style={{ marginRight: 16 }}
                type="dashed"
                onClick={() => setAreToolsOpen(!areToolsOpen)}
                shape="circle"
            />
        </Popover>
    );
};

export const AppControls = React.memo(appControls);
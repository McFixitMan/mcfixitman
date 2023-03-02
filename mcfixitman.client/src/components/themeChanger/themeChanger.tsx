import * as React from 'react';

import { Button, Card, Col, Input, Popover, Radio, Row } from 'antd';
import { CirclePicker, SliderPicker } from 'react-color';
import { setPrimaryColor, setTheme } from 'src/store/modules/themeModule';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';

interface ThemeChangerProps {

}

const defaultColors = [
    '#BF4044', // Reddish
    '#BB5127', // Orangeish
    '#A87732', // Yellowish
    '#2D8660', // Greenish
    '#1373ab', // Blueish
    '#8936a3', // Purplelish
    '#962c86', // Pinkish
];

const themeChanger: React.FC<ThemeChangerProps> = (props) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const isDark = useAppSelector((state) => state.theme.isDark);
    const primaryColor = useAppSelector((state) => state.theme.primaryColor);

    const [currentColor, setCurrentColor] = React.useState(primaryColor);

    React.useEffect(() => {
        setCurrentColor(primaryColor);
    }, [primaryColor]);

    return (
        <Row
            align="middle"
            justify="center"
            gutter={[20, 20]}
        >
            <Col
                span={24}
            >
                <Card
                    title={t('Components.ThemeChanger.theme_header')}
                    style={{ margin: 0, textAlign: 'center' }}
                    size="small"
                >
                    <Radio.Group
                        onChange={(e) => dispatch(setTheme({ isDark: e.target.value }))}
                        value={isDark}
                    >
                        <Radio
                            value={false}
                        >
                            {t('Components.ThemeChanger.light_mode_option_text')}
                        </Radio>

                        <Radio
                            value={true}
                        >
                            {t('Components.ThemeChanger.dark_mode_option_text')}
                        </Radio>
                    </Radio.Group>
                </Card>

            </Col>

            <Col
                span={24}
            >
                <Card
                    title={t('Components.ThemeChanger.color_header')}
                    size="small"
                    style={{ margin: 0, textAlign: 'center' }}
                >
                    <Row
                        align="middle"
                        justify="center"
                        gutter={[20, 10]}
                    >
                        <Col>
                            <CirclePicker
                                color={primaryColor}
                                colors={defaultColors}
                                onChange={(colorResult) => dispatch(setPrimaryColor(colorResult.hex))}
                                css={css({
                                    width: 'auto !important',
                                    // justifyContent: 'center',
                                })}
                            />
                        </Col>

                        <Col>
                            <Popover
                                trigger="click"
                                placement="bottom"
                                arrowPointAtCenter={true}
                                content={(
                                    <div
                                        style={{ minWidth: '350px' }}
                                    >
                                        <SliderPicker
                                            color={currentColor}
                                            onChange={(colorResult) => setCurrentColor(colorResult.hex)}
                                            onChangeComplete={(colorResult, e) => dispatch(setPrimaryColor(colorResult.hex))}
                                        />
                                    </div>
                                )}
                            >
                                <Button
                                    style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                                    shape="round"
                                    size="middle"
                                />
                            </Popover>
                        </Col>

                        <Col
                            span={24}
                        >
                            <Input
                                value={primaryColor}
                                onChange={(e) => dispatch(setPrimaryColor(e.target.value))}
                                style={{ textTransform: 'uppercase' }}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export const ThemeChanger = React.memo(themeChanger);
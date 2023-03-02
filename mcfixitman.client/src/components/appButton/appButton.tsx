import * as React from 'react';

import { Button, ButtonProps, theme } from 'antd';

import classNames from 'classnames';
import { css } from '@emotion/react';
import { tint } from 'src/utility/themeHelper';

interface AppButtonProps extends ButtonProps { }

export const AppButton: React.FC<AppButtonProps> = (props) => {
    const antdTheme = theme.useToken().token;

    const defaultButtonProps: ButtonProps = {
        shape: 'round',
        type: 'default',
    };

    const { ...buttonProps } = props;

    const buttonCss = css({
        fontWeight: 'bold',
        textTransform: 'capitalize',
        margin: '5px 0',
        minWidth: '150px',
        minHeight: '50px',
        whiteSpace: 'normal',
        height: 'auto',
        background: `linear-gradient(${antdTheme.colorBgContainer}, ${tint(-0.1, antdTheme.colorBgContainer)})`,
        boxShadow: `9px 5px 14px -5px ${tint(-0.3, antdTheme.colorBgContainer)}`,
        transitionDuration: '0s',

        ':hover': {
            // color: antdTheme.colorPrimary,
            boxShadow: `9px 5px 14px -5px ${antdTheme.colorBgContainer}`,
            background: `linear-gradient(${antdTheme.colorBgContainer}, ${tint(-0.1, antdTheme.colorBgContainer)})`,
        },
        ':focus': {
            border: `1px solid ${antdTheme.colorPrimary}`,
            background: `linear-gradient(${antdTheme.colorBgContainer}, ${tint(-0.1, antdTheme.colorBgContainer)})`,
        },
        ':active': {
            border: `1px solid ${antdTheme.colorPrimary}`,
            background: `radial-gradient(circle, ${tint(-0.05, antdTheme.colorBgContainer)} 0%, ${antdTheme.colorBgContainer} 75%)`,
        },
        '&.ant-btn': {
            margin: '7px 0',
            minWidth: '150px',
            minHeight: '65px',
            fontSize: '20px',
        },
        '&.ant-btn-sm': {
            margin: '3px 6px',
            minWidth: '100px',
            minHeight: '30px',
            fontSize: '15px',
        },

        '&.ant-btn-lg': {
            margin: '10px 15px',
            minWidth: '200px',
            fontSize: '30px',
            minHeight: '120px',
        },
        '&.ant-btn-primary': {
            background: `linear-gradient(${antdTheme.colorPrimary}, ${tint(-0.1, antdTheme.colorPrimary)})`,
            color: antdTheme.colorWhite,

            '&:hover': {
                background: `linear-gradient(${antdTheme.colorPrimary}, ${tint(-0.3, antdTheme.colorPrimary)})`,
            },

            '&:active': {
                border: `1px solid ${antdTheme.colorPrimary}`,
                background: `radial-gradient(circle, ${tint(-0.15, antdTheme.colorPrimary)} 0%, ${antdTheme.colorPrimary} 75%)`,
                boxShadow: 'none',
            },
        },

        '&.ant-btn-default': {
            border: `1px solid ${tint(-0.2, antdTheme.colorPrimary)}`,
            color: antdTheme.colorPrimary,

            '&:focus': {
                background: `linear-gradient(${antdTheme.colorBgContainer}, ${tint(-0.1, antdTheme.colorBgContainer)})`,
                color: antdTheme.colorPrimary,
            },

            '&:active': {
                border: `1px solid ${antdTheme.colorPrimary}`,
                background: `radial-gradient(circle, ${tint(-0.1, antdTheme.colorBgContainer)} 0%, ${antdTheme.colorBgContainer} 75%)`,
                boxShadow: 'none',
            },

            '&.ant-btn-dangerous': {
                color: antdTheme.colorError,
            },
        },

        '&:disabled': {
            background: antdTheme.colorBgContainerDisabled,
            color: antdTheme.colorTextDisabled,
            border: `1px solid ${antdTheme.colorBgContainerDisabled}`,
            ':hover': {
                background: antdTheme.colorBgContainerDisabled,
                color: antdTheme.colorTextDisabled,
                border: `1px solid ${antdTheme.colorBgContainerDisabled}`,
            },
            ':focus': {
                background: antdTheme.colorBgContainerDisabled,
                color: antdTheme.colorTextDisabled,
                border: `1px solid ${antdTheme.colorBgContainerDisabled}`,
            },
            ':active': {
                background: antdTheme.colorBgContainerDisabled,
                color: antdTheme.colorTextDisabled,
                border: `1px solid ${antdTheme.colorBgContainerDisabled}`,
            },
        },
    });

    return (
        <Button
            {...defaultButtonProps}
            {...buttonProps}
            className={classNames('app-button', buttonProps.className)}
            css={buttonCss}
        >
            {props.children}
        </Button>
    );
};
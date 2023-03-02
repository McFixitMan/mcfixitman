// See https://ant.design/components/grid/#components-grid-demo-useBreakpoint

import * as React from 'react';

import { Grid, Tag, theme } from 'antd';

interface AntdBreakpointHelperProps {

}

export const AntdBreakpointHelper: React.FC<AntdBreakpointHelperProps> = (props) => {
    const breakpoints = Grid.useBreakpoint();

    const antdTheme = theme.useToken().token;

    return (
        <>
            {Object.entries(breakpoints)
                .filter(screen => !!screen[1])
                .map(screen => (
                    <Tag color={antdTheme.colorPrimary} key={screen[0]}>
                        {screen[0]}
                    </Tag>
                ))}
        </>
    );
};
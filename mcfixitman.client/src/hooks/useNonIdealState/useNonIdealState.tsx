import * as React from 'react';

import { NonIdealAction } from 'src/components/pageWrapper/pageWrapperProps';
import { WarningOutlined } from '@ant-design/icons';

interface SetNonIdealStateParams {
    isNonIdeal?: boolean;
    header?: React.ReactNode;
    subheader?: React.ReactNode;
    icon?: React.ReactNode;
    actions?: Array<NonIdealAction>;
}

interface UseNonIdealStateReturn {
    isNonIdeal: boolean;
    header: React.ReactNode;
    subheader: React.ReactNode;
    icon: React.ReactNode;
    actions: Array<NonIdealAction>;
    setNonIdealState: (params: SetNonIdealStateParams) => void;
    resetNonIdealState: () => void;
}

export const useNonIdealState = (): UseNonIdealStateReturn => {

    const [isNonIdeal, setIsNonIdeal] = React.useState(false);
    const [nonIdealHeader, setNonIdealHeader] = React.useState<React.ReactNode>('');
    const [nonIdealSubheader, setNonIdealSubheader] = React.useState<React.ReactNode>('');
    const [nonIdealIcon, setNonIdealIcon] = React.useState<React.ReactNode>(<WarningOutlined />);
    const [nonIdealActions, setNonIdealActions] = React.useState<Array<NonIdealAction>>([]);

    const setNonIdealState = (params: SetNonIdealStateParams): void => {
        setIsNonIdeal(params.isNonIdeal ?? true);
        setNonIdealHeader(params.header ?? '');
        setNonIdealSubheader(params.subheader ?? '');
        setNonIdealIcon(params.icon ?? <WarningOutlined />);
        setNonIdealActions(params.actions ?? []);
    };

    const resetNonIdealState = (): void => {
        setIsNonIdeal(false);
        setNonIdealHeader('');
        setNonIdealSubheader('');
        setNonIdealIcon(<WarningOutlined />);
        setNonIdealActions([]);
    };

    return {
        isNonIdeal: isNonIdeal,
        header: nonIdealHeader,
        subheader: nonIdealSubheader,
        icon: nonIdealIcon,
        actions: nonIdealActions,
        setNonIdealState: setNonIdealState,
        resetNonIdealState: resetNonIdealState,
    };
};
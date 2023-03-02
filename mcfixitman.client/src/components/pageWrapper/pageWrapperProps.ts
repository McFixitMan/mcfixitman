import React, { CSSProperties } from 'react';

import { ColProps } from 'antd';

export type NonIdealAction = 'back' | 'reload' | 'home' | 'logout' | 'login' | { text: string; action: () => void };
export interface PageWrapperProps {
    style?: CSSProperties;

    /**
     * @summary If supplied, a page title for the wrapped content will be rendered
     * 
     * @example pageTitle="Home Page"
     * @example pageTitle={<h1>Home Page</h1>}
     */
    pageTitle?: React.ReactNode;
    /**
     * @summary The class name to add to the container element
     */
    containerClassName?: string;
    /**
     * @summary Indicates that the PageWrapper is in a non-ideal state
     * 
     * @description When in a non-ideal state, an overlay will be displayed preventing
     * further interaction with the wrapped content
     * 
     * @example isNonIdeal={this.props.hasError}
     */
    isNonIdeal?: boolean;
    /**
     * @summary The icon type to show (from antd) when the PageWrapper is in a non-ideal state
     * 
     * Will default to 'meh'
     * 
     * @link https://ant.design/components/icon/
     */
    nonIdealIconType?: React.ReactNode;
    /**
     * @summary A header message to show when the PageWrapper is in a non-ideal state
     */
    nonIdealHeader?: React.ReactNode;
    /**
     * @summary A subheader message to show when the PageWrapper is in a non-ideal state
     */
    nonIdealSubheader?: React.ReactNode;
    /** 
     * @summary Actions to be made available when in a non-ideal state
     * 
     * - back => go back in history
     * - reload => hard reload the page
     * - home => navigate to the /home directory
     * - logout => logout of the app
     * 
     * Can include multiple actions
     * @example nonIdealActions={['back']}
     * @example nonIdealActions={['back', 'reload', 'home']}
     */
    nonIdealActions?: Array<NonIdealAction>;

    /**
     * Indicates whether or not the page is loading
     */
    isLoading?: boolean;
    /**
     * Message to show while isLoading is true
     */
    loadingMessage?: string;

    /**
     * Scroll behavior on mount. 
     * 
     * Top: Scroll to the top of the page wrapper (all content)
     * 
     * Content: Scroll to the start of contect within the wrapper (i.e. after the title)
     * 
     * None: Keep scroll position as is
     * 
     * Defaults to 'content'
     */
    scrollBehaviorOnMount?: 'top' | 'content' | 'none';

    /**
     * Custom antd grid breakpoints for the pageTitle section of PageWrapper
     * 
     * Defaults to:
     * 
     * xxl: 14  
     * xl: 16  
     * lg: 18  
     * md: 20  
     * xm: 24  
     * xs: 24  
     */
    customTitleBreakpoints?: Pick<ColProps, 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'>;

    /**
     * Custom antd grid breakpoints for the content section of PageWrapper
     * 
     * Defaults to:
     * 
     * xxl: 14  
     * xl: 16  
     * lg: 18  
     * md: 20  
     * xm: 24  
     * xs: 24  
     */
    customContentBreakpoints?: Pick<ColProps, 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'>;
}
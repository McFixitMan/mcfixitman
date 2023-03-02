import * as React from 'react';

import { FileSearchOutlined } from '@ant-design/icons';
import { PageWrapper } from 'src/components/pageWrapper';
import { getPathWithoutBase } from 'src/utility/path';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC<unknown> = (props) => {
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <PageWrapper
            isNonIdeal={true}
            nonIdealIconType={<FileSearchOutlined />}
            nonIdealHeader={t('Pages.NotFoundPage.header')}
            nonIdealSubheader={t('Pages.NotFoundPage.subheader', { path: getPathWithoutBase(location.pathname) })}
            nonIdealActions={['back', 'home']}
        />
    );
};
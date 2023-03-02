import * as React from 'react';

import { AlertOutlined } from '@ant-design/icons';
import { PageWrapper } from 'src/components/pageWrapper';
import { useTranslation } from 'react-i18next';

export const NotAuthorizedPage: React.FC<unknown> = (props) => {
    const { t } = useTranslation();

    return (
        <PageWrapper
            isNonIdeal={true}
            nonIdealHeader={t('Pages.NotAuthorizedPage.header')}
            nonIdealSubheader={t('Pages.NotAuthorizedPage.subheader')}
            nonIdealIconType={<AlertOutlined />}
            nonIdealActions={['back', 'home']}
        />
    );
};
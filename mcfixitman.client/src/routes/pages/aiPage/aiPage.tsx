import * as React from 'react';

import { AiCompletion } from 'src/components/aiCompletion';
import { AiImage } from 'src/components/aiImage';
import { PageWrapper } from 'src/components/pageWrapper';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';

interface AiPageProps {

}

export const AiPage: React.FC<AiPageProps> = (props) => {
    const { t } = useTranslation();

    return (
        <PageWrapper
            pageTitle={t('Pages.AiPage.title')}
        >
            <Tabs
                defaultActiveKey="chat"
                items={[
                    {
                        key: 'chat',
                        label: 'AI Chat',
                        children: (
                            <AiCompletion />
                        ),
                    },
                    {
                        key: 'images',
                        label: 'AI Images',
                        children: (
                            <AiImage />
                        ),
                    },
                ]}
            />
        </PageWrapper>
    );
};
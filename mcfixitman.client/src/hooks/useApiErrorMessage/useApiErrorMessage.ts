import { FailedResponse } from 'mcfixitman.shared/types/responses';
import { useTranslation } from 'react-i18next';

export const useApiErrorMessage = (): { getErrorMessage: (failedResponse: FailedResponse | undefined) => string } => {
    const { t, i18n } = useTranslation();

    const getErrorMessage = (failedResponse: FailedResponse | undefined): string => {
        const message = i18n.exists(`Api.FailedResponse.${failedResponse?.key}`)
            ? t(`Api.FailedResponse.${failedResponse?.key}`)
            : failedResponse?.defaultMessage ?? t('Common.unexpected_error') ?? 'An unexpected error occurred';

        return message;
    };

    return { getErrorMessage };
};
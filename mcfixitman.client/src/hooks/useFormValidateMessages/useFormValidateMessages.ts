import { ValidateMessages } from 'rc-field-form/lib/interface';
import { useTranslation } from 'react-i18next';

export const useFormValidateMessages = (): ValidateMessages => {
    const { t } = useTranslation();

    const validateMessages: ValidateMessages = {
        required: t('Common.validation.required_field_message', { field: '${label}' }) ?? 'This field is required',
        types: {
            email: t('Common.validation.valid_email_message', { field: '${label}' }) ?? 'Invalid email',
            number: t('Common.validation.valid_number_message', { field: '${label}' }) ?? 'Invalid number',
        },
        number: {
            range: t('Common.validation.range_number_message', { field: '${label}', min: '${min}', max: '${max}' }) ?? 'Number is out of valid range',
        },
        pattern: {
            mismatch: t('Common.validation.mismatch_pattern_message', { field: '${label}' }) ?? 'Invalid value',
        },
    };

    return validateMessages;
};
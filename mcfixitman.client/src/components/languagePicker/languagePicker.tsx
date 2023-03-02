import * as React from 'react';

import { Select, SelectProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/types/reduxHelpers';

import { supportedLanguages } from 'src/i18n/config';
import { updateLanguage } from 'src/store/modules/localeModule';

interface LanguagePickerProps extends SelectProps<string> {

}

export const LanguagePicker: React.FC<LanguagePickerProps> = (props) => {
    const dispatch = useAppDispatch();

    const currentLocale = useAppSelector((state) => state.locale.currentLocale);

    return (
        <Select
            onChange={async (newValue) => {
                dispatch(updateLanguage(newValue));
            }}
            value={currentLocale}
            {...props}
        >
            {supportedLanguages.map((lang) => {
                return (
                    <Select.Option
                        key={lang.key}
                        value={lang.key}
                    >
                        {lang.title}
                    </Select.Option>
                );
            })}
        </Select>
    );
};
import { Locale } from 'antd/es/locale-provider';

export interface LocaleState {
    readonly currentLocale: string;
    readonly antdLocale: Locale;
    readonly dayJsLocale: string;
}
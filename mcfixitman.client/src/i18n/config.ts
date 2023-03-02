import en from './locales/en/translations.json';
// import es from './locales/es/translations.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import zh from './locales/zh/translations.json';

export const defaultNS = 'translations';

export const supportedLanguages = [
    {
        key: 'en',
        title: 'English',
    },
    // {
    //     key: 'es',
    //     title: 'Español',
    // },
    // {
    //     key: 'zh',
    //     title: '中國人',
    // },
];

const resources = {
    en: {
        translations: en,
    },
    // es: {
    //     translations: es,
    // },
    // zh: {
    //     translations: zh,
    // },
};

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: resources,
    ns: ['translations'],
    defaultNS: 'translations',
});

i18n.languages = supportedLanguages.map(x => x.key);

export { i18n };
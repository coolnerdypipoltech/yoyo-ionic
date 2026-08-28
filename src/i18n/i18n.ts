import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enMain from './locales/en/main.json';
import enProfile from './locales/en/profile.json';
import enFaqs from './locales/en/faqs.json';
import enErrors from './locales/en/errors.json';

//import esCommon from './locales/es/common.json';
//import esMain from './locales/es/main.json';
//import esProfile from './locales/es/profile.json';
//import esFaqs from './locales/es/faqs.json';
//import esErrors from './locales/es/errors.json';

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
//      es: { common: esCommon, auth: esAuth, main: esMain, profile: esProfile, faqs: esFaqs, errors: esErrors },
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, auth: enAuth, main: enMain, profile: enProfile, faqs: enFaqs, errors: enErrors },

    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['common', 'auth', 'main', 'profile', 'faqs', 'errors'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;

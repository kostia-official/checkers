import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDetector } from '@src/lang/languageDetector';
import { en } from '@src/lang/text/en';
import { ua } from '@src/lang/text/ua';

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: { en, ua },
  });

export default i18n;

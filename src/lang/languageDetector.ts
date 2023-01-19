import { LanguageDetectorModule } from 'i18next';
import { Lang } from '@src/lang/types';

const languages: Lang[] = ['en', 'ua'];

export const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  cacheUserLanguage: (lang) => {
    localStorage.setItem('lang', lang);
  },
  detect: () => {
    const cachedLang = localStorage.getItem('lang') as Lang | null;
    if (cachedLang && languages.includes(cachedLang)) {
      return cachedLang;
    }

    const hasRuLang = navigator.languages.includes('ru');
    const hasUaLang = navigator.languages.includes('uk');

    return hasRuLang || hasUaLang ? 'ua' : 'en';
  },
};

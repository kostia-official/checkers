import { en } from '@src/lang/text/en';
import { ua } from '@src/lang/text/ua';

export type Lang = 'en' | 'ua';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      en: typeof en.translation;
      ua: typeof ua.translation;
    };
  }
}

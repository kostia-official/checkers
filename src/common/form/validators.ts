import { t } from 'i18next';

export const required = (value?: string) => {
  return value?.trim() ? null : t('validation.required');
};

import { t } from 'i18next';

export const requiredString = (value?: string) => {
  return value?.trim() ? null : t('validation.required');
};

export const requiredNumber = (value?: number) => {
  return value != null ? null : t('validation.required');
};

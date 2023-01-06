import { FieldValue } from 'firebase/firestore';

export type WithFieldValue<T> = {
  [P in keyof T]: T[P] | FieldValue;
};

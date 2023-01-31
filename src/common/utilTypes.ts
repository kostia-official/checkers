import { FieldValue } from 'firebase/firestore';
import React from 'react';

export type WithFieldValue<T> = {
  [P in keyof T]: T[P] | FieldValue;
};

export type GetComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P>
  ? P
  : never;

export type ExtendProps<T, P> = React.FC<GetComponentProps<T> & P>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

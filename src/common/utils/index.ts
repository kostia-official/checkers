import { Color } from '../types';
import { QuerySnapshot } from 'firebase/firestore';

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const toggleColor = (color: Color) => {
  return color === Color.White ? Color.Black : Color.White;
};

export const noop = () => {};
export const noopAsync = async () => {};

export function getSnapshotData<T>(querySnapshot: QuerySnapshot<T>) {
  const result: T[] = [];

  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return result;
}

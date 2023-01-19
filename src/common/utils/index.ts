import { Color, BoardState, Position, Piece } from '../types';
import { QuerySnapshot } from 'firebase/firestore';

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const toggleColor = (color: Color) => {
  return color === Color.White ? Color.Black : Color.White;
};

export const isEqualPosition = (a: Position, b: Position) => {
  return a[0] === b[0] && a[1] === b[1];
};

export const hasPosition = (positions: Position[], position: Position) => {
  return positions.some((p) => isEqualPosition(p, position));
};

export const getSquare = (boardState: BoardState, [i, j]: Position) => {
  return boardState[i]?.[j];
};

export const getSquares = (boardState: BoardState, from: Position, to: Position) => {
  const fromSquare = getSquare(boardState, from);
  const toSquare = getSquare(boardState, to);

  return { fromSquare, toSquare };
};

export const getPiece = (boardState: BoardState, position: Position): Piece | undefined => {
  return getSquare(boardState, position)?.piece;
};

export const getPieces = (boardState: BoardState, from: Position, to: Position) => {
  const fromPiece = getPiece(boardState, from);
  const toPiece = getPiece(boardState, to);

  return { fromPiece, toPiece };
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

export type GameType = 'internation' | 'draughts64';

export enum Color {
  Black = 'black',
  White = 'white',
}

export interface Square {
  piece: Color | null;
  isKing: boolean;
}

export type BoardState = Square[][];

export interface GameState {
  boardState: BoardState;
  currentPlayer: Color;
  selectedPiece: Coordinates | null;
  hasMadeCapture: boolean;
}

export type GameStateHistory = Array<{
  boardState: BoardState;
  currentPlayerColor: Color;
}>;

export type Coordinates = [number, number];

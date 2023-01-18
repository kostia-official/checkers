import { GamePlayerModel } from '@services/types';

export type GameType = 'internation' | 'draughts64' | 'frisian';

export enum Color {
  Black = 'black',
  White = 'white',
}

export interface Square {
  piece: Color | null;
  isKing: boolean;
  pendingCapture?: boolean;
}

export type BoardState = Square[][];

export interface GameState {
  boardState: BoardState;
  currentPlayer: Color;
  selectedPiece: Position | null;
  hasMadeCapture: boolean;
}

export type GameStateHistory = Array<{
  boardState: BoardState;
  currentPlayerColor: Color;
}>;

export type Position = [number, number];

export interface GamePlayerExtended extends GamePlayerModel {
  name: string;
  isOnline: boolean;
}

export interface GamePlayers {
  inviter: GamePlayerModel;
  invitee?: GamePlayerModel;
  currentUserPlayer?: GamePlayerModel;
  opponent?: GamePlayerModel;
}

import { GamePlayerModel } from '@services/types';

export type GameType = 'internation' | 'draughts64' | 'frisian';

export enum Color {
  Black = 'black',
  White = 'white',
}

export interface Piece {
  id: number;
  color: Color;
  isKing: boolean;
  pendingCapture?: boolean;
}

export interface Square {
  piece?: Piece;
}

export type BoardState = Square[][];

export type LimitedJumpsCount = Record<string, number>;

export interface GameState {
  boardState: BoardState;
  currentPlayer: Color;
  selectedPiece: Position | undefined;
  limitedJumpsCount: LimitedJumpsCount;
  gameAlerts: GameAlert[];
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

export interface GameAlert {
  message: string;
  createdAt: Date;
}

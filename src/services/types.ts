import { GameType, Color, Coordinates, BoardState } from '../common/types';

export interface GameModel {
  id: string;
  gameType: GameType;
  inviterId: string;
  inviterColor: Color;
  inviteeId?: string;
  inviteeColor?: Color;
  winnerId?: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export type CreateGameInput = Pick<GameModel, 'gameType' | 'inviterId' | 'inviterColor'>;
export type UpdateGameInput = Partial<Omit<GameModel, 'id'>>;

export interface GameHistoryModel {
  id: string;
  gameId: string;
  jumpFrom?: Coordinates;
  jumpTo?: Coordinates;
  boardState: BoardState;
  currentPlayerColor: Color;
  currentPlayerId?: string;
  createdAt: Date;
}

export type AddGameHistoryInput = Omit<GameHistoryModel, 'id' | 'createdAt'>;

export interface UserModel {
  id: string;
  name: string;
  createdAt: Date;
}

export type CreateUserInput = Pick<UserModel, 'name'>;

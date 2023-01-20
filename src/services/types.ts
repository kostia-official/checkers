import { GameType, Color, Position, BoardState, LimitedJumpsCount } from '@common/types';

export interface GameModel {
  id: string;
  gameType: GameType;
  inviterId: string;
  inviteeId?: string;
  winnerId?: string;
  isDraw?: boolean;
  nextGameId?: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export type CreateGameInput = Pick<GameModel, 'gameType' | 'inviterId' | 'inviteeId'>;
export type UpdateGameInput = Partial<Omit<GameModel, 'id'>>;

export interface GamePlayerModel {
  id: string;
  gameId: string;
  userId: string;
  color: Color;
  isReady: boolean;
  joinedAt: Date;
}
export type CreateGamePlayerInput = Omit<GamePlayerModel, 'id' | 'joinedAt'>;
export type UpdateGamePlayerInput = Partial<Omit<GamePlayerModel, 'id'>>;

export interface GameHistoryModel {
  id: string;
  gameId: string;
  jumpFrom?: Position;
  jumpTo?: Position;
  boardState: BoardState;
  limitedJumpsCount: LimitedJumpsCount;
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

export type RequestType = 'draw' | 'undoMove';

export interface RequestModel {
  id: string;
  gameId: string;
  senderId: string;
  receiverId: string;
  type: RequestType;
  acceptedAt?: Date;
  declinedAt?: Date;
  responseAckAt?: Date;
  createdAt: Date;
}

export type CreateRequestInput = Omit<RequestModel, 'id' | 'createdAt'>;
export type UpdateRequestInput = Partial<CreateRequestInput>;

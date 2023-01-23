import { GameType, Color, Position, BoardState, LimitedJumpsCount } from '@common/types';

export interface RoomModel {
  id: string;
  createdById: string;
  createdAt: Date;
}

export type CreateRoomInput = Omit<RoomModel, 'id' | 'createdAt'>;

export interface GameModel {
  id: string;
  gameType: GameType;
  roomId: string;
  inviterId: string;
  inviteeId?: string;
  winnerId?: string;
  isDraw?: boolean;
  nextGameId?: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export type CreateGameInput = Pick<GameModel, 'gameType' | 'inviterId' | 'inviteeId' | 'roomId'>;
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
  language: string;
  pushToken?: string;
  createdAt: Date;
}

export type CreateUserInput = Pick<UserModel, 'name' | 'language'>;
export type UpdateUserInput = Partial<Omit<UserModel, 'id' | 'createdAt'>>;

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

export type MessageType = 'user' | 'system';

export interface MessageModel {
  id: string;
  gameId: string;
  roomId: string;
  senderId: string;
  text: string;
  type: MessageType;
  createdAt: Date;
}

export type SendMessageInput = Omit<MessageModel, 'id' | 'createdAt' | 'senderId'>;

import { GameModel, UserModel } from '@services/types';

export interface HookArgs {
  game: GameModel;
  user: UserModel;
}

export const useResolvedGameInfo = ({ game, user }: HookArgs) => {
  const { inviterId, inviteeId } = game;

  const isInviter = inviterId === user.id;
  const opponentId = isInviter ? inviteeId : inviterId;
  const isGameStarted = !!game.startedAt;
  const isGameFinished = !!game.endedAt;

  return { isInviter, opponentId, isGameStarted, isGameFinished };
};

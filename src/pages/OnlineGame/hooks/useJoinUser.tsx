import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { JoinGameArgs, gameService } from '@services/game.service';
import { UserModel, GameModel } from '@services/types';
import { toggleColor } from '@common/utils';

export interface HookArgs {
  user: UserModel;
  game: GameModel;
}

export const useJoinUser = ({ user, game }: HookArgs) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isInvitee, setIsInvitee] = useState(game.inviteeId === user.id);
  const [isSpectator, setIsSpectator] = useState(false);
  const { mutateAsync: joinGame } = useMutation((args: JoinGameArgs) => gameService.joinGame(args));

  const isInviter = game.inviterId === user.id;
  const allPlacesFull = game.inviteeId && game.inviterId;

  useEffect(() => {
    (async () => {
      if (isJoined) return;

      if (isInviter || isInvitee) {
        setIsJoined(true);
      } else if (!game?.inviteeId) {
        setIsJoined(true);
        setIsInvitee(true);
        await joinGame({
          id: game.id,
          inviteeId: user.id,
          inviteeColor: toggleColor(game.inviterColor),
        });
      } else if (!isInviter && !isInvitee && allPlacesFull) {
        setIsSpectator(true);
        setIsJoined(true);
      }
    })();
  }, [
    game.id,
    game?.inviteeId,
    game.inviterColor,
    game.inviterId,
    joinGame,
    isJoined,
    user.id,
    allPlacesFull,
    isInviter,
    isInvitee,
  ]);

  return { isJoined, isSpectator, isInviter, isInvitee };
};

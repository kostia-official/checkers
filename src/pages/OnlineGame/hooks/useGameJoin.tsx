import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { JoinGameArgs, gameService } from '@services/game.service';
import { UserModel, GameModel } from '@services/types';
import { toggleColor } from '@common/utils';
import { useNavigate } from 'react-router-dom';
import { GamePlayers } from '@common/types';

export interface HookArgs {
  user: UserModel;
  game: GameModel;
  gamePlayers: GamePlayers;
}

export const useGameJoin = ({ user, game, gamePlayers: { inviter } }: HookArgs) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isInvitee, setIsInvitee] = useState(game.inviteeId === user.id);
  const [isSpectator, setIsSpectator] = useState(false);
  const { mutateAsync: joinGame } = useMutation((args: JoinGameArgs) => gameService.joinGame(args));

  const navigate = useNavigate();

  const isInviter = game.inviterId === user.id;
  const isInviterJoined = !!game.inviterId;
  const isInviteeJoined = !!game.inviteeId;
  const allPlacesFull = isInviteeJoined && isInviterJoined;

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
          inviteeColor: toggleColor(inviter.color),
        });
      } else if (!isInviter && !isInvitee && allPlacesFull) {
        setIsSpectator(true);
        setIsJoined(true);
      }
    })();
  }, [
    game.id,
    game?.inviteeId,
    inviter.color,
    game.inviterId,
    joinGame,
    isJoined,
    user.id,
    allPlacesFull,
    isInviter,
    isInvitee,
  ]);

  useEffect(() => {
    if (game.endedAt && game.nextGameId) {
      navigate(`/game/${game.nextGameId}?continue=1`);
    }
  }, [game.nextGameId, game.endedAt, navigate]);

  return { isJoined, isSpectator, isInviter, isInvitee, isInviteeJoined };
};

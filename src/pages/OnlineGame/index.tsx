import React from 'react';
import { useQuery } from 'react-query';
import { gameService } from '@services/game.service';
import { useParams, useSearchParams } from 'react-router-dom';
import { CenteredLoader } from '@components/CenteredLoader';
import { GameModel } from '@services/types';
import { userService } from '@services/user.service';
import { queryClient } from '@src/queryClient';
import { gameHistoryService } from '@services/gameHistory.service';
import { NewUserJoinModal } from './components/NewUserJoinModal';
import { gamePlayerService } from '@services/gamePlayer.service';
import { useSubscription } from '@src/hooks/useSubscription';
import { OnlineGameWithData } from '@pages/OnlineGame/OnlineGameWithData';

export const OnlineGame: React.FC = () => {
  const { gameId } = useParams();

  const { data: game } = useQuery(['games', gameId], () => gameService.get(gameId!), {
    enabled: !!gameId,
    refetchOnWindowFocus: 'always',
  });
  const { data: user, isError: isGetUserError } = useQuery('currentUser', () =>
    userService.getCurrent()
  );
  const { data: gameHistory } = useQuery(
    ['gameHistory', gameId],
    () => gameHistoryService.getByGameId(gameId!),
    { enabled: !!gameId, refetchOnWindowFocus: 'always' }
  );
  const { data: inviter } = useQuery(
    ['gamePlayer', gameId, game?.inviterId],
    () => gamePlayerService.get({ userId: game?.inviterId!, gameId: game?.id! }),
    { enabled: !!game?.inviterId, refetchOnWindowFocus: 'always' }
  );
  const { data: invitee } = useQuery(
    ['gamePlayer', gameId, game?.inviteeId],
    () => gamePlayerService.get({ userId: game?.inviteeId!, gameId: game?.id! }),
    { enabled: !!game?.inviteeId, refetchOnWindowFocus: 'always' }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(inviter?.id!, (data) => {
        queryClient.setQueryData(['gamePlayer', gameId, game?.inviterId], data);
      }),
    { enable: inviter?.id && gameId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(invitee?.id!, (data) => {
        queryClient.setQueryData(['gamePlayer', gameId, game?.inviteeId], data);
      }),
    { enable: invitee?.id && gameId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(invitee?.id!, (data) => {
        queryClient.setQueryData(['invitee', gameId], data);
      }),
    { enable: invitee?.id && gameId }
  );

  useSubscription(
    () =>
      gameHistoryService.onUpdatedByGameId(gameId!, (data) => {
        queryClient.setQueryData(['gameHistory', gameId], data);
      }),
    { enable: gameId }
  );

  useSubscription(
    () =>
      gameService.onUpdate(gameId!, (game: GameModel) => {
        queryClient.setQueryData(['games', gameId], game);
      }),
    { enable: gameId }
  );

  let [searchParams] = useSearchParams();
  const isContinue = searchParams.get('continue') === '1';
  const isWaitForInvitee = isContinue ? invitee : true;

  return (
    <>
      <NewUserJoinModal noUser={isGetUserError && !user} game={game} />

      {!game || !user || !gameHistory || !inviter || !isWaitForInvitee ? (
        <CenteredLoader />
      ) : (
        <OnlineGameWithData
          game={game}
          user={user}
          gameHistory={gameHistory}
          inviter={inviter}
          invitee={invitee}
        />
      )}
    </>
  );
};

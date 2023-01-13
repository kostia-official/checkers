import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex } from '@mantine/core';
import { GameModel, UserModel } from '@services/types';
import { useResolvedGameInfo } from '@pages/OnlineGame/hooks/useResolvedGameInfo';
import { useGameRequestsSending } from '@pages/OnlineGame/hooks/useGameRequestsSending';
import { useNewGame } from '@pages/OnlineGame/hooks/useNewGame';
import { GamePlayers } from '@common/types';

export interface GameResultsButtonsProps {
  game: GameModel;
  user: UserModel;
  gamePlayers: GamePlayers;
  setWinner: (winnerId: string) => Promise<void>;
  setIsDraw: () => Promise<void>;
  isOwnMove: boolean;
}

export const GameResultsButtons: React.FC<GameResultsButtonsProps> = ({
  game,
  user,
  setWinner,
  isOwnMove,
  gamePlayers,
}) => {
  const { t } = useTranslation();
  const { continueWithNewGame } = useNewGame();

  const { opponentId, isGameStarted, isGameFinished } = useResolvedGameInfo({ game, user });
  const { createRequest, isActiveDrawRequest } = useGameRequestsSending({
    gameId: game.id,
    userId: user.id,
    opponentId,
  });

  const onResign = useCallback(async () => {
    if (!opponentId) return;

    await setWinner(opponentId);
    await continueWithNewGame(game, gamePlayers);
  }, [continueWithNewGame, game, gamePlayers, opponentId, setWinner]);

  const onDrawRequest = useCallback(async () => {
    await createRequest('draw');
  }, [createRequest]);

  if (!isGameStarted || isGameFinished || !opponentId) return null;

  return (
    <Flex gap="xs">
      <Button
        fullWidth
        onClick={onDrawRequest}
        loading={isActiveDrawRequest}
        loaderProps={{ size: 'xs' }}
        disabled={!isOwnMove}
      >
        {t('onlineMenu.drawButton')}
      </Button>

      <Button fullWidth onClick={onResign}>
        {t('onlineMenu.resignButton')}
      </Button>
    </Flex>
  );
};

import { useMemo, useEffect, useCallback } from 'react';
import { GameModel } from '@services/types';
import { ICheckersStrategy } from '@strategies/draughts-strategy.interface';
import { useMutation } from 'react-query';
import { gameService, FinishGameArgs } from '@services/game.service';
import { GameState, Color, GamePlayers } from '@common/types';
import { useTranslation } from 'react-i18next';
import { getPlayerTimeLeft } from '@common/utils/playerTime';

export interface HookArgs {
  game: GameModel;
  gamePlayers: GamePlayers;
  strategy: ICheckersStrategy;
  gameState: GameState;
  isEditMode: boolean;
  isOwnMove: boolean;
}

export const useGameFinish = ({
  game,
  strategy,
  isEditMode,
  gameState,
  gamePlayers,
  isOwnMove,
}: HookArgs) => {
  const { t } = useTranslation();

  const { mutateAsync: finishGame } = useMutation((args: FinishGameArgs) =>
    gameService.finishGame(args)
  );
  const { mutateAsync: unfinishGame } = useMutation((id: string) => gameService.unfinishGame(id));

  const setWinner = useCallback(
    async (winnerId: string) => {
      await finishGame({
        id: game.id,
        winnerId,
      });
    },
    [finishGame, game.id]
  );

  const setIsDraw = useCallback(async () => {
    await finishGame({
      id: game.id,
      isDraw: true,
    });
  }, [finishGame, game.id]);

  const clearWinner = useCallback(async () => {
    await unfinishGame(game.id);
  }, [game.id, unfinishGame]);

  const { winnerId, inviteeId, inviterId, startedAt, endedAt } = game;

  const inviterColor = gamePlayers.inviter.color;
  const inviteeColor = gamePlayers.invitee?.color;

  const winnerColor = useMemo(() => {
    if (!winnerId) return;

    if (winnerId === inviteeId) return inviteeColor;
    if (winnerId === inviterId) return inviterColor;
  }, [inviteeColor, inviteeId, inviterColor, inviterId, winnerId]);

  useEffect(() => {
    (async () => {
      if (isEditMode || !startedAt) {
        return;
      }

      const winnerColor = strategy.getWinner(gameState);
      const winnerId = winnerColor === inviterColor ? inviterId : inviteeId!;

      if (winnerColor) {
        await setWinner(winnerId);
      }
    })();
  }, [gameState, inviteeId, inviterColor, inviterId, isEditMode, setWinner, startedAt, strategy]);

  const isOpponentLostByTime = useCallback(() => {
    const { currentUserPlayer, opponent } = gamePlayers;
    if (!currentUserPlayer?.lastMovedAt || !opponent?.lastMovedAt) return false;

    const { tickingTimeLeftMs, staticTimeLeftMs } = getPlayerTimeLeft({
      timeSpentMs: opponent.timeSpentMs,
      moveStartedAt: currentUserPlayer.lastMovedAt,
      timeLimitSeconds: game.timeLimitSeconds,
    });
    const opponentTimeLeftMs = isOwnMove ? staticTimeLeftMs : tickingTimeLeftMs;

    return opponentTimeLeftMs <= 0;
  }, [game.timeLimitSeconds, gamePlayers, isOwnMove]);

  useEffect(() => {
    if (!startedAt) return;

    const interval = setInterval(async () => {
      if (!gamePlayers.currentUserPlayer) return;

      if (isOpponentLostByTime()) {
        await setWinner(gamePlayers.currentUserPlayer.userId);
      }
    }, 1000);

    if (endedAt) {
      clearInterval(interval);
      return;
    }

    return () => clearInterval(interval);
  }, [
    startedAt,
    endedAt,
    isOwnMove,
    gamePlayers.currentUserPlayer,
    isOpponentLostByTime,
    setWinner,
  ]);

  const winnerLabel = useMemo(() => {
    if (!winnerColor) return;

    return winnerColor === Color.White ? t('winner.white') : t('winner.black');
  }, [t, winnerColor]);

  return { winnerColor, setWinner, setIsDraw, clearWinner, winnerLabel };
};

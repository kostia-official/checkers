import { useMemo, useEffect, useCallback } from 'react';
import { GameModel } from '@services/types';
import { ICheckersStrategy } from '@strategies/draughts-strategy.interface';
import { useMutation } from 'react-query';
import { gameService, FinishGameArgs } from '@services/game.service';
import { GameState, Color, GamePlayers } from '@common/types';
import { useTranslation } from 'react-i18next';

export interface HookArgs {
  game: GameModel;
  gamePlayers: GamePlayers;
  strategy: ICheckersStrategy;
  gameState: GameState;
  isEditMode: boolean;
}

export const useGameFinish = ({ game, strategy, isEditMode, gameState, gamePlayers }: HookArgs) => {
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

  const { winnerId, inviteeId, inviterId, startedAt } = game;
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
  }, [
    gameState,
    isEditMode,
    inviterColor,
    inviterId,
    inviteeId,
    strategy,
    clearWinner,
    setWinner,
    startedAt,
  ]);

  const winnerLabel = useMemo(() => {
    if (!winnerColor) return;

    return winnerColor === Color.White ? t('winner.white') : t('winner.black');
  }, [t, winnerColor]);

  return { winnerColor, setWinner, setIsDraw, clearWinner, winnerLabel };
};

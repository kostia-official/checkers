import { useMemo, useEffect, useCallback } from 'react';
import { GameModel } from '@services/types';
import { ICheckersStrategy } from '@strategies/checkers-strategy.interface';
import { useMutation } from 'react-query';
import { gameService, FinishGameArgs } from '@services/game.service';
import { GameState } from '@common/types';

export interface HookArgs {
  game: GameModel;
  strategy: ICheckersStrategy;
  gameState: GameState;
  isEditMode: boolean;
}

export const useWinner = ({ game, strategy, isEditMode, gameState }: HookArgs) => {
  const { mutateAsync: finishGame } = useMutation((args: FinishGameArgs) => gameService.finishGame(args));
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

  const clearWinner = useCallback(async () => {
    await unfinishGame(game.id);
  }, [game.id, unfinishGame]);

  const { winnerId, inviteeId, inviterId, inviterColor, inviteeColor } = game;

  const winnerColor = useMemo(() => {
    if (!winnerId) return;

    if (winnerId === inviteeId) return inviteeColor;
    if (winnerId === inviterId) return inviterColor;
  }, [inviteeColor, inviteeId, inviterColor, inviterId, winnerId]);

  useEffect(() => {
    (async () => {
      if (isEditMode) {
        await clearWinner();
        return;
      }

      const winnerColor = strategy.getWinner(gameState);
      const winnerId = winnerColor === inviterColor ? inviterId : inviteeId!;

      if (winnerColor) {
        await setWinner(winnerId);
      }
    })();
  }, [gameState, isEditMode, inviterColor, inviterId, inviteeId, strategy, clearWinner, setWinner]);

  return { winnerColor, setWinner, clearWinner };
};

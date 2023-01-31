import { GamePlayerModel, UpdateGamePlayerInput, GameModel } from '@services/types';
import { useMutation } from 'react-query';
import { gamePlayerService } from '@services/gamePlayer.service';
import { WithFieldValue } from '@common/utilTypes';
import { useCallback } from 'react';

export interface HookArgs {
  game: GameModel;
  currentUserPlayer?: GamePlayerModel;
  opponent?: GamePlayerModel;
}

export const usePlayerTimeUpdate = ({ currentUserPlayer, opponent, game }: HookArgs) => {
  const { mutateAsync: updateGamePlayer } = useMutation(
    ({ id, input }: { id: string; input: WithFieldValue<UpdateGamePlayerInput> }) =>
      gamePlayerService.update(id, input)
  );

  const updatePlayerTime = useCallback(async () => {
    if (!currentUserPlayer?.lastMovedAt || !opponent?.lastMovedAt || !game.startedAt) {
      console.error('Cannot update player time', {
        currentUserPlayer,
        opponent,
        startedAt: game?.startedAt,
      });
      return;
    }

    const lastMoveTimeSpendMs = Date.now() - +opponent.lastMovedAt;
    const timeSpendMs =
      currentUserPlayer.timeSpentMs + lastMoveTimeSpendMs - game.moveTimeIncSeconds * 1000;

    await updateGamePlayer({
      id: currentUserPlayer.id,
      input: { timeSpentMs: timeSpendMs, lastMovedAt: new Date() },
    });
  }, [currentUserPlayer, game.moveTimeIncSeconds, game.startedAt, opponent, updateGamePlayer]);

  return { updatePlayerTime };
};

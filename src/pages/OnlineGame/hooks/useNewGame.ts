import { useMutation } from 'react-query';
import { GameModel, UpdateGameInput } from '@services/types';
import { gameService, CreateNewGameData } from '@services/game.service';
import { useNavigate } from 'react-router-dom';
import { toggleColor } from '@common/utils';
import { GamePlayers } from '@common/types';

export const useNewGame = () => {
  const { mutateAsync: createNewGame } = useMutation((input: CreateNewGameData) => gameService.createNewGame(input));
  const { mutateAsync: updateGame } = useMutation(({ id, input }: { id: string; input: UpdateGameInput }) =>
    gameService.update(id, input)
  );

  const navigate = useNavigate();

  const startNewGame = async (input: CreateNewGameData) => {
    const newGame = await createNewGame(input);

    navigate(`/game/${newGame.id}`);
  };

  const continueWithNewGame = async (game: GameModel, { inviter }: GamePlayers) => {
    const newGame = await createNewGame({
      inviterId: game.inviterId,
      inviteeId: game.inviteeId,
      gameType: game.gameType,
      inviteeColor: inviter.color,
      inviterColor: toggleColor(inviter.color),
    });

    await updateGame({ id: game.id, input: { nextGameId: newGame.id } });
  };

  return { startNewGame, continueWithNewGame };
};

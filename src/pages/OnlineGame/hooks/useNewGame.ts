import { useMutation } from 'react-query';
import { GameModel, UpdateGameInput, CreateRoomInput } from '@services/types';
import { gameService, CreateNewGameData } from '@services/game.service';
import { useNavigate } from 'react-router-dom';
import { toggleColor } from '@common/utils';
import { GamePlayers } from '@common/types';
import { roomService } from '@services/room.service';

export const useNewGame = () => {
  const { mutateAsync: createRoom } = useMutation((input: CreateRoomInput) =>
    roomService.create(input)
  );
  const { mutateAsync: createNewGame } = useMutation((input: CreateNewGameData) =>
    gameService.createNewGame(input)
  );
  const { mutateAsync: updateGame } = useMutation(
    ({ id, input }: { id: string; input: UpdateGameInput }) => gameService.update(id, input)
  );

  const navigate = useNavigate();

  const startNewGame = async (input: Omit<CreateNewGameData, 'roomId'>) => {
    const room = await createRoom({ createdById: input.inviterId });
    const newGame = await createNewGame({ ...input, roomId: room.id });

    navigate(`/game/${newGame.id}`);
  };

  const continueWithNewGame = async (game: GameModel, { inviter }: GamePlayers) => {
    const newGame = await createNewGame({
      roomId: game.roomId,
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

import { GameModel, UserModel } from '@src/services/types';
import { useQuery } from 'react-query';
import { userService } from '@services/user.service';

export interface HookArgs {
  game: GameModel;
  user: UserModel;
}

export const useGameUsers = ({ game, user }: HookArgs) => {
  const { data: inviterUser } = useQuery(
    ['user', game.inviterId],
    () => userService.get(game.inviterId!),
    {
      enabled: !!game.inviterId,
      initialData: game.inviterId === user.id ? user : undefined,
    }
  );
  const { data: inviteeUser } = useQuery(
    ['user', game.inviteeId],
    () => userService.get(game.inviteeId!),
    {
      enabled: !!game.inviteeId,
      initialData: game.inviteeId === user.id ? user : undefined,
    }
  );

  return { inviterUser, inviteeUser };
};

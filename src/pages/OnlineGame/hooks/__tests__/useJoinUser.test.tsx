import { renderHook } from '@testing-library/react-hooks';
import { useJoinUser } from '../useJoinUser';
import { gameService } from '../../../../services/game.service';
import { UserModel, GameModel } from '../../../../services/types';
import { Color } from '../../../../common/types';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../../../../queryClient';
import { waitFor } from '@testing-library/react';
import { noopAsync } from '../../../../common/utils';

const user: UserModel = { id: '1', name: 'User 1', createdAt: new Date() };
const game: GameModel = {
  id: '1',
  inviterId: '2',
  inviterColor: Color.White,
  inviteeColor: Color.Black,
  createdAt: new Date(),
  gameType: 'draughts64',
};
const wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

let joinGameMock: jest.SpyInstance;

describe('useJoinUser', () => {
  beforeEach(() => {
    joinGameMock = jest.spyOn(gameService, 'joinGame').mockImplementation(noopAsync);
  });

  it('should join the game as a inviter', async () => {
    const inviterId = '123';
    const { result } = renderHook(
      () => useJoinUser({ user: { ...user, id: inviterId }, game: { ...game, inviterId } }),
      { wrapper }
    );

    expect(result.current).toStrictEqual({
      isJoined: true,
      isSpectator: false,
      isInviter: true,
      isInvitee: false,
    });
  });

  it('should join the game as an invitee when invitee place is empty', async () => {
    const { result } = renderHook(() => useJoinUser({ user, game: { ...game, inviteeId: undefined } }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isJoined: true,
        isSpectator: false,
        isInviter: false,
        isInvitee: true,
      });
    });

    expect(joinGameMock).toBeCalledTimes(1);
    expect(joinGameMock).toHaveBeenCalledWith({
      id: game.id,
      inviteeId: user.id,
      inviteeColor: Color.Black,
    });
  });

  it('should join the game as an invitee when invitee was saved before', async () => {
    const { result } = renderHook(() => useJoinUser({ user, game: { ...game, inviteeId: user.id } }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isJoined: true,
        isSpectator: false,
        isInviter: false,
        isInvitee: true,
      });
    });

    expect(joinGameMock).not.toBeCalled();
  });

  it('should join the game as a spectator if the user is not the inviter or invitee and all places are full', async () => {
    const { result } = renderHook(() => useJoinUser({ user, game: { ...game, inviteeId: '123' } }), {
      wrapper,
    });

    expect(result.current).toStrictEqual({
      isJoined: true,
      isSpectator: true,
      isInviter: false,
      isInvitee: false,
    });
  });
});

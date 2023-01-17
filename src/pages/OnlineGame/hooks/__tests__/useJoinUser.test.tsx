import { renderHook } from '@testing-library/react-hooks';
import { useGameJoin } from '../useGameJoin';
import { gameService } from '@services/game.service';
import { UserModel, GameModel, GamePlayerModel } from '@services/types';
import { Color } from '@common/types';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@src/queryClient';
import { waitFor } from '@testing-library/react';
import { noopAsync } from '@common/utils';
import { timeout } from '@common/test-utils/timeout';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const inviterUser: UserModel = { id: '1', name: 'User 1', createdAt: new Date() };
const inviteeUser: UserModel = { id: '2', name: 'User 2', createdAt: new Date() };
const spectatorUser: UserModel = { id: '3', name: 'Spectator', createdAt: new Date() };
const game: GameModel = {
  id: '1',
  inviterId: inviterUser.id,
  createdAt: new Date(),
  gameType: 'draughts64',
};
const inviter: GamePlayerModel = {
  id: '123',
  userId: inviterUser.id,
  gameId: game.id,
  isReady: false,
  color: Color.White,
  joinedAt: new Date(),
};

const wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

let joinGameMock: jest.SpyInstance;

describe('useJoinUser', () => {
  beforeEach(() => {
    joinGameMock = jest.spyOn(gameService, 'joinGame').mockImplementation(noopAsync);
  });

  it('should join the game as a inviter', async () => {
    const { result } = renderHook(() => useGameJoin({ user: inviterUser, game, gamePlayers: { inviter } }), {
      wrapper,
    });

    expect(result.current).toStrictEqual({
      isJoined: true,
      isInviteeJoined: false,
      isSpectator: false,
      isInviter: true,
      isInvitee: false,
    });
  });

  it('should join the game as an invitee when invitee place is empty', async () => {
    joinGameMock.mockImplementation(async () => await timeout(1000));
    const { result } = renderHook(
      () => useGameJoin({ user: inviteeUser, game: { ...game, inviteeId: undefined }, gamePlayers: { inviter } }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        isJoined: true,
        isSpectator: false,
        isInviter: false,
        isInvitee: true,
        isInviteeJoined: false, // will be true after game update event
      });
    });

    await waitFor(() => {
      expect(joinGameMock).toBeCalledTimes(1);
    });
    expect(joinGameMock).toHaveBeenCalledWith({
      id: game.id,
      inviteeId: inviteeUser.id,
      inviteeColor: Color.Black,
    });
  });

  it('should join the game as an invitee when invitee was saved before', async () => {
    const { result } = renderHook(
      () => useGameJoin({ user: inviteeUser, game: { ...game, inviteeId: inviteeUser.id }, gamePlayers: { inviter } }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        isJoined: true,
        isSpectator: false,
        isInviter: false,
        isInvitee: true,
        isInviteeJoined: true,
      });
    });

    expect(joinGameMock).not.toBeCalled();
  });

  it('should join the game as a spectator if the user is not the inviter or invitee and all places are full', async () => {
    const { result } = renderHook(
      () =>
        useGameJoin({ user: spectatorUser, game: { ...game, inviteeId: inviteeUser.id }, gamePlayers: { inviter } }),
      { wrapper }
    );

    expect(result.current).toStrictEqual({
      isJoined: true,
      isSpectator: true,
      isInviter: false,
      isInvitee: false,
      isInviteeJoined: true,
    });
  });
});

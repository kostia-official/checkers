/**
 * @jest-environment node
 */

import { CreateGameInput } from '../types';
import { gameService } from '../game.service';
import { GameType } from '@common/types';
import 'firebase/firestore';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { userService } from '@services/user.service';

describe('Game', () => {
  const gameInput: CreateGameInput = {
    gameType: GameType.Draughts64,
    inviterId: '123',
    inviteeId: null,
    roomId: '123',
    timeLimitSeconds: 30,
    moveTimeIncSeconds: 4,
  };

  beforeEach(() => {
    userService.signOut();
  });

  it('should deny creating a game when user is not authorized', async () => {
    await assertFails(gameService.create(gameInput));
  });

  it('should allow creating a game when user is authorized', async () => {
    await userService.signInAnonymously();
    await assertSucceeds(gameService.create(gameInput));
  });

  it('should allow update invitee id when this field is empty', async () => {
    await userService.signInAnonymously();
    const game = await gameService.create(gameInput);

    await assertSucceeds(gameService.update(game.id, { inviteeId: '123' }));
  });

  it('should not allow to update game for user that is not invitee or inviter', async () => {
    await userService.signInAnonymously();
    const game = await gameService.create({ ...gameInput, inviteeId: '1234' });
    await userService.signOut();

    const spectatorId = await userService.signInAnonymously();
    await assertFails(gameService.update(game.id, { winnerId: spectatorId }));
  });

  it('should allow to set a winner for inviter or invitee', async () => {
    const inviterId = await userService.signInAnonymously();

    const game = await gameService.create({ ...gameInput, inviteeId: '123', inviterId });

    await assertSucceeds(gameService.update(game.id, { winnerId: inviterId }));
  });
});

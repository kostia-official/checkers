/**
 * @jest-environment node
 */

import { CreateGameInput, GameModel, UpdateGameInput } from '../types';
import { gameService } from '../game.service';
import { Color } from '../../common/types';
import 'firebase/firestore';
import { assertSucceeds } from '@firebase/rules-unit-testing';

describe('Game', () => {
  it('should create a game and return it', async () => {
    const input: CreateGameInput = { gameType: 'draughts64', inviterId: '123', inviterColor: Color.White };
    const game = await assertSucceeds(gameService.create(input));

    expect(game).toEqual({
      ...input,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
  });

  it('should update a game and return it', async () => {
    const createdGame = await gameService.create({ gameType: 'draughts64', inviterId: '123', inviterColor: Color.White });

    const input = {
      winnerId: '123',
      endedAt: new Date(),
      startedAt: new Date(),
    } as UpdateGameInput;
    const updatedGame = await assertSucceeds(gameService.update(createdGame.id, input));

    expect(updatedGame).toEqual({
      ...createdGame,
      winnerId: input.winnerId,
      endedAt: expect.any(Date),
      startedAt: expect.any(Date),
    });
  });
});

import { createGameState } from '@common/testUtils/gameState';
import { Position } from '@common/types';
import { Draughts64Strategy } from '@strategies/draughts64-strategy';

describe('getValidCaptures', () => {
  it('should return 2 valid captures', () => {
    const strategy = new Draughts64Strategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0],
      [0, 0, 1, 0, 0],
    ];
    const gameState = createGameState(board);

    const from: Position = [4, 2];

    const validCaptures = strategy.getValidCaptures(from, gameState);

    expect(validCaptures.length).toBe(2);
    expect(validCaptures).toStrictEqual([
      [2, 0],
      [2, 4],
    ]);
  });

  it('should return 1 valid capture', () => {
    const strategy = new Draughts64Strategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 1, 0, 0, 0],
    ];
    const gameState = createGameState(board);
    const from: Position = [4, 1];

    const validCaptures = strategy.getValidCaptures(from, gameState);

    expect(validCaptures.length).toBe(1);
    expect(validCaptures).toStrictEqual([[2, 3]]);
  });

  it('should return 0 valid captures', () => {
    const strategy = new Draughts64Strategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ];
    const gameState = createGameState(board);
    const from: Position = [4, 1];

    const validCaptures = strategy.getValidCaptures(from, gameState);

    expect(validCaptures.length).toBe(0);
  });
});

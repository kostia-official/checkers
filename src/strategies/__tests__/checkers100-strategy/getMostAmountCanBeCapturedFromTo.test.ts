import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { createGameState } from '@common/test-utils/gameState';
import { Position } from '@common/types';

describe('getMostAmountCanBeCapturedFromTo', () => {
  it('should return 7 as most amount can be captured', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    const gameState = createGameState(board);

    const from: Position = [6, 0];
    const to: Position = [4, 2];

    const amount = strategy.getBiggestCaptureValue(from, to, gameState);

    expect(amount).toBe(7);
  });

  it('should return 0 when no captures available', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
    ];
    const gameState = createGameState(board);

    const from: Position = [3, 0];
    const to: Position = [1, 2];

    const amount = strategy.getBiggestCaptureValue(from, to, gameState);

    expect(amount).toBe(0);
  });

  it('should return 1 when single capture available', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 2, 0, 0],
      [1, 0, 0, 0],
    ];

    const gameState = createGameState(board);

    const from: Position = [3, 0];
    const to: Position = [1, 2];

    const amount = strategy.getBiggestCaptureValue(from, to, gameState);

    expect(amount).toBe(1);
  });

  it('should return 5 as most amount can be captured by king', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0],
      [3, 0, 0, 0, 0, 0, 0],
    ];
    const gameState = createGameState(board);

    const from: Position = [6, 0];
    const to: Position = [4, 2];

    const amount = strategy.getBiggestCaptureValue(from, to, gameState);

    expect(amount).toBe(5);
  });
});

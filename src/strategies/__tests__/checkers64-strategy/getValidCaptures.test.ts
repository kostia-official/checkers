import { createBoard } from '@common/test-utils/board';
import { Color, GameState } from '@common/types';
import { Checkers64Strategy } from '@strategies/checkers64-strategy';

describe('getValidCaptures', () => {
  it('should return 2 valid captures', () => {
    const strategy = new Checkers64Strategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0],
      [0, 0, 1, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 4;
    const fromJ = 2;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const validCaptures = strategy.getValidCaptures(fromI, fromJ, gameState);

    expect(validCaptures.length).toBe(2);
    expect(validCaptures).toStrictEqual([
      [2, 0],
      [2, 4],
    ]);
  });

  it('should return 1 valid capture', () => {
    const strategy = new Checkers64Strategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 1, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 4;
    const fromJ = 1;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const validCaptures = strategy.getValidCaptures(fromI, fromJ, gameState);

    expect(validCaptures.length).toBe(1);
    expect(validCaptures).toStrictEqual([[2, 3]]);
  });

  it('should return 0 valid captures', () => {
    const strategy = new Checkers64Strategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 4;
    const fromJ = 1;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const validCaptures = strategy.getValidCaptures(fromI, fromJ, gameState);

    expect(validCaptures.length).toBe(0);
  });
});

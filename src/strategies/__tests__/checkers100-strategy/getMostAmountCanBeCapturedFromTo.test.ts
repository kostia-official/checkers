import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { createBoard } from '@common/test-utils/board';
import { Color, GameState } from '@common/types';

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
    const boardState = createBoard(board);

    const fromI = 6;
    const fromJ = 0;
    const toI = 4;
    const toJ = 2;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const amount = strategy.getMostAmountCanBeCaptured(fromI, fromJ, toI, toJ, gameState);

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
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 1;
    const toJ = 2;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const amount = strategy.getMostAmountCanBeCaptured(fromI, fromJ, toI, toJ, gameState);

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

    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 1;
    const toJ = 2;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const amount = strategy.getMostAmountCanBeCaptured(fromI, fromJ, toI, toJ, gameState);

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
    const boardState = createBoard(board);

    const fromI = 6;
    const fromJ = 0;
    const toI = 4;
    const toJ = 2;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const amount = strategy.getMostAmountCanBeCaptured(fromI, fromJ, toI, toJ, gameState);

    expect(amount).toBe(5);
  });
});

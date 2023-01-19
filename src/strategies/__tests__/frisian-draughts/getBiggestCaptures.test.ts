import { Position, GameState, Color } from '@common/types';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createBoard } from '@common/test-utils/board';

describe('getBiggestCaptures', () => {
  it('should return 0 as value and [] of captures when no captures available', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const from: Position = [3, 0];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const { captures, captureValue } = strategy.getBiggestCaptures(from, gameState);

    expect(captureValue).toBe(0);
    expect(captures).toStrictEqual([]);
  });

  it('should return 1.5 and capturing a king when a regular and a king can be captured', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 4, 0],
      [0, 0, 1, 0, 0],
    ];
    const boardState = createBoard(board);

    const from: Position = [4, 2];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const { captures, captureValue } = strategy.getBiggestCaptures(from, gameState);

    expect(captureValue).toBe(1.5);
    expect(captures).toStrictEqual([[2, 4]]);
  });

  it('should value capturing 2 regular pieces more than 1 king', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 4, 0],
      [0, 0, 1, 0, 0],
    ];
    const boardState = createBoard(board);

    const from: Position = [4, 2];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const { captures, captureValue } = strategy.getBiggestCaptures(from, gameState);

    expect(captureValue).toBe(2);
    expect(captures).toStrictEqual([[2, 0]]);
  });
});

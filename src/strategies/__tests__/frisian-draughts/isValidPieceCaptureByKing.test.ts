import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createBoard } from '@common/test-utils/board';
import { Color, GameState } from '@common/types';

describe('isValidPieceCaptureByKing', () => {
  it('should return true for a valid piece capture vertically by a king', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [3, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 0;
    const toJ = 0;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(true);
  });

  it('should return true for a valid piece capture horizontally by a king', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 2, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 3;
    const toJ = 3;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(true);
  });

  it('should return true for a valid piece capture diagonally by a king', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 3],
      [0, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 0;
    const fromJ = 3;
    const toI = 3;
    const toJ = 0;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(true);
  });

  it('should return false for 2 pieces capture vertically at once', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [3, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 0;
    const toJ = 0;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(false);
  });

  it('should return false for capturing own piece horizontally', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 3, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 3;
    const toJ = 3;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(false);
  });

  it('should return false for capturing 0 pieces horizontally', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 3;
    const toJ = 3;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(false);
  });

  it('should return false for capturing 0 pieces diagonally', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 0;
    const toI = 0;
    const toJ = 3;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(false);
  });

  it('should return false for capturing piece with pending capturing', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 2, 0, 3],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 3;
    const toI = 3;
    const toJ = 0;

    boardState[3][1].pendingCapture = true;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(false);
  });

  it('should return false for invalid capture destination', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 2, 0, 3],
    ];
    const boardState = createBoard(board);

    const fromI = 3;
    const fromJ = 3;
    const invalidTo = [
      [0, 1],
      [2, 1],
      [1, 2],
      [3, 3],
      [4, 4],
      [3, 1],
      [-1, -1],
    ];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: [fromI, fromJ],
    };

    invalidTo.forEach(([toI, toJ]) => {
      expect(strategy.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });
  });
});

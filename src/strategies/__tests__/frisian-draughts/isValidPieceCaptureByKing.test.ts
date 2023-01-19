import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createBoard } from '@common/test-utils/board';
import { Color, GameState, Position } from '@common/types';

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

    const from: Position = [3, 0];
    const to: Position = [0, 0];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(true);
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

    const from: Position = [3, 0];
    const to: Position = [3, 3];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(true);
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

    const from: Position = [0, 3];
    const to: Position = [3, 0];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(true);
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

    const from: Position = [3, 0];
    const to: Position = [0, 0];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(false);
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

    const from: Position = [3, 0];
    const to: Position = [3, 3];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(false);
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

    const from: Position = [3, 0];
    const to: Position = [3, 3];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(false);
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

    const from: Position = [3, 0];
    const to: Position = [0, 3];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(false);
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

    const from: Position = [3, 3];
    const to: Position = [3, 0];

    const pendingCapturePiece = boardState[3][1].piece!;
    pendingCapturePiece.pendingCapture = true;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: from,
    };

    expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(false);
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

    const from: Position = [3, 3];
    const invalidTo: Position[] = [
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
      selectedPiece: from,
    };

    invalidTo.forEach((to) => {
      expect(strategy.isValidPieceCaptureByKing(from, to, gameState)).toBe(false);
    });
  });
});

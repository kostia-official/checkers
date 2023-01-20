import { Checkers64Strategy } from '../../checkers64-strategy';
import { createGameState } from '@common/test-utils/gameState';
import { Color, GameState, Position } from '@common/types';

describe('isValidPieceCapture', () => {
  describe('capture by a regular piece', () => {
    it('should return true for a valid piece capture forward', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [1, 0, 0],
      ];
      const from: Position = [2, 0];
      const to: Position = [0, 2];

      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(true);
    });

    it('should return true for a valid piece capture backward', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 1],
        [0, 2, 0],
        [0, 0, 0],
      ];
      const from: Position = [0, 2];
      const to: Position = [2, 0];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(true);
    });

    it('should return false for a valid piece move but not capture', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 2, 0],
        [0, 1, 2],
        [0, 0, 0],
      ];
      const from: Position = [1, 1];
      const to: Position = [0, 2];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture on not empty space', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 2],
        [0, 2, 0],
        [1, 0, 0],
      ];
      const from: Position = [2, 0];
      const to: Position = [0, 2];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture over the board', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 2],
      ];
      const from: Position = [1, 1];
      const to: Position = [3, 3];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture of own piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
      const from: Position = [2, 2];
      const to: Position = [0, 0];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture in wrong turn', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 1],
      ];
      const from: Position = [2, 2];
      const to: Position = [0, 0];
      const gameState: GameState = createGameState(board, { selectedPiece: from, currentPlayer: Color.Black });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for capturing with empty piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0],
      ];
      const from: Position = [2, 2];
      const to: Position = [0, 0];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for capturing to a wrong square according to rules', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 1],
      ];
      const from: Position = [2, 2];
      const wrongDestinations: Position[] = [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      wrongDestinations.forEach((to) => {
        expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
      });
    });

    it('should return false for capturing by regular piece as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
      ];
      const from: Position = [3, 3];
      const to: Position = [0, 0];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for capturing by a piece over a board', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 2],
      ];
      const from: Position = [3, 3];
      const to: Position = [1, 1];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });
  });

  describe('capture by a king piece', () => {
    it('should return true for a valid piece capture forward by a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0],
      ];
      const from: Position = [3, 0];
      const to: Position = [0, 3];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(true);
    });

    it('should return true for a valid piece capture forward like regular piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [3, 0, 0],
      ];
      const from: Position = [2, 0];
      const to: Position = [0, 2];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(true);
    });

    it('should return true for a valid piece capture backward as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 3],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 0],
      ];
      const from: Position = [0, 3];
      const to: Position = [3, 0];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(true);
    });

    it('should return false for a valid piece move but not capture as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 2, 0],
        [0, 3, 2],
        [0, 0, 0],
      ];
      const from: Position = [1, 1];
      const to: Position = [0, 2];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture on not empty space as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0],
      ];
      const from: Position = [3, 0];
      const to: Position = [0, 3];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture over the board as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 3, 0],
        [0, 0, 2],
      ];
      const from: Position = [1, 1];
      const to: Position = [5, 5];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture of own piece as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [3, 0, 0, 0],
      ];
      const from: Position = [3, 0];
      const to: Position = [0, 3];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture of 2 pieces at a time as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0],
        [3, 0, 0, 0, 0],
      ];
      const from: Position = [4, 0];
      const to: Position = [0, 4];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a move not a capture as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0],
      ];
      const from: Position = [4, 0];
      const to: Position = [0, 4];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture of 2 pieces as a single capture as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 2, 0, 0, 0],
        [3, 0, 0, 0, 0],
      ];
      const from: Position = [4, 0];
      const to: Position = [0, 4];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for a capture in wrong turn as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0],
      ];
      const from: Position = [3, 0];
      const to: Position = [0, 3];
      const gameState: GameState = createGameState(board, { selectedPiece: from, currentPlayer: Color.Black });

      expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
    });

    it('should return false for capturing to a wrong square according to rules as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0],
      ];
      const from: Position = [3, 0];
      const wrongDestinations: Position[] = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 3],
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 3],
        [3, 1],
        [3, 2],
        [3, 3],
      ];
      const gameState: GameState = createGameState(board, { selectedPiece: from });

      wrongDestinations.forEach((to) => {
        expect(strategy.isValidPieceCapture(from, to, gameState)).toBe(false);
      });
    });
  });
});

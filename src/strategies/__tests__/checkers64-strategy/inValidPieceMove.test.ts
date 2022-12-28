import { Checkers64Strategy } from '../../checkers64-strategy';
import { createBoard } from '../../../tests/helpers/board';
import { Color, GameState } from '../../../common/types';

describe('isValidPieceCapture', () => {
  let strategy: Checkers64Strategy;

  beforeEach(() => {
    strategy = new Checkers64Strategy();
  });

  describe('a regular piece', () => {
    it('should return true for a valid moves', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const destinations = [
        [0, 0],
        [0, 2]
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      destinations.forEach(([toI, toJ]) => {
        expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(true);
      });
    });

    it('should return false for a invalid moves', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const destinations = [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2]
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      destinations.forEach(([toI, toJ]) => {
        expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(false);
      });
    });

    it('should return false for an invalid moves by black piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const destinations = [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2]
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      destinations.forEach(([toI, toJ]) => {
        expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(false);
      });
    });

    it('should return false for a move to not empty square', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 1],
        [0, 1, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const toI = 0;
      const toJ = 2;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a move over the board', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 2;
      const toI = 1;
      const toJ = 3;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a move by empty square', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const toI = 0;
      const toJ = 0;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a move by a piece of other player', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const toI = 2;
      const toJ = 2;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidMove(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });
  });
});

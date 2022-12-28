import { Checkers64Strategy } from '../../checkers64-strategy';
import { createBoard } from '../../../tests/helpers/board';
import { Color, GameState } from '../../../common/types';

describe('isValidPieceCapture', () => {
  let strategy: Checkers64Strategy;

  beforeEach(() => {
    strategy = new Checkers64Strategy();
  });

  describe('capture by a regular piece', () => {
    it('should return true for a valid piece capture forward', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [1, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 0;
      const toI = 0;
      const toJ = 2;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(true);
    });

    it('should return true for a valid piece capture backward', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 1],
        [0, 2, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 0;
      const fromJ = 2;
      const toI = 2;
      const toJ = 0;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(true);
    });

    it('should return false for a valid piece move but not capture', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 2, 0],
        [0, 1, 2],
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

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture on not empty space', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 2],
        [0, 2, 0],
        [1, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 0;
      const toI = 0;
      const toJ = 2;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture over the board', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 2]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const toI = 3;
      const toJ = 3;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture of own piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 2;
      const toI = 0;
      const toJ = 0;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture in wrong turn', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 1]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 2;
      const toI = 0;
      const toJ = 0;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.Black,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for capturing with empty piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 2;
      const toI = 0;
      const toJ = 0;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for capturing to a wrong square according to rules', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 1]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 2;

      const wrongDestinations = [
        [0, 1],
        [0, 2],
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

      wrongDestinations.forEach(([toI, toJ]) => {
        expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
      });
    });

    it('should return false for capturing by regular piece as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1]
      ];
      const boardState = createBoard(board);

      const fromI = 3;
      const fromJ = 3;
      const toI = 0;
      const toJ = 0;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for capturing by a piece over a board', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 2]
      ];
      const boardState = createBoard(board);

      const fromI = 3;
      const fromJ = 3;
      const toI = 1;
      const toJ = 1;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });
  });

  describe('capture by a king piece', () => {
    it('should return true for a valid piece capture forward by a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0]
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
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(true);
    });

    it('should return true for a valid piece capture forward like regular piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [3, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 2;
      const fromJ = 0;
      const toI = 0;
      const toJ = 2;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(true);
    });

    it('should return true for a valid piece capture backward as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 3],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 0]
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
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(true);
    });

    it('should return false for a valid piece move but not capture as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 2, 0],
        [0, 3, 2],
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

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture on not empty space as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0]
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
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture over the board as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 3, 0],
        [0, 0, 2]
      ];
      const boardState = createBoard(board);

      const fromI = 1;
      const fromJ = 1;
      const toI = 5;
      const toJ = 5;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture of own piece as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [3, 0, 0, 0]
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
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture of 2 pieces at a time as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0],
        [3, 0, 0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 4;
      const fromJ = 0;
      const toI = 0;
      const toJ = 4;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a move not a capture as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 4;
      const fromJ = 0;
      const toI = 0;
      const toJ = 4;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture of 2 pieces as a single capture as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 2, 0, 0, 0],
        [3, 0, 0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 4;
      const fromJ = 0;
      const toI = 0;
      const toJ = 4;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for a capture in wrong turn as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 3;
      const fromJ = 0;
      const toI = 0;
      const toJ = 3;

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.Black,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
    });

    it('should return false for capturing to a wrong square according to rules as a king', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [3, 0, 0, 0]
      ];
      const boardState = createBoard(board);

      const fromI = 3;
      const fromJ = 0;

      const wrongDestinations = [
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
        [3, 3]
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: [fromI, fromJ]
      };

      wrongDestinations.forEach(([toI, toJ]) => {
        expect(strategy.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)).toBe(false);
      });
    });
  });
});

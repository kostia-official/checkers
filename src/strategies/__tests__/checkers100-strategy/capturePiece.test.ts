import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { createBoard } from '@common/test-utils/board';
import { Color, GameState } from '@common/types';

describe('capturePiece', () => {
  it('should capture 2 pieces with marking pending the first one', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 4, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 4, 0, 0],
      [0, 0, 1, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    let gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    // should mark as pending capture when second capture can be done
    let fromI = 5;
    let fromJ = 2;
    let toI = 3;
    let toJ = 4;

    gameState = strategy.capturePiece(fromI, fromJ, toI, toJ, gameState);

    expect(gameState.boardState[toI][toJ].piece).toBe(Color.White);
    expect(gameState.boardState[toI][toJ].isKing).toBe(false);

    const capturedPieceSquare = gameState.boardState[4][3];

    expect(capturedPieceSquare.piece).toBe(Color.Black);
    expect(capturedPieceSquare.pendingCapture).toBe(true);

    // should capture pieces marked as pending when the last capture was done
    fromI = 3;
    fromJ = 4;
    toI = 1;
    toJ = 2;

    gameState = strategy.capturePiece(fromI, fromJ, toI, toJ, gameState);

    const firstCaptured = gameState.boardState[4][3];
    expect(firstCaptured.piece).toBe(null);
    expect(firstCaptured.pendingCapture).toBe(false);
    expect(firstCaptured.isKing).toBe(false);

    const lastCaptured = gameState.boardState[2][3];
    expect(lastCaptured.piece).toBe(null);
    expect(lastCaptured.pendingCapture).toBe(false);
    expect(lastCaptured.isKing).toBe(false);
  });

  it('should remove a piece when no capture can be done', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 0, 1, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 5;
    const fromJ = 2;
    const toI = 3;
    const toJ = 4;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };
    const { boardState: newBoardState, hasMadeCapture } = strategy.capturePiece(fromI, fromJ, toI, toJ, gameState);

    expect(hasMadeCapture).toBe(false);
    expect(newBoardState[toI][toJ].piece).toBe(Color.White);
    expect(newBoardState[toI][toJ].isKing).toBe(false);

    const capturedPieceSquare = newBoardState[4][4];
    expect(capturedPieceSquare.piece).toBe(null);
    expect(capturedPieceSquare.isKing).toBe(false);
  });

  it('should not become a king when not finished capture on a king square', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 2, 0],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const toI = 2;
    const toJ = 1;

    const firstCaptureGameState = strategy.capturePiece(2, 5, 0, 3, gameState);
    const newGameState = strategy.capturePiece(0, 3, 2, 1, firstCaptureGameState);

    expect(newGameState.boardState[toI][toJ].piece).toBe(Color.White);
    expect(newGameState.boardState[toI][toJ].isKing).toBe(false);
    expect(newGameState.currentPlayer).toBe(Color.Black);

    const capturedPieces = [newGameState.boardState[1][4], newGameState.boardState[1][2]];
    capturedPieces.forEach((square) => {
      expect(square.piece).toBe(null);
      expect(square.isKing).toBe(false);
      expect(square.pendingCapture).toBe(false);
    });
  });

  it('should become a king when finished capture on a king square', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const toI = 0;
    const toJ = 3;

    const newGameState = strategy.capturePiece(2, 5, toI, toJ, gameState);

    expect(newGameState.boardState[toI][toJ].piece).toBe(Color.White);
    expect(newGameState.boardState[toI][toJ].isKing).toBe(true);
    expect(newGameState.currentPlayer).toBe(Color.Black);

    const capturedPiece = newGameState.boardState[1][4];

    expect(capturedPiece.piece).toBe(null);
    expect(capturedPiece.isKing).toBe(false);
    expect(capturedPiece.pendingCapture).toBe(false);
  });

  it('should become a king when finished capture on a king square with possible capture as king next time', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0],
      [0, 2, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const toI = 0;
    const toJ = 3;

    const newGameState = strategy.capturePiece(2, 5, toI, toJ, gameState);

    expect(newGameState.boardState[toI][toJ].piece).toBe(Color.White);
    expect(newGameState.boardState[toI][toJ].isKing).toBe(true);
    expect(newGameState.currentPlayer).toBe(Color.Black);

    const capturedPiece = newGameState.boardState[1][4];

    expect(capturedPiece.piece).toBe(null);
    expect(capturedPiece.isKing).toBe(false);
    expect(capturedPiece.pendingCapture).toBe(false);
  });

  it('should stay as a king when captured over a king square', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 2, 0],
      [0, 0, 0, 0, 0, 3],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const toI = 2;
    const toJ = 1;

    const firstCaptureGameState = strategy.capturePiece(2, 5, 0, 3, gameState);
    const newGameState = strategy.capturePiece(0, 3, 2, 1, firstCaptureGameState);

    expect(newGameState.boardState[toI][toJ].piece).toBe(Color.White);
    expect(newGameState.boardState[toI][toJ].isKing).toBe(true);
    expect(newGameState.currentPlayer).toBe(Color.Black);

    const capturedPieces = [newGameState.boardState[1][4], newGameState.boardState[1][2]];
    capturedPieces.forEach((square) => {
      expect(square.piece).toBe(null);
      expect(square.isKing).toBe(false);
      expect(square.pendingCapture).toBe(false);
    });
  });
});

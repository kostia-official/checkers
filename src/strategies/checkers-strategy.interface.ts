import { Coordinates, GameState, BoardState, Color } from '../common/types';

export interface ICheckersStrategy {
  squares: number;

  makeInitialBoardState(): BoardState;

  isValidMove(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  isValidPieceCaptureByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  isValidPieceCapture(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  getValidMoves(i: number, j: number, gameState: GameState): Coordinates[];
  getValidCaptures(i: number, j: number, gameState: GameState): Coordinates[];
  hasValidCaptureByOtherPiece(selectedI: number, selectedJ: number, gameState: GameState): boolean;
  canBecomeKing(i: number, gameState: GameState): boolean;

  movePiece(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): GameState;
  capturePieceByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): BoardState | undefined;
  capturePiece(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): GameState;

  handlePieceClick(i: number, j: number, gameState: GameState): Coordinates | undefined;
  handleSquareClick(i: number, j: number, gameState: GameState): GameState | undefined;

  getWinner(gameState: GameState): Color | null;
}

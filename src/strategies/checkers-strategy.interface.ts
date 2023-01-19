import { Position, GameState, BoardState, Color } from '../common/types';

export interface ICheckersStrategy {
  squares: number;

  makeInitialBoardState(): BoardState;

  isValidMove(from: Position, to: Position, gameState: GameState): boolean;
  isValidMoveByKing(from: Position, to: Position, gameState: GameState): boolean;
  isValidMoveByRegular(from: Position, to: Position, gameState: GameState): boolean;
  isValidPieceCapture(from: Position, to: Position, gameState: GameState): boolean;
  isValidPieceCaptureByKing(from: Position, to: Position, gameState: GameState): boolean;
  isValidPieceCaptureByRegular(from: Position, to: Position, gameState: GameState): boolean;
  getValidMoves(from: Position, gameState: GameState): Position[];
  getValidCaptures(from: Position, gameState: GameState): Position[];
  getOtherPiecesWithValidCaptures(selected: Position, gameState: GameState): Position[];
  getCaptureValue(from: Position, to: Position, gameState: GameState): number;
  canBecomeKing(position: Position, currentPlayer: Color): boolean;
  isValidJump(from: Position, to: Position, gameState: GameState): boolean;

  movePiece(from: Position, to: Position, gameState: GameState): GameState;
  capturePieceByKing(from: Position, to: Position, gameState: GameState): BoardState | undefined;
  capturePiece(from: Position, to: Position, gameState: GameState): GameState;
  removePendingCapturePieces(boardState: BoardState): BoardState;

  handlePieceClick(position: Position, gameState: GameState): Position | undefined;
  handleSquareClick(position: Position, gameState: GameState): GameState | undefined;

  getWinner(gameState: GameState): Color | undefined;

  getSquareNotation(position: Position): string;
  iterateBetweenFromTo(from: Position, to: Position, cb: (position: Position) => boolean): void;
}

import { Position, GameState, BoardState, Color, LimitedJumpsCount } from '@common/types';

export interface ICheckersStrategy {
  readonly squares: number;

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
  getValidJumps(from: Position, gameState: GameState): Position[];
  changePieceSquare(from: Position, to: Position, gameState: GameState): GameState;
  movePiece(from: Position, to: Position, gameState: GameState): GameState;
  capturePieceByKing(from: Position, to: Position, gameState: GameState): BoardState | undefined;
  capturePiece(from: Position, to: Position, gameState: GameState): GameState;
  markPendingCapture(from: Position, to: Position, gameState: GameState): GameState;
  removePendingCapturePieces(boardState: BoardState): BoardState;

  handlePieceClick(position: Position, gameState: GameState): GameState | undefined;
  handleSquareClick(position: Position, gameState: GameState): GameState | undefined;

  getWinner(gameState: GameState): Color | undefined;

  getSquareNotation(position: Position): string;
  iterateBetweenFromTo(from: Position, to: Position, cb: (position: Position) => boolean): void;

  updateLimitedJumpsCount(
    key: string,
    limitedJumpsCount: LimitedJumpsCount,
    cb: (prevCount: number) => number
  ): LimitedJumpsCount;
  mapLimitedJumpsCount(
    limitedJumpsCount: LimitedJumpsCount,
    cb: (key: string, count: number) => number
  ): LimitedJumpsCount;

  addAlert(message: string, gameState: GameState): GameState;
}

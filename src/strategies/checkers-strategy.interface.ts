import { Coordinates, GameState, BoardState, Color } from '../common/types';

export interface ICheckersStrategy {
  squares: number;

  makeInitialBoardState(): BoardState;

  isValidMove(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  isValidPieceCaptureByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  isValidPieceCapture(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  getValidMoves(i: number, j: number, gameState: GameState): Coordinates[];
  getValidCaptures(i: number, j: number, gameState: GameState): Coordinates[];
  getOtherPiecesWithValidCaptures(selectedI: number, selectedJ: number, gameState: GameState): Coordinates[];
  canBecomeKing(i: number, j: number, currentPlayer: Color): boolean;
  isValidJump(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;

  movePiece(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): GameState;
  capturePieceByKing(
    fromI: number,
    fromJ: number,
    toI: number,
    toJ: number,
    gameState: GameState
  ): BoardState | undefined;
  capturePiece(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): GameState;
  removePendingCapturePieces(boardState: BoardState): BoardState;
  // iterateBetweenFromTo(
  //   fromI: number,
  //   fromJ: number,
  //   toI: number,
  //   toJ: number,
  //   cb: (i: number, j: number) => boolean
  // ): void;

  handlePieceClick(i: number, j: number, gameState: GameState): Coordinates | undefined;
  handleSquareClick(i: number, j: number, gameState: GameState): GameState | undefined;

  getWinner(gameState: GameState): Color | undefined;

  getSquareNotation(i: number, j: number): string;
}

import { ICheckersStrategy } from './draughts-strategy.interface';
import { BoardState, Color, GameState, Position, Square, LimitedJumpsCount } from '@common/types';
import cloneDeep from 'lodash.clonedeep';
import {
  toggleColor,
  getSquare,
  getSquares,
  isEqualPosition,
  getPiece,
  getPieces,
} from '@common/utils';

export abstract class BaseDraughtsStrategy implements ICheckersStrategy {
  abstract squares: number;

  abstract isValidMoveByKing(from: Position, to: Position, gameState: GameState): boolean;
  abstract isValidMoveByRegular(from: Position, to: Position, gameState: GameState): boolean;

  abstract getSquareNotation(position: Position): string;

  abstract isValidPieceCaptureByKing(from: Position, to: Position, gameState: GameState): boolean;
  abstract isValidPieceCaptureByRegular(
    from: Position,
    to: Position,
    gameState: GameState
  ): boolean;

  makeInitialBoardState() {
    const initialBoardState: BoardState = [];
    let id = -1;

    for (let i = 0; i < this.squares; i++) {
      const row: Square[] = [];
      for (let j = 0; j < this.squares; j++) {
        id += 1;

        const isPieceSquare = (i + j) % 2 !== 0;

        let color;
        const halfSquares = Math.floor(this.squares / 2);

        if (i < halfSquares - 1 && isPieceSquare) {
          color = Color.Black;
        }
        if (i > halfSquares && isPieceSquare) {
          color = Color.White;
        }
        row.push({ piece: color && { id, color, isKing: false, pendingCapture: false } });
      }
      initialBoardState.push(row);
    }

    return initialBoardState;
  }

  changePieceSquare(from: Position, to: Position, gameState: GameState) {
    const newGameState = cloneDeep(gameState);
    const { fromSquare, toSquare } = getSquares(newGameState.boardState, from, to);
    if (!fromSquare?.piece) return newGameState;

    toSquare.piece = { ...fromSquare.piece };
    fromSquare.piece = undefined;
    newGameState.jumpFrom = from;
    newGameState.jumpTo = to;

    return newGameState;
  }

  isValidMove(from: Position, to: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const toSquare = getSquare(boardState, to);
    if (!toSquare) return false;

    // Check if the piece being moved is the current player's piece
    const fromPiece = getPiece(boardState, from);
    if (fromPiece?.color !== currentPlayer) {
      return false;
    }

    // Check if the destination square is empty
    if (getPiece(boardState, to)) {
      return false;
    }

    // Check if there are any valid captures for the selected piece
    // can't move when can capture
    const validCaptures = this.getValidCaptures(from, gameState);
    if (validCaptures.length > 0) {
      return false;
    }

    if (fromPiece.isKing) {
      return this.isValidMoveByKing(from, to, gameState);
    } else {
      return this.isValidMoveByRegular(from, to, gameState);
    }
  }

  isValidPieceCapture(from: Position, to: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const toSquare = getSquare(boardState, to);
    const { fromPiece, toPiece } = getPieces(boardState, from, to);

    // Check if piece exists
    if (!fromPiece) {
      return false;
    }
    // Check if piece belongs to a current player
    if (fromPiece.color !== currentPlayer) {
      return false;
    }
    // Check if the destination square is over the board
    if (!toSquare) {
      return false;
    }
    // Check if the destination square is empty
    if (toPiece) {
      return false;
    }

    if (fromPiece.isKing) {
      return this.isValidPieceCaptureByKing(from, to, gameState);
    } else {
      return this.isValidPieceCaptureByRegular(from, to, gameState);
    }
  }

  handlePieceClick(position: Position, gameState: GameState): GameState | undefined {
    // Check if there are any valid moves or captures available for this piece
    const validCaptures = this.getValidCaptures(position, gameState);
    // No moves can be done when a valid captures available
    const validMoves = this.getValidMoves(position, gameState);

    if (validMoves.length === 0 && validCaptures.length === 0) {
      // If there are no valid moves or captures, do nothing
      return;
    }

    const hasOwnCaptures = validCaptures.length > 0;

    // Capture is required over a move
    if (!hasOwnCaptures && this.getOtherPiecesWithValidCaptures(position, gameState).length > 0) {
      return;
    }

    // If there are no valid captures but there are valid moves, set the selected piece
    return { ...gameState, selectedPiece: position };
  }

  handleSquareClick(to: Position, gameState: GameState): GameState | undefined {
    let newGameState = cloneDeep(gameState);
    const { selectedPiece, currentPlayer, boardState, hasMadeCapture } = newGameState;

    if (!selectedPiece) {
      return;
    }

    if (getPiece(boardState, to)?.color === currentPlayer) {
      this.handlePieceClick(to, newGameState);
      return;
    }

    if (this.isValidPieceCapture(selectedPiece, to, newGameState)) {
      newGameState = this.capturePiece(selectedPiece, to, newGameState);
      newGameState.hasMadeCapture = true;
    } else if (this.isValidMove(selectedPiece, to, newGameState)) {
      if (hasMadeCapture) {
        // If the player has made a capture, only allow moves that are captures
        return newGameState;
      }
      newGameState = {
        ...newGameState,
        ...this.movePiece(selectedPiece, to, newGameState),
      };
    }

    // Check if there are more valid captures available for the selected piece
    const validCaptures = this.getValidCaptures(to, newGameState);

    if (validCaptures.length > 0) {
      // If there are more valid captures, keep the selected piece and allow the player to make additional captures
      newGameState.selectedPiece = to;
    } else {
      // If there are no more valid captures, clear the selected piece and reset the hasMadeCapture flag
      newGameState.selectedPiece = undefined;
      newGameState.hasMadeCapture = false;
    }

    return newGameState;
  }

  capturePieceByKing(from: Position, to: Position, gameState: GameState): BoardState {
    let newGameState = cloneDeep(gameState);

    // Capture enemy pieces along the path
    this.iterateBetweenFromTo(from, to, (position: Position) => {
      const piece = getPiece(newGameState.boardState, position);
      if (piece) {
        piece.pendingCapture = true;
      }
      return true;
    });

    return this.changePieceSquare(from, to, newGameState).boardState;
  }

  protected updateGameStateAfterCapture(
    from: Position,
    to: Position,
    gameState: GameState
  ): GameState {
    const newGameState = cloneDeep(gameState);

    const toPiece = getPiece(newGameState.boardState, to);

    // Check if the piece can become a king and update its isKing status
    if (toPiece && this.canBecomeKing(to, newGameState.currentPlayer)) {
      toPiece.isKing = true;
    }

    // Check if there are more valid captures available for the moved piece
    const validCaptures = this.getValidCaptures(to, newGameState);

    if (validCaptures.length === 0) {
      // If there are no more valid captures, change the current player
      newGameState.currentPlayer = toggleColor(newGameState.currentPlayer);

      newGameState.boardState = this.removePendingCapturePieces(newGameState.boardState);
    }

    return newGameState;
  }

  markPendingCapture(from: Position, to: Position, gameState: GameState): GameState {
    let newGameState = cloneDeep(gameState);

    const { fromSquare } = getSquares(newGameState.boardState, from, to);
    if (!fromSquare?.piece) return newGameState;

    // Check if the piece being moved is a king
    const isKing = fromSquare?.piece?.isKing;

    // Move piece to the destination square
    newGameState = this.changePieceSquare(from, to, newGameState);

    const [fromI, fromJ] = from;
    const [toI, toJ] = to;

    if (!isKing) {
      const capturedPiecePosition: Position = [(fromI + toI) / 2, (fromJ + toJ) / 2];
      const capturedPiece = getPiece(newGameState.boardState, capturedPiecePosition);

      if (capturedPiece) {
        capturedPiece.pendingCapture = true;
      }
    } else {
      const updatedBoardState = this.capturePieceByKing(from, to, newGameState);
      if (updatedBoardState) {
        newGameState.boardState = updatedBoardState;
      }
    }

    return newGameState;
  }

  capturePiece(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = this.markPendingCapture(from, to, gameState);
    return this.updateGameStateAfterCapture(from, to, newGameState);
  }

  removePendingCapturePieces(boardState: BoardState) {
    const newBoardState = cloneDeep(boardState);

    for (let i = 0; i < this.squares; i++) {
      for (let j = 0; j < this.squares; j++) {
        const square = newBoardState[i]?.[j];
        if (square?.piece && square.piece.pendingCapture) {
          square.piece = undefined;
        }
      }
    }

    return newBoardState;
  }

  movePiece(from: Position, to: Position, gameState: GameState): GameState {
    let newGameState = cloneDeep(gameState);

    const fromPiece = getPiece(newGameState.boardState, from);
    if (!fromPiece) return newGameState;

    newGameState = this.changePieceSquare(from, to, newGameState);

    const toPiece = getPiece(newGameState.boardState, to);

    // Check if the piece can become a king and update its isKing status
    if (toPiece && this.canBecomeKing(to, gameState.currentPlayer)) {
      toPiece.isKing = true;
    }

    newGameState.currentPlayer = toggleColor(newGameState.currentPlayer);

    return newGameState;
  }

  getOtherPiecesWithValidCaptures(selected: Position, gameState: GameState): Position[] {
    const { boardState, currentPlayer } = gameState;
    const piecesThatCanCapture: Position[] = [];

    this.iterateBoard(selected, gameState, (position) => {
      const square = getSquare(boardState, position);
      if (!square?.piece) return true;

      if (square.piece.color !== currentPlayer) {
        return true;
      }
      // Skip selected piece
      if (isEqualPosition(position, selected)) {
        return true;
      }

      const validCaptures = this.getValidCaptures(position, gameState);
      if (validCaptures.length > 0) {
        piecesThatCanCapture.push(position);
      }
    });

    return piecesThatCanCapture;
  }

  canBecomeKing([i, j]: Position, currentPlayer: Color): boolean {
    // If the piece is white, it can become a king if it reaches the first row
    if (currentPlayer === Color.White && i === 0) {
      return true;
    }
    // If the piece is black, it can become a king if it reaches the last row
    if (currentPlayer === Color.Black && i === this.squares - 1) {
      return true;
    }
    return false;
  }

  // Can add isValidPath for king/regular & capture/move for extra optimisation
  isValidPath([fromI, fromJ]: Position, [toI, toJ]: Position) {
    const xDiff = Math.abs(fromI - toI);
    const yDiff = Math.abs(fromJ - toJ);
    const isDiagonal = xDiff >= 1 && yDiff >= 1 && xDiff === yDiff;

    return isDiagonal;
  }

  iteratePieceJumps(
    piecePosition: Position,
    gameState: GameState,
    cb: (position: Position) => void
  ): void {
    this.iterateBoard(piecePosition, gameState, (position) => {
      if (this.isValidPath(piecePosition, position)) {
        cb(position);
      }
    });
  }

  // TODO: Add early return from iteration
  // TODO: Add to interface
  // piecePosition helps to determine what squares iterate over and speed up iteration
  iterateBoard(
    piecePosition: Position,
    gameState: GameState,
    cb: (position: Position) => void
  ): void {
    const [i, j] = piecePosition;

    const isEvenSquares = (i + j) % 2 === 0;
    const checkSquareWith = isEvenSquares ? 0 : 1;

    for (let toI = 0; toI < this.squares; toI++) {
      for (let toJ = 0; toJ < this.squares; toJ++) {
        const isValidSquare = (toI + toJ) % 2 === checkSquareWith;

        if (isValidSquare) {
          cb([toI, toJ]);
        }
      }
    }
  }

  getValidMoves(from: Position, gameState: GameState): Position[] {
    const validMoves: Position[] = [];

    this.iteratePieceJumps(from, gameState, (to) => {
      if (this.isValidMove(from, to, gameState)) {
        validMoves.push(to);
      }
    });

    return validMoves;
  }

  getValidCaptures(from: Position, gameState: GameState): Position[] {
    const validCaptures: Position[] = [];

    // Check all possible captures and add them to the validCaptures array if they are valid
    this.iteratePieceJumps(from, gameState, (to) => {
      if (this.isValidPieceCapture(from, to, gameState)) {
        validCaptures.push(to);
      }
    });

    return validCaptures;
  }

  getWinner(gameState: GameState): Color | undefined {
    const { boardState, currentPlayer } = gameState;

    let whitePieces = 0;
    let blackPieces = 0;

    // TODO: Use iterateBoard ?
    for (let i = 0; i < this.squares; i++) {
      for (let j = 0; j < this.squares; j++) {
        if (boardState[i][j].piece?.color === Color.White) {
          whitePieces++;
        } else if (boardState[i][j].piece?.color === Color.Black) {
          blackPieces++;
        }
      }
    }

    // Can occur in edit mode
    if (!whitePieces && !blackPieces) return;

    if (!whitePieces) {
      return Color.Black;
    }
    if (!blackPieces) {
      return Color.White;
    }

    // TODO: Use iterateBoard
    for (let i = 0; i < this.squares; i++) {
      for (let j = 0; j < this.squares; j++) {
        if (boardState[i][j].piece?.color !== currentPlayer) {
          continue;
        }
        if (this.getValidCaptures([i, j], gameState).length > 0) {
          return;
        }
        if (this.getValidMoves([i, j], gameState).length > 0) {
          return;
        }
      }
    }

    return toggleColor(currentPlayer);
  }

  iterateBetweenFromTo(
    [fromI, fromJ]: Position,
    [toI, toJ]: Position,
    cb: (position: Position) => boolean
  ): void {
    const iStep = Math.sign(toI - fromI);
    const jStep = Math.sign(toJ - fromJ);

    for (let i = fromI + iStep, j = fromJ + jStep; i !== toI || j !== toJ; i += iStep, j += jStep) {
      const isProceed = cb([i, j]);
      if (!isProceed) return;
    }
  }

  getValidJumps(from: Position, gameState: GameState): Position[] {
    const validCaptures = this.getValidCaptures(from, gameState);
    const validMoves = validCaptures.length ? undefined : this.getValidMoves(from, gameState);

    return validMoves || validCaptures;
  }

  getCaptureValue(from: Position, to: Position, gameState: GameState): number {
    return 1;
  }

  updateLimitedJumpsCount(
    key: string,
    limitedJumpsCount: LimitedJumpsCount,
    cb: (prevCount: number) => number
  ): LimitedJumpsCount {
    let newLimitedJumpsCount = limitedJumpsCount || {};
    const prevCount = newLimitedJumpsCount?.[key] ?? 0;

    newLimitedJumpsCount = {
      ...newLimitedJumpsCount,
      [key]: cb(prevCount),
    };

    return newLimitedJumpsCount;
  }

  mapLimitedJumpsCount(
    limitedJumpsCount: LimitedJumpsCount,
    cb: (key: string, count: number) => number
  ): LimitedJumpsCount {
    const newLimitedJumpsCount: LimitedJumpsCount = {};

    Object.keys(limitedJumpsCount).forEach((key) => {
      newLimitedJumpsCount[key] = cb(key, limitedJumpsCount[key]);
    });

    return newLimitedJumpsCount;
  }

  addAlert(message: string, gameState: GameState): GameState {
    gameState.gameAlerts = [...gameState.gameAlerts, { message, createdAt: new Date() }];

    return gameState;
  }
}

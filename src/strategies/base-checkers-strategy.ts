import { ICheckersStrategy } from './checkers-strategy.interface';
import { BoardState, Color, GameState, Position, Square } from '../common/types';
import cloneDeep from 'lodash.clonedeep';
import { toggleColor, getSquare, getSquares, isEqualPosition } from '@common/utils';

export abstract class BaseCheckersStrategy implements ICheckersStrategy {
  abstract squares: number;

  abstract isValidMoveByKing(from: Position, to: Position, gameState: GameState): boolean;
  abstract isValidMoveByRegular(from: Position, to: Position, gameState: GameState): boolean;

  abstract getSquareNotation(position: Position): string;

  abstract isValidPieceCaptureByKing(from: Position, to: Position, gameState: GameState): boolean;
  abstract isValidPieceCaptureByRegular(from: Position, to: Position, gameState: GameState): boolean;

  makeInitialBoardState() {
    const initialBoardState: BoardState = [];

    for (let i = 0; i < this.squares; i++) {
      const row: Square[] = [];
      for (let j = 0; j < this.squares; j++) {
        const isPieceSquare = (i + j) % 2 !== 0;

        let piece = null;
        const halfSquares = Math.floor(this.squares / 2);

        if (i < halfSquares - 1 && isPieceSquare) {
          piece = Color.Black;
        }
        if (i > halfSquares && isPieceSquare) {
          piece = Color.White;
        }
        row.push({ piece, isKing: false });
      }
      initialBoardState.push(row);
    }

    return initialBoardState;
  }

  isValidMove(from: Position, to: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    // Check if the piece being moved is the current player's piece
    const piece = getSquare(boardState, from).piece;
    if (piece !== currentPlayer) {
      return false;
    }

    // Check if the destination square is empty
    if (getSquare(boardState, to)?.piece !== null) {
      return false;
    }

    // Check if there are any valid captures for the selected piece
    // can't move when can capture
    const validCaptures = this.getValidCaptures(from, gameState);
    if (validCaptures.length > 0) {
      return false;
    }

    if (getSquare(boardState, from).isKing) {
      return this.isValidMoveByKing(from, to, gameState);
    } else {
      return this.isValidMoveByRegular(from, to, gameState);
    }
  }

  isValidPieceCapture(from: Position, to: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const { fromSquare, toSquare } = getSquares(boardState, from, to);

    // Check if piece exists
    if (!fromSquare?.piece) {
      return false;
    }
    // Check if piece belongs to a current player
    if (fromSquare.piece !== currentPlayer) {
      return false;
    }
    // Check if the destination square is over the board
    if (!toSquare) {
      return false;
    }
    // Check if the destination square is empty
    if (toSquare.piece !== null) {
      return false;
    }

    if (fromSquare.isKing) {
      return this.isValidPieceCaptureByKing(from, to, gameState);
    } else {
      return this.isValidPieceCaptureByRegular(from, to, gameState);
    }
  }

  handlePieceClick(position: Position, gameState: GameState): Position | undefined {
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
    return position;
  }

  handleSquareClick(to: Position, gameState: GameState): GameState | undefined {
    let newGameState = cloneDeep(gameState);
    const { selectedPiece, currentPlayer, boardState, hasMadeCapture } = newGameState;

    if (!selectedPiece) {
      return;
    }

    if (getSquare(boardState, to).piece === currentPlayer) {
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
      newGameState.selectedPiece = null;
      newGameState.hasMadeCapture = false;
    }

    return newGameState;
  }

  capturePieceByKing(from: Position, to: Position, gameState: GameState): BoardState {
    let { boardState } = cloneDeep(gameState);

    // Capture enemy pieces along the path
    this.iterateBetweenFromTo(from, to, ([i, j]: Position) => {
      if (boardState[i][j].piece) {
        boardState[i][j].pendingCapture = true;
      }
      return true;
    });

    const { fromSquare, toSquare } = getSquares(boardState, from, to);

    // Update the board state and current player
    fromSquare.piece = null;
    fromSquare.isKing = false;
    toSquare.piece = gameState.currentPlayer;
    toSquare.isKing = true;

    // TODO: Update so we don't need to mark as not pendingCapture player's piece
    toSquare.pendingCapture = false;

    return boardState;
  }

  protected updateGameStateAfterCapture(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    // Check if the piece can become a king and update its isKing status
    if (this.canBecomeKing(to, newGameState.currentPlayer)) {
      getSquare(newGameState.boardState, to).isKing = true;
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

  capturePiece(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    const { fromSquare, toSquare } = getSquares(newGameState.boardState, from, to);

    // Check if the piece being moved is a king
    const isKing = fromSquare.isKing;

    toSquare.piece = fromSquare.piece;
    toSquare.isKing = fromSquare.isKing;
    fromSquare.piece = null;
    fromSquare.isKing = false;

    const [fromI, fromJ] = from;
    const [toI, toJ] = to;

    if (!isKing) {
      const capturedPieceRow = (fromI + toI) / 2;
      const capturedPieceColumn = (fromJ + toJ) / 2;
      newGameState.boardState[capturedPieceRow][capturedPieceColumn].pendingCapture = true;
    } else {
      const updatedBoardState = this.capturePieceByKing(from, to, newGameState);
      if (updatedBoardState) {
        newGameState.boardState = updatedBoardState;
      }
    }

    return this.updateGameStateAfterCapture(from, to, newGameState);
  }

  removePendingCapturePieces(boardState: BoardState) {
    const newBoardState = cloneDeep(boardState);

    for (let i = 0; i < this.squares; i++) {
      for (let j = 0; j < this.squares; j++) {
        const square = newBoardState[i]?.[j];
        if (square?.pendingCapture) {
          square.pendingCapture = false;
          square.isKing = false;
          square.piece = null;
        }
      }
    }

    return newBoardState;
  }

  movePiece(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    const { fromSquare, toSquare } = getSquares(newGameState.boardState, from, to);

    toSquare.piece = fromSquare.piece;
    toSquare.isKing = fromSquare.isKing;
    fromSquare.piece = null;

    // Check if the piece can become a king and update its isKing status
    if (this.canBecomeKing(to, gameState.currentPlayer)) {
      toSquare.isKing = true;
    }

    newGameState.currentPlayer = toggleColor(newGameState.currentPlayer);

    return newGameState;
  }

  getOtherPiecesWithValidCaptures(selected: Position, gameState: GameState): Position[] {
    const { boardState, currentPlayer } = gameState;
    const piecesThatCanCapture: Position[] = [];

    this.iterateBoard(selected, gameState, (position) => {
      const square = getSquare(boardState, position);
      if (!square) return true;

      if (square.piece !== currentPlayer) {
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

  iterateBoard(piecePosition: Position, gameState: GameState, cb: (position: Position) => void): void {
    const [i, j] = piecePosition;

    const isEvenSquares = (i + j) % 2 === 0;
    const checkSquareWith = isEvenSquares ? 0 : 1;

    // Check all possible captures and add them to the validCaptures array if they are valid
    for (let toI = 0; toI < this.squares; toI++) {
      for (let toJ = 0; toJ < this.squares; toJ++) {
        const isValidSquare = (toI + toJ) % 2 === checkSquareWith;

        if (isValidSquare && this.isValidPath([i, j], [toI, toJ])) {
          cb([toI, toJ]);
        }
      }
    }
  }

  getValidMoves(from: Position, gameState: GameState): Position[] {
    const validMoves: Position[] = [];

    this.iterateBoard(from, gameState, (to) => {
      if (this.isValidMove(from, to, gameState)) {
        validMoves.push(to);
      }
    });

    return validMoves;
  }

  getValidCaptures(from: Position, gameState: GameState): Position[] {
    const validCaptures: Position[] = [];

    // Check all possible captures and add them to the validCaptures array if they are valid
    this.iterateBoard(from, gameState, (to) => {
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
        if (boardState[i][j].piece === Color.White) {
          whitePieces++;
        } else if (boardState[i][j].piece === Color.Black) {
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
        if (boardState[i][j].piece !== currentPlayer) {
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

  iterateBetweenFromTo([fromI, fromJ]: Position, [toI, toJ]: Position, cb: (position: Position) => boolean): void {
    const iStep = Math.sign(toI - fromI);
    const jStep = Math.sign(toJ - fromJ);

    for (let i = fromI + iStep, j = fromJ + jStep; i !== toI || j !== toJ; i += iStep, j += jStep) {
      const isProceed = cb([i, j]);
      if (!isProceed) return;
    }
  }

  isValidJump(from: Position, to: Position, gameState: GameState): boolean {
    if (!this.isValidPath(from, to)) return false;

    const isValidCapture = this.isValidPieceCapture(from, to, gameState);
    const isValidMove = isValidCapture ? false : this.isValidMove(from, to, gameState);

    return isValidMove || isValidCapture;
  }

  getCaptureValue(from: Position, to: Position, gameState: GameState): number {
    return 1;
  }
}

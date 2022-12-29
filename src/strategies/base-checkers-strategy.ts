import { ICheckersStrategy } from './checkers-strategy.interface';
import { BoardState, Color, GameState, Coordinates } from '../common/types';
import cloneDeep from 'lodash.clonedeep';

export abstract class BaseCheckersStrategy implements ICheckersStrategy {
  abstract squares: number;

  abstract isValidMoveByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  abstract isValidMoveByRegular(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;

  abstract isValidPieceCaptureByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;
  abstract isValidPieceCaptureByRegular(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean;

  makeInitialBoardState() {
    const initialBoardState: BoardState = [];

    for (let i = 0; i < this.squares; i++) {
      const row = [];
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

  isValidMove(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    // Check if there are any valid captures for the selected piece
    // can't move if can capture
    // TODO: Optimise this
    const validCaptures = this.getValidCaptures(fromI, fromJ, gameState);
    if (validCaptures.length > 0) {
      return false;
    }

    // Check if the piece being moved is the current player's piece
    const piece = boardState[fromI][fromJ].piece;
    if (piece !== currentPlayer) {
      return false;
    }

    // Check if the destination square is empty
    if (boardState[toI]?.[toJ]?.piece !== null) {
      return false;
    }

    if (boardState[fromI][fromJ].isKing) {
      return this.isValidMoveByKing(fromI, fromJ, toI, toJ, gameState);
    } else {
      return this.isValidMoveByRegular(fromI, fromJ, toI, toJ, gameState);
    }
  }

  isValidPieceCapture(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const currentSquare = boardState[fromI]?.[fromJ];

    // Check if piece exists
    if (!currentSquare?.piece) {
      return false;
    }
    // Check if piece belongs to a current player
    if (currentSquare.piece !== currentPlayer) {
      return false;
    }
    // Check if the destination square is over the board
    if (!boardState[toI]?.[toJ]) {
      return false;
    }
    // Check if the destination square is empty
    if (boardState[toI][toJ].piece !== null) {
      return false;
    }

    if (currentSquare.isKing) {
      return this.isValidPieceCaptureByKing(fromI, fromJ, toI, toJ, gameState);
    } else {
      return this.isValidPieceCaptureByRegular(fromI, fromJ, toI, toJ, gameState);
    }
  }

  handlePieceClick(i: number, j: number, gameState: GameState): Coordinates | undefined {
    // Check if there are any valid moves or captures available for this piece
    const validCaptures = this.getValidCaptures(i, j, gameState);
    // No moves can be done when a valid captures available
    const validMoves = this.getValidMoves(i, j, gameState);

    if (validMoves.length === 0 && validCaptures.length === 0) {
      // If there are no valid moves or captures, do nothing
      return;
    }

    const hasOwnCaptures = validCaptures.length > 0;

    // Capture is required over a move
    if (!hasOwnCaptures && this.getValidCapturesByOtherPieces(i, j, gameState).length > 0) {
      return;
    }

    // If there are no valid captures but there are valid moves, set the selected piece
    return [i, j];
  }

  handleSquareClick(i: number, j: number, gameState: GameState): GameState | undefined {
    let newGameState = cloneDeep(gameState);
    const { selectedPiece, currentPlayer, boardState, hasMadeCapture } = newGameState;

    if (!selectedPiece) {
      return;
    }

    if (boardState[i][j].piece === currentPlayer) {
      this.handlePieceClick(i, j, newGameState);
      return;
    }

    const [fromI, fromJ] = selectedPiece;

    if (this.isValidPieceCapture(fromI, fromJ, i, j, newGameState)) {
      newGameState = this.capturePiece(fromI, fromJ, i, j, newGameState);
      newGameState.hasMadeCapture = true;
    } else if (this.isValidMove(fromI, fromJ, i, j, newGameState)) {
      if (hasMadeCapture) {
        // If the player has made a capture, only allow moves that are captures
        return newGameState;
      }
      newGameState = {
        ...newGameState,
        ...this.movePiece(fromI, fromJ, i, j, newGameState),
      };
    }

    // Check if there are more valid captures available for the selected piece
    const validCaptures = this.getValidCaptures(i, j, newGameState);

    if (validCaptures.length > 0) {
      // If there are more valid captures, keep the selected piece and allow the player to make additional captures
      newGameState.selectedPiece = [i, j];
    } else {
      // If there are no more valid captures, clear the selected piece and reset the hasMadeCapture flag
      newGameState.selectedPiece = null;
      newGameState.hasMadeCapture = false;
    }

    return newGameState;
  }

  capturePieceByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): BoardState {
    let { boardState } = cloneDeep(gameState);

    // Capture enemy pieces along the path
    let i = fromI;
    let j = fromJ;
    while (i !== toI && j !== toJ) {
      i += fromI < toI ? 1 : -1;
      j += fromJ < toJ ? 1 : -1;
      if (boardState[i][j].piece) {
        boardState[i][j].piece = null;
        boardState[i][j].isKing = false;
      }
    }

    // Update the board state and current player
    boardState[fromI][fromJ].piece = null;
    boardState[fromI][fromJ].isKing = false;
    boardState[toI][toJ].piece = gameState.currentPlayer;
    boardState[toI][toJ].isKing = true;

    return boardState;
  }

  capturePiece(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    // Check if the piece being moved is a king
    const isKing = newGameState.boardState[fromI][fromJ].isKing;

    newGameState.boardState[toI][toJ].piece = newGameState.boardState[fromI][fromJ].piece;
    newGameState.boardState[toI][toJ].isKing = newGameState.boardState[fromI][fromJ].isKing;
    newGameState.boardState[fromI][fromJ].piece = null;

    if (!isKing) {
      const capturedPieceRow = (fromI + toI) / 2;
      const capturedPieceColumn = (fromJ + toJ) / 2;
      newGameState.boardState[capturedPieceRow][capturedPieceColumn].piece = null;
    } else {
      const updatedBoardState = this.capturePieceByKing(fromI, fromJ, toI, toJ, newGameState);
      if (updatedBoardState) {
        newGameState.boardState = updatedBoardState;
      }
    }

    // Check if the piece can become a king and update its isKing status
    if (this.canBecomeKing(toI, toJ, newGameState)) {
      newGameState.boardState[toI][toJ].isKing = true;
    }

    // Check if there are more valid captures available for the moved piece
    const validCaptures = this.getValidCaptures(toI, toJ, newGameState);

    if (validCaptures.length === 0) {
      // If there are no more valid captures, change the current player
      newGameState.currentPlayer = newGameState.currentPlayer === Color.White ? Color.Black : Color.White;
    }

    return newGameState;
  }

  movePiece(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    newGameState.boardState[toI][toJ].piece = newGameState.boardState[fromI][fromJ].piece;
    newGameState.boardState[toI][toJ].isKing = newGameState.boardState[fromI][fromJ].isKing;
    newGameState.boardState[fromI][fromJ].piece = null;

    // Check if the piece can become a king and update its isKing status
    if (this.canBecomeKing(toI, toJ, gameState)) {
      newGameState.boardState[toI][toJ].isKing = true;
    }

    newGameState.currentPlayer = newGameState.currentPlayer === Color.White ? Color.Black : Color.White;

    return newGameState;
  }

  getValidCapturesByOtherPieces(selectedI: number, selectedJ: number, gameState: GameState): Coordinates[] {
    const { boardState, currentPlayer } = gameState;
    const piecesThatCanCapture: Coordinates[] = [];

    for (let i = 0; i < this.squares; i++) {
      for (let j = 0; j < this.squares; j++) {
        if (i === selectedI && j === selectedJ) {
          continue; // skip the selected piece
        }
        const validCaptures = this.getValidCaptures(i, j, gameState);
        if (validCaptures.length > 0 && boardState[i][j].piece === currentPlayer) {
          piecesThatCanCapture.push([i, j]);
        }
      }
    }

    return piecesThatCanCapture;
  }

  canBecomeKing(i: number, j: number, { currentPlayer }: GameState): boolean {
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

  getValidMoves(i: number, j: number, gameState: GameState): Coordinates[] {
    const validMoves: Coordinates[] = [];
    // Check all possible moves and add them to the validMoves array if they are valid
    for (let toI = 0; toI < this.squares; toI++) {
      for (let toJ = 0; toJ < this.squares; toJ++) {
        if (this.isValidMove(i, j, toI, toJ, gameState)) {
          validMoves.push([toI, toJ]);
        }
      }
    }

    return validMoves;
  }

  getValidCaptures(i: number, j: number, gameState: GameState): Coordinates[] {
    const validCaptures: Coordinates[] = [];
    // Check all possible captures and add them to the validCaptures array if they are valid
    for (let toI = 0; toI < this.squares; toI++) {
      for (let toJ = 0; toJ < this.squares; toJ++) {
        if (this.isValidPieceCapture(i, j, toI, toJ, gameState)) {
          validCaptures.push([toI, toJ]);
        }
      }
    }

    return validCaptures;
  }

  getWinner(gameState: GameState): Color | undefined {
    const { boardState, currentPlayer } = gameState;

    let whitePieces = 0;
    let blackPieces = 0;

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

    for (let i = 0; i < this.squares; i++) {
      for (let j = 0; j < this.squares; j++) {
        if (boardState[i][j].piece !== currentPlayer) {
          continue;
        }
        if (this.getValidCaptures(i, j, gameState).length > 0) {
          return;
        }
        if (this.getValidMoves(i, j, gameState).length > 0) {
          return;
        }
      }
    }

    return currentPlayer === Color.White ? Color.Black : Color.White;
  }
}

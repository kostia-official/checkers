import { Color, GameState, Position } from '@common/types';
import { BaseCheckersStrategy } from './base-checkers-strategy';

export class Checkers64Strategy extends BaseCheckersStrategy {
  squares = 8;

  private rowsNotation = Array.from({ length: 8 }, (_, i) => (this.squares - i).toString());
  private columnsNotation = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  getSquareNotation([i, j]: Position) {
    return `${this.columnsNotation[j]}${this.rowsNotation[i]}`;
  }

  isValidPieceCaptureByKing([fromI, fromJ]: Position, [toI, toJ]: Position, gameState: GameState) {
    // Check if the move is diagonal and the distance is 2 or more
    const distance = Math.abs(fromI - toI);
    if (Math.abs(fromJ - toJ) !== distance || distance < 2) {
      return false;
    }

    // TODO: Use iterateBetweenFromTo
    // Check if there is an enemy piece to capture
    let i = fromI;
    let j = fromJ;
    let piecesCaptured = 0;
    while (i !== toI && j !== toJ) {
      i += fromI < toI ? 1 : -1;
      j += fromJ < toJ ? 1 : -1;

      const capturedPieceSquare = gameState.boardState[i][j];

      if (capturedPieceSquare.piece?.color === gameState.currentPlayer) {
        return false;
      }
      if (capturedPieceSquare.piece?.pendingCapture) {
        return false;
      }

      if (capturedPieceSquare.piece) {
        piecesCaptured++;
      }
    }

    // Check if only 1 piece captured at a time
    if (piecesCaptured !== 1) {
      return false;
    }

    // If all checks pass, the move is valid
    return true;
  }

  isValidPieceCaptureByRegular([fromI, fromJ]: Position, [toI, toJ]: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const capturedPieceRow = (fromI + toI) / 2;
    const capturedPieceColumn = (fromJ + toJ) / 2;
    // TODO: Refactor with getPiece
    const capturedPieceSquare = boardState[capturedPieceRow]?.[capturedPieceColumn];
    const capturedPiece = capturedPieceSquare?.piece;

    if (!capturedPiece || capturedPiece.pendingCapture || capturedPiece.color === currentPlayer) {
      return false;
    }

    // Check that distance is 2
    if (Math.abs(toI - fromI) !== 2) {
      return false;
    }
    if (Math.abs(toJ - fromJ) !== 2) {
      return false;
    }

    return true;
  }

  isValidMoveByKing([fromI, fromJ]: Position, [toI, toJ]: Position, gameState: GameState) {
    // TODO: Use isValidPath
    // Check if the move is diagonal
    if (Math.abs(fromI - toI) !== Math.abs(fromJ - toJ)) {
      return false;
    }

    // TODO: Use iterateBetweenFromTo ?
    // Check if there are no pieces in the path of the move
    let i = fromI;
    let j = fromJ;
    while (i !== toI && j !== toJ) {
      i += fromI < toI ? 1 : -1;
      j += fromJ < toJ ? 1 : -1;
      if (gameState.boardState[i][j].piece) {
        return false;
      }
    }

    // If all checks pass, the move is valid
    return true;
  }

  isValidMoveByRegular([fromI, fromJ]: Position, [toI, toJ]: Position, gameState: GameState): boolean {
    // Check if the move is diagonal and the distance is 1
    if (Math.abs(toI - fromI) !== 1 || Math.abs(toJ - fromJ) !== 1) {
      return false;
    }

    // Check that the move is in the correct direction (forwards for Red, backwards for Black)
    if (gameState.currentPlayer === Color.White) {
      if (toI > fromI) {
        return false;
      }
    } else {
      if (toI < fromI) {
        return false;
      }
    }

    return true;
  }
}

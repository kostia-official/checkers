import { Color, GameState } from '../common/types';
import { BaseCheckersStrategy } from './base-checkers-strategy';

export class Checkers64Strategy extends BaseCheckersStrategy {
  squares = 8;

  isValidPieceCaptureByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState) {
    // Check if the move is diagonal and the distance is 2 or more
    const distance = Math.abs(fromI - toI);
    if (Math.abs(fromJ - toJ) !== distance || distance < 2) {
      return false;
    }

    // Check if there is an enemy piece to capture
    let i = fromI;
    let j = fromJ;
    let piecesCaptured = 0;
    while (i !== toI && j !== toJ) {
      i += fromI < toI ? 1 : -1;
      j += fromJ < toJ ? 1 : -1;
      if (gameState.boardState[i][j].piece === gameState.currentPlayer) {
        return false;
      }

      if (gameState.boardState[i][j].piece) {
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

  isValidPieceCaptureByRegular(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const capturedPieceRow = (fromI + toI) / 2;
    const capturedPieceColumn = (fromJ + toJ) / 2;
    const capturedPiece = boardState[capturedPieceRow]?.[capturedPieceColumn]?.piece;
    if (!capturedPiece || capturedPiece === currentPlayer) {
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

  isValidMoveByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState) {
    // Check if the move is diagonal
    if (Math.abs(fromI - toI) !== Math.abs(fromJ - toJ)) {
      return false;
    }

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

  isValidMoveByRegular(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean {
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

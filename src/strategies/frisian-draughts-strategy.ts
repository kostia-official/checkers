import { GameState } from '@common/types';
import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { toggleColor } from '@common/utils';

export class FrisianDraughtsStrategy extends Checkers100Strategy {
  isValidPieceCaptureByRegular(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const capturedPieceRow = (fromI + toI) / 2;
    const capturedPieceColumn = (fromJ + toJ) / 2;
    const capturedPieceSquare = boardState[capturedPieceRow]?.[capturedPieceColumn];
    const capturedPiece = capturedPieceSquare?.piece;

    if (capturedPieceSquare?.pendingCapture || !capturedPiece || capturedPiece === currentPlayer) {
      return false;
    }

    // Check that distance is 2 using Manhattan distance formula
    if (Math.abs(toI - fromI) + Math.abs(toJ - fromJ) !== 4) {
      return false;
    }

    return true;
  }

  isValidPath(fromI: number, fromJ: number, toI: number, toJ: number) {
    const xDiff = Math.abs(fromI - toI);
    const yDiff = Math.abs(fromJ - toJ);
    const isDiagonalJump = xDiff >= 1 && yDiff >= 1 && xDiff === yDiff;
    const isVerticalCapture = xDiff >= 2 && yDiff === 0;
    const isHorizontalCapture = xDiff === 0 && yDiff >= 2;

    return isDiagonalJump || isVerticalCapture || isHorizontalCapture;
  }

  isValidPieceCaptureByKing(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState) {
    const { boardState, currentPlayer } = gameState;
    const opponentColor = toggleColor(currentPlayer);
    const fromSquare = boardState[fromI]?.[fromJ];
    const toSquare = boardState[toI]?.[toJ];

    // Check if the "from" square is occupied by a king of the current player's color
    if (!fromSquare || fromSquare.piece === opponentColor || !fromSquare.isKing) {
      return false;
    }

    // Check if the "to" square exists, or it's occupied
    if (!toSquare || toSquare.piece) {
      return false;
    }

    // Check if the move is diagonal, vertical, or horizontal
    if (!this.isValidPath(fromI, fromJ, toI, toJ)) {
      return false;
    }

    // Check if there is one opponent's piece in between "from" and "to" squares
    let piecesCaptured = 0;
    let isOwnPieceCaptured = false;
    let isPendingCapturingPiece = false;
    this.iterateBetweenFromTo(fromI, fromJ, toI, toJ, (i, j) => {
      const captured = boardState[i]?.[j];
      if (!captured) return true;

      if (captured?.piece === currentPlayer) {
        isOwnPieceCaptured = true;
        return false;
      }
      if (captured?.pendingCapture) {
        isPendingCapturingPiece = true;
        return false;
      }

      if (captured?.piece === opponentColor) {
        piecesCaptured += 1;
      }

      return true;
    });

    if (isOwnPieceCaptured || isPendingCapturingPiece || piecesCaptured !== 1) {
      return false;
    }

    return true;
  }

  iterateBetweenFromTo(
    fromI: number,
    fromJ: number,
    toI: number,
    toJ: number,
    cb: (i: number, j: number) => boolean
  ): void {
    if (!this.isValidPath(fromI, fromJ, toI, toJ)) {
      return;
    }

    const xDiff = Math.abs(toI - fromI);
    const yDiff = Math.abs(toJ - fromJ);
    let iStep = Math.sign(toI - fromI);
    let jStep = Math.sign(toJ - fromJ);
    // check if it is a horizontal move
    if (yDiff === 0) {
      jStep = 0;
    }
    // check if it is a vertical move
    if (xDiff === 0) {
      iStep = 0;
    }

    for (let i = fromI + iStep, j = fromJ + jStep; i !== toI || j !== toJ; i += iStep, j += jStep) {
      const isProceed = cb(i, j);
      if (!isProceed) return;
    }
  }
}

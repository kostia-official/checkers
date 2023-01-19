import { GameState, Position } from '@common/types';
import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { toggleColor, getSquares, getSquare } from '@common/utils';

export class FrisianDraughtsStrategy extends Checkers100Strategy {
  isValidPieceCaptureByRegular([fromI, fromJ]: Position, [toI, toJ]: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    const capturedPieceRow = (fromI + toI) / 2;
    const capturedPieceColumn = (fromJ + toJ) / 2;
    const capturedPieceSquare = boardState[capturedPieceRow]?.[capturedPieceColumn];
    const capturedPiece = capturedPieceSquare?.piece;

    if (capturedPieceSquare?.pendingCapture || !capturedPiece || capturedPiece === currentPlayer) {
      return false;
    }

    // TODO: Refactor with isValidCapturePath ?
    // Check that distance is 2 using Manhattan distance formula
    if (Math.abs(toI - fromI) + Math.abs(toJ - fromJ) !== 4) {
      return false;
    }

    return true;
  }

  isValidPath([fromI, fromJ]: Position, [toI, toJ]: Position): boolean {
    const xDiff = Math.abs(fromI - toI);
    const yDiff = Math.abs(fromJ - toJ);
    const isDiagonalJump = xDiff >= 1 && yDiff >= 1 && xDiff === yDiff;
    const isVerticalCapture = xDiff >= 2 && yDiff === 0;
    const isHorizontalCapture = xDiff === 0 && yDiff >= 2;

    return isDiagonalJump || isVerticalCapture || isHorizontalCapture;
  }

  getCaptureValue(from: Position, to: Position, gameState: GameState): number {
    let value = 0;

    this.iterateBetweenFromTo(from, to, (position) => {
      const square = getSquare(gameState.boardState, position);
      if (!square.piece) return true;

      if (square.isKing) {
        value += 1.5;
      } else {
        value += 1;
      }

      return true;
    });

    return value;
  }

  isValidPieceCaptureByKing(from: Position, to: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;
    const opponentColor = toggleColor(currentPlayer);

    const { fromSquare, toSquare } = getSquares(boardState, from, to);

    // Check if the "from" square is occupied by a king of the current player's color
    if (!fromSquare || fromSquare.piece === opponentColor || !fromSquare.isKing) {
      return false;
    }

    // Check if the "to" square exists, or it's occupied
    if (!toSquare || toSquare.piece) {
      return false;
    }

    // Check if the move is diagonal, vertical, or horizontal
    if (!this.isValidPath(from, to)) {
      return false;
    }

    // Check if there is one opponent's piece in between "from" and "to" squares
    let piecesCaptured = 0;
    let isOwnPieceCaptured = false;
    let isPendingCapturingPiece = false;
    this.iterateBetweenFromTo(from, to, (position) => {
      const captured = getSquare(boardState, position);
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

  iterateBetweenFromTo(from: Position, to: Position, cb: (position: Position) => boolean): void {
    if (!this.isValidPath(from, to)) {
      return;
    }
    const [fromI, fromJ] = from;
    const [toI, toJ] = to;

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
      const isProceed = cb([i, j]);
      if (!isProceed) return;
    }
  }
}

import { GameState, Position } from '@common/types';
import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { toggleColor, getPiece, getPieces } from '@common/utils';

export class FrisianDraughtsStrategy extends Checkers100Strategy {
  hasMoreRegularPieces(position: Position, gameState: GameState): boolean {
    let result = false;

    this.iterateBoard(position, gameState, (position) => {
      const piece = getPiece(gameState.boardState, position);

      if (piece?.color === gameState.currentPlayer && !piece.isKing) {
        result = true;
        return false;
      }

      return true;
    });

    return result;
  }

  isBiggerCapturePriority(
    piecePosition: Position,
    pieceCaptureValue: number,
    otherPiecePosition: Position,
    otherPieceCaptureValue: number,
    gameState: GameState
  ): boolean {
    const isBiggerCapturePriority = super.isBiggerCapturePriority(
      piecePosition,
      pieceCaptureValue,
      otherPiecePosition,
      otherPieceCaptureValue,
      gameState
    );
    if (!isBiggerCapturePriority) return false;

    const isSameCaptureValue = otherPieceCaptureValue === pieceCaptureValue;
    const isKingOtherPiece = getPiece(gameState.boardState, otherPiecePosition)?.isKing;
    const isKingSelectedPiece = getPiece(gameState.boardState, piecePosition)?.isKing;
    const isOtherKingShouldCapture = isKingOtherPiece && !isKingSelectedPiece;

    if (isSameCaptureValue && isOtherKingShouldCapture) {
      // King has priority to capture
      return false;
    }

    return isBiggerCapturePriority;
  }

  // TODO: Finish locking king after 3 moves
  // handlePieceClick(position: Position, gameState: GameState): Position | undefined {
  //   const selectedPiece = super.handlePieceClick(position, gameState);
  //   if (!selectedPiece) return;

  // const reachedMovesLimit = false;
  // if (!reachedMovesLimit) return selectedPiece;
  //
  // const hasMoreRegularPieces = this.hasMoreRegularPieces(position, gameState);
  // if (!hasMoreRegularPieces) return selectedPiece;
  //
  // const canCapture = !!this.getValidCaptures(selectedPiece, gameState).length;
  // if (canCapture) return selectedPiece;

  //   return selectedPiece;
  // }

  isValidPieceCaptureByRegular([fromI, fromJ]: Position, [toI, toJ]: Position, gameState: GameState): boolean {
    const { boardState, currentPlayer } = gameState;

    // TODO: Refactor with getPiece
    const capturedPieceRow = (fromI + toI) / 2;
    const capturedPieceColumn = (fromJ + toJ) / 2;
    const capturedPieceSquare = boardState[capturedPieceRow]?.[capturedPieceColumn];
    const capturedPiece = capturedPieceSquare?.piece;

    if (!capturedPiece || capturedPiece?.pendingCapture || capturedPiece.color === currentPlayer) {
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
      const piece = getPiece(gameState.boardState, position);
      if (!piece) return true;

      if (piece.isKing) {
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

    const { fromPiece, toPiece } = getPieces(boardState, from, to);

    // Check if the "from" square is occupied by a king of the current player's color
    if (!fromPiece || fromPiece.color === opponentColor || !fromPiece.isKing) {
      return false;
    }

    // Check if the "to" square exists, or it's occupied
    if (toPiece) {
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
      const captured = getPiece(boardState, position);
      if (!captured) return true;

      if (captured.color === currentPlayer) {
        isOwnPieceCaptured = true;
        return false;
      }
      if (captured.pendingCapture) {
        isPendingCapturingPiece = true;
        return false;
      }

      if (captured.color === opponentColor) {
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

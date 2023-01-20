import { GameState, Position } from '@common/types';
import { Draughts100Strategy } from '@strategies/draughts100-strategy';
import { toggleColor, getPiece, getPieces, isEqualPosition } from '@common/utils';
import { t } from 'i18next';

export class FrisianDraughtsStrategy extends Draughts100Strategy {
  readonly kingMovesLimit = 3;

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

  movePiece(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = super.movePiece(from, to, gameState);
    const wasMove = gameState.currentPlayer !== newGameState.currentPlayer;
    const piece = getPiece(newGameState.boardState, to);

    // Increment king moves count
    if (wasMove && piece?.isKing) {
      newGameState.limitedJumpsCount = this.updateLimitedJumpsCount(
        `${piece.color}/${piece.id}`,
        newGameState.limitedJumpsCount,
        (prevCount) => prevCount + 1
      );
    }

    if (wasMove && piece) {
      // Limited king moves count resets after move of other piece
      newGameState.limitedJumpsCount = this.mapLimitedJumpsCount(newGameState.limitedJumpsCount, (key, count) => {
        // For other pieces with the same color reset count
        if (!key.includes(String(piece.id)) && key.includes(piece.color)) {
          return 0;
        }

        return count;
      });
    }

    return newGameState;
  }

  capturePiece(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = super.capturePiece(from, to, gameState);
    const wasCapture = gameState.currentPlayer !== newGameState.currentPlayer;
    const piece = getPiece(newGameState.boardState, to);

    if (wasCapture && piece) {
      // Limited king moves count resets after capture
      newGameState.limitedJumpsCount = this.mapLimitedJumpsCount(newGameState.limitedJumpsCount, (key, count) => {
        // Reset count for all pieces with the same color
        if (key.includes(piece.color)) {
          return 0;
        }

        return count;
      });
    }

    return newGameState;
  }

  hasMoreRegularPieces(currentPosition: Position, gameState: GameState): boolean {
    let result = false;

    this.iterateBoard(currentPosition, gameState, (position) => {
      if (isEqualPosition(position, currentPosition)) return true;

      const piece = getPiece(gameState.boardState, position);

      if (piece?.color === gameState.currentPlayer && !piece.isKing) {
        result = true;
        return false;
      }

      return true;
    });

    return result;
  }

  handlePieceClick(position: Position, gameState: GameState): GameState | undefined {
    const newGameState = super.handlePieceClick(position, gameState);
    if (!newGameState?.selectedPiece) return;

    const selectedPosition = newGameState.selectedPiece;

    const piece = getPiece(gameState.boardState, selectedPosition);

    if (!piece) return;
    if (!piece.isKing) return newGameState;

    // King moves limit rules

    // King can't move more than 3 times
    const kingMovesCount = gameState.limitedJumpsCount?.[`${gameState.currentPlayer}/${piece.id}`] ?? 0;
    const reachedMovesLimit = kingMovesCount >= this.kingMovesLimit;
    if (!reachedMovesLimit) return newGameState;

    // King can move without limits if it has more regular pieces
    const hasMoreRegularPieces = this.hasMoreRegularPieces(position, gameState);
    if (!hasMoreRegularPieces) return newGameState;

    // King can capture without limits
    const canCapture = !!this.getValidCaptures(selectedPosition, gameState).length;
    if (canCapture) return newGameState;

    return this.addAlert(t('gameAlerts.kingMaxMoves'), gameState);
  }

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

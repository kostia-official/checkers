import { GameState, Position } from '@common/types';
import cloneDeep from 'lodash.clonedeep';
import { Checkers64Strategy } from './checkers64-strategy';
import { toggleColor, hasPosition, getPiece } from '@common/utils';

export class Checkers100Strategy extends Checkers64Strategy {
  squares = 10;

  getSquareNotation([i, j]: Position): string {
    return String(i * 5 + j / 2 + 0.5 + (i % 2) / 2);
  }

  isBiggerCapturePriority(
    piecePosition: Position,
    pieceCaptureValue: number,
    otherPiecePosition: Position,
    otherPieceCaptureValue: number,
    gameState: GameState
  ): boolean {
    return pieceCaptureValue >= otherPieceCaptureValue;
  }

  handlePieceClick(position: Position, gameState: GameState): GameState | undefined {
    const newGameState = super.handlePieceClick(position, gameState);
    if (!newGameState) return;

    const { captureValue: pieceCaptureValue, captures } = this.getBiggestCaptures(position, gameState);
    if (!captures.length) return { ...gameState, selectedPiece: newGameState.selectedPiece };

    const otherPiecesWithValidCaptures = this.getOtherPiecesWithValidCaptures(position, gameState);

    for (const otherPiecePosition of otherPiecesWithValidCaptures) {
      const { captureValue: otherPieceCaptureValue } = this.getBiggestCaptures(otherPiecePosition, gameState);

      if (
        !this.isBiggerCapturePriority(
          position,
          pieceCaptureValue,
          otherPiecePosition,
          otherPieceCaptureValue,
          gameState
        )
      ) {
        return;
      }
    }

    return newGameState;
  }

  handleSquareClick(to: Position, gameState: GameState): GameState | undefined {
    const { selectedPiece } = gameState;
    if (!selectedPiece) return;

    // If not capture use regular logic
    if (!this.isValidPieceCapture(selectedPiece, to, gameState)) {
      return super.handleSquareClick(to, gameState);
    }

    const biggestCaptures = this.getBiggestCaptures(selectedPiece, gameState).captures;
    const isBiggestCapture = hasPosition(biggestCaptures, to);

    if (!isBiggestCapture) return;

    return super.handleSquareClick(to, gameState);
  }

  getValidJumps(from: Position, gameState: GameState): Position[] {
    const { captures: biggestCaptures } = this.getBiggestCaptures(from, gameState);
    const validMoves = biggestCaptures.length ? undefined : this.getValidMoves(from, gameState);

    return validMoves || biggestCaptures;
  }

  getBiggestCaptures(from: Position, gameState: GameState): { captures: Position[]; captureValue: number } {
    const validCaptures = super.getValidCaptures(from, gameState);
    let highestValue = 0;
    const capturesOfValue: Record<number, Position[]> = {};

    // loop through all the valid captures
    for (const to of validCaptures) {
      // Check the value of captures that can be made from the current capture
      const value = this.getBiggestCaptureValue(from, to, gameState);

      if (capturesOfValue[value] === undefined) {
        capturesOfValue[value] = [];
      }
      capturesOfValue[value].push(to);

      // update the highest amount if the current capture has more captures
      if (value > highestValue) {
        highestValue = value;
      }
    }

    return { captures: capturesOfValue[highestValue] || [], captureValue: highestValue };
  }

  getBiggestCaptureValue(from: Position, to: Position, gameState: GameState): number {
    let biggestValue = 0;
    let clonedGameState = cloneDeep(gameState);

    // Check if the capture is valid
    if (this.isValidPieceCapture(from, to, clonedGameState)) {
      // Increment the biggestValue of captured pieces
      biggestValue += this.getCaptureValue(from, to, clonedGameState);

      clonedGameState.boardState = this.markPendingCapture(from, to, clonedGameState).boardState;

      // Get the valid captures for the new position
      const nextValidCaptures = this.getValidCaptures(to, clonedGameState);
      let nextValue = 0;

      for (const nextTo of nextValidCaptures) {
        const captureValue = this.getBiggestCaptureValue(to, nextTo, clonedGameState);
        nextValue = captureValue > nextValue ? captureValue : nextValue;
      }
      biggestValue += nextValue;
    }

    return biggestValue;
  }

  protected updateGameStateAfterCapture(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    const toPiece = getPiece(newGameState.boardState, to);
    if (!toPiece) return newGameState;

    // Check if there are more valid captures available for the moved piece
    const validCaptures = this.getValidCaptures(to, newGameState);
    const hasValidCaptures = validCaptures.length > 0;

    // The piece can become a king if no more captures for it as a regular piece
    if (!hasValidCaptures && this.canBecomeKing(to, newGameState.currentPlayer)) {
      toPiece.isKing = true;
    }

    if (!hasValidCaptures) {
      // If there are no more valid captures, change the current player
      newGameState.currentPlayer = toggleColor(newGameState.currentPlayer);

      newGameState.boardState = this.removePendingCapturePieces(newGameState.boardState);
    }

    return newGameState;
  }
}

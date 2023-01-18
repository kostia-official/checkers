import { GameState, Position } from '@common/types';
import cloneDeep from 'lodash.clonedeep';
import { Checkers64Strategy } from './checkers64-strategy';
import { toggleColor, hasPosition, getSquare } from '@common/utils';

export class Checkers100Strategy extends Checkers64Strategy {
  squares = 10;

  getSquareNotation([i, j]: Position): string {
    return String(i * 5 + j / 2 + 0.5 + (i % 2) / 2);
  }

  handlePieceClick(position: Position, gameState: GameState): Position | undefined {
    const selectedPiece = super.handlePieceClick(position, gameState);

    if (!selectedPiece) return;

    // Check if the clicked piece has the most captures
    const { amount: clickedPieceCaptures } = this.getBiggestCaptures(position, gameState);

    for (const otherPiecePosition of this.getOtherPiecesWithValidCaptures(position, gameState)) {
      const { amount: otherCaptures } = this.getBiggestCaptures(otherPiecePosition, gameState);
      if (otherCaptures > clickedPieceCaptures) {
        // The clicked piece does not have the most captures, so it cannot be selected
        return;
      }
    }

    return selectedPiece;
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

  isValidJump(from: Position, to: Position, gameState: GameState): boolean {
    if (!this.isValidPath(from, to)) return false;

    const biggestCaptures = this.getBiggestCaptures(from, gameState).captures;
    const isValidMove = !!biggestCaptures.length ? false : this.isValidMove(from, to, gameState);
    const isBiggestCapture = hasPosition(biggestCaptures, to);

    return isValidMove || isBiggestCapture;
  }

  getBiggestCaptures(from: Position, gameState: GameState): { captures: Position[]; amount: number } {
    const validCaptures = super.getValidCaptures(from, gameState);
    let highestAmount = 0;
    const amountCaptures: Record<number, Position[]> = {};

    // loop through all the valid captures
    for (const to of validCaptures) {
      // Check the amount of captures that can be made from the current capture
      const amount = this.getMostAmountCanBeCaptured(from, to, gameState);
      if (amountCaptures[amount] === undefined) {
        amountCaptures[amount] = [];
      }
      amountCaptures[amount].push(to);

      // update the highest amount if the current capture has more captures
      if (amount > highestAmount) {
        highestAmount = amount;
      }
    }

    return { captures: amountCaptures[highestAmount] || [], amount: highestAmount };
  }

  getMostAmountCanBeCaptured(from: Position, to: Position, gameState: GameState): number {
    let amount = 0;

    // Clone the game state to avoid mutating the original
    let clonedGameState = cloneDeep(gameState);

    // Check if the capture is valid
    if (this.isValidPieceCapture(from, to, clonedGameState)) {
      // Increment the amount of captured pieces
      amount += 1;

      clonedGameState.boardState = this.capturePiece(from, to, clonedGameState).boardState;

      // Get the valid captures for the new position
      const nextValidCaptures = this.getValidCaptures(to, clonedGameState);
      let nextAmount = 0;

      for (const nextTo of nextValidCaptures) {
        const captureAmount = this.getMostAmountCanBeCaptured(to, nextTo, clonedGameState);
        nextAmount = captureAmount > nextAmount ? captureAmount : nextAmount;
      }
      amount += nextAmount;
    }

    return amount;
  }

  protected updateGameStateAfterCapture(from: Position, to: Position, gameState: GameState): GameState {
    const newGameState = cloneDeep(gameState);

    // Check if there are more valid captures available for the moved piece
    const validCaptures = this.getValidCaptures(to, newGameState);
    const hasValidCaptures = validCaptures.length > 0;

    // The piece can become a king if no more captures for it as a regular piece
    if (!hasValidCaptures && this.canBecomeKing(to, newGameState.currentPlayer)) {
      getSquare(newGameState.boardState, to).isKing = true;
    }

    if (!hasValidCaptures) {
      // If there are no more valid captures, change the current player
      newGameState.currentPlayer = toggleColor(newGameState.currentPlayer);

      newGameState.boardState = this.removePendingCapturePieces(newGameState.boardState);
    }

    return newGameState;
  }
}

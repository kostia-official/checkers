import { GameState, Coordinates } from '@common/types';
import cloneDeep from 'lodash.clonedeep';
import { Checkers64Strategy } from './checkers64-strategy';
import { toggleColor } from '@common/utils';

export class Checkers100Strategy extends Checkers64Strategy {
  squares = 10;

  getSquareNotation(i: number, j: number) {
    return String(i * 5 + j / 2 + 0.5 + (i % 2) / 2);
  }

  handlePieceClick(i: number, j: number, gameState: GameState): Coordinates | undefined {
    const selectedPiece = super.handlePieceClick(i, j, gameState);

    if (!selectedPiece) return;

    // Check if the clicked piece has the most captures
    const { amount: clickedPieceCaptures } = this.getBiggestCaptures(i, j, gameState);

    for (const [otherI, otherJ] of this.getOtherPiecesWithValidCaptures(i, j, gameState)) {
      const { amount: otherCaptures } = this.getBiggestCaptures(otherI, otherJ, gameState);
      if (otherCaptures > clickedPieceCaptures) {
        // The clicked piece does not have the most captures, so it cannot be selected
        return;
      }
    }

    return selectedPiece;
  }

  handleSquareClick(toI: number, toJ: number, gameState: GameState): GameState | undefined {
    const { selectedPiece } = gameState;
    if (!selectedPiece) return;

    const [fromI, fromJ] = selectedPiece;

    // If not capture use regular logic
    if (!this.isValidPieceCapture(fromI, fromJ, toI, toJ, gameState)) {
      return super.handleSquareClick(toI, toJ, gameState);
    }

    const biggestCaptures = this.getBiggestCaptures(selectedPiece[0], selectedPiece[1], gameState).captures;
    const isBiggestCapture = biggestCaptures.some(([x, y]) => x === toI && y === toJ);

    if (!isBiggestCapture) return;

    return super.handleSquareClick(toI, toJ, gameState);
  }

  isValidJump(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): boolean {
    if (!this.isValidPath(fromI, fromJ, toI, toJ)) return false;

    const biggestCaptures = this.getBiggestCaptures(fromI, fromJ, gameState).captures;
    const isValidMove = !!biggestCaptures.length ? false : this.isValidMove(fromI, fromJ, toI, toJ, gameState);

    return isValidMove || biggestCaptures.some(([x, y]) => x === toI && y === toJ);
  }

  getBiggestCaptures(fromI: number, fromJ: number, gameState: GameState): { captures: Coordinates[]; amount: number } {
    const validCaptures = super.getValidCaptures(fromI, fromJ, gameState);
    let highestAmount = 0;
    const amountCaptures: Record<number, Coordinates[]> = {};

    // loop through all the valid captures
    for (const [toI, toJ] of validCaptures) {
      // Check the amount of captures that can be made from the current capture
      const amount = this.getMostAmountCanBeCaptured(fromI, fromJ, toI, toJ, gameState);
      if (amountCaptures[amount] === undefined) {
        amountCaptures[amount] = [];
      }
      amountCaptures[amount].push([toI, toJ]);

      // update the highest amount if the current capture has more captures
      if (amount > highestAmount) {
        highestAmount = amount;
      }
    }

    return { captures: amountCaptures[highestAmount] || [], amount: highestAmount };
  }

  getMostAmountCanBeCaptured(fromI: number, fromJ: number, toI: number, toJ: number, gameState: GameState): number {
    let amount = 0;

    // Clone the game state to avoid mutating the original
    let clonedGameState = cloneDeep(gameState);

    // Check if the capture is valid
    if (this.isValidPieceCapture(fromI, fromJ, toI, toJ, clonedGameState)) {
      // Increment the amount of captured pieces
      amount += 1;

      clonedGameState.boardState = this.capturePiece(fromI, fromJ, toI, toJ, clonedGameState).boardState;

      // Get the valid captures for the new position
      const nextValidCaptures = this.getValidCaptures(toI, toJ, clonedGameState);
      let nextAmount = 0;

      for (const [nextToI, nextToJ] of nextValidCaptures) {
        const captureAmount = this.getMostAmountCanBeCaptured(toI, toJ, nextToI, nextToJ, clonedGameState);
        nextAmount = captureAmount > nextAmount ? captureAmount : nextAmount;
      }
      amount += nextAmount;
    }

    return amount;
  }

  protected updateGameStateAfterCapture(
    fromI: number,
    fromJ: number,
    toI: number,
    toJ: number,
    gameState: GameState
  ): GameState {
    const newGameState = cloneDeep(gameState);

    // Check if there are more valid captures available for the moved piece
    const validCaptures = this.getValidCaptures(toI, toJ, newGameState);
    const hasValidCaptures = validCaptures.length > 0;

    // The piece can become a king if no more captures for it as a regular piece
    if (!hasValidCaptures && this.canBecomeKing(toI, toJ, newGameState.currentPlayer)) {
      newGameState.boardState[toI][toJ].isKing = true;
    }

    if (!hasValidCaptures) {
      // If there are no more valid captures, change the current player
      newGameState.currentPlayer = toggleColor(newGameState.currentPlayer);

      newGameState.boardState = this.removePendingCapturePieces(newGameState.boardState);
    }

    return newGameState;
  }
}

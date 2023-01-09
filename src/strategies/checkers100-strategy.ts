import { GameState, Coordinates, Color } from '../common/types';
import cloneDeep from 'lodash.clonedeep';
import { Checkers64Strategy } from './checkers64-strategy';

export class Checkers100Strategy extends Checkers64Strategy {
  squares = 10;

  handlePieceClick(i: number, j: number, gameState: GameState): Coordinates | undefined {
    const selectedPiece = super.handlePieceClick(i, j, gameState);

    if (!selectedPiece) return;

    // Check if the clicked piece has the most captures
    const clickedPieceCaptures = this.getMostAmountCanBeCaptured(i, j, gameState);

    for (const [otherI, otherJ] of this.getOtherPiecesWithValidCaptures(i, j, gameState)) {
      const otherCaptures = this.getMostAmountCanBeCaptured(otherI, otherJ, gameState);
      if (otherCaptures > clickedPieceCaptures) {
        // The clicked piece does not have the most captures, so it cannot be selected
        return;
      }
    }

    return selectedPiece;
  }

  getMostAmountCanBeCaptured(fromI: number, fromJ: number, gameState: GameState): number {
    let amount = 0;

    // Clone the game state to avoid mutating the original
    let clonedGameState = cloneDeep(gameState);

    // Get the valid captures for the current position
    const validCaptures = this.getValidCaptures(fromI, fromJ, clonedGameState);

    // Loop through all the valid captures
    for (const [toI, toJ] of validCaptures) {
      // Check if the capture is valid
      if (this.isValidPieceCaptureByRegular(fromI, fromJ, toI, toJ, clonedGameState)) {
        // Increment the amount of captured pieces
        let captures = 1;

        // Remove the captured piece from the board
        clonedGameState.boardState[(fromI + toI) / 2][(fromJ + toJ) / 2].piece = null;

        // Update the position of the capturing piece
        clonedGameState.boardState[toI][toJ].piece = gameState.currentPlayer;

        // Get the valid captures for the new position
        const nextValidCaptures = this.getValidCaptures(toI, toJ, clonedGameState);

        // If there are more valid captures, continue the loop
        if (nextValidCaptures.length > 0) {
          captures += this.getMostAmountCanBeCaptured(toI, toJ, clonedGameState);
        }

        // Update the amount of pieces captured if the current path captures more pieces than the previous paths
        if (captures > amount) {
          amount = captures;
        }
      }
    }

    return amount;
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

    // Check if there are more valid captures available for the moved piece
    const validCaptures = this.getValidCaptures(toI, toJ, newGameState);
    const hasValidCaptures = validCaptures.length > 0;

    // The piece can become a king if no more captures for it as a regular piece
    if (!hasValidCaptures && this.canBecomeKing(toI, toJ, newGameState)) {
      newGameState.boardState[toI][toJ].isKing = true;
    }

    if (!hasValidCaptures) {
      // If there are no more valid captures, change the current player
      newGameState.currentPlayer = newGameState.currentPlayer === Color.White ? Color.Black : Color.White;
    }

    return newGameState;
  }
}

import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { createBoard } from '@common/test-utils/board';
import { Color, GameState } from '@common/types';

describe('getMostAmountCanBeCaptured', () => {
  it('should return 2 for most amount can be captured', () => {
    const strategy = new Checkers100Strategy();

    const board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 0],
      [0, 0, 1, 0, 0, 0],
    ];
    const boardState = createBoard(board);

    const fromI = 5;
    const fromJ = 2;

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    expect(strategy.getMostAmountCanBeCaptured(fromI, fromJ, gameState)).toBe(2);
  });
});

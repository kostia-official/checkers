import { Position } from '@common/types';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createGameState } from '@common/test-utils/gameState';

describe('handlePieceClick', () => {
  it('should not select a piece for move when a capture is available', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0],
      [1, 0, 1, 0, 0],
    ];
    const gameState = createGameState(board);

    const from: Position = [4, 0];

    let newGameState = strategy.handlePieceClick(from, gameState);
    expect(newGameState?.selectedPiece).toBeUndefined();
  });
});

import { Position, GameState, Color } from '@common/types';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createBoard } from '@common/test-utils/board';

describe('handlePieceClick', () => {
  it('should not select a regular piece when a king can capture with the same value', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [2, 0, 0, 0, 2],
      [1, 0, 0, 0, 3],
    ];
    const boardState = createBoard(board);

    const regularPiecePosition: Position = [4, 0];
    const kingPosition: Position = [4, 4];

    const gameState: GameState = {
      boardState,
      currentPlayer: Color.White,
      hasMadeCapture: false,
      selectedPiece: null,
    };

    const selectedPiece = strategy.handlePieceClick(regularPiecePosition, gameState);
    expect(selectedPiece).toBeUndefined();

    const selectedKing = strategy.handlePieceClick(kingPosition, gameState);
    expect(selectedKing).toStrictEqual(kingPosition);
  });
});

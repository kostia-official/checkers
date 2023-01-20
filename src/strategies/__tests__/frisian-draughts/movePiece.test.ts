import { Position, Color } from '@common/types';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createGameState } from '@common/test-utils/gameState';
import { getPiece } from '@common/utils';

describe('handlePieceClick', () => {
  it("should increment king's limited moves count when king moves", () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 3, 0, 0],
    ];
    const from: Position = [4, 0];
    const to: Position = [2, 2];
    const gameState = createGameState(board, { selectedPiece: from });

    const piece = getPiece(gameState.boardState, from);

    const newGameState = strategy.movePiece(from, to, gameState);

    expect(newGameState.limitedJumpsCount).toStrictEqual({
      [`white/${piece?.id}`]: 1,
    });
  });

  it("should clear king's limited moves count when other piece moves", () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 1, 0, 0],
    ];
    const from: Position = [4, 2];
    const to: Position = [3, 3];
    const gameState = createGameState(board, { selectedPiece: from });

    const king = getPiece(gameState.boardState, [0, 4]);
    gameState.limitedJumpsCount = {
      [`white/${king?.id}`]: strategy.kingMovesLimit,
    };

    const newGameState = strategy.movePiece(from, to, gameState);

    expect(newGameState.limitedJumpsCount).toStrictEqual({
      [`white/${king?.id}`]: 0,
    });
  });

  it("should not clear king's limited moves count when opponent's piece moves", () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 1, 0, 0],
    ];
    const from: Position = [0, 4];
    const to: Position = [1, 3];
    const gameState = createGameState(board, { selectedPiece: from, currentPlayer: Color.Black });

    const king = getPiece(gameState.boardState, [0, 4]);
    gameState.limitedJumpsCount = {
      [`white/${king?.id}`]: strategy.kingMovesLimit,
    };

    const newGameState = strategy.movePiece(from, to, gameState);

    expect(newGameState.limitedJumpsCount).toStrictEqual({
      [`white/${king?.id}`]: strategy.kingMovesLimit,
    });
  });
});

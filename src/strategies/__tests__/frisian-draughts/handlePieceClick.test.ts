import { Position } from '@common/types';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { createGameState } from '@common/test-utils/gameState';
import { getPiece } from '@common/utils';

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
    const gameState = createGameState(board);

    const regularPiecePosition: Position = [4, 0];
    const kingPosition: Position = [4, 4];

    let newGameState = strategy.handlePieceClick(regularPiecePosition, gameState);
    expect(newGameState?.selectedPiece).toBeUndefined();

    newGameState = strategy.handlePieceClick(kingPosition, gameState);
    expect(newGameState?.selectedPiece).toStrictEqual(kingPosition);
  });

  it('should not select a king when has reached limit of moves and has other pieces', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 1, 0, 0],
    ];
    const selectPosition: Position = [4, 0];
    const gameState = createGameState(board);

    const piece = getPiece(gameState.boardState, selectPosition);
    gameState.limitedJumpsCount = {
      [`white/${piece?.id}`]: strategy.kingMovesLimit,
    };

    const newGameState = strategy.handlePieceClick(selectPosition, gameState);
    expect(newGameState?.selectedPiece).toBeUndefined();
  });

  it('should select a king when has reached limit of moves but the only piece', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0],
    ];
    const selectPosition: Position = [4, 0];
    const gameState = createGameState(board);

    const piece = getPiece(gameState.boardState, selectPosition);
    gameState.limitedJumpsCount = {
      [`white/${piece?.id}`]: strategy.kingMovesLimit,
    };

    const newGameState = strategy.handlePieceClick(selectPosition, gameState);
    expect(newGameState?.selectedPiece).toStrictEqual(selectPosition);
  });

  it('should select a king when has reached limit of moves but can capture', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 1, 0, 0],
    ];
    const selectPosition: Position = [4, 0];
    const gameState = createGameState(board);

    const piece = getPiece(gameState.boardState, selectPosition);
    gameState.limitedJumpsCount = {
      [`white/${piece?.id}`]: strategy.kingMovesLimit,
    };

    const newGameState = strategy.handlePieceClick(selectPosition, gameState);
    expect(newGameState?.selectedPiece).toStrictEqual(selectPosition);
  });

  it('should select a king when not reached limit of moves', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 1, 0, 0],
    ];
    const selectPosition: Position = [4, 0];
    const gameState = createGameState(board);

    const piece = getPiece(gameState.boardState, selectPosition);
    gameState.limitedJumpsCount = {
      [`white/${piece?.id}`]: strategy.kingMovesLimit - 1,
    };

    const newGameState = strategy.handlePieceClick(selectPosition, gameState);
    expect(newGameState?.selectedPiece).toStrictEqual(selectPosition);
  });

  it('should select a king when reached limit of moves but has only kings', () => {
    const strategy = new FrisianDraughtsStrategy();

    const board = [
      [0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [3, 0, 3, 0, 0],
    ];
    const selectPosition: Position = [4, 0];
    const gameState = createGameState(board);

    const piece = getPiece(gameState.boardState, selectPosition);
    gameState.limitedJumpsCount = {
      [`white/${piece?.id}`]: strategy.kingMovesLimit,
    };

    const newGameState = strategy.handlePieceClick(selectPosition, gameState);
    expect(newGameState?.selectedPiece).toStrictEqual(selectPosition);
  });
});

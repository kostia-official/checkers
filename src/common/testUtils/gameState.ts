import { BoardState, Color, GameState } from '../types';

export function createGameState(
  board: number[][],
  otherGameState: Partial<GameState> = {}
): GameState {
  let id = -1;
  const boardState: BoardState = [];
  for (let i = 0; i < board.length; i++) {
    boardState[i] = [];

    for (let j = 0; j < board[i].length; j++) {
      id += 1;

      let pieceColor: Color | undefined;
      let isKing = false;

      if (board[i][j] === 1) {
        pieceColor = Color.White;
      } else if (board[i][j] === 2) {
        pieceColor = Color.Black;
      } else if (board[i][j] === 3) {
        pieceColor = Color.White;
        isKing = true;
      } else if (board[i][j] === 4) {
        pieceColor = Color.Black;
        isKing = true;
      }

      boardState[i][j] = {
        piece: pieceColor && {
          id,
          color: pieceColor,
          isKing,
        },
      };
    }
  }

  return {
    boardState,
    currentPlayer: Color.White,
    hasMadeCapture: false,
    selectedPiece: null,
    jumpFrom: null,
    jumpTo: null,
    limitedJumpsCount: {},
    gameAlerts: [],
    ...otherGameState,
  };
}

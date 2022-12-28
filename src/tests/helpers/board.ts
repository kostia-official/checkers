import { BoardState, Color } from '../../common/types';

export function createBoard(board: number[][]) {
  const boardState: BoardState = [];
  for (let i = 0; i < board.length; i++) {
    boardState[i] = [];

    for (let j = 0; j < board[i].length; j++) {
      let piece: Color | null = null;
      let isKing = false;

      if (board[i][j] === 1) {
        piece = Color.White;
      } else if (board[i][j] === 2) {
        piece = Color.Black;
      } else if (board[i][j] === 3) {
        piece = Color.White;
        isKing = true;
      } else if (board[i][j] === 4) {
        piece = Color.Black;
        isKing = true;
      }

      boardState[i][j] = {
        piece,
        isKing
      };
    }
  }
  return boardState;
}

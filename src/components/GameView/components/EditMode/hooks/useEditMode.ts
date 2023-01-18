import { useState } from 'react';
import { Color, GameState, Position } from '../../../../../common/types';

export interface HookArgs {
  gameState: GameState;
  updateGameState: (gameState: GameState) => void;
}

export const useEditMode = ({ updateGameState, gameState }: HookArgs) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isKing, setIsKing] = useState(false);
  const [editPiecesColor, setEditPiecesColor] = useState<Color>(Color.White);

  const enableEditMode = () => {
    setIsEditMode(true);
    updateGameState({ ...gameState, selectedPiece: null });
  };

  const disableEditMode = () => {
    setIsEditMode(false);
    updateGameState({ ...gameState, currentPlayer: editPiecesColor });
  };

  const clearBoard = () => {
    const updatedGameState = {
      ...gameState,
      boardState: gameState.boardState.map((row) =>
        row.map((square) => ({ ...square, piece: null, isKing: false, pendingCapture: undefined }))
      ),
    };
    updateGameState(updatedGameState);
  };

  const handleSquareEdit = ([i, j]: Position) => {
    const piece = gameState.boardState[i][j].piece;
    const updatedPiece = piece ? null : editPiecesColor;
    const updatedIsKing = piece ? false : isKing;

    const updatedBoardState = gameState.boardState.map((row, rowIndex) =>
      row.map((square, squareIndex) =>
        rowIndex === i && squareIndex === j ? { ...square, piece: updatedPiece, isKing: updatedIsKing } : square
      )
    );

    updateGameState({ ...gameState, boardState: updatedBoardState });
  };

  return {
    isEditMode,
    enableEditMode,
    disableEditMode,
    isKing,
    setIsKing,
    editPiecesColor,
    setEditPiecesColor,
    clearBoard,
    handleSquareEdit,
  };
};

export type EditModeState = ReturnType<typeof useEditMode>;

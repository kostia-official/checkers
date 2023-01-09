import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BoardState, Color, Coordinates, GameState, GameStateHistory } from '@common/types';
import { ICheckersStrategy } from '@strategies/checkers-strategy.interface';
import { useEditMode } from '@components/GameView/components/EditMode/hooks/useEditMode';
import { GameView } from '@components/GameView';
import { useTranslation } from 'react-i18next';

export interface CheckersGameProps {
  strategy: ICheckersStrategy;
}

export const OfflineGame: React.FC<CheckersGameProps> = ({ strategy }) => {
  const { t } = useTranslation();

  const [boardState, setBoardState] = useState<BoardState>(strategy.makeInitialBoardState());
  const [currentPlayer, setCurrentPlayer] = useState<Color>(Color.White);
  const [gameStateHistory, setGameStateHistory] = useState<GameStateHistory>([
    { boardState, currentPlayerColor: currentPlayer },
  ]);
  const [winner, setWinner] = useState<Color | undefined>();
  const [selectedPiece, setSelectedPiece] = useState<Coordinates | null>(null);
  const [hasMadeCapture, setHasMadeCapture] = useState(false);

  const updateGameState = ({ boardState, currentPlayer, selectedPiece, hasMadeCapture }: GameState) => {
    setBoardState(boardState);
    setCurrentPlayer(currentPlayer);
    setSelectedPiece(selectedPiece);
    setHasMadeCapture(hasMadeCapture);

    setGameStateHistory((prev) => [...prev, { boardState, currentPlayerColor: currentPlayer }]);
  };

  const handleUndoMove = () => {
    const prevGameHistory = gameStateHistory[gameStateHistory.length - 2];
    if (!prevGameHistory) return;

    setBoardState(prevGameHistory.boardState);
    setCurrentPlayer(prevGameHistory.currentPlayerColor);
    setSelectedPiece(null);
    setWinner(undefined);
    setGameStateHistory(gameStateHistory.slice(0, gameStateHistory.length - 1));
  };

  const getGameState = useCallback((): GameState => {
    return { currentPlayer, boardState, selectedPiece, hasMadeCapture };
  }, [boardState, currentPlayer, hasMadeCapture, selectedPiece]);

  const handlePieceClick = (i: number, j: number) => {
    const newSelectedPiece = strategy.handlePieceClick(i, j, getGameState());
    if (newSelectedPiece) setSelectedPiece(newSelectedPiece);
  };

  const handleSquareClick = (i: number, j: number) => {
    const newGameState = strategy.handleSquareClick(i, j, getGameState());
    if (newGameState) updateGameState(newGameState);
  };

  const handleNewGame = () => {
    const initialBoard = strategy.makeInitialBoardState();
    setBoardState(initialBoard);
    setGameStateHistory([{ boardState: initialBoard, currentPlayerColor: Color.White }]);

    setCurrentPlayer(Color.White);
    setWinner(undefined);
    setSelectedPiece(null);
    setHasMadeCapture(false);
  };

  const editModeState = useEditMode({ gameState: getGameState(), updateGameState });

  useEffect(() => {
    if (editModeState.isEditMode) {
      setWinner(undefined);
      return;
    }

    const winner = strategy.getWinner(getGameState());
    if (winner) {
      setWinner(winner);
    }
  }, [getGameState, strategy, editModeState.isEditMode]);

  const winnerLabel = useMemo(() => {
    if (!winner) return;

    return winner === Color.White ? t('winner.white') : t('winner.black');
  }, [t, winner]);

  return (
    <GameView
      strategy={strategy}
      gameState={getGameState()}
      gameStateHistory={gameStateHistory}
      playerColor={currentPlayer}
      winnerLabel={winnerLabel}
      editModeState={editModeState}
      handleSquareClick={handleSquareClick}
      handlePieceClick={handlePieceClick}
      handleUndoMove={handleUndoMove}
      handleNewGame={handleNewGame}
    />
  );
};

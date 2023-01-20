import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BoardState, Color, Position, GameState, GameStateHistory, LimitedJumpsCount, GameAlert } from '@common/types';
import { ICheckersStrategy } from '@strategies/checkers-strategy.interface';
import { useEditMode } from '@components/GameView/components/EditMode/hooks/useEditMode';
import { GameView } from '@components/GameView';
import { useTranslation } from 'react-i18next';
import { GameMenu } from '@components/GameExtras';

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
  const [selectedPiece, setSelectedPiece] = useState<Position>();
  const [hasMadeCapture, setHasMadeCapture] = useState(false);
  const [limitedJumpsCount, setLimitedJumpsCount] = useState<LimitedJumpsCount>({});
  const [gameAlerts, setGameAlerts] = useState<GameAlert[]>([]);

  const updateGameState = ({
    boardState,
    currentPlayer,
    selectedPiece,
    hasMadeCapture,
    limitedJumpsCount,
    gameAlerts,
  }: GameState) => {
    setBoardState(boardState);
    setCurrentPlayer(currentPlayer);
    setSelectedPiece(selectedPiece);
    setHasMadeCapture(hasMadeCapture);
    setLimitedJumpsCount(limitedJumpsCount);
    setGameAlerts(gameAlerts);

    setGameStateHistory((prev) => [...prev, { boardState, currentPlayerColor: currentPlayer }]);
  };

  const handleUndoMove = () => {
    const prevGameHistory = gameStateHistory[gameStateHistory.length - 2];
    if (!prevGameHistory) return;

    setBoardState(prevGameHistory.boardState);
    setCurrentPlayer(prevGameHistory.currentPlayerColor);
    setSelectedPiece(undefined);
    setWinner(undefined);
    setGameStateHistory(gameStateHistory.slice(0, gameStateHistory.length - 1));
  };

  const getGameState = useCallback((): GameState => {
    return { currentPlayer, boardState, selectedPiece, hasMadeCapture, limitedJumpsCount, gameAlerts };
  }, [boardState, currentPlayer, hasMadeCapture, selectedPiece, limitedJumpsCount, gameAlerts]);

  const handlePieceClick = (position: Position) => {
    const newGameState = strategy.handlePieceClick(position, getGameState());

    if (newGameState?.selectedPiece) {
      setSelectedPiece(newGameState?.selectedPiece);
    }
    if (newGameState?.gameAlerts) {
      setGameAlerts(newGameState?.gameAlerts);
    }
  };

  const handleSquareClick = (position: Position) => {
    const newGameState = strategy.handleSquareClick(position, getGameState());
    if (newGameState) updateGameState(newGameState);
  };

  const handleNewGame = () => {
    const initialBoard = strategy.makeInitialBoardState();
    setBoardState(initialBoard);
    setGameStateHistory([{ boardState: initialBoard, currentPlayerColor: Color.White }]);

    setCurrentPlayer(Color.White);
    setWinner(undefined);
    setSelectedPiece(undefined);
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
      playerColor={Color.White}
      editModeState={editModeState}
      handleSquareClick={handleSquareClick}
      handlePieceClick={handlePieceClick}
      gameExtrasContent={
        <>
          <GameMenu
            editModeState={editModeState}
            gameStateHistory={gameStateHistory}
            winnerLabel={winnerLabel}
            onUndoMoveClick={handleUndoMove}
            handleNewGame={handleNewGame}
          />
        </>
      }
    />
  );
};

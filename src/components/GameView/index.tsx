import React, { useCallback } from 'react';

import { CheckersGameWrapper, CheckersBoard, CheckersRow, CheckersSquare, GameExtras, SquareNotation } from './styled';
import { CheckerPiece } from './components/CheckersPiece';
import { ICheckersStrategy } from '@strategies/checkers-strategy.interface';
import { DEBUG } from '@common/constants';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { EditMode } from './components/EditMode';
import { GameState, Color, GameStateHistory } from '@common/types';
import { EditModeState } from './components/EditMode/hooks/useEditMode';
import { useTranslation } from 'react-i18next';

export interface CheckersGameProps {
  strategy: ICheckersStrategy;
  gameState: GameState;
  gameStateHistory: GameStateHistory;
  playerColor: Color;
  winnerLabel: string | undefined;
  editModeState: EditModeState;
  handleSquareClick: (i: number, j: number) => void;
  handlePieceClick: (i: number, j: number) => void;
  onUndoMoveClick: () => void;
  undoMoveLoading?: boolean;
  handleNewGame: () => void;
  gameInfoContent?: React.ReactNode;
  isOnline?: boolean;
}

export const GameView: React.FC<CheckersGameProps> = ({
  strategy,
  gameState,
  gameStateHistory,
  playerColor,
  winnerLabel,
  editModeState,
  handleNewGame,
  onUndoMoveClick,
  undoMoveLoading,
  handleSquareClick,
  handlePieceClick,
  gameInfoContent,
  isOnline,
}) => {
  const { t } = useTranslation();

  const { boardState, selectedPiece } = gameState;

  const getSquareColor = (i: number, j: number) => {
    if ((i + j) % 2 !== 0) {
      return Color.White;
    }
    return Color.Black;
  };

  const getIsSelectedPiece = (i: number, j: number) => {
    if (!selectedPiece) {
      return false;
    }
    const [selectedI, selectedJ] = selectedPiece;
    return selectedI === i && selectedJ === j;
  };

  const isValidJumpDestination = useCallback(
    (i: number, j: number): boolean => {
      if (!selectedPiece) {
        return false;
      }

      return strategy.isValidJump(selectedPiece[0], selectedPiece[1], i, j, gameState);
    },
    [selectedPiece, strategy, gameState]
  );

  const shouldReverse = playerColor === 'black';
  const playerBoardState = shouldReverse ? [...boardState].reverse() : boardState;

  return (
    <CheckersGameWrapper>
      <CheckersBoard>
        {playerBoardState.map((row, i) => {
          const rowLength = row.length;
          const playerI = shouldReverse ? rowLength - 1 - i : i;
          const playerRow = shouldReverse ? [...row].reverse() : row;

          return (
            <CheckersRow key={playerI}>
              {playerRow.map((square, j) => {
                const playerJ = shouldReverse ? rowLength - 1 - j : j;
                const squareNotation = strategy.getSquareNotation(playerI, playerJ);

                return (
                  <CheckersSquare
                    className={getSquareColor(playerI, playerJ)}
                    key={playerJ}
                    onClick={() => {
                      if (editModeState.isEditMode) {
                        editModeState.handleSquareEdit(playerI, playerJ);
                      } else {
                        handleSquareClick(playerI, playerJ);
                        handlePieceClick(playerI, playerJ);
                      }
                    }}
                    rowSquaresCount={rowLength}
                    isValidJumpDestination={isValidJumpDestination(playerI, playerJ)}
                  >
                    {square.piece ? (
                      <CheckerPiece square={square} isSelected={getIsSelectedPiece(playerI, playerJ)} />
                    ) : null}
                    {DEBUG && <SquareNotation>{squareNotation}</SquareNotation>}
                  </CheckersSquare>
                );
              })}
            </CheckersRow>
          );
        })}
      </CheckersBoard>

      <GameExtras>
        <Button fullWidth component={Link} to="/">
          {t('gameMenu.mainMenu')}
        </Button>
        {!isOnline && <Button onClick={handleNewGame}> {t('gameMenu.newGame')}</Button>}
        <Button onClick={onUndoMoveClick} disabled={gameStateHistory.length === 1} loading={undoMoveLoading}>
          {t('gameMenu.undoMove')}
        </Button>

        {DEBUG && <EditMode {...editModeState} />}

        {winnerLabel ? (
          <div className="winner">
            {winnerLabel} {t('winner.winsLabel')}
          </div>
        ) : null}

        {gameInfoContent}
      </GameExtras>
    </CheckersGameWrapper>
  );
};

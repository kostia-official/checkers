import React, { useCallback, useMemo } from 'react';

import { CheckersGameWrapper, CheckersBoard, CheckersRow, CheckersSquare, GameExtras, SquareNotation } from './styled';
import { CheckerPiece } from './components/CheckersPiece';
import { ICheckersStrategy } from '@strategies/checkers-strategy.interface';
import { DEBUG } from '@common/constants';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { EditMode } from './components/EditMode';
import { GameState, Color, GameStateHistory, Position } from '@common/types';
import { EditModeState } from './components/EditMode/hooks/useEditMode';
import { useTranslation } from 'react-i18next';
import { isEqualPosition, hasPosition } from '@common/utils';

export interface CheckersGameProps {
  strategy: ICheckersStrategy;
  gameState: GameState;
  gameStateHistory: GameStateHistory;
  playerColor: Color;
  winnerLabel: string | undefined;
  editModeState: EditModeState;
  handleSquareClick: (position: Position) => void;
  handlePieceClick: (position: Position) => void;
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

  const getSquareColor = ([i, j]: Position) => {
    if ((i + j) % 2 !== 0) {
      return Color.White;
    }
    return Color.Black;
  };

  const getIsSelectedPiece = (position: Position) => {
    if (!selectedPiece) {
      return false;
    }

    return isEqualPosition(position, selectedPiece);
  };

  const validJumpDestinations = useMemo((): Position[] => {
    if (!selectedPiece) {
      return [];
    }

    return strategy.getValidJumps(selectedPiece, gameState);
  }, [gameState, selectedPiece, strategy]);

  const isValidJumpDestination = useCallback(
    (position: Position) => {
      return hasPosition(validJumpDestinations, position);
    },
    [validJumpDestinations]
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
                const squareNotation = strategy.getSquareNotation([playerI, playerJ]);

                return (
                  <CheckersSquare
                    className={getSquareColor([playerI, playerJ])}
                    key={playerJ}
                    onClick={() => {
                      if (editModeState.isEditMode) {
                        editModeState.handleSquareEdit([playerI, playerJ]);
                      } else {
                        handleSquareClick([playerI, playerJ]);
                        handlePieceClick([playerI, playerJ]);
                      }
                    }}
                    rowSquaresCount={rowLength}
                    isValidJumpDestination={isValidJumpDestination([playerI, playerJ])}
                  >
                    <CheckerPiece piece={square.piece} isSelected={getIsSelectedPiece([playerI, playerJ])} />

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

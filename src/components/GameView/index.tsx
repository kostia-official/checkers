import React, { useCallback, useMemo } from 'react';
import {
  CheckersGameWrapper,
  CheckersBoard,
  CheckersRow,
  CheckersSquare,
  SquareNotation,
  GameExtrasWrapper,
} from './styled';
import { CheckerPiece } from './components/CheckersPiece';
import { ICheckersStrategy } from '@strategies/draughts-strategy.interface';
import { DEBUG } from '@common/constants';
import { GameState, Color, Position } from '@common/types';
import { EditModeState } from '../EditMode/hooks/useEditMode';
import { isEqualPosition, hasPosition } from '@common/utils';
import { useGameAlerts } from '@src/hooks/useGameAlerts';

const squareMaxSizePx = 80;

export interface CheckersGameProps {
  strategy: ICheckersStrategy;
  gameState: GameState;
  playerColor: Color;
  editModeState: EditModeState;
  handleSquareClick: (position: Position) => void;
  handlePieceClick: (position: Position) => void;
  gameExtrasContent?: React.ReactNode;
}

export const GameView: React.FC<CheckersGameProps> = ({
  strategy,
  gameState,
  playerColor,
  editModeState,
  handleSquareClick,
  handlePieceClick,
  gameExtrasContent,
}) => {
  const { boardState, selectedPiece, gameAlerts, jumpTo, currentPlayer } = gameState;

  useGameAlerts({ gameAlerts });

  const getSquareColor = ([i, j]: Position) => {
    if ((i + j) % 2 !== 0) {
      return Color.White;
    }
    return Color.Black;
  };

  const getIsSelectedPiece = useCallback(
    (position: Position) => {
      if (!selectedPiece) {
        return false;
      }

      return isEqualPosition(position, selectedPiece);
    },
    [selectedPiece]
  );

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
  const isOwnMove = playerColor === currentPlayer;

  const getIsOpponentJumpDestination = useCallback(
    (position: Position): boolean => {
      return isOwnMove && !!jumpTo && isEqualPosition(position, jumpTo);
    },
    [isOwnMove, jumpTo]
  );

  const boardMaxSizePx = squareMaxSizePx * strategy.squares;

  return (
    <CheckersGameWrapper>
      <CheckersBoard maxSizePx={boardMaxSizePx}>
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
                    isOpponentJumpDestination={getIsOpponentJumpDestination([playerI, playerJ])}
                  >
                    <CheckerPiece
                      piece={square.piece}
                      isSelected={getIsSelectedPiece([playerI, playerJ])}
                    />

                    {DEBUG && <SquareNotation>{squareNotation}</SquareNotation>}
                  </CheckersSquare>
                );
              })}
            </CheckersRow>
          );
        })}
      </CheckersBoard>

      <GameExtrasWrapper maxSizePx={boardMaxSizePx}>{gameExtrasContent}</GameExtrasWrapper>
    </CheckersGameWrapper>
  );
};

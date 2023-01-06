import React from 'react';

import { CheckersGameWrapper, CheckersBoard, CheckersRow, CheckersSquare, Controls, Indexes } from './styled';
import { CheckerPiece } from './components/CheckersPiece';
import { ICheckersStrategy } from '../../strategies/checkers-strategy.interface';
import { DEBUG } from '../../common/constants';
import { capitalize } from '../../common/utils';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { EditMode } from './components/EditMode';
import { GameState, Color, GameStateHistory } from '../../common/types';
import { EditModeState } from './components/EditMode/hooks/useEditMode';

export interface CheckersGameProps {
  strategy: ICheckersStrategy;
  gameState: GameState;
  gameStateHistory: GameStateHistory;
  playerColor: Color;
  winner: Color | undefined;
  editModeState: EditModeState;
  handleSquareClick: (i: number, j: number) => void;
  handlePieceClick: (i: number, j: number) => void;
  handleUndoMove: () => void;
  handleNewGame: () => void;
}

export const GameView: React.FC<CheckersGameProps> = ({
  strategy,
  gameState,
  gameStateHistory,
  playerColor,
  winner,
  editModeState,
  handleNewGame,
  handleUndoMove,
  handleSquareClick,
  handlePieceClick,
}) => {
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

  const isValidJumpDestination = (i: number, j: number): boolean => {
    if (!selectedPiece) {
      return false;
    }
    const validMoves = strategy.getValidMoves(selectedPiece[0], selectedPiece[1], gameState);
    const validCaptures = strategy.getValidCaptures(selectedPiece[0], selectedPiece[1], gameState);
    return validMoves.some(([x, y]) => x === i && y === j) || validCaptures.some(([x, y]) => x === i && y === j);
  };

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
                    $isValidJumpDestination={isValidJumpDestination(playerI, playerJ)}
                  >
                    {square.piece ? (
                      <CheckerPiece square={square} isSelected={getIsSelectedPiece(playerI, playerJ)} />
                    ) : null}
                    {DEBUG && (
                      <Indexes>
                        {playerI}, {playerJ}
                      </Indexes>
                    )}
                  </CheckersSquare>
                );
              })}
            </CheckersRow>
          );
        })}
      </CheckersBoard>

      <Controls>
        <Button fullWidth component={Link} to="/">
          Main Menu
        </Button>
        <Button onClick={handleNewGame}>New Game</Button>
        <Button onClick={handleUndoMove} disabled={gameStateHistory.length === 1}>
          Undo Move
        </Button>

        {DEBUG && <EditMode {...editModeState} />}

        {winner ? <div className="winner">{capitalize(winner)} wins!</div> : null}
      </Controls>
    </CheckersGameWrapper>
  );
};

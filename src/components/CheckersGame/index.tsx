import React, { useEffect, useState, useCallback } from 'react';

import { CheckersGameWrapper, CheckersBoard, CheckersRow, CheckersSquare, Controls, Indexes } from './styled';
import { CheckerPiece } from './components/CheckersPiece';
import { BoardState, Color, Coordinates, GameState, GameStateHistory } from '../../common/types';
import { ICheckersStrategy } from '../../strategies/checkers-strategy.interface';
import { DEBUG } from '../../common/constants';
import { capitalize } from '../../common/utils';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export interface CheckersGameProps {
  strategy: ICheckersStrategy;
}

export const CheckersGame: React.FC<CheckersGameProps> = ({ strategy }) => {
  // Set up state variables for the game
  const [boardState, setBoardState] = useState<BoardState>(strategy.makeInitialBoardState());
  const [currentPlayer, setCurrentPlayer] = useState<Color>(Color.White);
  const [gameStateHistory, setGameStateHistory] = useState<GameStateHistory>([{ boardState, currentPlayer }]);
  const [winner, setWinner] = useState<Color | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<Coordinates | null>(null);
  const [hasMadeCapture, setHasMadeCapture] = useState(false);

  const updateGameState = ({ boardState, currentPlayer, selectedPiece, hasMadeCapture }: GameState) => {
    setBoardState(boardState);
    setCurrentPlayer(currentPlayer);
    setSelectedPiece(selectedPiece);
    setHasMadeCapture(hasMadeCapture);

    setGameStateHistory((prev) => [...prev, { boardState, currentPlayer }]);
  };

  const handleUndoMove = () => {
    const prevGameHistory = gameStateHistory[gameStateHistory.length - 2];
    if (!prevGameHistory) return;

    setBoardState(prevGameHistory.boardState);
    setCurrentPlayer(prevGameHistory.currentPlayer);
    setSelectedPiece(null);
    setWinner(null);
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

  const getIsSelectedPiece = (i: number, j: number) => {
    if (!selectedPiece) {
      return false;
    }
    const [selectedI, selectedJ] = selectedPiece;
    return selectedI === i && selectedJ === j;
  };

  const handleNewGame = () => {
    const initialBoard = strategy.makeInitialBoardState();
    setBoardState(initialBoard);
    setGameStateHistory([{ boardState: initialBoard, currentPlayer: Color.White }]);

    setCurrentPlayer(Color.White);
    setWinner(null);
    setSelectedPiece(null);
    setHasMadeCapture(false);
  };

  const getSquareColor = (i: number, j: number) => {
    if ((i + j) % 2 !== 0) {
      return Color.White;
    }
    return Color.Black;
  };

  useEffect(() => {
    const winner = strategy.getWinner(getGameState());
    if (winner) {
      setWinner(winner);
    }
  }, [getGameState, strategy]);

  const isValidJumpDestination = (i: number, j: number): boolean => {
    if (!selectedPiece) {
      return false;
    }
    const validMoves = strategy.getValidMoves(selectedPiece[0], selectedPiece[1], getGameState());
    const validCaptures = strategy.getValidCaptures(selectedPiece[0], selectedPiece[1], getGameState());
    return validMoves.some(([x, y]) => x === i && y === j) || validCaptures.some(([x, y]) => x === i && y === j);
  };

  // Render the game board and checker pieces
  return (
    <CheckersGameWrapper>
      <CheckersBoard>
        {boardState.map((row, i) => (
          <CheckersRow key={i}>
            {row.map((square, j) => (
              <CheckersSquare
                className={getSquareColor(i, j)}
                key={j}
                onClick={() => {
                  handleSquareClick(i, j);
                  handlePieceClick(i, j);
                }}
                $isValidJumpDestination={isValidJumpDestination(i, j)}
              >
                {square.piece ? <CheckerPiece square={square} isSelected={getIsSelectedPiece(i, j)} /> : null}
                {DEBUG && (
                  <Indexes>
                    {i}, {j}
                  </Indexes>
                )}
              </CheckersSquare>
            ))}
          </CheckersRow>
        ))}
      </CheckersBoard>

      <Controls>
        <Link to="/">
          <Button onClick={handleUndoMove}>Main Menu</Button>
        </Link>
        <Button onClick={handleNewGame}>New Game</Button>
        <Button onClick={handleUndoMove} disabled={gameStateHistory.length === 1}>
          Undo Move
        </Button>
        {winner ? <div className="winner">{capitalize(winner)} wins!</div> : null}
      </Controls>
    </CheckersGameWrapper>
  );
};

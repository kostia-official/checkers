import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from 'react-query';
import { gameService } from '@services/game.service';
import { useParams } from 'react-router-dom';
import { CenteredLoader } from '@components/CenteredLoader';
import { mapGameTypeToStrategy } from '@common/mappers';
import { Coordinates, GameState, Color } from '@common/types';
import { useEditMode } from '@components/GameView/components/EditMode/hooks/useEditMode';
import { GameView } from '@components/GameView';
import { GameModel, UserModel, GameHistoryModel } from '@services/types';
import { userService } from '@services/user.service';
import { queryClient } from '@src/queryClient';
import { gameHistoryService } from '@services/gameHistory.service';
import { toggleColor } from '@common/utils';
import { NewUserJoinModal } from '@components/NewUserJoinModal';
import { useJoinUser } from './hooks/useJoinUser';
import { useWinner } from './hooks/useWinner';
import { PlayersCard } from './components/PlayersCard';
import { useTranslation } from 'react-i18next';

export const OnlineGamePreload: React.FC = () => {
  const { gameId } = useParams();
  const { data: game } = useQuery(['games', gameId], () => gameService.get(gameId!), {
    enabled: !!gameId,
  });
  const { data: user, isError: isGetUserError } = useQuery('currentUser', () => userService.getCurrent());

  const { data: gameHistory } = useQuery(['gameHistory', gameId], () => gameHistoryService.getByGameId(gameId!), {
    enabled: !!game,
  });

  useEffect(() => {
    if (!gameId) return;

    const unsub = gameHistoryService.onUpdatedByGameId(gameId, (data) => {
      queryClient.setQueryData(['gameHistory', gameId], data);
    });

    return () => unsub();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const unsub = gameService.onUpdate(gameId, (game: GameModel) => {
      queryClient.setQueryData(['games', gameId], game);
    });

    return () => unsub();
  }, [gameId]);

  return (
    <>
      <NewUserJoinModal noUser={isGetUserError} game={game} />

      {!game || !user || !gameHistory ? (
        <CenteredLoader />
      ) : (
        <OnlineGame game={game} user={user} gameHistory={gameHistory} />
      )}
    </>
  );
};

export interface OnlineGameProps {
  game: GameModel;
  user: UserModel;
  gameHistory: GameHistoryModel[];
}

export const OnlineGame: React.FC<OnlineGameProps> = ({ game, user, gameHistory }) => {
  const { t } = useTranslation();

  const { mutateAsync: removeGameHistory } = useMutation((id: string) => gameHistoryService.remove(id));
  const { isSpectator } = useJoinUser({ game, user });

  const lastGameState = gameHistory[gameHistory.length - 1];
  const { boardState, currentPlayerColor } = lastGameState;
  const { inviterId, inviterColor } = game;
  const isInviter = inviterId === user.id;
  const ownColor = isInviter ? inviterColor : toggleColor(inviterColor);

  // TODO: should check currentPlayerId with user.id
  const canMakeJump = !isSpectator && ownColor === currentPlayerColor;

  const strategy = useMemo(() => {
    const Strategy = mapGameTypeToStrategy[game.gameType];
    return new Strategy();
  }, [game.gameType]);

  const [selectedPiece, setSelectedPiece] = useState<Coordinates | null>(null);
  const [hasMadeCapture, setHasMadeCapture] = useState(false);

  const gameState = useMemo((): GameState => {
    return { currentPlayer: currentPlayerColor, boardState, selectedPiece, hasMadeCapture };
  }, [boardState, currentPlayerColor, hasMadeCapture, selectedPiece]);

  const updateGameState = ({ boardState, currentPlayer, selectedPiece, hasMadeCapture }: GameState) => {
    setSelectedPiece(selectedPiece);
    setHasMadeCapture(hasMadeCapture);

    gameHistoryService.add({
      currentPlayerColor: currentPlayer,
      boardState,
      gameId: game.id,
      currentPlayerId: user.id,
    });
  };

  const editModeState = useEditMode({ gameState, updateGameState });
  const { clearWinner, winnerColor } = useWinner({
    game,
    gameState,
    strategy,
    isEditMode: editModeState.isEditMode,
  });

  const handleUndoMove = async () => {
    const prevGameHistory = gameHistory[gameHistory.length - 2];
    if (!prevGameHistory) return;

    if (game.winnerId) {
      await clearWinner();
    }
    await removeGameHistory(lastGameState.id);

    setSelectedPiece(null);
  };

  const handlePieceClick = (i: number, j: number) => {
    if (!canMakeJump) return;

    const newSelectedPiece = strategy.handlePieceClick(i, j, gameState);
    if (newSelectedPiece) setSelectedPiece(newSelectedPiece);
  };

  const handleSquareClick = (i: number, j: number) => {
    if (!canMakeJump) return;

    const newGameState = strategy.handleSquareClick(i, j, gameState);
    if (newGameState) updateGameState(newGameState);
  };

  const handleNewGame = () => {};

  const winnerLabel = useMemo(() => {
    if (!winnerColor) return;

    return winnerColor === Color.White ? t('winner.white') : t('winner.black');
  }, [t, winnerColor]);

  if (!lastGameState) return <CenteredLoader />;

  return (
    <GameView
      strategy={strategy}
      gameState={gameState}
      gameStateHistory={gameHistory}
      playerColor={ownColor}
      winnerLabel={winnerLabel}
      editModeState={editModeState}
      handleSquareClick={handleSquareClick}
      handlePieceClick={handlePieceClick}
      handleUndoMove={handleUndoMove}
      handleNewGame={handleNewGame}
      gameInfoContent={
        <PlayersCard game={game} user={user} isSpectator={isSpectator} currentPlayerColor={currentPlayerColor} />
      }
    />
  );
};

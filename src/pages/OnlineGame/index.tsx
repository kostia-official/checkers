import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import { gameService } from '@services/game.service';
import { useParams, useSearchParams } from 'react-router-dom';
import { CenteredLoader } from '@components/CenteredLoader';
import { mapGameTypeToStrategy } from '@common/mappers';
import { Position, GameState, GamePlayers } from '@common/types';
import { useEditMode } from '@components/GameView/components/EditMode/hooks/useEditMode';
import { GameView } from '@components/GameView';
import { GameModel, UserModel, GameHistoryModel, RequestType, GamePlayerModel } from '@services/types';
import { userService } from '@services/user.service';
import { queryClient } from '@src/queryClient';
import { gameHistoryService } from '@services/gameHistory.service';
import { useGameJoin } from './hooks/useGameJoin';
import { useGameFinish } from './hooks/useGameFinish';
import { PlayersCard } from './components/PlayersCard';
import { CopyInviteLinkButton } from './components/CopyInviteLinkButton';
import { NewUserJoinModal } from './components/NewUserJoinModal';
import { useResolvedGameInfo } from '@pages/OnlineGame/hooks/useResolvedGameInfo';
import { GameResultsButtons } from '@pages/OnlineGame/components/GameResultsButtons';
import { useGameRequestsReceiving } from '@pages/OnlineGame/hooks/useGameRequestsReceiving';
import { useGameRequestsSending } from '@pages/OnlineGame/hooks/useGameRequestsSending';
import { noop, toggleColor } from '@common/utils';
import { gamePlayerService } from '@services/gamePlayer.service';
import { useSubscription } from '@src/hooks/useSubscription';
import { useNewGame } from '@pages/OnlineGame/hooks/useNewGame';

export const OnlineGamePreload: React.FC = () => {
  const { gameId } = useParams();

  const { data: game } = useQuery(['games', gameId], () => gameService.get(gameId!), {
    enabled: !!gameId,
  });
  const { data: user, isError: isGetUserError } = useQuery('currentUser', () => userService.getCurrent());
  const { data: gameHistory } = useQuery(['gameHistory', gameId], () => gameHistoryService.getByGameId(gameId!), {
    enabled: !!gameId,
  });
  const { data: inviter } = useQuery(
    ['inviter', gameId],
    () => gamePlayerService.get({ userId: game?.inviterId!, gameId: game?.id! }),
    { enabled: !!game?.inviterId }
  );
  const { data: invitee } = useQuery(
    ['invitee', gameId],
    () => gamePlayerService.get({ userId: game?.inviteeId!, gameId: game?.id! }),
    { enabled: !!game?.inviteeId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(inviter?.id!, (data) => {
        queryClient.setQueryData(['inviter', gameId], data);
      }),
    { enable: inviter?.id && gameId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(invitee?.id!, (data) => {
        queryClient.setQueryData(['invitee', gameId], data);
      }),
    { enable: invitee?.id && gameId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(invitee?.id!, (data) => {
        queryClient.setQueryData(['invitee', gameId], data);
      }),
    { enable: invitee?.id && gameId }
  );

  useSubscription(
    () =>
      gameHistoryService.onUpdatedByGameId(gameId!, (data) => {
        queryClient.setQueryData(['gameHistory', gameId], data);
      }),
    { enable: gameId }
  );

  useSubscription(
    () =>
      gameService.onUpdate(gameId!, (game: GameModel) => {
        queryClient.setQueryData(['games', gameId], game);
      }),
    { enable: gameId }
  );

  return (
    <>
      <NewUserJoinModal noUser={isGetUserError} game={game} />

      {!game || !user || !gameHistory || !inviter ? (
        <CenteredLoader />
      ) : (
        <OnlineGame game={game} user={user} gameHistory={gameHistory} inviter={inviter} invitee={invitee} />
      )}
    </>
  );
};

export interface OnlineGameProps {
  game: GameModel;
  user: UserModel;
  gameHistory: GameHistoryModel[];
  inviter: GamePlayerModel;
  invitee?: GamePlayerModel;
}

export const OnlineGame: React.FC<OnlineGameProps> = ({ game, user, gameHistory, inviter, invitee }) => {
  let [searchParams] = useSearchParams();

  const { mutateAsync: removeGameHistory } = useMutation((id: string) => gameHistoryService.remove(id));

  const lastGameState = gameHistory[gameHistory.length - 1];
  const { boardState, currentPlayerColor } = lastGameState;

  const { isInviter, opponentId, isGameStarted } = useResolvedGameInfo({ game, user });
  const currentUserPlayer = isInviter ? inviter : invitee;
  const opponent = isInviter ? invitee : inviter;
  const gamePlayers: GamePlayers = useMemo(
    () => ({ inviter, invitee, currentUserPlayer, opponent }),
    [currentUserPlayer, invitee, inviter, opponent]
  );
  const ownColor = isInviter ? inviter.color : toggleColor(inviter.color);

  const { isSpectator, isInviteeJoined } = useGameJoin({ game, user, gamePlayers });

  // TODO: should check currentPlayerId with user.id
  const isOwnMove = ownColor === currentPlayerColor;
  const canMakeJump = !isSpectator && ownColor === currentPlayerColor && isGameStarted;
  const isContinue = searchParams.get('continue') === '1';

  const strategy = useMemo(() => {
    const Strategy = mapGameTypeToStrategy[game.gameType];
    return new Strategy();
  }, [game.gameType]);

  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
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
  const { clearWinner, winnerLabel, setWinner, setIsDraw } = useGameFinish({
    game,
    gameState,
    gamePlayers,
    strategy,
    isEditMode: editModeState.isEditMode,
  });

  useGameRequestsReceiving({ game });

  const handleUndoMove = useCallback(async () => {
    const prevGameHistory = gameHistory[gameHistory.length - 2];
    if (!prevGameHistory) return;

    if (game.winnerId) {
      await clearWinner();
    }
    await removeGameHistory(lastGameState.id);

    setSelectedPiece(null);
  }, [clearWinner, game.winnerId, gameHistory, lastGameState.id, removeGameHistory]);

  const { continueWithNewGame } = useNewGame();

  const onNewAcceptedRequest = useCallback(
    async (type: RequestType) => {
      if (type === 'undoMove') {
        await handleUndoMove();
      } else if (type === 'draw') {
        await setIsDraw();
        await continueWithNewGame(game, gamePlayers);
      }
    },
    [continueWithNewGame, game, gamePlayers, handleUndoMove, setIsDraw]
  );

  const { createRequest, isActiveUndoRequest } = useGameRequestsSending({
    gameId: game.id,
    userId: user.id,
    opponentId,
    onNewAcceptedRequest,
  });

  const requestUndoMove = async () => {
    await createRequest('undoMove');
  };

  const handlePieceClick = (position: Position) => {
    if (!canMakeJump) return;

    const newSelectedPiece = strategy.handlePieceClick(position, gameState);
    if (newSelectedPiece) setSelectedPiece(newSelectedPiece);
  };

  const handleSquareClick = (position: Position) => {
    if (!canMakeJump) return;

    const newGameState = strategy.handleSquareClick(position, gameState);
    if (newGameState) updateGameState(newGameState);
  };

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
      onUndoMoveClick={requestUndoMove}
      undoMoveLoading={isActiveUndoRequest}
      handleNewGame={noop}
      isOnline
      gameInfoContent={
        <>
          <PlayersCard
            game={game}
            user={user}
            isSpectator={isSpectator}
            currentPlayerColor={currentPlayerColor}
            gamePlayers={gamePlayers}
          />
          {isInviter && !isInviteeJoined && !isContinue && <CopyInviteLinkButton />}
          {
            <GameResultsButtons
              game={game}
              user={user}
              setWinner={setWinner}
              setIsDraw={setIsDraw}
              isOwnMove={isOwnMove}
              gamePlayers={gamePlayers}
            />
          }
        </>
      }
    />
  );
};

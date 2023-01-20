import React, { useMemo, useState, useCallback } from 'react';
import { GameModel, UserModel, GameHistoryModel, GamePlayerModel, RequestType } from '@services/types';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { gameHistoryService } from '@services/gameHistory.service';
import { useResolvedGameInfo } from '@pages/OnlineGame/hooks/useResolvedGameInfo';
import { GamePlayers, Position, GameState, GameAlert } from '@common/types';
import { toggleColor } from '@common/utils';
import { useGameJoin } from '@pages/OnlineGame/hooks/useGameJoin';
import { mapGameTypeToStrategy } from '@common/mappers';
import { useEditMode } from '@components/GameView/components/EditMode/hooks/useEditMode';
import { useGameFinish } from '@pages/OnlineGame/hooks/useGameFinish';
import { useGameRequestsReceiving } from '@pages/OnlineGame/hooks/useGameRequestsReceiving';
import { useNewGame } from '@pages/OnlineGame/hooks/useNewGame';
import { useGameRequestsSending } from '@pages/OnlineGame/hooks/useGameRequestsSending';
import { CenteredLoader } from '@components/CenteredLoader';
import { GameView } from '@components/GameView';
import { PlayersCard } from '@pages/OnlineGame/components/PlayersCard';
import { CopyInviteLinkButton } from '@pages/OnlineGame/components/CopyInviteLinkButton';
import { GameResultsButtons } from '@pages/OnlineGame/components/GameResultsButtons';
import { GameMenu } from '@components/GameMenu';

export interface OnlineGameWithDataProps {
  game: GameModel;
  user: UserModel;
  gameHistory: GameHistoryModel[];
  inviter: GamePlayerModel;
  invitee?: GamePlayerModel;
}

export const OnlineGameWithData: React.FC<OnlineGameWithDataProps> = ({
  game,
  user,
  gameHistory,
  inviter,
  invitee,
}) => {
  let [searchParams] = useSearchParams();

  const { mutateAsync: removeGameHistory } = useMutation((id: string) => gameHistoryService.remove(id));

  const lastGameState = gameHistory[gameHistory.length - 1];
  const { boardState, currentPlayerColor, limitedJumpsCount } = lastGameState;

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

  const [selectedPiece, setSelectedPiece] = useState<Position>();
  const [hasMadeCapture, setHasMadeCapture] = useState(false);
  const [gameAlerts, setGameAlerts] = useState<GameAlert[]>([]);

  const gameState = useMemo((): GameState => {
    return {
      currentPlayer: currentPlayerColor,
      boardState,
      selectedPiece,
      hasMadeCapture,
      limitedJumpsCount,
      gameAlerts,
    };
  }, [boardState, currentPlayerColor, hasMadeCapture, limitedJumpsCount, selectedPiece, gameAlerts]);

  const updateGameState = async ({
    boardState,
    currentPlayer,
    selectedPiece,
    hasMadeCapture,
    limitedJumpsCount,
    gameAlerts,
  }: GameState) => {
    setSelectedPiece(selectedPiece);
    setHasMadeCapture(hasMadeCapture);
    setGameAlerts(gameAlerts);

    await gameHistoryService.add({
      currentPlayerColor: currentPlayer,
      boardState,
      gameId: game.id,
      currentPlayerId: user.id,
      limitedJumpsCount,
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

    setSelectedPiece(undefined);
  }, [clearWinner, game.winnerId, gameHistory, lastGameState.id, removeGameHistory]);

  const { continueWithNewGame } = useNewGame();

  const handleNewGame = useCallback(async () => {
    await continueWithNewGame(game, gamePlayers);
  }, [continueWithNewGame, game, gamePlayers]);

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

    const newGameState = strategy.handlePieceClick(position, gameState);

    if (newGameState?.selectedPiece) {
      setSelectedPiece(newGameState?.selectedPiece);
    }
    if (newGameState?.gameAlerts) {
      setGameAlerts(newGameState?.gameAlerts);
    }
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
      playerColor={ownColor}
      editModeState={editModeState}
      handleSquareClick={handleSquareClick}
      handlePieceClick={handlePieceClick}
      gameExtrasContent={
        <>
          <GameMenu
            editModeState={editModeState}
            gameStateHistory={gameHistory}
            winnerLabel={winnerLabel}
            onUndoMoveClick={requestUndoMove}
            undoMoveLoading={isActiveUndoRequest}
            handleNewGame={handleNewGame}
            disableNewGame={!game.endedAt}
            disableEditMode={!!game.startedAt}
          />
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

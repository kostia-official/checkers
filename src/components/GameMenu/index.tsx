import React from 'react';
import { Button, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { EditMode } from '@components/EditMode';
import { useTranslation } from 'react-i18next';
import { GameStateHistory } from '@common/types';
import { EditModeState } from '@components/EditMode/hooks/useEditMode';
import { ButtonsWrapper } from '@components/GameMenu/styled';

export interface GameMenuProps {
  onUndoMoveClick: () => void;
  undoMoveLoading?: boolean;
  handleNewGame: () => void;
  gameStateHistory: GameStateHistory;
  winnerLabel: string | undefined;
  editModeState: EditModeState;
  isSpectator?: boolean;
  isGameStarted?: boolean;
  isGameEnded?: boolean;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  gameStateHistory,
  winnerLabel,
  handleNewGame,
  onUndoMoveClick,
  undoMoveLoading,
  isGameEnded,
  editModeState,
  isSpectator,
  isGameStarted,
}) => {
  const { t } = useTranslation();
  const isGameActive = isGameStarted && !isGameEnded;

  return (
    <>
      <ButtonsWrapper>
        <Button fullWidth component={Link} to="/">
          {t('gameMenu.mainMenu')}
        </Button>
        <Button
          onClick={onUndoMoveClick}
          disabled={gameStateHistory.length === 1 || isSpectator}
          loading={undoMoveLoading}
          loaderProps={{ size: 'xs' }}
        >
          {t('gameMenu.undoMove')}
        </Button>
      </ButtonsWrapper>

      {!isGameActive && (
        <ButtonsWrapper>
          {!editModeState.isEditMode && (
            <Button onClick={handleNewGame} disabled={!isGameEnded || isSpectator}>
              {t('gameMenu.newGame')}
            </Button>
          )}
          <EditMode {...editModeState} disabled={isGameStarted || isSpectator} />
        </ButtonsWrapper>
      )}

      {/* TODO: Redesign */}
      {winnerLabel ? (
        <Text align="center">
          {winnerLabel} {t('winner.winsLabel')}
        </Text>
      ) : null}
    </>
  );
};

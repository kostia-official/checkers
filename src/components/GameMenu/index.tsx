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
  disableNewGame?: boolean;
  disableEditMode?: boolean;
  editModeState: EditModeState;
  isSpectator?: boolean;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  gameStateHistory,
  winnerLabel,
  handleNewGame,
  onUndoMoveClick,
  undoMoveLoading,
  disableNewGame,
  disableEditMode,
  editModeState,
  isSpectator,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ButtonsWrapper>
        <Button fullWidth component={Link} to="/">
          {t('gameMenu.mainMenu')}
        </Button>
        <Button onClick={handleNewGame} disabled={disableNewGame || isSpectator}>
          {t('gameMenu.newGame')}
        </Button>
      </ButtonsWrapper>

      <ButtonsWrapper>
        <EditMode {...editModeState} disabled={disableEditMode || isSpectator} />
        {!editModeState.isEditMode && (
          <Button
            onClick={onUndoMoveClick}
            disabled={gameStateHistory.length === 1 || isSpectator}
            loading={undoMoveLoading}
          >
            {t('gameMenu.undoMove')}
          </Button>
        )}
      </ButtonsWrapper>

      {/* TODO: Redesign */}
      {winnerLabel ? (
        <Text align="center">
          {winnerLabel} {t('winner.winsLabel')}
        </Text>
      ) : null}
    </>
  );
};

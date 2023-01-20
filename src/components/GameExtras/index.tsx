import React from 'react';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { EditMode } from '@components/GameView/components/EditMode';
import { useTranslation } from 'react-i18next';
import { GameStateHistory } from '@common/types';
import { EditModeState } from '@components/GameView/components/EditMode/hooks/useEditMode';

export interface GameMenuProps {
  onUndoMoveClick: () => void;
  undoMoveLoading?: boolean;
  handleNewGame: () => void;
  gameStateHistory: GameStateHistory;
  winnerLabel: string | undefined;
  disableNewGame?: boolean;
  disableEditMode?: boolean;
  editModeState: EditModeState;
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
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Button fullWidth component={Link} to="/">
        {t('gameMenu.mainMenu')}
      </Button>
      <Button onClick={handleNewGame} disabled={disableNewGame}>
        {t('gameMenu.newGame')}
      </Button>
      <EditMode {...editModeState} disabled={disableEditMode} />
      <Button onClick={onUndoMoveClick} disabled={gameStateHistory.length === 1} loading={undoMoveLoading}>
        {t('gameMenu.undoMove')}
      </Button>

      {/* TODO: Redesign */}
      {winnerLabel ? (
        <div className="winner">
          {winnerLabel} {t('winner.winsLabel')}
        </div>
      ) : null}
    </>
  );
};

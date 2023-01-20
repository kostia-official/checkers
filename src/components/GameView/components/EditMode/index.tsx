import React from 'react';
import { Button, Switch } from '@mantine/core';
import { SwitchWrapper, ClearWrapper, CardStyled, ContentWrapper, ControlsWrapper, ControlsRow } from './styled';
import { EditModeState } from './hooks/useEditMode';
import { PieceColorToggle } from '../../../PieceColorToggle';
import { useTranslation } from 'react-i18next';

export const EditMode: React.FC<EditModeState> = ({
  enableEditMode,
  disableEditMode,
  isEditMode,
  setEditPiecesColor,
  editPiecesColor,
  clearBoard,
  isKing,
  setIsKing,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {isEditMode && (
        <CardStyled title={t('editMode.title')}>
          <ContentWrapper>
            <ControlsWrapper>
              <PieceColorToggle value={editPiecesColor} onChange={setEditPiecesColor} />

              <ControlsRow>
                <SwitchWrapper>
                  <Switch
                    label={t('editMode.kingPiece')}
                    checked={isKing}
                    onChange={(e) => setIsKing(e.target.checked)}
                  />
                </SwitchWrapper>

                <ClearWrapper>
                  <Button fullWidth onClick={clearBoard} size="xs" compact variant="outline">
                    {t('editMode.clear')}
                  </Button>
                </ClearWrapper>
              </ControlsRow>
            </ControlsWrapper>

            <Button fullWidth onClick={() => disableEditMode()}>
              {t('editMode.done')}
            </Button>
          </ContentWrapper>
        </CardStyled>
      )}

      {!isEditMode && (
        <Button onClick={() => enableEditMode()} disabled={disabled}>
          {t('editMode.title')}
        </Button>
      )}
    </>
  );
};

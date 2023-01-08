import React from 'react';
import { Button, Switch, Flex } from '@mantine/core';
import { EditModeControls, Title, SwitchWrapper, ClearWrapper } from './styled';
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
}) => {
  const { t } = useTranslation();

  return (
    <>
      {isEditMode ? (
        <Title fz="md" align="center" weight="bold">
          {t('editMode.title')}
        </Title>
      ) : (
        <Button onClick={() => enableEditMode()}>{t('editMode.title')}</Button>
      )}

      {isEditMode && (
        <>
          <EditModeControls>
            <Flex direction="column" gap="8px" align="center" style={{ width: '100%' }}>
              <PieceColorToggle value={editPiecesColor} onChange={setEditPiecesColor} />

              <EditModeControls>
                <SwitchWrapper>
                  <Switch
                    label={t('editMode.kingPiece')}
                    checked={isKing}
                    onChange={(e) => setIsKing(e.target.checked)}
                  />
                </SwitchWrapper>

                <ClearWrapper>
                  <Button fullWidth onClick={clearBoard} compact variant="outline">
                    {t('editMode.clear')}
                  </Button>
                </ClearWrapper>
              </EditModeControls>
            </Flex>
          </EditModeControls>

          <EditModeControls>
            <Button fullWidth onClick={() => disableEditMode()}>
              {t('editMode.done')}
            </Button>
          </EditModeControls>
        </>
      )}
    </>
  );
};

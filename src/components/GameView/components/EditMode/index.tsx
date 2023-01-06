import React from 'react';
import { Button, Switch, Flex } from '@mantine/core';
import { EditModeControls, Title, SwitchWrapper, ClearWrapper } from './styled';
import { EditModeState } from './hooks/useEditMode';
import { PieceColorToggle } from '../../../PieceColorToggle';

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
  return (
    <>
      {isEditMode ? (
        <Title fz="md" align="center" weight="bold">
          Edit Mode
        </Title>
      ) : (
        <Button onClick={() => enableEditMode()}>Edit Mode</Button>
      )}

      {isEditMode && (
        <>
          <EditModeControls>
            <Flex direction="column" gap="8px" align="center" style={{ width: '100%' }}>
              <PieceColorToggle value={editPiecesColor} onChange={setEditPiecesColor} />

              <EditModeControls>
                <SwitchWrapper>
                  <Switch label="King" checked={isKing} onChange={(e) => setIsKing(e.target.checked)} />
                </SwitchWrapper>

                <ClearWrapper>
                  <Button fullWidth onClick={clearBoard} compact variant="outline">
                    Clear
                  </Button>
                </ClearWrapper>
              </EditModeControls>
            </Flex>
          </EditModeControls>

          <EditModeControls>
            <Button fullWidth onClick={() => disableEditMode()}>
              Done
            </Button>
          </EditModeControls>
        </>
      )}
    </>
  );
};

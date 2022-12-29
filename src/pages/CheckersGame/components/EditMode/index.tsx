import React from 'react';
import { Color } from '../../../../common/types';
import { Button } from '../../../../components/Button';
import { EditModeControls, InputWrapper } from './styled';
import { EditModeState } from './hook';

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
      <Button onClick={() => enableEditMode()} active={isEditMode}>
        Edit Mode
      </Button>

      {isEditMode && (
        <>
          <EditModeControls>
            <Button onClick={clearBoard}>Clear</Button>
            <Button onClick={() => disableEditMode()}>Done</Button>
          </EditModeControls>

          <EditModeControls>
            <EditModeControls>
              <InputWrapper>
                <input
                  type="radio"
                  name={Color.White}
                  checked={editPiecesColor === Color.White}
                  onChange={(e) => setEditPiecesColor(e.target.checked ? Color.White : Color.Black)}
                />
                <label htmlFor={Color.White} onClick={() => setEditPiecesColor(Color.White)}>
                  White
                </label>
              </InputWrapper>
              <InputWrapper>
                <input
                  type="radio"
                  name={Color.Black}
                  checked={editPiecesColor === Color.Black}
                  onChange={(e) => setEditPiecesColor(e.target.checked ? Color.Black : Color.White)}
                />
                <label htmlFor={Color.Black} onClick={() => setEditPiecesColor(Color.Black)}>
                  Black
                </label>
              </InputWrapper>
            </EditModeControls>

            <InputWrapper>
              <input type="checkbox" name="King" checked={isKing} onChange={(e) => setIsKing(e.target.checked)} />
              <label htmlFor="king" onClick={() => setIsKing((prev) => !prev)}>
                King
              </label>
            </InputWrapper>
          </EditModeControls>
        </>
      )}
    </>
  );
};

import React from 'react';
import clsx from 'clsx';
import { CheckerPieceInner, CheckerPieceWrapper } from './styled';
import { Square } from '@common/types';

export interface CheckerPieceProps {
  square: Square;
  isSelected: boolean;
}

export const CheckerPiece: React.FC<CheckerPieceProps> = ({ square, isSelected }) => {
  if (!square.piece) return null;

  return (
    <CheckerPieceWrapper className={clsx(square.piece, { selected: isSelected })}>
      <CheckerPieceInner className={clsx({ king: square.isKing })} color={square.piece} />
    </CheckerPieceWrapper>
  );
};

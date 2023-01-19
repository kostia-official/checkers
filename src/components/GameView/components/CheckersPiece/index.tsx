import React from 'react';
import clsx from 'clsx';
import { CheckerPieceInner, CheckerPieceWrapper } from './styled';
import { Piece } from '@common/types';

export interface CheckerPieceProps {
  piece: Piece | undefined;
  isSelected: boolean;
}

export const CheckerPiece: React.FC<CheckerPieceProps> = ({ piece, isSelected }) => {
  if (!piece) return null;

  return (
    <CheckerPieceWrapper className={clsx(piece.color, { selected: isSelected, pendingCapture: piece.pendingCapture })}>
      <CheckerPieceInner className={clsx({ king: piece.isKing })} color={piece.color} />
    </CheckerPieceWrapper>
  );
};

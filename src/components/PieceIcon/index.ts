import { colors } from '@src/common/colors';
import styled from 'styled-components';

export interface PieceIconProps {
  highlighted?: boolean;
}

export const BlackPieceIcon = styled.div<PieceIconProps>`
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  background-color: black;
  border: 2px solid ${(p) => (p.highlighted ? colors.gold.pale : colors.grey.main)};
`;

export const WhitePieceIcon = styled.div<PieceIconProps>`
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  background-color: ${colors.beige.main};
  border: 2px solid ${(p) => (p.highlighted ? colors.gold.pale : 'black')};
`;

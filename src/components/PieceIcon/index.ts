import { colors } from '@src/common/colors';
import styled from 'styled-components';

export interface PieceIconProps {
  highlighted?: boolean;
}

export const BlackPieceIcon = styled.div<PieceIconProps>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.highlighted ? colors.gold.pale : 'grey')};
  background-color: black;
`;

export const WhitePieceIcon = styled.div<PieceIconProps>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.highlighted ? colors.gold.pale : 'black')};
  background-color: wheat;
`;

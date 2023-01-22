import styled from 'styled-components';
import { gameExtrasWidth } from '@components/GameView/styled';

export const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  height: 24px;
`;

export const LeftPlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  // Need to set width for truncating player name
  width: ${gameExtrasWidth - 100}px;
`;

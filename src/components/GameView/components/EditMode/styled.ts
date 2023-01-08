import styled from 'styled-components';
import { Text } from '@mantine/core';

export const EditModeControls = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 8px;
  width: 100%;
`;

export const Title: typeof Text = styled(Text)`
  margin: 6px 0;
`;

export const SwitchWrapper = styled.div`
  margin-top: 4px;
  flex: 1 1 50%;
`;

export const ClearWrapper = styled.div`
  flex: 1 1 50%;
`;

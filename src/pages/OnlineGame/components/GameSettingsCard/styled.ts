import styled from 'styled-components';
import { Card, Text } from '@mantine/core';

export const CardStyled: typeof Card = styled(Card)`
  padding: 0 16px;
  flex: 0 0 auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
`;

export const EditWrapper = styled.div`
  margin-bottom: 14px;
`;

export const Time: typeof Text = styled(Text)`
  display: flex;
  align-items: center;
  gap: 2px;
`;

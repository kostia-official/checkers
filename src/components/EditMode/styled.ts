import styled from 'styled-components';
import { SimpleCard } from '@components/SimpleCard';

export const CardStyled: typeof SimpleCard = styled(SimpleCard)`
  margin-top: 4px;
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SwitchWrapper = styled.div`
  margin-top: 5px;
  flex: 1 1 50%;
`;

export const ClearWrapper = styled.div`
  flex: 1 1 50%;
`;

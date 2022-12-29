import styled from 'styled-components';

export const MainMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const MainMenuTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const MainMenuButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;

  > * {
    min-width: 200px;
  }
`;

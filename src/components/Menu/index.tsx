import styled from 'styled-components';

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const MenuTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const MenuControlsWrapper = styled.div<{ itemWidthPx?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;

  > * {
    width: ${(p) => p.itemWidthPx || 200}px;
  }
`;

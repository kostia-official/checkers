import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 300;

  @media (max-width: ${(p) => p.theme.breakpoints.xs}px) {
    right: 4px;
    bottom: 4px;
    top: unset;
  }
`;

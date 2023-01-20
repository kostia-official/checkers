import styled, { css } from 'styled-components';
import { colors } from '@common/colors';

export const CheckersGameWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: ${(p) => p.theme.breakpoints.xs}px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const CheckersBoard = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 8px;
  max-width: min-content;
`;

export const CheckersRow = styled.div`
  display: flex;
`;

const validJump = css`
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12%;
    height: 12%;
    border-radius: 50%;
    background-color: ${colors.gold.main};
  }
`;

export const CheckersSquare = styled.div<{ isValidJumpDestination: boolean; rowSquaresCount: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(95vw / ${(p) => p.rowSquaresCount});
  height: calc(95vw / ${(p) => p.rowSquaresCount});
  max-width: 80px;
  max-height: 80px;
  background-color: white;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid ${colors.black.dark};
  }

  &.white {
    background-color: ${colors.grey.main};
    ${(p) => p.isValidJumpDestination && validJump}
  }
`;

export const GameExtrasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;

  > * {
    min-width: 220px;
  }
`;

export const SquareNotation = styled.div`
  position: absolute;
  color: white;
  left: 3px;
  bottom: 0;
  font-size: 12px;

  @media (max-width: ${(p) => p.theme.breakpoints.xs}px) {
    display: none;
  }
`;

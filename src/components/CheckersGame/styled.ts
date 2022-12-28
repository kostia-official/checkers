import styled, { css } from 'styled-components';

export const CheckersBoard = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 640px;
  height: 640px;
  margin: 8px;
`;

export const CheckersRow = styled.div`
  display: flex;
`;

const validJump = css`
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: gold;
  }
`;

export const CheckersSquare = styled.div<{ $isValidJumpDestination: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #fff;
  border: 2px solid #333;

  &.white {
    background-color: rgb(136, 136, 136);
    ${(p) => p.$isValidJumpDestination && validJump}
  }
`;

export const CheckersGameWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 16px;

  > * {
    min-width: 200px;
  }
`;

export const Indexes = styled.div`
  position: absolute;
  font-size: 12px;
  color: white;
  left: 0;
  bottom: 0;
`;

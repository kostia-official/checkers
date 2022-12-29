import styled from 'styled-components';

export const Button = styled.button<{ active?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #ddd;
  }

  &:disabled {
    background-color: #eee;
    border-color: #ccc;
    color: #999;
    cursor: default;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #ccc;
  `}
`;

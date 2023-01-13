import styled from 'styled-components';
import { Color } from '@common/types';
import { colors } from '@common/colors';

export const CheckerPieceWrapper = styled.div`
  display: flex;
  justify-content: center;

  width: 80%;
  height: 80%;
  border-radius: 50%;
  background-color: white;
  border: 2px solid ${colors.black.dark};

  &.pendingCapture {
    opacity: 0.3;
  }

  &.white {
    background-color: ${colors.beige.dark};
  }

  &.black {
    background-color: ${colors.black.light};
  }

  &.selected {
    border-color: ${colors.gold.pale};
  }
`;

const kingIconColor = (p: { color: Color }) => (p.color === 'black' ? colors.beige.main : 'black');

export const CheckerPieceInner = styled.div<{ color: Color }>`
  width: 97%;
  height: 97%;
  border-radius: 50%;
  border: 2px solid ${colors.black.dark};

  background-color: ${(p) => (p.color === 'black' ? 'black' : colors.beige.main)};

  &.king {
    background: ${(p) => (p.color === 'black' ? 'black' : colors.beige.main)}
      url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="${kingIconColor}" d="m12 8l3 5.2l3-2.7l-.7 3.5H6.7L6 10.5l3 2.7L12 8m0-4l-3.5 6L3 5l2 11h14l2-11l-5.5 5L12 4m7 14H5v1c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-1Z"%2F%3E%3C%2Fsvg%3E')
      no-repeat center;
    background-size: 80% auto;
  }
`;

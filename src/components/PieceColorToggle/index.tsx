import React from 'react';
import { Color } from '../../common/types';
import { Center, Box, SegmentedControl } from '@mantine/core';
import { WhitePiece, BlackPiece } from './styled';

export interface PieceColorToggleProps {
  value: Color;
  onChange: (color: Color) => void;
}

export const PieceColorToggle: React.FC<PieceColorToggleProps> = ({ value, onChange }) => {
  return (
    <SegmentedControl
      style={{ width: '100%' }}
      value={value}
      onChange={onChange}
      data={[
        {
          value: Color.White,
          label: (
            <Center>
              <WhitePiece />
              <Box ml={10}>White</Box>
            </Center>
          ),
        },
        {
          value: Color.Black,
          label: (
            <Center>
              <BlackPiece />
              <Box ml={8}>Black</Box>
            </Center>
          ),
        },
      ]}
    />
  );
};

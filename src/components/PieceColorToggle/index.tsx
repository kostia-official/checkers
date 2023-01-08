import React from 'react';
import { Color } from '@common/types';
import { Center, Box, SegmentedControl } from '@mantine/core';
import { WhitePieceIcon, BlackPieceIcon } from '@components/PieceIcon';
import { useTranslation } from 'react-i18next';

export interface PieceColorToggleProps {
  value: Color;
  onChange: (color: Color) => void;
}

export const PieceColorToggle: React.FC<PieceColorToggleProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

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
              <WhitePieceIcon />
              <Box ml={10}>{t('piecesColors.white')}</Box>
            </Center>
          ),
        },
        {
          value: Color.Black,
          label: (
            <Center>
              <BlackPieceIcon />
              <Box ml={8}>{t('piecesColors.black')}</Box>
            </Center>
          ),
        },
      ]}
    />
  );
};

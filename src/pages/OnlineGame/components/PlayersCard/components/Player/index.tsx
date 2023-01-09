import React from 'react';
import { Player, Color } from '@common/types';
import { Flex, Text } from '@mantine/core';
import { WhitePieceIcon, BlackPieceIcon } from '@components/PieceIcon';
import { useTranslation } from 'react-i18next';

export interface PlayerInfoProps {
  color: Color;
  currentPlayerColor: Color;
  player?: Player;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, color, currentPlayerColor }) => {
  const { t } = useTranslation();

  const PieceIcon = color === Color.White ? WhitePieceIcon : BlackPieceIcon;
  const isCurrentPlayer = color === currentPlayerColor;

  return (
    <Flex gap="xs" align="center">
      <PieceIcon highlighted={isCurrentPlayer} />{' '}
      {player?.name ? player.name : <Text color="grey">{t('players.waiting')}</Text>}
    </Flex>
  );
};
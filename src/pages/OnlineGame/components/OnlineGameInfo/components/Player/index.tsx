import React from 'react';
import { Player, Color } from '@common/types';
import { Flex, Text } from '@mantine/core';
import { WhitePieceIcon, BlackPieceIcon } from '@components/PieceIcon';

export interface PlayerInfoProps {
  color: Color;
  player?: Player;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, color }) => {
  const PieceIcon = color === Color.White ? WhitePieceIcon : BlackPieceIcon;

  return (
    <Flex gap="xs" align="center">
      <PieceIcon /> {player?.name ? player.name : <Text color="grey">Waiting</Text>}
    </Flex>
  );
};

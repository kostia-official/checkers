import React from 'react';
import { Color, GamePlayerExtended } from '@common/types';
import { Button, Text } from '@mantine/core';
import { WhitePieceIcon, BlackPieceIcon } from '@components/PieceIcon';
import { useTranslation } from 'react-i18next';
import { mantineColors } from '@common/colors';
import { PlayerRow, LeftPlayerInfo } from '@pages/OnlineGame/components/PlayersCard/components/Player/styled';

export interface PlayerInfoProps {
  color: Color;
  currentPlayerColor: Color;
  player?: GamePlayerExtended;
  isOwnPlayer: boolean;
  setIsReady: (gamePlayerId: string) => Promise<void>;
  gameStarted: boolean;
  opponentJoined: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  color,
  currentPlayerColor,
  isOwnPlayer,
  setIsReady,
  gameStarted,
  opponentJoined,
}) => {
  const { t } = useTranslation();

  const PieceIcon = color === Color.White ? WhitePieceIcon : BlackPieceIcon;
  const isOwnMove = gameStarted && color === currentPlayerColor;

  const readyText = <Text>{t('players.ready')}</Text>;
  const waitingText = <Text color="grey">{t('players.waiting')}</Text>;
  const opponentNotReadyContent = player ? waitingText : '';
  const ownPlayerReadinessContent = player?.isReady ? (
    readyText
  ) : (
    <Button color={mantineColors.accept} onClick={() => player && setIsReady(player.id)} compact size="sm">
      {t('players.start')}
    </Button>
  );
  const opponentReadinessContent = player?.isReady ? readyText : opponentNotReadyContent;
  const readinessContent = isOwnPlayer ? ownPlayerReadinessContent : opponentReadinessContent;

  return (
    <PlayerRow>
      <LeftPlayerInfo>
        <PieceIcon highlighted={isOwnMove} />{' '}
        {player ? (
          <Text truncate weight={isOwnMove ? '600' : 'inherit'}>
            {player.name}
          </Text>
        ) : (
          waitingText
        )}
      </LeftPlayerInfo>

      {!gameStarted && opponentJoined && readinessContent}
    </PlayerRow>
  );
};

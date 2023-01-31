import React from 'react';
import { Color, GamePlayerExtended } from '@common/types';
import { Button, Text } from '@mantine/core';
import { WhitePieceIcon, BlackPieceIcon } from '@components/PieceIcon';
import { useTranslation } from 'react-i18next';
import { mantineColors } from '@common/colors';
import {
  PlayerRow,
  LeftPlayerInfo,
} from '@pages/OnlineGame/components/PlayersCard/components/Player/styled';
import { PlayerTime } from '@pages/OnlineGame/components/PlayersCard/components/Player/components/PlayerTime';
import { GameModel, UserModel } from '@services/types';
import { useResolvedGameInfo } from '@pages/OnlineGame/hooks/useResolvedGameInfo';

export interface PlayerInfoProps {
  game: GameModel;
  user: UserModel;
  color: Color;
  currentPlayerColor: Color;
  player?: GamePlayerExtended;
  opponent?: GamePlayerExtended;
  isOwnPlayer: boolean;
  setIsReady: (gamePlayerId: string) => Promise<void>;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  opponent,
  color,
  currentPlayerColor,
  isOwnPlayer,
  setIsReady,
  game,
  user,
}) => {
  const { t } = useTranslation();
  const { isGameStarted, opponentId } = useResolvedGameInfo({ game, user });

  const PieceIcon = color === Color.White ? WhitePieceIcon : BlackPieceIcon;
  const isOwnMove = isGameStarted && color === currentPlayerColor;
  const isOpponentJoined = !!opponentId;

  const readyText = <Text>{t('players.ready')}</Text>;
  const waitingText = <Text color="grey">{t('players.waiting')}</Text>;
  const opponentNotReadyContent = player ? waitingText : '';
  const ownPlayerReadinessContent = player?.isReady ? (
    readyText
  ) : (
    <Button
      color={mantineColors.accept}
      onClick={() => player && setIsReady(player.id)}
      compact
      size="sm"
    >
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

      {!isGameStarted && isOpponentJoined && readinessContent}
      {isGameStarted && player && opponent?.lastMovedAt && (
        <PlayerTime
          timeSpentMs={player.timeSpentMs}
          moveStartedAt={opponent.lastMovedAt}
          timeLimitSeconds={game.timeLimitSeconds}
          isOwnMove={isOwnMove}
          isOwnPlayer={player.userId === user.id}
          gameEndedAt={game.endedAt}
        />
      )}
    </PlayerRow>
  );
};

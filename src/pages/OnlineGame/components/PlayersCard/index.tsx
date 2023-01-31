import React, { useMemo, useCallback } from 'react';
import { GameModel, UserModel } from '@services/types';
import { Box, Text, Flex } from '@mantine/core';
import { useMutation } from 'react-query';
import { GamePlayerExtended, Color, GamePlayers } from '@common/types';
import { PlayerInfo } from '@pages/OnlineGame/components/PlayersCard/components/Player';
import { toggleColor } from '@common/utils';
import { useTranslation } from 'react-i18next';
import { SimpleCard } from '@components/SimpleCard';
import { gameService, SubmitReadyArgs } from '@services/game.service';
import { useGameUsers } from '@pages/OnlineGame/hooks/useGameUsers';

export interface PlayersCardProps {
  game: GameModel;
  user: UserModel;
  gamePlayers: GamePlayers;
  isSpectator: boolean;
  currentPlayerColor: Color;
}

type Players = Record<Color, GamePlayerExtended | undefined>;

export const PlayersCard: React.FC<PlayersCardProps> = ({
  game,
  user,
  isSpectator,
  gamePlayers: { inviter, invitee },
  currentPlayerColor,
}) => {
  const { t } = useTranslation();

  const { inviterUser, inviteeUser } = useGameUsers({ game, user });
  const { mutateAsync: submitReadyGame } = useMutation((args: SubmitReadyArgs) =>
    gameService.submitReadyGame(args)
  );

  const setIsReady = useCallback(
    (gamePlayerId: string) => {
      return submitReadyGame({ id: game.id, gamePlayerId });
    },
    [game.id, submitReadyGame]
  );

  const players: Players = useMemo(() => {
    const result = {
      [inviter.color]: {
        ...inviter,
        name: inviterUser?.name,
        isOnline: true,
      },
      [toggleColor(inviter.color)]: undefined,
    };

    if (invitee && inviteeUser?.name) {
      result[invitee.color] = {
        ...(invitee || {}),
        name: inviteeUser.name,
        isOnline: true,
      };
    }

    return result as Players;
  }, [invitee, inviter, inviteeUser?.name, inviterUser?.name]);

  const commonPlayerProps = {
    game,
    user,
    setIsReady,
    currentPlayerColor,
  };

  return (
    <Box my="8px">
      <SimpleCard title={t('players.title')}>
        <Flex direction="column" style={{ gap: '4px' }}>
          <PlayerInfo
            {...commonPlayerProps}
            key={players.white?.id || 'white'}
            color={Color.White}
            player={players.white}
            opponent={players.black}
            isOwnPlayer={user.id === players.white?.userId}
          />
          <PlayerInfo
            {...commonPlayerProps}
            key={players.black?.id || 'black'}
            color={Color.Black}
            player={players.black}
            opponent={players.white}
            isOwnPlayer={user.id === players.black?.userId}
          />

          {isSpectator && <Text>{t('players.spectatorLabel')}</Text>}
        </Flex>
      </SimpleCard>
    </Box>
  );
};

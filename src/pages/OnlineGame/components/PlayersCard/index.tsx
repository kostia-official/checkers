import React, { useMemo, useCallback } from 'react';
import { GameModel, UserModel } from '@services/types';
import { Box, Text, Flex } from '@mantine/core';
import { useQuery, useMutation } from 'react-query';
import { userService } from '@services/user.service';
import { GamePlayerExtended, Color, GamePlayers } from '@common/types';
import { PlayerInfo } from '@pages/OnlineGame/components/PlayersCard/components/Player';
import { toggleColor } from '@common/utils';
import { useTranslation } from 'react-i18next';
import { SimpleCard } from '@components/SimpleCard';
import { gameService, SubmitReadyArgs } from '@services/game.service';
import { useResolvedGameInfo } from '@pages/OnlineGame/hooks/useResolvedGameInfo';

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

  const { data: inviterUser } = useQuery(['user', game.inviterId], () => userService.get(game.inviterId!), {
    enabled: !!game.inviterId,
    initialData: game.inviterId === user.id ? user : undefined,
  });
  const { data: inviteeUser } = useQuery(['user', game.inviteeId], () => userService.get(game.inviteeId!), {
    enabled: !!game.inviteeId,
    initialData: game.inviteeId === user.id ? user : undefined,
  });
  const { mutateAsync: submitReadyGame } = useMutation((args: SubmitReadyArgs) => gameService.submitReadyGame(args));

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

  const { isGameStarted, opponentId } = useResolvedGameInfo({ game, user });

  const commonPlayerProps = {
    setIsReady,
    gameStarted: isGameStarted,
    opponentJoined: !!opponentId,
    currentPlayerColor,
  };

  return (
    <Box my="8px">
      <SimpleCard title={t('players.title')}>
        <Flex direction="column" style={{ gap: '4px' }}>
          <PlayerInfo
            {...commonPlayerProps}
            color={Color.White}
            player={players.white}
            isOwnPlayer={user.id === players.white?.userId}
          />
          <PlayerInfo
            {...commonPlayerProps}
            color={Color.Black}
            player={players.black}
            isOwnPlayer={user.id === players.black?.userId}
          />
        </Flex>

        {isSpectator && <Text>{t('players.spectatorLabel')}</Text>}
      </SimpleCard>
    </Box>
  );
};

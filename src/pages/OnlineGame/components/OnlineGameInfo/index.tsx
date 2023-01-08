import React, { useMemo } from 'react';
import { GameModel, UserModel } from '@services/types';
import { Text } from '@mantine/core';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { userService } from '@services/user.service';
import { Player, Color } from '@common/types';
import { PlayerInfo } from '@pages/OnlineGame/components/OnlineGameInfo/components/Player';
import { toggleColor } from '@common/utils';
import { useTranslation } from 'react-i18next';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`;

export interface OnlineGameInfoProps {
  game: GameModel;
  user: UserModel;
  isSpectator: boolean;
}

type Players = Record<Color, Player | undefined>;

export const OnlineGameInfo: React.FC<OnlineGameInfoProps> = ({ game, user, isSpectator }) => {
  const { t } = useTranslation();

  const { data: inviter } = useQuery(['user', game.inviterId], () => userService.get(game.inviterId!), {
    enabled: !!game.inviterId,
    initialData: game.inviterId === user.id ? user : undefined,
  });
  const { data: invitee } = useQuery(['user', game.inviteeId], () => userService.get(game.inviteeId!), {
    enabled: !!game.inviteeId,
    initialData: game.inviteeId === user.id ? user : undefined,
  });
  const players = useMemo(() => {
    const result = {
      [game.inviterColor]: {
        id: game.inviterId,
        name: inviter?.name,
        color: game.inviterColor,
        isOnline: true,
      },
      [toggleColor(game.inviterColor)]: undefined,
    };

    if (invitee && game.inviteeColor && game.inviteeId) {
      result[game.inviteeColor] = {
        id: game.inviteeId,
        name: invitee?.name,
        color: game.inviteeColor,
        isOnline: true,
      };
    }

    return result as Players;
  }, [game.inviteeColor, game.inviteeId, game.inviterColor, game.inviterId, invitee, inviter?.name]);

  return (
    <Wrapper>
      <PlayerInfo color={Color.White} player={players.white} />
      <PlayerInfo color={Color.Black} player={players.black} />

      {isSpectator && <Text>{t('players.spectatorLabel')}</Text>}
    </Wrapper>
  );
};

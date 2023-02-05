import React, { useState, useCallback } from 'react';
import { GameModel, UpdateGameInput } from '@services/types';
import { ActionIcon, Flex, Text, Collapse } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconClockHour4, IconSettings, IconCheck } from '@tabler/icons';
import { CardStyled, Time, Header, EditWrapper, Content } from './styled';
import { Color } from '@common/types';
import { useMutation } from 'react-query';
import { gameService } from '@services/game.service';
import { GameFormValues, GameFormContent } from '@components/GameFormContent';
import { useForm } from '@mantine/form';
import { requiredNumber } from '@common/form/validators';

export interface GameSettingsCardProps {
  game: GameModel;
  currentPlayerColor: Color;
}

export const GameSettingsCard: React.FC<GameSettingsCardProps> = ({ game, currentPlayerColor }) => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);

  const { gameType, timeLimitSeconds, moveTimeIncSeconds, startedAt } = game;

  const gameTypeName = t(`gameTypes.${gameType}`);

  const { mutateAsync: updateGame } = useMutation(
    ({ id, input }: { id: string; input: UpdateGameInput }) => gameService.update(id, input)
  );

  const form = useForm<GameFormValues>({
    initialValues: {
      playerColor: currentPlayerColor,
      gameType: game.gameType,
      timeLimitMinutes: game.timeLimitSeconds / 60,
      moveTimeIncSeconds: game.moveTimeIncSeconds,
      isOffline: false,
      userName: undefined,
    },
    validate: {
      timeLimitMinutes: requiredNumber,
      moveTimeIncSeconds: requiredNumber,
    },
  });

  const onSubmit = useCallback(
    async ({ moveTimeIncSeconds, timeLimitMinutes }: GameFormValues) => {
      await updateGame({
        id: game.id,
        input: { moveTimeIncSeconds, timeLimitSeconds: timeLimitMinutes * 60 },
      });
      setIsEdit(false);
    },
    [game.id, updateGame]
  );

  return (
    <CardStyled withBorder>
      <form noValidate onSubmit={form.onSubmit(onSubmit)}>
        <Content>
          <Header>
            <Flex gap="xs">
              <Text weight={500}>{gameTypeName}</Text>
              <Time>
                {Math.ceil(timeLimitSeconds / 60)}+{moveTimeIncSeconds}
                <IconClockHour4 size="16px" />
              </Time>
            </Flex>

            {isEdit ? (
              <ActionIcon key="submit" color="dark" type="submit">
                <IconCheck />
              </ActionIcon>
            ) : (
              <ActionIcon
                key="edit"
                color="dark"
                disabled={!!startedAt}
                onClick={() => setIsEdit(true)}
              >
                <IconSettings />
              </ActionIcon>
            )}
          </Header>

          <Collapse in={isEdit}>
            <EditWrapper>
              <GameFormContent form={form} />
            </EditWrapper>
          </Collapse>
        </Content>
      </form>
    </CardStyled>
  );
};

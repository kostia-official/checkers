import React, { useMemo } from 'react';
import { PieceColorToggle } from '@components/PieceColorToggle';
import { Box, Switch, Flex, NumberInput, Text, TextInput, Collapse } from '@mantine/core';
import { t } from 'i18next';
import { UseFormReturnType } from '@mantine/form/lib/types';
import { Color, GameType } from '@common/types';
import { UserModel } from '@services/types';

export interface GameFormValues {
  userName: string | undefined;
  isOffline: boolean;
  gameType: GameType;
  timeLimitMinutes: number;
  moveTimeIncSeconds: number;
  playerColor: Color;
}
export type GameForm = UseFormReturnType<GameFormValues>;

export interface GameFormContentProps {
  user?: UserModel;
  form: GameForm;
  onlineOnly?: boolean;
  withUser?: boolean;
  withGameType?: boolean;
  withColor?: boolean;
}

export const GameFormContent = ({
  onlineOnly = true,
  withUser = false,
  withGameType = false,
  withColor = false,
  form,
  user,
}: GameFormContentProps) => {
  const timeStep = useMemo(() => {
    const value = form.values.timeLimitMinutes;
    let step = 1;

    if (value > 5) step = 5;
    if (value > 30) step = 15;

    return step - (value % step);
  }, [form.values.timeLimitMinutes]);

  const userContent = useMemo(() => {
    return user ? (
      <Text>
        {t('userForm.name')}: {user.name}
      </Text>
    ) : (
      <TextInput required placeholder={t('userForm.name')} {...form.getInputProps('userName')} />
    );
  }, [form, user]);

  return (
    <>
      {withUser && userContent}
      {withGameType && <div />}
      {withColor && <PieceColorToggle {...form.getInputProps('playerColor')} />}

      {!onlineOnly && (
        <Box mt="4px" mb="-6px">
          <Switch label={t('newGame.offline')} {...form.getInputProps('isOffline')} />
        </Box>
      )}

      {!onlineOnly && (
        <Collapse in={!form.values.isOffline}>
          <Flex gap="xs">
            <NumberInput
              label={t('newGame.gameTime')}
              icon={<Text size="xs">{t('newGame.min')}</Text>}
              radius="md"
              {...form.getInputProps('timeLimitMinutes')}
              min={1}
              step={timeStep}
            />

            <NumberInput
              label={t('newGame.addTime')}
              icon={<Text size="xs">{t('newGame.sec')}</Text>}
              radius="md"
              {...form.getInputProps('moveTimeIncSeconds')}
              min={0}
              step={1}
            />
          </Flex>
        </Collapse>
      )}
    </>
  );
};

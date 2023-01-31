import React, { useState, useMemo } from 'react';
import { Button, TextInput, Text, Switch, NumberInput, Flex, Box, Space } from '@mantine/core';
import { MenuTitle, MenuControlsWrapper, MenuWrapper } from '@components/Menu';
import { useQuery, useMutation } from 'react-query';
import { userService } from '@services/user.service';
import { Color, GameType } from '@common/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateUserInput } from '@services/types';
import { CenteredLoader } from '@components/CenteredLoader';
import { PieceColorToggle } from '@components/PieceColorToggle';
import { useTranslation } from 'react-i18next';
import { useNewGame } from '@pages/OnlineGame/hooks/useNewGame';
import { Lang } from '@src/lang/types';
import { useForm } from '@mantine/form';
import { requiredString, requiredNumber } from '@common/form/validators';

export const NewGame: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useQuery('currentUser', () =>
    userService.getCurrent()
  );
  const { mutateAsync: createUser } = useMutation((input: CreateUserInput) =>
    userService.create(input)
  );

  const form = useForm({
    initialValues: {
      userName: user?.name,
      playerColor: Color.White,
      isOffline: false,
      timeLimitMinutes: 5,
      moveTimeIncSeconds: 0,
    },
    validate: {
      userName: user ? undefined : requiredString,
      timeLimitMinutes: requiredNumber,
      moveTimeIncSeconds: requiredNumber,
    },
  });

  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const { startNewGame } = useNewGame();
  const { i18n } = useTranslation();

  const gameType = searchParams.get('type') as GameType;

  const onSubmit = async ({
    userName,
    isOffline,
    playerColor,
    timeLimitMinutes,
    moveTimeIncSeconds,
  }: typeof form.values) => {
    setLoading(true);

    try {
      let userId = user?.id;

      if (!user && userName) {
        const createdUser = await createUser({
          name: userName,
          language: i18n.resolvedLanguage as Lang,
        });
        userId = createdUser.id;
      }
      if (!userId) return;

      if (isOffline) {
        navigate(`/game/offline/${gameType}`);
        return;
      }

      await startNewGame({
        inviterId: userId,
        inviterColor: playerColor,
        gameType,
        timeLimitSeconds: timeLimitMinutes * 60,
        moveTimeIncSeconds,
      });
    } finally {
      setLoading(false);
    }
  };

  const timeStep = useMemo(() => {
    const value = form.values.timeLimitMinutes;
    let step = 1;

    if (value > 5) step = 5;
    if (value > 30) step = 15;

    return step - (value % step);
  }, [form.values.timeLimitMinutes]);

  if (isUserLoading) return <CenteredLoader />;

  return (
    <MenuWrapper>
      <MenuTitle>{t('newGame.title')}</MenuTitle>

      <form noValidate onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <MenuControlsWrapper itemWidthPx={230}>
          {user ? (
            <Text>
              {t('userForm.name')}: {user.name}
            </Text>
          ) : (
            <TextInput
              required
              placeholder={t('userForm.name')}
              {...form.getInputProps('userName')}
            />
          )}

          <PieceColorToggle {...form.getInputProps('playerColor')} />

          <Box mt="4px" mb="-6px">
            <Switch label={t('newGame.offline')} {...form.getInputProps('isOffline')} />
          </Box>

          {!form.values.isOffline && (
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
          )}

          <Space />

          <Button type="submit" loading={loading}>
            {t('newGame.startGame')}
          </Button>
        </MenuControlsWrapper>
      </form>
    </MenuWrapper>
  );
};

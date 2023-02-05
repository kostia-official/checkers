import React, { useState } from 'react';
import { Button, Space } from '@mantine/core';
import { MenuTitle, MenuControlsWrapper, MenuWrapper } from '@components/Menu';
import { useQuery, useMutation } from 'react-query';
import { userService } from '@services/user.service';
import { Color, GameType } from '@common/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateUserInput } from '@services/types';
import { CenteredLoader } from '@components/CenteredLoader';
import { useTranslation } from 'react-i18next';
import { useNewGame } from '@pages/OnlineGame/hooks/useNewGame';
import { Lang } from '@src/lang/types';
import { useForm } from '@mantine/form';
import { requiredString, requiredNumber } from '@common/form/validators';
import { GameFormContent, GameFormValues } from '@components/GameFormContent';

export const NewGame: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useQuery('currentUser', () =>
    userService.getCurrent()
  );
  const { mutateAsync: createUser } = useMutation((input: CreateUserInput) =>
    userService.create(input)
  );

  let [searchParams] = useSearchParams();
  const gameType = searchParams.get('type') as GameType;

  const form = useForm({
    initialValues: {
      userName: user?.name,
      playerColor: Color.White,
      isOffline: false,
      timeLimitMinutes: 5,
      moveTimeIncSeconds: 0,
      gameType,
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
  const { startNewGame } = useNewGame();
  const { i18n } = useTranslation();

  const onSubmit = async ({
    userName,
    isOffline,
    playerColor,
    timeLimitMinutes,
    moveTimeIncSeconds,
    gameType,
  }: GameFormValues) => {
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
        inviteeId: null,
        inviterColor: playerColor,
        inviteeColor: null,
        gameType,
        timeLimitSeconds: timeLimitMinutes * 60,
        moveTimeIncSeconds,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return <CenteredLoader />;

  return (
    <MenuWrapper>
      <MenuTitle>{t('newGame.title')}</MenuTitle>

      <form noValidate onSubmit={form.onSubmit(onSubmit)}>
        <MenuControlsWrapper itemWidthPx={230}>
          <GameFormContent form={form} user={user} withUser withColor onlineOnly={false} />

          <Space />

          <Button type="submit" loading={loading}>
            {t('newGame.startGame')}
          </Button>
        </MenuControlsWrapper>
      </form>
    </MenuWrapper>
  );
};

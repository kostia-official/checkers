import React, { useState } from 'react';
import { Button, TextInput, Text } from '@mantine/core';
import { MenuTitle, MenuControlsWrapper, MenuWrapper } from '@components/Menu';
import { useQuery, useMutation } from 'react-query';
import { userService } from '@services/user.service';
import { gameService } from '@services/game.service';
import { Color, GameType } from '@common/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateUserInput, CreateGameInput } from '@services/types';
import { CenteredLoader } from '@components/CenteredLoader';
import { PieceColorToggle } from '@components/PieceColorToggle';
import { useTranslation } from 'react-i18next';

export const NewGame: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useQuery('currentUser', () => userService.getCurrent());
  const { mutateAsync: createUser } = useMutation((input: CreateUserInput) => userService.create(input));
  const { mutateAsync: createGame } = useMutation((input: CreateGameInput) => gameService.create(input));
  const [userName, setUserName] = useState<string | undefined>();
  const [playerColor, setPlayerColor] = useState<Color>(Color.White);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const startGame = async () => {
    setLoading(true);

    try {
      let userId = user?.id;

      if (!user && userName) {
        const createdUser = await createUser({ name: userName });
        userId = createdUser.id;
      }
      if (!userId) return;

      const game = await createGame({
        inviterId: userId,
        inviterColor: playerColor,
        gameType: searchParams.get('type') as GameType,
      });

      navigate(`/game/${game.id}`);
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return <CenteredLoader />;

  return (
    <MenuWrapper>
      <MenuTitle>{t('newGame.title')}</MenuTitle>

      <MenuControlsWrapper>
        {user ? (
          <Text>
            {t('userForm.name')}: {user.name}
          </Text>
        ) : (
          <TextInput
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t('userForm.name')}
          />
        )}

        <PieceColorToggle value={playerColor} onChange={setPlayerColor} />

        <Button onClick={startGame} loading={loading}>
          {t('newGame.startGame')}
        </Button>
      </MenuControlsWrapper>
    </MenuWrapper>
  );
};

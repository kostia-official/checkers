import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { MenuTitle, MenuControlsWrapper, MenuWrapper } from '@components/Menu';
import { useTranslation } from 'react-i18next';

export const MainMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MenuWrapper>
      <MenuTitle>{t('mainMenu.title')}</MenuTitle>
      <MenuControlsWrapper>
        <Button fullWidth component={Link} to="/game/new?type=draughts64">
          {t('gameTypes.draughts64')}
        </Button>
        <Button fullWidth component={Link} to="/game/new?type=internation">
          {t('gameTypes.international')}
        </Button>
        <Button fullWidth component={Link} to="/game/new?type=frisian">
          {t('gameTypes.frisian')}
        </Button>
      </MenuControlsWrapper>
    </MenuWrapper>
  );
};

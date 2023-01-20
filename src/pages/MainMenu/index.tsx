import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { MenuTitle, MenuControlsWrapper, MenuWrapper } from '@components/Menu';
import { useTranslation } from 'react-i18next';
import { GameType } from '@common/types';

export const MainMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MenuWrapper>
      <MenuTitle>{t('mainMenu.title')}</MenuTitle>
      <MenuControlsWrapper>
        {Object.values(GameType).map((gameType) => (
          <Button key={gameType} fullWidth component={Link} to={`/game/new?type=${gameType}`}>
            {t(`gameTypes.${gameType}`)}
          </Button>
        ))}
      </MenuControlsWrapper>
    </MenuWrapper>
  );
};

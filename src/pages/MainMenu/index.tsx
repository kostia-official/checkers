import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { MenuTitle, MenuControlsWrapper, MenuWrapper } from '@components/Menu';

export const MainMenu: React.FC = () => {
  return (
    <MenuWrapper>
      <MenuTitle>Select Game</MenuTitle>
      <MenuControlsWrapper>
        <Button fullWidth component={Link} to="/game/new?type=draughts64">
          Draughts 64
        </Button>
        <Button fullWidth component={Link} to="/game/new?type=internation">
          Internation
        </Button>
      </MenuControlsWrapper>
    </MenuWrapper>
  );
};

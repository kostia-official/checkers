import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { MainMenuWrapper, MainMenuTitle, MainMenuButtonWrapper } from './styled';

export const MainMenu: React.FC = () => {
  return (
    <MainMenuWrapper>
      <MainMenuTitle>Select Game</MainMenuTitle>
      <MainMenuButtonWrapper>
        <Link to="/checkers64">
          <Button>Checkers 64</Button>
        </Link>
        <Link to="/checkers100">
          <Button>Checkers 100</Button>
        </Link>
      </MainMenuButtonWrapper>
    </MainMenuWrapper>
  );
};

import { MainMenu } from './pages/MainMenu';
import { CheckersGame } from './pages/CheckersGame';
import { createBrowserRouter } from 'react-router-dom';
import { Checkers64Strategy } from './strategies/checkers64-strategy';
import { Checkers100Strategy } from './strategies/checkers100-strategy';

export const routes = [
  {
    path: '/',
    element: <MainMenu />,
  },
  {
    path: '/checkers64',
    element: <CheckersGame strategy={new Checkers64Strategy()} />,
  },
  {
    path: '/checkers100',
    element: <CheckersGame strategy={new Checkers100Strategy()} />,
  },
];

export const router = createBrowserRouter(routes);

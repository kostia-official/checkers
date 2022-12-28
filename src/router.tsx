import { Checkers64Strategy } from './strategies/checkers64-strategy';
import { MainMenu } from './components/MainMenu';
import { CheckersGame } from './components/CheckersGame';
import { createBrowserRouter } from 'react-router-dom';

export const routes = [
  {
    path: '/',
    element: <MainMenu />
  },
  {
    path: '/checkers64',
    element: <CheckersGame strategy={new Checkers64Strategy()} />
  }
  // {
  //   path: '/checkers100',
  //   element: <CheckersGame strategy={new Checkers100Strategy()} />
  // }
];

export const router = createBrowserRouter(routes);

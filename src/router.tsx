import { MainMenu } from '@pages/MainMenu';
import { OfflineGame } from '@pages/OfflineGame';
import { createBrowserRouter } from 'react-router-dom';
import { Checkers64Strategy } from '@strategies/checkers64-strategy';
import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { NewGame } from '@pages/NewGame';
import { OnlineGamePreload } from '@pages/OnlineGame';

export const routes = [
  {
    path: '/',
    element: <MainMenu />,
  },
  {
    path: '/game/new',
    element: <NewGame />,
  },
  {
    path: '/game/:gameId',
    element: <OnlineGamePreload />,
  },
  {
    path: '/game/offline/draughts64',
    element: <OfflineGame strategy={new Checkers64Strategy()} />,
  },
  {
    path: '/game/offline/internation',
    element: <OfflineGame strategy={new Checkers100Strategy()} />,
  },
];

export const router = createBrowserRouter(routes);

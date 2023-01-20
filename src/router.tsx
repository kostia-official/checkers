import { MainMenu } from '@pages/MainMenu';
import { OfflineGame } from '@pages/OfflineGame';
import { createBrowserRouter } from 'react-router-dom';
import { Draughts64Strategy } from '@strategies/draughts64-strategy';
import { Draughts100Strategy } from '@strategies/draughts100-strategy';
import { NewGame } from '@pages/NewGame';
import { OnlineGame } from '@pages/OnlineGame';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { BrazilianDraughtsStrategy } from '@strategies/brasilian-draughts-strategy';
import { FrisianDraughts64Strategy } from '@strategies/frisian-draughts64-strategy';

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
    element: <OnlineGame />,
  },
  {
    path: '/game/offline/draughts64',
    element: <OfflineGame strategy={new Draughts64Strategy()} />,
  },
  {
    path: '/game/offline/internation',
    element: <OfflineGame strategy={new Draughts100Strategy()} />,
  },
  {
    path: '/game/offline/brazilian',
    element: <OfflineGame strategy={new BrazilianDraughtsStrategy()} />,
  },
  {
    path: '/game/offline/frisian',
    element: <OfflineGame strategy={new FrisianDraughtsStrategy()} />,
  },
  {
    path: '/game/offline/frisian64',
    element: <OfflineGame strategy={new FrisianDraughts64Strategy()} />,
  },
];

export const router = createBrowserRouter(routes);

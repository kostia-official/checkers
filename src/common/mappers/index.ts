import { GameType } from '../types';
import { Draughts64Strategy } from '@strategies/draughts64-strategy';
import { Draughts100Strategy } from '@strategies/draughts100-strategy';
import { ICheckersStrategy } from '@strategies/draughts-strategy.interface';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';
import { BrazilianDraughtsStrategy } from '@strategies/brasilian-draughts-strategy';
import { FrisianDraughts64Strategy } from '@strategies/frisian-draughts64-strategy';

export const mapGameTypeToStrategy: Record<GameType, new () => ICheckersStrategy> = {
  [GameType.Draughts64]: Draughts64Strategy,
  [GameType.International]: Draughts100Strategy,
  [GameType.Frisian]: FrisianDraughtsStrategy,
  [GameType.Brazilian]: BrazilianDraughtsStrategy,
  [GameType.Frisian64]: FrisianDraughts64Strategy,
};

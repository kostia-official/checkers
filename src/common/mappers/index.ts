import { GameType } from '../types';
import { Checkers64Strategy } from '@strategies/checkers64-strategy';
import { Checkers100Strategy } from '@strategies/checkers100-strategy';
import { ICheckersStrategy } from '@strategies/checkers-strategy.interface';
import { FrisianDraughtsStrategy } from '@strategies/frisian-draughts-strategy';

export const mapGameTypeToStrategy: Record<GameType, new () => ICheckersStrategy> = {
  draughts64: Checkers64Strategy,
  internation: Checkers100Strategy,
  frisian: FrisianDraughtsStrategy,
};

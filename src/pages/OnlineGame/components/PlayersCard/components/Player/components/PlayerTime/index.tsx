import React from 'react';
import { Time } from './styled';
import { Duration } from 'luxon';
import { mantineColors } from '@common/colors';
import { getPlayerTimeLeft } from '@common/utils/playerTime';

export interface PlayerTimeProps {
  timeSpentMs: number;
  moveStartedAt: Date;
  timeLimitSeconds: number;
  isOwnMove: boolean;
  isOwnPlayer: boolean;
  gameEndedAt: Date | undefined;
}

export const PlayerTime: React.FC<PlayerTimeProps> = ({
  timeSpentMs,
  moveStartedAt,
  isOwnMove,
  isOwnPlayer,
  gameEndedAt,
  timeLimitSeconds,
}) => {
  const { tickingTimeLeftMs, staticTimeLeftMs } = getPlayerTimeLeft({
    timeSpentMs,
    moveStartedAt,
    timeLimitSeconds,
    gameEndedAt,
  });
  const timeLeftMs = isOwnMove ? tickingTimeLeftMs : staticTimeLeftMs;
  const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
  const isLowTime = isOwnPlayer && timeLeftSeconds <= 30;

  const timeLeftText =
    timeLeftSeconds > 0
      ? Duration.fromObject({ seconds: timeLeftSeconds }).toFormat('mm:ss')
      : '00:00';

  return <Time color={isLowTime ? mantineColors.decline : undefined}>{timeLeftText}</Time>;
};

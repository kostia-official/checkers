export interface GetPlayerTimeLeftArgs {
  timeSpentMs: number;
  moveStartedAt: Date;
  timeLimitSeconds: number;
  gameEndedAt?: Date | null;
}

export const getPlayerTimeLeft = ({
  timeSpentMs,
  timeLimitSeconds,
  moveStartedAt,
  gameEndedAt,
}: GetPlayerTimeLeftArgs) => {
  const currentTime = !!gameEndedAt ? +gameEndedAt : Date.now();
  const staticTimeLeftMs = timeLimitSeconds * 1000 - timeSpentMs;
  const tickingTimeLeftMs = +moveStartedAt + staticTimeLeftMs - currentTime;

  return { staticTimeLeftMs, tickingTimeLeftMs };
};

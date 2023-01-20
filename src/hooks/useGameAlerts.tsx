import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Text } from '@mantine/core';
import { GameAlert } from '@common/types';
import { showNotification } from '@mantine/notifications';
import { mantineColors } from '@common/colors';

export interface HookArgs {
  gameAlerts: GameAlert[];
}

export const useGameAlerts = ({ gameAlerts }: HookArgs) => {
  const [lastAlertShownAt, setLastAlertShownAt] = useState(new Date());

  const newGameAlerts = useMemo(() => {
    return gameAlerts.filter((alert) => alert.createdAt > lastAlertShownAt);
  }, [gameAlerts, lastAlertShownAt]);

  const showNewAlerts = useCallback(() => {
    newGameAlerts.forEach((alert) => {
      showNotification({
        id: String(alert.createdAt.getTime()),
        color: mantineColors.warning,
        autoClose: 5000,
        message: <Text align="center">{alert.message}</Text>,
      });
    });

    if (newGameAlerts.length > 0) {
      setLastAlertShownAt(new Date());
    }
  }, [newGameAlerts]);

  useEffect(() => {
    showNewAlerts();
  }, [gameAlerts, showNewAlerts]);
};

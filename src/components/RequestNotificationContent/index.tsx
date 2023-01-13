import React from 'react';
import { Text, Flex, ActionIcon } from '@mantine/core';
import { mantineColors } from '@common/colors';
import { IconX, IconCheck } from '@tabler/icons';

export interface RequestNotificationContentProps {
  text: React.ReactNode;
  onAccept: () => Promise<unknown>;
  onDecline: () => Promise<unknown>;
}

export const RequestNotificationContent: React.FC<RequestNotificationContentProps> = ({
  text,
  onAccept,
  onDecline,
}) => {
  return (
    <Flex justify="space-between" align="center">
      <Text size="md">{text}</Text>

      <Flex gap="xs">
        <ActionIcon variant="filled" size="lg" color={mantineColors.accept} onClick={onAccept}>
          <IconCheck size={18} />
        </ActionIcon>
        <ActionIcon variant="filled" size="lg" color={mantineColors.decline} onClick={onDecline}>
          <IconX size={18} />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

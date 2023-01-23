import React from 'react';
import { MessageModel } from '@services/types';
import { Text } from '@mantine/core';
import { MessageCard, Sender } from './styled';
import { useQuery } from 'react-query';
import { userService } from '@services/user.service';

export interface MessageProps {
  message: MessageModel;
  isOwnUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isOwnUser }) => {
  const { data: sender } = useQuery(
    ['user', message.senderId],
    () => userService.get(message.senderId),
    {
      enabled: false, // take from cache
    }
  );

  return (
    <MessageCard isOwnUser={isOwnUser}>
      <Sender>{sender?.name}</Sender>
      <Text size="sm">{message.text}</Text>
    </MessageCard>
  );
};

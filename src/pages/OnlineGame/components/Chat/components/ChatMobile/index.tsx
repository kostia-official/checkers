import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameModel, UserModel, MessageModel } from '@services/types';
import { Indicator, Popover } from '@mantine/core';
import { IconMessages } from '@tabler/icons';
import { ChatCard } from '../ChatCard';
import { ChatButtonWrapper, ChatCardWrapper, PopoverDropdown, ChatActionIcon } from './styled';
import { LastMessagePopover } from './components/LastMessagePopover';

export interface ChatMobileProps {
  game: GameModel;
  user: UserModel;
  messages?: MessageModel[];
  openChatAt?: number;
}

export const ChatMobile: React.FC<ChatMobileProps> = ({ game, user, messages, openChatAt }) => {
  const [lastMessageReadAt, setLastMessageReadAt] = useState<Date>(new Date());
  const [isShowNewMessage, setIsShowNewMessage] = useState(false);
  const [isOpenedChat, setIsOpenedChat] = useState(false);

  const checkIsNewMessage = useCallback(
    (message: MessageModel) =>
      message.createdAt > lastMessageReadAt && message.senderId !== user.id,
    [lastMessageReadAt, user.id]
  );

  const lastNewMessage = useMemo(() => {
    if (!messages || isOpenedChat) return;
    const newMessages = messages.filter(checkIsNewMessage);
    return newMessages[newMessages.length - 1];
  }, [checkIsNewMessage, isOpenedChat, messages]);

  const readMessages = useCallback(() => {
    setIsShowNewMessage(false);
    setLastMessageReadAt(new Date());
  }, []);

  const isShowNewMessagesIndicator = !!lastNewMessage;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!!lastNewMessage) {
      setIsShowNewMessage(true);

      timeout = setTimeout(() => {
        setIsShowNewMessage(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [lastNewMessage]);

  const toggleChatOpened = useCallback(() => {
    readMessages();
    setIsOpenedChat((prev) => !prev);
  }, [readMessages]);

  useEffect(() => {
    // Can be opened from parent component
    if (openChatAt) {
      setIsOpenedChat(true);
    }
  }, [openChatAt]);

  return (
    <Popover width="100%" withArrow shadow="md" opened={isOpenedChat} onChange={setIsOpenedChat}>
      <Popover.Target>
        <ChatButtonWrapper>
          <LastMessagePopover
            opened={isShowNewMessage}
            lastNewMessage={lastNewMessage}
            openChat={toggleChatOpened}
          >
            <ChatActionIcon variant="filled" color="coolBlack" onClick={toggleChatOpened}>
              <Indicator
                position="top-start"
                withBorder
                offset={-6}
                color="red"
                size={12}
                disabled={!isShowNewMessagesIndicator}
              >
                <IconMessages />
              </Indicator>
            </ChatActionIcon>
          </LastMessagePopover>
        </ChatButtonWrapper>
      </Popover.Target>

      <PopoverDropdown>
        <ChatCardWrapper>
          <ChatCard game={game} user={user} messages={messages} />
        </ChatCardWrapper>
      </PopoverDropdown>
    </Popover>
  );
};

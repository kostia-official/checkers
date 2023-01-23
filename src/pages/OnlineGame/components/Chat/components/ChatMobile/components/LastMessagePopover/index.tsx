import React from 'react';
import { Popover } from '@mantine/core';
import { PopoverDropdown } from '@pages/OnlineGame/components/Chat/components/ChatMobile/styled';
import { Message } from '@pages/OnlineGame/components/Chat/components/ChatCard/components/Message';
import { MessageModel } from '@services/types';

export interface LastMessagePopoverProps {
  children: React.ReactNode;
  opened: boolean;
  lastNewMessage: MessageModel | undefined;
  openChat: () => void;
}

export const LastMessagePopover: React.FC<LastMessagePopoverProps> = ({
  children,
  opened,
  lastNewMessage,
  openChat,
}) => {
  return (
    <Popover width={200} withArrow shadow="md" opened={opened}>
      <Popover.Target>{children}</Popover.Target>

      <PopoverDropdown>
        {lastNewMessage && (
          <div onClick={openChat}>
            <Message message={lastNewMessage} isOwnUser={false} />
          </div>
        )}
      </PopoverDropdown>
    </Popover>
  );
};

import React from 'react';
import { GameModel, UserModel } from '@services/types';
import { useIsMobile } from '@src/hooks/useIsMobile';
import { ChatCard } from '@pages/OnlineGame/components/Chat/components/ChatCard';
import { ChatMobile } from '@pages/OnlineGame/components/Chat/components/ChatMobile';
import { useQuery } from 'react-query';
import { messageService } from '@services/message.service';
import { useSubscription } from '@src/hooks/useSubscription';
import { queryClient } from '@src/queryClient';

export interface ChatProps {
  game: GameModel;
  user: UserModel;
}

export const Chat: React.FC<ChatProps> = ({ game, user }) => {
  const { data: messages } = useQuery(
    ['messages', game.roomId],
    () => messageService.getRoomMessages(game.roomId),
    { refetchOnWindowFocus: 'always' }
  );

  useSubscription(() =>
    messageService.onRoomMessagesUpdated(game.roomId, (data) => {
      queryClient.setQueryData(['messages', game.roomId], data);
    })
  );

  const isMobile = useIsMobile();

  const props = { game, user, messages };

  return isMobile ? <ChatMobile {...props} /> : <ChatCard {...props} />;
};

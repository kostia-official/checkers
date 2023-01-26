import React, { useEffect, useState } from 'react';
import { GameModel, UserModel } from '@services/types';
import { useIsMobile } from '@src/hooks/useIsMobile';
import { ChatCard } from '@pages/OnlineGame/components/Chat/components/ChatCard';
import { ChatMobile } from '@pages/OnlineGame/components/Chat/components/ChatMobile';
import { useQuery } from 'react-query';
import { messageService } from '@services/message.service';
import { useSubscription } from '@src/hooks/useSubscription';
import { queryClient } from '@src/queryClient';
import { useSearchParams } from 'react-router-dom';

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

  const [openChatAt, setOpenChatAt] = useState<number>();
  const [searchParams, setSearchParams] = useSearchParams();
  const openChatParam = searchParams.get('chat');

  useSubscription(() =>
    messageService.onRoomMessagesUpdated(game.roomId, (data) => {
      queryClient.setQueryData(['messages', game.roomId], data);
    })
  );

  useEffect(() => {
    if (openChatParam === '1') {
      setOpenChatAt(Date.now());

      searchParams.delete('chat');
      setSearchParams(searchParams);
    }
  }, [openChatParam, searchParams, setSearchParams]);

  const isMobile = useIsMobile();

  const props = { game, user, messages };

  return isMobile ? <ChatMobile {...props} openChatAt={openChatAt} /> : <ChatCard {...props} />;
};

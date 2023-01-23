import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { GameModel, SendMessageInput, UserModel, MessageModel } from '@services/types';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { required } from '@common/form/validators';
import { Flex, Loader } from '@mantine/core';
import {
  SendIcon,
  SendButton,
  MessageInput,
  StyledCard,
  MessagesScrollArea,
  InputWrapper,
  ChatContent,
  LoaderWrapper,
} from '@pages/OnlineGame/components/Chat/components/ChatCard/styled';
import { useMutation } from 'react-query';
import { messageService } from '@services/message.service';
import { Message } from '@pages/OnlineGame/components/Chat/components/ChatCard/components/Message';

export interface ChatCardProps {
  game: GameModel;
  user: UserModel;
  messages?: MessageModel[];
}

export const ChatCard: React.FC<ChatCardProps> = ({ game, user, messages }) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: sendMessage } = useMutation((input: SendMessageInput) =>
    messageService.send(input)
  );

  const scrollToBottom = useCallback(() => {
    messagesContainerRef.current?.scrollTo(0, messagesContainerRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (!messages?.length) return;

    scrollToBottom();
  }, [messages, scrollToBottom]);

  const { t } = useTranslation();
  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: required,
    },
  });

  const onSubmit = useCallback(
    async (values: typeof form.values) => {
      form.reset();

      messageInputRef.current?.focus();

      await sendMessage({
        gameId: game.id,
        roomId: game.roomId,
        text: values.message,
        type: 'user',
      });
    },
    [form, game.id, game.roomId, sendMessage]
  );

  const isMessagesDataReady = messages;

  const messagesContent = useMemo(() => {
    return (
      <Flex direction="column" gap="xs">
        {messages?.map((message) => (
          <Message key={message.id} message={message} isOwnUser={message.senderId === user.id} />
        ))}
      </Flex>
    );
  }, [messages, user.id]);

  return (
    <StyledCard title={t('chat.title')}>
      <ChatContent>
        {isMessagesDataReady ? (
          <MessagesScrollArea viewportRef={messagesContainerRef} type="hover" scrollbarSize={8}>
            {messagesContent}
          </MessagesScrollArea>
        ) : (
          <LoaderWrapper>
            <Loader variant="dots" />
          </LoaderWrapper>
        )}

        <InputWrapper>
          <form noValidate onSubmit={form.onSubmit(onSubmit)}>
            <Flex gap="xs">
              <MessageInput
                ref={messageInputRef}
                required
                placeholder={t('chat.messagePlaceholder')}
                {...form.getInputProps('message')}
                error={undefined}
              />

              <SendButton variant="filled" type="submit" radius="xl">
                <SendIcon />
              </SendButton>
            </Flex>
          </form>
        </InputWrapper>
      </ChatContent>
    </StyledCard>
  );
};

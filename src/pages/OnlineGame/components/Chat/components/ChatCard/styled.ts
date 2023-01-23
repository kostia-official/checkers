import styled from 'styled-components';
import { IconSend } from '@tabler/icons';
import { Button, TextInput, ScrollArea } from '@mantine/core';
import { SimpleCard } from '@components/SimpleCard';

export const StyledCard = styled(SimpleCard)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatContent = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const MessagesScrollArea = styled(ScrollArea)`
  flex: 1 1 auto;
  overflow-y: scroll;
` as typeof ScrollArea;

export const InputWrapper = styled.div`
  font: 0 0 40px;
  align-self: flex-end;
  width: 100%;
  margin-top: 12px;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const MessageInput = styled(TextInput)`
  flex: 1 1 auto;
`;

export const SendIcon = styled(IconSend)`
  transform: rotate(45deg);
  position: relative;
  left: -2px;
`;

export const SendButton: typeof Button = styled(Button)`
  width: 38px;
  border-radius: 50%;
  padding: 0;
`;

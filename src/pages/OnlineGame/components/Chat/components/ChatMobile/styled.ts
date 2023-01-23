import styled from 'styled-components';
import { Popover, ActionIcon } from '@mantine/core';

export const ChatButtonWrapper = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 300;
`;

export const ChatCardWrapper = styled.div`
  width: 100%;
  height: 40vh;
`;

export const ChatActionIcon: typeof ActionIcon = styled(ActionIcon)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export const PopoverDropdown = styled(Popover.Dropdown)`
  padding: 0;
`;

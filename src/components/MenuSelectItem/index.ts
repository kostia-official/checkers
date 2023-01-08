import { ExtendProps } from '@common/utilTypes';
import { Menu } from '@mantine/core';
import styled from 'styled-components';

export interface MenuSelectItemProps {
  selected: boolean;
}

export const MenuSelectItem: ExtendProps<typeof Menu.Item, MenuSelectItemProps> = styled(
  Menu.Item
)<MenuSelectItemProps>`
  font-weight: ${(p) => (p.selected ? 'bold' : 'inherit')};
`;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu } from '@mantine/core';
import { Wrapper } from './styled';
import { MenuSelectItem } from '@components/MenuSelectItem';
import { IconChevronDown } from '@tabler/icons';
import { Lang } from '@src/lang/i18n';

const shortLabelMap: Record<Lang, string> = {
  en: 'ENG',
  ua: 'УКР',
};

export const LangSelect: React.FC = () => {
  const { i18n } = useTranslation();
  const resolvedLang: Lang = (i18n.resolvedLanguage as Lang) || 'en';

  return (
    <Wrapper>
      <Menu transition="pop" position="bottom-end">
        <Menu.Target>
          <Button variant="subtle" rightIcon={<IconChevronDown size={20} />}>
            {shortLabelMap[resolvedLang]}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <MenuSelectItem onClick={() => i18n.changeLanguage('en')} selected={resolvedLang === 'en'}>
            English
          </MenuSelectItem>
          <MenuSelectItem onClick={() => i18n.changeLanguage('ua')} selected={resolvedLang === 'ua'}>
            Українська
          </MenuSelectItem>
        </Menu.Dropdown>
      </Menu>
    </Wrapper>
  );
};

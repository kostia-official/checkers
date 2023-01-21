import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu } from '@mantine/core';
import { Wrapper } from './styled';
import { MenuSelectItem } from '@components/MenuSelectItem';
import { IconChevronDown } from '@tabler/icons';
import { Lang } from '@src/lang/types';
import { useMutation, useQuery } from 'react-query';
import { userService } from '@services/user.service';
import { UpdateUserInput } from '@services/types';
import { queryClient } from '@src/queryClient';

const shortLabelMap: Record<Lang, string> = {
  en: 'ENG',
  ua: 'УКР',
};

export const LangSelect: React.FC = () => {
  const { i18n } = useTranslation();
  const resolvedLang: Lang = (i18n.resolvedLanguage as Lang) || 'en';

  const { data: user } = useQuery('currentUser', () => userService.getCurrent());
  const { mutateAsync: updateUser } = useMutation((input: UpdateUserInput) => userService.update(input));

  useEffect(() => {
    if (user && !user.language) {
      updateUser({ language: resolvedLang });
    }
  }, [resolvedLang, updateUser, user, user?.language]);

  const changeLanguage = async (lang: Lang) => {
    await i18n.changeLanguage(lang);

    const updatedUser = await updateUser({ language: lang });
    queryClient.setQueryData('currentUser', updatedUser);
  };

  return (
    <Wrapper>
      <Menu transition="pop" position="bottom-end">
        <Menu.Target>
          <Button variant="subtle" rightIcon={<IconChevronDown size={20} />}>
            {shortLabelMap[resolvedLang]}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <MenuSelectItem onClick={() => changeLanguage('en')} selected={resolvedLang === 'en'}>
            English
          </MenuSelectItem>
          <MenuSelectItem onClick={() => changeLanguage('ua')} selected={resolvedLang === 'ua'}>
            Українська
          </MenuSelectItem>
        </Menu.Dropdown>
      </Menu>
    </Wrapper>
  );
};

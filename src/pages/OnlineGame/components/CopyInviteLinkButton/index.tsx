import React from 'react';
import { Button, Tooltip, Text } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons';
import { useTranslation } from 'react-i18next';

export const CopyInviteLinkButton: React.FC = () => {
  const clipboard = useClipboard();
  const { t } = useTranslation();

  return (
    <Tooltip
      label={<Text align="center">{t('onlineMenu.copyLink.copyLinkTooltip')}</Text>}
      offset={5}
      position="bottom"
      transition="slide-down"
      color="dark.3"
      opened={clipboard.copied}
    >
      <Button
        rightIcon={clipboard.copied ? <IconCheck size={20} stroke={1.5} /> : <IconCopy size={20} stroke={1.5} />}
        styles={{
          root: { paddingRight: 14 },
          rightIcon: { marginLeft: 22 },
        }}
        size="sm"
        color="teal.6"
        onClick={() => clipboard.copy(window.location.href)}
      >
        {t('onlineMenu.copyLink.buttonLabel')}
      </Button>
    </Tooltip>
  );
};

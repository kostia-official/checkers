import { MantineThemeOverride, DEFAULT_THEME } from '@mantine/core';

export const theme: MantineThemeOverride = {
  ...DEFAULT_THEME,
  colorScheme: 'light',
  primaryColor: 'dark',
  colors: {
    darkest: [
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
      '#1A1B1E',
    ],
  },
  primaryShade: 4,
  defaultRadius: 20,
  loader: 'dots',
  components: {
    Notification: {
      styles: {
        description: {
          fontSize: '16px',
        },
      },
    },
    Button: {
      styles: (theme) => ({
        root: {
          ':disabled': {
            backgroundColor: theme.colors.dark[3],
          },
          '&[data-loading]:before': {
            backgroundColor: 'rgba(255, 255, 255, .2)',
          },
        },
      }),
    },
  },
};

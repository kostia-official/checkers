import { MantineThemeOverride, DEFAULT_THEME } from '@mantine/core';

export const theme: MantineThemeOverride = {
  ...DEFAULT_THEME,
  colorScheme: 'light',
  primaryColor: 'coolBlack',
  colors: {
    coolBlack: [
      '#DEE2E6',
      '#CED4DA',
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40', // default shade 6
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
    ],
  },
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

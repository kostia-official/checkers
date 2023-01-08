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
};

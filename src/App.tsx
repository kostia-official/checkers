import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ThemeProvider } from 'styled-components';
import { router } from './router';
import { theme } from './theme';
import { queryClient } from './queryClient';
import { LangSelect } from '@components/LangSelect';
import { NotificationsProvider } from '@mantine/notifications';

export const App: React.FC = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <ThemeProvider theme={theme}>
        <NotificationsProvider position="bottom-center">
          <ModalsProvider>
            <QueryClientProvider client={queryClient}>
              <LangSelect />

              <RouterProvider router={router} />
            </QueryClientProvider>
          </ModalsProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </MantineProvider>
  );
};

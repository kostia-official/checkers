import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { router } from './router';
import { theme } from './theme';
import { queryClient } from './queryClient';

export const App: React.FC = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

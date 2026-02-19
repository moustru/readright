import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;

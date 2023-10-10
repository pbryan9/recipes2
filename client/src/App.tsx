import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './utils/trpc';
import { Outlet } from 'react-router-dom';

import RecipesContextProvider from './utils/context/RecipesContextProvider';

import Navbar from './components/Navbar';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RecipesContextProvider>
          <div className='h-screen w-screen overflow-y-hidden'>
            <Navbar />
            <Outlet />
          </div>
        </RecipesContextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

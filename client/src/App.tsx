import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './utils/trpc';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function TestAppContent() {
  const recipesQuery = trpc.getAllRecipes.useQuery();

  return (
    <div>
      {recipesQuery.data?.map((recipe) => (
        <li key={recipe.id}>{JSON.stringify(recipe)}</li>
      ))}
    </div>
  );
}

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
        <div className='h-screen w-screen overflow-y-hidden'>
          <Navbar />
          <Outlet />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

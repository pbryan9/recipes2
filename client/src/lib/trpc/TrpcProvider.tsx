import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/react-query';

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = new URL(import.meta.env.VITE_API_URL);

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url,
          fetch(url, options) {
            return fetch(url, { ...options, credentials: 'include' });
          },
          headers() {
            const token = localStorage.getItem('token');
            if (!token) return {};

            return { Authorization: `Bearer ${token}` };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

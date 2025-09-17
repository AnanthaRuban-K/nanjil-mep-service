// apps/frontend/src/app/ClientProviders.tsx - FIXED VERSION
'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../providers/AuthProvider';

// Create a single instance to avoid creating new clients on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Avoid refetching immediately on window focus in development
      refetchOnWindowFocus: false,
      // Reduce retries to avoid spamming during development
      retry: 1,
      // Cache for 5 minutes
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
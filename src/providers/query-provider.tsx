"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_CACHE } from "@/lib/query-cache-policy";

export function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CACHE.defaultStaleTimeMs,
            gcTime: QUERY_CACHE.defaultGcTimeMs,
            retry: QUERY_CACHE.defaultRetry,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: true,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8_000),
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

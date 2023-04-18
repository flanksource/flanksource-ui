import { QueryClient } from "@tanstack/react-query";

const defaultStaleTime = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: defaultStaleTime
    }
  }
});

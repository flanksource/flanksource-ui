import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const defaultStaleTime = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: defaultStaleTime,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          // Retry timeout errors and network errors with a delay for up to 3 times
          if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
            if (failureCount < 3) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
});

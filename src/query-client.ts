import { QueryClient } from "@tanstack/react-query";
import { toastError } from "./components/Toast/toast";

const defaultStaleTime = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: defaultStaleTime,
      onError: (error) => {
        if (error instanceof Error) {
          toastError(`Something went wrong: ${error.message}`);
        }
      }
    }
  }
});

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import useDetermineAuthSystem, {
  isClerkSatellite
} from "../src/components/Authentication/useDetermineAuthSystem";
import { queryClient } from "../src/query-client";
import "./global.css";

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;

export default function MyApp({ Component, pageProps }: AppProps) {
  const authProvider = useDetermineAuthSystem();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        id="root"
        className="flex flex-col w-screen h-screen overflow-auto"
        suppressHydrationWarning
      >
        {authProvider === "clerk" ? (
          <ClerkProvider
            // change the domain based on whether the app is a satellite, or not
            domain={isClerkSatellite ? "flanksource.io" : "flanksource.com"}
            isSatellite={isClerkSatellite}
            {...(isClerkSatellite ? { signInUrl } : {})}
            {...pageProps}
          >
            <Component {...pageProps} />
          </ClerkProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </div>
    </QueryClientProvider>
  );
}

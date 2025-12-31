import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import useDetermineAuthSystem, {
  isClerkSatellite
} from "../src/components/Authentication/useDetermineAuthSystem";
import { AiChatPopoverProvider } from "../src/components/ai/AiChatPopover";
import { queryClient } from "../src/query-client";
import "./global.css";

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;

export default function MyApp({ Component, pageProps }: AppProps) {
  const authProvider = useDetermineAuthSystem();

  const appContent = (
    <AiChatPopoverProvider>
      <Component {...pageProps} />
    </AiChatPopoverProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div
        id="root"
        className="flex h-screen w-screen flex-col overflow-auto text-sm"
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
            {appContent}
          </ClerkProvider>
        ) : (
          appContent
        )}
      </div>
    </QueryClientProvider>
  );
}

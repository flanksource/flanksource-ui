import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import React from "react";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";
import { queryClient } from "../src/query-client";
import "./global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const authProvider = useDetermineAuthSystem();

  return (
    <QueryClientProvider client={queryClient}>
      <div id="root" suppressHydrationWarning>
        {authProvider === "clerk" ? (
          <ClerkProvider {...pageProps}>
            <Component {...pageProps} />
          </ClerkProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </div>
    </QueryClientProvider>
  );
}

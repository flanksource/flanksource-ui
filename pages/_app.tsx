import React from "react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import "./global.css";
import { queryClient } from "../src/query-client";
import Head from "next/head";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";
import { ClerkProvider } from "@clerk/nextjs";

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

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import React from "react";
import { Toaster } from "react-hot-toast";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";
import SetupIntercom from "../src/components/Intercom/SetupIntercom";
import { queryClient } from "../src/query-client";
import "./global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const authProvider = useDetermineAuthSystem();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      <SetupIntercom>
        <div
          id="root"
          className="flex flex-col w-screen h-screen overflow-auto"
          suppressHydrationWarning
        >
          {authProvider === "clerk" ? (
            <ClerkProvider {...pageProps}>
              <Component {...pageProps} />
            </ClerkProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </SetupIntercom>
    </QueryClientProvider>
  );
}

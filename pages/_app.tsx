import React from "react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import "./global.css";
import { queryClient } from "../src/query-client";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div id="root" suppressHydrationWarning>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}

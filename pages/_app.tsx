import React from "react";
import type { AppProps } from "next/app";
import "./global.css";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div id="root" suppressHydrationWarning>
      <Component {...pageProps} />
    </div>
  );
}

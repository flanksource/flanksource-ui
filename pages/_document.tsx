import Document, { Head, Html, Main, NextScript } from "next/document";
import { isCanaryUI } from "../src/context/Environment";

export default class MyDocument extends Document {
  render() {
    return (
      <Html style={{ height: "100%" }} lang="en-GB">
        <Head>
          <meta name="theme-color" content="#000000" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            href={isCanaryUI ? "/canary-checker.svg" : "/favicon.svg"}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

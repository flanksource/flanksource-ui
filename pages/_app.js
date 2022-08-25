import "./global.css";

export default function MyApp({ Component, pageProps }) {
  const isBrowser = typeof window !== "undefined";

  console.log(
    `-----------------------------Component root. isBrowser: ${isBrowser} - ${typeof window}`
  );
  return (
    <div id="root" suppressHydrationWarning>
      <Component {...pageProps} />
    </div>
  );
}

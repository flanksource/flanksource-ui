import "./global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div id="root" suppressHydrationWarning>
      <Component {...pageProps} />
    </div>
  );
}

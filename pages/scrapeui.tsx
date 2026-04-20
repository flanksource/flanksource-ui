import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";

const ScrapeUIApp = dynamic(
  () => import("@flanksource-ui/scrapeui/viewer/App").then((m) => m.App),
  { ssr: false }
);

const ScrapeUIPage: NextPage = () => {
  return (
    <>
      <Script
        src="https://code.iconify.design/iconify-icon/2.0.0/iconify-icon.min.js"
        strategy="afterInteractive"
      />
      <ScrapeUIApp />
    </>
  );
};

export default ScrapeUIPage;

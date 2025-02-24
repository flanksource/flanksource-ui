const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/**
 * @type {import('next').NextConfig}
 */
let config = {
  productionBrowserSourceMaps: true,
  env: {
    // make the backend URL available to the frontend
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_ACCOUNTS_URL: "https://accounts.flanksource.com",
    NEXT_PUBLIC_SENTRY_HOST: "https://1db3b3bbf111cafee19c4e7827a4b601@o4508810638589952.ingest.de.sentry.io",
    NEXT_PUBLIC_SENTRY_PROJECT_ID: "4508810640162896",
    NEXT_PUBLIC_SENTRY_DSN: process.env.SENTRY_DSN || "https://1db3b3bbf111cafee19c4e7827a4b601@o4508810638589952.ingest.de.sentry.io/4508810640162896",
  },
  redirects: async () => {
    if (process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER") {
      return [];
    }
    // Redirect early, for a better user experience
    return [
      {
        source: "/config/:path*",
        destination: "/catalog/:path*",
        permanent: true
      },
      {
        source: "/settings/notifications/:path*",
        destination: "/notifications/:path*",
        permanent: true
      },
      {
        source: "/notifications/silence",
        destination: "/notifications/silences/add",
        permanent: true
      }
    ];
  },
  async rewrites() {
    // if clerk is enabled, we will use next API routes to proxy requests to
    // the backend
    if (process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true") {
      return [];
    }

    // Read at build time. See Dockerfile for deployment related steps.
    const backendURL = process.env.BACKEND_URL || "http://localhost:3000/";
    const isCanary =
      process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
    const canaryPrefix = isCanary ? "" : "/canary";
    const LOCALHOST_ENV_URL_REWRITES = [
      {
        source: "/api/:path*",
        destination: `${backendURL}/api/:path*`
      }
    ];

    const URL_REWRITES = [
      {
        source: "/api/canary/:path*",
        destination: `${backendURL}/${canaryPrefix}/:path*`
      },
      {
        source: "/api/.ory/:path*",
        destination: `${backendURL}/kratos/:path*`
      },
      // All other API requests are proxied to the backend on the same path
      // as the request.
      {
        source: "/api/:path*",
        destination: `${backendURL}/:path*`
      }
    ];
    // NODE_ENV is set to "development" when running locally, so we can use it
    // to determine if we are running in a local environment.
    const rewrites = ["localhost", "netlify", "development"].includes(
      process.env.ENV || process.env.NODE_ENV
    )
      ? LOCALHOST_ENV_URL_REWRITES
      : URL_REWRITES;

    return rewrites;
  },
  // https://github.com/vercel/next.js/tree/canary/examples/with-docker#in-existing-projects
  ...(process.env.NEXT_STANDALONE_DEPLOYMENT === "true"
    ? {
      output: "standalone"
    }
    : {}),
  experimental: {
    // increase the default timeout for the proxy from 30s to 10m to allow for
    // long running requests to the backend
    proxyTimeout: 1000 * 60 * 10,
    esmExternals: "loose",
    optimizePackageImports: ["@flanksource/icons"]
  },
  transpilePackages: ["monaco-editor"]
};

config = withBundleAnalyzer(config);



// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  config,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "flanksource",
    project: "flanksource-ui",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: false,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    automaticVercelMonitors: false,
  }
);


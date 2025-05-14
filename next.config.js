const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/**
 * @type {import('next').NextConfig}
 */
const config = {
  productionBrowserSourceMaps: true,
  env: {
    // make the backend URL available to the frontend
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_ACCOUNTS_URL: "https://accounts.flanksource.com"
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

    console.log("Process env");
    console.log(process.env);

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

    return LOCALHOST_ENV_URL_REWRITES;
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

module.exports = withBundleAnalyzer(config);

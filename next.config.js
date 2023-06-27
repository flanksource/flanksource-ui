const withTM = require("next-transpile-modules")(["monaco-editor"]); // pass the modules you would like to see transpiled

/**
 * @type {import('next').NextConfig}
 */
const config = withTM({
  productionBrowserSourceMaps: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async rewrites() {
    // Read at build time. See Dockerfile for deployment related steps.
    const backendURL = process.env.BACKEND_URL || "/";
    const isCanary =
      process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
    const canaryPrefix = isCanary ? "" : "/canary";
    const LOCALHOST_ENV_URL_REWRITES = [
      {
        source: "/api/.ory/:path*",
        destination: `${backendURL}/kratos/:path*`
      },
      {
        source: "/api/:path*",
        destination: `${backendURL}/:path*`
      }
    ];
    const URL_REWRITES = [
      {
        source: "/api/canary/:path*",
        destination: `${backendURL}${canaryPrefix}/:path*`
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
    return ["localhost", "netlify"].includes(process.env.ENV)
      ? LOCALHOST_ENV_URL_REWRITES
      : URL_REWRITES;
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
    proxyTimeout: 1000 * 60 * 10
  }
});

module.exports = config;

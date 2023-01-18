/**
 * @type {import('next').NextConfig}
 */
const config = {
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
        source: "/api/db/:path*",
        destination: `${backendURL}/api/incidents_db/:path*`
      },
      {
        source: "/api/:path*",
        destination: `${backendURL}/api/:path*`
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
    : {})
};

module.exports = config;

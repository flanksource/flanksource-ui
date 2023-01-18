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
        source: "/api/configs_db/:path*",
        destination: `${backendURL}/config/db/:path*`
      },
      {
        source: "/api/canary/:path*",
        destination: `${backendURL}${canaryPrefix}/:path*`
      },
      {
        source: "/api/incidents_db/:path*",
        destination: `${backendURL}/db/:path*`
      },
      {
        source: "/api/db/:path*",
        destination: `${backendURL}/db/:path*`
      },
      {
        source: "/api/.ory/:path*",
        destination: `${backendURL}/kratos/:path*`
      },
      {
        source: "/api/apm/search/:path*",
        destination: `${backendURL}/apm/search/:path*`
      },
      {
        source: "/api/auth/:path*",
        destination: `${backendURL}/auth/:path*`
      },
      {
        source: "/api/snapshot/:path*",
        destination: `${backendURL}/snapshot/:path*`
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

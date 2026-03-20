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
    NEXT_PUBLIC_AUDIT_REPORT_URL:
      process.env.NEXT_PUBLIC_AUDIT_REPORT_URL ||
      "https://audit-report.app.flanksource.com",
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
    const isClerkAuth = process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true";
    const isBasicAuth = process.env.NEXT_PUBLIC_AUTH_IS_BASIC === "true";

    // Read at build time. See Dockerfile for deployment related steps.
    const backendURL = process.env.BACKEND_URL || "http://localhost:3000/";
    const isCanary =
      process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
    const canaryPrefix = isCanary ? "" : "/canary";
    // OIDC protocol endpoints are mounted at the root of the backend (matching the
    // issuer URL). These rewrites let the browser reach those endpoints through the
    // Next.js server without authentication interference.
    const OIDC_REWRITES = [
      {
        source: "/.well-known/:path*",
        destination: `${backendURL}/.well-known/:path*`
      },
      { source: "/authorize", destination: `${backendURL}/authorize` },
      {
        source: "/authorize/:path*",
        destination: `${backendURL}/authorize/:path*`
      },
      { source: "/oauth/token", destination: `${backendURL}/oauth/token` },
      {
        source: "/oauth/introspect",
        destination: `${backendURL}/oauth/introspect`
      },
      { source: "/userinfo", destination: `${backendURL}/userinfo` },
      { source: "/revoke", destination: `${backendURL}/revoke` },
      {
        source: "/device_authorization",
        destination: `${backendURL}/device_authorization`
      },
      { source: "/keys", destination: `${backendURL}/keys` },
      { source: "/end_session", destination: `${backendURL}/end_session` },
      // Some clients use /endsession (no underscore) — proxy both.
      { source: "/endsession", destination: `${backendURL}/endsession` },
      // All OIDC sub-routes (login, callback, …)
      { source: "/oidc/:path*", destination: `${backendURL}/oidc/:path*` },
      // MCP transport endpoint
      { source: "/mcp", destination: `${backendURL}/mcp` },
      { source: "/mcp/:path*", destination: `${backendURL}/mcp/:path*` }
    ];

    // clerk and basic auth use next API routes for app endpoints, but OIDC protocol
    // endpoints still need explicit rewrites.
    if (isClerkAuth || isBasicAuth) {
      return OIDC_REWRITES;
    }

    const LOCALHOST_ENV_URL_REWRITES = [
      {
        source: "/api/:path*",
        destination: `${backendURL}/api/:path*`
      },
      ...OIDC_REWRITES
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
      },
      ...OIDC_REWRITES
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
  transpilePackages: ["monaco-editor", "react-gauge-component"]
};

module.exports = withBundleAnalyzer(config);

let config = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async rewrites() {
    return [
      {
        source: "/api/configs_db/:path*",
        destination:
          "https://incident-commander.canary.lab.flanksource.com/config/db/:path*"
      },
      {
        source: "/api/canary/:path*",
        destination:
          "https://incident-commander.canary.lab.flanksource.com/canary/:path*"
      },
      {
        source: "/api/incidents_db/:path*",
        destination:
          "https://incident-commander.canary.lab.flanksource.com/db/:path*"
      },
      {
        source: "/api/apm/search/:path*",
        destination:
          "https://incident-commander.canary.lab.flanksource.com/apm/search/:path*"
      },
      {
        source: "/api/api/:path*",
        destination: "https://canaries.canary.lab.flanksource.com/api/:path*"
      }
    ];
  }
};

if (process.env.NEXT_STANDALONE_DEPLOYMENT === "true") {
  // https://github.com/vercel/next.js/tree/canary/examples/with-docker#in-existing-projects
  config = { ...config, output: "standalone" };
}

module.exports = config;

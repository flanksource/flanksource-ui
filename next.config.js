let base = process.env.BASE_URL;
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
        destination: base + "/config/db/:path*"
      },
      {
        source: "/api/canary/:path*",
        destination: base + "/canary/:path*"
      },
      {
        source: "/api/incidents_db/:path*",
        destination: base + "/db/:path*"
      },
      {
        source: "/api/apm/search/:path*",
        destination: base + "/apm/search/:path*"
      },
      {
        source: "/api/api/:path*",
        destination: base + "/canary/api/:path*"
      }
    ];
  }
};

if (process.env.NEXT_STANDALONE_DEPLOYMENT === "true") {
  // https://github.com/vercel/next.js/tree/canary/examples/with-docker#in-existing-projects
  config = { ...config, output: "standalone" };
}

module.exports = config;

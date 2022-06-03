const { createProxyMiddleware } = require("http-proxy-middleware");

const defaultProxy = "https://incident-commander.canary.lab.flanksource.com";

const proxies = [
  ["/api", "API_PROXY"],
  ["/canary", "CANARY_PROXY"],
  [
    "/config/db",
    "CONFIG_PROXY",
    {
      "^/config/db": ""
    }
  ],
  ["/db", "INCIDENT_COMMANDER_PROXY"]
];

const simpleRequestLogger = (proxyServer, options) => {
  proxyServer.on("proxyReq", (proxyReq, req, res) => {
    console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
  });
};

module.exports = function (app) {
  const { proxy } = require("../package.json");

  proxies.forEach(([path, envVar, rewrite]) => {
    const proxyFromEnv = process.env[envVar];
    const target = proxyFromEnv || proxy || defaultProxy;

    app.use(
      path,
      createProxyMiddleware({
        logLevel: "debug",
        target,
        pathRewrite: proxyFromEnv ? rewrite : null,
        changeOrigin: true,
        plugins: [simpleRequestLogger]
      })
    );
  });
};

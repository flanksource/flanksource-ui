const { createProxyMiddleware  } = require("http-proxy-middleware");
module.exports = function expressMiddleware(router) {
  router.use(
    "/config",
    createProxyMiddleware({
      target: "https://incident-commander.canary.lab.flanksource.com",
      changeOrigin: true
    })
  );
};

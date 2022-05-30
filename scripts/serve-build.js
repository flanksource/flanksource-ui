const http = require("http");
const httpProxy = require("http-proxy");
const statik = require("node-static");
const fs = require("fs");

if (process.env.NODE_ENV !== "development") {
  console.error(
    "This script is only meant for debugging in development environment"
  );
  process.exit(1);
}

const staticDir = `${__dirname}/../build`;
const port = 5050;
const packagePath = `${__dirname}/../package.json`;

const { proxy: proxyTarget } = JSON.parse(fs.readFileSync(packagePath));

const staticServer = new statik.Server(staticDir, { gzip: true });

var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

var server = http.createServer((req, res) => {
  req
    .addListener("end", () => {
      if (!fs.existsSync(`${staticDir}${req.url}`)) {
        console.info(`Proxying "${req.url}" -> ${proxyTarget}`);
        proxy.web(req, res, {
          target: proxyTarget
        });
      } else {
        staticServer.serve(req, res);
      }
    })
    .resume();
});

console.log(`listening on port ${port}`);
server.listen(port);

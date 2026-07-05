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

const appTypes = ["INCIDENT_MANAGER", "CANARY_CHECKER"];

const staticDir = `${__dirname}/../build`;
const port = 5050;
const packagePath = `${__dirname}/../package.json`;
const indexHTMLPath = `${staticDir}/index.html`;
const appDeployment = process.env.APP_DEPLOYMENT;

const { proxy: proxyTarget } = JSON.parse(fs.readFileSync(packagePath));
const indexHTML = fs.readFileSync(indexHTMLPath, { encoding: "utf8" });

const staticServer = new statik.Server(staticDir, { gzip: true });

var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

var server = http.createServer((req, res) => {
  req
    .addListener("end", () => {
      const reqPath = `${staticDir}${req.url}`;

      if (!fs.existsSync(reqPath)) {
        console.info(`Proxying "${req.url}" -> ${proxyTarget}`);
        proxy.web(req, res, {
          target: proxyTarget
        });
      } else if (req.url == "/" || req.url == "/index.html") {
        res.write(indexHTML.replace("__APP_DEPLOYMENT__", appDeployment));
        res.end();
      } else {
        staticServer.serve(req, res);
      }
    })
    .resume();
});

console.log(`listening at http://localhost:${port}`);
server.listen(port);

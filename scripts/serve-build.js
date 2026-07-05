const http = require("http");
const httpProxy = require("http-proxy");
const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "development") {
  console.error(
    "This script is only meant for debugging in development environment"
  );
  process.exit(1);
}

const staticDir = `${__dirname}/../build`;
const port = 5050;
const packagePath = `${__dirname}/../package.json`;
const indexHTMLPath = `${staticDir}/index.html`;
const appDeployment = process.env.APP_DEPLOYMENT;

const { proxy: proxyTarget } = JSON.parse(fs.readFileSync(packagePath));
const indexHTML = fs.readFileSync(indexHTMLPath, { encoding: "utf8" });

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function getStaticFilePath(url) {
  const decodedPath = decodeURIComponent((url || "/").split("?")[0]);
  const filePath = path.resolve(staticDir, `.${decodedPath}`);

  const staticRoot = path.resolve(staticDir);

  if (
    filePath !== staticRoot &&
    !filePath.startsWith(`${staticRoot}${path.sep}`)
  ) {
    return null;
  }

  return filePath;
}

function serveStaticFile(req, res, filePath) {
  const acceptsGzip = req.headers["accept-encoding"]?.includes("gzip");
  const gzipPath = `${filePath}.gz`;
  const pathToServe =
    acceptsGzip && fs.existsSync(gzipPath) ? gzipPath : filePath;
  const ext = path.extname(filePath);

  res.setHeader(
    "Content-Type",
    contentTypes[ext] || "application/octet-stream"
  );

  if (pathToServe === gzipPath) {
    res.setHeader("Content-Encoding", "gzip");
  }

  fs.createReadStream(pathToServe).pipe(res);
}

var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

var server = http.createServer((req, res) => {
  req
    .addListener("end", () => {
      const reqPath = getStaticFilePath(req.url);

      if (!reqPath || !fs.existsSync(reqPath)) {
        console.info(`Proxying "${req.url}" -> ${proxyTarget}`);
        proxy.web(req, res, {
          target: proxyTarget
        });
      } else if (req.url == "/" || req.url == "/index.html") {
        res.write(indexHTML.replace("__APP_DEPLOYMENT__", appDeployment));
        res.end();
      } else {
        serveStaticFile(req, res, reqPath);
      }
    })
    .resume();
});

console.log(`listening at http://localhost:${port}`);
server.listen(port);

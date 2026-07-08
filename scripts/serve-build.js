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

const appTypes = ["INCIDENT_MANAGER", "CANARY_CHECKER"];

const staticDir = path.resolve(__dirname, "../build");
const port = 5050;
const packagePath = path.resolve(__dirname, "../package.json");
const indexHTMLPath = path.join(staticDir, "index.html");
const appDeployment = process.env.APP_DEPLOYMENT ?? "";

const { proxy: proxyTarget } = JSON.parse(fs.readFileSync(packagePath));
const indexHTML = fs.readFileSync(indexHTMLPath, { encoding: "utf8" });

const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

proxy.on("error", (err, req, res) => {
  console.error(`Proxy error for "${req?.url}":`, err.message);

  if (!res || res.headersSent) {
    return;
  }

  res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Bad gateway");
});

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function getPathname(url = "/") {
  return decodeURIComponent(new URL(url, "http://localhost").pathname);
}

function getStaticPath(pathname) {
  const requestedPath = path.resolve(staticDir, `.${pathname}`);

  if (
    requestedPath !== staticDir &&
    !requestedPath.startsWith(`${staticDir}${path.sep}`)
  ) {
    return undefined;
  }

  return requestedPath;
}

function serveFile(req, res, filePath) {
  const acceptsGzip = req.headers["accept-encoding"]?.includes("gzip");
  const gzippedPath = `${filePath}.gz`;
  const responsePath =
    acceptsGzip && fs.existsSync(gzippedPath) ? gzippedPath : filePath;

  res.setHeader(
    "Content-Type",
    contentTypes[path.extname(filePath)] || "application/octet-stream"
  );

  if (responsePath === gzippedPath) {
    res.setHeader("Content-Encoding", "gzip");
  }

  fs.createReadStream(responsePath)
    .on("error", () => {
      res.statusCode = 500;
      res.end("Internal server error");
    })
    .pipe(res);
}

const server = http.createServer((req, res) => {
  let pathname;

  try {
    pathname = getPathname(req.url);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  const reqPath = getStaticPath(pathname);

  if (!reqPath || !fs.existsSync(reqPath)) {
    console.info(`Proxying "${req.url}" -> ${proxyTarget}`);
    proxy.web(req, res, {
      target: proxyTarget
    });
    return;
  }

  if (pathname === "/" || pathname === "/index.html") {
    res.write(indexHTML.replaceAll("__APP_DEPLOYMENT__", appDeployment));
    res.end();
    return;
  }

  serveFile(req, res, reqPath);
});

console.log(`listening at http://localhost:${port}`);
server.listen(port);

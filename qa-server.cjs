const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const cleanRoutes = {
  "/como-jugar": "/como-jugar.html",
  "/sistema-de-valoracion": "/sistema-de-valoracion.html",
  "/legado-y-logros": "/legado-y-logros.html",
  "/preguntas-frecuentes": "/preguntas-frecuentes.html",
  "/privacidad": "/privacidad.html",
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const requested = pathname === "/" ? "/index.html" : cleanRoutes[pathname] ?? pathname;
  const filePath = path.resolve(root, `.${requested}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] ?? "application/octet-stream" });
    response.end(data);
  });
}).listen(8765, "127.0.0.1");

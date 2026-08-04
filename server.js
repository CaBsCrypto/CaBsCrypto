/**
 * CabsCrypto - Pure Node.js Static HTTP Server
 * Path: server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function getMimeType(filePath) {
  if (!filePath) return 'application/octet-stream';
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function isPathTraversal(requestedPath) {
  if (!requestedPath) return false;
  const resolved = path.resolve(ROOT_DIR, requestedPath.replace(/^\/+/, ''));
  return !resolved.startsWith(ROOT_DIR);
}

function handleRequest(req, res) {
  // Restrict methods to GET and HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('405 Method Not Allowed');
    return;
  }

  // Parse and normalize URL path
  let safePath = (req.url || '/').split('?')[0].split('#')[0];
  try {
    safePath = decodeURIComponent(safePath);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request');
    return;
  }

  // Security check: path traversal in URL
  if (safePath.includes('..')) {
    const resolvedPath = path.resolve(ROOT_DIR, safePath.replace(/^\/+/, ''));
    if (!resolvedPath.startsWith(ROOT_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }
  }

  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const relativePath = safePath.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT_DIR, relativePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const contentType = getMimeType(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const readStream = fs.createReadStream(filePath);
    readStream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('500 Internal Server Error');
    });
    readStream.pipe(res);
  });
}

const server = http.createServer(handleRequest);

module.exports = {
  server,
  handleRequest,
  getMimeType,
  isPathTraversal,
  PORT,
  MIME_TYPES
};

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[CabsCrypto Server] Running at http://localhost:${PORT}/`);
  });
}

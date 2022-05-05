const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const isPathnameCorrect = (pathname) => {
  return pathname && typeof pathname === 'string' && !pathname.includes('/');
};

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (!isPathnameCorrect(pathname)) {
    res.statusCode = 400;
    res.end('Error: pathname is not correct');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const fsStream = fs.createReadStream(filepath);

      fsStream.pipe(res);

      fsStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Error: file not found');
        } else {
          res.statusCode = 500;
          res.end('Error: something goes wrong');
        }
      });

      req.on('aborted', () => {
        fsStream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {isPathnameCorrect, createResponseHandler} = require('../utils');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const responseHandler = createResponseHandler(res);

  if (!isPathnameCorrect(pathname)) {
    responseHandler(400, 'Error: pathname is not correct');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const fsStream = fs.createReadStream(filepath);

      fsStream.pipe(res);

      fsStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          responseHandler(404, 'Error: file not found');
        } else {
          responseHandler(500, 'Error: something goes wrong');
        }
      });

      req.on('aborted', () => {
        fsStream.destroy();
      });

      break;

    default:
      responseHandler(501, 'Not implemented');
  }
});

module.exports = server;

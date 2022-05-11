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
    case 'DELETE':
      fs.unlink(filepath, (error) => {
        if (!error) {
          return responseHandler(200, 'File has been deleted');
        }

        if (error.code === 'ENOENT') {
          return responseHandler(404, 'Error: file not found');
        }

        return responseHandler(500, 'Error: something goes wrong');
      });

      break;

    default:
      responseHandler(501, 'Not implemented');
  }
});

module.exports = server;

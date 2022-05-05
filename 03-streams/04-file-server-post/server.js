const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const {isPathnameCorrect, createAbortCreating, createResponseHandler} = require('../utils');

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
    case 'POST':
      const fsStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitedStream = new LimitSizeStream({limit: 1000000});

      const abortCreating = createAbortCreating(fsStream, filepath);

      req.pipe(limitedStream).pipe(fsStream);

      fsStream.on('finish', () => {
        responseHandler(201, 'Success');
      });

      fsStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          responseHandler(409, 'Error: file already exists');
        } else {
          responseHandler(500, 'Error: something goes wrong');
        }
      });
      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          responseHandler(413, 'Error: limit file size exceeded');
        } else {
          responseHandler(500, 'Error: something goes wrong');
        }

        abortCreating();
      });

      req.on('aborted', () => {
        abortCreating();
      });

      break;

    default:
      responseHandler(501, 'Not implemented');
  }
});

module.exports = server;

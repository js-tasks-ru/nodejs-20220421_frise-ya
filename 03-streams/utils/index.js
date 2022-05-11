const fs = require('fs');

const isPathnameCorrect = (pathname) => {
  return pathname && typeof pathname === 'string' && !pathname.includes('/');
};

const createAbortCreating = (stream, filepath) => () => {
  stream.destroy();
  fs.unlink(filepath, () => {});
};

const createResponseHandler = (res) => (code, message) => {
  res.statusCode = code;
  res.end(message);
};

module.exports = {
  isPathnameCorrect,
  createAbortCreating,
  createResponseHandler,
};

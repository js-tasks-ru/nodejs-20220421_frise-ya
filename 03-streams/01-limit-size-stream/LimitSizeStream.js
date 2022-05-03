const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;

    this.fullBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    const chunkBytes = Buffer.byteLength(chunk);

    if (typeof this.limit === 'number' && this.fullBytes + chunkBytes > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.fullBytes += chunkBytes;

      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;

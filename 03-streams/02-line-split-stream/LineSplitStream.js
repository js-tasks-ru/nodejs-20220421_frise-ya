const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;

    this._prevLastRow = null;
  }

  _isLastEOL(rows) {
    return rows[rows.length - 1] === os.EOL;
  }

  _transform(chunk, encoding, callback) {
    const rows = chunk.toString(this.encoding).split(os.EOL);

    if (this._prevLastRow) {
      rows[0] = this._prevLastRow + rows[0];
    }

    if (!this._isLastEOL(rows)) {
      this._prevLastRow = rows.pop();
    }

    rows.forEach((item) => {
      this.push(item);
    });

    callback();
  }

  _flush(callback) {
    if (this._prevLastRow) {
      this.push(this._prevLastRow);
    }

    callback();
  }
}

module.exports = LineSplitStream;

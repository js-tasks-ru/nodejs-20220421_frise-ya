const mongoose = require('mongoose');

const validateObjectId = async (ctx, next) => {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid id');

    return;
  }

  await next();
};

module.exports = validateObjectId;

const mongoose = require('mongoose');

const validateSubcategory = async (ctx, next) => {
  const {subcategory} = ctx.query;

  if (subcategory && !mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'invalid subcategory id');
  }

  await next();
};

module.exports = validateSubcategory;

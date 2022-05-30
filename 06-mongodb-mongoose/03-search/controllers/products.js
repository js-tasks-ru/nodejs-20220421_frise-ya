const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  if (typeof query !== 'string') {
    ctx.throw(404, 'query is invalid');
  }

  const productsData = await Product.find({
    $text: {
      $search: query,
    },
  });

  ctx.body = {products: productsData.map(mapProduct)};
};

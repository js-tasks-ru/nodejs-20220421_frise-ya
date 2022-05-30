const Product = require('../models/Product');
const productParser = require('../parsers/product');


module.exports.productsBySubcategory = async function productsBySubcategory(ctx) {
  const {subcategory} = ctx.query;

  const productsData = await Product.find(subcategory ? {subcategory} : undefined);

  const products = productsData.map((productData) => productParser(productData));

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx) {
  const {id} = ctx.params;

  const productData = await Product.findById(id);

  if (!productData) {
    ctx.throw(404, 'product doesn\'t exist');
  }

  const product = productParser(productData);

  ctx.body = {product};
};


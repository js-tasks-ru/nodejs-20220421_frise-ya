const productParser = (productData) => {
  if (!productData || !productData._id) {
    return productData;
  }

  const {_id: id, title = '', description, price, category, subcategory, images} = productData;

  return {
    id,
    title,
    description,
    price,
    category,
    subcategory,
    images,
  };
};

module.exports = productParser;

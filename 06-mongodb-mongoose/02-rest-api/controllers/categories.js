const Category = require('../models/Category');

const categoryParser = require('../parsers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesData = await Category.find();

  const categories = categoriesData.map((categoryData) => {
    const subcategories = categoryData
        .subcategories
        .map((subcategory) => categoryParser(subcategory));

    const {id, title} = categoryParser(categoryData);

    return {
      id,
      title,
      subcategories,
    };
  });

  ctx.body = {categories};
};

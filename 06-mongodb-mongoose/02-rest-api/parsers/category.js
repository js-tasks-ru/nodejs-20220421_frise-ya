const categoryParser = (categoryData) => {
  if (!categoryData || !categoryData._id) {
    return categoryData;
  }

  const {_id: id, title = ''} = categoryData;

  return {
    id,
    title,
  };
};

module.exports = categoryParser;

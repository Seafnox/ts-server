import db from '../database/dbConnector';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory,
};

async function getCategoryById(id) {
  const Category = db.models.Category;

  const category = await Category.findById(id);

  return mapCategory(category);
}

async function getCategories(userId) {
  const Category = db.models.Category;

  const query = {
    userId,
  };

  const categories = await Category.find(query).sort({title: 1});

  return categories.map((category) => {
    return mapCategory(category);
  });
}

async function addCategory(userId, categoryData) {
  const Category = db.models.Category;

  categoryData.userId = userId;

  const category = await Category.create(categoryData);

  return mapCategory(category);
}

async function updateCategory(categoryData) {
  const Category = db.models.Category;

  const category = await Category.findOne({_id: categoryData.id});

  if (!category) { return; }

  category.title = categoryData.title;
  category.description = categoryData.description;

  const result = await category.save();

  return mapCategory(result);
}

async function removeCategory(id) {
  const Category = db.models.Category;

  return await Category.remove({_id: id});
}

// helper methods

function mapCategory(category) {
  category._doc.id = category._id;

  return category;
}

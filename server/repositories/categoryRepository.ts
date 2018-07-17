import db from '../database/dbConnector';
import { ICategory } from '../database/models/category';

export default {
    getCategoryById,
    getCategories,
    addCategory,
    updateCategory,
    removeCategory,
};

async function getCategoryById(id: string) {
    const Category = db.models.Category;

    return await Category.findById(id);
}

async function getCategories(userId: string) {
    const Category = db.models.Category;

    const query = {
        userId,
    };

    return await Category.find(query).sort({title: 1});
}

async function addCategory(userId: string, categoryData: ICategory) {
    const Category = db.models.Category;

    categoryData.userId = userId;

    return await Category.create(categoryData);
}

async function updateCategory(categoryData: ICategory) {
    const Category = db.models.Category;

    const category = await Category.findOne({_id: categoryData.id});

    if (!category) {
        return null;
    }

    category.title = categoryData.title;
    category.description = categoryData.description;

    return await category.save();
}

async function removeCategory(id: string) {
    const Category = db.models.Category;

    return await Category.remove({_id: id});
}

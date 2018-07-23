import * as bcrypt from 'bcrypt-nodejs';
import * as fs from 'fs-extra';
import path from '../../helpers/pathHelper';
import { CategoryModel } from '../models/category';
import { UserModel } from '../models/user';

export default {
    seedData,
};

async function seedData() {
    const seedPath = path.getDataRelative('seed/seedData.json');
    const _seedData = await fs.readJson(seedPath);

    const userLookup = await seedUsers(_seedData.users);
    const categoriesLookup = await seedCategories(_seedData.categories);
}

async function seedUsers(usersData) {
    const userLookup = {};

    const User = UserModel;

    await User.remove({});

    for (const user of usersData) {
        const localProfile = user.profile.local;

        localProfile.password = bcrypt.hashSync(localProfile.password, bcrypt.genSaltSync(8));

        const userModel = await User.create(user);

        userLookup[user.id] = userModel._id;
    }

    return userLookup;
}

async function seedCategories(categoryData) {
    const categoryLookup = {};

    const Category = CategoryModel;

    await Category.remove({});

    for (const category of categoryData) {

        const categoryModel = await Category.create(category);

        categoryLookup[category.id] = categoryModel._id;
    }

    return categoryLookup;
}

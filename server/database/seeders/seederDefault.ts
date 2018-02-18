import * as bcrypt from 'bcrypt-nodejs';
import * as fs from 'fs-extra';

import path from '../../helpers/pathHelper';

export default {
  seedData,
};

async function seedData(db) {
  const seedPath = path.getDataRelative('seed/seedData.json');
  const _seedData = await fs.readJson(seedPath);

  const userLookup = await seedUsers(db, _seedData.users);
  await seedCategories(db, _seedData.categories, userLookup);
}

async function seedUsers(db, usersData) {
  const userLookup = {};

  const User = db.models.User;

  await User.remove();

  for (const user of usersData) {
    const localProfile = user.profile.local;

    localProfile.password = bcrypt.hashSync(localProfile.password, bcrypt.genSaltSync(8), null);

    const userModel = await User.create(user);

    userLookup[user.id] = userModel._id;
  }

  return userLookup;
}

async function seedCategories(db, categoryData, userLookup) {
  const categoryLookup = {};

  const Category = db.models.Category;

  await Category.remove();

  for (const category of categoryData) {
    category.userId = userLookup[category.userId];

    const categoryModel = await Category.create(category);

    categoryLookup[category.id] = categoryModel._id;
  }

  return categoryLookup;
}

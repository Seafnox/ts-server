import * as Joi from 'joi';

import AppError from '../appError';
import helper from './_controllerHelper';
import userRepository from '../repositories/userRepository';
import categoryRepository from '../repositories/categoryRepository';

export default {
  currentUser,
  categoryList,
  saveCategory,
  deleteCategory,
};

async function currentUser(req, res) {
  try {
    const userId = helper.getCurrentUser(req)._id;

    const user = await userRepository.getUserById(userId);

    return helper.sendData(user, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function categoryList(req, res) {
  try {
    const userId = helper.getCurrentUser(req)._id;

    const records = await categoryRepository.getCategories(userId);

    return helper.sendData(records, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function saveCategory(req, res) {
  try {
    const data = await helper.loadSchema(req.body, {
      category: Joi.object().keys({
        id: Joi.string().allow(null),
        title: Joi.string().required(),
        description: Joi.string().required(),
      }),
    });

    const userId = helper.getCurrentUser(req)._id;

    let category = null;

    if (data.category.id) {
      await assertUserOwnsCategory(userId, data.category.id);

      category = await categoryRepository.updateCategory(data.category);
    } else {
      category = await categoryRepository.addCategory(userId, data.category);
    }

    return helper.sendData(category, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function deleteCategory(req, res) {
  try {
    const data = await helper.loadSchema(req.params, {
      id: Joi.string().required(),
    });

    await assertUserOwnsCategory(helper.getCurrentUser(req)._id, data.id);

    await categoryRepository.removeCategory(data.id);

    return helper.sendData({}, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function assertUserOwnsCategory(userId, categoryId) {
  const category = await categoryRepository.getCategoryById(categoryId);

  const hasRights = category && category.userId.toString() === userId;

  if (!hasRights) { throw new AppError('User does not own category'); }
}

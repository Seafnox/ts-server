import { find } from 'lodash';
import { randomBytes } from 'crypto';

import db from '../database/dbConnector';
import AppError from '../appError';

export default {
  getUserByEmail,
  getLocalUserByEmail,
  saveLocalAccount,
  getUserById,
  getUsers,
  getUserByActivationToken,
  refreshActivationToken,
  activateUser,
  updateUser,
  removeUser,
  resetPassword,
  updateUserPassword,
  getUserByResetToken,
  refreshResetToken,
};

async function getUserByEmail(email) {
  const User = db.models.User;

  return await User.findOne({email});
}

async function getLocalUserByEmail(email: string) {
  const user = await getUserByEmail(email);

  const noLocalProfile = !user || !user.profile.local;

  if (noLocalProfile) { return null; }

  return user;
}

async function saveLocalAccount(user, userData) {
  const User = db.models.User;

  const localProfile: any = {};

  localProfile.firstName = userData.firstName;
  localProfile.lastName = userData.lastName;
  localProfile.email = userData.email;
  localProfile.password = new User().generateHash(userData.password);

  const activationToken = generateActivationToken();
  localProfile.activation = {
    token: activationToken,
    created: new Date(),
  };

  localProfile.isActivated = false;

  if (user) {
    user.email = userData.email;
    user.profile.local = localProfile;

    return await user.save();
  } else {
    return await User.create({
      email: userData.email,
      profile: {
        local: localProfile,
      },
    });
  }
}

async function getUserById(id) {
  const User = db.models.User;

  return await User.findById(id);
}

async function getUsers() {
  const User = db.models.User;

  return await User.find();
}

async function getUserByActivationToken(token: string) {
  const users = await getUsers();

  const findUser = find(users, (user: any) => {
    return user.profile.local && user.profile.local.activation.token === token;
  });

  return findUser;
}

async function refreshActivationToken(userId: number) {
  const user = await getUserById(userId);

  if (!user) { throw new AppError(''); }

  user.profile.local.activation = {
    token: generateActivationToken(),
    created: new Date().toString(),
  };

  return await user.save();
}

async function activateUser(userId: number) {
  const user = await getUserById(userId);

  if (!user) { throw new AppError('User not found.'); }

  user.profile.local.activation = undefined;
  user.profile.local.isActivated = true;

  return await user.save();
}

async function updateUser(userData) {
  const user = await getUserByEmail(userData.email.toLowerCase());

  if (!user) { return; }

  user.firstName = userData.firstName;
  user.lastName = userData.lastName;

  return await user.save();
}

async function removeUser(id) {
  const User = db.models.User;

  return await User.remove({_id: id});
}

async function resetPassword(userId: number) {
  const user = await getUserById(userId);

  if (!user) { throw new AppError('Cannot find user by Id'); }

  user.profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString(),
  };

  return await user.save();
}

async function updateUserPassword(userId: number, password: string) {
  const user = await getUserById(userId);

  if (!user) { throw new AppError('Cannot find user'); }

  user.profile.local.reset = undefined;
  user.profile.local.password = user.generateHash(password);

  return await user.save();
}

async function getUserByResetToken(token: string) {
  const users = await getUsers();

  const findUser = find(users, (user: any) => {
    return user.profile.local && user.profile.local.reset.token === token;
  });

  return findUser;
}

async function refreshResetToken(userId: number) {
  const user = await getUserById(userId);

  if (!user) { throw new AppError('Cannot find user'); }

  user.profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString(),
  };

  return await user.save();
}

function generateActivationToken(): string {
  const token = randomBytes(32).toString('hex');
  return token;
}

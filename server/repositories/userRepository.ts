import { find } from 'lodash';
import { randomBytes } from 'crypto';
import db from '../database/dbConnector';
import AppError from '../appError';
import { IUser, IUserLocalProfile } from '../database/models/user';

export default {
    getUserByEmail,
    getLocalUserByEmail,
    saveLocalAccount,
    getUserById,
    getUsers,
    getUserByActivationToken,
    refreshActivationToken,
    activateUser,
    removeUser,
    resetPassword,
    updateUserPassword,
    getUserByResetToken,
    refreshResetToken,
};

async function getUserByEmail(email: string) {
    const User = db.models.User;

    return await User.findOne({email});
}

async function getLocalUserByEmail(email: string) {
    const user = await getUserByEmail(email);

    const noLocalProfile = !user || !user.profile.local;

    if (noLocalProfile) {
        return null;
    }

    return user;
}

async function saveLocalAccount(user: IUser, userData: IUserLocalProfile) {
    const User = db.models.User;
    const activationToken = generateActivationToken();

    const localProfile: IUserLocalProfile = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: new User().generateHash(userData.password),
        isActivated: false,
        activation: {
            token: activationToken,
            created: new Date().toString(),
        },
    };

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

async function getUserById(id: string) {
    const User = db.models.User;

    return await User.findById(id);
}

async function getUsers() {
    const User = db.models.User;

    return await User.find();
}

async function getUserByActivationToken(token: string) {
    const users = await getUsers();

    return find(users, (user: IUser) => {
        return user.profile.local && user.profile.local.activation.token === token;
    });
}

async function refreshActivationToken(userId: string) {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError('');
    }

    user.profile.local.activation = {
        token: generateActivationToken(),
        created: new Date().toString(),
    };

    return await user.save();
}

async function activateUser(userId: string) {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError('User not found.');
    }

    user.profile.local.activation = undefined;
    user.profile.local.isActivated = true;

    return await user.save();
}

async function removeUser(id: string) {
    const User = db.models.User;

    return await User.remove({_id: id});
}

async function resetPassword(userId: string) {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError('Cannot find user by Id');
    }

    user.profile.local.reset = {
        token: generateActivationToken(),
        created: new Date().toString(),
    };

    return await user.save();
}

async function updateUserPassword(userId: string, password: string) {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError('Cannot find user');
    }

    user.profile.local.reset = undefined;
    user.profile.local.password = user.generateHash(password);

    return await user.save();
}

async function getUserByResetToken(token: string) {
    const users = await getUsers();

    return find(users, (user: IUser) => {
        return user.profile.local && user.profile.local.reset.token === token;
    });
}

async function refreshResetToken(userId: string) {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError('Cannot find user');
    }

    user.profile.local.reset = {
        token: generateActivationToken(),
        created: new Date().toString(),
    };

    return await user.save();
}

function generateActivationToken(): string {
    return randomBytes(32).toString('hex');
}

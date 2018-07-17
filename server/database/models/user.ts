import mongoose = require('mongoose');
import bcrypt = require('bcrypt-nodejs');
import { ModelNames } from '../modelNames.enum';
import { IDictionary } from '../../interfaces/dictionary';

export interface IUser extends mongoose.Document {
    email: string;
    profile: {
        local: IUserLocalProfile,
        google?: IDictionary;
        facebook?: IDictionary;
    };

    generateHash(password: string): string;
}

export interface IUserLocalProfile {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActivated: boolean;
    activation?: {
        token?: string;
        created?: string;
    };
    reset?: {
        token?: string;
        created?: string;
    };
}

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {unique: true},
    },
    profile: {
        local: {
            email: {
                type: String,
                required: true,
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            isActivated: {
                type: Boolean,
                required: true,
                default: false,
            },
            activation: {
                token: {
                    type: String,
                },
                created: {
                    type: Date,
                },
            },
            reset: {
                token: {
                    type: String,
                },
                created: {
                    type: Date,
                },
            },
        },
        google: {},
        facebook: {},
    },
});

// generating a hash
schema.methods.generateHash = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

export const UserModel = mongoose.model<IUser>(ModelNames.User, schema);

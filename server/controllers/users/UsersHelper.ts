import { fromPromise } from 'rxjs/internal-compatibility';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { IUser, IUserLocalProfile, UserModel } from '../../database/models/user';
import { randomBytes } from 'crypto';
import bcrypt = require('bcrypt-nodejs');
import { SchemaLike } from 'joi';
import Joi = require('joi');
import { differenceInHours } from 'date-fns';

const userHelperErrorTexts = {
    NO_USER_FOUND_BY_ID: (userId: string) => `No User found by id: ${userId}`,
    NO_USER_FOUND_BY_ACTIVATION_TOKEN: (token: string) => `No User found by activation token: ${token}`,
    NO_USER_FOUND_BY_RESET_TOKEN: (token: string) => `No User found by reset token: ${token}`,
    NO_USER_LOCAL_PROFILE: (userEmail: string) => `User ${userEmail} have not local profile`,
    TOKEN_TIMEOUT: (userEmail: string) => `Activation token has expired. New activation email was send to ${userEmail}.`,
};

export class UsersHelper {
    public static getUserById(id: string): Observable<IUser> {
        return fromPromise(UserModel.findById(id).exec())
            .pipe(take(1));
    }

    public static getUserByEmail(email: string): Observable<IUser> {
        return fromPromise(UserModel.findOne({email}).exec())
            .pipe(take(1));
    }

    public static getUserByResetToken(token: string): Observable<IUser> {
        return UsersHelper.getUsers().pipe(
            map((users: IUser[]) =>
                users.find((user) =>
                    user.profile.local.reset && user.profile.local.reset.token === token)),
        );
    }

    public static getUserByActivationToken(token: string): Observable<IUser> {
        return UsersHelper.getUsers().pipe(
            map((users: IUser[]) =>
                users.find((user) =>
                    user.profile.local.activation && user.profile.local.activation.token === token)),
        );
    }

    public static getUserLocalProfile(email: string): Observable<IUserLocalProfile> {
        return UsersHelper.getUserByEmail(email).pipe(
            map((user: IUser) => user.profile.local),
        );
    }

    public static getUsers(): Observable<IUser[]> {
        return fromPromise(UserModel.find().sort({email: 1}).exec())
            .pipe(take(1));
    }

    public static addUserByLocalProfile(localProfile: IUserLocalProfile): Observable<IUser> {
        const activationToken = UsersHelper.generateToken();

        const profile: IUserLocalProfile = {
            email: localProfile.email,
            firstName: localProfile.firstName,
            lastName: localProfile.lastName,
            password: UsersHelper.generateHash(localProfile.password),
            isActivated: false,
            activation: {
                token: activationToken,
                created: new Date().toString(),
            },
        };

        // TODO Сделать интерфейс под данные, которые будут расширять основной интерйейс документа
        const userData = {
            email: profile.email,
            profile: {
                local: profile,
            },
        };

        return fromPromise<IUser>(UserModel.create(userData))
            .pipe(take(1));
    }

    public static updateUser(userId: string, localProfile: IUserLocalProfile): Observable<IUser> {
        return UsersHelper.getUserById(userId)
            .pipe(
                switchMap((user: IUser) => {
                    if (!user) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_FOUND_BY_ID(userId)));
                    }

                    if (!user.profile.local) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_LOCAL_PROFILE(user.email)));
                    }

                    user.email = localProfile.email || user.email;
                    user.profile.local = {
                        ...user.profile.local,
                        email: localProfile.email || user.profile.local.email,
                        firstName: localProfile.firstName || user.profile.local.firstName,
                        lastName: localProfile.lastName || user.profile.local.lastName,
                    };

                    return fromPromise<IUser>(user.save());
                }),
                take(1),
            );
    }

    public static refreshActivationToken(userId: string): Observable<IUser> {
        return UsersHelper.getUserById(userId)
            .pipe(
                switchMap((user: IUser) => {
                    if (!user) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_FOUND_BY_ID(userId)));
                    }

                    if (!user.profile.local) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_LOCAL_PROFILE(user.email)));
                    }

                    user.profile.local.activation = {
                        created: new Date().toString(),
                        token: UsersHelper.generateToken(),
                    };

                    return fromPromise<IUser>(user.save());
                }),
                take(1),
            );
    }

    public static refreshResetToken(userId: string): Observable<IUser> {
        return UsersHelper.getUserById(userId)
            .pipe(
                switchMap((user: IUser) => {
                    if (!user) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_FOUND_BY_ID(userId)));
                    }

                    if (!user.profile.local) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_LOCAL_PROFILE(user.email)));
                    }

                    user.profile.local.reset = {
                        created: new Date().toString(),
                        token: UsersHelper.generateToken(),
                    };

                    return fromPromise<IUser>(user.save());
                }),
                take(1),
            );
    }

    public static activateUser(token: string): Observable<IUser> {
        return UsersHelper.getUserByActivationToken(token)
            .pipe(
                switchMap((user: IUser) => {
                    if (!user) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_FOUND_BY_ACTIVATION_TOKEN(token)));
                    }

                    if (!user.profile.local) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_LOCAL_PROFILE(user.email)));
                    }

                    const activationTime = user.profile.local.activation.created;
                    const isTokenExpired = differenceInHours(activationTime, new Date()) > 24;

                    if (isTokenExpired) {
                        return throwError(new Error(userHelperErrorTexts.TOKEN_TIMEOUT(user.email)));
                    }

                    user.profile.local.activation = undefined;
                    user.profile.local.isActivated = true;

                    return fromPromise<IUser>(user.save());
                }),
                take(1),
            );
    }

    public static resetPassword(token: string, password: string): Observable<IUser> {
        return UsersHelper.getUserByResetToken(token)
            .pipe(
                switchMap((user: IUser) => {
                    if (!user) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_FOUND_BY_RESET_TOKEN(token)));
                    }

                    if (!user.profile.local) {
                        return throwError(new Error(userHelperErrorTexts.NO_USER_LOCAL_PROFILE(user.email)));
                    }

                    const activationTime = user.profile.local.reset.created;
                    const isTokenExpired = differenceInHours(activationTime, new Date()) > 24;

                    if (isTokenExpired) {
                        return throwError(new Error(userHelperErrorTexts.TOKEN_TIMEOUT(user.email)));
                    }

                    user.profile.local.reset = undefined;
                    user.profile.local.password = UsersHelper.generateHash(password);

                    return fromPromise<IUser>(user.save());
                }),
                take(1),
            );
    }

    public static removeUser(id: string): Observable<IUser> {
        return fromPromise(UserModel.findOneAndRemove({_id: id}).exec())
            .pipe(take(1));
    }

    public static generateToken(): string {
        return randomBytes(32).toString('hex');
    }

    public static generateHash(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    }

    public static isValidByHash(incoming: string, hash: string): boolean {
        return bcrypt.compareSync(incoming, hash);
    }

    public static get signUpSchema(): SchemaLike {
        return {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
        };
    }

    public static get loginSchema(): SchemaLike {
        return {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        };
    }

    public static get forgotPasswordSchema(): SchemaLike {
        return {
            email: Joi.string().email().required(),
        };
    }

    public static get resetPasswordSchema(): SchemaLike {
        return {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            token: Joi.string().required(),
        };
    }
}

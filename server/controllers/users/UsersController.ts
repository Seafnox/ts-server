import { IAppRequest } from '../../interfaces/AppRequest';
import { UsersHelper } from './UsersHelper';
import { ControllerHelper } from '../_helper/ControllerHelper';
import AppError from '../../appError';
import config from '../../config';
import { sign } from 'jsonwebtoken';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IAppAnswer } from '../../interfaces/ControllerAction';

export class UsersController {
    public static getAll(): Observable<IAppAnswer> {
        return UsersHelper.getUsers().pipe(map((data) => ({data})));
    }

    public static getUser(req: IAppRequest): Observable<IAppAnswer> {
        const userId = req.params.id;
        return UsersHelper.getUserById(userId).pipe(map((data) => ({data})));
    }

    public static getCurrentUser(req: IAppRequest): Observable<IAppAnswer> {
        const userId = req.currentUser._id;

        return UsersHelper.getUserById(userId).pipe(map((data) => ({data})));
    }

    public static signUpPost(req: IAppRequest): Observable<IAppAnswer> {
        if (req.currentUser) {
            throw new AppError('Log out before signing up.');
        }

        const userData = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.signUpSchema);

        if (userData.password !== userData.confirmPassword) {
            throw new AppError('Passwords do not confirmed.');
        }

        // Use lower-case e-mails to avoid case-sensitive e-mail matching
        userData.email = userData.email.toLowerCase();

        return UsersHelper.getUserByEmail(userData.email)
            .pipe(
                switchMap((user) => {
                    if (user) {
                        throw new AppError(`User with email '${userData.email}' already exist`);
                    }

                    return UsersHelper.addUserByLocalProfile(userData);
                }),
                map(() => ({
                    data: {
                        message: 'Activation email was send. Please, check you inbox.',
                        success: true,
                    },
                })),
            );
    }

    public static loginPost(req: IAppRequest): Observable<IAppAnswer> {
        if (req.currentUser) {
            throw new AppError('Log out before login.');
        }

        const userData = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.loginSchema);

        return UsersHelper.getUserByEmail(userData.email.toLowerCase())
            .pipe(
                map((user) => {
                    if (!user || !UsersHelper.isValidByHash(userData.password, user.profile.local.password)) {
                        throw new AppError('The email address or password that you entered is not valid');
                    }

                    if (!user.profile.local.isActivated) {
                        throw new AppError(
                            'Your account is not activated yet.' +
                            ' Please check your email for activation letter or sign up again to get a new one.',
                        );
                    }

                    const dbUserData = user.toObject();
                    const token = sign(dbUserData, config.auth.jwtKey, {
                        expiresIn: config.auth.expiry,
                    });
                    return {
                        token,
                        user: dbUserData,
                    };
                }),
                map((data) => ({data})),
            );
    }

    public static forgotPassword(req: IAppRequest): Observable<IAppAnswer> {
        const data = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.forgotPasswordSchema);

        const email = data.email.toLowerCase();

        return UsersHelper.getUserByEmail(email)
            .pipe(switchMap((user) => UsersHelper.refreshResetToken(user.id)))
            .pipe(map(() => ({
                data: {
                    message: `We've just dropped you an email. Please check your mail to reset your password. Thanks!`,
                    success: true,
                },
            })));
    }

    public static resetPassword(req: IAppRequest): Observable<IAppAnswer> {
        const token = req.params.token;

        return UsersHelper.getUserByResetToken(token)
            .pipe(map((user) => ({
                data: {
                    email: user.email,
                    token,
                },
            })));
    }

    public static resetPasswordPost(req: IAppRequest): Observable<IAppAnswer> {
        const data = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.resetPasswordSchema);

        if (data.password !== data.confirmPassword) {
            throw new AppError('Passwords do not match.');
        }

        return UsersHelper.resetPassword(data.token, data.password)
            .pipe(map(() => ({
                data: {
                    message: 'Your password was reset successfully.',
                    success: true,
                },
            })));
    }

    public static activate(req: IAppRequest): Observable<IAppAnswer> {
        const token = req.params.token;

        return UsersHelper.activateUser(token)
            .pipe(map(() => ({
                data: {
                    message: 'Your account was successfully activated.',
                    success: true,
                },
            })));
    }

}

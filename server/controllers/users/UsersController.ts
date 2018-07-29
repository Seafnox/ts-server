import { IApplicationRequest } from '../../interfaces/ApplicationRequest';
import { Response } from 'express';
import { UsersHelper } from './UsersHelper';
import { ControllerHelper } from '../_helper/ControllerHelper';
import AppError from '../../appError';
import config from '../../config';
import { sign } from 'jsonwebtoken';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

export class UsersController {
    public static getUsers(req: IApplicationRequest, res: Response): void {
        UsersHelper.getUsers()
            .subscribe((users) => ControllerHelper.Instance.sendData(users, res));
    }

    public static getUser(req: IApplicationRequest, res: Response): void {
        const userId = req.params.id;
        UsersHelper.getUserById(userId)
            .subscribe((user) => ControllerHelper.Instance.sendData(user, res));
    }

    public static getCurrentUser(req: IApplicationRequest, res: Response): void {
        const userId = req.currentUser._id;

        UsersHelper.getUserById(userId)
            .subscribe((user) => ControllerHelper.Instance.sendData(user, res));
    }

    public static signUpPost(req: IApplicationRequest, res: Response): void {
        if (req.currentUser) {
            throw new AppError('Log out before signing up.');
        }

        const userData = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.signUpSchema);

        if (userData.password !== userData.confirmPassword) {
            throw new AppError('Passwords do not confirmed.');
        }

        // Use lower-case e-mails to avoid case-sensitive e-mail matching
        userData.email = userData.email.toLowerCase();

        UsersHelper.getUserByEmail(userData.email)
            .pipe(
                switchMap((user) => {
                    if (user) {
                        throw new AppError(`User with email '${userData.email} already exist'`);
                    }

                    return UsersHelper.addUserByLocalProfile(userData);
                }),
            )
            .subscribe(() => {
                const message = 'Activation email was send. Please, check you inbox.';

                return ControllerHelper.Instance.sendData({message}, res);
            });
    }

    public static loginPost(req: IApplicationRequest, res: Response): void {
        if (req.currentUser) {
            throw new AppError('Log out before login.');
        }

        const userData = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.loginSchema);

        UsersHelper.getUserByEmail(userData.email.toLowerCase())
            .subscribe((user) => {
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

                const result = {
                    token,
                    user: dbUserData,
                };

                ControllerHelper.Instance.sendData(result, res);
            });
    }

    public static forgotPassword(req: IApplicationRequest, res: Response): void {
        const data = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.forgotPasswordSchema);

        const email = data.email.toLowerCase();

        UsersHelper.getUserByEmail(email)
            .pipe(switchMap((user) => UsersHelper.refreshResetToken(user.id)))
            .subscribe(() => {
                const message = `We've just dropped you an email. Please check your mail to reset your password. Thanks!`;

                ControllerHelper.Instance.sendData({message}, res);
            });
    }

    public static resetPassword(req: IApplicationRequest, res: Response): void {
        const token = req.params.token;

        UsersHelper.getUserByResetToken(token)
            .subscribe((user) => {
                const data = {
                    email: user.email,
                    token,
                };

                ControllerHelper.Instance.sendData(data, res);
            });
    }

    public static resetPasswordPost(req: IApplicationRequest, res: Response): void {
        const data = ControllerHelper.Instance.loadSchema(req.body, UsersHelper.resetPasswordSchema);

        if (data.password !== data.confirmPassword) {
            throw new AppError('Passwords do not match.');
        }

        UsersHelper.resetPassword(data.token, data.password)
            .subscribe(() => {
                const message = 'Your password was reset successfully.';

                ControllerHelper.Instance.sendData({message}, res);
            });
    }

    public static activate(req: IApplicationRequest, res: Response): void {
        const token = req.params.token;

        UsersHelper.activateUser(token)
            .pipe(catchError((error: Error) => {
                const data = {
                    message: error.toString(),
                    status: 'error',
                };

                ControllerHelper.Instance.sendData(data, res);

                return throwError(error);
            }))
            .subscribe(() => {
                const data = {
                    message: 'Your account was successfully activated.',
                    status: 'success',
                };

                ControllerHelper.Instance.sendData(data, res);
            });
    }

}

import { UsersController } from '../controllers/users/UsersController';
import { CategoriesController } from '../controllers/categories/categoriesController';
import { IRouterHelperConfig } from '../interfaces/RouterHelperConfig';
import { ControllerAction } from '../interfaces/ControllerAction';

enum RouteMethods {
    get = 'get',
    post = 'post',
    put = 'put',
    delete = 'delete',
}

export const RouteConfigs: Record<string, IRouteConfig[]> = {
    categoriesApi: [
        {
            url: '/api/categories',
            method: RouteMethods.get,
            action: CategoriesController.getList,
            options: {auth: false},
        },
        {
            url: '/api/categories/:id',
            method: RouteMethods.get,
            action: CategoriesController.get,
            options: {auth: false},
        },
    ],
    auth: [
        {
            url: '/api/current_user',
            method: RouteMethods.get,
            action: UsersController.getCurrentUser,
        },
        {
            url: '/api/sign_up',
            method: RouteMethods.post,
            action: UsersController.signUpPost,
            options: {auth: false},
        },
        {
            url: '/api/login',
            method: RouteMethods.post,
            action: UsersController.loginPost,
            options: {auth: false},
        },
        {
            url: '/api/password-forgot',
            method: RouteMethods.post,
            action: UsersController.forgotPassword,
            options: {auth: false},
        },
        {
            url: '/api/password-reset/:token',
            method: RouteMethods.get,
            action: UsersController.resetPassword,
            options: {auth: false},
        },
        {
            url: '/api/password-reset/:token',
            method: RouteMethods.post,
            action: UsersController.resetPasswordPost,
            options: {auth: false},
        },
        {
            url: '/api/activate/:token',
            method: RouteMethods.get,
            action: UsersController.activate,
            options: {auth: false},
        },
    ],
    admin_categories: [
        {
            url: '/api/categories',
            method: RouteMethods.post,
            action: CategoriesController.post,
        },
        {
            url: '/api/categories/:id',
            method: RouteMethods.put,
            action: CategoriesController.put,
        },
        {
            url: '/api/categories/:id',
            method: RouteMethods.delete,
            action: CategoriesController.delete,
        },
    ],
};

export interface IRouteConfig {
    url: string;
    method: RouteMethods;
    action: ControllerAction;
    options?: IRouterHelperConfig;
}

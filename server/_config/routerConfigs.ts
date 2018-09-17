import { UsersController } from '../controllers/users/UsersController';
import { CategoriesController } from '../controllers/categories/categoriesController';
import { IRouterHelperConfig } from '../interfaces/RouterHelperConfig';
import { ControllerAction } from '../interfaces/ControllerAction';
import { ProductController } from '../controllers/product/productController';
import { ProductImageController } from '../controllers/product_image/productImageController';

enum RouteMethods {
    get = 'get',
    post = 'post',
    put = 'put',
    delete = 'delete',
}

export interface IRouteConfig {
    url: string;
    method: RouteMethods;
    action: ControllerAction;
    options?: IRouterHelperConfig;
}

export const RouteConfigs: Record<string, IRouteConfig[]> = {
    categoriesApi: [
        {
            url: '/api/categories',
            method: RouteMethods.get,
            action: CategoriesController.getAll,
            options: {auth: false},
        },
        {
            url: '/api/categories/:id',
            method: RouteMethods.get,
            action: CategoriesController.get,
            options: {auth: false},
        },
    ],
    productApi: [
        {
            url: '/api/products',
            method: RouteMethods.get,
            action: ProductController.getAll,
            options: {auth: false},
        },
        {
            url: '/api/products/:id',
            method: RouteMethods.get,
            action: ProductController.get,
            options: {auth: false},
        },
    ],
    productImageApi: [
        {
            url: '/api/product_images/:id',
            method: RouteMethods.get,
            action: ProductImageController.get,
        },
    ],
    usersApi: [
        {
            url: '/api/users',
            method: RouteMethods.get,
            action: UsersController.getAll,
            options: {auth: false},
        },
        {
            url: '/api/users/:id',
            method: RouteMethods.get,
            action: UsersController.getUser,
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
    admin_products: [
        {
            url: '/api/categories/:categoryId/products',
            method: RouteMethods.post,
            action: ProductController.post,
        },
        {
            url: '/api/products',
            method: RouteMethods.post,
            action: ProductController.post,
        },
        {
            url: '/api/products/:id',
            method: RouteMethods.put,
            action: ProductController.put,
        },
        {
            url: '/api/products/:id/addCategory/:categoryId',
            method: RouteMethods.put,
            action: ProductController.addInCategory,
        },
        {
            url: '/api/products/:id/removeCategory/:categoryId',
            method: RouteMethods.put,
            action: ProductController.removeFromCategory,
        },
        {
            url: '/api/products/:id',
            method: RouteMethods.delete,
            action: ProductController.delete,
        },
    ],
    admin_product_images: [
        {
            url: '/api/product_images',
            method: RouteMethods.post,
            action: ProductImageController.post,
        },
        {
            url: '/api/product_images/:id',
            method: RouteMethods.put,
            action: ProductImageController.put,
        },
        {
            url: '/api/product_images/:id',
            method: RouteMethods.delete,
            action: ProductImageController.delete,
        },
    ],
};

import { CategoriesPage } from './categories/categories-page.component';
import { CategoryPage } from './category/category-page.component';
import { ProductPage } from './product/product-page.component';
import { MainPage } from './main-page.component';
import { Routes } from '@angular/router';
import { MainIndexPage } from './main-index/main-index-page.component';

export const mainPageRoutes: Routes = [
    {
        path: 'main',
        component: MainPage,
        children: [
            {
                path: '',
                component: MainIndexPage,
            },
            {
                path: 'categories',
                component: CategoriesPage,
            },
            {
                path: 'products/:productId',
                component: ProductPage,
            },
            {
                path: 'categories/:categoryId',
                component: CategoryPage,
            },
        ]
    },
];

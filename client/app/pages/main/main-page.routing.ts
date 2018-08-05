import { CategoriesPageComponent } from './categories/categories-page.component';
import { CategoryPageComponent } from './category/category-page.component';
import { ProductPageComponent } from './product/product-page.component';
import { MainPageComponent } from './main-page.component';
import { Routes } from '@angular/router';
import { MainIndexPageComponent } from './main-index/main-index-page.component';

export const mainPageRoutes: Routes = [
    {
        path: 'main',
        component: MainPageComponent,
        children: [
            {
                path: '',
                component: MainIndexPageComponent,
            },
            {
                path: 'categories',
                component: CategoriesPageComponent,
            },
            {
                path: 'products/:productId',
                component: ProductPageComponent,
            },
            {
                path: 'categories/:categoryId',
                component: CategoryPageComponent,
            },
        ],
    },
];

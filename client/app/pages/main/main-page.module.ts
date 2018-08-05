import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page.component';
import { ComponentsModule } from '../../components/components.module';
import { WebStorageModule } from 'ngx-store';
import { RouterModule } from '@angular/router';
import { mainPageRoutes } from './main-page.routing';
import { CategoryPageModule } from './category/category-page.module';
import { CategoriesPageModule } from './categories/categories-page.module';
import { ProductPageModule } from './product/product-page.module';
import { MatCardModule, MatToolbarModule } from '@angular/material';
import { MainIndexPageModule } from './main-index/main-index-page.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(mainPageRoutes),
        WebStorageModule,
        ComponentsModule,
        CategoryPageModule,
        CategoriesPageModule,
        ProductPageModule,
        MainIndexPageModule,
        MatToolbarModule,
        MatCardModule,
    ],
    declarations: [MainPageComponent],
})
export class MainPageModule {}

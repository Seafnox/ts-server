import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page.component';
import { RouterModule } from '@angular/router';
import { adminPageRoutes } from './admin-page.routing';
import { DashboardPageModule } from './dashboard/dashboard-page.module';
import { ModelPageModule } from './model/model-page.module';
import { ModelUnitPageModule } from './model-unit/model-unit-page.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(adminPageRoutes),
        DashboardPageModule,
        ModelPageModule,
        ModelUnitPageModule,
    ],
    declarations: [AdminPageComponent],
})
export class AdminPageModule {}

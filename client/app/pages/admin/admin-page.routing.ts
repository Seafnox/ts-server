import { Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { DashboardPageComponent } from './dashboard/dashboard-page.component';
import { ModelPageComponent } from './model/model-page.component';
import { ModelUnitPageComponent } from './model-unit/model-unit-page.component';

export const adminPageRoutes: Routes = [
    {
        path: 'main',
        component: AdminPageComponent,
        children: [
            {
                path: '',
                component: DashboardPageComponent,
            },
            {
                path: ':model',
                component: ModelPageComponent,
            },
            {
                path: ':model/:unit',
                component: ModelUnitPageComponent,
            },
        ],
    },
];

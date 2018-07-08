import { AdminPage } from './pages/admin/admin-page.component';
import { NotFoundPage } from './pages/not-found/not-found-page.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { 	path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: AdminPage,
    },
    {
        path: '**',
        component: NotFoundPage,
    }
];

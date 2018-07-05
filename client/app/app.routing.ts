import { Routes } from '@angular/router';
import { MainPage } from './pages/main/main-page.component';
import { AdminPage } from './pages/admin/admin-page.component';
import { NotFoundPage } from './pages/not-found/not-found-page.component';

export const appRouting: Routes = [
    { 	path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    {
        path: 'main',
        component: MainPage,
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

import { Route } from '@angular/router';

export interface AppRoute extends Route {
    title?: string;
    prevRoute?: string;
}

export type AppRoutes = AppRoute[];

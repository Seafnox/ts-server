import { Route } from '@angular/router';

export interface IAppRoute extends Route {
    title?: string;
    prevRoute?: string;
}

export type AppRoutes = IAppRoute[];

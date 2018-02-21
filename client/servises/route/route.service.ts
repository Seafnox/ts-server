import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { MainLayout } from '../../layouts/main/main.layout';

@Injectable()
export class RouteService {
    public static withoutAuthorization(routes: Routes): Routes {
        return [{
            path: '',
            component: MainLayout,
            children: routes,
        }];
    }

    public static withAuthorization(routes: Routes): Routes {
        return [{...RouteService.withoutAuthorization(routes)[0], ...{canActivate: [AuthGuard]}}];
    }
}

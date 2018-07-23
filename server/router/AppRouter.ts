import { IndexController } from '../controllers/indexController';
import { RouterHelper } from './routeHelper';
import { Express } from 'express';
import { IRouteConfig, RouteConfigs } from '../_config/routerConfigs';

export class AppRouter {
    private static _instance: AppRouter;
    public static get Instance(): AppRouter {
        if (!AppRouter._instance) {
            AppRouter._instance = new AppRouter();
        }

        return AppRouter._instance;
    }

    private readonly helper: RouterHelper;

    private constructor() {
        this.helper = RouterHelper.Instance;
    }

    public init(express: Express): void {
        this.helper.init(express);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        Object.values(RouteConfigs).forEach((configs: IRouteConfig[]) => {
            configs.forEach(({url, method, action, options}) => {
                this.helper[method](url, action, options);
            });
        });

        // all other router are rendered as home (for client side routing)
        this.helper.get('*', IndexController.index, {auth: false});
    }
}

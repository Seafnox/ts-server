import { IMiddleware, Middleware, Response } from '@tsed/common';

@Middleware()
export class Cors implements IMiddleware {
    // tslint:disable-next-line:no-any
    public use(@Response() res: any): void {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}

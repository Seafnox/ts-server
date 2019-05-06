import { IMiddleware, Middleware, Request, Response } from '@tsed/common';
// import * as core from 'express-serve-static-core';

@Middleware()
export class Cors implements IMiddleware {
    // tslint:disable-next-line:no-any
    public use(@Request() req: any, @Response() res: any): void {
        res.header('Access-Control-Allow-Origin', '*');
        if (req.header('Access-Control-Request-Method')) {
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
        }
    }
}

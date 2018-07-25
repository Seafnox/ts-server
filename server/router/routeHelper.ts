import { startsWith } from 'lodash';
import config from '../config';
import { Express, Response } from 'express';
import { NextFunction, RequestHandler } from 'express-serve-static-core';
import { IncomingHttpHeaders } from 'http';
import { IDecodedJWTInfo } from '../interfaces/DecodedJWTInfo';
import { IApplicationRequest } from '../interfaces/ApplicationRequest';
import { IRouterHelperConfig } from '../interfaces/RouterHelperConfig';
import { ControllerHelper } from '../controllers/_helper/ControllerHelper';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { isBoolean } from 'util';

interface IApplicationIncomingHttpHeaders extends IncomingHttpHeaders {
    authorization?: string;
    Authorization?: string;
}

export class RouterHelper {
    private static _instance: RouterHelper;

    public static get Instance(): RouterHelper {
        if (!RouterHelper._instance) {
            RouterHelper._instance = new RouterHelper();
        }

        return RouterHelper._instance;
    }

    private constructor() {}

    private express: Express;

    public init(express: Express) {
        this.express = express;
    }

    private checkExpress() {
        if (!this.express) {
            throw new Error('Express is ulinked. Use Application.Instance.init');
        }
    }

    public get(route: string, handler: RequestHandler, options: IRouterHelperConfig = {}): void {
        this.checkExpress();
        const handlers = this.prepareHandlers(handler, options);
        console.info('GET', {url: route, count: handlers.length});
        this.express.get(route, handlers);
    }

    public post(route: string, handler: RequestHandler, options: IRouterHelperConfig = {}): void {
        this.checkExpress();
        const handlers = this.prepareHandlers(handler, options);
        console.info('POST', {url: route, count: handlers.length});
        this.express.post(route, handlers);
    }

    public put(route: string, handler: RequestHandler, options: IRouterHelperConfig = {}): void {
        this.checkExpress();
        const handlers = this.prepareHandlers(handler, options);
        console.info('PUT', {url: route, count: handlers.length});
        this.express.put(route, handlers);
    }

    public delete(route: string, handler: RequestHandler, options: IRouterHelperConfig = {}): void {
        this.checkExpress();
        const handlers = this.prepareHandlers(handler, options);
        console.info('DELETE', {url: route, count: handlers.length});
        this.express.delete(route, handlers);
    }

    private prepareAuthCheckHandler(): RequestHandler {
        return (req: IApplicationRequest, res: Response, next: NextFunction): void => {
            const headers: IApplicationIncomingHttpHeaders = req.headers;
            const header = headers.authorization || headers.Authorization;

            const token = this.parseTokenFromHeader(header);

            if (!token) {
                res.status(403).send({
                    success: false,
                    message: 'No token provided.',
                });

                return console.error('No token provided.');
            }

            // decode token
            // verifies secret and checks exp
            verify(token, config.auth.jwtKey, (err: JsonWebTokenError, decoded: IDecodedJWTInfo): void => {
                if (err) {
                    res.status(401).send('Unauthorized');

                    return console.error('Unauthorized');
                }

                req.currentUser = decoded;

                next();
            });
        };
    }

    private prepareHandlers(handler: RequestHandler, options: IRouterHelperConfig): RequestHandler[] {
        const needAuth = isBoolean(options.auth) ? options.auth : true;
        const handlers: RequestHandler[] = [];

        if (needAuth) {
            handlers.push(this.prepareAuthCheckHandler());
        }

        const handlerWrapper = (req: IApplicationRequest, res: Response, next: NextFunction): void => {
            try {
                handler(req, res, next);
            } catch (error) {
                ControllerHelper.Instance.sendFailureMessage(error, res);
            }
        };

        return [
            ...handlers,
            handlerWrapper,
        ];
    }

    private parseTokenFromHeader(header: string): string {
        if (!header) { return null; }

        const prefix = 'Bearer ';

        if (!startsWith(header, prefix)) { return null; }

        return header.substring(prefix.length);
    }
}

import { PlatformAcceptMimesMiddleware, Configuration } from '@tsed/common';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
// import * as cookieParser from 'cookie-parser';
import '@tsed/swagger'; // import swagger Ts.ED module
import 'reflect-metadata'; // import for typeORM
import '@tsed/typeorm'; // import typeorm ts.ed module
import './http-exception-handler'; // Importing filter with ES6 import is enough
import './http-error-handler'; // Importing filter with ES6 import is enough
import './http-404-handler'; // Importing filter with ES6 import is enough

@Configuration({
    middlewares: [
        PlatformAcceptMimesMiddleware,
        // {env: Env.PROD, use: EnsureHttpsMiddleware},
        // responseTime(),
        morgan(':method :url :status :res[content-length] - :response-time ms'),
        cors(),
        // cookieParser(),
        compression({}),
        // methodOverride(),
        bodyParser.json(),
        bodyParser.urlencoded({
            extended: true,
        }),
    ]
})
export class Server {
    public $onServerInitError(err: Error): void {
        // tslint:disable-next-line:no-console
        console.error(err);
    }
}

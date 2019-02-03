import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
// import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
// import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
// import * as responseTime from "response-time";
import '@tsed/swagger'; // import swagger Ts.ED module
import 'reflect-metadata'; // import for typeORM
import '@tsed/typeorm'; // import typeorm ts.ed module

@ServerSettings({
    rootDir: __dirname,
    httpPort: 'localhost:8080',
    httpsPort: 'localhost:8000',
    uploadDir: `./uploads`,
    acceptMimes: ['application/json'],
    swagger: [{
        path: '/api-docs',
    }],
    typeorm: [{
        name: 'default',
        type: 'sqljs',
        autoSave: true,
        location: `./db/dump.sqlite`,
        entities: [`./models/**/*.ts`],
        synchronize: true,
    }],
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the express middleware required by your application to works.
     */
    public $onMountingMiddlewares(): void {
        this
            .use(GlobalAcceptMimesMiddleware)
            // .use(responseTime())
            .use(morgan(':method :url :status :res[content-length] - :response-time ms'))
            // .use(cookieParser())
            .use(compression({}))
            // .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true,
            }));

        return null;
    }

    public $onServerInitError(err: Error): void {
        // tslint:disable-next-line:no-console
        console.error(err);
    }
}

new Server().start();

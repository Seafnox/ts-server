import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

const rootDir = __dirname;

@ServerSettings({
    rootDir,
    acceptMimes: ["application/json"],
    swagger: [{
        path: "/api-docs"
    }],
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the express middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void|Promise<null> {
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(morgan(':method :url :status :res[content-length] - :response-time ms'))
            .use(cookieParser())
            .use(compression({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady(){
        console.log('Server started...');
    }

    public $onServerInitError(err: Error){
        console.error(err);
    }
}

new Server().start();

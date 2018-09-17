import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { init } from './database/dbConnector';
import config from './config';
import { AppRouter } from './router/AppRouter';
import pathHelper from './helpers/pathHelper';
import { IAppRequest } from './interfaces/AppRequest';
import { NextFunction, Response } from 'express';
import { Server } from 'http';
import { ControllerHelper } from './controllers/_helper/ControllerHelper';
import fileUpload = require('express-fileupload');

const app = express();

export function startServer(port: string): Server {
    initExpress();

    AppRouter.Instance.init(app);

    init();

    return app.listen(port);
}

function initExpress() {
    if (config.isDevLocal) {
        app.use(morgan('dev'));
    } // log requests
    app.use(fileUpload({
        safeFileNames: true,
        preserveExtension: true,
    }));
    app.use(bodyParserJsonWrapper); // get information from html forms
    app.use(bodyParser.text()); // get information from html forms
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/', express.static(pathHelper.getClientRelative('/')));
    app.use('/public', express.static(pathHelper.getDataRelative('/public')));

    app.use(cors());

    initSession();

    app.use(errorHandler());
}

function initSession() {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
}

function errorHandler() {
    return (err: Error, req: IAppRequest, res: Response, next: NextFunction) => {
        if (!(err instanceof Error)) {
            console.error('WTF', err);
            return next();
        }

        return ControllerHelper.Instance.handleError(err, res);
    };
}

function bodyParserJsonWrapper(req: IAppRequest, res: Response, next: NextFunction) {
    bodyParser.json()(req, res, (err: Error) => {
        if (err) {
            return errorHandler()(err, req, res, next);
        }
        next();
    });
}

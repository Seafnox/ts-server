import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { isError } from 'lodash';
import { init } from './database/dbConnector';

import config from './config';
import { AppRouter } from './router/AppRouter';
import logger from './logger';
import pathHelper from './helpers/pathHelper';
import { IApplicationRequest } from './interfaces/ApplicationRequest';
import { NextFunction, Response } from 'express';
import { Server } from 'http';

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

    app.use(bodyParserJsonWrapper); // get information from html forms
    app.use(bodyParser.text()); // get information from html forms
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/', express.static(pathHelper.getClientRelative('/')));

    app.use(cors());

    initSession();

    app.use(errorHandler());
}

function initSession() {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
}

function errorHandler() {
    return (err: Error, req: IApplicationRequest, res: Response, next: NextFunction) => {
        if (!(err instanceof Error)) {
            console.error('WTF', err);
            return next();
        }
        logger.error(err);

        let message = isError(err) ? err.message : err;
        message = config.isDevLocal ? message : 'Server Error';

        res.status(500).send({error: message});
    };
}

function bodyParserJsonWrapper(req: IApplicationRequest, res: Response, next: NextFunction) {
    bodyParser.json()(req, res, (err: Error) => {
        if (err) {
            return errorHandler()(err, req, res, next);
        }
        next();
    });
}

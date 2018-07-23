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
import { Response } from 'express';
import { Server } from 'http';

const app = express();

export function startServer(port: string): Server {
    initExpress();

    AppRouter.Instance.init(app);

    initErrorHandling();

    init();

    if (config.isDevLocal) {
        app.use(morgan('dev'));
    }

    return app.listen(port);
}

function initExpress() {
    if (config.isDevLocal) {
        app.use(morgan('dev'));
    } // log requests

    app.use(bodyParser.json()); // get information from html forms
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/', express.static(pathHelper.getClientRelative('/')));

    app.use(cors());

    initSession();
}

function initSession() {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
}

function initErrorHandling() {
    // log unhandled errors
    app.use((err: Error, req: IApplicationRequest, res: Response) => {
        logger.error(err);

        let message = isError(err) ? err.message : err;
        message = config.isDevLocal ? message : 'Server Error';

        res.status(500).send({error: message});
    });
}

import winston = require('winston');
import { isError } from 'lodash';
import fs = require('fs-extra');
import pathHelper from './helpers/pathHelper';
import { LoggerInstance } from 'winston';

let errorLogger: LoggerInstance = null;
let generalLogger: LoggerInstance = null;

function initLoggers() {
    const logPath = pathHelper.getLocalRelative('./logs');

    fs.ensureDirSync(logPath);

    const errorLogPath = pathHelper.getLocalRelative('./logs/errors.log');
    const infoLogPath = pathHelper.getLocalRelative('./logs/info.log');

    errorLogger = new winston.Logger({
        transports: [new winston.transports.File({filename: errorLogPath})],
    });

    winston.handleExceptions(new winston.transports.File({filename: errorLogPath}));

    generalLogger = new winston.Logger({
        transports: [new winston.transports.File({filename: infoLogPath})],
    });
}

initLoggers();

export function logError(err: Error | string): void {
    console.error(err.toString());

    if (isError(err)) {
        errorLogger.error(err.message, {
            message: err.message,
            status: err.status,
            body: err.body,
            type: err.type,
            data: err.data,
            stack: err.stack,
        });
    } else {
        errorLogger.error(err.toString());
    }
}

export function logInfo(message: string, metadata = {}): void {
    generalLogger.info(message, metadata);
}

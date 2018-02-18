import * as winston from 'winston';
import { isError } from 'lodash';
import * as fs from 'fs-extra';
import pathHelper from './helpers/pathHelper';

let errorLogger = null;
let generalLogger = null;

export default {
  error: logError,
  info,
};

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

function logError(err) {
  console.error(err);

  if (isError(err)) {
    return errorLogger.error('Error', {errorMessage: err.message, stack: err.stack});
  } else {
    errorLogger.error(err);
  }
}

function info(message, metadata = {}) {
  generalLogger.info(message, metadata);
}

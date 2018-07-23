import AppError from '../../appError';
import { Response } from 'express';
import { get } from 'lodash';
import logger from '../../logger';
import config from '../../config';
import * as Joi from 'joi';
import { SchemaLike, ValidationOptions } from 'joi';

interface IValidationError extends Error {
    isValidationError?: boolean;
}

type ControllerError = AppError & IValidationError & Error;

export class ControllerHelper {
    private static _instance: ControllerHelper;

    public static get Instance(): ControllerHelper {
        if (!ControllerHelper._instance) {
            ControllerHelper._instance = new ControllerHelper();
        }

        return ControllerHelper._instance;
    }

    private constructor() {}

    public sendFailureMessage(error: ControllerError, res: Response) {
        let statusCode = 500;
        let message = 'Server Error';
        let status = 'error';

        // Joi validation error
        if (error.isValidationError) {
            statusCode = 400;
            message = error.message;
            status = 'validation error';
        }

        const mongooseError = get(error, 'response.data.error');
        if (mongooseError) {
            statusCode = 400;
            message = `Schema validation error: ${mongooseError}`;
            status = 'validation error';
        }

        if (error.isAppError) {
            message = error.message;
        }

        this.logError(error);

        res.status(statusCode).send({
            status,
            message,
        });
    }

    public sendData<T>(data: T, res: Response) {
        res.status(200).send({
            status: 'ok',
            data,
        });
    }

    public loadSchema<T>(data: T, schema: SchemaLike): T {
        const validationOptions: ValidationOptions = {
            stripUnknown: true,
        };

        const validationResult = Joi.validate(data, schema, validationOptions);

        if (!validationResult.error) {
            return validationResult.value;
        }

        if (validationResult.error.name !== 'ValidationError') {
            const unknownError = new Error('Unsupported Validation Error');
            unknownError.message = validationResult.error.toString();

            throw unknownError;
        }

        const validationMessage = validationResult.error.details
            .map((detail) => detail.message)
            .join('\n');

        const returningError: IValidationError = new Error('Validation Errors');
        returningError.isValidationError = true;
        returningError.message = validationMessage;

        throw returningError;
    }

    private logError(error: ControllerError) {
        // do not log known AppErrors
        if (error.isAppError) { return; }

        if (config.isDevLocal) {
            console.error(error);
        }

        logger.error(error);
    }
}

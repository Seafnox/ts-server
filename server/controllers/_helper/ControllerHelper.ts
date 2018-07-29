import { Response } from 'express';
import { get } from 'lodash';
import config from '../../config';
import * as Joi from 'joi';
import { SchemaLike, ValidationOptions } from 'joi';
import AppError from '../../appError';
import { logError } from '../../logger';

interface IValidationError extends Error {
    isValidationError?: boolean;
}

interface IActionError extends Error {
    isActionError?: boolean;
}

interface IAppError extends Error {
    isAppError?: boolean;
}

export class ControllerHelper {
    private static _instance: ControllerHelper;

    public static get Instance(): ControllerHelper {
        if (!ControllerHelper._instance) {
            ControllerHelper._instance = new ControllerHelper();
        }

        return ControllerHelper._instance;
    }

    private constructor() {}

    public handleError(error: Error | AppError, res: Response): void {
        logError(error.toString());

        if ((<IValidationError>error).isValidationError) {
            // Joi validation error
            return this.sendValidationError((<Error>error), res);
        }

        if ((<IActionError>error).isActionError) {
            return this.sendActionError((<Error>error), res);
        }

        if ((<IAppError>error).isAppError) {
            return this.sendAppError((<AppError>error), res);
        }

        if (get(error, 'response.data.error')) {
            return this.sendDbError((<Error>error), res);
        }

        return this.handleUnexpectedError((<Error>error), res);
    }

    public sendValidationError(error: Error, res: Response): void {
        res.status(400).send({
            status: 'validation error',
            success: false,
            message: error.message,
        });
    }

    public sendActionError(error: Error, res: Response): void {
        res.status(400).send({
            status: 'action error',
            success: false,
            message: error.message,
        });
    }

    public sendDbError(error: Error, res: Response): void {
        const mongooseError = get(error, 'response.data.error');
        res.status(400).send({
            status: 'db error',
            success: false,
            message: `Schema validation error: ${mongooseError}`,
            description: error.message,
        });
    }

    public sendAppError(error: AppError, res: Response): void {
        res.status(500).send({
            status: 'error',
            success: false,
            message: error.message,
        });
    }

    private handleUnexpectedError(error: Error, res: Response): void {
        logError(error);

        if (config.isDevLocal) {
            console.error(error);
        }

        res.status(500).send({
            status: 'server error',
            success: false,
            message: config.isDevLocal ? error.message : 'Server Error',
            description: config.isDevLocal ? error.stack : undefined,
        });
    }

    public sendData<T>(data: T, res: Response, status = 200, statusMessage = 'ok') {
        res.status(status).send({
            status: statusMessage,
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
}

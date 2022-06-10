import { Catch, PlatformContext, ExceptionFilterMethods, ResponseErrorObject } from '@tsed/common';
import { Exception } from '@tsed/exceptions';
import { OutgoingHttpHeaders } from 'http';
import { ErrorMessageDto } from '../interfaces/error-message.dto';

@Catch(Error)
export class HttpErrorFilter implements ExceptionFilterMethods {
    public serverExceptionCode = 500;

    public catch(exception: Exception, ctx: PlatformContext): void {
        const { response, logger }: PlatformContext = ctx;
        const error = this.mapError(exception);
        const headers = this.getHeaders(exception);

        logger.error({
            error
        });

        response
            .setHeaders(headers)
            .status(error.status)
            .body(error);
    }

    public mapError(error: Exception): ErrorMessageDto {
        return {
            name: error.origin?.name || error.name,
            message: error.message,
            status: error.status || this.serverExceptionCode,
            errors: this.getErrors(error)
        };
    }

    protected getErrors(error: Exception): Error[] {
        return [error, error.origin]
            .filter(Boolean)
            .reduce(
                (errs, { errors }: ResponseErrorObject): Error[] => ([...errs, ...(errors || [])]),
                [],
            );
    }

    protected getHeaders(error: Exception): OutgoingHttpHeaders {
        return [error, error.origin]
            .filter(Boolean)
            .reduce(
                (obj, { headers }: ResponseErrorObject): OutgoingHttpHeaders => ({
                    ...obj,
                    ...(headers || {})
                }),
                {},
            );
    }
}

import { isString } from 'lodash';
import { IDictionary } from './interfaces/dictionary';

interface IAppError {
  code: string;
  data: IDictionary;
  message: string;
  isAppError: boolean;
}

interface IAppErrorData {
  code: string;
  data?: IDictionary;
}

export class AppError implements IAppError {
  message = 'Server Error';
  code = '';
  data: IDictionary = null;
  isAppError = true;
  isValidationError = false;
  isActionError = false;

  constructor(errorData: IAppErrorData | string) {
    Error.captureStackTrace(this, this.constructor);

    if (isString(errorData)) {
      this.message = errorData as string;
    } else {
      const appErrorData = errorData as IAppErrorData;
      this.message = 'Server Error';
      this.data = appErrorData.data;
      this.code = appErrorData.code;
    }
  }
}

export default AppError;

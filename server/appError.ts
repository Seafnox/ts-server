import { isString } from 'lodash';

interface IAppError {
  code: string;
  data: any;
  message: string;
  isAppError: boolean;
}

interface IAppErrorData {
  code: string;
  data?: any;
}

export class AppError implements IAppError {
  message = 'Server Error';
  code = '';
  data: any;
  isAppError = true;

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

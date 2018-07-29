import { IDecodedJWTInfo } from './DecodedJWTInfo';
import { Request } from 'express';

export interface IAppRequest extends Request {
    currentUser: IDecodedJWTInfo;
}

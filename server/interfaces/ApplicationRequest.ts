import { IDecodedJWTInfo } from './DecodedJWTInfo';
import { Request } from 'express';

export interface IApplicationRequest extends Request {
    currentUser: IDecodedJWTInfo;
}

import { IApplicationRequest } from './ApplicationRequest';
import { NextFunction, Response } from 'express';

export type ControllerAction = (request: IApplicationRequest, response: Response, next?: NextFunction) => void;

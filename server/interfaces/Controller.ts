import { ControllerAction } from './ControllerAction';

export interface IController {
    [param: string]: ControllerAction;
}

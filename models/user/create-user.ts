import { User } from './user';
import { Property, Required } from '@tsed/common';

export class CreateUser implements User {
    @Property()
    @Required()
    public age: number;

    public filePath: string;

    public id: number;

    @Property()
    @Required()
    public firstName: string;

    @Property()
    @Required()
    public lastName: string;
}

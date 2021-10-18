import { User } from './user';
import { Property } from '@tsed/schema';

export class UpdateUser implements User {
    @Property()
    public age: number;

    public filePath: string;

    public id: number;

    @Property()
    public firstName: string;

    @Property()
    public lastName: string;
}

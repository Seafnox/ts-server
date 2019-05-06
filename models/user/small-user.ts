import { User } from './user';
import { Property } from '@tsed/common';

export class SmallUser implements User {
    public age: number;

    public filePath: string;

    @Property()
    public id: number;

    @Property()
    public firstName: string;

    @Property()
    public lastName: string;

    public static fromUser(user: User): SmallUser {
        const result = new SmallUser();
        const { id, filePath, firstName, lastName, age }: User = user;

        Object.assign(result, { id, filePath, firstName, lastName, age });

        return result;
    }
}

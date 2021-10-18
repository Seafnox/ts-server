import { Property, MaxLength, Required, Minimum, Maximum } from '@tsed/schema';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateUser } from './create-user';

const maxStringLength = 100;
const maxAge = 100;

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Property()
    public id: number;

    @Column()
    @MaxLength(maxStringLength)
    @Required()
    public firstName: string;

    @Column()
    @MaxLength(maxStringLength)
    @Required()
    public lastName: string;

    @Column()
    @Minimum(0)
    @Maximum(maxAge)
    public age: number;

    @Column({
        default: '',
    })
    @MaxLength(maxStringLength)
    public filePath: string;

    public static fromCreateUser(user: CreateUser): User {
        const result = new User();
        const { firstName, lastName, age }: CreateUser = user;

        Object.assign(result, { firstName, lastName, age });

        return result;
    }
}

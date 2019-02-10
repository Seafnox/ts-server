import { Property, MaxLength, Required, Minimum, Maximum } from '@tsed/common';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}

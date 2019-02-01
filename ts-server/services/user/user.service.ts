import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection } from 'typeorm';
import { User } from '../../models/user/user';

@Service()
export class UsersService implements AfterRoutesInit {
    private connection: Connection;

    constructor(private typeORMService: TypeORMService) {}

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();

        const user = new User();
        user.firstName = '123';
        user.lastName = '234';
        user.age = 1;

        this.create(user);
    }

    public async create(user: User): Promise<User> {
        await this.connection.manager.save(user);
        // tslint:disable-next-line:no-console
        console.log(`Saved a new user with id: ${user.id}`);

        return user;
    }

    public async find(): Promise<User[]> {
        const users = await this.connection.manager.find(User);
        // tslint:disable-next-line:no-console
        console.log('Loaded users: ', users);

        return users;
    }

}

import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection } from 'typeorm';
import { User } from '../../models/user/user';
import { random } from 'faker';

@Service()
export class UsersService implements AfterRoutesInit {
    private connection: Connection;

    constructor(private typeORMService: TypeORMService) {}

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();
        this.newUser();
        this.newUser();
        this.newUser();
        this.newUser();
        this.newUser();
    }

    public async create(user: User): Promise<User> {
        const result = await this.connection.manager.save(user);
        // tslint:disable-next-line:no-console
        console.log(`Saved a new user with id: ${result.id}`);

        return result;
    }

    public async find(): Promise<User[]> {
        const users = await this.connection.manager.find(User);
        // tslint:disable-next-line:no-console
        console.log('Loaded users: ', users);

        return users;
    }

    private newUser(): Promise<User> {
        const user = new User();
        user.firstName = random.word();
        user.lastName = random.word();
        user.age = random.number();

        return this.create(user);
    }

}

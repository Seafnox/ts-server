import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { ImageHelper } from '../../helper/image/image.helper';
import { User } from '../../models/user/user';
import { CreateUser } from '../../models/user/create-user';

@Service()
export class UsersService implements AfterRoutesInit {
    private connection: Connection;

    constructor(private readonly typeORMService: TypeORMService) {}

    private get manager(): EntityManager {
        return this.connection.manager;
    }

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();
    }

    public async create(data: CreateUser): Promise<User> {
        return await this.manager.save(User.fromCreateUser(data));
    }

    public async find(): Promise<User[]> {
        return await this.manager.find(User);
    }

    public async findOne(id: number): Promise<User> {
        return await this.manager.findOne(User, id);
    }

    public async update(id: number, data: Partial<User>): Promise<User> {
        await this.manager.update(User, id, data);

        return await this.findOne(id);
    }

    public async delete(id: number): Promise<User> {
        const entity = await this.findOne(id);

        await this.manager.delete(User, id);
        ImageHelper.deleteFileByPath(entity.filePath);

        return entity;
    }
}

import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { EntityManager } from 'typeorm';
import { ImageHelper } from '../../helper/image/image.helper';
import { User } from '../../models/user/user';

@Service()
export class UsersService implements AfterRoutesInit {
    private manager: EntityManager;

    constructor(private readonly typeORMService: TypeORMService) {}

    public $afterRoutesInit(): void {
        const connection = this.typeORMService.get();
        this.manager = connection.manager;
    }

    public async create(user: User): Promise<User> {
        return await this.manager.save(user);
    }

    public async find(): Promise<User[]> {
        return await this.manager.find(User);
    }

    public async findOne(id: number): Promise<User> {
        return await this.manager.findOne(User, id);
    }

    public async update(id: number, userData: Partial<User>): Promise<User> {
        await this.manager.update(User, id, userData);

        return await this.findOne(id);
    }

    public async delete(id: number): Promise<User> {
        const user = await this.findOne(id);

        await this.manager.delete(User, id);
        ImageHelper.deleteFileByPath(user.filePath);

        return user;
    }
}

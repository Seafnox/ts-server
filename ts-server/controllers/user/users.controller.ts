import { Controller, Post, BodyParams, Get, Required } from '@tsed/common';
import { User } from '../../models/user/user';
import { UsersService } from '../../services/user/user.service';

@Controller('/users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post('/')
    public create(@Required() @BodyParams() user: User): Promise<User> {
        return this.usersService.create(user);
    }

    @Get('/')
    public getList(): Promise<User[]> {
        return this.usersService.find();
    }
}

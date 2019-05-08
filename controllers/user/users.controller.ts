import { Controller, Post, BodyParams, Get, Required, PathParams, Delete, Put, UseBefore } from '@tsed/common';
import { MultipartFile } from '@tsed/multipartfiles';
import { BadRequest } from 'ts-httpexceptions';
import { ImageHelper } from '../../helper/image/image.helper';
import { File } from '../../interfaces/file.interface';
import { User } from '../../models/user/user';
import { UsersService } from '../../services/user/user.service';
import { Cors } from '../../middlewars/cors';
import { SmallUser } from '../../models/user/small-user';
import { CreateUser } from '../../models/user/create-user';
import { UpdateUser } from '../../models/user/update-user';

@Controller('/users')
@UseBefore(Cors)
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post('/')
    public create(@Required() @BodyParams() user: CreateUser): Promise<User> {
        return this.usersService.create(user);
    }

    @Put('/:id')
    public update(
        @PathParams('id') id: string,
        @Required() @BodyParams() user: UpdateUser,
    ): Promise<User> {
        return this.usersService.update(+id, user);
    }

    @Get('/')
    public async getList(): Promise<SmallUser[]> {
        const users = await this.usersService.find();

        return users.map(SmallUser.fromUser);
    }

    @Get('/:id')
    public async getUser(
        @PathParams('id') id: string,
    ): Promise<User> {
        return await this.usersService.findOne(+id);
    }

    @Put('/:id/avatar')
    public async patchAvatar(
        @PathParams('id') id: string,
        @MultipartFile('file') file: File,
    ): Promise<User> {
        if (file && !ImageHelper.isImage(file)) {
            ImageHelper.deleteFile(file);

            throw(new BadRequest(`File could be only an image`));
        }

        const filePath = file ? ImageHelper.saveFile(file) : '';
        const user = await this.usersService.update(+id, {
            filePath,
        });

        if (!user) {
            if (filePath) {
                ImageHelper.deleteFileByPath(filePath);
            }

            throw(new BadRequest(`Can't find user with id ${JSON.stringify(id)}`));
        }

        return user;
    }

    @Delete('/:id')
    public async delete(@PathParams('id') id: string): Promise<User> {
        return this.usersService.delete(+id);
    }
}

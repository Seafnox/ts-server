import { Controller, Post, BodyParams, Get, Required, PathParams, Delete, Put, UseBefore } from '@tsed/common';
import { MultipartFile } from '@tsed/multipartfiles';
import { BadRequest } from 'ts-httpexceptions';
import { ImageHelper } from '../../helper/image/image.helper';
import { File } from '../../interfaces/file.interface';
import { User } from '../../models/user/user';
import { UsersService } from '../../services/user/user.service';
import { Cors } from '../../middlewars/cors';

@Controller('/users')
@UseBefore(Cors)
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post('/')
    public create(@Required() @BodyParams() user: User): Promise<User> {
        return this.usersService.create(user);
    }

    @Put('/:id')
    public update(
        @PathParams('id') id: string,
        @Required() @BodyParams() user: User,
    ): Promise<User> {
        return this.usersService.update(+id, user);
    }

    @Get('/')
    public getList(): Promise<User[]> {
        return this.usersService.find();
    }

    @Post('/:id/avatar')
    public async patchAvatar(
        @PathParams('id') id: string,
        @MultipartFile('file') file: File,
    ): Promise<User> {
        if (!ImageHelper.isImage(file)) {
            ImageHelper.deleteFile(file);
            throw(new BadRequest(`File could be only an image`));
        }

        const filePath = ImageHelper.saveFile(file);
        const user = await this.usersService.update(+id, {
            filePath,
        });

        if (!user) {
            ImageHelper.deleteFileByPath(filePath);
            throw(new BadRequest(`Can't find user with id ${JSON.stringify(id)}`));
        }

        return user;
    }

    @Delete('/:id')
    public async delete(@PathParams('id') id: string): Promise<User> {
        return this.usersService.delete(+id);
    }
}

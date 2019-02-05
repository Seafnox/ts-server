import { Controller, Post, BodyParams, Get, Required, PathParams } from '@tsed/common';
import { MultipartFile } from '@tsed/multipartfiles';
import { BadRequest } from 'ts-httpexceptions';
import { ImageHelper } from '../../helper/image/image.helper';
import { File } from '../../interfaces/file.interface';
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

    @Post('/:id/avatar')
    public async patchAvatar(
        @PathParams('id') id: string,
        @MultipartFile('file') file: File,
    ): Promise<User> {

        // tslint:disable-next-line:no-console
        console.log('file', file);

        if (!ImageHelper.isImage(file)) {
            throw(new BadRequest(`File could be only an image`));
        }

        const filePath = ImageHelper.saveFile(file);

        // tslint:disable-next-line:no-console
        console.log('filePath', filePath);

        const user = await this.usersService.findOne(+id);

        if (!user) {
            throw(new BadRequest(`Can't find user with id ${JSON.stringify(id)}`));
        }

        return user;
    }
}

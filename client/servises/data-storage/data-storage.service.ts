import { Injectable } from '@angular/core';
import { LocalStorage } from '../../decorators/localstorage.decorator';
import { capitalize } from '../../helpers/capitalize';
import { AuthModel } from '../../models/auth.model';

@Injectable()
export class DataStorageService {
    @LocalStorage() public authData: AuthModel;

    constructor() {
    }

    public get token(): string {
        const {token_type, access_token} = this.authData || new AuthModel();

        return `${capitalize(token_type)} ${access_token}`;
    }
}

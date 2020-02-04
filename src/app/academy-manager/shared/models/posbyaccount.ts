import { Account } from './account';
import { User } from 'src/app/core/models/user';

export class Posbyaccount {
    'pos': string;
    'account': Account;
    'user': User

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

export class Missed {
    'id': number;
    'accountId': number;
    'date': number;
    'justified': boolean;
    'verifyDaily': String;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

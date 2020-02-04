export class Missed {
    'id': number;
    'accountId': number;
    'data': Date;
    'justified': boolean;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

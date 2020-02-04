export class Missed {
    'id': number;
    'accountId': number;
    'data': Date;
    'justified': boolean;
    'dailyVerify': String;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

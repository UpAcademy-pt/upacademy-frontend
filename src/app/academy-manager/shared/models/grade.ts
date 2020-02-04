export class Grade {

    'id': number;
    'subject': string;
    'mark': number;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

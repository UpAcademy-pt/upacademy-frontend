import { Grade } from './grade';

export class Evaluation {

    'id': number;
    'accountId': number;
    'grades': Grade[] = [];
    'comment': string;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

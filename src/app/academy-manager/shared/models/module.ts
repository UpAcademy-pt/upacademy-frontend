import { Theme } from './theme';

export class Module {

    'id': number;
    'evaluationIds': number[];
    'themes': Theme[];
    'name': string;
    'teacherIds': number[] = [];
    'evaluationSubjects': string;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}



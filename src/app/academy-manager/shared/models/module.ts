import { Theme } from './theme';
import { User } from 'src/app/core/models/user';

export class Module {

    'id': number;
    'evaluationIds': number[];
    'themes': Theme[];
    'name': string;
    'teacherIds': number[] = [];
    'evaluationSubjects': string;
    'UserTeacher'?: User [] = [];

    constructor(data?: any) {
        Object.assign(this, data);
    }
}



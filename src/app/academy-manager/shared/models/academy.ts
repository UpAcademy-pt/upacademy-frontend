import { Module } from './module';

export class Academy {
    'id': number;
    'client': string;
    'startDate': string;
    'endDate': string;
    'edName': string;
    'moduleDTOs': Module[] = [];
    'studentsIds': number[] = [];
    'status': string;
    'warning': string;
    'usefulInfo': string;
    'academyType': string;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}

import { Theme } from './theme';

export class Account {
    'id': number;
    'userId': number;
    'age': number;
    'academyIds': number[] = [];
    'academicDegree': string;
    'academicBackground': string;
    'photoLink': string;
    'mobilePhone': number;
    'linkedInAdress': string;
    'themes': Theme[] = [];
    'nif': number;

    constructor(data?: any) {
        Object.assign(this, data);
      }
}

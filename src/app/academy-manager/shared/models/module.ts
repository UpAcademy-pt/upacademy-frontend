import { Theme } from './theme';

export class Module {

'id': number;
'evaluationIds': number[];
'themes': Theme[];
'name': string;
'teachersIds': number[] = [];


constructor(data?: any) {
    Object.assign(this, data);
}
}



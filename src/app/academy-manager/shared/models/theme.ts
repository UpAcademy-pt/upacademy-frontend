export class Theme {
    'id': number;
    'name': string;

    constructor(data?: any) {
        Object.assign(this, data);
      }
}

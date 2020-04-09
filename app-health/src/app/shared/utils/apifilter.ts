

export class ApiFilter {

    protected filter = {};

    constructor(filter: any) {
        this.filter = filter;
    }

    public toString = (): string => {
        return JSON.stringify(this.filter);
    }
}

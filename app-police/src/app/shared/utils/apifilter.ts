

export class ApiFilter {

    protected filter = {};

    constructor(filter: any) {
        this.filter = filter;
    }

    public toString = () : string => {
        // console.log(JSON.stringify(this.filter));
        return JSON.stringify(this.filter);

    }
}

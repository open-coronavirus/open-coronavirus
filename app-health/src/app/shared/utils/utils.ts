

export function indexOfArrayByKey(key: string, value: any, data: Array<any>): number {
    let i = 0;

    while (data && (i < data.length)) {
        if (value == data[i][key] || value === Number(data[i][key])) {
            return i;
        }

        i++;
    }

    return -1;
}
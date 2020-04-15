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

export function versionCompare(a, b) {
    let i, diff;
    const regExStrip0 = /(\.0+)+$/;
    const segmentsA = a.replace(regExStrip0, '').split('.');
    const segmentsB = b.replace(regExStrip0, '').split('.');
    const l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}

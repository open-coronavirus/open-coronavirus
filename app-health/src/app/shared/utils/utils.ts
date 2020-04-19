

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

export function versionCompare(newVersion, appVersion) {
    const newVersionArr = newVersion.split('.');
    const appVersionArr = appVersion.split('.');
    // const l = Math.min(segmentsA.length, segmentsB.length);

    if (appVersionArr[0] < newVersionArr[0]) {
        return false;
    } else if (appVersionArr[0] === newVersionArr[0] && appVersionArr[1] < newVersionArr[1]) {
        return false;
    } else {
        return true;
    }
}

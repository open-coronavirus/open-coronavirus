"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function mapObject(obj, mapper) {
    return Object.keys(obj).reduce((acc, k) => {
        acc[k] = mapper(k, obj[k]);
        return acc;
    }, {});
}
exports.mapObject = mapObject;
const copySymbol = Symbol();
// tslint:disable-next-line:no-any
function deepCopy(value) {
    if (Array.isArray(value)) {
        return value.map((o) => deepCopy(o));
    }
    else if (value && typeof value === 'object') {
        if (value[copySymbol]) {
            // This is a circular dependency. Just return the cloned value.
            return value[copySymbol];
        }
        if (value['toJSON']) {
            return JSON.parse(value['toJSON']());
        }
        const copy = new (Object.getPrototypeOf(value).constructor)();
        value[copySymbol] = copy;
        for (const key of Object.getOwnPropertyNames(value)) {
            copy[key] = deepCopy(value[key]);
        }
        value[copySymbol] = undefined;
        return copy;
    }
    else {
        return value;
    }
}
exports.deepCopy = deepCopy;

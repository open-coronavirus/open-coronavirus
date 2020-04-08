"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(content, map) {
    const stringifiedContent = JSON.stringify(content);
    const stringifiedMap = map ? JSON.stringify(map) : `''`;
    return `module.exports = [[module.id, ${stringifiedContent}, '', ${stringifiedMap}]]`;
}
exports.default = default_1;

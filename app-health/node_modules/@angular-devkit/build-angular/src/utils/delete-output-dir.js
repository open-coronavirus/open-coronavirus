"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Delete an output directory, but error out if it's the root of the project.
 */
function deleteOutputDir(root, outputPath, host) {
    const resolvedOutputPath = core_1.resolve(root, outputPath);
    if (resolvedOutputPath === root) {
        throw new Error('Output path MUST not be project root directory!');
    }
    return host.exists(resolvedOutputPath).pipe(operators_1.concatMap(exists => exists ? host.delete(resolvedOutputPath) : rxjs_1.EMPTY), operators_1.last(null, null));
}
exports.deleteOutputDir = deleteOutputDir;

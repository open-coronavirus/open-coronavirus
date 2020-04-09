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
const node_1 = require("@angular-devkit/core/node");
const host_1 = require("./host");
/**
 * @deprecated Use the new virtualFs.Host classes from @angular-devkit/core.
 */
class FileSystemSink extends host_1.HostSink {
    constructor(dir, force = false) {
        super(new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), core_1.normalize(dir)), force);
    }
}
exports.FileSystemSink = FileSystemSink;

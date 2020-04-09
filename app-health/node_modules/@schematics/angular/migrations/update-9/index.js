"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const update_workspace_config_1 = require("./update-workspace-config");
function default_1() {
    return () => {
        return schematics_1.chain([
            update_workspace_config_1.UpdateWorkspaceConfig(),
        ]);
    };
}
exports.default = default_1;

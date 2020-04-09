"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const path_1 = require("path");
const utils_1 = require("./utils");
/**
 * Returns a partial specific to creating a bundle for node
 * @param wco Options which are include the build options and app config
 */
function getServerConfig(wco) {
    const extraPlugins = [];
    if (wco.buildOptions.sourceMap) {
        const { scripts, styles, hidden } = wco.buildOptions.sourceMap;
        extraPlugins.push(utils_1.getSourceMapDevTool(scripts || false, styles || false, hidden || false));
    }
    const config = {
        resolve: {
            mainFields: [...(wco.supportES2015 ? ['es2015'] : []), 'main', 'module'],
        },
        target: 'node',
        output: {
            libraryTarget: 'commonjs',
        },
        plugins: extraPlugins,
        node: false,
    };
    if (wco.buildOptions.bundleDependencies == 'none') {
        config.externals = [
            /^@angular/,
            (context, request, callback) => {
                // Absolute & Relative paths are not externals
                if (/^\.{0,2}\//.test(request) || path_1.isAbsolute(request)) {
                    return callback();
                }
                try {
                    require.resolve(request);
                    callback(null, request);
                }
                catch (_a) {
                    // Node couldn't find it, so it must be user-aliased
                    callback();
                }
            },
        ];
    }
    return config;
}
exports.getServerConfig = getServerConfig;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const architect_1 = require("@angular-devkit/architect");
const build_webpack_1 = require("@angular-devkit/build-webpack");
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const webpack_configs_1 = require("../angular-cli-files/models/webpack-configs");
const utils_1 = require("../utils");
const version_1 = require("../utils/version");
const webpack_browser_config_1 = require("../utils/webpack-browser-config");
function execute(options, context, transforms = {}) {
    const host = new node_1.NodeJsSyncHost();
    const root = context.workspaceRoot;
    // Check Angular version.
    version_1.assertCompatibleAngularVersion(context.workspaceRoot, context.logger);
    return rxjs_1.from(buildServerWebpackConfig(options, context)).pipe(operators_1.concatMap(async (v) => transforms.webpackConfiguration ? transforms.webpackConfiguration(v) : v), operators_1.concatMap(v => {
        if (options.deleteOutputPath) {
            return utils_1.deleteOutputDir(core_1.normalize(root), core_1.normalize(options.outputPath), host).pipe(operators_1.map(() => v));
        }
        else {
            return rxjs_1.of(v);
        }
    }), operators_1.concatMap(webpackConfig => build_webpack_1.runWebpack(webpackConfig, context)), operators_1.map(output => {
        if (output.success === false) {
            return output;
        }
        return {
            ...output,
            outputPath: path.resolve(root, options.outputPath),
        };
    }));
}
exports.execute = execute;
exports.default = architect_1.createBuilder(execute);
function getCompilerConfig(wco) {
    if (wco.buildOptions.main || wco.buildOptions.polyfills) {
        return wco.buildOptions.aot ? webpack_configs_1.getAotConfig(wco) : webpack_configs_1.getNonAotConfig(wco);
    }
    return {};
}
async function buildServerWebpackConfig(options, context) {
    const { config } = await webpack_browser_config_1.generateBrowserWebpackConfigFromContext({
        ...options,
        buildOptimizer: false,
        aot: true,
        platform: 'server',
    }, context, wco => [
        webpack_configs_1.getCommonConfig(wco),
        webpack_configs_1.getServerConfig(wco),
        webpack_configs_1.getStylesConfig(wco),
        webpack_configs_1.getStatsConfig(wco),
        getCompilerConfig(wco),
    ]);
    return config[0];
}

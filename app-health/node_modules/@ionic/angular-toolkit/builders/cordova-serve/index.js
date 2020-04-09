"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
const scripts_webpack_plugin_1 = require("@angular-devkit/build-angular/src/angular-cli-files/plugins/scripts-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
const append_scripts_1 = require("../utils/append-scripts");
const log_server_1 = require("./log-server");
function serveCordova(options, context) {
    const { devServerTarget, port, host, ssl } = options;
    const root = context.workspaceRoot;
    const devServerTargetSpec = architect_1.targetFromTargetString(devServerTarget);
    async function setup() {
        const devServerTargetOptions = (await context.getTargetOptions(devServerTargetSpec));
        const devServerName = await context.getBuilderNameForTarget(devServerTargetSpec);
        devServerTargetOptions.port = port;
        devServerTargetOptions.host = host;
        devServerTargetOptions.ssl = ssl;
        // tslint:disable-next-line: no-unnecessary-type-assertion
        const formattedOptions = await context.validateOptions(devServerTargetOptions, devServerName);
        const formattedAssets = utils_1.prepareServerConfig(options, root);
        if (options.consolelogs && options.consolelogsPort) {
            await log_server_1.createConsoleLogServer(host, options.consolelogsPort);
        }
        return { formattedOptions, formattedAssets };
    }
    return rxjs_1.from(setup()).pipe(operators_1.switchMap(({ formattedOptions, formattedAssets }) => build_angular_1.executeDevServerBuilder(formattedOptions, context, getTransforms(formattedAssets, context))));
}
exports.serveCordova = serveCordova;
exports.default = architect_1.createBuilder(serveCordova);
function getTransforms(formattedAssets, context) {
    return {
        webpackConfiguration: cordovaServeTransform(formattedAssets, context),
        indexHtml: exports.indexHtmlTransformFactory(formattedAssets, context),
    };
}
const cordovaServeTransform = (formattedAssets, { workspaceRoot }) => browserWebpackConfig => {
    const scriptExtras = formattedAssets.globalScriptsByBundleName.map((script) => {
        const bundleName = script.bundleName;
        return new scripts_webpack_plugin_1.ScriptsWebpackPlugin({
            name: bundleName,
            sourceMap: true,
            filename: `${path_1.basename(bundleName)}.js`,
            scripts: script.paths,
            basePath: workspaceRoot,
        });
    });
    const copyWebpackPluginOptions = {
        ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'],
    };
    const copyWebpackPluginInstance = new CopyWebpackPlugin(formattedAssets.copyWebpackPluginPatterns, copyWebpackPluginOptions);
    // tslint:disable-next-line: no-non-null-assertion
    browserWebpackConfig.plugins.push(...scriptExtras, copyWebpackPluginInstance);
    return browserWebpackConfig;
};
exports.indexHtmlTransformFactory = ({ globalScriptsByBundleName }) => (indexTransform) => {
    const augmentedHtml = append_scripts_1.augmentIndexHtml(indexTransform, globalScriptsByBundleName);
    return Promise.resolve(augmentedHtml);
};

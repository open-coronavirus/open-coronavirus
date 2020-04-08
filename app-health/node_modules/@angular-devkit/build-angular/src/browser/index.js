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
const findCacheDirectory = require("find-cache-dir");
const fs = require("fs");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typescript_1 = require("typescript");
const analytics_1 = require("../../plugins/webpack/analytics");
const webpack_configs_1 = require("../angular-cli-files/models/webpack-configs");
const write_index_html_1 = require("../angular-cli-files/utilities/index-file/write-index-html");
const read_tsconfig_1 = require("../angular-cli-files/utilities/read-tsconfig");
const service_worker_1 = require("../angular-cli-files/utilities/service-worker");
const stats_1 = require("../angular-cli-files/utilities/stats");
const utils_1 = require("../utils");
const version_1 = require("../utils/version");
const webpack_browser_config_1 = require("../utils/webpack-browser-config");
const action_executor_1 = require("./action-executor");
const cacache = require('cacache');
const cacheDownlevelPath = findCacheDirectory({ name: 'angular-build-dl' });
const packageVersion = require('../../package.json').version;
function createBrowserLoggingCallback(verbose, logger) {
    return (stats, config) => {
        // config.stats contains our own stats settings, added during buildWebpackConfig().
        const json = stats.toJson(config.stats);
        if (verbose) {
            logger.info(stats.toString(config.stats));
        }
        else {
            logger.info(stats_1.statsToString(json, config.stats));
        }
        if (stats.hasWarnings()) {
            logger.warn(stats_1.statsWarningsToString(json, config.stats));
        }
        if (stats.hasErrors()) {
            logger.error(stats_1.statsErrorsToString(json, config.stats));
        }
    };
}
exports.createBrowserLoggingCallback = createBrowserLoggingCallback;
async function buildBrowserWebpackConfigFromContext(options, context, host = new node_1.NodeJsSyncHost()) {
    return webpack_browser_config_1.generateBrowserWebpackConfigFromContext(options, context, wco => [
        webpack_configs_1.getCommonConfig(wco),
        webpack_configs_1.getBrowserConfig(wco),
        webpack_configs_1.getStylesConfig(wco),
        webpack_configs_1.getStatsConfig(wco),
        getAnalyticsConfig(wco, context),
        getCompilerConfig(wco),
        wco.buildOptions.webWorkerTsConfig ? webpack_configs_1.getWorkerConfig(wco) : {},
    ], host);
}
exports.buildBrowserWebpackConfigFromContext = buildBrowserWebpackConfigFromContext;
function getAnalyticsConfig(wco, context) {
    if (context.analytics) {
        // If there's analytics, add our plugin. Otherwise no need to slow down the build.
        let category = 'build';
        if (context.builder) {
            // We already vetted that this is a "safe" package, otherwise the analytics would be noop.
            category =
                context.builder.builderName.split(':')[1] || context.builder.builderName || 'build';
        }
        // The category is the builder name if it's an angular builder.
        return {
            plugins: [new analytics_1.NgBuildAnalyticsPlugin(wco.projectRoot, context.analytics, category)],
        };
    }
    return {};
}
function getCompilerConfig(wco) {
    if (wco.buildOptions.main || wco.buildOptions.polyfills) {
        return wco.buildOptions.aot ? webpack_configs_1.getAotConfig(wco) : webpack_configs_1.getNonAotConfig(wco);
    }
    return {};
}
async function initialize(options, context, host, webpackConfigurationTransform) {
    const { config, workspace } = await buildBrowserWebpackConfigFromContext(options, context, host);
    let transformedConfig;
    if (webpackConfigurationTransform) {
        transformedConfig = [];
        for (const c of config) {
            transformedConfig.push(await webpackConfigurationTransform(c));
        }
    }
    if (options.deleteOutputPath) {
        await utils_1.deleteOutputDir(core_1.normalize(context.workspaceRoot), core_1.normalize(options.outputPath), host).toPromise();
    }
    return { config: transformedConfig || config, workspace };
}
// tslint:disable-next-line: no-big-function
function buildWebpackBrowser(options, context, transforms = {}) {
    const host = new node_1.NodeJsSyncHost();
    const root = core_1.normalize(context.workspaceRoot);
    // Check Angular version.
    version_1.assertCompatibleAngularVersion(context.workspaceRoot, context.logger);
    return rxjs_1.from(initialize(options, context, host, transforms.webpackConfiguration)).pipe(
    // tslint:disable-next-line: no-big-function
    operators_1.switchMap(({ workspace, config: configs }) => {
        const projectName = context.target
            ? context.target.project
            : workspace.getDefaultProjectName();
        if (!projectName) {
            throw new Error('Must either have a target from the context or a default project.');
        }
        const projectRoot = core_1.resolve(workspace.root, core_1.normalize(workspace.getProject(projectName).root));
        const tsConfig = read_tsconfig_1.readTsconfig(options.tsConfig, context.workspaceRoot);
        const target = tsConfig.options.target || typescript_1.ScriptTarget.ES5;
        const buildBrowserFeatures = new utils_1.BuildBrowserFeatures(core_1.getSystemPath(projectRoot), target);
        const isDifferentialLoadingNeeded = buildBrowserFeatures.isDifferentialLoadingNeeded();
        if (target > typescript_1.ScriptTarget.ES2015 && isDifferentialLoadingNeeded) {
            context.logger.warn(core_1.tags.stripIndent `
          WARNING: Using differential loading with targets ES5 and ES2016 or higher may
          cause problems. Browsers with support for ES2015 will load the ES2016+ scripts
          referenced with script[type="module"] but they may not support ES2016+ syntax.
        `);
        }
        const useBundleDownleveling = isDifferentialLoadingNeeded && !(utils_1.fullDifferential || options.watch);
        const startTime = Date.now();
        return rxjs_1.from(configs).pipe(
        // the concurrency parameter (3rd parameter of mergeScan) is deliberately
        // set to 1 to make sure the build steps are executed in sequence.
        operators_1.mergeScan((lastResult, config) => {
            // Make sure to only run the 2nd build step, if 1st one succeeded
            if (lastResult.success) {
                return build_webpack_1.runWebpack(config, context, {
                    logging: transforms.logging ||
                        (useBundleDownleveling
                            ? () => { }
                            : createBrowserLoggingCallback(!!options.verbose, context.logger)),
                });
            }
            else {
                return rxjs_1.of();
            }
        }, { success: true }, 1), operators_1.bufferCount(configs.length), 
        // tslint:disable-next-line: no-big-function
        operators_1.switchMap(async (buildEvents) => {
            configs.length = 0;
            const success = buildEvents.every(r => r.success);
            if (!success && useBundleDownleveling) {
                // If using bundle downleveling then there is only one build
                // If it fails show any diagnostic messages and bail
                const webpackStats = buildEvents[0].webpackStats;
                if (webpackStats && webpackStats.warnings.length > 0) {
                    context.logger.warn(stats_1.statsWarningsToString(webpackStats, { colors: true }));
                }
                if (webpackStats && webpackStats.errors.length > 0) {
                    context.logger.error(stats_1.statsErrorsToString(webpackStats, { colors: true }));
                }
                return { success };
            }
            else if (success) {
                let noModuleFiles;
                let moduleFiles;
                let files;
                const scriptsEntryPointName = webpack_configs_1.normalizeExtraEntryPoints(options.scripts || [], 'scripts').map(x => x.bundleName);
                const [firstBuild, secondBuild] = buildEvents;
                if (isDifferentialLoadingNeeded && (utils_1.fullDifferential || options.watch)) {
                    moduleFiles = firstBuild.emittedFiles || [];
                    files = moduleFiles.filter(x => x.extension === '.css' || (x.name && scriptsEntryPointName.includes(x.name)));
                    if (buildEvents.length === 2) {
                        noModuleFiles = secondBuild.emittedFiles;
                    }
                }
                else if (isDifferentialLoadingNeeded && !utils_1.fullDifferential) {
                    const { emittedFiles = [], webpackStats } = firstBuild;
                    moduleFiles = [];
                    noModuleFiles = [];
                    // Common options for all bundle process actions
                    const sourceMapOptions = utils_1.normalizeSourceMaps(options.sourceMap || false);
                    const actionOptions = {
                        optimize: utils_1.normalizeOptimization(options.optimization).scripts,
                        sourceMaps: sourceMapOptions.scripts,
                        hiddenSourceMaps: sourceMapOptions.hidden,
                        vendorSourceMaps: sourceMapOptions.vendor,
                        integrityAlgorithm: options.subresourceIntegrity ? 'sha384' : undefined,
                    };
                    const actions = [];
                    const seen = new Set();
                    for (const file of emittedFiles) {
                        // Assets are not processed nor injected into the index
                        if (file.asset) {
                            continue;
                        }
                        // Scripts and non-javascript files are not processed
                        if (file.extension !== '.js' ||
                            (file.name && scriptsEntryPointName.includes(file.name))) {
                            if (files === undefined) {
                                files = [];
                            }
                            files.push(file);
                            continue;
                        }
                        // Ignore already processed files; emittedFiles can contain duplicates
                        if (seen.has(file.file)) {
                            continue;
                        }
                        seen.add(file.file);
                        // All files at this point except ES5 polyfills are module scripts
                        const es5Polyfills = file.file.startsWith('polyfills-es5') ||
                            file.file.startsWith('polyfills-nomodule-es5');
                        if (!es5Polyfills) {
                            moduleFiles.push(file);
                        }
                        // Retrieve the content/map for the file
                        // NOTE: Additional future optimizations will read directly from memory
                        let filename = path.resolve(core_1.getSystemPath(root), options.outputPath, file.file);
                        const code = fs.readFileSync(filename, 'utf8');
                        let map;
                        if (actionOptions.sourceMaps) {
                            try {
                                map = fs.readFileSync(filename + '.map', 'utf8');
                                if (es5Polyfills) {
                                    fs.unlinkSync(filename + '.map');
                                }
                            }
                            catch (_a) { }
                        }
                        if (es5Polyfills) {
                            fs.unlinkSync(filename);
                            filename = filename.replace(/\-es20\d{2}/, '');
                        }
                        const es2015Polyfills = file.file.startsWith('polyfills-es20');
                        // Record the bundle processing action
                        // The runtime chunk gets special processing for lazy loaded files
                        actions.push({
                            ...actionOptions,
                            filename,
                            code,
                            map,
                            // id is always present for non-assets
                            // tslint:disable-next-line: no-non-null-assertion
                            name: file.id,
                            runtime: file.file.startsWith('runtime'),
                            ignoreOriginal: es5Polyfills,
                            optimizeOnly: es2015Polyfills,
                        });
                        // ES2015 polyfills are only optimized; optimization check was performed above
                        if (es2015Polyfills) {
                            continue;
                        }
                        // Add the newly created ES5 bundles to the index as nomodule scripts
                        const newFilename = es5Polyfills
                            ? file.file.replace(/\-es20\d{2}/, '')
                            : file.file.replace(/\-es20\d{2}/, '-es5');
                        noModuleFiles.push({ ...file, file: newFilename });
                    }
                    // Execute the bundle processing actions
                    context.logger.info('Generating ES5 bundles for differential loading...');
                    const processActions = [];
                    let processRuntimeAction;
                    const processResults = [];
                    for (const action of actions) {
                        // If SRI is enabled always process the runtime bundle
                        // Lazy route integrity values are stored in the runtime bundle
                        if (action.integrityAlgorithm && action.runtime) {
                            processRuntimeAction = action;
                        }
                        else {
                            processActions.push(action);
                        }
                    }
                    const executor = new action_executor_1.BundleActionExecutor({ cachePath: cacheDownlevelPath }, options.subresourceIntegrity ? 'sha384' : undefined);
                    try {
                        for await (const result of executor.processAll(processActions)) {
                            processResults.push(result);
                        }
                    }
                    finally {
                        executor.stop();
                    }
                    // Runtime must be processed after all other files
                    if (processRuntimeAction) {
                        const runtimeOptions = {
                            ...processRuntimeAction,
                            runtimeData: processResults,
                            supportedBrowsers: buildBrowserFeatures.supportedBrowsers,
                        };
                        processResults.push(await Promise.resolve().then(() => require('../utils/process-bundle')).then(m => m.process(runtimeOptions)));
                    }
                    context.logger.info('ES5 bundle generation complete.');
                    function generateBundleInfoStats(id, bundle, chunk) {
                        return stats_1.generateBundleStats({
                            id,
                            size: bundle.size,
                            files: bundle.map ? [bundle.filename, bundle.map.filename] : [bundle.filename],
                            names: chunk && chunk.names,
                            entry: !!chunk && chunk.names.includes('runtime'),
                            initial: !!chunk && chunk.initial,
                            rendered: true,
                        }, true);
                    }
                    let bundleInfoText = '';
                    const processedNames = new Set();
                    for (const result of processResults) {
                        processedNames.add(result.name);
                        const chunk = webpackStats &&
                            webpackStats.chunks &&
                            webpackStats.chunks.find(c => result.name === c.id.toString());
                        if (result.original) {
                            bundleInfoText +=
                                '\n' + generateBundleInfoStats(result.name, result.original, chunk);
                        }
                        if (result.downlevel) {
                            bundleInfoText +=
                                '\n' + generateBundleInfoStats(result.name, result.downlevel, chunk);
                        }
                    }
                    if (webpackStats && webpackStats.chunks) {
                        for (const chunk of webpackStats.chunks) {
                            if (processedNames.has(chunk.id.toString())) {
                                continue;
                            }
                            const asset = webpackStats.assets && webpackStats.assets.find(a => a.name === chunk.files[0]);
                            bundleInfoText +=
                                '\n' + stats_1.generateBundleStats({ ...chunk, size: asset && asset.size }, true);
                        }
                    }
                    bundleInfoText +=
                        '\n' +
                            stats_1.generateBuildStats((webpackStats && webpackStats.hash) || '<unknown>', Date.now() - startTime, true);
                    context.logger.info(bundleInfoText);
                    if (webpackStats && webpackStats.warnings.length > 0) {
                        context.logger.warn(stats_1.statsWarningsToString(webpackStats, { colors: true }));
                    }
                    if (webpackStats && webpackStats.errors.length > 0) {
                        context.logger.error(stats_1.statsErrorsToString(webpackStats, { colors: true }));
                    }
                }
                else {
                    const { emittedFiles = [] } = firstBuild;
                    files = emittedFiles.filter(x => x.name !== 'polyfills-es5');
                    noModuleFiles = emittedFiles.filter(x => x.name === 'polyfills-es5');
                }
                if (options.index) {
                    return write_index_html_1.writeIndexHtml({
                        host,
                        outputPath: core_1.resolve(root, core_1.join(core_1.normalize(options.outputPath), webpack_browser_config_1.getIndexOutputFile(options))),
                        indexPath: core_1.join(root, webpack_browser_config_1.getIndexInputFile(options)),
                        files,
                        noModuleFiles,
                        moduleFiles,
                        baseHref: options.baseHref,
                        deployUrl: options.deployUrl,
                        sri: options.subresourceIntegrity,
                        scripts: options.scripts,
                        styles: options.styles,
                        postTransform: transforms.indexHtml,
                        crossOrigin: options.crossOrigin,
                    })
                        .pipe(operators_1.map(() => ({ success: true })), operators_1.catchError(error => rxjs_1.of({ success: false, error: mapErrorToMessage(error) })))
                        .toPromise();
                }
                else {
                    return { success };
                }
            }
            else {
                return { success };
            }
        }), operators_1.concatMap(buildEvent => {
            if (buildEvent.success && !options.watch && options.serviceWorker) {
                return rxjs_1.from(service_worker_1.augmentAppWithServiceWorker(host, root, projectRoot, core_1.resolve(root, core_1.normalize(options.outputPath)), options.baseHref || '/', options.ngswConfigPath).then(() => ({ success: true }), error => ({ success: false, error: mapErrorToMessage(error) })));
            }
            else {
                return rxjs_1.of(buildEvent);
            }
        }), operators_1.map(event => ({
            ...event,
            // If we use differential loading, both configs have the same outputs
            outputPath: path.resolve(context.workspaceRoot, options.outputPath),
        })));
    }));
}
exports.buildWebpackBrowser = buildWebpackBrowser;
function mapErrorToMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return undefined;
}
exports.default = architect_1.createBuilder(buildWebpackBrowser);

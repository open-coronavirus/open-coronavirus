"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const path = require("path");
const webpack_configs_1 = require("../angular-cli-files/models/webpack-configs");
const read_tsconfig_1 = require("../angular-cli-files/utilities/read-tsconfig");
const utils_1 = require("../utils");
const build_browser_features_1 = require("./build-browser-features");
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const webpackMerge = require('webpack-merge');
async function generateWebpackConfig(context, workspaceRoot, projectRoot, sourceRoot, options, webpackPartialGenerator, logger) {
    // Ensure Build Optimizer is only used with AOT.
    if (options.buildOptimizer && !options.aot) {
        throw new Error(`The 'buildOptimizer' option cannot be used without 'aot'.`);
    }
    const tsConfigPath = path.resolve(workspaceRoot, options.tsConfig);
    const tsConfig = read_tsconfig_1.readTsconfig(tsConfigPath);
    // tslint:disable-next-line:no-implicit-dependencies
    const ts = await Promise.resolve().then(() => require('typescript'));
    // At the moment, only the browser builder supports differential loading
    // However this config generation is used by multiple builders such as dev-server
    const scriptTarget = tsConfig.options.target || ts.ScriptTarget.ES5;
    const buildBrowserFeatures = new build_browser_features_1.BuildBrowserFeatures(projectRoot, scriptTarget);
    const differentialLoading = context.builder.builderName === 'browser'
        && !options.watch
        && buildBrowserFeatures.isDifferentialLoadingNeeded();
    const scriptTargets = [scriptTarget];
    if (differentialLoading && utils_1.fullDifferential) {
        scriptTargets.push(ts.ScriptTarget.ES5);
    }
    // For differential loading, we can have several targets
    return scriptTargets.map(scriptTarget => {
        let buildOptions = { ...options };
        const supportES2015 = scriptTarget !== ts.ScriptTarget.ES3 && scriptTarget !== ts.ScriptTarget.ES5;
        if (differentialLoading && utils_1.fullDifferential) {
            buildOptions = {
                ...options,
                ...(
                // FIXME: we do create better webpack config composition to achieve the below
                // When DL is enabled and supportES2015 is true it means that we are on the second build
                // This also means that we don't need to include styles and assets multiple times
                supportES2015
                    ? {}
                    : {
                        styles: options.extractCss ? [] : options.styles,
                        assets: [],
                    }),
                es5BrowserSupport: undefined,
                esVersionInFileName: true,
                scriptTargetOverride: scriptTarget,
            };
        }
        else if (differentialLoading && !utils_1.fullDifferential) {
            buildOptions = { ...options, esVersionInFileName: true, scriptTargetOverride: ts.ScriptTarget.ES5, es5BrowserSupport: undefined };
        }
        const wco = {
            root: workspaceRoot,
            logger: logger.createChild('webpackConfigOptions'),
            projectRoot,
            sourceRoot,
            buildOptions,
            tsConfig,
            tsConfigPath,
            supportES2015,
            differentialLoadingMode: differentialLoading && !utils_1.fullDifferential,
        };
        wco.buildOptions.progress = utils_1.defaultProgress(wco.buildOptions.progress);
        const partials = webpackPartialGenerator(wco);
        const webpackConfig = webpackMerge(partials);
        if (supportES2015) {
            if (!webpackConfig.resolve) {
                webpackConfig.resolve = {};
            }
            if (!webpackConfig.resolve.alias) {
                webpackConfig.resolve.alias = {};
            }
            webpackConfig.resolve.alias['zone.js/dist/zone'] = 'zone.js/dist/zone-evergreen';
        }
        if (options.profile || process.env['NG_BUILD_PROFILING']) {
            const esVersionInFileName = webpack_configs_1.getEsVersionForFileName(utils_1.fullDifferential ? buildOptions.scriptTargetOverride : tsConfig.options.target, wco.buildOptions.esVersionInFileName);
            const smp = new SpeedMeasurePlugin({
                outputFormat: 'json',
                outputTarget: path.resolve(workspaceRoot, `speed-measure-plugin${esVersionInFileName}.json`),
            });
            return smp.wrap(webpackConfig);
        }
        return webpackConfig;
    });
}
exports.generateWebpackConfig = generateWebpackConfig;
async function generateBrowserWebpackConfigFromWorkspace(options, context, projectName, workspace, host, webpackPartialGenerator, logger) {
    // TODO: Use a better interface for workspace access.
    const projectRoot = core_1.resolve(workspace.root, core_1.normalize(workspace.getProject(projectName).root));
    const projectSourceRoot = workspace.getProject(projectName).sourceRoot;
    const sourceRoot = projectSourceRoot
        ? core_1.resolve(workspace.root, core_1.normalize(projectSourceRoot))
        : undefined;
    const normalizedOptions = utils_1.normalizeBrowserSchema(host, workspace.root, projectRoot, sourceRoot, options);
    return generateWebpackConfig(context, core_1.getSystemPath(workspace.root), core_1.getSystemPath(projectRoot), sourceRoot && core_1.getSystemPath(sourceRoot), normalizedOptions, webpackPartialGenerator, logger);
}
exports.generateBrowserWebpackConfigFromWorkspace = generateBrowserWebpackConfigFromWorkspace;
async function generateBrowserWebpackConfigFromContext(options, context, webpackPartialGenerator, host = new node_1.NodeJsSyncHost()) {
    const registry = new core_1.schema.CoreSchemaRegistry();
    registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
    const workspace = await core_1.experimental.workspace.Workspace.fromPath(host, core_1.normalize(context.workspaceRoot), registry);
    const projectName = context.target ? context.target.project : workspace.getDefaultProjectName();
    if (!projectName) {
        throw new Error('Must either have a target from the context or a default project.');
    }
    const config = await generateBrowserWebpackConfigFromWorkspace(options, context, projectName, workspace, host, webpackPartialGenerator, context.logger);
    return { workspace, config };
}
exports.generateBrowserWebpackConfigFromContext = generateBrowserWebpackConfigFromContext;
function getIndexOutputFile(options) {
    if (typeof options.index === 'string') {
        return path.basename(options.index);
    }
    else {
        return options.index.output || 'index.html';
    }
}
exports.getIndexOutputFile = getIndexOutputFile;
function getIndexInputFile(options) {
    if (typeof options.index === 'string') {
        return options.index;
    }
    else {
        return options.index.input;
    }
}
exports.getIndexInputFile = getIndexInputFile;

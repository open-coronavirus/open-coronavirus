"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const build_optimizer_1 = require("@angular-devkit/build-optimizer");
const core_1 = require("@angular-devkit/core");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const typescript_1 = require("typescript");
const webpack_1 = require("webpack");
const webpack_sources_1 = require("webpack-sources");
const utils_1 = require("../../../utils");
const mangle_options_1 = require("../../../utils/mangle-options");
const bundle_budget_1 = require("../../plugins/bundle-budget");
const cleancss_webpack_plugin_1 = require("../../plugins/cleancss-webpack-plugin");
const named_chunks_plugin_1 = require("../../plugins/named-chunks-plugin");
const scripts_webpack_plugin_1 = require("../../plugins/scripts-webpack-plugin");
const find_up_1 = require("../../utilities/find-up");
const utils_2 = require("./utils");
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// tslint:disable-next-line:no-any
const g = typeof global !== 'undefined' ? global : {};
// tslint:disable-next-line:no-big-function
function getCommonConfig(wco) {
    const { root, projectRoot, buildOptions, tsConfig } = wco;
    const { styles: stylesOptimization, scripts: scriptsOptimization } = buildOptions.optimization;
    const { styles: stylesSourceMap, scripts: scriptsSourceMap, vendor: vendorSourceMap, } = buildOptions.sourceMap;
    const nodeModules = find_up_1.findUp('node_modules', projectRoot);
    if (!nodeModules) {
        throw new Error('Cannot locate node_modules directory.');
    }
    // tslint:disable-next-line:no-any
    const extraPlugins = [];
    const entryPoints = {};
    const targetInFileName = utils_2.getEsVersionForFileName(utils_1.fullDifferential ? buildOptions.scriptTargetOverride : tsConfig.options.target, buildOptions.esVersionInFileName);
    if (buildOptions.main) {
        entryPoints['main'] = [path.resolve(root, buildOptions.main)];
    }
    let differentialLoadingNeeded = false;
    if (wco.buildOptions.platform !== 'server') {
        const buildBrowserFeatures = new utils_1.BuildBrowserFeatures(projectRoot, tsConfig.options.target || typescript_1.ScriptTarget.ES5);
        differentialLoadingNeeded = buildBrowserFeatures.isDifferentialLoadingNeeded();
        if ((buildOptions.scriptTargetOverride || tsConfig.options.target) === typescript_1.ScriptTarget.ES5) {
            if (buildOptions.es5BrowserSupport ||
                (buildOptions.es5BrowserSupport === undefined && buildBrowserFeatures.isEs5SupportNeeded())) {
                // The nomodule polyfill needs to be inject prior to any script and be
                // outside of webpack compilation because otherwise webpack will cause the
                // script to be wrapped in window["webpackJsonp"] which causes this to fail.
                if (buildBrowserFeatures.isNoModulePolyfillNeeded()) {
                    const noModuleScript = {
                        bundleName: 'polyfills-nomodule-es5',
                        input: path.join(__dirname, '..', 'safari-nomodule.js'),
                    };
                    buildOptions.scripts = buildOptions.scripts
                        ? [...buildOptions.scripts, noModuleScript]
                        : [noModuleScript];
                }
                // For full build differential loading we don't need to generate a seperate polyfill file
                // because they will be loaded exclusivly based on module and nomodule
                const polyfillsChunkName = utils_1.fullDifferential && differentialLoadingNeeded ? 'polyfills' : 'polyfills-es5';
                entryPoints[polyfillsChunkName] = [path.join(__dirname, '..', 'es5-polyfills.js')];
                if (!utils_1.fullDifferential && differentialLoadingNeeded) {
                    // Add zone.js legacy support to the es5 polyfills
                    // This is a noop execution-wise if zone-evergreen is not used.
                    entryPoints[polyfillsChunkName].push('zone.js/dist/zone-legacy');
                }
                if (!buildOptions.aot) {
                    // If not performing a full differential build the JIT polyfills need to be added to ES5
                    if (!utils_1.fullDifferential && differentialLoadingNeeded) {
                        entryPoints[polyfillsChunkName].push(path.join(__dirname, '..', 'jit-polyfills.js'));
                    }
                    entryPoints[polyfillsChunkName].push(path.join(__dirname, '..', 'es5-jit-polyfills.js'));
                }
                // If not performing a full differential build the polyfills need to be added to ES5 bundle
                if (!utils_1.fullDifferential && buildOptions.polyfills) {
                    entryPoints[polyfillsChunkName].push(path.resolve(root, buildOptions.polyfills));
                }
            }
        }
        if (buildOptions.polyfills) {
            entryPoints['polyfills'] = [
                ...(entryPoints['polyfills'] || []),
                path.resolve(root, buildOptions.polyfills),
            ];
        }
        if (!buildOptions.aot) {
            entryPoints['polyfills'] = [
                ...(entryPoints['polyfills'] || []),
                path.join(__dirname, '..', 'jit-polyfills.js'),
            ];
        }
    }
    if (buildOptions.profile || process.env['NG_BUILD_PROFILING']) {
        extraPlugins.push(new webpack_1.debug.ProfilingPlugin({
            outputPath: path.resolve(root, `chrome-profiler-events${targetInFileName}.json`),
        }));
    }
    // determine hashing format
    const hashFormat = utils_2.getOutputHashFormat(buildOptions.outputHashing || 'none');
    // process global scripts
    const globalScriptsByBundleName = utils_2.normalizeExtraEntryPoints(buildOptions.scripts, 'scripts').reduce((prev, curr) => {
        const bundleName = curr.bundleName;
        const resolvedPath = path.resolve(root, curr.input);
        const existingEntry = prev.find(el => el.bundleName === bundleName);
        if (existingEntry) {
            if (existingEntry.inject && !curr.inject) {
                // All entries have to be lazy for the bundle to be lazy.
                throw new Error(`The ${curr.bundleName} bundle is mixing injected and non-injected scripts.`);
            }
            existingEntry.paths.push(resolvedPath);
        }
        else {
            prev.push({
                bundleName,
                paths: [resolvedPath],
                inject: curr.inject,
            });
        }
        return prev;
    }, []);
    if (globalScriptsByBundleName.length > 0) {
        // Add a new asset for each entry.
        globalScriptsByBundleName.forEach(script => {
            // Lazy scripts don't get a hash, otherwise they can't be loaded by name.
            const hash = script.inject ? hashFormat.script : '';
            const bundleName = script.bundleName;
            extraPlugins.push(new scripts_webpack_plugin_1.ScriptsWebpackPlugin({
                name: bundleName,
                sourceMap: scriptsSourceMap,
                filename: `${path.basename(bundleName)}${hash}.js`,
                scripts: script.paths,
                basePath: projectRoot,
            }));
        });
    }
    // process asset entries
    if (buildOptions.assets) {
        const copyWebpackPluginPatterns = buildOptions.assets.map((asset) => {
            // Resolve input paths relative to workspace root and add slash at the end.
            asset.input = path.resolve(root, asset.input).replace(/\\/g, '/');
            asset.input = asset.input.endsWith('/') ? asset.input : asset.input + '/';
            asset.output = asset.output.endsWith('/') ? asset.output : asset.output + '/';
            if (asset.output.startsWith('..')) {
                const message = 'An asset cannot be written to a location outside of the output path.';
                throw new Error(message);
            }
            return {
                context: asset.input,
                // Now we remove starting slash to make Webpack place it from the output root.
                to: asset.output.replace(/^\//, ''),
                ignore: asset.ignore,
                from: {
                    glob: asset.glob,
                    dot: true,
                },
            };
        });
        const copyWebpackPluginOptions = { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'] };
        const copyWebpackPluginInstance = new CopyWebpackPlugin(copyWebpackPluginPatterns, copyWebpackPluginOptions);
        extraPlugins.push(copyWebpackPluginInstance);
    }
    if (buildOptions.progress) {
        extraPlugins.push(new ProgressPlugin({ profile: buildOptions.verbose }));
    }
    if (buildOptions.showCircularDependencies) {
        extraPlugins.push(new CircularDependencyPlugin({
            exclude: /([\\\/]node_modules[\\\/])|(ngfactory\.js$)/,
        }));
    }
    if (buildOptions.statsJson) {
        extraPlugins.push(new (class {
            apply(compiler) {
                compiler.hooks.emit.tap('angular-cli-stats', compilation => {
                    const data = JSON.stringify(compilation.getStats().toJson('verbose'));
                    compilation.assets[`stats${targetInFileName}.json`] = new webpack_sources_1.RawSource(data);
                });
            }
        })());
    }
    if (buildOptions.namedChunks) {
        extraPlugins.push(new named_chunks_plugin_1.NamedLazyChunksPlugin());
    }
    let sourceMapUseRule;
    if ((scriptsSourceMap || stylesSourceMap) && vendorSourceMap) {
        sourceMapUseRule = {
            use: [
                {
                    loader: 'source-map-loader',
                },
            ],
        };
    }
    let buildOptimizerUseRule;
    if (buildOptions.buildOptimizer) {
        extraPlugins.push(new build_optimizer_1.BuildOptimizerWebpackPlugin());
        buildOptimizerUseRule = {
            use: [
                {
                    loader: build_optimizer_1.buildOptimizerLoaderPath,
                    options: { sourceMap: scriptsSourceMap },
                },
            ],
        };
    }
    // Allow loaders to be in a node_modules nested inside the devkit/build-angular package.
    // This is important in case loaders do not get hoisted.
    // If this file moves to another location, alter potentialNodeModules as well.
    const loaderNodeModules = find_up_1.findAllNodeModules(__dirname, projectRoot);
    loaderNodeModules.unshift('node_modules');
    // Load rxjs path aliases.
    // https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md#build-and-treeshaking
    let alias = {};
    try {
        const rxjsPathMappingImport = wco.supportES2015
            ? 'rxjs/_esm2015/path-mapping'
            : 'rxjs/_esm5/path-mapping';
        const rxPaths = require(require.resolve(rxjsPathMappingImport, { paths: [projectRoot] }));
        alias = rxPaths(nodeModules);
    }
    catch (_a) { }
    const extraMinimizers = [];
    if (stylesOptimization) {
        extraMinimizers.push(new cleancss_webpack_plugin_1.CleanCssWebpackPlugin({
            sourceMap: stylesSourceMap,
            // component styles retain their original file name
            test: file => /\.(?:css|scss|sass|less|styl)$/.test(file),
        }));
    }
    if (scriptsOptimization) {
        let angularGlobalDefinitions = {
            ngDevMode: false,
            ngI18nClosureMode: false,
        };
        // Try to load known global definitions from @angular/compiler-cli.
        const GLOBAL_DEFS_FOR_TERSER = require('@angular/compiler-cli').GLOBAL_DEFS_FOR_TERSER;
        if (GLOBAL_DEFS_FOR_TERSER) {
            angularGlobalDefinitions = GLOBAL_DEFS_FOR_TERSER;
        }
        if (buildOptions.aot) {
            // Also try to load AOT-only global definitions.
            const GLOBAL_DEFS_FOR_TERSER_WITH_AOT = require('@angular/compiler-cli')
                .GLOBAL_DEFS_FOR_TERSER_WITH_AOT;
            if (GLOBAL_DEFS_FOR_TERSER_WITH_AOT) {
                angularGlobalDefinitions = {
                    ...angularGlobalDefinitions,
                    ...GLOBAL_DEFS_FOR_TERSER_WITH_AOT,
                };
            }
        }
        // TODO: Investigate why this fails for some packages: wco.supportES2015 ? 6 : 5;
        const terserEcma = 5;
        const terserOptions = {
            warnings: !!buildOptions.verbose,
            safari10: true,
            output: {
                ecma: terserEcma,
                comments: false,
                webkit: true,
            },
            // On server, we don't want to compress anything. We still set the ngDevMode = false for it
            // to remove dev code, and ngI18nClosureMode to remove Closure compiler i18n code
            compress: buildOptions.platform == 'server'
                ? {
                    ecma: terserEcma,
                    global_defs: angularGlobalDefinitions,
                    keep_fnames: true,
                }
                : {
                    ecma: terserEcma,
                    pure_getters: buildOptions.buildOptimizer,
                    // PURE comments work best with 3 passes.
                    // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
                    passes: buildOptions.buildOptimizer ? 3 : 1,
                    global_defs: angularGlobalDefinitions,
                },
            // We also want to avoid mangling on server.
            // Name mangling is handled within the browser builder
            mangle: !mangle_options_1.manglingDisabled &&
                buildOptions.platform !== 'server' &&
                (!differentialLoadingNeeded || (differentialLoadingNeeded && utils_1.fullDifferential)),
        };
        extraMinimizers.push(new TerserPlugin({
            sourceMap: scriptsSourceMap,
            parallel: true,
            cache: true,
            chunkFilter: (chunk) => !globalScriptsByBundleName.some(s => s.bundleName === chunk.name),
            terserOptions,
        }), 
        // Script bundles are fully optimized here in one step since they are never downleveled.
        // They are shared between ES2015 & ES5 outputs so must support ES5.
        new TerserPlugin({
            sourceMap: scriptsSourceMap,
            parallel: true,
            cache: true,
            chunkFilter: (chunk) => globalScriptsByBundleName.some(s => s.bundleName === chunk.name),
            terserOptions: {
                ...terserOptions,
                compress: {
                    ...terserOptions.compress,
                    ecma: 5,
                },
                output: {
                    ...terserOptions.output,
                    ecma: 5,
                },
                mangle: !mangle_options_1.manglingDisabled && buildOptions.platform !== 'server',
            },
        }));
    }
    if (wco.tsConfig.options.target !== undefined &&
        wco.tsConfig.options.target >= typescript_1.ScriptTarget.ES2017) {
        wco.logger.warn(core_1.tags.stripIndent `
      WARNING: Zone.js does not support native async/await in ES2017.
      These blocks are not intercepted by zone.js and will not triggering change detection.
      See: https://github.com/angular/zone.js/pull/1140 for more information.
    `);
    }
    return {
        mode: scriptsOptimization || stylesOptimization ? 'production' : 'development',
        devtool: false,
        profile: buildOptions.statsJson,
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.js'],
            symlinks: !buildOptions.preserveSymlinks,
            modules: [wco.tsConfig.options.baseUrl || projectRoot, 'node_modules'],
            alias,
        },
        resolveLoader: {
            modules: loaderNodeModules,
        },
        context: projectRoot,
        entry: entryPoints,
        output: {
            futureEmitAssets: true,
            path: path.resolve(root, buildOptions.outputPath),
            publicPath: buildOptions.deployUrl,
            filename: `[name]${targetInFileName}${hashFormat.chunk}.js`,
        },
        watch: buildOptions.watch,
        watchOptions: {
            poll: buildOptions.poll,
        },
        performance: {
            hints: false,
        },
        module: {
            // Show an error for missing exports instead of a warning.
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                    loader: 'file-loader',
                    options: {
                        name: `[name]${hashFormat.file}.[ext]`,
                    },
                },
                {
                    // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                    // Removing this will cause deprecation warnings to appear.
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true },
                },
                {
                    test: /[\/\\]hot[\/\\]emitter\.js$/,
                    parser: { node: { events: true } },
                },
                {
                    test: /[\/\\]webpack-dev-server[\/\\]client[\/\\]utils[\/\\]createSocketUrl\.js$/,
                    parser: { node: { querystring: true } },
                },
                {
                    test: /\.js$/,
                    // Factory files are processed by BO in the rules added in typescript.ts.
                    exclude: /(ngfactory|ngstyle)\.js$/,
                    ...buildOptimizerUseRule,
                },
                {
                    test: /\.js$/,
                    exclude: /(ngfactory|ngstyle)\.js$/,
                    enforce: 'pre',
                    ...sourceMapUseRule,
                },
            ],
        },
        optimization: {
            noEmitOnErrors: true,
            minimizer: [
                new webpack_1.HashedModuleIdsPlugin(),
                // TODO: check with Mike what this feature needs.
                new bundle_budget_1.BundleBudgetPlugin({ budgets: buildOptions.budgets }),
                ...extraMinimizers,
            ],
        },
        plugins: [
            // Always replace the context for the System.import in angular/core to prevent warnings.
            // https://github.com/angular/angular/issues/11580
            // With VE the correct context is added in @ngtools/webpack, but Ivy doesn't need it at all.
            new webpack_1.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/),
            ...extraPlugins,
        ],
    };
}
exports.getCommonConfig = getCommonConfig;

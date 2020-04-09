"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack_1 = require("../../plugins/webpack");
const utils_1 = require("./utils");
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssImports = require('postcss-import');
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('style-loader')
 * require('postcss-loader')
 * require('stylus')
 * require('stylus-loader')
 * require('less')
 * require('less-loader')
 * require('node-sass')
 * require('sass-loader')
 */
// tslint:disable-next-line:no-big-function
function getStylesConfig(wco) {
    const { root, buildOptions } = wco;
    const entryPoints = {};
    const globalStylePaths = [];
    const extraPlugins = [];
    const cssSourceMap = buildOptions.sourceMap.styles;
    // Determine hashing format.
    const hashFormat = utils_1.getOutputHashFormat(buildOptions.outputHashing);
    const postcssPluginCreator = function (loader) {
        return [
            postcssImports({
                resolve: (url) => (url.startsWith('~') ? url.substr(1) : url),
                load: (filename) => {
                    return new Promise((resolve, reject) => {
                        loader.fs.readFile(filename, (err, data) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            const content = data.toString();
                            resolve(content);
                        });
                    });
                },
            }),
            webpack_1.PostcssCliResources({
                baseHref: buildOptions.baseHref,
                deployUrl: buildOptions.deployUrl,
                resourcesOutputPath: buildOptions.resourcesOutputPath,
                loader,
                rebaseRootRelative: buildOptions.rebaseRootRelativeCssUrls,
                filename: `[name]${hashFormat.file}.[ext]`,
            }),
            autoprefixer(),
        ];
    };
    // use includePaths from appConfig
    const includePaths = [];
    let lessPathOptions = {};
    if (buildOptions.stylePreprocessorOptions &&
        buildOptions.stylePreprocessorOptions.includePaths &&
        buildOptions.stylePreprocessorOptions.includePaths.length > 0) {
        buildOptions.stylePreprocessorOptions.includePaths.forEach((includePath) => includePaths.push(path.resolve(root, includePath)));
        lessPathOptions = {
            paths: includePaths,
        };
    }
    // Process global styles.
    if (buildOptions.styles.length > 0) {
        const chunkNames = [];
        utils_1.normalizeExtraEntryPoints(buildOptions.styles, 'styles').forEach(style => {
            const resolvedPath = path.resolve(root, style.input);
            // Add style entry points.
            if (entryPoints[style.bundleName]) {
                entryPoints[style.bundleName].push(resolvedPath);
            }
            else {
                entryPoints[style.bundleName] = [resolvedPath];
            }
            // Add non injected styles to the list.
            if (!style.inject) {
                chunkNames.push(style.bundleName);
            }
            // Add global css paths.
            globalStylePaths.push(resolvedPath);
        });
        if (chunkNames.length > 0) {
            // Add plugin to remove hashes from lazy styles.
            extraPlugins.push(new webpack_1.RemoveHashPlugin({ chunkNames, hashFormat }));
        }
    }
    let sassImplementation;
    let fiber;
    try {
        // tslint:disable-next-line:no-implicit-dependencies
        sassImplementation = require('node-sass');
    }
    catch (_a) {
        sassImplementation = require('sass');
        try {
            // tslint:disable-next-line:no-implicit-dependencies
            fiber = require('fibers');
        }
        catch (_b) { }
    }
    // set base rules to derive final rules from
    const baseRules = [
        { test: /\.css$/, use: [] },
        {
            test: /\.scss$|\.sass$/,
            use: [
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: sassImplementation,
                        fiber,
                        sourceMap: cssSourceMap,
                        // bootstrap-sass requires a minimum precision of 8
                        precision: 8,
                        includePaths,
                    },
                },
            ],
        },
        {
            test: /\.less$/,
            use: [
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: cssSourceMap,
                        javascriptEnabled: true,
                        ...lessPathOptions,
                    },
                },
            ],
        },
        {
            test: /\.styl$/,
            use: [
                {
                    loader: 'stylus-loader',
                    options: {
                        sourceMap: cssSourceMap,
                        paths: includePaths,
                    },
                },
            ],
        },
    ];
    // load component css as raw strings
    const rules = baseRules.map(({ test, use }) => ({
        exclude: globalStylePaths,
        test,
        use: [
            { loader: 'raw-loader' },
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'embedded',
                    plugins: postcssPluginCreator,
                    sourceMap: cssSourceMap
                        // Never use component css sourcemap when style optimizations are on.
                        // It will just increase bundle size without offering good debug experience.
                        && !buildOptions.optimization.styles
                        // Inline all sourcemap types except hidden ones, which are the same as no sourcemaps
                        // for component css.
                        && !buildOptions.sourceMap.hidden ? 'inline' : false,
                },
            },
            ...use,
        ],
    }));
    // load global css as css files
    if (globalStylePaths.length > 0) {
        rules.push(...baseRules.map(({ test, use }) => {
            return {
                include: globalStylePaths,
                test,
                use: [
                    buildOptions.extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
                    webpack_1.RawCssLoader,
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: buildOptions.extractCss ? 'extracted' : 'embedded',
                            plugins: postcssPluginCreator,
                            sourceMap: cssSourceMap && !buildOptions.extractCss && !buildOptions.sourceMap.hidden
                                ? 'inline'
                                : cssSourceMap,
                        },
                    },
                    ...use,
                ],
            };
        }));
    }
    if (buildOptions.extractCss) {
        extraPlugins.push(
        // extract global css from js files into own css file
        new MiniCssExtractPlugin({ filename: `[name]${hashFormat.extract}.css` }), 
        // suppress empty .js files in css only entry points
        new webpack_1.SuppressExtractedTextChunksWebpackPlugin());
    }
    return {
        entry: entryPoints,
        module: { rules },
        plugins: extraPlugins,
    };
}
exports.getStylesConfig = getStylesConfig;

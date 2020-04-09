"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const normalize_asset_patterns_1 = require("./normalize-asset-patterns");
const normalize_file_replacements_1 = require("./normalize-file-replacements");
const normalize_optimization_1 = require("./normalize-optimization");
const normalize_source_maps_1 = require("./normalize-source-maps");
function normalizeBrowserSchema(host, root, projectRoot, sourceRoot, options) {
    const syncHost = new core_1.virtualFs.SyncDelegateHost(host);
    const normalizedSourceMapOptions = normalize_source_maps_1.normalizeSourceMaps(options.sourceMap || false);
    normalizedSourceMapOptions.vendor = normalizedSourceMapOptions.vendor || options.vendorSourceMap;
    return {
        ...options,
        assets: normalize_asset_patterns_1.normalizeAssetPatterns(options.assets || [], syncHost, root, projectRoot, sourceRoot),
        fileReplacements: normalize_file_replacements_1.normalizeFileReplacements(options.fileReplacements || [], syncHost, root),
        optimization: normalize_optimization_1.normalizeOptimization(options.optimization),
        sourceMap: normalizedSourceMapOptions,
        statsJson: options.statsJson || false,
        forkTypeChecker: options.forkTypeChecker || false,
        budgets: options.budgets || [],
        scripts: options.scripts || [],
        styles: options.styles || [],
        stylePreprocessorOptions: {
            includePaths: options.stylePreprocessorOptions
                && options.stylePreprocessorOptions.includePaths
                || [],
        },
        lazyModules: options.lazyModules || [],
    };
}
exports.normalizeBrowserSchema = normalizeBrowserSchema;

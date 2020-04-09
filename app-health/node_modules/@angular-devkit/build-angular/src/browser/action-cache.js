"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const crypto_1 = require("crypto");
const findCacheDirectory = require("find-cache-dir");
const fs = require("fs");
const mangle_options_1 = require("../utils/mangle-options");
const cacache = require('cacache');
const cacheDownlevelPath = findCacheDirectory({ name: 'angular-build-dl' });
const packageVersion = require('../../package.json').version;
// Workaround Node.js issue prior to 10.16 with copyFile on macOS
// https://github.com/angular/angular-cli/issues/15544 & https://github.com/nodejs/node/pull/27241
let copyFileWorkaround = false;
if (process.platform === 'darwin') {
    const version = process.versions.node.split('.').map(part => Number(part));
    if (version[0] < 10 || version[0] === 11 || (version[0] === 10 && version[1] < 16)) {
        copyFileWorkaround = true;
    }
}
class BundleActionCache {
    constructor(integrityAlgorithm) {
        this.integrityAlgorithm = integrityAlgorithm;
    }
    static copyEntryContent(entry, dest) {
        if (copyFileWorkaround) {
            try {
                fs.unlinkSync(dest);
            }
            catch (_a) { }
        }
        fs.copyFileSync(typeof entry === 'string' ? entry : entry.path, dest, fs.constants.COPYFILE_FICLONE);
        if (process.platform !== 'win32') {
            // The cache writes entries as readonly and when using copyFile the permissions will also be copied.
            // See: https://github.com/npm/cacache/blob/073fbe1a9f789ba42d9a41de7b8429c93cf61579/lib/util/move-file.js#L36
            fs.chmodSync(dest, 0o644);
        }
    }
    generateBaseCacheKey(content) {
        // Create base cache key with elements:
        // * package version - different build-angular versions cause different final outputs
        // * code length/hash - ensure cached version matches the same input code
        const algorithm = this.integrityAlgorithm || 'sha1';
        const codeHash = crypto_1.createHash(algorithm)
            .update(content)
            .digest('base64');
        let baseCacheKey = `${packageVersion}|${content.length}|${algorithm}-${codeHash}`;
        if (mangle_options_1.manglingDisabled) {
            baseCacheKey += '|MD';
        }
        return baseCacheKey;
    }
    generateCacheKeys(action) {
        // Postfix added to sourcemap cache keys when vendor, hidden sourcemaps are present
        // Allows non-destructive caching of both variants
        const sourceMapVendorPostfix = action.sourceMaps && action.vendorSourceMaps ? '|vendor' : '';
        // sourceMappingURL is added at the very end which causes the code to be the same when sourcemaps are enabled/disabled
        // When using hiddenSourceMaps we can omit the postfix since sourceMappingURL will not be added.
        // When having sourcemaps a hashed file and non hashed file can have the same content. But the sourceMappingURL will differ.
        const sourceMapPostFix = action.sourceMaps && !action.hiddenSourceMaps ? `|sourcemap|${action.filename}` : '';
        const baseCacheKey = this.generateBaseCacheKey(action.code);
        // Determine cache entries required based on build settings
        const cacheKeys = [];
        // If optimizing and the original is not ignored, add original as required
        if (!action.ignoreOriginal) {
            cacheKeys[0 /* OriginalCode */] = baseCacheKey + sourceMapPostFix + '|orig';
            // If sourcemaps are enabled, add original sourcemap as required
            if (action.sourceMaps) {
                cacheKeys[1 /* OriginalMap */] = baseCacheKey + sourceMapVendorPostfix + '|orig-map';
            }
        }
        // If not only optimizing, add downlevel as required
        if (!action.optimizeOnly) {
            cacheKeys[2 /* DownlevelCode */] = baseCacheKey + sourceMapPostFix + '|dl';
            // If sourcemaps are enabled, add downlevel sourcemap as required
            if (action.sourceMaps) {
                cacheKeys[3 /* DownlevelMap */] = baseCacheKey + sourceMapVendorPostfix + '|dl-map';
            }
        }
        return cacheKeys;
    }
    async getCacheEntries(cacheKeys) {
        // Attempt to get required cache entries
        const cacheEntries = [];
        for (const key of cacheKeys) {
            if (key) {
                const entry = await cacache.get.info(cacheDownlevelPath, key);
                if (!entry) {
                    return false;
                }
                cacheEntries.push({
                    path: entry.path,
                    size: entry.size,
                    integrity: entry.metadata && entry.metadata.integrity,
                });
            }
            else {
                cacheEntries.push(null);
            }
        }
        return cacheEntries;
    }
    async getCachedBundleResult(action) {
        const entries = action.cacheKeys && await this.getCacheEntries(action.cacheKeys);
        if (!entries) {
            return null;
        }
        const result = { name: action.name };
        let cacheEntry = entries[0 /* OriginalCode */];
        if (cacheEntry) {
            result.original = {
                filename: action.filename,
                size: cacheEntry.size,
                integrity: cacheEntry.integrity,
            };
            BundleActionCache.copyEntryContent(cacheEntry, result.original.filename);
            cacheEntry = entries[1 /* OriginalMap */];
            if (cacheEntry) {
                result.original.map = {
                    filename: action.filename + '.map',
                    size: cacheEntry.size,
                };
                BundleActionCache.copyEntryContent(cacheEntry, result.original.filename + '.map');
            }
        }
        else if (!action.ignoreOriginal) {
            // If the original wasn't processed (and therefore not cached), add info
            result.original = {
                filename: action.filename,
                size: Buffer.byteLength(action.code, 'utf8'),
                map: action.map === undefined
                    ? undefined
                    : {
                        filename: action.filename + '.map',
                        size: Buffer.byteLength(action.map, 'utf8'),
                    },
            };
        }
        cacheEntry = entries[2 /* DownlevelCode */];
        if (cacheEntry) {
            result.downlevel = {
                filename: action.filename.replace(/\-es20\d{2}/, '-es5'),
                size: cacheEntry.size,
                integrity: cacheEntry.integrity,
            };
            BundleActionCache.copyEntryContent(cacheEntry, result.downlevel.filename);
            cacheEntry = entries[3 /* DownlevelMap */];
            if (cacheEntry) {
                result.downlevel.map = {
                    filename: action.filename.replace(/\-es20\d{2}/, '-es5') + '.map',
                    size: cacheEntry.size,
                };
                BundleActionCache.copyEntryContent(cacheEntry, result.downlevel.filename + '.map');
            }
        }
        return result;
    }
}
exports.BundleActionCache = BundleActionCache;

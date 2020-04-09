(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/dependencies/module_resolver", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    /**
     * This is a very cut-down implementation of the TypeScript module resolution strategy.
     *
     * It is specific to the needs of ngcc and is not intended to be a drop-in replacement
     * for the TS module resolver. It is used to compute the dependencies between entry-points
     * that may be compiled by ngcc.
     *
     * The algorithm only finds `.js` files for internal/relative imports and paths to
     * the folder containing the `package.json` of the entry-point for external imports.
     *
     * It can cope with nested `node_modules` folders and also supports `paths`/`baseUrl`
     * configuration properties, as provided in a `ts.CompilerOptions` object.
     */
    var ModuleResolver = /** @class */ (function () {
        function ModuleResolver(fs, pathMappings, relativeExtensions) {
            if (relativeExtensions === void 0) { relativeExtensions = [
                '.js', '/index.js'
            ]; }
            this.fs = fs;
            this.relativeExtensions = relativeExtensions;
            this.pathMappings = pathMappings ? this.processPathMappings(pathMappings) : [];
        }
        /**
         * Resolve an absolute path for the `moduleName` imported into a file at `fromPath`.
         * @param moduleName The name of the import to resolve.
         * @param fromPath The path to the file containing the import.
         * @returns A path to the resolved module or null if missing.
         * Specifically:
         *  * the absolute path to the package.json of an external module
         *  * a JavaScript file of an internal module
         *  * null if none exists.
         */
        ModuleResolver.prototype.resolveModuleImport = function (moduleName, fromPath) {
            if (utils_1.isRelativePath(moduleName)) {
                return this.resolveAsRelativePath(moduleName, fromPath);
            }
            else {
                return this.pathMappings.length && this.resolveByPathMappings(moduleName, fromPath) ||
                    this.resolveAsEntryPoint(moduleName, fromPath);
            }
        };
        /**
         * Convert the `pathMappings` into a collection of `PathMapper` functions.
         */
        ModuleResolver.prototype.processPathMappings = function (pathMappings) {
            var baseUrl = file_system_1.absoluteFrom(pathMappings.baseUrl);
            return Object.keys(pathMappings.paths).map(function (pathPattern) {
                var matcher = splitOnStar(pathPattern);
                var templates = pathMappings.paths[pathPattern].map(splitOnStar);
                return { matcher: matcher, templates: templates, baseUrl: baseUrl };
            });
        };
        /**
         * Try to resolve a module name, as a relative path, from the `fromPath`.
         *
         * As it is relative, it only looks for files that end in one of the `relativeExtensions`.
         * For example: `${moduleName}.js` or `${moduleName}/index.js`.
         * If neither of these files exist then the method returns `null`.
         */
        ModuleResolver.prototype.resolveAsRelativePath = function (moduleName, fromPath) {
            var resolvedPath = utils_1.resolveFileWithPostfixes(this.fs, file_system_1.resolve(file_system_1.dirname(fromPath), moduleName), this.relativeExtensions);
            return resolvedPath && new ResolvedRelativeModule(resolvedPath);
        };
        /**
         * Try to resolve the `moduleName`, by applying the computed `pathMappings` and
         * then trying to resolve the mapped path as a relative or external import.
         *
         * Whether the mapped path is relative is defined as it being "below the `fromPath`" and not
         * containing `node_modules`.
         *
         * If the mapped path is not relative but does not resolve to an external entry-point, then we
         * check whether it would have resolved to a relative path, in which case it is marked as a
         * "deep-import".
         */
        ModuleResolver.prototype.resolveByPathMappings = function (moduleName, fromPath) {
            var e_1, _a;
            var mappedPaths = this.findMappedPaths(moduleName);
            if (mappedPaths.length > 0) {
                var packagePath = this.findPackagePath(fromPath);
                if (packagePath !== null) {
                    try {
                        for (var mappedPaths_1 = tslib_1.__values(mappedPaths), mappedPaths_1_1 = mappedPaths_1.next(); !mappedPaths_1_1.done; mappedPaths_1_1 = mappedPaths_1.next()) {
                            var mappedPath = mappedPaths_1_1.value;
                            if (this.isEntryPoint(mappedPath)) {
                                return new ResolvedExternalModule(mappedPath);
                            }
                            var nonEntryPointImport = this.resolveAsRelativePath(mappedPath, fromPath);
                            if (nonEntryPointImport !== null) {
                                return isRelativeImport(packagePath, mappedPath) ? nonEntryPointImport :
                                    new ResolvedDeepImport(mappedPath);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (mappedPaths_1_1 && !mappedPaths_1_1.done && (_a = mappedPaths_1.return)) _a.call(mappedPaths_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            return null;
        };
        /**
         * Try to resolve the `moduleName` as an external entry-point by searching the `node_modules`
         * folders up the tree for a matching `.../node_modules/${moduleName}`.
         *
         * If a folder is found but the path does not contain a `package.json` then it is marked as a
         * "deep-import".
         */
        ModuleResolver.prototype.resolveAsEntryPoint = function (moduleName, fromPath) {
            var folder = fromPath;
            while (!file_system_1.isRoot(folder)) {
                folder = file_system_1.dirname(folder);
                if (folder.endsWith('node_modules')) {
                    // Skip up if the folder already ends in node_modules
                    folder = file_system_1.dirname(folder);
                }
                var modulePath = file_system_1.resolve(folder, 'node_modules', moduleName);
                if (this.isEntryPoint(modulePath)) {
                    return new ResolvedExternalModule(modulePath);
                }
                else if (this.resolveAsRelativePath(modulePath, fromPath)) {
                    return new ResolvedDeepImport(modulePath);
                }
            }
            return null;
        };
        /**
         * Can we consider the given path as an entry-point to a package?
         *
         * This is achieved by checking for the existence of `${modulePath}/package.json`.
         */
        ModuleResolver.prototype.isEntryPoint = function (modulePath) {
            return this.fs.exists(file_system_1.join(modulePath, 'package.json'));
        };
        /**
         * Apply the `pathMappers` to the `moduleName` and return all the possible
         * paths that match.
         *
         * The mapped path is computed for each template in `mapping.templates` by
         * replacing the `matcher.prefix` and `matcher.postfix` strings in `path with the
         * `template.prefix` and `template.postfix` strings.
         */
        ModuleResolver.prototype.findMappedPaths = function (moduleName) {
            var _this = this;
            var matches = this.pathMappings.map(function (mapping) { return _this.matchMapping(moduleName, mapping); });
            var bestMapping;
            var bestMatch;
            for (var index = 0; index < this.pathMappings.length; index++) {
                var mapping = this.pathMappings[index];
                var match = matches[index];
                if (match !== null) {
                    // If this mapping had no wildcard then this must be a complete match.
                    if (!mapping.matcher.hasWildcard) {
                        bestMatch = match;
                        bestMapping = mapping;
                        break;
                    }
                    // The best matched mapping is the one with the longest prefix.
                    if (!bestMapping || mapping.matcher.prefix > bestMapping.matcher.prefix) {
                        bestMatch = match;
                        bestMapping = mapping;
                    }
                }
            }
            return (bestMapping !== undefined && bestMatch !== undefined) ?
                this.computeMappedTemplates(bestMapping, bestMatch) :
                [];
        };
        /**
         * Attempt to find a mapped path for the given `path` and a `mapping`.
         *
         * The `path` matches the `mapping` if if it starts with `matcher.prefix` and ends with
         * `matcher.postfix`.
         *
         * @returns the wildcard segment of a matched `path`, or `null` if no match.
         */
        ModuleResolver.prototype.matchMapping = function (path, mapping) {
            var _a = mapping.matcher, prefix = _a.prefix, postfix = _a.postfix, hasWildcard = _a.hasWildcard;
            if (hasWildcard) {
                return (path.startsWith(prefix) && path.endsWith(postfix)) ?
                    path.substring(prefix.length, path.length - postfix.length) :
                    null;
            }
            else {
                return (path === prefix) ? '' : null;
            }
        };
        /**
         * Compute the candidate paths from the given mapping's templates using the matched
         * string.
         */
        ModuleResolver.prototype.computeMappedTemplates = function (mapping, match) {
            return mapping.templates.map(function (template) { return file_system_1.resolve(mapping.baseUrl, template.prefix + match + template.postfix); });
        };
        /**
         * Search up the folder tree for the first folder that contains `package.json`
         * or `null` if none is found.
         */
        ModuleResolver.prototype.findPackagePath = function (path) {
            var folder = path;
            while (!file_system_1.isRoot(folder)) {
                folder = file_system_1.dirname(folder);
                if (this.fs.exists(file_system_1.join(folder, 'package.json'))) {
                    return folder;
                }
            }
            return null;
        };
        return ModuleResolver;
    }());
    exports.ModuleResolver = ModuleResolver;
    /**
     * A module that is external to the package doing the importing.
     * In this case we capture the folder containing the entry-point.
     */
    var ResolvedExternalModule = /** @class */ (function () {
        function ResolvedExternalModule(entryPointPath) {
            this.entryPointPath = entryPointPath;
        }
        return ResolvedExternalModule;
    }());
    exports.ResolvedExternalModule = ResolvedExternalModule;
    /**
     * A module that is relative to the module doing the importing, and so internal to the
     * source module's package.
     */
    var ResolvedRelativeModule = /** @class */ (function () {
        function ResolvedRelativeModule(modulePath) {
            this.modulePath = modulePath;
        }
        return ResolvedRelativeModule;
    }());
    exports.ResolvedRelativeModule = ResolvedRelativeModule;
    /**
     * A module that is external to the package doing the importing but pointing to a
     * module that is deep inside a package, rather than to an entry-point of the package.
     */
    var ResolvedDeepImport = /** @class */ (function () {
        function ResolvedDeepImport(importPath) {
            this.importPath = importPath;
        }
        return ResolvedDeepImport;
    }());
    exports.ResolvedDeepImport = ResolvedDeepImport;
    function splitOnStar(str) {
        var _a = tslib_1.__read(str.split('*', 2), 2), prefix = _a[0], postfix = _a[1];
        return { prefix: prefix, postfix: postfix || '', hasWildcard: postfix !== undefined };
    }
    function isRelativeImport(from, to) {
        return to.startsWith(from) && !to.includes('node_modules');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2RlcGVuZGVuY2llcy9tb2R1bGVfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsMkVBQXdIO0lBQ3hILDhEQUFnRjtJQUVoRjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSDtRQUdFLHdCQUFvQixFQUFjLEVBQUUsWUFBMkIsRUFBVSxrQkFFeEU7WUFGd0UsbUNBQUEsRUFBQTtnQkFDdkUsS0FBSyxFQUFFLFdBQVc7YUFDbkI7WUFGbUIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUF1Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBRTFGO1lBQ0MsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2pGLENBQUM7UUFFRDs7Ozs7Ozs7O1dBU0c7UUFDSCw0Q0FBbUIsR0FBbkIsVUFBb0IsVUFBa0IsRUFBRSxRQUF3QjtZQUM5RCxJQUFJLHNCQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6RDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDO29CQUMvRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3BEO1FBQ0gsQ0FBQztRQUVEOztXQUVHO1FBQ0ssNENBQW1CLEdBQTNCLFVBQTRCLFlBQTBCO1lBQ3BELElBQU0sT0FBTyxHQUFHLDBC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LFNBQVMsZ0JBQWdCLENBQUMsSUFBb0IsRUFBRSxFQUFrQjtRQUNoRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtLCBhYnNvbHV0ZUZyb20sIGRpcm5hbWUsIGlzUm9vdCwgam9pbiwgcmVzb2x2ZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7UGF0aE1hcHBpbmdzLCBpc1JlbGF0aXZlUGF0aCwgcmVzb2x2ZUZpbGVXaXRoUG9zdGZpeGVzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogVGhpcyBpcyBhIHZlcnkgY3V0LWRvd24gaW1wbGVtZW50YXRpb24gb2YgdGhlIFR5cGVTY3JpcHQgbW9kdWxlIHJlc29sdXRpb24gc3RyYXRlZ3kuXG4gKlxuICogSXQgaXMgc3BlY2lmaWMgdG8gdGhlIG5lZWRzIG9mIG5nY2MgYW5kIGlzIG5vdCBpbnRlbmRlZCB0byBiZSBhIGRyb3AtaW4gcmVwbGFjZW1lbnRcbiAqIGZvciB0aGUgVFMgbW9kdWxlIHJlc29sdmVyLiBJdCBpcyB1c2VkIHRvIGNvbXB1dGUgdGhlIGRlcGVuZGVuY2llcyBiZXR3ZWVuIGVudHJ5LXBvaW50c1xuICogdGhhdCBtYXkgYmUgY29tcGlsZWQgYnkgbmdjYy5cbiAqXG4gKiBUaGUgYWxnb3JpdGhtIG9ubHkgZmluZHMgYC5qc2AgZmlsZXMgZm9yIGludGVybmFsL3JlbGF0aXZlIGltcG9ydHMgYW5kIHBhdGhzIHRvXG4gKiB0aGUgZm9sZGVyIGNvbnRhaW5pbmcgdGhlIGBwYWNrYWdlLmpzb25gIG9mIHRoZSBlbnRyeS1wb2ludCBmb3IgZXh0ZXJuYWwgaW1wb3J0cy5cbiAqXG4gKiBJdCBjYW4gY29wZSB3aXRoIG5lc3RlZCBgbm9kZV9tb2R1bGVzYCBmb2xkZXJzIGFuZCBhbHNvIHN1cHBvcnRzIGBwYXRoc2AvYGJhc2VVcmxgXG4gKiBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMsIGFzIHByb3ZpZGVkIGluIGEgYHRzLkNvbXBpbGVyT3B0aW9uc2Agb2JqZWN0LlxuICovXG5leHBvcnQgY2xhc3MgTW9kdWxlUmVzb2x2ZXIge1xuICBwcml2YXRlIHBhdGhNYXBwaW5nczogUHJvY2Vzc2VkUGF0aE1hcHBpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZzOiBGaWxlU3lzdGVtLCBwYXRoTWFwcGluZ3M/OiBQYXRoTWFwcGluZ3MsIHByaXZhdGUgcmVsYXRpdmVFeHRlbnNpb25zID0gW1xuICAgICcuanMnLCAnL2luZGV4LmpzJ1xuICBdKSB7XG4gICAgdGhpcy5wYXRoTWFwcGluZ3MgPSBwYXRoTWFwcGluZ3MgPyB0aGlzLnByb2Nlc3NQYXRoTWFwcGluZ3MocGF0aE1hcHBpbmdzKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYW4gYWJzb2x1dGUgcGF0aCBmb3IgdGhlIGBtb2R1bGVOYW1lYCBpbXBvcnRlZCBpbnRvIGEgZmlsZSBhdCBgZnJvbVBhdGhgLlxuICAgKiBAcGFyYW0gbW9kdWxlTmFtZSBUaGUgbmFtZSBvZiB0aGUgaW1wb3J0IHRvIHJlc29sdmUuXG4gICAqIEBwYXJhbSBmcm9tUGF0aCBUaGUgcGF0aCB0byB0aGUgZmlsZSBjb250YWluaW5nIHRoZSBpbXBvcnQuXG4gICAqIEByZXR1cm5zIEEgcGF0aCB0byB0aGUgcmVzb2x2ZWQgbW9kdWxlIG9yIG51bGwgaWYgbWlzc2luZy5cbiAgICogU3BlY2lmaWNhbGx5OlxuICAgKiAgKiB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcGFja2FnZS5qc29uIG9mIGFuIGV4dGVybmFsIG1vZHVsZVxuICAgKiAgKiBhIEphdmFTY3JpcHQgZmlsZSBvZiBhbiBpbnRlcm5hbCBtb2R1bGVcbiAgICogICogbnVsbCBpZiBub25lIGV4aXN0cy5cbiAgICovXG4gIHJlc29sdmVNb2R1bGVJbXBvcnQobW9kdWxlTmFtZTogc3RyaW5nLCBmcm9tUGF0aDogQWJzb2x1dGVGc1BhdGgpOiBSZXNvbHZlZE1vZHVsZXxudWxsIHtcbiAgICBpZiAoaXNSZWxhdGl2ZVBhdGgobW9kdWxlTmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVBc1JlbGF0aXZlUGF0aChtb2R1bGVOYW1lLCBmcm9tUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnBhdGhNYXBwaW5ncy5sZW5ndGggJiYgdGhpcy5yZXNvbHZlQnlQYXRoTWFwcGluZ3MobW9kdWxlTmFtZSwgZnJvbVBhdGgpIHx8XG4gICAgICAgICAgdGhpcy5yZXNvbHZlQXNFbnRyeVBvaW50KG1vZHVsZU5hbWUsIGZyb21QYXRoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCB0aGUgYHBhdGhNYXBwaW5nc2AgaW50byBhIGNvbGxlY3Rpb24gb2YgYFBhdGhNYXBwZXJgIGZ1bmN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgcHJvY2Vzc1BhdGhNYXBwaW5ncyhwYXRoTWFwcGluZ3M6IFBhdGhNYXBwaW5ncyk6IFByb2Nlc3NlZFBhdGhNYXBwaW5nW10ge1xuICAgIGNvbnN0IGJhc2VVcmwgPSBhYnNvbHV0ZUZyb20ocGF0aE1hcHBpbmdzLmJhc2VVcmwpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhwYXRoTWFwcGluZ3MucGF0aHMpLm1hcChwYXRoUGF0dGVybiA9PiB7XG4gICAgICBjb25zdCBtYXRjaGVyID0gc3BsaXRPblN0YXIocGF0aFBhdHRlcm4pO1xuICAgICAgY29uc3QgdGVtcGxhdGVzID0gcGF0aE1hcHBpbmdzLnBhdGhzW3BhdGhQYXR0ZXJuXS5tYXAoc3BsaXRPblN0YXIpO1xuICAgICAgcmV0dXJuIHttYXRjaGVyLCB0ZW1wbGF0ZXMsIGJhc2VVcmx9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byByZXNvbHZlIGEgbW9kdWxlIG5hbWUsIGFzIGEgcmVsYXRpdmUgcGF0aCwgZnJvbSB0aGUgYGZyb21QYXRoYC5cbiAgICpcbiAgICogQXMgaXQgaXMgcmVsYXRpdmUsIGl0IG9ubHkgbG9va3MgZm9yIGZpbGVzIHRoYXQgZW5kIGluIG9uZSBvZiB0aGUgYHJlbGF0aXZlRXh0ZW5zaW9uc2AuXG4gICAqIEZvciBleGFtcGxlOiBgJHttb2R1bGVOYW1lfS5qc2Agb3IgYCR7bW9kdWxlTmFtZX0vaW5kZXguanNgLlxuICAgKiBJZiBuZWl0aGVyIG9mIHRoZXNlIGZpbGVzIGV4aXN0IHRoZW4gdGhlIG1ldGhvZCByZXR1cm5zIGBudWxsYC5cbiAgICovXG4gIHByaXZhdGUgcmVzb2x2ZUFzUmVsYXRpdmVQYXRoKG1vZHVsZU5hbWU6IHN0cmluZywgZnJvbVBhdGg6IEFic29sdXRlRnNQYXRoKTogUmVzb2x2ZWRNb2R1bGV8bnVsbCB7XG4gICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZUZpbGVXaXRoUG9zdGZpeGVzKFxuICAgICAgICB0aGlzLmZzLCByZXNvbHZlKGRpcm5hbWUoZnJvbVBhdGgpLCBtb2R1bGVOYW1lKSwgdGhpcy5yZWxhdGl2ZUV4dGVuc2lvbnMpO1xuICAgIHJldHVybiByZXNvbHZlZFBhdGggJiYgbmV3IFJlc29sdmVkUmVsYXRpdmVNb2R1bGUocmVzb2x2ZWRQYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gcmVzb2x2ZSB0aGUgYG1vZHVsZU5hbWVgLCBieSBhcHBseWluZyB0aGUgY29tcHV0ZWQgYHBhdGhNYXBwaW5nc2AgYW5kXG4gICAqIHRoZW4gdHJ5aW5nIHRvIHJlc29sdmUgdGhlIG1hcHBlZCBwYXRoIGFzIGEgcmVsYXRpdmUgb3IgZXh0ZXJuYWwgaW1wb3J0LlxuICAgKlxuICAgKiBXaGV0aGVyIHRoZSBtYXBwZWQgcGF0aCBpcyByZWxhdGl2ZSBpcyBkZWZpbmVkIGFzIGl0IGJlaW5nIFwiYmVsb3cgdGhlIGBmcm9tUGF0aGBcIiBhbmQgbm90XG4gICAqIGNvbnRhaW5pbmcgYG5vZGVfbW9kdWxlc2AuXG4gICAqXG4gICAqIElmIHRoZSBtYXBwZWQgcGF0aCBpcyBub3QgcmVsYXRpdmUgYnV0IGRvZXMgbm90IHJlc29sdmUgdG8gYW4gZXh0ZXJuYWwgZW50cnktcG9pbnQsIHRoZW4gd2VcbiAgICogY2hlY2sgd2hldGhlciBpdCB3b3VsZCBoYXZlIHJlc29sdmVkIHRvIGEgcmVsYXRpdmUgcGF0aCwgaW4gd2hpY2ggY2FzZSBpdCBpcyBtYXJrZWQgYXMgYVxuICAgKiBcImRlZXAtaW1wb3J0XCIuXG4gICAqL1xuICBwcml2YXRlIHJlc29sdmVCeVBhdGhNYXBwaW5ncyhtb2R1bGVOYW1lOiBzdHJpbmcsIGZyb21QYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IFJlc29sdmVkTW9kdWxlfG51bGwge1xuICAgIGNvbnN0IG1hcHBlZFBhdGhzID0gdGhpcy5maW5kTWFwcGVkUGF0aHMobW9kdWxlTmFtZSk7XG4gICAgaWYgKG1hcHBlZFBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gdGhpcy5maW5kUGFja2FnZVBhdGgoZnJvbVBhdGgpO1xuICAgICAgaWYgKHBhY2thZ2VQYXRoICE9PSBudWxsKSB7XG4gICAgICAgIGZvciAoY29uc3QgbWFwcGVkUGF0aCBvZiBtYXBwZWRQYXRocykge1xuICAgICAgICAgIGlmICh0aGlzLmlzRW50cnlQb2ludChtYXBwZWRQYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZXNvbHZlZEV4dGVybmFsTW9kdWxlKG1hcHBlZFBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBub25FbnRyeVBvaW50SW1wb3J0ID0gdGhpcy5yZXNvbHZlQXNSZWxhdGl2ZVBhdGgobWFwcGVkUGF0aCwgZnJvbVBhdGgpO1xuICAgICAgICAgIGlmIChub25FbnRyeVBvaW50SW1wb3J0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNSZWxhdGl2ZUltcG9ydChwYWNrYWdlUGF0aCwgbWFwcGVkUGF0aCkgPyBub25FbnRyeVBvaW50SW1wb3J0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSZXNvbHZlZERlZXBJbXBvcnQobWFwcGVkUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byByZXNvbHZlIHRoZSBgbW9kdWxlTmFtZWAgYXMgYW4gZXh0ZXJuYWwgZW50cnktcG9pbnQgYnkgc2VhcmNoaW5nIHRoZSBgbm9kZV9tb2R1bGVzYFxuICAgKiBmb2xkZXJzIHVwIHRoZSB0cmVlIGZvciBhIG1hdGNoaW5nIGAuLi4vbm9kZV9tb2R1bGVzLyR7bW9kdWxlTmFtZX1gLlxuICAgKlxuICAgKiBJZiBhIGZvbGRlciBpcyBmb3VuZCBidXQgdGhlIHBhdGggZG9lcyBub3QgY29udGFpbiBhIGBwYWNrYWdlLmpzb25gIHRoZW4gaXQgaXMgbWFya2VkIGFzIGFcbiAgICogXCJkZWVwLWltcG9ydFwiLlxuICAgKi9cbiAgcHJpdmF0ZSByZXNvbHZlQXNFbnRyeVBvaW50KG1vZHVsZU5hbWU6IHN0cmluZywgZnJvbVBhdGg6IEFic29sdXRlRnNQYXRoKTogUmVzb2x2ZWRNb2R1bGV8bnVsbCB7XG4gICAgbGV0IGZvbGRlciA9IGZyb21QYXRoO1xuICAgIHdoaWxlICghaXNSb290KGZvbGRlcikpIHtcbiAgICAgIGZvbGRlciA9IGRpcm5hbWUoZm9sZGVyKTtcbiAgICAgIGlmIChmb2xkZXIuZW5kc1dpdGgoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgIC8vIFNraXAgdXAgaWYgdGhlIGZvbGRlciBhbHJlYWR5IGVuZHMgaW4gbm9kZV9tb2R1bGVzXG4gICAgICAgIGZvbGRlciA9IGRpcm5hbWUoZm9sZGVyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1vZHVsZVBhdGggPSByZXNvbHZlKGZvbGRlciwgJ25vZGVfbW9kdWxlcycsIG1vZHVsZU5hbWUpO1xuICAgICAgaWYgKHRoaXMuaXNFbnRyeVBvaW50KG1vZHVsZVBhdGgpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzb2x2ZWRFeHRlcm5hbE1vZHVsZShtb2R1bGVQYXRoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvbHZlQXNSZWxhdGl2ZVBhdGgobW9kdWxlUGF0aCwgZnJvbVBhdGgpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzb2x2ZWREZWVwSW1wb3J0KG1vZHVsZVBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbiB3ZSBjb25zaWRlciB0aGUgZ2l2ZW4gcGF0aCBhcyBhbiBlbnRyeS1wb2ludCB0byBhIHBhY2thZ2U/XG4gICAqXG4gICAqIFRoaXMgaXMgYWNoaWV2ZWQgYnkgY2hlY2tpbmcgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYCR7bW9kdWxlUGF0aH0vcGFja2FnZS5qc29uYC5cbiAgICovXG4gIHByaXZhdGUgaXNFbnRyeVBvaW50KG1vZHVsZVBhdGg6IEFic29sdXRlRnNQYXRoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZnMuZXhpc3RzKGpvaW4obW9kdWxlUGF0aCwgJ3BhY2thZ2UuanNvbicpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgYHBhdGhNYXBwZXJzYCB0byB0aGUgYG1vZHVsZU5hbWVgIGFuZCByZXR1cm4gYWxsIHRoZSBwb3NzaWJsZVxuICAgKiBwYXRocyB0aGF0IG1hdGNoLlxuICAgKlxuICAgKiBUaGUgbWFwcGVkIHBhdGggaXMgY29tcHV0ZWQgZm9yIGVhY2ggdGVtcGxhdGUgaW4gYG1hcHBpbmcudGVtcGxhdGVzYCBieVxuICAgKiByZXBsYWNpbmcgdGhlIGBtYXRjaGVyLnByZWZpeGAgYW5kIGBtYXRjaGVyLnBvc3RmaXhgIHN0cmluZ3MgaW4gYHBhdGggd2l0aCB0aGVcbiAgICogYHRlbXBsYXRlLnByZWZpeGAgYW5kIGB0ZW1wbGF0ZS5wb3N0Zml4YCBzdHJpbmdzLlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kTWFwcGVkUGF0aHMobW9kdWxlTmFtZTogc3RyaW5nKTogQWJzb2x1dGVGc1BhdGhbXSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMucGF0aE1hcHBpbmdzLm1hcChtYXBwaW5nID0+IHRoaXMubWF0Y2hNYXBwaW5nKG1vZHVsZU5hbWUsIG1hcHBpbmcpKTtcblxuICAgIGxldCBiZXN0TWFwcGluZzogUHJvY2Vzc2VkUGF0aE1hcHBpbmd8dW5kZWZpbmVkO1xuICAgIGxldCBiZXN0TWF0Y2g6IHN0cmluZ3x1bmRlZmluZWQ7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXRoTWFwcGluZ3MubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBtYXBwaW5nID0gdGhpcy5wYXRoTWFwcGluZ3NbaW5kZXhdO1xuICAgICAgY29uc3QgbWF0Y2ggPSBtYXRjaGVzW2luZGV4XTtcbiAgICAgIGlmIChtYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAvLyBJZiB0aGlzIG1hcHBpbmcgaGFkIG5vIHdpbGRjYXJkIHRoZW4gdGhpcyBtdXN0IGJlIGEgY29tcGxldGUgbWF0Y2guXG4gICAgICAgIGlmICghbWFwcGluZy5tYXRjaGVyLmhhc1dpbGRjYXJkKSB7XG4gICAgICAgICAgYmVzdE1hdGNoID0gbWF0Y2g7XG4gICAgICAgICAgYmVzdE1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBiZXN0IG1hdGNoZWQgbWFwcGluZyBpcyB0aGUgb25lIHdpdGggdGhlIGxvbmdlc3QgcHJlZml4LlxuICAgICAgICBpZiAoIWJlc3RNYXBwaW5nIHx8IG1hcHBpbmcubWF0Y2hlci5wcmVmaXggPiBiZXN0TWFwcGluZy5tYXRjaGVyLnByZWZpeCkge1xuICAgICAgICAgIGJlc3RNYXRjaCA9IG1hdGNoO1xuICAgICAgICAgIGJlc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoYmVzdE1hcHBpbmcgIT09IHVuZGVmaW5lZCAmJiBiZXN0TWF0Y2ggIT09IHVuZGVmaW5lZCkgP1xuICAgICAgICB0aGlzLmNvbXB1dGVNYXBwZWRUZW1wbGF0ZXMoYmVzdE1hcHBpbmcsIGJlc3RNYXRjaCkgOlxuICAgICAgICBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIGZpbmQgYSBtYXBwZWQgcGF0aCBmb3IgdGhlIGdpdmVuIGBwYXRoYCBhbmQgYSBgbWFwcGluZ2AuXG4gICAqXG4gICAqIFRoZSBgcGF0aGAgbWF0Y2hlcyB0aGUgYG1hcHBpbmdgIGlmIGlmIGl0IHN0YXJ0cyB3aXRoIGBtYXRjaGVyLnByZWZpeGAgYW5kIGVuZHMgd2l0aFxuICAgKiBgbWF0Y2hlci5wb3N0Zml4YC5cbiAgICpcbiAgICogQHJldHVybnMgdGhlIHdpbGRjYXJkIHNlZ21lbnQgb2YgYSBtYXRjaGVkIGBwYXRoYCwgb3IgYG51bGxgIGlmIG5vIG1hdGNoLlxuICAgKi9cbiAgcHJpdmF0ZSBtYXRjaE1hcHBpbmcocGF0aDogc3RyaW5nLCBtYXBwaW5nOiBQcm9jZXNzZWRQYXRoTWFwcGluZyk6IHN0cmluZ3xudWxsIHtcbiAgICBjb25zdCB7cHJlZml4LCBwb3N0Zml4LCBoYXNXaWxkY2FyZH0gPSBtYXBwaW5nLm1hdGNoZXI7XG4gICAgaWYgKGhhc1dpbGRjYXJkKSB7XG4gICAgICByZXR1cm4gKHBhdGguc3RhcnRzV2l0aChwcmVmaXgpICYmIHBhdGguZW5kc1dpdGgocG9zdGZpeCkpID9cbiAgICAgICAgICBwYXRoLnN1YnN0cmluZyhwcmVmaXgubGVuZ3RoLCBwYXRoLmxlbmd0aCAtIHBvc3RmaXgubGVuZ3RoKSA6XG4gICAgICAgICAgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChwYXRoID09PSBwcmVmaXgpID8gJycgOiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBjYW5kaWRhdGUgcGF0aHMgZnJvbSB0aGUgZ2l2ZW4gbWFwcGluZydzIHRlbXBsYXRlcyB1c2luZyB0aGUgbWF0Y2hlZFxuICAgKiBzdHJpbmcuXG4gICAqL1xuICBwcml2YXRlIGNvbXB1dGVNYXBwZWRUZW1wbGF0ZXMobWFwcGluZzogUHJvY2Vzc2VkUGF0aE1hcHBpbmcsIG1hdGNoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWFwcGluZy50ZW1wbGF0ZXMubWFwKFxuICAgICAgICB0ZW1wbGF0ZSA9PiByZXNvbHZlKG1hcHBpbmcuYmFzZVVybCwgdGVtcGxhdGUucHJlZml4ICsgbWF0Y2ggKyB0ZW1wbGF0ZS5wb3N0Zml4KSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIHVwIHRoZSBmb2xkZXIgdHJlZSBmb3IgdGhlIGZpcnN0IGZvbGRlciB0aGF0IGNvbnRhaW5zIGBwYWNrYWdlLmpzb25gXG4gICAqIG9yIGBudWxsYCBpZiBub25lIGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kUGFja2FnZVBhdGgocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBBYnNvbHV0ZUZzUGF0aHxudWxsIHtcbiAgICBsZXQgZm9sZGVyID0gcGF0aDtcbiAgICB3aGlsZSAoIWlzUm9vdChmb2xkZXIpKSB7XG4gICAgICBmb2xkZXIgPSBkaXJuYW1lKGZvbGRlcik7XG4gICAgICBpZiAodGhpcy5mcy5leGlzdHMoam9pbihmb2xkZXIsICdwYWNrYWdlLmpzb24nKSkpIHtcbiAgICAgICAgcmV0dXJuIGZvbGRlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqIFRoZSByZXN1bHQgb2YgcmVzb2x2aW5nIGFuIGltcG9ydCB0byBhIG1vZHVsZS4gKi9cbmV4cG9ydCB0eXBlIFJlc29sdmVkTW9kdWxlID0gUmVzb2x2ZWRFeHRlcm5hbE1vZHVsZSB8IFJlc29sdmVkUmVsYXRpdmVNb2R1bGUgfCBSZXNvbHZlZERlZXBJbXBvcnQ7XG5cbi8qKlxuICogQSBtb2R1bGUgdGhhdCBpcyBleHRlcm5hbCB0byB0aGUgcGFja2FnZSBkb2luZyB0aGUgaW1wb3J0aW5nLlxuICogSW4gdGhpcyBjYXNlIHdlIGNhcHR1cmUgdGhlIGZvbGRlciBjb250YWluaW5nIHRoZSBlbnRyeS1wb2ludC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc29sdmVkRXh0ZXJuYWxNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZW50cnlQb2ludFBhdGg6IEFic29sdXRlRnNQYXRoKSB7fVxufVxuXG4vKipcbiAqIEEgbW9kdWxlIHRoYXQgaXMgcmVsYXRpdmUgdG8gdGhlIG1vZHVsZSBkb2luZyB0aGUgaW1wb3J0aW5nLCBhbmQgc28gaW50ZXJuYWwgdG8gdGhlXG4gKiBzb3VyY2UgbW9kdWxlJ3MgcGFja2FnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc29sdmVkUmVsYXRpdmVNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlUGF0aDogQWJzb2x1dGVGc1BhdGgpIHt9XG59XG5cbi8qKlxuICogQSBtb2R1bGUgdGhhdCBpcyBleHRlcm5hbCB0byB0aGUgcGFja2FnZSBkb2luZyB0aGUgaW1wb3J0aW5nIGJ1dCBwb2ludGluZyB0byBhXG4gKiBtb2R1bGUgdGhhdCBpcyBkZWVwIGluc2lkZSBhIHBhY2thZ2UsIHJhdGhlciB0aGFuIHRvIGFuIGVudHJ5LXBvaW50IG9mIHRoZSBwYWNrYWdlLlxuICovXG5leHBvcnQgY2xhc3MgUmVzb2x2ZWREZWVwSW1wb3J0IHtcbiAgY29uc3RydWN0b3IocHVibGljIGltcG9ydFBhdGg6IEFic29sdXRlRnNQYXRoKSB7fVxufVxuXG5mdW5jdGlvbiBzcGxpdE9uU3RhcihzdHI6IHN0cmluZyk6IFBhdGhNYXBwaW5nUGF0dGVybiB7XG4gIGNvbnN0IFtwcmVmaXgsIHBvc3RmaXhdID0gc3RyLnNwbGl0KCcqJywgMik7XG4gIHJldHVybiB7cHJlZml4LCBwb3N0Zml4OiBwb3N0Zml4IHx8ICcnLCBoYXNXaWxkY2FyZDogcG9zdGZpeCAhPT0gdW5kZWZpbmVkfTtcbn1cblxuaW50ZXJmYWNlIFByb2Nlc3NlZFBhdGhNYXBwaW5nIHtcbiAgYmFzZVVybDogQWJzb2x1dGVGc1BhdGg7XG4gIG1hdGNoZXI6IFBhdGhNYXBwaW5nUGF0dGVybjtcbiAgdGVtcGxhdGVzOiBQYXRoTWFwcGluZ1BhdHRlcm5bXTtcbn1cblxuaW50ZXJmYWNlIFBhdGhNYXBwaW5nUGF0dGVybiB7XG4gIHByZWZpeDogc3RyaW5nO1xuICBwb3N0Zml4OiBzdHJpbmc7XG4gIGhhc1dpbGRjYXJkOiBib29sZWFuO1xufVxuXG5mdW5jdGlvbiBpc1JlbGF0aXZlSW1wb3J0KGZyb206IEFic29sdXRlRnNQYXRoLCB0bzogQWJzb2x1dGVGc1BhdGgpIHtcbiAgcmV0dXJuIHRvLnN0YXJ0c1dpdGgoZnJvbSkgJiYgIXRvLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKTtcbn1cbiJdfQ==
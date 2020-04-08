(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/entry_point", ["require", "exports", "tslib", "canonical-path", "path", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/host/umd_host", "@angular/compiler-cli/ngcc/src/utils"], factory);
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
    var canonical_path_1 = require("canonical-path");
    var path_1 = require("path");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var umd_host_1 = require("@angular/compiler-cli/ngcc/src/host/umd_host");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    // We need to keep the elements of this const and the `EntryPointJsonProperty` type in sync.
    exports.SUPPORTED_FORMAT_PROPERTIES = ['fesm2015', 'fesm5', 'es2015', 'esm2015', 'esm5', 'main', 'module'];
    /**
     * Try to create an entry-point from the given paths and properties.
     *
     * @param packagePath the absolute path to the containing npm package
     * @param entryPointPath the absolute path to the potential entry-point.
     * @returns An entry-point if it is valid, `null` otherwise.
     */
    function getEntryPointInfo(fs, config, logger, packagePath, entryPointPath) {
        var packageJsonPath = file_system_1.resolve(entryPointPath, 'package.json');
        var entryPointConfig = config.getConfig(packagePath).entryPoints[entryPointPath];
        if (entryPointConfig === undefined && !fs.exists(packageJsonPath)) {
            return null;
        }
        if (entryPointConfig !== undefined && entryPointConfig.ignore === true) {
            return null;
        }
        var loadedEntryPointPackageJson = loadEntryPointPackage(fs, logger, packageJsonPath, entryPointConfig !== undefined);
        var entryPointPackageJson = mergeConfigAndPackageJson(loadedEntryPointPackageJson, entryPointConfig, packagePath, entryPointPath);
        if (entryPointPackageJson === null) {
            return null;
        }
        // We must have a typings property
        var typings = entryPointPackageJson.typings || entryPointPackageJson.types ||
            guessTypingsFromPackageJson(fs, entryPointPath, entryPointPackageJson);
        if (!typings) {
            return null;
        }
        // An entry-point is assumed to be compiled by Angular if there is either:
        // * a `metadata.json` file next to the typings entry-point
        // * a custom config for this entry-point
        var metadataPath = file_system_1.resolve(entryPointPath, typings.replace(/\.d\.ts$/, '') + '.metadata.json');
        var compiledByAngular = entryPointConfig !== undefined || fs.exists(metadataPath);
        var entryPointInfo = {
            name: entryPointPackageJson.name,
            packageJson: entryPointPackageJson,
            package: packagePath,
            path: entryPointPath,
            typings: file_system_1.resolve(entryPointPath, typings), compiledByAngular: compiledByAngular,
        };
        return entryPointInfo;
    }
    exports.getEntryPointInfo = getEntryPointInfo;
    /**
     * Convert a package.json property into an entry-point format.
     *
     * @param property The property to convert to a format.
     * @returns An entry-point format or `undefined` if none match the given property.
     */
    function getEntryPointFormat(fs, entryPoint, property) {
        switch (property) {
            case 'fesm2015':
                return 'esm2015';
            case 'fesm5':
                return 'esm5';
            case 'es2015':
                return 'esm2015';
            case 'esm2015':
                return 'esm2015';
            case 'esm5':
                return 'esm5';
            case 'main':
                var mainFile = entryPoint.packageJson['main'];
                if (mainFile === undefined) {
                    return undefined;
                }
                var pathToMain = file_system_1.join(entryPoint.path, mainFile);
                return isUmdModule(fs, pathToMain) ? 'umd' : 'commonjs';
            case 'module':
                return 'esm5';
            default:
                return undefined;
        }
    }
    exports.getEntryPointFormat = getEntryPointFormat;
    /**
     * Parses the JSON from a package.json file.
     * @param packageJsonPath the absolute path to the package.json file.
     * @returns JSON from the package.json file if it is valid, `null` otherwise.
     */
    function loadEntryPointPackage(fs, logger, packageJsonPath, hasConfig) {
        try {
            return JSON.parse(fs.readFile(packageJsonPath));
        }
        catch (e) {
            if (!hasConfig) {
                // We may have run into a package.json with unexpected symbols
                logger.warn("Failed to read entry point info from " + packageJsonPath + " with error " + e + ".");
            }
            return null;
        }
    }
    function isUmdModule(fs, sourceFilePath) {
        var resolvedPath = utils_1.resolveFileWithPostfixes(fs, sourceFilePath, ['', '.js', '/index.js']);
        if (resolvedPath === null) {
            return false;
        }
        var sourceFile = ts.createSourceFile(sourceFilePath, fs.readFile(resolvedPath), ts.ScriptTarget.ES5);
        return sourceFile.statements.length > 0 &&
            umd_host_1.parseStatementForUmdModule(sourceFile.statements[0]) !== null;
    }
    function mergeConfigAndPackageJson(entryPointPackageJson, entryPointConfig, packagePath, entryPointPath) {
        if (entryPointPackageJson !== null) {
            if (entryPointConfig === undefined) {
                return entryPointPackageJson;
            }
            else {
                return tslib_1.__assign({}, entryPointPackageJson, entryPointConfig.override);
            }
        }
        else {
            if (entryPointConfig === undefined) {
                return null;
            }
            else {
                var name = path_1.basename(packagePath) + "/" + canonical_path_1.relative(packagePath, entryPointPath);
                return tslib_1.__assign({ name: name }, entryPointConfig.override);
            }
        }
    }
    function guessTypingsFromPackageJson(fs, entryPointPath, entryPointPackageJson) {
        var e_1, _a;
        try {
            for (var SUPPORTED_FORMAT_PROPERTIES_1 = tslib_1.__values(exports.SUPPORTED_FORMAT_PROPERTIES), SUPPORTED_FORMAT_PROPERTIES_1_1 = SUPPORTED_FORMAT_PROPERTIES_1.next(); !SUPPORTED_FORMAT_PROPERTIES_1_1.done; SUPPORTED_FORMAT_PROPERTIES_1_1 = SUPPORTED_FORMAT_PROPERTIES_1.next()) {
                var prop = SUPPORTED_FORMAT_PROPERTIES_1_1.value;
                var field = entryPointPackageJson[prop];
                if (typeof field !== 'string') {
                    // Some crazy packages have things like arrays in these fields!
                    continue;
                }
                var relativeTypingsPath = field.replace(/\.js$/, '.d.ts');
                var typingsPath = file_system_1.resolve(entryPointPath, relativeTypingsPath);
                if (fs.exists(typingsPath)) {
                    return typingsPath;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (SUPPORTED_FORMAT_PROPERTIES_1_1 && !SUPPORTED_FORMAT_PROPERTIES_1_1.done && (_a = SUPPORTED_FORMAT_PROPERTIES_1.return)) _a.call(SUPPORTED_FORMAT_PROPERTIES_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcGFja2FnZXMvZW50cnlfcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsaURBQXdDO0lBQ3hDLDZCQUE4QjtJQUM5QiwrQkFBaUM7SUFDakMsMkVBQXlGO0lBQ3pGLHlFQUE0RDtJQUU1RCw4REFBa0Q7SUFnRGxELDRGQUE0RjtJQUMvRSxRQUFBLDJCQUEyQixHQUNwQyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXpFOzs7Ozs7T0FNRztJQUNILFNBQWdCLGlCQUFpQixDQUM3QixFQUFjLEVBQUUsTUFBeUIsRUFBRSxNQUFjLEVBQUUsV0FBMkIsRUFDdEYsY0FBOEI7UUFDaEMsSUFBTSxlQUFlLEdBQUcscUJBQU8sQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDaEUsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuRixJQUFJLGdCQUFnQixLQUFLLFNBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDakUsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksZ0JBQWdCLEtBQUssU0FBUyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDdEUsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sMkJBQTJCLEdBQzdCLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFD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WUFDOUMsS0FBbUIsSUFBQSxnQ0FBQSxpQkFBQSxtQ0FBMkIsQ0FBQSx3RUFBQSxpSEFBRTtnQkFBM0MsSUFBTSxJQUFJLHdDQUFBO2dCQUNiLElBQU0sS0FBSyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtvQkFDN0IsK0RBQStEO29CQUMvRCxTQUFTO2lCQUNWO2dCQUNELElBQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzVELElBQU0sV0FBVyxHQUFHLHFCQUFPLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ2pFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDMUIsT0FBTyxXQUFXLENBQUM7aUJBQ3BCO2FBQ0Y7Ozs7Ozs7OztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7cmVsYXRpdmV9IGZyb20gJ2Nhbm9uaWNhbC1wYXRoJztcbmltcG9ydCB7YmFzZW5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtLCBqb2luLCByZXNvbHZlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtwYXJzZVN0YXRlbWVudEZvclVtZE1vZHVsZX0gZnJvbSAnLi4vaG9zdC91bWRfaG9zdCc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXInO1xuaW1wb3J0IHtyZXNvbHZlRmlsZVdpdGhQb3N0Zml4ZXN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7TmdjY0NvbmZpZ3VyYXRpb24sIE5nY2NFbnRyeVBvaW50Q29uZmlnfSBmcm9tICcuL2NvbmZpZ3VyYXRpb24nO1xuXG4vKipcbiAqIFRoZSBwb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBmb3JtYXQgb2YgYW4gZW50cnktcG9pbnQuXG4gKi9cbmV4cG9ydCB0eXBlIEVudHJ5UG9pbnRGb3JtYXQgPSAnZXNtNScgfCAnZXNtMjAxNScgfCAndW1kJyB8ICdjb21tb25qcyc7XG5cbi8qKlxuICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgYW4gZW50cnktcG9pbnQsIGluY2x1ZGluZyBwYXRoc1xuICogdG8gZWFjaCBvZiB0aGUgcG9zc2libGUgZW50cnktcG9pbnQgZm9ybWF0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRyeVBvaW50IHtcbiAgLyoqIFRoZSBuYW1lIG9mIHRoZSBwYWNrYWdlIChlLmcuIGBAYW5ndWxhci9jb3JlYCkuICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqIFRoZSBwYXJzZWQgcGFja2FnZS5qc29uIGZpbGUgZm9yIHRoaXMgZW50cnktcG9pbnQuICovXG4gIHBhY2thZ2VKc29uOiBFbnRyeVBvaW50UGFja2FnZUpzb247XG4gIC8qKiBUaGUgcGF0aCB0byB0aGUgcGFja2FnZSB0aGF0IGNvbnRhaW5zIHRoaXMgZW50cnktcG9pbnQuICovXG4gIHBhY2thZ2U6IEFic29sdXRlRnNQYXRoO1xuICAvKiogVGhlIHBhdGggdG8gdGhpcyBlbnRyeSBwb2ludC4gKi9cbiAgcGF0aDogQWJzb2x1dGVGc1BhdGg7XG4gIC8qKiBUaGUgcGF0aCB0byBhIHR5cGluZ3MgKC5kLnRzKSBmaWxlIGZvciB0aGlzIGVudHJ5LXBvaW50LiAqL1xuICB0eXBpbmdzOiBBYnNvbHV0ZUZzUGF0aDtcbiAgLyoqIElzIHRoaXMgRW50cnlQb2ludCBjb21waWxlZCB3aXRoIHRoZSBBbmd1bGFyIFZpZXcgRW5naW5lIGNvbXBpbGVyPyAqL1xuICBjb21waWxlZEJ5QW5ndWxhcjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYWNrYWdlSnNvbkZvcm1hdFByb3BlcnRpZXMge1xuICBmZXNtMjAxNT86IHN0cmluZztcbiAgZmVzbTU/OiBzdHJpbmc7XG4gIGVzMjAxNT86IHN0cmluZzsgIC8vIGlmIGV4aXN0cyB0aGVuIGl0IGlzIGFjdHVhbGx5IEZFU00yMDE1XG4gIGVzbTIwMTU/OiBzdHJpbmc7XG4gIGVzbTU/OiBzdHJpbmc7XG4gIG1haW4/OiBzdHJpbmc7ICAgICAvLyBVTURcbiAgbW9kdWxlPzogc3RyaW5nOyAgIC8vIGlmIGV4aXN0cyB0aGVuIGl0IGlzIGFjdHVhbGx5IEZFU001XG4gIHR5cGVzPzogc3RyaW5nOyAgICAvLyBTeW5vbnltb3VzIHRvIGB0eXBpbmdzYCBwcm9wZXJ0eSAtIHNlZSBodHRwczovL2JpdC5seS8yT2dXcDJIXG4gIHR5cGluZ3M/OiBzdHJpbmc7ICAvLyBUeXBlU2NyaXB0IC5kLnRzIGZpbGVzXG59XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgdGhhdCBtYXkgYmUgbG9hZGVkIGZyb20gdGhlIGBwYWNrYWdlLmpzb25gIGZpbGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50cnlQb2ludFBhY2thZ2VKc29uIGV4dGVuZHMgUGFja2FnZUpzb25Gb3JtYXRQcm9wZXJ0aWVzIHtcbiAgbmFtZTogc3RyaW5nO1xuICBfX3Byb2Nlc3NlZF9ieV9pdnlfbmdjY19fPzoge1trZXk6IHN0cmluZ106IHN0cmluZ307XG59XG5cbmV4cG9ydCB0eXBlIEVudHJ5UG9pbnRKc29uUHJvcGVydHkgPSBrZXlvZihQYWNrYWdlSnNvbkZvcm1hdFByb3BlcnRpZXMpO1xuLy8gV2UgbmVlZCB0byBrZWVwIHRoZSBlbGVtZW50cyBvZiB0aGlzIGNvbnN0IGFuZCB0aGUgYEVudHJ5UG9pbnRKc29uUHJvcGVydHlgIHR5cGUgaW4gc3luYy5cbmV4cG9ydCBjb25zdCBTVVBQT1JURURfRk9STUFUX1BST1BFUlRJRVM6IEVudHJ5UG9pbnRKc29uUHJvcGVydHlbXSA9XG4gICAgWydmZXNtMjAxNScsICdmZXNtNScsICdlczIwMTUnLCAnZXNtMjAxNScsICdlc201JywgJ21haW4nLCAnbW9kdWxlJ107XG5cbi8qKlxuICogVHJ5IHRvIGNyZWF0ZSBhbiBlbnRyeS1wb2ludCBmcm9tIHRoZSBnaXZlbiBwYXRocyBhbmQgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gcGFja2FnZVBhdGggdGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGNvbnRhaW5pbmcgbnBtIHBhY2thZ2VcbiAqIEBwYXJhbSBlbnRyeVBvaW50UGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcG90ZW50aWFsIGVudHJ5LXBvaW50LlxuICogQHJldHVybnMgQW4gZW50cnktcG9pbnQgaWYgaXQgaXMgdmFsaWQsIGBudWxsYCBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnRyeVBvaW50SW5mbyhcbiAgICBmczogRmlsZVN5c3RlbSwgY29uZmlnOiBOZ2NjQ29uZmlndXJhdGlvbiwgbG9nZ2VyOiBMb2dnZXIsIHBhY2thZ2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICBlbnRyeVBvaW50UGF0aDogQWJzb2x1dGVGc1BhdGgpOiBFbnRyeVBvaW50fG51bGwge1xuICBjb25zdCBwYWNrYWdlSnNvblBhdGggPSByZXNvbHZlKGVudHJ5UG9pbnRQYXRoLCAncGFja2FnZS5qc29uJyk7XG4gIGNvbnN0IGVudHJ5UG9pbnRDb25maWcgPSBjb25maWcuZ2V0Q29uZmlnKHBhY2thZ2VQYXRoKS5lbnRyeVBvaW50c1tlbnRyeVBvaW50UGF0aF07XG4gIGlmIChlbnRyeVBvaW50Q29uZmlnID09PSB1bmRlZmluZWQgJiYgIWZzLmV4aXN0cyhwYWNrYWdlSnNvblBhdGgpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoZW50cnlQb2ludENvbmZpZyAhPT0gdW5kZWZpbmVkICYmIGVudHJ5UG9pbnRDb25maWcuaWdub3JlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBsb2FkZWRFbnRyeVBvaW50UGFja2FnZUpzb24gPVxuICAgICAgbG9hZEVudHJ5UG9pbnRQYWNrYWdlKGZzLCBsb2dnZXIsIHBhY2thZ2VKc29uUGF0aCwgZW50cnlQb2ludENvbmZpZyAhPT0gdW5kZWZpbmVkKTtcbiAgY29uc3QgZW50cnlQb2ludFBhY2thZ2VKc29uID0gbWVyZ2VDb25maWdBbmRQYWNrYWdlSnNvbihcbiAgICAgIGxvYWRlZEVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgZW50cnlQb2ludENvbmZpZywgcGFja2FnZVBhdGgsIGVudHJ5UG9pbnRQYXRoKTtcbiAgaWYgKGVudHJ5UG9pbnRQYWNrYWdlSnNvbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gV2UgbXVzdCBoYXZlIGEgdHlwaW5ncyBwcm9wZXJ0eVxuICBjb25zdCB0eXBpbmdzID0gZW50cnlQb2ludFBhY2thZ2VKc29uLnR5cGluZ3MgfHwgZW50cnlQb2ludFBhY2thZ2VKc29uLnR5cGVzIHx8XG4gICAgICBndWVzc1R5cGluZ3NGcm9tUGFja2FnZUpzb24oZnMsIGVudHJ5UG9pbnRQYXRoLCBlbnRyeVBvaW50UGFja2FnZUpzb24pO1xuICBpZiAoIXR5cGluZ3MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFuIGVudHJ5LXBvaW50IGlzIGFzc3VtZWQgdG8gYmUgY29tcGlsZWQgYnkgQW5ndWxhciBpZiB0aGVyZSBpcyBlaXRoZXI6XG4gIC8vICogYSBgbWV0YWRhdGEuanNvbmAgZmlsZSBuZXh0IHRvIHRoZSB0eXBpbmdzIGVudHJ5LXBvaW50XG4gIC8vICogYSBjdXN0b20gY29uZmlnIGZvciB0aGlzIGVudHJ5LXBvaW50XG4gIGNvbnN0IG1ldGFkYXRhUGF0aCA9IHJlc29sdmUoZW50cnlQb2ludFBhdGgsIHR5cGluZ3MucmVwbGFjZSgvXFwuZFxcLnRzJC8sICcnKSArICcubWV0YWRhdGEuanNvbicpO1xuICBjb25zdCBjb21waWxlZEJ5QW5ndWxhciA9IGVudHJ5UG9pbnRDb25maWcgIT09IHVuZGVmaW5lZCB8fCBmcy5leGlzdHMobWV0YWRhdGFQYXRoKTtcblxuICBjb25zdCBlbnRyeVBvaW50SW5mbzogRW50cnlQb2ludCA9IHtcbiAgICBuYW1lOiBlbnRyeVBvaW50UGFja2FnZUpzb24ubmFtZSxcbiAgICBwYWNrYWdlSnNvbjogZW50cnlQb2ludFBhY2thZ2VKc29uLFxuICAgIHBhY2thZ2U6IHBhY2thZ2VQYXRoLFxuICAgIHBhdGg6IGVudHJ5UG9pbnRQYXRoLFxuICAgIHR5cGluZ3M6IHJlc29sdmUoZW50cnlQb2ludFBhdGgsIHR5cGluZ3MpLCBjb21waWxlZEJ5QW5ndWxhcixcbiAgfTtcblxuICByZXR1cm4gZW50cnlQb2ludEluZm87XG59XG5cbi8qKlxuICogQ29udmVydCBhIHBhY2thZ2UuanNvbiBwcm9wZXJ0eSBpbnRvIGFuIGVudHJ5LXBvaW50IGZvcm1hdC5cbiAqXG4gKiBAcGFyYW0gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNvbnZlcnQgdG8gYSBmb3JtYXQuXG4gKiBAcmV0dXJucyBBbiBlbnRyeS1wb2ludCBmb3JtYXQgb3IgYHVuZGVmaW5lZGAgaWYgbm9uZSBtYXRjaCB0aGUgZ2l2ZW4gcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnRyeVBvaW50Rm9ybWF0KFxuICAgIGZzOiBGaWxlU3lzdGVtLCBlbnRyeVBvaW50OiBFbnRyeVBvaW50LCBwcm9wZXJ0eTogc3RyaW5nKTogRW50cnlQb2ludEZvcm1hdHx1bmRlZmluZWQge1xuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnZmVzbTIwMTUnOlxuICAgICAgcmV0dXJuICdlc20yMDE1JztcbiAgICBjYXNlICdmZXNtNSc6XG4gICAgICByZXR1cm4gJ2VzbTUnO1xuICAgIGNhc2UgJ2VzMjAxNSc6XG4gICAgICByZXR1cm4gJ2VzbTIwMTUnO1xuICAgIGNhc2UgJ2VzbTIwMTUnOlxuICAgICAgcmV0dXJuICdlc20yMDE1JztcbiAgICBjYXNlICdlc201JzpcbiAgICAgIHJldHVybiAnZXNtNSc7XG4gICAgY2FzZSAnbWFpbic6XG4gICAgICBjb25zdCBtYWluRmlsZSA9IGVudHJ5UG9pbnQucGFja2FnZUpzb25bJ21haW4nXTtcbiAgICAgIGlmIChtYWluRmlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb25zdCBwYXRoVG9NYWluID0gam9pbihlbnRyeVBvaW50LnBhdGgsIG1haW5GaWxlKTtcbiAgICAgIHJldHVybiBpc1VtZE1vZHVsZShmcywgcGF0aFRvTWFpbikgPyAndW1kJyA6ICdjb21tb25qcyc7XG4gICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgIHJldHVybiAnZXNtNSc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIEpTT04gZnJvbSBhIHBhY2thZ2UuanNvbiBmaWxlLlxuICogQHBhcmFtIHBhY2thZ2VKc29uUGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcGFja2FnZS5qc29uIGZpbGUuXG4gKiBAcmV0dXJucyBKU09OIGZyb20gdGhlIHBhY2thZ2UuanNvbiBmaWxlIGlmIGl0IGlzIHZhbGlkLCBgbnVsbGAgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBsb2FkRW50cnlQb2ludFBhY2thZ2UoXG4gICAgZnM6IEZpbGVTeXN0ZW0sIGxvZ2dlcjogTG9nZ2VyLCBwYWNrYWdlSnNvblBhdGg6IEFic29sdXRlRnNQYXRoLFxuICAgIGhhc0NvbmZpZzogYm9vbGVhbik6IEVudHJ5UG9pbnRQYWNrYWdlSnNvbnxudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZShwYWNrYWdlSnNvblBhdGgpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmICghaGFzQ29uZmlnKSB7XG4gICAgICAvLyBXZSBtYXkgaGF2ZSBydW4gaW50byBhIHBhY2thZ2UuanNvbiB3aXRoIHVuZXhwZWN0ZWQgc3ltYm9sc1xuICAgICAgbG9nZ2VyLndhcm4oYEZhaWxlZCB0byByZWFkIGVudHJ5IHBvaW50IGluZm8gZnJvbSAke3BhY2thZ2VKc29uUGF0aH0gd2l0aCBlcnJvciAke2V9LmApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1VtZE1vZHVsZShmczogRmlsZVN5c3RlbSwgc291cmNlRmlsZVBhdGg6IEFic29sdXRlRnNQYXRoKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlc29sdmVkUGF0aCA9IHJlc29sdmVGaWxlV2l0aFBvc3RmaXhlcyhmcywgc291cmNlRmlsZVBhdGgsIFsnJywgJy5qcycsICcvaW5kZXguanMnXSk7XG4gIGlmIChyZXNvbHZlZFBhdGggPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3Qgc291cmNlRmlsZSA9XG4gICAgICB0cy5jcmVhdGVTb3VyY2VGaWxlKHNvdXJjZUZpbGVQYXRoLCBmcy5yZWFkRmlsZShyZXNvbHZlZFBhdGgpLCB0cy5TY3JpcHRUYXJnZXQuRVM1KTtcbiAgcmV0dXJuIHNvdXJjZUZpbGUuc3RhdGVtZW50cy5sZW5ndGggPiAwICYmXG4gICAgICBwYXJzZVN0YXRlbWVudEZvclVtZE1vZHVsZShzb3VyY2VGaWxlLnN0YXRlbWVudHNbMF0pICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBtZXJnZUNvbmZpZ0FuZFBhY2thZ2VKc29uKFxuICAgIGVudHJ5UG9pbnRQYWNrYWdlSnNvbjogRW50cnlQb2ludFBhY2thZ2VKc29uIHwgbnVsbCxcbiAgICBlbnRyeVBvaW50Q29uZmlnOiBOZ2NjRW50cnlQb2ludENvbmZpZyB8IHVuZGVmaW5lZCwgcGFja2FnZVBhdGg6IEFic29sdXRlRnNQYXRoLFxuICAgIGVudHJ5UG9pbnRQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEVudHJ5UG9pbnRQYWNrYWdlSnNvbnxudWxsIHtcbiAgaWYgKGVudHJ5UG9pbnRQYWNrYWdlSnNvbiAhPT0gbnVsbCkge1xuICAgIGlmIChlbnRyeVBvaW50Q29uZmlnID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBlbnRyeVBvaW50UGFja2FnZUpzb247XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7Li4uZW50cnlQb2ludFBhY2thZ2VKc29uLCAuLi5lbnRyeVBvaW50Q29uZmlnLm92ZXJyaWRlfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVudHJ5UG9pbnRDb25maWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHtiYXNlbmFtZShwYWNrYWdlUGF0aCl9LyR7cmVsYXRpdmUocGFja2FnZVBhdGgsIGVudHJ5UG9pbnRQYXRoKX1gO1xuICAgICAgcmV0dXJuIHtuYW1lLCAuLi5lbnRyeVBvaW50Q29uZmlnLm92ZXJyaWRlfTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ3Vlc3NUeXBpbmdzRnJvbVBhY2thZ2VKc29uKFxuICAgIGZzOiBGaWxlU3lzdGVtLCBlbnRyeVBvaW50UGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgZW50cnlQb2ludFBhY2thZ2VKc29uOiBFbnRyeVBvaW50UGFja2FnZUpzb24pOiBBYnNvbHV0ZUZzUGF0aHxudWxsIHtcbiAgZm9yIChjb25zdCBwcm9wIG9mIFNVUFBPUlRFRF9GT1JNQVRfUFJPUEVSVElFUykge1xuICAgIGNvbnN0IGZpZWxkID0gZW50cnlQb2ludFBhY2thZ2VKc29uW3Byb3BdO1xuICAgIGlmICh0eXBlb2YgZmllbGQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBTb21lIGNyYXp5IHBhY2thZ2VzIGhhdmUgdGhpbmdzIGxpa2UgYXJyYXlzIGluIHRoZXNlIGZpZWxkcyFcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCByZWxhdGl2ZVR5cGluZ3NQYXRoID0gZmllbGQucmVwbGFjZSgvXFwuanMkLywgJy5kLnRzJyk7XG4gICAgY29uc3QgdHlwaW5nc1BhdGggPSByZXNvbHZlKGVudHJ5UG9pbnRQYXRoLCByZWxhdGl2ZVR5cGluZ3NQYXRoKTtcbiAgICBpZiAoZnMuZXhpc3RzKHR5cGluZ3NQYXRoKSkge1xuICAgICAgcmV0dXJuIHR5cGluZ3NQYXRoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==
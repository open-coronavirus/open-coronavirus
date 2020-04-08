(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/ngcc/src/utils", "@angular/compiler-cli/ngcc/src/dependencies/dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/module_resolver"], factory);
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
    var ts = require("typescript");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    var dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dependency_host");
    var module_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/module_resolver");
    /**
     * Helper functions for computing dependencies.
     */
    var EsmDependencyHost = /** @class */ (function (_super) {
        tslib_1.__extends(EsmDependencyHost, _super);
        function EsmDependencyHost() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Compute the dependencies of the given file.
         *
         * @param file An absolute path to the file whose dependencies we want to get.
         * @param dependencies A set that will have the absolute paths of resolved entry points added to
         * it.
         * @param missing A set that will have the dependencies that could not be found added to it.
         * @param deepImports A set that will have the import paths that exist but cannot be mapped to
         * entry-points, i.e. deep-imports.
         * @param alreadySeen A set that is used to track internal dependencies to prevent getting stuck
         * in a circular dependency loop.
         */
        EsmDependencyHost.prototype.recursivelyFindDependencies = function (file, dependencies, missing, deepImports, alreadySeen) {
            var _this = this;
            var resolvedFile = utils_1.resolveFileWithPostfixes(this.fs, file, ['', '.js', '/index.js']);
            if (resolvedFile === null) {
                return;
            }
            var fromContents = this.fs.readFile(resolvedFile);
            if (!hasImportOrReexportStatements(fromContents)) {
                // Avoid parsing the source file as there are no imports.
                return;
            }
            // Parse the source into a TypeScript AST and then walk it looking for imports and re-exports.
            var sf = ts.createSourceFile(resolvedFile, fromContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
            sf.statements
                // filter out statements that are not imports or reexports
                .filter(isStringImportOrReexport)
                // Grab the id of the module that is being imported
                .map(function (stmt) { return stmt.moduleSpecifier.text; })
                // Resolve this module id into an absolute path
                .forEach(function (importPath) {
                var resolvedModule = _this.moduleResolver.resolveModuleImport(importPath, resolvedFile);
                if (resolvedModule) {
                    if (resolvedModule instanceof module_resolver_1.ResolvedRelativeModule) {
                        var internalDependency = resolvedModule.modulePath;
                        if (!alreadySeen.has(internalDependency)) {
                            alreadySeen.add(internalDependency);
                            _this.recursivelyFindDependencies(internalDependency, dependencies, missing, deepImports, alreadySeen);
                        }
                    }
                    else {
                        if (resolvedModule instanceof module_resolver_1.ResolvedDeepImport) {
                            deepImports.add(resolvedModule.importPath);
                        }
                        else {
                            dependencies.add(resolvedModule.entryPointPath);
                        }
                    }
                }
                else {
                    missing.add(importPath);
                }
            });
        };
        return EsmDependencyHost;
    }(dependency_host_1.DependencyHostBase));
    exports.EsmDependencyHost = EsmDependencyHost;
    /**
     * Check whether a source file needs to be parsed for imports.
     * This is a performance short-circuit, which saves us from creating
     * a TypeScript AST unnecessarily.
     *
     * @param source The content of the source file to check.
     *
     * @returns false if there are definitely no import or re-export statements
     * in this file, true otherwise.
     */
    function hasImportOrReexportStatements(source) {
        return /(import|export)\s.+from/.test(source);
    }
    exports.hasImportOrReexportStatements = hasImportOrReexportStatements;
    /**
     * Check whether the given statement is an import with a string literal module specifier.
     * @param stmt the statement node to check.
     * @returns true if the statement is an import with a string literal module specifier.
     */
    function isStringImportOrReexport(stmt) {
        return ts.isImportDeclaration(stmt) ||
            ts.isExportDeclaration(stmt) && !!stmt.moduleSpecifier &&
                ts.isStringLiteral(stmt.moduleSpecifier);
    }
    exports.isStringImportOrReexport = isStringImportOrReexport;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtX2RlcGVuZGVuY3lfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9kZXBlbmRlbmNpZXMvZXNtX2RlcGVuZGVuY3lfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFFakMsOERBQWtEO0lBQ2xELCtGQUFxRDtJQUNyRCwrRkFBNkU7SUFFN0U7O09BRUc7SUFDSDtRQUF1Qyw2Q0FBa0I7UUFBekQ7O1FBMERBLENBQUM7UUF6REM7Ozs7Ozs7Ozs7O1dBV0c7UUFDTyx1REFBMkIsR0FBckMsVUFDSSxJQUFvQixFQUFFLFlBQWlDLEVBQUUsT0FBb0IsRUFDN0UsV0FBd0IsRUFBRSxXQUFnQztZQUY5RCxpQkE0Q0M7WUF6Q0MsSUFBTSxZQUFZLEdBQUcsZ0NBQXdCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkYsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO2dCQUN6QixPQUFPO2FBQ1I7WUFDRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVwRCxJQUFJLENBQUMsNkJBQTZCLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ2hELHlEQUF5RDtnQkFDekQsT0FBTzthQUNSO1lBRUQsOEZBQThGO1lBQzlGLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDMUIsWUFBWSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRixFQUFFLENBQUMsVUFBVTtnQkFDVCwwREFBMEQ7aUJBQ3pELE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztnQkFDakMsbURBQW1EO2lCQUNsRCxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBekIsQ0FBeUIsQ0FBQztnQkFDdkMsK0NBQStDO2lCQUM5QyxPQUFPLENBQUMsVUFBQSxVQUFVO2dCQUNqQixJQUFNLGNBQWMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDekYsSUFBSSxjQUFjLEVBQUU7b0JBQ2xCLElBQUksY0FBYyxZQUFZLHdDQUFzQixFQUFFO3dCQUNwRCxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUM7d0JBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7NEJBQ3hDLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs0QkFDcEMsS0FBSSxDQUFDLDJCQUEyQixDQUM1QixrQkFBa0IsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQzt5QkFDMUU7cUJBQ0Y7eUJBQU07d0JBQ0wsSUFBSSxjQUFjLFlBQVksb0NBQWtCLEVBQUU7NEJBQ2hELFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3lCQUM1Qzs2QkFBTTs0QkFDTCxZQUFZLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDakQ7cUJBQ0Y7aUJBQ0Y7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDekI7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNULENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUExREQsQ0FBdUMsb0NBQWtCLEdBMER4RDtJQTFEWSw4Q0FBaUI7SUE0RDlCOzs7Ozs7Ozs7T0FTRztJQUNILFNBQWdCLDZCQUE2QixDQUFDLE1BQWM7UUFDMUQsT0FBTyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUZELHNFQUVDO0lBR0Q7Ozs7T0FJRztJQUNILFNBQWdCLHdCQUF3QixDQUFDLElBQWtCO1FBRXpELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQztZQUMvQixFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUN0RCxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBTEQsNERBS0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge3Jlc29sdmVGaWxlV2l0aFBvc3RmaXhlc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtEZXBlbmRlbmN5SG9zdEJhc2V9IGZyb20gJy4vZGVwZW5kZW5jeV9ob3N0JztcbmltcG9ydCB7UmVzb2x2ZWREZWVwSW1wb3J0LCBSZXNvbHZlZFJlbGF0aXZlTW9kdWxlfSBmcm9tICcuL21vZHVsZV9yZXNvbHZlcic7XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgY29tcHV0aW5nIGRlcGVuZGVuY2llcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVzbURlcGVuZGVuY3lIb3N0IGV4dGVuZHMgRGVwZW5kZW5jeUhvc3RCYXNlIHtcbiAgLyoqXG4gICAqIENvbXB1dGUgdGhlIGRlcGVuZGVuY2llcyBvZiB0aGUgZ2l2ZW4gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGZpbGUgQW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgZmlsZSB3aG9zZSBkZXBlbmRlbmNpZXMgd2Ugd2FudCB0byBnZXQuXG4gICAqIEBwYXJhbSBkZXBlbmRlbmNpZXMgQSBzZXQgdGhhdCB3aWxsIGhhdmUgdGhlIGFic29sdXRlIHBhdGhzIG9mIHJlc29sdmVkIGVudHJ5IHBvaW50cyBhZGRlZCB0b1xuICAgKiBpdC5cbiAgICogQHBhcmFtIG1pc3NpbmcgQSBzZXQgdGhhdCB3aWxsIGhhdmUgdGhlIGRlcGVuZGVuY2llcyB0aGF0IGNvdWxkIG5vdCBiZSBmb3VuZCBhZGRlZCB0byBpdC5cbiAgICogQHBhcmFtIGRlZXBJbXBvcnRzIEEgc2V0IHRoYXQgd2lsbCBoYXZlIHRoZSBpbXBvcnQgcGF0aHMgdGhhdCBleGlzdCBidXQgY2Fubm90IGJlIG1hcHBlZCB0b1xuICAgKiBlbnRyeS1wb2ludHMsIGkuZS4gZGVlcC1pbXBvcnRzLlxuICAgKiBAcGFyYW0gYWxyZWFkeVNlZW4gQSBzZXQgdGhhdCBpcyB1c2VkIHRvIHRyYWNrIGludGVybmFsIGRlcGVuZGVuY2llcyB0byBwcmV2ZW50IGdldHRpbmcgc3R1Y2tcbiAgICogaW4gYSBjaXJjdWxhciBkZXBlbmRlbmN5IGxvb3AuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVjdXJzaXZlbHlGaW5kRGVwZW5kZW5jaWVzKFxuICAgICAgZmlsZTogQWJzb2x1dGVGc1BhdGgsIGRlcGVuZGVuY2llczogU2V0PEFic29sdXRlRnNQYXRoPiwgbWlzc2luZzogU2V0PHN0cmluZz4sXG4gICAgICBkZWVwSW1wb3J0czogU2V0PHN0cmluZz4sIGFscmVhZHlTZWVuOiBTZXQ8QWJzb2x1dGVGc1BhdGg+KTogdm9pZCB7XG4gICAgY29uc3QgcmVzb2x2ZWRGaWxlID0gcmVzb2x2ZUZpbGVXaXRoUG9zdGZpeGVzKHRoaXMuZnMsIGZpbGUsIFsnJywgJy5qcycsICcvaW5kZXguanMnXSk7XG4gICAgaWYgKHJlc29sdmVkRmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmcm9tQ29udGVudHMgPSB0aGlzLmZzLnJlYWRGaWxlKHJlc29sdmVkRmlsZSk7XG5cbiAgICBpZiAoIWhhc0ltcG9ydE9yUmVleHBvcnRTdGF0ZW1lbnRzKGZyb21Db250ZW50cykpIHtcbiAgICAgIC8vIEF2b2lkIHBhcnNpbmcgdGhlIHNvdXJjZSBmaWxlIGFzIHRoZXJlIGFyZSBubyBpbXBvcnRzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIHRoZSBzb3VyY2UgaW50byBhIFR5cGVTY3JpcHQgQVNUIGFuZCB0aGVuIHdhbGsgaXQgbG9va2luZyBmb3IgaW1wb3J0cyBhbmQgcmUtZXhwb3J0cy5cbiAgICBjb25zdCBzZiA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICAgIHJlc29sdmVkRmlsZSwgZnJvbUNvbnRlbnRzLCB0cy5TY3JpcHRUYXJnZXQuRVMyMDE1LCBmYWxzZSwgdHMuU2NyaXB0S2luZC5KUyk7XG4gICAgc2Yuc3RhdGVtZW50c1xuICAgICAgICAvLyBmaWx0ZXIgb3V0IHN0YXRlbWVudHMgdGhhdCBhcmUgbm90IGltcG9ydHMgb3IgcmVleHBvcnRzXG4gICAgICAgIC5maWx0ZXIoaXNTdHJpbmdJbXBvcnRPclJlZXhwb3J0KVxuICAgICAgICAvLyBHcmFiIHRoZSBpZCBvZiB0aGUgbW9kdWxlIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWRcbiAgICAgICAgLm1hcChzdG10ID0+IHN0bXQubW9kdWxlU3BlY2lmaWVyLnRleHQpXG4gICAgICAgIC8vIFJlc29sdmUgdGhpcyBtb2R1bGUgaWQgaW50byBhbiBhYnNvbHV0ZSBwYXRoXG4gICAgICAgIC5mb3JFYWNoKGltcG9ydFBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc29sdmVkTW9kdWxlID0gdGhpcy5tb2R1bGVSZXNvbHZlci5yZXNvbHZlTW9kdWxlSW1wb3J0KGltcG9ydFBhdGgsIHJlc29sdmVkRmlsZSk7XG4gICAgICAgICAgaWYgKHJlc29sdmVkTW9kdWxlKSB7XG4gICAgICAgICAgICBpZiAocmVzb2x2ZWRNb2R1bGUgaW5zdGFuY2VvZiBSZXNvbHZlZFJlbGF0aXZlTW9kdWxlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGludGVybmFsRGVwZW5kZW5jeSA9IHJlc29sdmVkTW9kdWxlLm1vZHVsZVBhdGg7XG4gICAgICAgICAgICAgIGlmICghYWxyZWFkeVNlZW4uaGFzKGludGVybmFsRGVwZW5kZW5jeSkpIHtcbiAgICAgICAgICAgICAgICBhbHJlYWR5U2Vlbi5hZGQoaW50ZXJuYWxEZXBlbmRlbmN5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY3Vyc2l2ZWx5RmluZERlcGVuZGVuY2llcyhcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEZXBlbmRlbmN5LCBkZXBlbmRlbmNpZXMsIG1pc3NpbmcsIGRlZXBJbXBvcnRzLCBhbHJlYWR5U2Vlbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChyZXNvbHZlZE1vZHVsZSBpbnN0YW5jZW9mIFJlc29sdmVkRGVlcEltcG9ydCkge1xuICAgICAgICAgICAgICAgIGRlZXBJbXBvcnRzLmFkZChyZXNvbHZlZE1vZHVsZS5pbXBvcnRQYXRoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMuYWRkKHJlc29sdmVkTW9kdWxlLmVudHJ5UG9pbnRQYXRoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtaXNzaW5nLmFkZChpbXBvcnRQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHNvdXJjZSBmaWxlIG5lZWRzIHRvIGJlIHBhcnNlZCBmb3IgaW1wb3J0cy5cbiAqIFRoaXMgaXMgYSBwZXJmb3JtYW5jZSBzaG9ydC1jaXJjdWl0LCB3aGljaCBzYXZlcyB1cyBmcm9tIGNyZWF0aW5nXG4gKiBhIFR5cGVTY3JpcHQgQVNUIHVubmVjZXNzYXJpbHkuXG4gKlxuICogQHBhcmFtIHNvdXJjZSBUaGUgY29udGVudCBvZiB0aGUgc291cmNlIGZpbGUgdG8gY2hlY2suXG4gKlxuICogQHJldHVybnMgZmFsc2UgaWYgdGhlcmUgYXJlIGRlZmluaXRlbHkgbm8gaW1wb3J0IG9yIHJlLWV4cG9ydCBzdGF0ZW1lbnRzXG4gKiBpbiB0aGlzIGZpbGUsIHRydWUgb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzSW1wb3J0T3JSZWV4cG9ydFN0YXRlbWVudHMoc291cmNlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC8oaW1wb3J0fGV4cG9ydClcXHMuK2Zyb20vLnRlc3Qoc291cmNlKTtcbn1cblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHN0YXRlbWVudCBpcyBhbiBpbXBvcnQgd2l0aCBhIHN0cmluZyBsaXRlcmFsIG1vZHVsZSBzcGVjaWZpZXIuXG4gKiBAcGFyYW0gc3RtdCB0aGUgc3RhdGVtZW50IG5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzdGF0ZW1lbnQgaXMgYW4gaW1wb3J0IHdpdGggYSBzdHJpbmcgbGl0ZXJhbCBtb2R1bGUgc3BlY2lmaWVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdJbXBvcnRPclJlZXhwb3J0KHN0bXQ6IHRzLlN0YXRlbWVudCk6IHN0bXQgaXMgdHMuSW1wb3J0RGVjbGFyYXRpb24mXG4gICAge21vZHVsZVNwZWNpZmllcjogdHMuU3RyaW5nTGl0ZXJhbH0ge1xuICByZXR1cm4gdHMuaXNJbXBvcnREZWNsYXJhdGlvbihzdG10KSB8fFxuICAgICAgdHMuaXNFeHBvcnREZWNsYXJhdGlvbihzdG10KSAmJiAhIXN0bXQubW9kdWxlU3BlY2lmaWVyICYmXG4gICAgICB0cy5pc1N0cmluZ0xpdGVyYWwoc3RtdC5tb2R1bGVTcGVjaWZpZXIpO1xufVxuIl19
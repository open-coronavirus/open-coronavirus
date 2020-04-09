(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/imports/src/emitter", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/imports/src/find_export", "@angular/compiler-cli/src/ngtsc/imports/src/references"], factory);
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
    var compiler_1 = require("@angular/compiler");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var find_export_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/find_export");
    var references_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/references");
    /**
     * Generates `Expression`s which refer to `Reference`s in a given context.
     *
     * A `ReferenceEmitter` uses one or more `ReferenceEmitStrategy` implementations to produce an
     * `Expression` which refers to a `Reference` in the context of a particular file.
     */
    var ReferenceEmitter = /** @class */ (function () {
        function ReferenceEmitter(strategies) {
            this.strategies = strategies;
        }
        ReferenceEmitter.prototype.emit = function (ref, context, importMode) {
            var e_1, _a;
            if (importMode === void 0) { importMode = references_1.ImportMode.UseExistingImport; }
            try {
                for (var _b = tslib_1.__values(this.strategies), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var strategy = _c.value;
                    var emitted = strategy.emit(ref, context, importMode);
                    if (emitted !== null) {
                        return emitted;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            throw new Error("Unable to write a reference to " + typescript_1.nodeNameForError(ref.node) + " in " + ref.node.getSourceFile().fileName + " from " + context.fileName);
        };
        return ReferenceEmitter;
    }());
    exports.ReferenceEmitter = ReferenceEmitter;
    /**
     * A `ReferenceEmitStrategy` which will refer to declarations by any local `ts.Identifier`s, if
     * such identifiers are available.
     */
    var LocalIdentifierStrategy = /** @class */ (function () {
        function LocalIdentifierStrategy() {
        }
        LocalIdentifierStrategy.prototype.emit = function (ref, context, importMode) {
            // If the emitter has specified ForceNewImport, then LocalIdentifierStrategy should not use a
            // local identifier at all, *except* in the source file where the node is actually declared.
            if (importMode === references_1.ImportMode.ForceNewImport &&
                typescript_1.getSourceFile(ref.node) !== typescript_1.getSourceFile(context)) {
                return null;
            }
            // A Reference can have multiple identities in different files, so it may already have an
            // Identifier in the requested context file.
            var identifier = ref.getIdentityIn(context);
            if (identifier !== null) {
                return new compiler_1.WrappedNodeExpr(identifier);
            }
            else {
                return null;
            }
        };
        return LocalIdentifierStrategy;
    }());
    exports.LocalIdentifierStrategy = LocalIdentifierStrategy;
    /**
     * A `ReferenceEmitStrategy` which will refer to declarations that come from `node_modules` using
     * an absolute import.
     *
     * Part of this strategy involves looking at the target entry point and identifying the exported
     * name of the targeted declaration, as it might be different from the declared name (e.g. a
     * directive might be declared as FooDirImpl, but exported as FooDir). If no export can be found
     * which maps back to the original directive, an error is thrown.
     */
    var AbsoluteModuleStrategy = /** @class */ (function () {
        function AbsoluteModuleStrategy(program, checker, options, host, reflectionHost) {
            this.program = program;
            this.checker = checker;
            this.options = options;
            this.host = host;
            this.reflectionHost = reflectionHost;
            /**
             * A cache of the exports of specific modules, because resolving a module to its exports is a
             * costly operation.
             */
            this.moduleExportsCache = new Map();
        }
        AbsoluteModuleStrategy.prototype.emit = function (ref, context, importMode) {
            if (ref.bestGuessOwningModule === null) {
                // There is no module name available for this Reference, meaning it was arrived at via a
                // relative path.
                return null;
            }
            else if (!typescript_1.isDeclaration(ref.node)) {
                // It's not possible to import something which isn't a declaration.
                throw new Error('Debug assert: importing a Reference to non-declaration?');
            }
            // Try to find the exported name of the declaration, if one is available.
            var _a = ref.bestGuessOwningModule, specifier = _a.specifier, resolutionContext = _a.resolutionContext;
            var symbolName = this.resolveImportName(specifier, ref.node, resolutionContext);
            if (symbolName === null) {
                // TODO(alxhub): make this error a ts.Diagnostic pointing at whatever caused this import to be
                // triggered.
                throw new Error("Symbol " + ref.debugName + " declared in " + typescript_1.getSourceFile(ref.node).fileName + " is not exported from " + specifier + " (import into " + context.fileName + ")");
            }
            return new compiler_1.ExternalExpr(new compiler_1.ExternalReference(specifier, symbolName));
        };
        AbsoluteModuleStrategy.prototype.resolveImportName = function (moduleName, target, fromFile) {
            var exports = this.getExportsOfModule(moduleName, fromFile);
            if (exports !== null && exports.has(target)) {
                return exports.get(target);
            }
            else {
                return null;
            }
        };
        AbsoluteModuleStrategy.prototype.getExportsOfModule = function (moduleName, fromFile) {
            if (!this.moduleExportsCache.has(moduleName)) {
                this.moduleExportsCache.set(moduleName, this.enumerateExportsOfModule(moduleName, fromFile));
            }
            return this.moduleExportsCache.get(moduleName);
        };
        AbsoluteModuleStrategy.prototype.enumerateExportsOfModule = function (specifier, fromFile) {
            // First, resolve the module specifier to its entry point, and get the ts.Symbol for it.
            var resolvedModule = typescript_1.resolveModuleName(specifier, fromFile, this.options, this.host);
            if (resolvedModule === undefined) {
                return null;
            }
            var entryPointFile = typescript_1.getSourceFileOrNull(this.program, file_system_1.absoluteFrom(resolvedModule.resolvedFileName));
            if (entryPointFile === null) {
                return null;
            }
            var exports = this.reflectionHost.getExportsOfModule(entryPointFile);
            if (exports === null) {
                return null;
            }
            var exportMap = new Map();
            exports.forEach(function (declaration, name) { exportMap.set(declaration.node, name); });
            return exportMap;
        };
        return AbsoluteModuleStrategy;
    }());
    exports.AbsoluteModuleStrategy = AbsoluteModuleStrategy;
    /**
     * A `ReferenceEmitStrategy` which will refer to declarations via relative paths, provided they're
     * both in the logical project "space" of paths.
     *
     * This is trickier than it sounds, as the two files may be in different root directories in the
     * project. Simply calculating a file system relative path between the two is not sufficient.
     * Instead, `LogicalProjectPath`s are used.
     */
    var LogicalProjectStrategy = /** @class */ (function () {
        function LogicalProjectStrategy(checker, logicalFs) {
            this.checker = checker;
            this.logicalFs = logicalFs;
        }
        LogicalProjectStrategy.prototype.emit = function (ref, context) {
            var destSf = typescript_1.getSourceFile(ref.node);
            // Compute the relative path from the importing file to the file being imported. This is done
            // as a logical path computation, because the two files might be in different rootDirs.
            var destPath = this.logicalFs.logicalPathOfSf(destSf);
            if (destPath === null) {
                // The imported file is not within the logical project filesystem.
                return null;
            }
            var originPath = this.logicalFs.logicalPathOfSf(context);
            if (originPath === null) {
                throw new Error("Debug assert: attempt to import from " + context.fileName + " but it's outside the program?");
            }
            // There's no way to emit a relative reference from a file to itself.
            if (destPath === originPath) {
                return null;
            }
            var name = find_export_1.findExportedNameOfNode(ref.node, destSf, this.checker);
            if (name === null) {
                // The target declaration isn't exported from the file it's declared in. This is an issue!
                return null;
            }
            // With both files expressed as LogicalProjectPaths, getting the module specifier as a relative
            // path is now straightforward.
            var moduleName = file_system_1.LogicalProjectPath.relativePathBetween(originPath, destPath);
            return new compiler_1.ExternalExpr({ moduleName: moduleName, name: name });
        };
        return LogicalProjectStrategy;
    }());
    exports.LogicalProjectStrategy = LogicalProjectStrategy;
    /**
     * A `ReferenceEmitStrategy` which uses a `FileToModuleHost` to generate absolute import references.
     */
    var FileToModuleStrategy = /** @class */ (function () {
        function FileToModuleStrategy(checker, fileToModuleHost) {
            this.checker = checker;
            this.fileToModuleHost = fileToModuleHost;
        }
        FileToModuleStrategy.prototype.emit = function (ref, context) {
            var destSf = typescript_1.getSourceFile(ref.node);
            var name = find_export_1.findExportedNameOfNode(ref.node, destSf, this.checker);
            if (name === null) {
                return null;
            }
            var moduleName = this.fileToModuleHost.fileNameToModuleName(destSf.fileName, context.fileName);
            return new compiler_1.ExternalExpr({ moduleName: moduleName, name: name });
        };
        return FileToModuleStrategy;
    }());
    exports.FileToModuleStrategy = FileToModuleStrategy;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaW1wb3J0cy9zcmMvZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBK0Y7SUFFL0YsMkVBQXNGO0lBRXRGLGtGQUFpSTtJQUNqSSx1RkFBcUQ7SUFDckQscUZBQW1EO0lBcUNuRDs7Ozs7T0FLRztJQUNIO1FBQ0UsMEJBQW9CLFVBQW1DO1lBQW5DLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQUcsQ0FBQztRQUUzRCwrQkFBSSxHQUFKLFVBQ0ksR0FBYyxFQUFFLE9BQXNCLEVBQ3RDLFVBQXFEOztZQUFyRCwyQkFBQSxFQUFBLGFBQXlCLHVCQUFVLENBQUMsaUJBQWlCOztnQkFDdkQsS0FBdUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7b0JBQW5DLElBQU0sUUFBUSxXQUFBO29CQUNqQixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBQ3hELElBQUksT0FBTyxLQUFLLElBQUksRUFBRTt3QkFDcEIsT0FBTyxPQUFPLENBQUM7cUJBQ2hCO2lCQUNGOzs7Ozs7Ozs7WUFDRCxNQUFNLElBQUksS0FBSyxDQUNYLG9DQUFrQyw2QkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLGNBQVMsT0FBTyxDQUFDLFFBQVUsQ0FBQyxDQUFDO1FBQ3ZJLENBQUM7UUFDSCx1QkFBQztJQUFELENBQUMsQUFmRCxJQWVDO0lBZlksNENBQWdCO0lBaUI3Qjs7O09BR0c7SUFDSDtRQUFBO1FBa0JBLENBQUM7UUFqQkMsc0NB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LE9BQU8sSUFBSSx1QkFBWSxDQUFDLEVBQUMsVUFBVSxZQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDSCw2QkFBQztJQUFELENBQUMsQUFwQ0QsSUFvQ0M7SUFwQ1ksd0RBQXNCO0lBc0NuQzs7T0FFRztJQUNIO1FBQ0UsOEJBQW9CLE9BQXVCLEVBQVUsZ0JBQWtDO1lBQW5FLFlBQU8sR0FBUCxPQUFPLENBQWdCO1lBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFHLENBQUM7UUFFM0YsbUNBQUksR0FBSixVQUFLLEdBQXVCLEVBQUUsT0FBc0I7WUFDbEQsSUFBTSxNQUFNLEdBQUcsMEJBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsSUFBTSxJQUFJLEdBQUcsb0NBQXNCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDakIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELElBQU0sVUFBVSxHQUNaLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsRixPQUFPLElBQUksdUJBQVksQ0FBQyxFQUFDLFVBQVUsWUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0gsMkJBQUM7SUFBRCxDQUFDLEFBZkQsSUFlQztJQWZZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RXhwcmVzc2lvbiwgRXh0ZXJuYWxFeHByLCBFeHRlcm5hbFJlZmVyZW5jZSwgV3JhcHBlZE5vZGVFeHByfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7TG9naWNhbEZpbGVTeXN0ZW0sIExvZ2ljYWxQcm9qZWN0UGF0aCwgYWJzb2x1dGVGcm9tfSBmcm9tICcuLi8uLi9maWxlX3N5c3RlbSc7XG5pbXBvcnQge1JlZmxlY3Rpb25Ib3N0fSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7Z2V0U291cmNlRmlsZSwgZ2V0U291cmNlRmlsZU9yTnVsbCwgaXNEZWNsYXJhdGlvbiwgbm9kZU5hbWVGb3JFcnJvciwgcmVzb2x2ZU1vZHVsZU5hbWV9IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtmaW5kRXhwb3J0ZWROYW1lT2ZOb2RlfSBmcm9tICcuL2ZpbmRfZXhwb3J0JztcbmltcG9ydCB7SW1wb3J0TW9kZSwgUmVmZXJlbmNlfSBmcm9tICcuL3JlZmVyZW5jZXMnO1xuXG4vKipcbiAqIEEgaG9zdCB3aGljaCBzdXBwb3J0cyBhbiBvcGVyYXRpb24gdG8gY29udmVydCBhIGZpbGUgbmFtZSBpbnRvIGEgbW9kdWxlIG5hbWUuXG4gKlxuICogVGhpcyBvcGVyYXRpb24gaXMgdHlwaWNhbGx5IGltcGxlbWVudGVkIGFzIHBhcnQgb2YgdGhlIGNvbXBpbGVyIGhvc3QgcGFzc2VkIHRvIG5ndHNjIHdoZW4gcnVubmluZ1xuICogdW5kZXIgYSBidWlsZCB0b29sIGxpa2UgQmF6ZWwgb3IgQmxhemUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZVRvTW9kdWxlSG9zdCB7XG4gIGZpbGVOYW1lVG9Nb2R1bGVOYW1lKGltcG9ydGVkRmlsZVBhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGVQYXRoOiBzdHJpbmcpOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBwYXJ0aWN1bGFyIHN0cmF0ZWd5IGZvciBnZW5lcmF0aW5nIGFuIGV4cHJlc3Npb24gd2hpY2ggcmVmZXJzIHRvIGEgYFJlZmVyZW5jZWAuXG4gKlxuICogVGhlcmUgYXJlIG1hbnkgcG90ZW50aWFsIHdheXMgYSBnaXZlbiBgUmVmZXJlbmNlYCBjb3VsZCBiZSByZWZlcnJlZCB0byBpbiB0aGUgY29udGV4dCBvZiBhIGdpdmVuXG4gKiBmaWxlLiBBIGxvY2FsIGRlY2xhcmF0aW9uIGNvdWxkIGJlIGF2YWlsYWJsZSwgdGhlIGBSZWZlcmVuY2VgIGNvdWxkIGJlIGltcG9ydGFibGUgdmlhIGEgcmVsYXRpdmVcbiAqIGltcG9ydCB3aXRoaW4gdGhlIHByb2plY3QsIG9yIGFuIGFic29sdXRlIGltcG9ydCBpbnRvIGBub2RlX21vZHVsZXNgIG1pZ2h0IGJlIG5lY2Vzc2FyeS5cbiAqXG4gKiBEaWZmZXJlbnQgYFJlZmVyZW5jZUVtaXRTdHJhdGVneWAgaW1wbGVtZW50YXRpb25zIGltcGxlbWVudCBzcGVjaWZpYyBsb2dpYyBmb3IgZ2VuZXJhdGluZyBzdWNoXG4gKiByZWZlcmVuY2VzLiBBIHNpbmdsZSBzdHJhdGVneSAoc3VjaCBhcyB1c2luZyBhIGxvY2FsIGRlY2xhcmF0aW9uKSBtYXkgbm90IGFsd2F5cyBiZSBhYmxlIHRvXG4gKiBnZW5lcmF0ZSBhbiBleHByZXNzaW9uIGZvciBldmVyeSBgUmVmZXJlbmNlYCAoZm9yIGV4YW1wbGUsIGlmIG5vIGxvY2FsIGlkZW50aWZpZXIgaXMgYXZhaWxhYmxlKSxcbiAqIGFuZCBtYXkgcmV0dXJuIGBudWxsYCBpbiBzdWNoIGEgY2FzZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWZlcmVuY2VFbWl0U3RyYXRlZ3kge1xuICAvKipcbiAgICogRW1pdCBhbiBgRXhwcmVzc2lvbmAgd2hpY2ggcmVmZXJzIHRvIHRoZSBnaXZlbiBgUmVmZXJlbmNlYCBpbiB0aGUgY29udGV4dCBvZiBhIHBhcnRpY3VsYXJcbiAgICogc291cmNlIGZpbGUsIGlmIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAcGFyYW0gcmVmIHRoZSBgUmVmZXJlbmNlYCBmb3Igd2hpY2ggdG8gZ2VuZXJhdGUgYW4gZXhwcmVzc2lvblxuICAgKiBAcGFyYW0gY29udGV4dCB0aGUgc291cmNlIGZpbGUgaW4gd2hpY2ggdGhlIGBFeHByZXNzaW9uYCBtdXN0IGJlIHZhbGlkXG4gICAqIEBwYXJhbSBpbXBvcnRNb2RlIGEgZmxhZyB3aGljaCBjb250cm9scyB3aGV0aGVyIGltcG9ydHMgc2hvdWxkIGJlIGdlbmVyYXRlZCBvciBub3RcbiAgICogQHJldHVybnMgYW4gYEV4cHJlc3Npb25gIHdoaWNoIHJlZmVycyB0byB0aGUgYFJlZmVyZW5jZWAsIG9yIGBudWxsYCBpZiBub25lIGNhbiBiZSBnZW5lcmF0ZWRcbiAgICovXG4gIGVtaXQocmVmOiBSZWZlcmVuY2UsIGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUsIGltcG9ydE1vZGU6IEltcG9ydE1vZGUpOiBFeHByZXNzaW9ufG51bGw7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGBFeHByZXNzaW9uYHMgd2hpY2ggcmVmZXIgdG8gYFJlZmVyZW5jZWBzIGluIGEgZ2l2ZW4gY29udGV4dC5cbiAqXG4gKiBBIGBSZWZlcmVuY2VFbWl0dGVyYCB1c2VzIG9uZSBvciBtb3JlIGBSZWZlcmVuY2VFbWl0U3RyYXRlZ3lgIGltcGxlbWVudGF0aW9ucyB0byBwcm9kdWNlIGFuXG4gKiBgRXhwcmVzc2lvbmAgd2hpY2ggcmVmZXJzIHRvIGEgYFJlZmVyZW5jZWAgaW4gdGhlIGNvbnRleHQgb2YgYSBwYXJ0aWN1bGFyIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2VFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdHJhdGVnaWVzOiBSZWZlcmVuY2VFbWl0U3RyYXRlZ3lbXSkge31cblxuICBlbWl0KFxuICAgICAgcmVmOiBSZWZlcmVuY2UsIGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUsXG4gICAgICBpbXBvcnRNb2RlOiBJbXBvcnRNb2RlwqA9IEltcG9ydE1vZGUuVXNlRXhpc3RpbmdJbXBvcnQpOiBFeHByZXNzaW9uIHtcbiAgICBmb3IgKGNvbnN0IHN0cmF0ZWd5IG9mIHRoaXMuc3RyYXRlZ2llcykge1xuICAgICAgY29uc3QgZW1pdHRlZCA9IHN0cmF0ZWd5LmVtaXQocmVmLCBjb250ZXh0LCBpbXBvcnRNb2RlKTtcbiAgICAgIGlmIChlbWl0dGVkICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBlbWl0dGVkO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbmFibGUgdG8gd3JpdGUgYSByZWZlcmVuY2UgdG8gJHtub2RlTmFtZUZvckVycm9yKHJlZi5ub2RlKX0gaW4gJHtyZWYubm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWV9IGZyb20gJHtjb250ZXh0LmZpbGVOYW1lfWApO1xuICB9XG59XG5cbi8qKlxuICogQSBgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5YCB3aGljaCB3aWxsIHJlZmVyIHRvIGRlY2xhcmF0aW9ucyBieSBhbnkgbG9jYWwgYHRzLklkZW50aWZpZXJgcywgaWZcbiAqIHN1Y2ggaWRlbnRpZmllcnMgYXJlIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsSWRlbnRpZmllclN0cmF0ZWd5IGltcGxlbWVudHMgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5IHtcbiAgZW1pdChyZWY6IFJlZmVyZW5jZTx0cy5Ob2RlPiwgY29udGV4dDogdHMuU291cmNlRmlsZSwgaW1wb3J0TW9kZTogSW1wb3J0TW9kZSk6IEV4cHJlc3Npb258bnVsbCB7XG4gICAgLy8gSWYgdGhlIGVtaXR0ZXIgaGFzIHNwZWNpZmllZCBGb3JjZU5ld0ltcG9ydCwgdGhlbiBMb2NhbElkZW50aWZpZXJTdHJhdGVneSBzaG91bGQgbm90IHVzZSBhXG4gICAgLy8gbG9jYWwgaWRlbnRpZmllciBhdCBhbGwsICpleGNlcHQqIGluIHRoZSBzb3VyY2UgZmlsZSB3aGVyZSB0aGUgbm9kZSBpcyBhY3R1YWxseSBkZWNsYXJlZC5cbiAgICBpZiAoaW1wb3J0TW9kZSA9PT0gSW1wb3J0TW9kZS5Gb3JjZU5ld0ltcG9ydCAmJlxuICAgICAgICBnZXRTb3VyY2VGaWxlKHJlZi5ub2RlKSAhPT0gZ2V0U291cmNlRmlsZShjb250ZXh0KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQSBSZWZlcmVuY2UgY2FuIGhhdmUgbXVsdGlwbGUgaWRlbnRpdGllcyBpbiBkaWZmZXJlbnQgZmlsZXMsIHNvIGl0IG1heSBhbHJlYWR5IGhhdmUgYW5cbiAgICAvLyBJZGVudGlmaWVyIGluIHRoZSByZXF1ZXN0ZWQgY29udGV4dCBmaWxlLlxuICAgIGNvbnN0IGlkZW50aWZpZXIgPSByZWYuZ2V0SWRlbnRpdHlJbihjb250ZXh0KTtcbiAgICBpZiAoaWRlbnRpZmllciAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGVkTm9kZUV4cHIoaWRlbnRpZmllcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEEgYFJlZmVyZW5jZUVtaXRTdHJhdGVneWAgd2hpY2ggd2lsbCByZWZlciB0byBkZWNsYXJhdGlvbnMgdGhhdCBjb21lIGZyb20gYG5vZGVfbW9kdWxlc2AgdXNpbmdcbiAqIGFuIGFic29sdXRlIGltcG9ydC5cbiAqXG4gKiBQYXJ0IG9mIHRoaXMgc3RyYXRlZ3kgaW52b2x2ZXMgbG9va2luZyBhdCB0aGUgdGFyZ2V0IGVudHJ5IHBvaW50IGFuZCBpZGVudGlmeWluZyB0aGUgZXhwb3J0ZWRcbiAqIG5hbWUgb2YgdGhlIHRhcmdldGVkIGRlY2xhcmF0aW9uLCBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZGVjbGFyZWQgbmFtZSAoZS5nLiBhXG4gKiBkaXJlY3RpdmUgbWlnaHQgYmUgZGVjbGFyZWQgYXMgRm9vRGlySW1wbCwgYnV0IGV4cG9ydGVkIGFzIEZvb0RpcikuIElmIG5vIGV4cG9ydCBjYW4gYmUgZm91bmRcbiAqIHdoaWNoIG1hcHMgYmFjayB0byB0aGUgb3JpZ2luYWwgZGlyZWN0aXZlLCBhbiBlcnJvciBpcyB0aHJvd24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBYnNvbHV0ZU1vZHVsZVN0cmF0ZWd5IGltcGxlbWVudHMgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIEEgY2FjaGUgb2YgdGhlIGV4cG9ydHMgb2Ygc3BlY2lmaWMgbW9kdWxlcywgYmVjYXVzZSByZXNvbHZpbmcgYSBtb2R1bGUgdG8gaXRzIGV4cG9ydHMgaXMgYVxuICAgKiBjb3N0bHkgb3BlcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBtb2R1bGVFeHBvcnRzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgTWFwPHRzLkRlY2xhcmF0aW9uLCBzdHJpbmc+fG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgcHJvdGVjdGVkIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuICAgICAgcHJvdGVjdGVkIG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucywgcHJvdGVjdGVkIGhvc3Q6IHRzLkNvbXBpbGVySG9zdCxcbiAgICAgIHByaXZhdGUgcmVmbGVjdGlvbkhvc3Q6IFJlZmxlY3Rpb25Ib3N0KSB7fVxuXG4gIGVtaXQocmVmOiBSZWZlcmVuY2U8dHMuTm9kZT4sIGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUsIGltcG9ydE1vZGU6IEltcG9ydE1vZGUpOiBFeHByZXNzaW9ufG51bGwge1xuICAgIGlmIChyZWYuYmVzdEd1ZXNzT3duaW5nTW9kdWxlID09PSBudWxsKSB7XG4gICAgICAvLyBUaGVyZSBpcyBubyBtb2R1bGUgbmFtZSBhdmFpbGFibGUgZm9yIHRoaXMgUmVmZXJlbmNlLCBtZWFuaW5nIGl0IHdhcyBhcnJpdmVkIGF0IHZpYSBhXG4gICAgICAvLyByZWxhdGl2ZSBwYXRoLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICghaXNEZWNsYXJhdGlvbihyZWYubm9kZSkpIHtcbiAgICAgIC8vIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGltcG9ydCBzb21ldGhpbmcgd2hpY2ggaXNuJ3QgYSBkZWNsYXJhdGlvbi5cbiAgICAgIHRocm93IG5ldyBFcnJvcignRGVidWcgYXNzZXJ0OiBpbXBvcnRpbmcgYSBSZWZlcmVuY2UgdG8gbm9uLWRlY2xhcmF0aW9uPycpO1xuICAgIH1cblxuICAgIC8vIFRyeSB0byBmaW5kIHRoZSBleHBvcnRlZCBuYW1lIG9mIHRoZSBkZWNsYXJhdGlvbiwgaWYgb25lIGlzIGF2YWlsYWJsZS5cbiAgICBjb25zdCB7c3BlY2lmaWVyLCByZXNvbHV0aW9uQ29udGV4dH0gPSByZWYuYmVzdEd1ZXNzT3duaW5nTW9kdWxlO1xuICAgIGNvbnN0IHN5bWJvbE5hbWUgPSB0aGlzLnJlc29sdmVJbXBvcnROYW1lKHNwZWNpZmllciwgcmVmLm5vZGUsIHJlc29sdXRpb25Db250ZXh0KTtcbiAgICBpZiAoc3ltYm9sTmFtZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVE9ETyhhbHhodWIpOiBtYWtlIHRoaXMgZXJyb3IgYSB0cy5EaWFnbm9zdGljIHBvaW50aW5nIGF0IHdoYXRldmVyIGNhdXNlZCB0aGlzIGltcG9ydCB0byBiZVxuICAgICAgLy8gdHJpZ2dlcmVkLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBTeW1ib2wgJHtyZWYuZGVidWdOYW1lfSBkZWNsYXJlZCBpbiAke2dldFNvdXJjZUZpbGUocmVmLm5vZGUpLmZpbGVOYW1lfSBpcyBub3QgZXhwb3J0ZWQgZnJvbSAke3NwZWNpZmllcn0gKGltcG9ydCBpbnRvICR7Y29udGV4dC5maWxlTmFtZX0pYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFeHRlcm5hbEV4cHIobmV3IEV4dGVybmFsUmVmZXJlbmNlKHNwZWNpZmllciwgc3ltYm9sTmFtZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlSW1wb3J0TmFtZShtb2R1bGVOYW1lOiBzdHJpbmcsIHRhcmdldDogdHMuRGVjbGFyYXRpb24sIGZyb21GaWxlOiBzdHJpbmcpOiBzdHJpbmdcbiAgICAgIHxudWxsIHtcbiAgICBjb25zdCBleHBvcnRzID0gdGhpcy5nZXRFeHBvcnRzT2ZNb2R1bGUobW9kdWxlTmFtZSwgZnJvbUZpbGUpO1xuICAgIGlmIChleHBvcnRzICE9PSBudWxsICYmIGV4cG9ydHMuaGFzKHRhcmdldCkpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmdldCh0YXJnZXQpICE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXhwb3J0c09mTW9kdWxlKG1vZHVsZU5hbWU6IHN0cmluZywgZnJvbUZpbGU6IHN0cmluZyk6XG4gICAgICBNYXA8dHMuRGVjbGFyYXRpb24sIHN0cmluZz58bnVsbCB7XG4gICAgaWYgKCF0aGlzLm1vZHVsZUV4cG9ydHNDYWNoZS5oYXMobW9kdWxlTmFtZSkpIHtcbiAgICAgIHRoaXMubW9kdWxlRXhwb3J0c0NhY2hlLnNldChtb2R1bGVOYW1lLCB0aGlzLmVudW1lcmF0ZUV4cG9ydHNPZk1vZHVsZShtb2R1bGVOYW1lLCBmcm9tRmlsZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tb2R1bGVFeHBvcnRzQ2FjaGUuZ2V0KG1vZHVsZU5hbWUpICE7XG4gIH1cblxuICBwcm90ZWN0ZWQgZW51bWVyYXRlRXhwb3J0c09mTW9kdWxlKHNwZWNpZmllcjogc3RyaW5nLCBmcm9tRmlsZTogc3RyaW5nKTpcbiAgICAgIE1hcDx0cy5EZWNsYXJhdGlvbiwgc3RyaW5nPnxudWxsIHtcbiAgICAvLyBGaXJzdCwgcmVzb2x2ZSB0aGUgbW9kdWxlIHNwZWNpZmllciB0byBpdHMgZW50cnkgcG9pbnQsIGFuZCBnZXQgdGhlIHRzLlN5bWJvbCBmb3IgaXQuXG4gICAgY29uc3QgcmVzb2x2ZWRNb2R1bGUgPSByZXNvbHZlTW9kdWxlTmFtZShzcGVjaWZpZXIsIGZyb21GaWxlLCB0aGlzLm9wdGlvbnMsIHRoaXMuaG9zdCk7XG4gICAgaWYgKHJlc29sdmVkTW9kdWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGVudHJ5UG9pbnRGaWxlID1cbiAgICAgICAgZ2V0U291cmNlRmlsZU9yTnVsbCh0aGlzLnByb2dyYW0sIGFic29sdXRlRnJvbShyZXNvbHZlZE1vZHVsZS5yZXNvbHZlZEZpbGVOYW1lKSk7XG4gICAgaWYgKGVudHJ5UG9pbnRGaWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBleHBvcnRzID0gdGhpcy5yZWZsZWN0aW9uSG9zdC5nZXRFeHBvcnRzT2ZNb2R1bGUoZW50cnlQb2ludEZpbGUpO1xuICAgIGlmIChleHBvcnRzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZXhwb3J0TWFwID0gbmV3IE1hcDx0cy5EZWNsYXJhdGlvbiwgc3RyaW5nPigpO1xuICAgIGV4cG9ydHMuZm9yRWFjaCgoZGVjbGFyYXRpb24sIG5hbWUpID0+IHsgZXhwb3J0TWFwLnNldChkZWNsYXJhdGlvbi5ub2RlLCBuYW1lKTsgfSk7XG4gICAgcmV0dXJuIGV4cG9ydE1hcDtcbiAgfVxufVxuXG4vKipcbiAqIEEgYFJlZmVyZW5jZUVtaXRTdHJhdGVneWAgd2hpY2ggd2lsbCByZWZlciB0byBkZWNsYXJhdGlvbnMgdmlhIHJlbGF0aXZlIHBhdGhzLCBwcm92aWRlZCB0aGV5J3JlXG4gKiBib3RoIGluIHRoZSBsb2dpY2FsIHByb2plY3QgXCJzcGFjZVwiIG9mIHBhdGhzLlxuICpcbiAqIFRoaXMgaXMgdHJpY2tpZXIgdGhhbiBpdCBzb3VuZHMsIGFzIHRoZSB0d28gZmlsZXMgbWF5IGJlIGluIGRpZmZlcmVudCByb290IGRpcmVjdG9yaWVzIGluIHRoZVxuICogcHJvamVjdC4gU2ltcGx5IGNhbGN1bGF0aW5nIGEgZmlsZSBzeXN0ZW0gcmVsYXRpdmUgcGF0aCBiZXR3ZWVuIHRoZSB0d28gaXMgbm90IHN1ZmZpY2llbnQuXG4gKiBJbnN0ZWFkLCBgTG9naWNhbFByb2plY3RQYXRoYHMgYXJlIHVzZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dpY2FsUHJvamVjdFN0cmF0ZWd5IGltcGxlbWVudHMgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgcHJpdmF0ZSBsb2dpY2FsRnM6IExvZ2ljYWxGaWxlU3lzdGVtKSB7fVxuXG4gIGVtaXQocmVmOiBSZWZlcmVuY2U8dHMuTm9kZT4sIGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUpOiBFeHByZXNzaW9ufG51bGwge1xuICAgIGNvbnN0IGRlc3RTZiA9IGdldFNvdXJjZUZpbGUocmVmLm5vZGUpO1xuXG4gICAgLy8gQ29tcHV0ZSB0aGUgcmVsYXRpdmUgcGF0aCBmcm9tIHRoZSBpbXBvcnRpbmcgZmlsZSB0byB0aGUgZmlsZSBiZWluZyBpbXBvcnRlZC4gVGhpcyBpcyBkb25lXG4gICAgLy8gYXMgYSBsb2dpY2FsIHBhdGggY29tcHV0YXRpb24sIGJlY2F1c2UgdGhlIHR3byBmaWxlcyBtaWdodCBiZSBpbiBkaWZmZXJlbnQgcm9vdERpcnMuXG4gICAgY29uc3QgZGVzdFBhdGggPSB0aGlzLmxvZ2ljYWxGcy5sb2dpY2FsUGF0aE9mU2YoZGVzdFNmKTtcbiAgICBpZiAoZGVzdFBhdGggPT09IG51bGwpIHtcbiAgICAgIC8vIFRoZSBpbXBvcnRlZCBmaWxlIGlzIG5vdCB3aXRoaW4gdGhlIGxvZ2ljYWwgcHJvamVjdCBmaWxlc3lzdGVtLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luUGF0aCA9IHRoaXMubG9naWNhbEZzLmxvZ2ljYWxQYXRoT2ZTZihjb250ZXh0KTtcbiAgICBpZiAob3JpZ2luUGF0aCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBEZWJ1ZyBhc3NlcnQ6IGF0dGVtcHQgdG8gaW1wb3J0IGZyb20gJHtjb250ZXh0LmZpbGVOYW1lfSBidXQgaXQncyBvdXRzaWRlIHRoZSBwcm9ncmFtP2ApO1xuICAgIH1cblxuICAgIC8vIFRoZXJlJ3Mgbm8gd2F5IHRvIGVtaXQgYSByZWxhdGl2ZSByZWZlcmVuY2UgZnJvbSBhIGZpbGUgdG8gaXRzZWxmLlxuICAgIGlmIChkZXN0UGF0aCA9PT0gb3JpZ2luUGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IGZpbmRFeHBvcnRlZE5hbWVPZk5vZGUocmVmLm5vZGUsIGRlc3RTZiwgdGhpcy5jaGVja2VyKTtcbiAgICBpZiAobmFtZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhlIHRhcmdldCBkZWNsYXJhdGlvbiBpc24ndCBleHBvcnRlZCBmcm9tIHRoZSBmaWxlIGl0J3MgZGVjbGFyZWQgaW4uIFRoaXMgaXMgYW4gaXNzdWUhXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBXaXRoIGJvdGggZmlsZXMgZXhwcmVzc2VkIGFzIExvZ2ljYWxQcm9qZWN0UGF0aHMsIGdldHRpbmcgdGhlIG1vZHVsZSBzcGVjaWZpZXIgYXMgYSByZWxhdGl2ZVxuICAgIC8vIHBhdGggaXMgbm93IHN0cmFpZ2h0Zm9yd2FyZC5cbiAgICBjb25zdCBtb2R1bGVOYW1lID0gTG9naWNhbFByb2plY3RQYXRoLnJlbGF0aXZlUGF0aEJldHdlZW4ob3JpZ2luUGF0aCwgZGVzdFBhdGgpO1xuICAgIHJldHVybiBuZXcgRXh0ZXJuYWxFeHByKHttb2R1bGVOYW1lLCBuYW1lfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGBSZWZlcmVuY2VFbWl0U3RyYXRlZ3lgIHdoaWNoIHVzZXMgYSBgRmlsZVRvTW9kdWxlSG9zdGAgdG8gZ2VuZXJhdGUgYWJzb2x1dGUgaW1wb3J0IHJlZmVyZW5jZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlVG9Nb2R1bGVTdHJhdGVneSBpbXBsZW1lbnRzIFJlZmVyZW5jZUVtaXRTdHJhdGVneSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsIHByaXZhdGUgZmlsZVRvTW9kdWxlSG9zdDogRmlsZVRvTW9kdWxlSG9zdCkge31cblxuICBlbWl0KHJlZjogUmVmZXJlbmNlPHRzLk5vZGU+LCBjb250ZXh0OiB0cy5Tb3VyY2VGaWxlKTogRXhwcmVzc2lvbnxudWxsIHtcbiAgICBjb25zdCBkZXN0U2YgPSBnZXRTb3VyY2VGaWxlKHJlZi5ub2RlKTtcbiAgICBjb25zdCBuYW1lID0gZmluZEV4cG9ydGVkTmFtZU9mTm9kZShyZWYubm9kZSwgZGVzdFNmLCB0aGlzLmNoZWNrZXIpO1xuICAgIGlmIChuYW1lID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBtb2R1bGVOYW1lID1cbiAgICAgICAgdGhpcy5maWxlVG9Nb2R1bGVIb3N0LmZpbGVOYW1lVG9Nb2R1bGVOYW1lKGRlc3RTZi5maWxlTmFtZSwgY29udGV4dC5maWxlTmFtZSk7XG5cbiAgICByZXR1cm4gbmV3IEV4dGVybmFsRXhwcih7bW9kdWxlTmFtZSwgbmFtZX0pO1xuICB9XG59XG4iXX0=
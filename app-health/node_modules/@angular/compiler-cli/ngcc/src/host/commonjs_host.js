/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/host/commonjs_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/utils", "@angular/compiler-cli/ngcc/src/host/esm5_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    var esm5_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm5_host");
    var CommonJsReflectionHost = /** @class */ (function (_super) {
        tslib_1.__extends(CommonJsReflectionHost, _super);
        function CommonJsReflectionHost(logger, isCore, program, compilerHost, dts) {
            var _this = _super.call(this, logger, isCore, program.getTypeChecker(), dts) || this;
            _this.program = program;
            _this.compilerHost = compilerHost;
            _this.commonJsExports = new Map();
            _this.topLevelHelperCalls = new Map();
            return _this;
        }
        CommonJsReflectionHost.prototype.getImportOfIdentifier = function (id) {
            var requireCall = this.findCommonJsImport(id);
            if (requireCall === null) {
                return null;
            }
            return { from: requireCall.arguments[0].text, name: id.text };
        };
        CommonJsReflectionHost.prototype.getDeclarationOfIdentifier = function (id) {
            return this.getCommonJsImportedDeclaration(id) || _super.prototype.getDeclarationOfIdentifier.call(this, id);
        };
        CommonJsReflectionHost.prototype.getExportsOfModule = function (module) {
            return _super.prototype.getExportsOfModule.call(this, module) || this.getCommonJsExports(module.getSourceFile());
        };
        CommonJsReflectionHost.prototype.getCommonJsExports = function (sourceFile) {
            var _this = this;
            return getOrDefault(this.commonJsExports, sourceFile, function () { return _this.computeExportsOfCommonJsModule(sourceFile); });
        };
        /**
         * Search statements related to the given class for calls to the specified helper.
         *
         * In CommonJS these helper calls can be outside the class's IIFE at the top level of the
         * source file. Searching the top level statements for helpers can be expensive, so we
         * try to get helpers from the IIFE first and only fall back on searching the top level if
         * no helpers are found.
         *
         * @param classSymbol the class whose helper calls we are interested in.
         * @param helperName the name of the helper (e.g. `__decorate`) whose calls we are interested in.
         * @returns an array of nodes of calls to the helper with the given name.
         */
        CommonJsReflectionHost.prototype.getHelperCallsForClass = function (classSymbol, helperName) {
            var esm5HelperCalls = _super.prototype.getHelperCallsForClass.call(this, classSymbol, helperName);
            if (esm5HelperCalls.length > 0) {
                return esm5HelperCalls;
            }
            else {
                var sourceFile = classSymbol.valueDeclaration.getSourceFile();
                return this.getTopLevelHelperCalls(sourceFile, helperName);
            }
        };
        /**
         * Find all the helper calls at the top level of a source file.
         *
         * We cache the helper calls per source file so that we don't have to keep parsing the code for
         * each class in a file.
         *
         * @param sourceFile the source who may contain helper calls.
         * @param helperName the name of the helper (e.g. `__decorate`) whose calls we are interested in.
         * @returns an array of nodes of calls to the helper with the given name.
         */
        CommonJsReflectionHost.prototype.getTopLevelHelperCalls = function (sourceFile, helperName) {
            var _this = this;
            var helperCallsMap = getOrDefault(this.topLevelHelperCalls, helperName, function () { return new Map(); });
            return getOrDefault(helperCallsMap, sourceFile, function () { return sourceFile.statements.map(function (statement) { return _this.getHelperCall(statement, helperName); })
                .filter(utils_1.isDefined); });
        };
        CommonJsReflectionHost.prototype.computeExportsOfCommonJsModule = function (sourceFile) {
            var e_1, _a, e_2, _b;
            var moduleMap = new Map();
            try {
                for (var _c = tslib_1.__values(this.getModuleStatements(sourceFile)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var statement = _d.value;
                    if (isCommonJsExportStatement(statement)) {
                        var exportDeclaration = this.extractCommonJsExportDeclaration(statement);
                        if (exportDeclaration !== null) {
                            moduleMap.set(exportDeclaration.name, exportDeclaration.declaration);
                        }
                    }
                    else if (isReexportStatement(statement)) {
                        var reexports = this.extractCommonJsReexports(statement, sourceFile);
                        try {
                            for (var reexports_1 = (e_2 = void 0, tslib_1.__values(reexports)), reexports_1_1 = reexports_1.next(); !reexports_1_1.done; reexports_1_1 = reexports_1.next()) {
                                var reexport = reexports_1_1.value;
                                moduleMap.set(reexport.name, reexport.declaration);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (reexports_1_1 && !reexports_1_1.done && (_b = reexports_1.return)) _b.call(reexports_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return moduleMap;
        };
        CommonJsReflectionHost.prototype.extractCommonJsExportDeclaration = function (statement) {
            var exportExpression = statement.expression.right;
            var declaration = this.getDeclarationOfExpression(exportExpression);
            if (declaration === null) {
                return null;
            }
            var name = statement.expression.left.name.text;
            return { name: name, declaration: declaration };
        };
        CommonJsReflectionHost.prototype.extractCommonJsReexports = function (statement, containingFile) {
            var reexports = [];
            var requireCall = statement.expression.arguments[0];
            var importPath = requireCall.arguments[0].text;
            var importedFile = this.resolveModuleName(importPath, containingFile);
            if (importedFile !== undefined) {
                var viaModule_1 = stripExtension(importedFile.fileName);
                var importedExports = this.getExportsOfModule(importedFile);
                if (importedExports !== null) {
                    importedExports.forEach(function (decl, name) { return reexports.push({ name: name, declaration: { node: decl.node, viaModule: viaModule_1 } }); });
                }
            }
            return reexports;
        };
        CommonJsReflectionHost.prototype.findCommonJsImport = function (id) {
            // Is `id` a namespaced property access, e.g. `Directive` in `core.Directive`?
            // If so capture the symbol of the namespace, e.g. `core`.
            var nsIdentifier = findNamespaceOfIdentifier(id);
            var nsSymbol = nsIdentifier && this.checker.getSymbolAtLocation(nsIdentifier) || null;
            var nsDeclaration = nsSymbol && nsSymbol.valueDeclaration;
            var initializer = nsDeclaration && ts.isVariableDeclaration(nsDeclaration) && nsDeclaration.initializer ||
                null;
            return initializer && isRequireCall(initializer) ? initializer : null;
        };
        CommonJsReflectionHost.prototype.getCommonJsImportedDeclaration = function (id) {
            var importInfo = this.getImportOfIdentifier(id);
            if (importInfo === null) {
                return null;
            }
            var importedFile = this.resolveModuleName(importInfo.from, id.getSourceFile());
            if (importedFile === undefined) {
                return null;
            }
            return { node: importedFile, viaModule: importInfo.from };
        };
        CommonJsReflectionHost.prototype.resolveModuleName = function (moduleName, containingFile) {
            if (this.compilerHost.resolveModuleNames) {
                var moduleInfo = this.compilerHost.resolveModuleNames([moduleName], containingFile.fileName)[0];
                return moduleInfo && this.program.getSourceFile(file_system_1.absoluteFrom(moduleInfo.resolvedFileName));
            }
            else {
                var moduleInfo = ts.resolveModuleName(moduleName, containingFile.fileName, this.program.getCompilerOptions(), this.compilerHost);
                return moduleInfo.resolvedModule &&
                    this.program.getSourceFile(file_system_1.absoluteFrom(moduleInfo.resolvedModule.resolvedFileName));
            }
        };
        return CommonJsReflectionHost;
    }(esm5_host_1.Esm5ReflectionHost));
    exports.CommonJsReflectionHost = CommonJsReflectionHost;
    function isCommonJsExportStatement(s) {
        return ts.isExpressionStatement(s) && ts.isBinaryExpression(s.expression) &&
            ts.isPropertyAccessExpression(s.expression.left) &&
            ts.isIdentifier(s.expression.left.expression) &&
            s.expression.left.expression.text === 'exports';
    }
    exports.isCommonJsExportStatement = isCommonJsExportStatement;
    function isRequireCall(node) {
        return ts.isCallExpression(node) && ts.isIdentifier(node.expression) &&
            node.expression.text === 'require' && node.arguments.length === 1 &&
            ts.isStringLiteral(node.arguments[0]);
    }
    exports.isRequireCall = isRequireCall;
    /**
     * If the identifier `id` is the RHS of a property access of the form `namespace.id`
     * and `namespace` is an identifer then return `namespace`, otherwise `null`.
     * @param id The identifier whose namespace we want to find.
     */
    function findNamespaceOfIdentifier(id) {
        return id.parent && ts.isPropertyAccessExpression(id.parent) &&
            ts.isIdentifier(id.parent.expression) ?
            id.parent.expression :
            null;
    }
    function stripParentheses(node) {
        return ts.isParenthesizedExpression(node) ? node.expression : node;
    }
    exports.stripParentheses = stripParentheses;
    function isReexportStatement(statement) {
        return ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression) &&
            ts.isIdentifier(statement.expression.expression) &&
            statement.expression.expression.text === '__export' &&
            statement.expression.arguments.length === 1 &&
            isRequireCall(statement.expression.arguments[0]);
    }
    function stripExtension(fileName) {
        return fileName.replace(/\..+$/, '');
    }
    function getOrDefault(map, key, factory) {
        if (!map.has(key)) {
            map.set(key, factory(key));
        }
        return map.get(key);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanNfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9ob3N0L2NvbW1vbmpzX2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBQ2pDLDJFQUE0RDtJQUk1RCw4REFBbUM7SUFFbkMsMkVBQStDO0lBRS9DO1FBQTRDLGtEQUFrQjtRQUc1RCxnQ0FDSSxNQUFjLEVBQUUsTUFBZSxFQUFZLE9BQW1CLEVBQ3BELFlBQTZCLEVBQUUsR0FBd0I7WUFGckUsWUFHRSxrQkFBTSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxHQUFHLENBQUMsU0FDckQ7WUFIOEMsYUFBTyxHQUFQLE9BQU8sQ0FBWTtZQUNwRCxrQkFBWSxHQUFaLFlBQVksQ0FBaUI7WUFKakMscUJBQWUsR0FBRyxJQUFJLEdBQUcsRUFBZ0QsQ0FBQztZQUMxRSx5QkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBbUQsQ0FBQzs7UUFLM0YsQ0FBQztRQUVELHNEQUFxQixHQUFyQixVQUFzQixFQUFpQjtZQUNyQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO2dCQUN4QixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxFQUFDLElBQUksRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBQyxDQUFDO1FBQzlELENBQUM7UUFFRCwyREFBMEIsR0FBMUIsVUFBMkIsRUFBaUI7WUFDMUMsT0FBTyxJQUFJLENBQUMsOEJBQThCLENBQUMsRUFBRSxDQUFDLElBQUksaUJBQU0sMEJBQTBC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QUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUNoRCxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssVUFBVTtZQUNuRCxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUMzQyxhQUFhLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsUUFBZ0I7UUFDdEMsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsU0FBUyxZQUFZLENBQU8sR0FBYyxFQUFFLEdBQU0sRUFBRSxPQUFzQjtRQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNqQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUcsQ0FBQztJQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7YWJzb2x1dGVGcm9tfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtDbGFzc1N5bWJvbCwgRGVjbGFyYXRpb24sIEltcG9ydH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyJztcbmltcG9ydCB7QnVuZGxlUHJvZ3JhbX0gZnJvbSAnLi4vcGFja2FnZXMvYnVuZGxlX3Byb2dyYW0nO1xuaW1wb3J0IHtpc0RlZmluZWR9IGZyb20gJy4uL3V0aWxzJztcblxuaW1wb3J0IHtFc201UmVmbGVjdGlvbkhvc3R9IGZyb20gJy4vZXNtNV9ob3N0JztcblxuZXhwb3J0IGNsYXNzIENvbW1vbkpzUmVmbGVjdGlvbkhvc3QgZXh0ZW5kcyBFc201UmVmbGVjdGlvbkhvc3Qge1xuICBwcm90ZWN0ZWQgY29tbW9uSnNFeHBvcnRzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj58bnVsbD4oKTtcbiAgcHJvdGVjdGVkIHRvcExldmVsSGVscGVyQ2FsbHMgPSBuZXcgTWFwPHN0cmluZywgTWFwPHRzLlNvdXJjZUZpbGUsIHRzLkNhbGxFeHByZXNzaW9uW10+PigpO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGxvZ2dlcjogTG9nZ2VyLCBpc0NvcmU6IGJvb2xlYW4sIHByb3RlY3RlZCBwcm9ncmFtOiB0cy5Qcm9ncmFtLFxuICAgICAgcHJvdGVjdGVkIGNvbXBpbGVySG9zdDogdHMuQ29tcGlsZXJIb3N0LCBkdHM/OiBCdW5kbGVQcm9ncmFtfG51bGwpIHtcbiAgICBzdXBlcihsb2dnZXIsIGlzQ29yZSwgcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpLCBkdHMpO1xuICB9XG5cbiAgZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKGlkOiB0cy5JZGVudGlmaWVyKTogSW1wb3J0fG51bGwge1xuICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gdGhpcy5maW5kQ29tbW9uSnNJbXBvcnQoaWQpO1xuICAgIGlmIChyZXF1aXJlQ2FsbCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7ZnJvbTogcmVxdWlyZUNhbGwuYXJndW1lbnRzWzBdLnRleHQsIG5hbWU6IGlkLnRleHR9O1xuICB9XG5cbiAgZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiBEZWNsYXJhdGlvbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21tb25Kc0ltcG9ydGVkRGVjbGFyYXRpb24oaWQpIHx8IHN1cGVyLmdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKGlkKTtcbiAgfVxuXG4gIGdldEV4cG9ydHNPZk1vZHVsZShtb2R1bGU6IHRzLk5vZGUpOiBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj58bnVsbCB7XG4gICAgcmV0dXJuIHN1cGVyLmdldEV4cG9ydHNPZk1vZHVsZShtb2R1bGUpIHx8IHRoaXMuZ2V0Q29tbW9uSnNFeHBvcnRzKG1vZHVsZS5nZXRTb3VyY2VGaWxlKCkpO1xuICB9XG5cbiAgZ2V0Q29tbW9uSnNFeHBvcnRzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj58bnVsbCB7XG4gICAgcmV0dXJuIGdldE9yRGVmYXVsdChcbiAgICAgICAgdGhpcy5jb21tb25Kc0V4cG9ydHMsIHNvdXJjZUZpbGUsICgpID0+IHRoaXMuY29tcHV0ZUV4cG9ydHNPZkNvbW1vbkpzTW9kdWxlKHNvdXJjZUZpbGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2ggc3RhdGVtZW50cyByZWxhdGVkIHRvIHRoZSBnaXZlbiBjbGFzcyBmb3IgY2FsbHMgdG8gdGhlIHNwZWNpZmllZCBoZWxwZXIuXG4gICAqXG4gICAqIEluIENvbW1vbkpTIHRoZXNlIGhlbHBlciBjYWxscyBjYW4gYmUgb3V0c2lkZSB0aGUgY2xhc3MncyBJSUZFIGF0IHRoZSB0b3AgbGV2ZWwgb2YgdGhlXG4gICAqIHNvdXJjZSBmaWxlLiBTZWFyY2hpbmcgdGhlIHRvcCBsZXZlbCBzdGF0ZW1lbnRzIGZvciBoZWxwZXJzIGNhbiBiZSBleHBlbnNpdmUsIHNvIHdlXG4gICAqIHRyeSB0byBnZXQgaGVscGVycyBmcm9tIHRoZSBJSUZFIGZpcnN0IGFuZCBvbmx5IGZhbGwgYmFjayBvbiBzZWFyY2hpbmcgdGhlIHRvcCBsZXZlbCBpZlxuICAgKiBubyBoZWxwZXJzIGFyZSBmb3VuZC5cbiAgICpcbiAgICogQHBhcmFtIGNsYXNzU3ltYm9sIHRoZSBjbGFzcyB3aG9zZSBoZWxwZXIgY2FsbHMgd2UgYXJlIGludGVyZXN0ZWQgaW4uXG4gICAqIEBwYXJhbSBoZWxwZXJOYW1lIHRoZSBuYW1lIG9mIHRoZSBoZWxwZXIgKGUuZy4gYF9fZGVjb3JhdGVgKSB3aG9zZSBjYWxscyB3ZSBhcmUgaW50ZXJlc3RlZCBpbi5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2Ygbm9kZXMgb2YgY2FsbHMgdG8gdGhlIGhlbHBlciB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldEhlbHBlckNhbGxzRm9yQ2xhc3MoY2xhc3NTeW1ib2w6IENsYXNzU3ltYm9sLCBoZWxwZXJOYW1lOiBzdHJpbmcpOlxuICAgICAgdHMuQ2FsbEV4cHJlc3Npb25bXSB7XG4gICAgY29uc3QgZXNtNUhlbHBlckNhbGxzID0gc3VwZXIuZ2V0SGVscGVyQ2FsbHNGb3JDbGFzcyhjbGFzc1N5bWJvbCwgaGVscGVyTmFtZSk7XG4gICAgaWYgKGVzbTVIZWxwZXJDYWxscy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gZXNtNUhlbHBlckNhbGxzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gY2xhc3NTeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRUb3BMZXZlbEhlbHBlckNhbGxzKHNvdXJjZUZpbGUsIGhlbHBlck5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGFsbCB0aGUgaGVscGVyIGNhbGxzIGF0IHRoZSB0b3AgbGV2ZWwgb2YgYSBzb3VyY2UgZmlsZS5cbiAgICpcbiAgICogV2UgY2FjaGUgdGhlIGhlbHBlciBjYWxscyBwZXIgc291cmNlIGZpbGUgc28gdGhhdCB3ZSBkb24ndCBoYXZlIHRvIGtlZXAgcGFyc2luZyB0aGUgY29kZSBmb3JcbiAgICogZWFjaCBjbGFzcyBpbiBhIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIHRoZSBzb3VyY2Ugd2hvIG1heSBjb250YWluIGhlbHBlciBjYWxscy5cbiAgICogQHBhcmFtIGhlbHBlck5hbWUgdGhlIG5hbWUgb2YgdGhlIGhlbHBlciAoZS5nLiBgX19kZWNvcmF0ZWApIHdob3NlIGNhbGxzIHdlIGFyZSBpbnRlcmVzdGVkIGluLlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBub2RlcyBvZiBjYWxscyB0byB0aGUgaGVscGVyIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIGdldFRvcExldmVsSGVscGVyQ2FsbHMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgaGVscGVyTmFtZTogc3RyaW5nKTpcbiAgICAgIHRzLkNhbGxFeHByZXNzaW9uW10ge1xuICAgIGNvbnN0IGhlbHBlckNhbGxzTWFwID0gZ2V0T3JEZWZhdWx0KHRoaXMudG9wTGV2ZWxIZWxwZXJDYWxscywgaGVscGVyTmFtZSwgKCkgPT4gbmV3IE1hcCgpKTtcbiAgICByZXR1cm4gZ2V0T3JEZWZhdWx0KFxuICAgICAgICBoZWxwZXJDYWxsc01hcCwgc291cmNlRmlsZSxcbiAgICAgICAgKCkgPT4gc291cmNlRmlsZS5zdGF0ZW1lbnRzLm1hcChzdGF0ZW1lbnQgPT4gdGhpcy5nZXRIZWxwZXJDYWxsKHN0YXRlbWVudCwgaGVscGVyTmFtZSkpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKGlzRGVmaW5lZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21wdXRlRXhwb3J0c09mQ29tbW9uSnNNb2R1bGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IE1hcDxzdHJpbmcsIERlY2xhcmF0aW9uPiB7XG4gICAgY29uc3QgbW9kdWxlTWFwID0gbmV3IE1hcDxzdHJpbmcsIERlY2xhcmF0aW9uPigpO1xuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHRoaXMuZ2V0TW9kdWxlU3RhdGVtZW50cyhzb3VyY2VGaWxlKSkge1xuICAgICAgaWYgKGlzQ29tbW9uSnNFeHBvcnRTdGF0ZW1lbnQoc3RhdGVtZW50KSkge1xuICAgICAgICBjb25zdCBleHBvcnREZWNsYXJhdGlvbiA9IHRoaXMuZXh0cmFjdENvbW1vbkpzRXhwb3J0RGVjbGFyYXRpb24oc3RhdGVtZW50KTtcbiAgICAgICAgaWYgKGV4cG9ydERlY2xhcmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgbW9kdWxlTWFwLnNldChleHBvcnREZWNsYXJhdGlvbi5uYW1lLCBleHBvcnREZWNsYXJhdGlvbi5kZWNsYXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNSZWV4cG9ydFN0YXRlbWVudChzdGF0ZW1lbnQpKSB7XG4gICAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMuZXh0cmFjdENvbW1vbkpzUmVleHBvcnRzKHN0YXRlbWVudCwgc291cmNlRmlsZSk7XG4gICAgICAgIGZvciAoY29uc3QgcmVleHBvcnQgb2YgcmVleHBvcnRzKSB7XG4gICAgICAgICAgbW9kdWxlTWFwLnNldChyZWV4cG9ydC5uYW1lLCByZWV4cG9ydC5kZWNsYXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vZHVsZU1hcDtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdENvbW1vbkpzRXhwb3J0RGVjbGFyYXRpb24oc3RhdGVtZW50OiBDb21tb25Kc0V4cG9ydFN0YXRlbWVudCk6XG4gICAgICBDb21tb25Kc0V4cG9ydERlY2xhcmF0aW9ufG51bGwge1xuICAgIGNvbnN0IGV4cG9ydEV4cHJlc3Npb24gPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbi5yaWdodDtcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHRoaXMuZ2V0RGVjbGFyYXRpb25PZkV4cHJlc3Npb24oZXhwb3J0RXhwcmVzc2lvbik7XG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbmFtZSA9IHN0YXRlbWVudC5leHByZXNzaW9uLmxlZnQubmFtZS50ZXh0O1xuICAgIHJldHVybiB7bmFtZSwgZGVjbGFyYXRpb259O1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0Q29tbW9uSnNSZWV4cG9ydHMoc3RhdGVtZW50OiBSZWV4cG9ydFN0YXRlbWVudCwgY29udGFpbmluZ0ZpbGU6IHRzLlNvdXJjZUZpbGUpOlxuICAgICAgQ29tbW9uSnNFeHBvcnREZWNsYXJhdGlvbltdIHtcbiAgICBjb25zdCByZWV4cG9ydHM6IENvbW1vbkpzRXhwb3J0RGVjbGFyYXRpb25bXSA9IFtdO1xuICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gc3RhdGVtZW50LmV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xuICAgIGNvbnN0IGltcG9ydFBhdGggPSByZXF1aXJlQ2FsbC5hcmd1bWVudHNbMF0udGV4dDtcbiAgICBjb25zdCBpbXBvcnRlZEZpbGUgPSB0aGlzLnJlc29sdmVNb2R1bGVOYW1lKGltcG9ydFBhdGgsIGNvbnRhaW5pbmdGaWxlKTtcbiAgICBpZiAoaW1wb3J0ZWRGaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHZpYU1vZHVsZSA9IHN0cmlwRXh0ZW5zaW9uKGltcG9ydGVkRmlsZS5maWxlTmFtZSk7XG4gICAgICBjb25zdCBpbXBvcnRlZEV4cG9ydHMgPSB0aGlzLmdldEV4cG9ydHNPZk1vZHVsZShpbXBvcnRlZEZpbGUpO1xuICAgICAgaWYgKGltcG9ydGVkRXhwb3J0cyAhPT0gbnVsbCkge1xuICAgICAgICBpbXBvcnRlZEV4cG9ydHMuZm9yRWFjaChcbiAgICAgICAgICAgIChkZWNsLCBuYW1lKSA9PiByZWV4cG9ydHMucHVzaCh7bmFtZSwgZGVjbGFyYXRpb246IHtub2RlOiBkZWNsLm5vZGUsIHZpYU1vZHVsZX19KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZWV4cG9ydHM7XG4gIH1cblxuICBwcml2YXRlIGZpbmRDb21tb25Kc0ltcG9ydChpZDogdHMuSWRlbnRpZmllcik6IFJlcXVpcmVDYWxsfG51bGwge1xuICAgIC8vIElzIGBpZGAgYSBuYW1lc3BhY2VkIHByb3BlcnR5IGFjY2VzcywgZS5nLiBgRGlyZWN0aXZlYCBpbiBgY29yZS5EaXJlY3RpdmVgP1xuICAgIC8vIElmIHNvIGNhcHR1cmUgdGhlIHN5bWJvbCBvZiB0aGUgbmFtZXNwYWNlLCBlLmcuIGBjb3JlYC5cbiAgICBjb25zdCBuc0lkZW50aWZpZXIgPSBmaW5kTmFtZXNwYWNlT2ZJZGVudGlmaWVyKGlkKTtcbiAgICBjb25zdCBuc1N5bWJvbCA9IG5zSWRlbnRpZmllciAmJiB0aGlzLmNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihuc0lkZW50aWZpZXIpIHx8IG51bGw7XG4gICAgY29uc3QgbnNEZWNsYXJhdGlvbiA9IG5zU3ltYm9sICYmIG5zU3ltYm9sLnZhbHVlRGVjbGFyYXRpb247XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPVxuICAgICAgICBuc0RlY2xhcmF0aW9uICYmIHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihuc0RlY2xhcmF0aW9uKSAmJiBuc0RlY2xhcmF0aW9uLmluaXRpYWxpemVyIHx8XG4gICAgICAgIG51bGw7XG4gICAgcmV0dXJuIGluaXRpYWxpemVyICYmIGlzUmVxdWlyZUNhbGwoaW5pdGlhbGl6ZXIpID8gaW5pdGlhbGl6ZXIgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb21tb25Kc0ltcG9ydGVkRGVjbGFyYXRpb24oaWQ6IHRzLklkZW50aWZpZXIpOiBEZWNsYXJhdGlvbnxudWxsIHtcbiAgICBjb25zdCBpbXBvcnRJbmZvID0gdGhpcy5nZXRJbXBvcnRPZklkZW50aWZpZXIoaWQpO1xuICAgIGlmIChpbXBvcnRJbmZvID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRlZEZpbGUgPSB0aGlzLnJlc29sdmVNb2R1bGVOYW1lKGltcG9ydEluZm8uZnJvbSwgaWQuZ2V0U291cmNlRmlsZSgpKTtcbiAgICBpZiAoaW1wb3J0ZWRGaWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7bm9kZTogaW1wb3J0ZWRGaWxlLCB2aWFNb2R1bGU6IGltcG9ydEluZm8uZnJvbX07XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVNb2R1bGVOYW1lKG1vZHVsZU5hbWU6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5Tb3VyY2VGaWxlXG4gICAgICB8dW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5jb21waWxlckhvc3QucmVzb2x2ZU1vZHVsZU5hbWVzKSB7XG4gICAgICBjb25zdCBtb2R1bGVJbmZvID1cbiAgICAgICAgICB0aGlzLmNvbXBpbGVySG9zdC5yZXNvbHZlTW9kdWxlTmFtZXMoW21vZHVsZU5hbWVdLCBjb250YWluaW5nRmlsZS5maWxlTmFtZSlbMF07XG4gICAgICByZXR1cm4gbW9kdWxlSW5mbyAmJiB0aGlzLnByb2dyYW0uZ2V0U291cmNlRmlsZShhYnNvbHV0ZUZyb20obW9kdWxlSW5mby5yZXNvbHZlZEZpbGVOYW1lKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1vZHVsZUluZm8gPSB0cy5yZXNvbHZlTW9kdWxlTmFtZShcbiAgICAgICAgICBtb2R1bGVOYW1lLCBjb250YWluaW5nRmlsZS5maWxlTmFtZSwgdGhpcy5wcm9ncmFtLmdldENvbXBpbGVyT3B0aW9ucygpLFxuICAgICAgICAgIHRoaXMuY29tcGlsZXJIb3N0KTtcbiAgICAgIHJldHVybiBtb2R1bGVJbmZvLnJlc29sdmVkTW9kdWxlICYmXG4gICAgICAgICAgdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUoYWJzb2x1dGVGcm9tKG1vZHVsZUluZm8ucmVzb2x2ZWRNb2R1bGUucmVzb2x2ZWRGaWxlTmFtZSkpO1xuICAgIH1cbiAgfVxufVxuXG50eXBlIENvbW1vbkpzRXhwb3J0U3RhdGVtZW50ID0gdHMuRXhwcmVzc2lvblN0YXRlbWVudCAmIHtcbiAgZXhwcmVzc2lvbjpcbiAgICAgIHRzLkJpbmFyeUV4cHJlc3Npb24gJiB7bGVmdDogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uICYge2V4cHJlc3Npb246IHRzLklkZW50aWZpZXJ9fVxufTtcbmV4cG9ydCBmdW5jdGlvbiBpc0NvbW1vbkpzRXhwb3J0U3RhdGVtZW50KHM6IHRzLlN0YXRlbWVudCk6IHMgaXMgQ29tbW9uSnNFeHBvcnRTdGF0ZW1lbnQge1xuICByZXR1cm4gdHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KHMpICYmIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihzLmV4cHJlc3Npb24pICYmXG4gICAgICB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihzLmV4cHJlc3Npb24ubGVmdCkgJiZcbiAgICAgIHRzLmlzSWRlbnRpZmllcihzLmV4cHJlc3Npb24ubGVmdC5leHByZXNzaW9uKSAmJlxuICAgICAgcy5leHByZXNzaW9uLmxlZnQuZXhwcmVzc2lvbi50ZXh0ID09PSAnZXhwb3J0cyc7XG59XG5cbmludGVyZmFjZSBDb21tb25Kc0V4cG9ydERlY2xhcmF0aW9uIHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZWNsYXJhdGlvbjogRGVjbGFyYXRpb247XG59XG5cbmV4cG9ydCB0eXBlIFJlcXVpcmVDYWxsID0gdHMuQ2FsbEV4cHJlc3Npb24gJiB7YXJndW1lbnRzOiBbdHMuU3RyaW5nTGl0ZXJhbF19O1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVxdWlyZUNhbGwobm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgUmVxdWlyZUNhbGwge1xuICByZXR1cm4gdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc0lkZW50aWZpZXIobm9kZS5leHByZXNzaW9uKSAmJlxuICAgICAgbm9kZS5leHByZXNzaW9uLnRleHQgPT09ICdyZXF1aXJlJyAmJiBub2RlLmFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLmFyZ3VtZW50c1swXSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGlkZW50aWZpZXIgYGlkYCBpcyB0aGUgUkhTIG9mIGEgcHJvcGVydHkgYWNjZXNzIG9mIHRoZSBmb3JtIGBuYW1lc3BhY2UuaWRgXG4gKiBhbmQgYG5hbWVzcGFjZWAgaXMgYW4gaWRlbnRpZmVyIHRoZW4gcmV0dXJuIGBuYW1lc3BhY2VgLCBvdGhlcndpc2UgYG51bGxgLlxuICogQHBhcmFtIGlkIFRoZSBpZGVudGlmaWVyIHdob3NlIG5hbWVzcGFjZSB3ZSB3YW50IHRvIGZpbmQuXG4gKi9cbmZ1bmN0aW9uIGZpbmROYW1lc3BhY2VPZklkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiB0cy5JZGVudGlmaWVyfG51bGwge1xuICByZXR1cm4gaWQucGFyZW50ICYmIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKGlkLnBhcmVudCkgJiZcbiAgICAgICAgICB0cy5pc0lkZW50aWZpZXIoaWQucGFyZW50LmV4cHJlc3Npb24pID9cbiAgICAgIGlkLnBhcmVudC5leHByZXNzaW9uIDpcbiAgICAgIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpcFBhcmVudGhlc2VzKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgcmV0dXJuIHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkgPyBub2RlLmV4cHJlc3Npb24gOiBub2RlO1xufVxuXG50eXBlIFJlZXhwb3J0U3RhdGVtZW50ID0gdHMuRXhwcmVzc2lvblN0YXRlbWVudCAmIHtleHByZXNzaW9uOiB7YXJndW1lbnRzOiBbUmVxdWlyZUNhbGxdfX07XG5mdW5jdGlvbiBpc1JlZXhwb3J0U3RhdGVtZW50KHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogc3RhdGVtZW50IGlzIFJlZXhwb3J0U3RhdGVtZW50IHtcbiAgcmV0dXJuIHRzLmlzRXhwcmVzc2lvblN0YXRlbWVudChzdGF0ZW1lbnQpICYmIHRzLmlzQ2FsbEV4cHJlc3Npb24oc3RhdGVtZW50LmV4cHJlc3Npb24pICYmXG4gICAgICB0cy5pc0lkZW50aWZpZXIoc3RhdGVtZW50LmV4cHJlc3Npb24uZXhwcmVzc2lvbikgJiZcbiAgICAgIHN0YXRlbWVudC5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dCA9PT0gJ19fZXhwb3J0JyAmJlxuICAgICAgc3RhdGVtZW50LmV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgaXNSZXF1aXJlQ2FsbChzdGF0ZW1lbnQuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF0pO1xufVxuXG5mdW5jdGlvbiBzdHJpcEV4dGVuc2lvbihmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGZpbGVOYW1lLnJlcGxhY2UoL1xcLi4rJC8sICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3JEZWZhdWx0PEssIFY+KG1hcDogTWFwPEssIFY+LCBrZXk6IEssIGZhY3Rvcnk6IChrZXk6IEspID0+IFYpOiBWIHtcbiAgaWYgKCFtYXAuaGFzKGtleSkpIHtcbiAgICBtYXAuc2V0KGtleSwgZmFjdG9yeShrZXkpKTtcbiAgfVxuICByZXR1cm4gbWFwLmdldChrZXkpICE7XG59Il19
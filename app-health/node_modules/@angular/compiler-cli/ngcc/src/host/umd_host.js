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
        define("@angular/compiler-cli/ngcc/src/host/umd_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/host/esm5_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var esm5_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm5_host");
    var UmdReflectionHost = /** @class */ (function (_super) {
        tslib_1.__extends(UmdReflectionHost, _super);
        function UmdReflectionHost(logger, isCore, program, compilerHost, dts) {
            var _this = _super.call(this, logger, isCore, program.getTypeChecker(), dts) || this;
            _this.program = program;
            _this.compilerHost = compilerHost;
            _this.umdModules = new Map();
            _this.umdExports = new Map();
            _this.umdImportPaths = new Map();
            return _this;
        }
        UmdReflectionHost.prototype.getImportOfIdentifier = function (id) {
            var importParameter = this.findUmdImportParameter(id);
            var from = importParameter && this.getUmdImportPath(importParameter);
            return from !== null ? { from: from, name: id.text } : null;
        };
        UmdReflectionHost.prototype.getDeclarationOfIdentifier = function (id) {
            return this.getUmdImportedDeclaration(id) || _super.prototype.getDeclarationOfIdentifier.call(this, id);
        };
        UmdReflectionHost.prototype.getExportsOfModule = function (module) {
            return _super.prototype.getExportsOfModule.call(this, module) || this.getUmdExports(module.getSourceFile());
        };
        UmdReflectionHost.prototype.getUmdModule = function (sourceFile) {
            if (sourceFile.isDeclarationFile) {
                return null;
            }
            if (!this.umdModules.has(sourceFile)) {
                if (sourceFile.statements.length !== 1) {
                    throw new Error("Expected UMD module file (" + sourceFile.fileName + ") to contain exactly one statement, but found " + sourceFile.statements + ".");
                }
                this.umdModules.set(sourceFile, parseStatementForUmdModule(sourceFile.statements[0]));
            }
            return this.umdModules.get(sourceFile);
        };
        UmdReflectionHost.prototype.getUmdImportPath = function (importParameter) {
            var e_1, _a;
            if (this.umdImportPaths.has(importParameter)) {
                return this.umdImportPaths.get(importParameter);
            }
            var umdModule = this.getUmdModule(importParameter.getSourceFile());
            if (umdModule === null) {
                return null;
            }
            var imports = getImportsOfUmdModule(umdModule);
            if (imports === null) {
                return null;
            }
            try {
                for (var imports_1 = tslib_1.__values(imports), imports_1_1 = imports_1.next(); !imports_1_1.done; imports_1_1 = imports_1.next()) {
                    var i = imports_1_1.value;
                    this.umdImportPaths.set(i.parameter, i.path);
                    if (i.parameter === importParameter) {
                        return i.path;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (imports_1_1 && !imports_1_1.done && (_a = imports_1.return)) _a.call(imports_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        UmdReflectionHost.prototype.getUmdExports = function (sourceFile) {
            if (!this.umdExports.has(sourceFile)) {
                var moduleExports = this.computeExportsOfUmdModule(sourceFile);
                this.umdExports.set(sourceFile, moduleExports);
            }
            return this.umdExports.get(sourceFile);
        };
        /** Get the top level statements for a module.
         *
         * In UMD modules these are the body of the UMD factory function.
         *
         * @param sourceFile The module whose statements we want.
         * @returns An array of top level statements for the given module.
         */
        UmdReflectionHost.prototype.getModuleStatements = function (sourceFile) {
            var umdModule = this.getUmdModule(sourceFile);
            return umdModule !== null ? Array.from(umdModule.factoryFn.body.statements) : [];
        };
        UmdReflectionHost.prototype.computeExportsOfUmdModule = function (sourceFile) {
            var _this = this;
            var moduleMap = new Map();
            var exportStatements = this.getModuleStatements(sourceFile).filter(isUmdExportStatement);
            var exportDeclarations = exportStatements.map(function (statement) { return _this.extractUmdExportDeclaration(statement); });
            exportDeclarations.forEach(function (decl) {
                if (decl) {
                    moduleMap.set(decl.name, decl.declaration);
                }
            });
            return moduleMap;
        };
        UmdReflectionHost.prototype.extractUmdExportDeclaration = function (statement) {
            var exportExpression = statement.expression.right;
            var name = statement.expression.left.name.text;
            var declaration = this.getDeclarationOfExpression(exportExpression);
            if (declaration === null) {
                return null;
            }
            return { name: name, declaration: declaration };
        };
        UmdReflectionHost.prototype.findUmdImportParameter = function (id) {
            // Is `id` a namespaced property access, e.g. `Directive` in `core.Directive`?
            // If so capture the symbol of the namespace, e.g. `core`.
            var nsIdentifier = findNamespaceOfIdentifier(id);
            var nsSymbol = nsIdentifier && this.checker.getSymbolAtLocation(nsIdentifier) || null;
            // Is the namespace a parameter on a UMD factory function, e.g. `function factory(this, core)`?
            // If so then return its declaration.
            var nsDeclaration = nsSymbol && nsSymbol.valueDeclaration;
            return nsDeclaration && ts.isParameter(nsDeclaration) ? nsDeclaration : null;
        };
        UmdReflectionHost.prototype.getUmdImportedDeclaration = function (id) {
            var importInfo = this.getImportOfIdentifier(id);
            if (importInfo === null) {
                return null;
            }
            var importedFile = this.resolveModuleName(importInfo.from, id.getSourceFile());
            if (importedFile === undefined) {
                return null;
            }
            // We need to add the `viaModule` because  the `getExportsOfModule()` call
            // did not know that we were importing the declaration.
            return { node: importedFile, viaModule: importInfo.from };
        };
        UmdReflectionHost.prototype.resolveModuleName = function (moduleName, containingFile) {
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
        return UmdReflectionHost;
    }(esm5_host_1.Esm5ReflectionHost));
    exports.UmdReflectionHost = UmdReflectionHost;
    function parseStatementForUmdModule(statement) {
        var wrapperCall = getUmdWrapperCall(statement);
        if (!wrapperCall)
            return null;
        var wrapperFn = wrapperCall.expression;
        if (!ts.isFunctionExpression(wrapperFn))
            return null;
        var factoryFnParamIndex = wrapperFn.parameters.findIndex(function (parameter) { return ts.isIdentifier(parameter.name) && parameter.name.text === 'factory'; });
        if (factoryFnParamIndex === -1)
            return null;
        var factoryFn = stripParentheses(wrapperCall.arguments[factoryFnParamIndex]);
        if (!factoryFn || !ts.isFunctionExpression(factoryFn))
            return null;
        return { wrapperFn: wrapperFn, factoryFn: factoryFn };
    }
    exports.parseStatementForUmdModule = parseStatementForUmdModule;
    function getUmdWrapperCall(statement) {
        if (!ts.isExpressionStatement(statement) || !ts.isParenthesizedExpression(statement.expression) ||
            !ts.isCallExpression(statement.expression.expression) ||
            !ts.isFunctionExpression(statement.expression.expression.expression)) {
            return null;
        }
        return statement.expression.expression;
    }
    function getImportsOfUmdModule(umdModule) {
        var imports = [];
        for (var i = 1; i < umdModule.factoryFn.parameters.length; i++) {
            imports.push({
                parameter: umdModule.factoryFn.parameters[i],
                path: getRequiredModulePath(umdModule.wrapperFn, i)
            });
        }
        return imports;
    }
    exports.getImportsOfUmdModule = getImportsOfUmdModule;
    function isUmdExportStatement(s) {
        return ts.isExpressionStatement(s) && ts.isBinaryExpression(s.expression) &&
            ts.isPropertyAccessExpression(s.expression.left) &&
            ts.isIdentifier(s.expression.left.expression) &&
            s.expression.left.expression.text === 'exports';
    }
    function getRequiredModulePath(wrapperFn, paramIndex) {
        var statement = wrapperFn.body.statements[0];
        if (!ts.isExpressionStatement(statement)) {
            throw new Error('UMD wrapper body is not an expression statement:\n' + wrapperFn.body.getText());
        }
        var modulePaths = [];
        findModulePaths(statement.expression);
        // Since we were only interested in the `require()` calls, we miss the `exports` argument, so we
        // need to subtract 1.
        // E.g. `function(exports, dep1, dep2)` maps to `function(exports, require('path/to/dep1'),
        // require('path/to/dep2'))`
        return modulePaths[paramIndex - 1];
        // Search the statement for calls to `require('...')` and extract the string value of the first
        // argument
        function findModulePaths(node) {
            if (isRequireCall(node)) {
                var argument = node.arguments[0];
                if (ts.isStringLiteral(argument)) {
                    modulePaths.push(argument.text);
                }
            }
            else {
                node.forEachChild(findModulePaths);
            }
        }
    }
    function isRequireCall(node) {
        return ts.isCallExpression(node) && ts.isIdentifier(node.expression) &&
            node.expression.text === 'require' && node.arguments.length === 1;
    }
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW1kX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvaG9zdC91bWRfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMsMkVBQTREO0lBSTVELDJFQUErQztJQUUvQztRQUF1Qyw2Q0FBa0I7UUFJdkQsMkJBQ0ksTUFBYyxFQUFFLE1BQWUsRUFBWSxPQUFtQixFQUNwRCxZQUE2QixFQUFFLEdBQXdCO1lBRnJFLFlBR0Usa0JBQU0sTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLFNBQ3JEO1lBSDhDLGFBQU8sR0FBUCxPQUFPLENBQVk7WUFDcEQsa0JBQVksR0FBWixZQUFZLENBQWlCO1lBTGpDLGdCQUFVLEdBQUcsSUFBSSxHQUFHLEVBQWlDLENBQUM7WUFDdEQsZ0JBQVUsR0FBRyxJQUFJLEdBQUcsRUFBZ0QsQ0FBQztZQUNyRSxvQkFBYyxHQUFHLElBQUksR0FBRyxFQUF3QyxDQUFDOztRQUszRSxDQUFDO1FBRUQsaURBQXFCLEdBQXJCLFVBQXNCLEVBQWlCO1lBQ3JDLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4RCxJQUFNLElBQUksR0FBRyxlQUFlLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZFLE9BQU8sSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdEQsQ0FBQztRQUVELHNEQUEwQixHQUExQixVQUEyQixFQUFpQjtZQUMxQyxPQUFPLElBQUksQ0FBQyx5QkFB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LiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7YWJzb2x1dGVGcm9tfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtEZWNsYXJhdGlvbiwgSW1wb3J0fSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvcmVmbGVjdGlvbic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXInO1xuaW1wb3J0IHtCdW5kbGVQcm9ncmFtfSBmcm9tICcuLi9wYWNrYWdlcy9idW5kbGVfcHJvZ3JhbSc7XG5pbXBvcnQge0VzbTVSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi9lc201X2hvc3QnO1xuXG5leHBvcnQgY2xhc3MgVW1kUmVmbGVjdGlvbkhvc3QgZXh0ZW5kcyBFc201UmVmbGVjdGlvbkhvc3Qge1xuICBwcm90ZWN0ZWQgdW1kTW9kdWxlcyA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgVW1kTW9kdWxlfG51bGw+KCk7XG4gIHByb3RlY3RlZCB1bWRFeHBvcnRzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj58bnVsbD4oKTtcbiAgcHJvdGVjdGVkIHVtZEltcG9ydFBhdGhzID0gbmV3IE1hcDx0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbiwgc3RyaW5nfG51bGw+KCk7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgbG9nZ2VyOiBMb2dnZXIsIGlzQ29yZTogYm9vbGVhbiwgcHJvdGVjdGVkIHByb2dyYW06IHRzLlByb2dyYW0sXG4gICAgICBwcm90ZWN0ZWQgY29tcGlsZXJIb3N0OiB0cy5Db21waWxlckhvc3QsIGR0cz86IEJ1bmRsZVByb2dyYW18bnVsbCkge1xuICAgIHN1cGVyKGxvZ2dlciwgaXNDb3JlLCBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCksIGR0cyk7XG4gIH1cblxuICBnZXRJbXBvcnRPZklkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiBJbXBvcnR8bnVsbCB7XG4gICAgY29uc3QgaW1wb3J0UGFyYW1ldGVyID0gdGhpcy5maW5kVW1kSW1wb3J0UGFyYW1ldGVyKGlkKTtcbiAgICBjb25zdCBmcm9tID0gaW1wb3J0UGFyYW1ldGVyICYmIHRoaXMuZ2V0VW1kSW1wb3J0UGF0aChpbXBvcnRQYXJhbWV0ZXIpO1xuICAgIHJldHVybiBmcm9tICE9PSBudWxsID8ge2Zyb20sIG5hbWU6IGlkLnRleHR9IDogbnVsbDtcbiAgfVxuXG4gIGdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKGlkOiB0cy5JZGVudGlmaWVyKTogRGVjbGFyYXRpb258bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VW1kSW1wb3J0ZWREZWNsYXJhdGlvbihpZCkgfHwgc3VwZXIuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIoaWQpO1xuICB9XG5cbiAgZ2V0RXhwb3J0c09mTW9kdWxlKG1vZHVsZTogdHMuTm9kZSk6IE1hcDxzdHJpbmcsIERlY2xhcmF0aW9uPnxudWxsIHtcbiAgICByZXR1cm4gc3VwZXIuZ2V0RXhwb3J0c09mTW9kdWxlKG1vZHVsZSkgfHwgdGhpcy5nZXRVbWRFeHBvcnRzKG1vZHVsZS5nZXRTb3VyY2VGaWxlKCkpO1xuICB9XG5cbiAgZ2V0VW1kTW9kdWxlKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBVbWRNb2R1bGV8bnVsbCB7XG4gICAgaWYgKHNvdXJjZUZpbGUuaXNEZWNsYXJhdGlvbkZpbGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMudW1kTW9kdWxlcy5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIGlmIChzb3VyY2VGaWxlLnN0YXRlbWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBFeHBlY3RlZCBVTUQgbW9kdWxlIGZpbGUgKCR7c291cmNlRmlsZS5maWxlTmFtZX0pIHRvIGNvbnRhaW4gZXhhY3RseSBvbmUgc3RhdGVtZW50LCBidXQgZm91bmQgJHtzb3VyY2VGaWxlLnN0YXRlbWVudHN9LmApO1xuICAgICAgfVxuICAgICAgdGhpcy51bWRNb2R1bGVzLnNldChzb3VyY2VGaWxlLCBwYXJzZVN0YXRlbWVudEZvclVtZE1vZHVsZShzb3VyY2VGaWxlLnN0YXRlbWVudHNbMF0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudW1kTW9kdWxlcy5nZXQoc291cmNlRmlsZSkgITtcbiAgfVxuXG4gIGdldFVtZEltcG9ydFBhdGgoaW1wb3J0UGFyYW1ldGVyOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbik6IHN0cmluZ3xudWxsIHtcbiAgICBpZiAodGhpcy51bWRJbXBvcnRQYXRocy5oYXMoaW1wb3J0UGFyYW1ldGVyKSkge1xuICAgICAgcmV0dXJuIHRoaXMudW1kSW1wb3J0UGF0aHMuZ2V0KGltcG9ydFBhcmFtZXRlcikgITtcbiAgICB9XG5cbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLmdldFVtZE1vZHVsZShpbXBvcnRQYXJhbWV0ZXIuZ2V0U291cmNlRmlsZSgpKTtcbiAgICBpZiAodW1kTW9kdWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0c09mVW1kTW9kdWxlKHVtZE1vZHVsZSk7XG4gICAgaWYgKGltcG9ydHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaSBvZiBpbXBvcnRzKSB7XG4gICAgICB0aGlzLnVtZEltcG9ydFBhdGhzLnNldChpLnBhcmFtZXRlciwgaS5wYXRoKTtcbiAgICAgIGlmIChpLnBhcmFtZXRlciA9PT0gaW1wb3J0UGFyYW1ldGVyKSB7XG4gICAgICAgIHJldHVybiBpLnBhdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRVbWRFeHBvcnRzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj58bnVsbCB7XG4gICAgaWYgKCF0aGlzLnVtZEV4cG9ydHMuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICBjb25zdCBtb2R1bGVFeHBvcnRzID0gdGhpcy5jb21wdXRlRXhwb3J0c09mVW1kTW9kdWxlKHNvdXJjZUZpbGUpO1xuICAgICAgdGhpcy51bWRFeHBvcnRzLnNldChzb3VyY2VGaWxlLCBtb2R1bGVFeHBvcnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudW1kRXhwb3J0cy5nZXQoc291cmNlRmlsZSkgITtcbiAgfVxuXG4gIC8qKiBHZXQgdGhlIHRvcCBsZXZlbCBzdGF0ZW1lbnRzIGZvciBhIG1vZHVsZS5cbiAgICpcbiAgICogSW4gVU1EIG1vZHVsZXMgdGhlc2UgYXJlIHRoZSBib2R5IG9mIHRoZSBVTUQgZmFjdG9yeSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgVGhlIG1vZHVsZSB3aG9zZSBzdGF0ZW1lbnRzIHdlIHdhbnQuXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHRvcCBsZXZlbCBzdGF0ZW1lbnRzIGZvciB0aGUgZ2l2ZW4gbW9kdWxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldE1vZHVsZVN0YXRlbWVudHMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLlN0YXRlbWVudFtdIHtcbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLmdldFVtZE1vZHVsZShzb3VyY2VGaWxlKTtcbiAgICByZXR1cm4gdW1kTW9kdWxlICE9PSBudWxsID8gQXJyYXkuZnJvbSh1bWRNb2R1bGUuZmFjdG9yeUZuLmJvZHkuc3RhdGVtZW50cykgOiBbXTtcbiAgfVxuXG4gIHByaXZhdGUgY29tcHV0ZUV4cG9ydHNPZlVtZE1vZHVsZShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTWFwPHN0cmluZywgRGVjbGFyYXRpb24+fG51bGwge1xuICAgIGNvbnN0IG1vZHVsZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj4oKTtcbiAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnRzID0gdGhpcy5nZXRNb2R1bGVTdGF0ZW1lbnRzKHNvdXJjZUZpbGUpLmZpbHRlcihpc1VtZEV4cG9ydFN0YXRlbWVudCk7XG4gICAgY29uc3QgZXhwb3J0RGVjbGFyYXRpb25zID1cbiAgICAgICAgZXhwb3J0U3RhdGVtZW50cy5tYXAoc3RhdGVtZW50ID0+IHRoaXMuZXh0cmFjdFVtZEV4cG9ydERlY2xhcmF0aW9uKHN0YXRlbWVudCkpO1xuICAgIGV4cG9ydERlY2xhcmF0aW9ucy5mb3JFYWNoKGRlY2wgPT4ge1xuICAgICAgaWYgKGRlY2wpIHtcbiAgICAgICAgbW9kdWxlTWFwLnNldChkZWNsLm5hbWUsIGRlY2wuZGVjbGFyYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtb2R1bGVNYXA7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RVbWRFeHBvcnREZWNsYXJhdGlvbihzdGF0ZW1lbnQ6IFVtZEV4cG9ydFN0YXRlbWVudCk6IFVtZEV4cG9ydERlY2xhcmF0aW9ufG51bGwge1xuICAgIGNvbnN0IGV4cG9ydEV4cHJlc3Npb24gPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbi5yaWdodDtcbiAgICBjb25zdCBuYW1lID0gc3RhdGVtZW50LmV4cHJlc3Npb24ubGVmdC5uYW1lLnRleHQ7XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHRoaXMuZ2V0RGVjbGFyYXRpb25PZkV4cHJlc3Npb24oZXhwb3J0RXhwcmVzc2lvbik7XG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge25hbWUsIGRlY2xhcmF0aW9ufTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZFVtZEltcG9ydFBhcmFtZXRlcihpZDogdHMuSWRlbnRpZmllcik6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9ufG51bGwge1xuICAgIC8vIElzIGBpZGAgYSBuYW1lc3BhY2VkIHByb3BlcnR5IGFjY2VzcywgZS5nLiBgRGlyZWN0aXZlYCBpbiBgY29yZS5EaXJlY3RpdmVgP1xuICAgIC8vIElmIHNvIGNhcHR1cmUgdGhlIHN5bWJvbCBvZiB0aGUgbmFtZXNwYWNlLCBlLmcuIGBjb3JlYC5cbiAgICBjb25zdCBuc0lkZW50aWZpZXIgPSBmaW5kTmFtZXNwYWNlT2ZJZGVudGlmaWVyKGlkKTtcbiAgICBjb25zdCBuc1N5bWJvbCA9IG5zSWRlbnRpZmllciAmJiB0aGlzLmNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihuc0lkZW50aWZpZXIpIHx8IG51bGw7XG5cbiAgICAvLyBJcyB0aGUgbmFtZXNwYWNlIGEgcGFyYW1ldGVyIG9uIGEgVU1EIGZhY3RvcnkgZnVuY3Rpb24sIGUuZy4gYGZ1bmN0aW9uIGZhY3RvcnkodGhpcywgY29yZSlgP1xuICAgIC8vIElmIHNvIHRoZW4gcmV0dXJuIGl0cyBkZWNsYXJhdGlvbi5cbiAgICBjb25zdCBuc0RlY2xhcmF0aW9uID0gbnNTeW1ib2wgJiYgbnNTeW1ib2wudmFsdWVEZWNsYXJhdGlvbjtcbiAgICByZXR1cm4gbnNEZWNsYXJhdGlvbiAmJiB0cy5pc1BhcmFtZXRlcihuc0RlY2xhcmF0aW9uKSA/IG5zRGVjbGFyYXRpb24gOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRVbWRJbXBvcnRlZERlY2xhcmF0aW9uKGlkOiB0cy5JZGVudGlmaWVyKTogRGVjbGFyYXRpb258bnVsbCB7XG4gICAgY29uc3QgaW1wb3J0SW5mbyA9IHRoaXMuZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKGlkKTtcbiAgICBpZiAoaW1wb3J0SW5mbyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0ZWRGaWxlID0gdGhpcy5yZXNvbHZlTW9kdWxlTmFtZShpbXBvcnRJbmZvLmZyb20sIGlkLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgaWYgKGltcG9ydGVkRmlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgYHZpYU1vZHVsZWAgYmVjYXVzZSAgdGhlIGBnZXRFeHBvcnRzT2ZNb2R1bGUoKWAgY2FsbFxuICAgIC8vIGRpZCBub3Qga25vdyB0aGF0IHdlIHdlcmUgaW1wb3J0aW5nIHRoZSBkZWNsYXJhdGlvbi5cbiAgICByZXR1cm4ge25vZGU6IGltcG9ydGVkRmlsZSwgdmlhTW9kdWxlOiBpbXBvcnRJbmZvLmZyb219O1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlTW9kdWxlTmFtZShtb2R1bGVOYW1lOiBzdHJpbmcsIGNvbnRhaW5pbmdGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuU291cmNlRmlsZVxuICAgICAgfHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY29tcGlsZXJIb3N0LnJlc29sdmVNb2R1bGVOYW1lcykge1xuICAgICAgY29uc3QgbW9kdWxlSW5mbyA9XG4gICAgICAgICAgdGhpcy5jb21waWxlckhvc3QucmVzb2x2ZU1vZHVsZU5hbWVzKFttb2R1bGVOYW1lXSwgY29udGFpbmluZ0ZpbGUuZmlsZU5hbWUpWzBdO1xuICAgICAgcmV0dXJuIG1vZHVsZUluZm8gJiYgdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUoYWJzb2x1dGVGcm9tKG1vZHVsZUluZm8ucmVzb2x2ZWRGaWxlTmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtb2R1bGVJbmZvID0gdHMucmVzb2x2ZU1vZHVsZU5hbWUoXG4gICAgICAgICAgbW9kdWxlTmFtZSwgY29udGFpbmluZ0ZpbGUuZmlsZU5hbWUsIHRoaXMucHJvZ3JhbS5nZXRDb21waWxlck9wdGlvbnMoKSxcbiAgICAgICAgICB0aGlzLmNvbXBpbGVySG9zdCk7XG4gICAgICByZXR1cm4gbW9kdWxlSW5mby5yZXNvbHZlZE1vZHVsZSAmJlxuICAgICAgICAgIHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGFic29sdXRlRnJvbShtb2R1bGVJbmZvLnJlc29sdmVkTW9kdWxlLnJlc29sdmVkRmlsZU5hbWUpKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50Rm9yVW1kTW9kdWxlKHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogVW1kTW9kdWxlfG51bGwge1xuICBjb25zdCB3cmFwcGVyQ2FsbCA9IGdldFVtZFdyYXBwZXJDYWxsKHN0YXRlbWVudCk7XG4gIGlmICghd3JhcHBlckNhbGwpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHdyYXBwZXJGbiA9IHdyYXBwZXJDYWxsLmV4cHJlc3Npb247XG4gIGlmICghdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24od3JhcHBlckZuKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZmFjdG9yeUZuUGFyYW1JbmRleCA9IHdyYXBwZXJGbi5wYXJhbWV0ZXJzLmZpbmRJbmRleChcbiAgICAgIHBhcmFtZXRlciA9PiB0cy5pc0lkZW50aWZpZXIocGFyYW1ldGVyLm5hbWUpICYmIHBhcmFtZXRlci5uYW1lLnRleHQgPT09ICdmYWN0b3J5Jyk7XG4gIGlmIChmYWN0b3J5Rm5QYXJhbUluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZmFjdG9yeUZuID0gc3RyaXBQYXJlbnRoZXNlcyh3cmFwcGVyQ2FsbC5hcmd1bWVudHNbZmFjdG9yeUZuUGFyYW1JbmRleF0pO1xuICBpZiAoIWZhY3RvcnlGbiB8fCAhdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24oZmFjdG9yeUZuKSkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIHt3cmFwcGVyRm4sIGZhY3RvcnlGbn07XG59XG5cbmZ1bmN0aW9uIGdldFVtZFdyYXBwZXJDYWxsKHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogdHMuQ2FsbEV4cHJlc3Npb24mXG4gICAge2V4cHJlc3Npb246IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbn18bnVsbCB7XG4gIGlmICghdHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KHN0YXRlbWVudCkgfHwgIXRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24oc3RhdGVtZW50LmV4cHJlc3Npb24pIHx8XG4gICAgICAhdHMuaXNDYWxsRXhwcmVzc2lvbihzdGF0ZW1lbnQuZXhwcmVzc2lvbi5leHByZXNzaW9uKSB8fFxuICAgICAgIXRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKHN0YXRlbWVudC5leHByZXNzaW9uLmV4cHJlc3Npb24uZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gc3RhdGVtZW50LmV4cHJlc3Npb24uZXhwcmVzc2lvbiBhcyB0cy5DYWxsRXhwcmVzc2lvbiAmIHtleHByZXNzaW9uOiB0cy5GdW5jdGlvbkV4cHJlc3Npb259O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRzT2ZVbWRNb2R1bGUodW1kTW9kdWxlOiBVbWRNb2R1bGUpOlxuICAgIHtwYXJhbWV0ZXI6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uLCBwYXRoOiBzdHJpbmd9W10ge1xuICBjb25zdCBpbXBvcnRzOiB7cGFyYW1ldGVyOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbiwgcGF0aDogc3RyaW5nfVtdID0gW107XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgdW1kTW9kdWxlLmZhY3RvcnlGbi5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgaW1wb3J0cy5wdXNoKHtcbiAgICAgIHBhcmFtZXRlcjogdW1kTW9kdWxlLmZhY3RvcnlGbi5wYXJhbWV0ZXJzW2ldLFxuICAgICAgcGF0aDogZ2V0UmVxdWlyZWRNb2R1bGVQYXRoKHVtZE1vZHVsZS53cmFwcGVyRm4sIGkpXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGltcG9ydHM7XG59XG5cbmludGVyZmFjZSBVbWRNb2R1bGUge1xuICB3cmFwcGVyRm46IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbjtcbiAgZmFjdG9yeUZuOiB0cy5GdW5jdGlvbkV4cHJlc3Npb247XG59XG5cbnR5cGUgVW1kRXhwb3J0U3RhdGVtZW50ID0gdHMuRXhwcmVzc2lvblN0YXRlbWVudCAmIHtcbiAgZXhwcmVzc2lvbjpcbiAgICAgIHRzLkJpbmFyeUV4cHJlc3Npb24gJiB7bGVmdDogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uICYge2V4cHJlc3Npb246IHRzLklkZW50aWZpZXJ9fVxufTtcblxuZnVuY3Rpb24gaXNVbWRFeHBvcnRTdGF0ZW1lbnQoczogdHMuU3RhdGVtZW50KTogcyBpcyBVbWRFeHBvcnRTdGF0ZW1lbnQge1xuICByZXR1cm4gdHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KHMpICYmIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihzLmV4cHJlc3Npb24pICYmXG4gICAgICB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihzLmV4cHJlc3Npb24ubGVmdCkgJiZcbiAgICAgIHRzLmlzSWRlbnRpZmllcihzLmV4cHJlc3Npb24ubGVmdC5leHByZXNzaW9uKSAmJlxuICAgICAgcy5leHByZXNzaW9uLmxlZnQuZXhwcmVzc2lvbi50ZXh0ID09PSAnZXhwb3J0cyc7XG59XG5cbmludGVyZmFjZSBVbWRFeHBvcnREZWNsYXJhdGlvbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVjbGFyYXRpb246IERlY2xhcmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRSZXF1aXJlZE1vZHVsZVBhdGgod3JhcHBlckZuOiB0cy5GdW5jdGlvbkV4cHJlc3Npb24sIHBhcmFtSW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IHN0YXRlbWVudCA9IHdyYXBwZXJGbi5ib2R5LnN0YXRlbWVudHNbMF07XG4gIGlmICghdHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KHN0YXRlbWVudCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdVTUQgd3JhcHBlciBib2R5IGlzIG5vdCBhbiBleHByZXNzaW9uIHN0YXRlbWVudDpcXG4nICsgd3JhcHBlckZuLmJvZHkuZ2V0VGV4dCgpKTtcbiAgfVxuICBjb25zdCBtb2R1bGVQYXRoczogc3RyaW5nW10gPSBbXTtcbiAgZmluZE1vZHVsZVBhdGhzKHN0YXRlbWVudC5leHByZXNzaW9uKTtcblxuICAvLyBTaW5jZSB3ZSB3ZXJlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgYHJlcXVpcmUoKWAgY2FsbHMsIHdlIG1pc3MgdGhlIGBleHBvcnRzYCBhcmd1bWVudCwgc28gd2VcbiAgLy8gbmVlZCB0byBzdWJ0cmFjdCAxLlxuICAvLyBFLmcuIGBmdW5jdGlvbihleHBvcnRzLCBkZXAxLCBkZXAyKWAgbWFwcyB0byBgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSgncGF0aC90by9kZXAxJyksXG4gIC8vIHJlcXVpcmUoJ3BhdGgvdG8vZGVwMicpKWBcbiAgcmV0dXJuIG1vZHVsZVBhdGhzW3BhcmFtSW5kZXggLSAxXTtcblxuICAvLyBTZWFyY2ggdGhlIHN0YXRlbWVudCBmb3IgY2FsbHMgdG8gYHJlcXVpcmUoJy4uLicpYCBhbmQgZXh0cmFjdCB0aGUgc3RyaW5nIHZhbHVlIG9mIHRoZSBmaXJzdFxuICAvLyBhcmd1bWVudFxuICBmdW5jdGlvbiBmaW5kTW9kdWxlUGF0aHMobm9kZTogdHMuTm9kZSkge1xuICAgIGlmIChpc1JlcXVpcmVDYWxsKG5vZGUpKSB7XG4gICAgICBjb25zdCBhcmd1bWVudCA9IG5vZGUuYXJndW1lbnRzWzBdO1xuICAgICAgaWYgKHRzLmlzU3RyaW5nTGl0ZXJhbChhcmd1bWVudCkpIHtcbiAgICAgICAgbW9kdWxlUGF0aHMucHVzaChhcmd1bWVudC50ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5mb3JFYWNoQ2hpbGQoZmluZE1vZHVsZVBhdGhzKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNSZXF1aXJlQ2FsbChub2RlOiB0cy5Ob2RlKTogbm9kZSBpcyB0cy5DYWxsRXhwcmVzc2lvbiB7XG4gIHJldHVybiB0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzSWRlbnRpZmllcihub2RlLmV4cHJlc3Npb24pICYmXG4gICAgICBub2RlLmV4cHJlc3Npb24udGV4dCA9PT0gJ3JlcXVpcmUnICYmIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA9PT0gMTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgaWRlbnRpZmllciBgaWRgIGlzIHRoZSBSSFMgb2YgYSBwcm9wZXJ0eSBhY2Nlc3Mgb2YgdGhlIGZvcm0gYG5hbWVzcGFjZS5pZGBcbiAqIGFuZCBgbmFtZXNwYWNlYCBpcyBhbiBpZGVudGlmZXIgdGhlbiByZXR1cm4gYG5hbWVzcGFjZWAsIG90aGVyd2lzZSBgbnVsbGAuXG4gKiBAcGFyYW0gaWQgVGhlIGlkZW50aWZpZXIgd2hvc2UgbmFtZXNwYWNlIHdlIHdhbnQgdG8gZmluZC5cbiAqL1xuZnVuY3Rpb24gZmluZE5hbWVzcGFjZU9mSWRlbnRpZmllcihpZDogdHMuSWRlbnRpZmllcik6IHRzLklkZW50aWZpZXJ8bnVsbCB7XG4gIHJldHVybiBpZC5wYXJlbnQgJiYgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24oaWQucGFyZW50KSAmJlxuICAgICAgICAgIHRzLmlzSWRlbnRpZmllcihpZC5wYXJlbnQuZXhwcmVzc2lvbikgP1xuICAgICAgaWQucGFyZW50LmV4cHJlc3Npb24gOlxuICAgICAgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwUGFyZW50aGVzZXMobm9kZTogdHMuTm9kZSk6IHRzLk5vZGUge1xuICByZXR1cm4gdHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKSA/IG5vZGUuZXhwcmVzc2lvbiA6IG5vZGU7XG59Il19
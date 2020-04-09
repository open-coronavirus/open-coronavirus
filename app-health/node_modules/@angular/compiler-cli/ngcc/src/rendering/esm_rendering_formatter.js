(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/esm_rendering_formatter", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/ngcc/src/host/ngcc_host", "@angular/compiler-cli/ngcc/src/rendering/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var ngcc_host_1 = require("@angular/compiler-cli/ngcc/src/host/ngcc_host");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/rendering/utils");
    /**
     * A RenderingFormatter that works with ECMAScript Module import and export statements.
     */
    var EsmRenderingFormatter = /** @class */ (function () {
        function EsmRenderingFormatter(host, isCore) {
            this.host = host;
            this.isCore = isCore;
        }
        /**
         *  Add the imports at the top of the file, after any imports that are already there.
         */
        EsmRenderingFormatter.prototype.addImports = function (output, imports, sf) {
            var insertionPoint = this.findEndOfImports(sf);
            var renderedImports = imports.map(function (i) { return "import * as " + i.qualifier + " from '" + i.specifier + "';\n"; }).join('');
            output.appendLeft(insertionPoint, renderedImports);
        };
        /**
         * Add the exports to the end of the file.
         */
        EsmRenderingFormatter.prototype.addExports = function (output, entryPointBasePath, exports, importManager, file) {
            exports.forEach(function (e) {
                var exportFrom = '';
                var isDtsFile = typescript_1.isDtsPath(entryPointBasePath);
                var from = isDtsFile ? e.dtsFrom : e.from;
                if (from) {
                    var basePath = utils_1.stripExtension(from);
                    var relativePath = './' + file_system_1.relative(file_system_1.dirname(entryPointBasePath), basePath);
                    exportFrom = entryPointBasePath !== basePath ? " from '" + relativePath + "'" : '';
                }
                // aliases should only be added in dts files as these are lost when rolling up dts file.
                var exportStatement = e.alias && isDtsFile ? e.alias + " as " + e.identifier : e.identifier;
                var exportStr = "\nexport {" + exportStatement + "}" + exportFrom + ";";
                output.append(exportStr);
            });
        };
        /**
         * Add the constants directly after the imports.
         */
        EsmRenderingFormatter.prototype.addConstants = function (output, constants, file) {
            if (constants === '') {
                return;
            }
            var insertionPoint = this.findEndOfImports(file);
            // Append the constants to the right of the insertion point, to ensure they get ordered after
            // added imports (those are appended left to the insertion point).
            output.appendRight(insertionPoint, '\n' + constants + '\n');
        };
        /**
         * Add the definitions directly after their decorated class.
         */
        EsmRenderingFormatter.prototype.addDefinitions = function (output, compiledClass, definitions) {
            var classSymbol = this.host.getClassSymbol(compiledClass.declaration);
            if (!classSymbol) {
                throw new Error("Compiled class does not have a valid symbol: " + compiledClass.name);
            }
            var insertionPoint = classSymbol.valueDeclaration.getEnd();
            output.appendLeft(insertionPoint, '\n' + definitions);
        };
        /**
         * Remove static decorator properties from classes.
         */
        EsmRenderingFormatter.prototype.removeDecorators = function (output, decoratorsToRemove) {
            decoratorsToRemove.forEach(function (nodesToRemove, containerNode) {
                if (ts.isArrayLiteralExpression(containerNode)) {
                    var items = containerNode.elements;
                    if (items.length === nodesToRemove.length) {
                        // Remove the entire statement
                        var statement = findStatement(containerNode);
                        if (statement) {
                            output.remove(statement.getFullStart(), statement.getEnd());
                        }
                    }
                    else {
                        nodesToRemove.forEach(function (node) {
                            // remove any trailing comma
                            var end = (output.slice(node.getEnd(), node.getEnd() + 1) === ',') ?
                                node.getEnd() + 1 :
                                node.getEnd();
                            output.remove(node.getFullStart(), end);
                        });
                    }
                }
            });
        };
        /**
         * Rewrite the the IVY switch markers to indicate we are in IVY mode.
         */
        EsmRenderingFormatter.prototype.rewriteSwitchableDeclarations = function (outputText, sourceFile, declarations) {
            declarations.forEach(function (declaration) {
                var start = declaration.initializer.getStart();
                var end = declaration.initializer.getEnd();
                var replacement = declaration.initializer.text.replace(ngcc_host_1.PRE_R3_MARKER, ngcc_host_1.POST_R3_MARKER);
                outputText.overwrite(start, end, replacement);
            });
        };
        /**
         * Add the type parameters to the appropriate functions that return `ModuleWithProviders`
         * structures.
         *
         * This function will only get called on typings files.
         */
        EsmRenderingFormatter.prototype.addModuleWithProvidersParams = function (outputText, moduleWithProviders, importManager) {
            var _this = this;
            moduleWithProviders.forEach(function (info) {
                var ngModuleName = info.ngModule.node.name.text;
                var declarationFile = file_system_1.absoluteFromSourceFile(info.declaration.getSourceFile());
                var ngModuleFile = file_system_1.absoluteFromSourceFile(info.ngModule.node.getSourceFile());
                var importPath = info.ngModule.viaModule ||
                    (declarationFile !== ngModuleFile ?
                        utils_1.stripExtension("./" + file_system_1.relative(file_system_1.dirname(declarationFile), ngModuleFile)) :
                        null);
                var ngModule = generateImportString(importManager, importPath, ngModuleName);
                if (info.declaration.type) {
                    var typeName = info.declaration.type && ts.isTypeReferenceNode(info.declaration.type) ?
                        info.declaration.type.typeName :
                        null;
                    if (_this.isCoreModuleWithProvidersType(typeName)) {
                        // The declaration already returns `ModuleWithProvider` but it needs the `NgModule` type
                        // parameter adding.
                        outputText.overwrite(info.declaration.type.getStart(), info.declaration.type.getEnd(), "ModuleWithProviders<" + ngModule + ">");
                    }
                    else {
                        // The declaration returns an unknown type so we need to convert it to a union that
                        // includes the ngModule property.
                        var originalTypeString = info.declaration.type.getText();
                        outputText.overwrite(info.declaration.type.getStart(), info.declaration.type.getEnd(), "(" + originalTypeString + ")&{ngModule:" + ngModule + "}");
                    }
                }
                else {
                    // The declaration has no return type so provide one.
                    var lastToken = info.declaration.getLastToken();
                    var insertPoint = lastToken && lastToken.kind === ts.SyntaxKind.SemicolonToken ?
                        lastToken.getStart() :
                        info.declaration.getEnd();
                    outputText.appendLeft(insertPoint, ": " + generateImportString(importManager, '@angular/core', 'ModuleWithProviders') + "<" + ngModule + ">");
                }
            });
        };
        EsmRenderingFormatter.prototype.findEndOfImports = function (sf) {
            var e_1, _a;
            try {
                for (var _b = tslib_1.__values(sf.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var stmt = _c.value;
                    if (!ts.isImportDeclaration(stmt) && !ts.isImportEqualsDeclaration(stmt) &&
                        !ts.isNamespaceImport(stmt)) {
                        return stmt.getStart();
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
            return 0;
        };
        /**
         * Check whether the given type is the core Angular `ModuleWithProviders` interface.
         * @param typeName The type to check.
         * @returns true if the type is the core Angular `ModuleWithProviders` interface.
         */
        EsmRenderingFormatter.prototype.isCoreModuleWithProvidersType = function (typeName) {
            var id = typeName && ts.isIdentifier(typeName) ? this.host.getImportOfIdentifier(typeName) : null;
            return (id && id.name === 'ModuleWithProviders' && (this.isCore || id.from === '@angular/core'));
        };
        return EsmRenderingFormatter;
    }());
    exports.EsmRenderingFormatter = EsmRenderingFormatter;
    function findStatement(node) {
        while (node) {
            if (ts.isExpressionStatement(node)) {
                return node;
            }
            node = node.parent;
        }
        return undefined;
    }
    function generateImportString(importManager, importPath, importName) {
        var importAs = importPath ? importManager.generateNamedImport(importPath, importName) : null;
        return importAs ? importAs.moduleImport + "." + importAs.symbol : "" + importName;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtX3JlbmRlcmluZ19mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcmVuZGVyaW5nL2VzbV9yZW5kZXJpbmdfZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLCtCQUFpQztJQUNqQywyRUFBeUc7SUFFekcsa0ZBQWlFO0lBRWpFLDJFQUFtSDtJQUluSCx3RUFBdUM7SUFFdkM7O09BRUc7SUFDSDtRQUNFLCtCQUFzQixJQUF3QixFQUFZLE1BQWU7WUFBbkQsU0FBSSxHQUFKLElBQUksQ0FBb0I7WUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQUcsQ0FBQztRQUU3RTs7V0FFRztRQUNILDBDQUFVLEdBQVYsVUFBVyxNQUFtQixFQUFFLE9BQWlCLEVBQUUsRUFBaUI7WUFDbEUsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELElBQU0sZUFBZSxHQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsaUJBQWUsQ0FBQyxDQUFDLFNBQVMsZUFBVSxDQUFDLENBQUMsU0FBUyxTQUFNLEVBQXJELENBQXFELENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVEOztXQUVHO1FBQ0gsMENBQVUsR0FBVixVQUNJLE1BQW1CLEVBQUUsa0JBQWtDLEVBQUUsT0FBcUIsRUFDOUUsYUFBNEIsRUFBRSxJQUFtQjtZQUNuRCxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztnQkFDZixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLElBQU0sU0FBUyxHQUFHLHNCQUFTLENBQUMsa0JB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ICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7cmVsYXRpdmUsIGRpcm5hbWUsIEFic29sdXRlRnNQYXRoLCBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtJbXBvcnQsIEltcG9ydE1hbmFnZXJ9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy90cmFuc2xhdG9yJztcbmltcG9ydCB7aXNEdHNQYXRofSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5pbXBvcnQge0NvbXBpbGVkQ2xhc3N9IGZyb20gJy4uL2FuYWx5c2lzL3R5cGVzJztcbmltcG9ydCB7TmdjY1JlZmxlY3Rpb25Ib3N0LCBQT1NUX1IzX01BUktFUiwgUFJFX1IzX01BUktFUiwgU3dpdGNoYWJsZVZhcmlhYmxlRGVjbGFyYXRpb259IGZyb20gJy4uL2hvc3QvbmdjY19ob3N0JztcbmltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVyc0luZm99IGZyb20gJy4uL2FuYWx5c2lzL21vZHVsZV93aXRoX3Byb3ZpZGVyc19hbmFseXplcic7XG5pbXBvcnQge0V4cG9ydEluZm99IGZyb20gJy4uL2FuYWx5c2lzL3ByaXZhdGVfZGVjbGFyYXRpb25zX2FuYWx5emVyJztcbmltcG9ydCB7UmVuZGVyaW5nRm9ybWF0dGVyLCBSZWR1bmRhbnREZWNvcmF0b3JNYXB9IGZyb20gJy4vcmVuZGVyaW5nX2Zvcm1hdHRlcic7XG5pbXBvcnQge3N0cmlwRXh0ZW5zaW9ufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBBIFJlbmRlcmluZ0Zvcm1hdHRlciB0aGF0IHdvcmtzIHdpdGggRUNNQVNjcmlwdCBNb2R1bGUgaW1wb3J0IGFuZCBleHBvcnQgc3RhdGVtZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVzbVJlbmRlcmluZ0Zvcm1hdHRlciBpbXBsZW1lbnRzIFJlbmRlcmluZ0Zvcm1hdHRlciB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBob3N0OiBOZ2NjUmVmbGVjdGlvbkhvc3QsIHByb3RlY3RlZCBpc0NvcmU6IGJvb2xlYW4pIHt9XG5cbiAgLyoqXG4gICAqICBBZGQgdGhlIGltcG9ydHMgYXQgdGhlIHRvcCBvZiB0aGUgZmlsZSwgYWZ0ZXIgYW55IGltcG9ydHMgdGhhdCBhcmUgYWxyZWFkeSB0aGVyZS5cbiAgICovXG4gIGFkZEltcG9ydHMob3V0cHV0OiBNYWdpY1N0cmluZywgaW1wb3J0czogSW1wb3J0W10sIHNmOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7XG4gICAgY29uc3QgaW5zZXJ0aW9uUG9pbnQgPSB0aGlzLmZpbmRFbmRPZkltcG9ydHMoc2YpO1xuICAgIGNvbnN0IHJlbmRlcmVkSW1wb3J0cyA9XG4gICAgICAgIGltcG9ydHMubWFwKGkgPT4gYGltcG9ydCAqIGFzICR7aS5xdWFsaWZpZXJ9IGZyb20gJyR7aS5zcGVjaWZpZXJ9JztcXG5gKS5qb2luKCcnKTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbnNlcnRpb25Qb2ludCwgcmVuZGVyZWRJbXBvcnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGV4cG9ydHMgdG8gdGhlIGVuZCBvZiB0aGUgZmlsZS5cbiAgICovXG4gIGFkZEV4cG9ydHMoXG4gICAgICBvdXRwdXQ6IE1hZ2ljU3RyaW5nLCBlbnRyeVBvaW50QmFzZVBhdGg6IEFic29sdXRlRnNQYXRoLCBleHBvcnRzOiBFeHBvcnRJbmZvW10sXG4gICAgICBpbXBvcnRNYW5hZ2VyOiBJbXBvcnRNYW5hZ2VyLCBmaWxlOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7XG4gICAgZXhwb3J0cy5mb3JFYWNoKGUgPT4ge1xuICAgICAgbGV0IGV4cG9ydEZyb20gPSAnJztcbiAgICAgIGNvbnN0IGlzRHRzRmlsZSA9IGlzRHRzUGF0aChlbnRyeVBvaW50QmFzZVBhdGgpO1xuICAgICAgY29uc3QgZnJvbSA9IGlzRHRzRmlsZSA/IGUuZHRzRnJvbSA6IGUuZnJvbTtcblxuICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgY29uc3QgYmFzZVBhdGggPSBzdHJpcEV4dGVuc2lvbihmcm9tKTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gJy4vJyArIHJlbGF0aXZlKGRpcm5hbWUoZW50cnlQb2ludEJhc2VQYXRoKSwgYmFzZVBhdGgpO1xuICAgICAgICBleHBvcnRGcm9tID0gZW50cnlQb2ludEJhc2VQYXRoICE9PSBiYXNlUGF0aCA/IGAgZnJvbSAnJHtyZWxhdGl2ZVBhdGh9J2AgOiAnJztcbiAgICAgIH1cblxuICAgICAgLy8gYWxpYXNlcyBzaG91bGQgb25seSBiZSBhZGRlZCBpbiBkdHMgZmlsZXMgYXMgdGhlc2UgYXJlIGxvc3Qgd2hlbiByb2xsaW5nIHVwIGR0cyBmaWxlLlxuICAgICAgY29uc3QgZXhwb3J0U3RhdGVtZW50ID0gZS5hbGlhcyAmJiBpc0R0c0ZpbGUgPyBgJHtlLmFsaWFzfSBhcyAke2UuaWRlbnRpZmllcn1gIDogZS5pZGVudGlmaWVyO1xuICAgICAgY29uc3QgZXhwb3J0U3RyID0gYFxcbmV4cG9ydCB7JHtleHBvcnRTdGF0ZW1lbnR9fSR7ZXhwb3J0RnJvbX07YDtcbiAgICAgIG91dHB1dC5hcHBlbmQoZXhwb3J0U3RyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGNvbnN0YW50cyBkaXJlY3RseSBhZnRlciB0aGUgaW1wb3J0cy5cbiAgICovXG4gIGFkZENvbnN0YW50cyhvdXRwdXQ6IE1hZ2ljU3RyaW5nLCBjb25zdGFudHM6IHN0cmluZywgZmlsZTogdHMuU291cmNlRmlsZSk6IHZvaWQge1xuICAgIGlmIChjb25zdGFudHMgPT09ICcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluc2VydGlvblBvaW50ID0gdGhpcy5maW5kRW5kT2ZJbXBvcnRzKGZpbGUpO1xuXG4gICAgLy8gQXBwZW5kIHRoZSBjb25zdGFudHMgdG8gdGhlIHJpZ2h0IG9mIHRoZSBpbnNlcnRpb24gcG9pbnQsIHRvIGVuc3VyZSB0aGV5IGdldCBvcmRlcmVkIGFmdGVyXG4gICAgLy8gYWRkZWQgaW1wb3J0cyAodGhvc2UgYXJlIGFwcGVuZGVkIGxlZnQgdG8gdGhlIGluc2VydGlvbiBwb2ludCkuXG4gICAgb3V0cHV0LmFwcGVuZFJpZ2h0KGluc2VydGlvblBvaW50LCAnXFxuJyArIGNvbnN0YW50cyArICdcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGRlZmluaXRpb25zIGRpcmVjdGx5IGFmdGVyIHRoZWlyIGRlY29yYXRlZCBjbGFzcy5cbiAgICovXG4gIGFkZERlZmluaXRpb25zKG91dHB1dDogTWFnaWNTdHJpbmcsIGNvbXBpbGVkQ2xhc3M6IENvbXBpbGVkQ2xhc3MsIGRlZmluaXRpb25zOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc1N5bWJvbCA9IHRoaXMuaG9zdC5nZXRDbGFzc1N5bWJvbChjb21waWxlZENsYXNzLmRlY2xhcmF0aW9uKTtcbiAgICBpZiAoIWNsYXNzU3ltYm9sKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBpbGVkIGNsYXNzIGRvZXMgbm90IGhhdmUgYSB2YWxpZCBzeW1ib2w6ICR7Y29tcGlsZWRDbGFzcy5uYW1lfWApO1xuICAgIH1cbiAgICBjb25zdCBpbnNlcnRpb25Qb2ludCA9IGNsYXNzU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gIS5nZXRFbmQoKTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbnNlcnRpb25Qb2ludCwgJ1xcbicgKyBkZWZpbml0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHN0YXRpYyBkZWNvcmF0b3IgcHJvcGVydGllcyBmcm9tIGNsYXNzZXMuXG4gICAqL1xuICByZW1vdmVEZWNvcmF0b3JzKG91dHB1dDogTWFnaWNTdHJpbmcsIGRlY29yYXRvcnNUb1JlbW92ZTogUmVkdW5kYW50RGVjb3JhdG9yTWFwKTogdm9pZCB7XG4gICAgZGVjb3JhdG9yc1RvUmVtb3ZlLmZvckVhY2goKG5vZGVzVG9SZW1vdmUsIGNvbnRhaW5lck5vZGUpID0+IHtcbiAgICAgIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24oY29udGFpbmVyTm9kZSkpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBjb250YWluZXJOb2RlLmVsZW1lbnRzO1xuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSBub2Rlc1RvUmVtb3ZlLmxlbmd0aCkge1xuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZW50aXJlIHN0YXRlbWVudFxuICAgICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IGZpbmRTdGF0ZW1lbnQoY29udGFpbmVyTm9kZSk7XG4gICAgICAgICAgaWYgKHN0YXRlbWVudCkge1xuICAgICAgICAgICAgb3V0cHV0LnJlbW92ZShzdGF0ZW1lbnQuZ2V0RnVsbFN0YXJ0KCksIHN0YXRlbWVudC5nZXRFbmQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVzVG9SZW1vdmUuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBhbnkgdHJhaWxpbmcgY29tbWFcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IChvdXRwdXQuc2xpY2Uobm9kZS5nZXRFbmQoKSwgbm9kZS5nZXRFbmQoKSArIDEpID09PSAnLCcpID9cbiAgICAgICAgICAgICAgICBub2RlLmdldEVuZCgpICsgMSA6XG4gICAgICAgICAgICAgICAgbm9kZS5nZXRFbmQoKTtcbiAgICAgICAgICAgIG91dHB1dC5yZW1vdmUobm9kZS5nZXRGdWxsU3RhcnQoKSwgZW5kKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJld3JpdGUgdGhlIHRoZSBJVlkgc3dpdGNoIG1hcmtlcnMgdG8gaW5kaWNhdGUgd2UgYXJlIGluIElWWSBtb2RlLlxuICAgKi9cbiAgcmV3cml0ZVN3aXRjaGFibGVEZWNsYXJhdGlvbnMoXG4gICAgICBvdXRwdXRUZXh0OiBNYWdpY1N0cmluZywgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICAgIGRlY2xhcmF0aW9uczogU3dpdGNoYWJsZVZhcmlhYmxlRGVjbGFyYXRpb25bXSk6IHZvaWQge1xuICAgIGRlY2xhcmF0aW9ucy5mb3JFYWNoKGRlY2xhcmF0aW9uID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gZGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IGVuZCA9IGRlY2xhcmF0aW9uLmluaXRpYWxpemVyLmdldEVuZCgpO1xuICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBkZWNsYXJhdGlvbi5pbml0aWFsaXplci50ZXh0LnJlcGxhY2UoUFJFX1IzX01BUktFUiwgUE9TVF9SM19NQVJLRVIpO1xuICAgICAgb3V0cHV0VGV4dC5vdmVyd3JpdGUoc3RhcnQsIGVuZCwgcmVwbGFjZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogQWRkIHRoZSB0eXBlIHBhcmFtZXRlcnMgdG8gdGhlIGFwcHJvcHJpYXRlIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBgTW9kdWxlV2l0aFByb3ZpZGVyc2BcbiAgICogc3RydWN0dXJlcy5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIG9ubHkgZ2V0IGNhbGxlZCBvbiB0eXBpbmdzIGZpbGVzLlxuICAgKi9cbiAgYWRkTW9kdWxlV2l0aFByb3ZpZGVyc1BhcmFtcyhcbiAgICAgIG91dHB1dFRleHQ6IE1hZ2ljU3RyaW5nLCBtb2R1bGVXaXRoUHJvdmlkZXJzOiBNb2R1bGVXaXRoUHJvdmlkZXJzSW5mb1tdLFxuICAgICAgaW1wb3J0TWFuYWdlcjogSW1wb3J0TWFuYWdlcik6IHZvaWQge1xuICAgIG1vZHVsZVdpdGhQcm92aWRlcnMuZm9yRWFjaChpbmZvID0+IHtcbiAgICAgIGNvbnN0IG5nTW9kdWxlTmFtZSA9IGluZm8ubmdNb2R1bGUubm9kZS5uYW1lLnRleHQ7XG4gICAgICBjb25zdCBkZWNsYXJhdGlvbkZpbGUgPSBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKGluZm8uZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpKTtcbiAgICAgIGNvbnN0IG5nTW9kdWxlRmlsZSA9IGFic29sdXRlRnJvbVNvdXJjZUZpbGUoaW5mby5uZ01vZHVsZS5ub2RlLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgICBjb25zdCBpbXBvcnRQYXRoID0gaW5mby5uZ01vZHVsZS52aWFNb2R1bGUgfHxcbiAgICAgICAgICAoZGVjbGFyYXRpb25GaWxlICE9PSBuZ01vZHVsZUZpbGUgP1xuICAgICAgICAgICAgICAgc3RyaXBFeHRlbnNpb24oYC4vJHtyZWxhdGl2ZShkaXJuYW1lKGRlY2xhcmF0aW9uRmlsZSksIG5nTW9kdWxlRmlsZSl9YCkgOlxuICAgICAgICAgICAgICAgbnVsbCk7XG4gICAgICBjb25zdCBuZ01vZHVsZSA9IGdlbmVyYXRlSW1wb3J0U3RyaW5nKGltcG9ydE1hbmFnZXIsIGltcG9ydFBhdGgsIG5nTW9kdWxlTmFtZSk7XG5cbiAgICAgIGlmIChpbmZvLmRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBpbmZvLmRlY2xhcmF0aW9uLnR5cGUgJiYgdHMuaXNUeXBlUmVmZXJlbmNlTm9kZShpbmZvLmRlY2xhcmF0aW9uLnR5cGUpID9cbiAgICAgICAgICAgIGluZm8uZGVjbGFyYXRpb24udHlwZS50eXBlTmFtZSA6XG4gICAgICAgICAgICBudWxsO1xuICAgICAgICBpZiAodGhpcy5pc0NvcmVNb2R1bGVXaXRoUHJvdmlkZXJzVHlwZSh0eXBlTmFtZSkpIHtcbiAgICAgICAgICAvLyBUaGUgZGVjbGFyYXRpb24gYWxyZWFkeSByZXR1cm5zIGBNb2R1bGVXaXRoUHJvdmlkZXJgIGJ1dCBpdCBuZWVkcyB0aGUgYE5nTW9kdWxlYCB0eXBlXG4gICAgICAgICAgLy8gcGFyYW1ldGVyIGFkZGluZy5cbiAgICAgICAgICBvdXRwdXRUZXh0Lm92ZXJ3cml0ZShcbiAgICAgICAgICAgICAgaW5mby5kZWNsYXJhdGlvbi50eXBlLmdldFN0YXJ0KCksIGluZm8uZGVjbGFyYXRpb24udHlwZS5nZXRFbmQoKSxcbiAgICAgICAgICAgICAgYE1vZHVsZVdpdGhQcm92aWRlcnM8JHtuZ01vZHVsZX0+YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGRlY2xhcmF0aW9uIHJldHVybnMgYW4gdW5rbm93biB0eXBlIHNvIHdlIG5lZWQgdG8gY29udmVydCBpdCB0byBhIHVuaW9uIHRoYXRcbiAgICAgICAgICAvLyBpbmNsdWRlcyB0aGUgbmdNb2R1bGUgcHJvcGVydHkuXG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxUeXBlU3RyaW5nID0gaW5mby5kZWNsYXJhdGlvbi50eXBlLmdldFRleHQoKTtcbiAgICAgICAgICBvdXRwdXRUZXh0Lm92ZXJ3cml0ZShcbiAgICAgICAgICAgICAgaW5mby5kZWNsYXJhdGlvbi50eXBlLmdldFN0YXJ0KCksIGluZm8uZGVjbGFyYXRpb24udHlwZS5nZXRFbmQoKSxcbiAgICAgICAgICAgICAgYCgke29yaWdpbmFsVHlwZVN0cmluZ30pJntuZ01vZHVsZToke25nTW9kdWxlfX1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGRlY2xhcmF0aW9uIGhhcyBubyByZXR1cm4gdHlwZSBzbyBwcm92aWRlIG9uZS5cbiAgICAgICAgY29uc3QgbGFzdFRva2VuID0gaW5mby5kZWNsYXJhdGlvbi5nZXRMYXN0VG9rZW4oKTtcbiAgICAgICAgY29uc3QgaW5zZXJ0UG9pbnQgPSBsYXN0VG9rZW4gJiYgbGFzdFRva2VuLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU2VtaWNvbG9uVG9rZW4gP1xuICAgICAgICAgICAgbGFzdFRva2VuLmdldFN0YXJ0KCkgOlxuICAgICAgICAgICAgaW5mby5kZWNsYXJhdGlvbi5nZXRFbmQoKTtcbiAgICAgICAgb3V0cHV0VGV4dC5hcHBlbmRMZWZ0KFxuICAgICAgICAgICAgaW5zZXJ0UG9pbnQsXG4gICAgICAgICAgICBgOiAke2dlbmVyYXRlSW1wb3J0U3RyaW5nKGltcG9ydE1hbmFnZXIsICdAYW5ndWxhci9jb3JlJywgJ01vZHVsZVdpdGhQcm92aWRlcnMnKX08JHtuZ01vZHVsZX0+YCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZmluZEVuZE9mSW1wb3J0cyhzZjogdHMuU291cmNlRmlsZSk6IG51bWJlciB7XG4gICAgZm9yIChjb25zdCBzdG10IG9mIHNmLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihzdG10KSAmJiAhdHMuaXNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbihzdG10KSAmJlxuICAgICAgICAgICF0cy5pc05hbWVzcGFjZUltcG9ydChzdG10KSkge1xuICAgICAgICByZXR1cm4gc3RtdC5nZXRTdGFydCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG5cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdHlwZSBpcyB0aGUgY29yZSBBbmd1bGFyIGBNb2R1bGVXaXRoUHJvdmlkZXJzYCBpbnRlcmZhY2UuXG4gICAqIEBwYXJhbSB0eXBlTmFtZSBUaGUgdHlwZSB0byBjaGVjay5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBpcyB0aGUgY29yZSBBbmd1bGFyIGBNb2R1bGVXaXRoUHJvdmlkZXJzYCBpbnRlcmZhY2UuXG4gICAqL1xuICBwcml2YXRlIGlzQ29yZU1vZHVsZVdpdGhQcm92aWRlcnNUeXBlKHR5cGVOYW1lOiB0cy5FbnRpdHlOYW1lfG51bGwpIHtcbiAgICBjb25zdCBpZCA9XG4gICAgICAgIHR5cGVOYW1lICYmIHRzLmlzSWRlbnRpZmllcih0eXBlTmFtZSkgPyB0aGlzLmhvc3QuZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKHR5cGVOYW1lKSA6IG51bGw7XG4gICAgcmV0dXJuIChcbiAgICAgICAgaWQgJiYgaWQubmFtZSA9PT0gJ01vZHVsZVdpdGhQcm92aWRlcnMnICYmICh0aGlzLmlzQ29yZSB8fCBpZC5mcm9tID09PSAnQGFuZ3VsYXIvY29yZScpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kU3RhdGVtZW50KG5vZGU6IHRzLk5vZGUpIHtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAodHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGUucGFyZW50O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSW1wb3J0U3RyaW5nKFxuICAgIGltcG9ydE1hbmFnZXI6IEltcG9ydE1hbmFnZXIsIGltcG9ydFBhdGg6IHN0cmluZyB8IG51bGwsIGltcG9ydE5hbWU6IHN0cmluZykge1xuICBjb25zdCBpbXBvcnRBcyA9IGltcG9ydFBhdGggPyBpbXBvcnRNYW5hZ2VyLmdlbmVyYXRlTmFtZWRJbXBvcnQoaW1wb3J0UGF0aCwgaW1wb3J0TmFtZSkgOiBudWxsO1xuICByZXR1cm4gaW1wb3J0QXMgPyBgJHtpbXBvcnRBcy5tb2R1bGVJbXBvcnR9LiR7aW1wb3J0QXMuc3ltYm9sfWAgOiBgJHtpbXBvcnROYW1lfWA7XG59XG4iXX0=
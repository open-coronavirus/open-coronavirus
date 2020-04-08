(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/shims/src/factory_generator", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/shims/src/util"], factory);
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
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/shims/src/util");
    var TS_DTS_SUFFIX = /(\.d)?\.ts$/;
    var STRIP_NG_FACTORY = /(.*)NgFactory$/;
    /**
     * Generates ts.SourceFiles which contain variable declarations for NgFactories for every exported
     * class of an input ts.SourceFile.
     */
    var FactoryGenerator = /** @class */ (function () {
        function FactoryGenerator(map) {
            this.map = map;
        }
        Object.defineProperty(FactoryGenerator.prototype, "factoryFileMap", {
            get: function () { return this.map; },
            enumerable: true,
            configurable: true
        });
        FactoryGenerator.prototype.recognize = function (fileName) { return this.map.has(fileName); };
        FactoryGenerator.prototype.generate = function (genFilePath, readFile) {
            var originalPath = this.map.get(genFilePath);
            var original = readFile(originalPath);
            if (original === null) {
                return null;
            }
            var relativePathToSource = './' + file_system_1.basename(original.fileName).replace(TS_DTS_SUFFIX, '');
            // Collect a list of classes that need to have factory types emitted for them. This list is
            // overly broad as at this point the ts.TypeChecker hasn't been created, and can't be used to
            // semantically understand which decorated types are actually decorated with Angular decorators.
            //
            // The exports generated here are pruned in the factory transform during emit.
            var symbolNames = original
                .statements
                // Pick out top level class declarations...
                .filter(ts.isClassDeclaration)
                // which are named, exported, and have decorators.
                .filter(function (decl) { return isExported(decl) && decl.decorators !== undefined &&
                decl.name !== undefined; })
                // Grab the symbol name.
                .map(function (decl) { return decl.name.text; });
            // If there is a top-level comment in the original file, copy it over at the top of the
            // generated factory file. This is important for preserving any load-bearing jsdoc comments.
            var comment = '';
            if (original.statements.length > 0) {
                var firstStatement = original.statements[0];
                if (firstStatement.getLeadingTriviaWidth() > 0) {
                    comment = firstStatement.getFullText().substr(0, firstStatement.getLeadingTriviaWidth());
                }
            }
            var sourceText = comment;
            if (symbolNames.length > 0) {
                // For each symbol name, generate a constant export of the corresponding NgFactory.
                // This will encompass a lot of symbols which don't need factories, but that's okay
                // because it won't miss any that do.
                var varLines = symbolNames.map(function (name) {
                    return "export const " + name + "NgFactory: i0.\u0275NgModuleFactory<any> = new i0.\u0275NgModuleFactory(" + name + ");";
                });
                sourceText += tslib_1.__spread([
                    // This might be incorrect if the current package being compiled is Angular core, but it's
                    // okay to leave in at type checking time. TypeScript can handle this reference via its path
                    // mapping, but downstream bundlers can't. If the current package is core itself, this will
                    // be replaced in the factory transformer before emit.
                    "import * as i0 from '@angular/core';",
                    "import {" + symbolNames.join(', ') + "} from '" + relativePathToSource + "';"
                ], varLines).join('\n');
            }
            // Add an extra export to ensure this module has at least one. It'll be removed later in the
            // factory transformer if it ends up not being needed.
            sourceText += '\nexport const ɵNonEmptyModule = true;';
            var genFile = ts.createSourceFile(genFilePath, sourceText, original.languageVersion, true, ts.ScriptKind.TS);
            if (original.moduleName !== undefined) {
                genFile.moduleName =
                    util_1.generatedModuleName(original.moduleName, original.fileName, '.ngfactory');
            }
            return genFile;
        };
        FactoryGenerator.forRootFiles = function (files) {
            var map = new Map();
            files.filter(function (sourceFile) { return typescript_1.isNonDeclarationTsPath(sourceFile); })
                .forEach(function (sourceFile) {
                return map.set(file_system_1.absoluteFrom(sourceFile.replace(/\.ts$/, '.ngfactory.ts')), sourceFile);
            });
            return new FactoryGenerator(map);
        };
        return FactoryGenerator;
    }());
    exports.FactoryGenerator = FactoryGenerator;
    function isExported(decl) {
        return decl.modifiers !== undefined &&
            decl.modifiers.some(function (mod) { return mod.kind == ts.SyntaxKind.ExportKeyword; });
    }
    function generatedFactoryTransform(factoryMap, importRewriter) {
        return function (context) {
            return function (file) {
                return transformFactorySourceFile(factoryMap, context, importRewriter, file);
            };
        };
    }
    exports.generatedFactoryTransform = generatedFactoryTransform;
    function transformFactorySourceFile(factoryMap, context, importRewriter, file) {
        var e_1, _a;
        // If this is not a generated file, it won't have factory info associated with it.
        if (!factoryMap.has(file.fileName)) {
            // Don't transform non-generated code.
            return file;
        }
        var _b = factoryMap.get(file.fileName), moduleSymbolNames = _b.moduleSymbolNames, sourceFilePath = _b.sourceFilePath;
        file = ts.getMutableClone(file);
        // Not every exported factory statement is valid. They were generated before the program was
        // analyzed, and before ngtsc knew which symbols were actually NgModules. factoryMap contains
        // that knowledge now, so this transform filters the statement list and removes exported factories
        // that aren't actually factories.
        //
        // This could leave the generated factory file empty. To prevent this (it causes issues with
        // closure compiler) a 'ɵNonEmptyModule' export was added when the factory shim was created.
        // Preserve that export if needed, and remove it otherwise.
        //
        // Additionally, an import to @angular/core is generated, but the current compilation unit could
        // actually be @angular/core, in which case such an import is invalid and should be replaced with
        // the proper path to access Ivy symbols in core.
        // The filtered set of statements.
        var transformedStatements = [];
        // The statement identified as the ɵNonEmptyModule export.
        var nonEmptyExport = null;
        // Extracted identifiers which refer to import statements from @angular/core.
        var coreImportIdentifiers = new Set();
        try {
            // Consider all the statements.
            for (var _c = tslib_1.__values(file.statements), _d = _c.next(); !_d.done; _d = _c.next()) {
                var stmt = _d.value;
                // Look for imports to @angular/core.
                if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier) &&
                    stmt.moduleSpecifier.text === '@angular/core') {
                    // Update the import path to point to the correct file using the ImportRewriter.
                    var rewrittenModuleSpecifier = importRewriter.rewriteSpecifier('@angular/core', sourceFilePath);
                    if (rewrittenModuleSpecifier !== stmt.moduleSpecifier.text) {
                        transformedStatements.push(ts.updateImportDeclaration(stmt, stmt.decorators, stmt.modifiers, stmt.importClause, ts.createStringLiteral(rewrittenModuleSpecifier)));
                        // Record the identifier by which this imported module goes, so references to its symbols
                        // can be discovered later.
                        if (stmt.importClause !== undefined && stmt.importClause.namedBindings !== undefined &&
                            ts.isNamespaceImport(stmt.importClause.namedBindings)) {
                            coreImportIdentifiers.add(stmt.importClause.namedBindings.name.text);
                        }
                    }
                    else {
                        transformedStatements.push(stmt);
                    }
                }
                else if (ts.isVariableStatement(stmt) && stmt.declarationList.declarations.length === 1) {
                    var decl = stmt.declarationList.declarations[0];
                    // If this is the ɵNonEmptyModule export, then save it for later.
                    if (ts.isIdentifier(decl.name)) {
                        if (decl.name.text === 'ɵNonEmptyModule') {
                            nonEmptyExport = stmt;
                            continue;
                        }
                        // Otherwise, check if this export is a factory for a known NgModule, and retain it if so.
                        var match = STRIP_NG_FACTORY.exec(decl.name.text);
                        if (match !== null && moduleSymbolNames.has(match[1])) {
                            transformedStatements.push(stmt);
                        }
                    }
                    else {
                        // Leave the statement alone, as it can't be understood.
                        transformedStatements.push(stmt);
                    }
                }
                else {
                    // Include non-variable statements (imports, etc).
                    transformedStatements.push(stmt);
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
        // Check whether the empty module export is still needed.
        if (!transformedStatements.some(ts.isVariableStatement) && nonEmptyExport !== null) {
            // If the resulting file has no factories, include an empty export to
            // satisfy closure compiler.
            transformedStatements.push(nonEmptyExport);
        }
        file.statements = ts.createNodeArray(transformedStatements);
        // If any imports to @angular/core were detected and rewritten (which happens when compiling
        // @angular/core), go through the SourceFile and rewrite references to symbols imported from core.
        if (coreImportIdentifiers.size > 0) {
            var visit_1 = function (node) {
                node = ts.visitEachChild(node, function (child) { return visit_1(child); }, context);
                // Look for expressions of the form "i.s" where 'i' is a detected name for an @angular/core
                // import that was changed above. Rewrite 's' using the ImportResolver.
                if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) &&
                    coreImportIdentifiers.has(node.expression.text)) {
                    // This is an import of a symbol from @angular/core. Transform it with the importRewriter.
                    var rewrittenSymbol = importRewriter.rewriteSymbol(node.name.text, '@angular/core');
                    if (rewrittenSymbol !== node.name.text) {
                        var updated = ts.updatePropertyAccess(node, node.expression, ts.createIdentifier(rewrittenSymbol));
                        node = updated;
                    }
                }
                return node;
            };
            file = visit_1(file);
        }
        return file;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeV9nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3NoaW1zL3NyYy9mYWN0b3J5X2dlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFFakMsMkVBQXlFO0lBRXpFLGtGQUFpRTtJQUdqRSx1RUFBMkM7SUFFM0MsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ3BDLElBQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7SUFFMUM7OztPQUdHO0lBQ0g7UUFDRSwwQkFBNEIsR0FBd0I7WUFBeEIsUUFBRyxHQUFILEdBQUcsQ0FBcUI7UUFBRyxDQUFDO1FBRXhELHNCQUFJLDRDQUFjO2lCQUFsQixjQUE0QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUU5RCxvQ0FBUyxHQUFULFVBQVUsUUFBd0IsSUFBYSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRSxtQ0FBUSxHQUFSLFVBQVMsV0FBMkIsRUFBRSxRQUFvRDtZQUV4RixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUcsQ0FBQztZQUNqRCxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEMsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO2dCQUNyQixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsc0JBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzRiwyRkFBMkY7WUFDM0Ys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QUFDO3FCQUNuRDtpQkFDRjtnQkFDRCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQztZQUVGLElBQUksR0FBRyxPQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgYWJzb2x1dGVGcm9tLCBiYXNlbmFtZX0gZnJvbSAnLi4vLi4vZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtJbXBvcnRSZXdyaXRlcn0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge2lzTm9uRGVjbGFyYXRpb25Uc1BhdGh9IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1NoaW1HZW5lcmF0b3J9IGZyb20gJy4vaG9zdCc7XG5pbXBvcnQge2dlbmVyYXRlZE1vZHVsZU5hbWV9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IFRTX0RUU19TVUZGSVggPSAvKFxcLmQpP1xcLnRzJC87XG5jb25zdCBTVFJJUF9OR19GQUNUT1JZID0gLyguKilOZ0ZhY3RvcnkkLztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgdHMuU291cmNlRmlsZXMgd2hpY2ggY29udGFpbiB2YXJpYWJsZSBkZWNsYXJhdGlvbnMgZm9yIE5nRmFjdG9yaWVzIGZvciBldmVyeSBleHBvcnRlZFxuICogY2xhc3Mgb2YgYW4gaW5wdXQgdHMuU291cmNlRmlsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZhY3RvcnlHZW5lcmF0b3IgaW1wbGVtZW50cyBTaGltR2VuZXJhdG9yIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcDogTWFwPHN0cmluZywgc3RyaW5nPikge31cblxuICBnZXQgZmFjdG9yeUZpbGVNYXAoKTogTWFwPHN0cmluZywgc3RyaW5nPiB7IHJldHVybiB0aGlzLm1hcDsgfVxuXG4gIHJlY29nbml6ZShmaWxlTmFtZTogQWJzb2x1dGVGc1BhdGgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubWFwLmhhcyhmaWxlTmFtZSk7IH1cblxuICBnZW5lcmF0ZShnZW5GaWxlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHJlYWRGaWxlOiAoZmlsZU5hbWU6IHN0cmluZykgPT4gdHMuU291cmNlRmlsZSB8IG51bGwpOlxuICAgICAgdHMuU291cmNlRmlsZXxudWxsIHtcbiAgICBjb25zdCBvcmlnaW5hbFBhdGggPSB0aGlzLm1hcC5nZXQoZ2VuRmlsZVBhdGgpICE7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSByZWFkRmlsZShvcmlnaW5hbFBhdGgpO1xuICAgIGlmIChvcmlnaW5hbCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmVsYXRpdmVQYXRoVG9Tb3VyY2UgPSAnLi8nICsgYmFzZW5hbWUob3JpZ2luYWwuZmlsZU5hbWUpLnJlcGxhY2UoVFNfRFRTX1NVRkZJWCwgJycpO1xuICAgIC8vIENvbGxlY3QgYSBsaXN0IG9mIGNsYXNzZXMgdGhhdCBuZWVkIHRvIGhhdmUgZmFjdG9yeSB0eXBlcyBlbWl0dGVkIGZvciB0aGVtLiBUaGlzIGxpc3QgaXNcbiAgICAvLyBvdmVybHkgYnJvYWQgYXMgYXQgdGhpcyBwb2ludCB0aGUgdHMuVHlwZUNoZWNrZXIgaGFzbid0IGJlZW4gY3JlYXRlZCwgYW5kIGNhbid0IGJlIHVzZWQgdG9cbiAgICAvLyBzZW1hbnRpY2FsbHkgdW5kZXJzdGFuZCB3aGljaCBkZWNvcmF0ZWQgdHlwZXMgYXJlIGFjdHVhbGx5IGRlY29yYXRlZCB3aXRoIEFuZ3VsYXIgZGVjb3JhdG9ycy5cbiAgICAvL1xuICAgIC8vIFRoZSBleHBvcnRzIGdlbmVyYXRlZCBoZXJlIGFyZSBwcnVuZWQgaW4gdGhlIGZhY3RvcnkgdHJhbnNmb3JtIGR1cmluZyBlbWl0LlxuICAgIGNvbnN0IHN5bWJvbE5hbWVzID0gb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3RhdGVtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBpY2sgb3V0IHRvcCBsZXZlbCBjbGFzcyBkZWNsYXJhdGlvbnMuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBhcmUgbmFtZWQsIGV4cG9ydGVkLCBhbmQgaGF2ZSBkZWNvcmF0b3JzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY2wgPT4gaXNFeHBvcnRlZChkZWNsKSAmJiBkZWNsLmRlY29yYXRvcnMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjbC5uYW1lICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiB0aGUgc3ltYm9sIG5hbWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNsID0+IGRlY2wubmFtZSAhLnRleHQpO1xuXG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIHRvcC1sZXZlbCBjb21tZW50IGluIHRoZSBvcmlnaW5hbCBmaWxlLCBjb3B5IGl0IG92ZXIgYXQgdGhlIHRvcCBvZiB0aGVcbiAgICAvLyBnZW5lcmF0ZWQgZmFjdG9yeSBmaWxlLiBUaGlzIGlzIGltcG9ydGFudCBmb3IgcHJlc2VydmluZyBhbnkgbG9hZC1iZWFyaW5nIGpzZG9jIGNvbW1lbnRzLlxuICAgIGxldCBjb21tZW50OiBzdHJpbmcgPSAnJztcbiAgICBpZiAob3JpZ2luYWwuc3RhdGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdFN0YXRlbWVudCA9IG9yaWdpbmFsLnN0YXRlbWVudHNbMF07XG4gICAgICBpZiAoZmlyc3RTdGF0ZW1lbnQuZ2V0TGVhZGluZ1RyaXZpYVdpZHRoKCkgPiAwKSB7XG4gICAgICAgIGNvbW1lbnQgPSBmaXJzdFN0YXRlbWVudC5nZXRGdWxsVGV4dCgpLnN1YnN0cigwLCBmaXJzdFN0YXRlbWVudC5nZXRMZWFkaW5nVHJpdmlhV2lkdGgoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHNvdXJjZVRleHQgPSBjb21tZW50O1xuICAgIGlmIChzeW1ib2xOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBGb3IgZWFjaCBzeW1ib2wgbmFtZSwgZ2VuZXJhdGUgYSBjb25zdGFudCBleHBvcnQgb2YgdGhlIGNvcnJlc3BvbmRpbmcgTmdGYWN0b3J5LlxuICAgICAgLy8gVGhpcyB3aWxsIGVuY29tcGFzcyBhIGxvdCBvZiBzeW1ib2xzIHdoaWNoIGRvbid0IG5lZWQgZmFjdG9yaWVzLCBidXQgdGhhdCdzIG9rYXlcbiAgICAgIC8vIGJlY2F1c2UgaXQgd29uJ3QgbWlzcyBhbnkgdGhhdCBkby5cbiAgICAgIGNvbnN0IHZhckxpbmVzID0gc3ltYm9sTmFtZXMubWFwKFxuICAgICAgICAgIG5hbWUgPT5cbiAgICAgICAgICAgICAgYGV4cG9ydCBjb25zdCAke25hbWV9TmdGYWN0b3J5OiBpMC7JtU5nTW9kdWxlRmFjdG9yeTxhbnk+ID0gbmV3IGkwLsm1TmdNb2R1bGVGYWN0b3J5KCR7bmFtZX0pO2ApO1xuICAgICAgc291cmNlVGV4dCArPSBbXG4gICAgICAgIC8vIFRoaXMgbWlnaHQgYmUgaW5jb3JyZWN0IGlmIHRoZSBjdXJyZW50IHBhY2thZ2UgYmVpbmcgY29tcGlsZWQgaXMgQW5ndWxhciBjb3JlLCBidXQgaXQnc1xuICAgICAgICAvLyBva2F5IHRvIGxlYXZlIGluIGF0IHR5cGUgY2hlY2tpbmcgdGltZS4gVHlwZVNjcmlwdCBjYW4gaGFuZGxlIHRoaXMgcmVmZXJlbmNlIHZpYSBpdHMgcGF0aFxuICAgICAgICAvLyBtYXBwaW5nLCBidXQgZG93bnN0cmVhbSBidW5kbGVycyBjYW4ndC4gSWYgdGhlIGN1cnJlbnQgcGFja2FnZSBpcyBjb3JlIGl0c2VsZiwgdGhpcyB3aWxsXG4gICAgICAgIC8vIGJlIHJlcGxhY2VkIGluIHRoZSBmYWN0b3J5IHRyYW5zZm9ybWVyIGJlZm9yZSBlbWl0LlxuICAgICAgICBgaW1wb3J0ICogYXMgaTAgZnJvbSAnQGFuZ3VsYXIvY29yZSc7YCxcbiAgICAgICAgYGltcG9ydCB7JHtzeW1ib2xOYW1lcy5qb2luKCcsICcpfX0gZnJvbSAnJHtyZWxhdGl2ZVBhdGhUb1NvdXJjZX0nO2AsXG4gICAgICAgIC4uLnZhckxpbmVzLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgYW4gZXh0cmEgZXhwb3J0IHRvIGVuc3VyZSB0aGlzIG1vZHVsZSBoYXMgYXQgbGVhc3Qgb25lLiBJdCdsbCBiZSByZW1vdmVkIGxhdGVyIGluIHRoZVxuICAgIC8vIGZhY3RvcnkgdHJhbnNmb3JtZXIgaWYgaXQgZW5kcyB1cCBub3QgYmVpbmcgbmVlZGVkLlxuICAgIHNvdXJjZVRleHQgKz0gJ1xcbmV4cG9ydCBjb25zdCDJtU5vbkVtcHR5TW9kdWxlID0gdHJ1ZTsnO1xuXG4gICAgY29uc3QgZ2VuRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICAgIGdlbkZpbGVQYXRoLCBzb3VyY2VUZXh0LCBvcmlnaW5hbC5sYW5ndWFnZVZlcnNpb24sIHRydWUsIHRzLlNjcmlwdEtpbmQuVFMpO1xuICAgIGlmIChvcmlnaW5hbC5tb2R1bGVOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGdlbkZpbGUubW9kdWxlTmFtZSA9XG4gICAgICAgICAgZ2VuZXJhdGVkTW9kdWxlTmFtZShvcmlnaW5hbC5tb2R1bGVOYW1lLCBvcmlnaW5hbC5maWxlTmFtZSwgJy5uZ2ZhY3RvcnknKTtcbiAgICB9XG4gICAgcmV0dXJuIGdlbkZpbGU7XG4gIH1cblxuICBzdGF0aWMgZm9yUm9vdEZpbGVzKGZpbGVzOiBSZWFkb25seUFycmF5PEFic29sdXRlRnNQYXRoPik6IEZhY3RvcnlHZW5lcmF0b3Ige1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXA8QWJzb2x1dGVGc1BhdGgsIHN0cmluZz4oKTtcbiAgICBmaWxlcy5maWx0ZXIoc291cmNlRmlsZSA9PiBpc05vbkRlY2xhcmF0aW9uVHNQYXRoKHNvdXJjZUZpbGUpKVxuICAgICAgICAuZm9yRWFjaChcbiAgICAgICAgICAgIHNvdXJjZUZpbGUgPT5cbiAgICAgICAgICAgICAgICBtYXAuc2V0KGFic29sdXRlRnJvbShzb3VyY2VGaWxlLnJlcGxhY2UoL1xcLnRzJC8sICcubmdmYWN0b3J5LnRzJykpLCBzb3VyY2VGaWxlKSk7XG4gICAgcmV0dXJuIG5ldyBGYWN0b3J5R2VuZXJhdG9yKG1hcCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFeHBvcnRlZChkZWNsOiB0cy5EZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICByZXR1cm4gZGVjbC5tb2RpZmllcnMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgZGVjbC5tb2RpZmllcnMuc29tZShtb2QgPT4gbW9kLmtpbmQgPT0gdHMuU3ludGF4S2luZC5FeHBvcnRLZXl3b3JkKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGYWN0b3J5SW5mbyB7XG4gIHNvdXJjZUZpbGVQYXRoOiBzdHJpbmc7XG4gIG1vZHVsZVN5bWJvbE5hbWVzOiBTZXQ8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlZEZhY3RvcnlUcmFuc2Zvcm0oXG4gICAgZmFjdG9yeU1hcDogTWFwPHN0cmluZywgRmFjdG9yeUluZm8+LFxuICAgIGltcG9ydFJld3JpdGVyOiBJbXBvcnRSZXdyaXRlcik6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgIHJldHVybiAoZmlsZTogdHMuU291cmNlRmlsZSk6IHRzLlNvdXJjZUZpbGUgPT4ge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybUZhY3RvcnlTb3VyY2VGaWxlKGZhY3RvcnlNYXAsIGNvbnRleHQsIGltcG9ydFJld3JpdGVyLCBmaWxlKTtcbiAgICB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1GYWN0b3J5U291cmNlRmlsZShcbiAgICBmYWN0b3J5TWFwOiBNYXA8c3RyaW5nLCBGYWN0b3J5SW5mbz4sIGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCxcbiAgICBpbXBvcnRSZXdyaXRlcjogSW1wb3J0UmV3cml0ZXIsIGZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgLy8gSWYgdGhpcyBpcyBub3QgYSBnZW5lcmF0ZWQgZmlsZSwgaXQgd29uJ3QgaGF2ZSBmYWN0b3J5IGluZm8gYXNzb2NpYXRlZCB3aXRoIGl0LlxuICBpZiAoIWZhY3RvcnlNYXAuaGFzKGZpbGUuZmlsZU5hbWUpKSB7XG4gICAgLy8gRG9uJ3QgdHJhbnNmb3JtIG5vbi1nZW5lcmF0ZWQgY29kZS5cbiAgICByZXR1cm4gZmlsZTtcbiAgfVxuXG4gIGNvbnN0IHttb2R1bGVTeW1ib2xOYW1lcywgc291cmNlRmlsZVBhdGh9ID0gZmFjdG9yeU1hcC5nZXQoZmlsZS5maWxlTmFtZSkgITtcblxuICBmaWxlID0gdHMuZ2V0TXV0YWJsZUNsb25lKGZpbGUpO1xuXG4gIC8vIE5vdCBldmVyeSBleHBvcnRlZCBmYWN0b3J5IHN0YXRlbWVudCBpcyB2YWxpZC4gVGhleSB3ZXJlIGdlbmVyYXRlZCBiZWZvcmUgdGhlIHByb2dyYW0gd2FzXG4gIC8vIGFuYWx5emVkLCBhbmQgYmVmb3JlIG5ndHNjIGtuZXcgd2hpY2ggc3ltYm9scyB3ZXJlIGFjdHVhbGx5IE5nTW9kdWxlcy4gZmFjdG9yeU1hcCBjb250YWluc1xuICAvLyB0aGF0IGtub3dsZWRnZSBub3csIHNvIHRoaXMgdHJhbnNmb3JtIGZpbHRlcnMgdGhlIHN0YXRlbWVudCBsaXN0IGFuZCByZW1vdmVzIGV4cG9ydGVkIGZhY3Rvcmllc1xuICAvLyB0aGF0IGFyZW4ndCBhY3R1YWxseSBmYWN0b3JpZXMuXG4gIC8vXG4gIC8vIFRoaXMgY291bGQgbGVhdmUgdGhlIGdlbmVyYXRlZCBmYWN0b3J5IGZpbGUgZW1wdHkuIFRvIHByZXZlbnQgdGhpcyAoaXQgY2F1c2VzIGlzc3VlcyB3aXRoXG4gIC8vIGNsb3N1cmUgY29tcGlsZXIpIGEgJ8m1Tm9uRW1wdHlNb2R1bGUnIGV4cG9ydCB3YXMgYWRkZWQgd2hlbiB0aGUgZmFjdG9yeSBzaGltIHdhcyBjcmVhdGVkLlxuICAvLyBQcmVzZXJ2ZSB0aGF0IGV4cG9ydCBpZiBuZWVkZWQsIGFuZCByZW1vdmUgaXQgb3RoZXJ3aXNlLlxuICAvL1xuICAvLyBBZGRpdGlvbmFsbHksIGFuIGltcG9ydCB0byBAYW5ndWxhci9jb3JlIGlzIGdlbmVyYXRlZCwgYnV0IHRoZSBjdXJyZW50IGNvbXBpbGF0aW9uIHVuaXQgY291bGRcbiAgLy8gYWN0dWFsbHkgYmUgQGFuZ3VsYXIvY29yZSwgaW4gd2hpY2ggY2FzZSBzdWNoIGFuIGltcG9ydCBpcyBpbnZhbGlkIGFuZCBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aFxuICAvLyB0aGUgcHJvcGVyIHBhdGggdG8gYWNjZXNzIEl2eSBzeW1ib2xzIGluIGNvcmUuXG5cbiAgLy8gVGhlIGZpbHRlcmVkIHNldCBvZiBzdGF0ZW1lbnRzLlxuICBjb25zdCB0cmFuc2Zvcm1lZFN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gW107XG5cbiAgLy8gVGhlIHN0YXRlbWVudCBpZGVudGlmaWVkIGFzIHRoZSDJtU5vbkVtcHR5TW9kdWxlIGV4cG9ydC5cbiAgbGV0IG5vbkVtcHR5RXhwb3J0OiB0cy5TdGF0ZW1lbnR8bnVsbCA9IG51bGw7XG5cbiAgLy8gRXh0cmFjdGVkIGlkZW50aWZpZXJzIHdoaWNoIHJlZmVyIHRvIGltcG9ydCBzdGF0ZW1lbnRzIGZyb20gQGFuZ3VsYXIvY29yZS5cbiAgY29uc3QgY29yZUltcG9ydElkZW50aWZpZXJzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgLy8gQ29uc2lkZXIgYWxsIHRoZSBzdGF0ZW1lbnRzLlxuICBmb3IgKGNvbnN0IHN0bXQgb2YgZmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgLy8gTG9vayBmb3IgaW1wb3J0cyB0byBAYW5ndWxhci9jb3JlLlxuICAgIGlmICh0cy5pc0ltcG9ydERlY2xhcmF0aW9uKHN0bXQpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChzdG10Lm1vZHVsZVNwZWNpZmllcikgJiZcbiAgICAgICAgc3RtdC5tb2R1bGVTcGVjaWZpZXIudGV4dCA9PT0gJ0Bhbmd1bGFyL2NvcmUnKSB7XG4gICAgICAvLyBVcGRhdGUgdGhlIGltcG9ydCBwYXRoIHRvIHBvaW50IHRvIHRoZSBjb3JyZWN0IGZpbGUgdXNpbmcgdGhlIEltcG9ydFJld3JpdGVyLlxuICAgICAgY29uc3QgcmV3cml0dGVuTW9kdWxlU3BlY2lmaWVyID1cbiAgICAgICAgICBpbXBvcnRSZXdyaXRlci5yZXdyaXRlU3BlY2lmaWVyKCdAYW5ndWxhci9jb3JlJywgc291cmNlRmlsZVBhdGgpO1xuICAgICAgaWYgKHJld3JpdHRlbk1vZHVsZVNwZWNpZmllciAhPT0gc3RtdC5tb2R1bGVTcGVjaWZpZXIudGV4dCkge1xuICAgICAgICB0cmFuc2Zvcm1lZFN0YXRlbWVudHMucHVzaCh0cy51cGRhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAgIHN0bXQsIHN0bXQuZGVjb3JhdG9ycywgc3RtdC5tb2RpZmllcnMsIHN0bXQuaW1wb3J0Q2xhdXNlLFxuICAgICAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChyZXdyaXR0ZW5Nb2R1bGVTcGVjaWZpZXIpKSk7XG5cbiAgICAgICAgLy8gUmVjb3JkIHRoZSBpZGVudGlmaWVyIGJ5IHdoaWNoIHRoaXMgaW1wb3J0ZWQgbW9kdWxlIGdvZXMsIHNvIHJlZmVyZW5jZXMgdG8gaXRzIHN5bWJvbHNcbiAgICAgICAgLy8gY2FuIGJlIGRpc2NvdmVyZWQgbGF0ZXIuXG4gICAgICAgIGlmIChzdG10LmltcG9ydENsYXVzZSAhPT0gdW5kZWZpbmVkICYmIHN0bXQuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdHMuaXNOYW1lc3BhY2VJbXBvcnQoc3RtdC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykpIHtcbiAgICAgICAgICBjb3JlSW1wb3J0SWRlbnRpZmllcnMuYWRkKHN0bXQuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MubmFtZS50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhbnNmb3JtZWRTdGF0ZW1lbnRzLnB1c2goc3RtdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KHN0bXQpICYmIHN0bXQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IGRlY2wgPSBzdG10LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbMF07XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgdGhlIMm1Tm9uRW1wdHlNb2R1bGUgZXhwb3J0LCB0aGVuIHNhdmUgaXQgZm9yIGxhdGVyLlxuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihkZWNsLm5hbWUpKSB7XG4gICAgICAgIGlmIChkZWNsLm5hbWUudGV4dCA9PT0gJ8m1Tm9uRW1wdHlNb2R1bGUnKSB7XG4gICAgICAgICAgbm9uRW1wdHlFeHBvcnQgPSBzdG10O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjaGVjayBpZiB0aGlzIGV4cG9ydCBpcyBhIGZhY3RvcnkgZm9yIGEga25vd24gTmdNb2R1bGUsIGFuZCByZXRhaW4gaXQgaWYgc28uXG4gICAgICAgIGNvbnN0IG1hdGNoID0gU1RSSVBfTkdfRkFDVE9SWS5leGVjKGRlY2wubmFtZS50ZXh0KTtcbiAgICAgICAgaWYgKG1hdGNoICE9PSBudWxsICYmIG1vZHVsZVN5bWJvbE5hbWVzLmhhcyhtYXRjaFsxXSkpIHtcbiAgICAgICAgICB0cmFuc2Zvcm1lZFN0YXRlbWVudHMucHVzaChzdG10KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTGVhdmUgdGhlIHN0YXRlbWVudCBhbG9uZSwgYXMgaXQgY2FuJ3QgYmUgdW5kZXJzdG9vZC5cbiAgICAgICAgdHJhbnNmb3JtZWRTdGF0ZW1lbnRzLnB1c2goc3RtdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluY2x1ZGUgbm9uLXZhcmlhYmxlIHN0YXRlbWVudHMgKGltcG9ydHMsIGV0YykuXG4gICAgICB0cmFuc2Zvcm1lZFN0YXRlbWVudHMucHVzaChzdG10KTtcbiAgICB9XG4gIH1cblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBlbXB0eSBtb2R1bGUgZXhwb3J0IGlzIHN0aWxsIG5lZWRlZC5cbiAgaWYgKCF0cmFuc2Zvcm1lZFN0YXRlbWVudHMuc29tZSh0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KSAmJiBub25FbXB0eUV4cG9ydCAhPT0gbnVsbCkge1xuICAgIC8vIElmIHRoZSByZXN1bHRpbmcgZmlsZSBoYXMgbm8gZmFjdG9yaWVzLCBpbmNsdWRlIGFuIGVtcHR5IGV4cG9ydCB0b1xuICAgIC8vIHNhdGlzZnkgY2xvc3VyZSBjb21waWxlci5cbiAgICB0cmFuc2Zvcm1lZFN0YXRlbWVudHMucHVzaChub25FbXB0eUV4cG9ydCk7XG4gIH1cbiAgZmlsZS5zdGF0ZW1lbnRzID0gdHMuY3JlYXRlTm9kZUFycmF5KHRyYW5zZm9ybWVkU3RhdGVtZW50cyk7XG5cbiAgLy8gSWYgYW55IGltcG9ydHMgdG8gQGFuZ3VsYXIvY29yZSB3ZXJlIGRldGVjdGVkIGFuZCByZXdyaXR0ZW4gKHdoaWNoIGhhcHBlbnMgd2hlbiBjb21waWxpbmdcbiAgLy8gQGFuZ3VsYXIvY29yZSksIGdvIHRocm91Z2ggdGhlIFNvdXJjZUZpbGUgYW5kIHJld3JpdGUgcmVmZXJlbmNlcyB0byBzeW1ib2xzIGltcG9ydGVkIGZyb20gY29yZS5cbiAgaWYgKGNvcmVJbXBvcnRJZGVudGlmaWVycy5zaXplID4gMCkge1xuICAgIGNvbnN0IHZpc2l0ID0gPFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlOiBUKTogVCA9PiB7XG4gICAgICBub2RlID0gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgY2hpbGQgPT4gdmlzaXQoY2hpbGQpLCBjb250ZXh0KTtcblxuICAgICAgLy8gTG9vayBmb3IgZXhwcmVzc2lvbnMgb2YgdGhlIGZvcm0gXCJpLnNcIiB3aGVyZSAnaScgaXMgYSBkZXRlY3RlZCBuYW1lIGZvciBhbiBAYW5ndWxhci9jb3JlXG4gICAgICAvLyBpbXBvcnQgdGhhdCB3YXMgY2hhbmdlZCBhYm92ZS4gUmV3cml0ZSAncycgdXNpbmcgdGhlIEltcG9ydFJlc29sdmVyLlxuICAgICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzSWRlbnRpZmllcihub2RlLmV4cHJlc3Npb24pICYmXG4gICAgICAgICAgY29yZUltcG9ydElkZW50aWZpZXJzLmhhcyhub2RlLmV4cHJlc3Npb24udGV4dCkpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBpbXBvcnQgb2YgYSBzeW1ib2wgZnJvbSBAYW5ndWxhci9jb3JlLiBUcmFuc2Zvcm0gaXQgd2l0aCB0aGUgaW1wb3J0UmV3cml0ZXIuXG4gICAgICAgIGNvbnN0IHJld3JpdHRlblN5bWJvbCA9IGltcG9ydFJld3JpdGVyLnJld3JpdGVTeW1ib2wobm9kZS5uYW1lLnRleHQsICdAYW5ndWxhci9jb3JlJyk7XG4gICAgICAgIGlmIChyZXdyaXR0ZW5TeW1ib2wgIT09IG5vZGUubmFtZS50ZXh0KSB7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9XG4gICAgICAgICAgICAgIHRzLnVwZGF0ZVByb3BlcnR5QWNjZXNzKG5vZGUsIG5vZGUuZXhwcmVzc2lvbiwgdHMuY3JlYXRlSWRlbnRpZmllcihyZXdyaXR0ZW5TeW1ib2wpKTtcbiAgICAgICAgICBub2RlID0gdXBkYXRlZCBhcyBUICYgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgZmlsZSA9IHZpc2l0KGZpbGUpO1xuICB9XG5cbiAgcmV0dXJuIGZpbGU7XG59XG4iXX0=
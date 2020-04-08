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
        define("@angular/compiler-cli/src/transformers/lower_expressions", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/metadata/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var index_1 = require("@angular/compiler-cli/src/metadata/index");
    function toMap(items, select) {
        return new Map(items.map(function (i) { return [select(i), i]; }));
    }
    // We will never lower expressions in a nested lexical scope so avoid entering them.
    // This also avoids a bug in TypeScript 2.3 where the lexical scopes get out of sync
    // when using visitEachChild.
    function isLexicalScope(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.ClassExpression:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.FunctionType:
            case ts.SyntaxKind.TypeLiteral:
            case ts.SyntaxKind.ArrayType:
                return true;
        }
        return false;
    }
    function transformSourceFile(sourceFile, requests, context) {
        var inserts = [];
        // Calculate the range of interesting locations. The transform will only visit nodes in this
        // range to improve the performance on large files.
        var locations = Array.from(requests.keys());
        var min = Math.min.apply(Math, tslib_1.__spread(locations));
        var max = Math.max.apply(Math, tslib_1.__spread(locations));
        // Visit nodes matching the request and synthetic nodes added by tsickle
        function shouldVisit(pos, end) {
            return (pos <= max && end >= min) || pos == -1;
        }
        function visitSourceFile(sourceFile) {
            function topLevelStatement(node) {
                var declarations = [];
                function visitNode(node) {
                    // Get the original node before tsickle
                    var _a = ts.getOriginalNode(node), pos = _a.pos, end = _a.end, kind = _a.kind, originalParent = _a.parent;
                    var nodeRequest = requests.get(pos);
                    if (nodeRequest && nodeRequest.kind == kind && nodeRequest.end == end) {
                        // This node is requested to be rewritten as a reference to the exported name.
                        if (originalParent && originalParent.kind === ts.SyntaxKind.VariableDeclaration) {
                            // As the value represents the whole initializer of a variable declaration,
                            // just refer to that variable. This e.g. helps to preserve closure comments
                            // at the right place.
                            var varParent = originalParent;
                            if (varParent.name.kind === ts.SyntaxKind.Identifier) {
                                var varName = varParent.name.text;
                                var exportName_1 = nodeRequest.name;
                                declarations.push({
                                    name: exportName_1,
                                    node: ts.createIdentifier(varName),
                                    order: 1 /* AfterStmt */
                                });
                                return node;
                            }
                        }
                        // Record that the node needs to be moved to an exported variable with the given name
                        var exportName = nodeRequest.name;
                        declarations.push({ name: exportName, node: node, order: 0 /* BeforeStmt */ });
                        return ts.createIdentifier(exportName);
                    }
                    var result = node;
                    if (shouldVisit(pos, end) && !isLexicalScope(node)) {
                        result = ts.visitEachChild(node, visitNode, context);
                    }
                    return result;
                }
                // Get the original node before tsickle
                var _a = ts.getOriginalNode(node), pos = _a.pos, end = _a.end;
                var resultStmt;
                if (shouldVisit(pos, end)) {
                    resultStmt = ts.visitEachChild(node, visitNode, context);
                }
                else {
                    resultStmt = node;
                }
                if (declarations.length) {
                    inserts.push({ relativeTo: resultStmt, declarations: declarations });
                }
                return resultStmt;
            }
            var newStatements = sourceFile.statements.map(topLevelStatement);
            if (inserts.length) {
                // Insert the declarations relative to the rewritten statement that references them.
                var insertMap_1 = toMap(inserts, function (i) { return i.relativeTo; });
                var tmpStatements_1 = [];
                newStatements.forEach(function (statement) {
                    var insert = insertMap_1.get(statement);
                    if (insert) {
                        var before = insert.declarations.filter(function (d) { return d.order === 0 /* BeforeStmt */; });
                        if (before.length) {
                            tmpStatements_1.push(createVariableStatementForDeclarations(before));
                        }
                        tmpStatements_1.push(statement);
                        var after = insert.declarations.filter(function (d) { return d.order === 1 /* AfterStmt */; });
                        if (after.length) {
                            tmpStatements_1.push(createVariableStatementForDeclarations(after));
                        }
                    }
                    else {
                        tmpStatements_1.push(statement);
                    }
                });
                // Insert an exports clause to export the declarations
                tmpStatements_1.push(ts.createExportDeclaration(
                /* decorators */ undefined, 
                /* modifiers */ undefined, ts.createNamedExports(inserts
                    .reduce(function (accumulator, insert) { return tslib_1.__spread(accumulator, insert.declarations); }, [])
                    .map(function (declaration) { return ts.createExportSpecifier(
                /* propertyName */ undefined, declaration.name); }))));
                newStatements = tmpStatements_1;
            }
            // Note: We cannot use ts.updateSourcefile here as
            // it does not work well with decorators.
            // See https://github.com/Microsoft/TypeScript/issues/17384
            var newSf = ts.getMutableClone(sourceFile);
            if (!(sourceFile.flags & ts.NodeFlags.Synthesized)) {
                newSf.flags &= ~ts.NodeFlags.Synthesized;
            }
            newSf.statements = ts.setTextRange(ts.createNodeArray(newStatements), sourceFile.statements);
            return newSf;
        }
        return visitSourceFile(sourceFile);
    }
    function createVariableStatementForDeclarations(declarations) {
        var varDecls = declarations.map(function (i) { return ts.createVariableDeclaration(i.name, /* type */ undefined, i.node); });
        return ts.createVariableStatement(
        /* modifiers */ undefined, ts.createVariableDeclarationList(varDecls, ts.NodeFlags.Const));
    }
    function getExpressionLoweringTransformFactory(requestsMap, program) {
        // Return the factory
        return function (context) { return function (sourceFile) {
            // We need to use the original SourceFile for reading metadata, and not the transformed one.
            var originalFile = program.getSourceFile(sourceFile.fileName);
            if (originalFile) {
                var requests = requestsMap.getRequests(originalFile);
                if (requests && requests.size) {
                    return transformSourceFile(sourceFile, requests, context);
                }
            }
            return sourceFile;
        }; };
    }
    exports.getExpressionLoweringTransformFactory = getExpressionLoweringTransformFactory;
    function isEligibleForLowering(node) {
        if (node) {
            switch (node.kind) {
                case ts.SyntaxKind.SourceFile:
                case ts.SyntaxKind.Decorator:
                    // Lower expressions that are local to the module scope or
                    // in a decorator.
                    return true;
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.EnumDeclaration:
                case ts.SyntaxKind.FunctionDeclaration:
                    // Don't lower expressions in a declaration.
                    return false;
                case ts.SyntaxKind.VariableDeclaration:
                    var isExported = (ts.getCombinedModifierFlags(node) &
                        ts.ModifierFlags.Export) == 0;
                    // This might be unnecessary, as the variable might be exported and only used as a reference
                    // in another expression. However, the variable also might be involved in provider
                    // definitions. If that's the case, there is a specific token (`ROUTES`) which the compiler
                    // attempts to understand deeply. Sub-expressions within that token (`loadChildren` for
                    // example) might also require lowering even if the top-level declaration is already
                    // properly exported.
                    var varNode = node;
                    return isExported || (varNode.initializer !== undefined &&
                        (ts.isObjectLiteralExpression(varNode.initializer) ||
                            ts.isArrayLiteralExpression(varNode.initializer) ||
                            ts.isCallExpression(varNode.initializer)));
            }
            return isEligibleForLowering(node.parent);
        }
        return true;
    }
    function isPrimitive(value) {
        return Object(value) !== value;
    }
    function isRewritten(value) {
        return index_1.isMetadataGlobalReferenceExpression(value) && compiler_1.isLoweredSymbol(value.name);
    }
    function isLiteralFieldNamed(node, names) {
        if (node.parent && node.parent.kind == ts.SyntaxKind.PropertyAssignment) {
            var property = node.parent;
            if (property.parent && property.parent.kind == ts.SyntaxKind.ObjectLiteralExpression &&
                property.name && property.name.kind == ts.SyntaxKind.Identifier) {
                var propertyName = property.name;
                return names.has(propertyName.text);
            }
        }
        return false;
    }
    var LowerMetadataTransform = /** @class */ (function () {
        function LowerMetadataTransform(lowerableFieldNames) {
            this.requests = new Map();
            this.lowerableFieldNames = new Set(lowerableFieldNames);
        }
        // RequestMap
        LowerMetadataTransform.prototype.getRequests = function (sourceFile) {
            var result = this.requests.get(sourceFile.fileName);
            if (!result) {
                // Force the metadata for this source file to be collected which
                // will recursively call start() populating the request map;
                this.cache.getMetadata(sourceFile);
                // If we still don't have the requested metadata, the file is not a module
                // or is a declaration file so return an empty map.
                result = this.requests.get(sourceFile.fileName) || new Map();
            }
            return result;
        };
        // MetadataTransformer
        LowerMetadataTransform.prototype.connect = function (cache) { this.cache = cache; };
        LowerMetadataTransform.prototype.start = function (sourceFile) {
            var _this = this;
            var identNumber = 0;
            var freshIdent = function () { return compiler_1.createLoweredSymbol(identNumber++); };
            var requests = new Map();
            this.requests.set(sourceFile.fileName, requests);
            var replaceNode = function (node) {
                var name = freshIdent();
                requests.set(node.pos, { name: name, kind: node.kind, location: node.pos, end: node.end });
                return { __symbolic: 'reference', name: name };
            };
            var isExportedSymbol = (function () {
                var exportTable;
                return function (node) {
                    if (node.kind == ts.SyntaxKind.Identifier) {
                        var ident = node;
                        if (!exportTable) {
                            exportTable = createExportTableFor(sourceFile);
                        }
                        return exportTable.has(ident.text);
                    }
                    return false;
                };
            })();
            var isExportedPropertyAccess = function (node) {
                if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    var pae = node;
                    if (isExportedSymbol(pae.expression)) {
                        return true;
                    }
                }
                return false;
            };
            var hasLowerableParentCache = new Map();
            var shouldBeLowered = function (node) {
                if (node === undefined) {
                    return false;
                }
                var lowerable = false;
                if ((node.kind === ts.SyntaxKind.ArrowFunction ||
                    node.kind === ts.SyntaxKind.FunctionExpression) &&
                    isEligibleForLowering(node)) {
                    lowerable = true;
                }
                else if (isLiteralFieldNamed(node, _this.lowerableFieldNames) && isEligibleForLowering(node) &&
                    !isExportedSymbol(node) && !isExportedPropertyAccess(node)) {
                    lowerable = true;
                }
                return lowerable;
            };
            var hasLowerableParent = function (node) {
                if (node === undefined) {
                    return false;
                }
                if (!hasLowerableParentCache.has(node)) {
                    hasLowerableParentCache.set(node, shouldBeLowered(node.parent) || hasLowerableParent(node.parent));
                }
                return hasLowerableParentCache.get(node);
            };
            var isLowerable = function (node) {
                if (node === undefined) {
                    return false;
                }
                return shouldBeLowered(node) && !hasLowerableParent(node);
            };
            return function (value, node) {
                if (!isPrimitive(value) && !isRewritten(value) && isLowerable(node)) {
                    return replaceNode(node);
                }
                return value;
            };
        };
        return LowerMetadataTransform;
    }());
    exports.LowerMetadataTransform = LowerMetadataTransform;
    function createExportTableFor(sourceFile) {
        var exportTable = new Set();
        // Lazily collect all the exports from the source file
        ts.forEachChild(sourceFile, function scan(node) {
            var e_1, _a;
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.InterfaceDeclaration:
                    if ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) != 0) {
                        var classDeclaration = node;
                        var name = classDeclaration.name;
                        if (name)
                            exportTable.add(name.text);
                    }
                    break;
                case ts.SyntaxKind.VariableStatement:
                    var variableStatement = node;
                    try {
                        for (var _b = tslib_1.__values(variableStatement.declarationList.declarations), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var declaration = _c.value;
                            scan(declaration);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    break;
                case ts.SyntaxKind.VariableDeclaration:
                    var variableDeclaration = node;
                    if ((ts.getCombinedModifierFlags(variableDeclaration) & ts.ModifierFlags.Export) != 0 &&
                        variableDeclaration.name.kind == ts.SyntaxKind.Identifier) {
                        var name = variableDeclaration.name;
                        exportTable.add(name.text);
                    }
                    break;
                case ts.SyntaxKind.ExportDeclaration:
                    var exportDeclaration = node;
                    var moduleSpecifier = exportDeclaration.moduleSpecifier, exportClause = exportDeclaration.exportClause;
                    if (!moduleSpecifier && exportClause) {
                        exportClause.elements.forEach(function (spec) { exportTable.add(spec.name.text); });
                    }
            }
        });
        return exportTable;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJfZXhwcmVzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL3RyYW5zZm9ybWVycy9sb3dlcl9leHByZXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBdUU7SUFDdkUsK0JBQWlDO0lBRWpDLGtFQUEwSTtJQXlCMUksU0FBUyxLQUFLLENBQU8sS0FBVSxFQUFFLE1BQXNCO1FBQ3JELE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBUyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELG9GQUFvRjtJQUNwRixvRkFBb0Y7SUFDcEYsNkJBQTZCO0lBQzdCLFNBQVMsY0FBYyxDQUFDLElBQWE7UUFDbkMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7WUFDakMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO1lBQ3RDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztZQUN2QyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQ25DLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1lBQ2hDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7WUFDL0IsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVM7Z0JBQzFCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENB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SUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDN0U7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjcmVhdGVMb3dlcmVkU3ltYm9sLCBpc0xvd2VyZWRTeW1ib2x9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0NvbGxlY3Rvck9wdGlvbnMsIE1ldGFkYXRhQ29sbGVjdG9yLCBNZXRhZGF0YVZhbHVlLCBNb2R1bGVNZXRhZGF0YSwgaXNNZXRhZGF0YUdsb2JhbFJlZmVyZW5jZUV4cHJlc3Npb259IGZyb20gJy4uL21ldGFkYXRhL2luZGV4JztcbmltcG9ydCB7TWV0YWRhdGFDYWNoZSwgTWV0YWRhdGFUcmFuc2Zvcm1lciwgVmFsdWVUcmFuc2Zvcm19IGZyb20gJy4vbWV0YWRhdGFfY2FjaGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvd2VyaW5nUmVxdWVzdCB7XG4gIGtpbmQ6IHRzLlN5bnRheEtpbmQ7XG4gIGxvY2F0aW9uOiBudW1iZXI7XG4gIGVuZDogbnVtYmVyO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFJlcXVlc3RMb2NhdGlvbk1hcCA9IE1hcDxudW1iZXIsIExvd2VyaW5nUmVxdWVzdD47XG5cbmNvbnN0IGVudW0gRGVjbGFyYXRpb25PcmRlciB7IEJlZm9yZVN0bXQsIEFmdGVyU3RtdCB9XG5cbmludGVyZmFjZSBEZWNsYXJhdGlvbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgbm9kZTogdHMuTm9kZTtcbiAgb3JkZXI6IERlY2xhcmF0aW9uT3JkZXI7XG59XG5cbmludGVyZmFjZSBEZWNsYXJhdGlvbkluc2VydCB7XG4gIGRlY2xhcmF0aW9uczogRGVjbGFyYXRpb25bXTtcbiAgcmVsYXRpdmVUbzogdHMuTm9kZTtcbn1cblxuZnVuY3Rpb24gdG9NYXA8VCwgSz4oaXRlbXM6IFRbXSwgc2VsZWN0OiAoaXRlbTogVCkgPT4gSyk6IE1hcDxLLCBUPiB7XG4gIHJldHVybiBuZXcgTWFwKGl0ZW1zLm1hcDxbSywgVF0+KGkgPT4gW3NlbGVjdChpKSwgaV0pKTtcbn1cblxuLy8gV2Ugd2lsbCBuZXZlciBsb3dlciBleHByZXNzaW9ucyBpbiBhIG5lc3RlZCBsZXhpY2FsIHNjb3BlIHNvIGF2b2lkIGVudGVyaW5nIHRoZW0uXG4vLyBUaGlzIGFsc28gYXZvaWRzIGEgYnVnIGluIFR5cGVTY3JpcHQgMi4zIHdoZXJlIHRoZSBsZXhpY2FsIHNjb3BlcyBnZXQgb3V0IG9mIHN5bmNcbi8vIHdoZW4gdXNpbmcgdmlzaXRFYWNoQ2hpbGQuXG5mdW5jdGlvbiBpc0xleGljYWxTY29wZShub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG4gIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLkFycm93RnVuY3Rpb246XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRXhwcmVzc2lvbjpcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbjpcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuQ2xhc3NFeHByZXNzaW9uOlxuICAgIGNhc2UgdHMuU3ludGF4S2luZC5DbGFzc0RlY2xhcmF0aW9uOlxuICAgIGNhc2UgdHMuU3ludGF4S2luZC5GdW5jdGlvblR5cGU6XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLlR5cGVMaXRlcmFsOlxuICAgIGNhc2UgdHMuU3ludGF4S2luZC5BcnJheVR5cGU6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybVNvdXJjZUZpbGUoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgcmVxdWVzdHM6IFJlcXVlc3RMb2NhdGlvbk1hcCxcbiAgICBjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgY29uc3QgaW5zZXJ0czogRGVjbGFyYXRpb25JbnNlcnRbXSA9IFtdO1xuXG4gIC8vIENhbGN1bGF0ZSB0aGUgcmFuZ2Ugb2YgaW50ZXJlc3RpbmcgbG9jYXRpb25zLiBUaGUgdHJhbnNmb3JtIHdpbGwgb25seSB2aXNpdCBub2RlcyBpbiB0aGlzXG4gIC8vIHJhbmdlIHRvIGltcHJvdmUgdGhlIHBlcmZvcm1hbmNlIG9uIGxhcmdlIGZpbGVzLlxuICBjb25zdCBsb2NhdGlvbnMgPSBBcnJheS5mcm9tKHJlcXVlc3RzLmtleXMoKSk7XG4gIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLmxvY2F0aW9ucyk7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmxvY2F0aW9ucyk7XG5cbiAgLy8gVmlzaXQgbm9kZXMgbWF0Y2hpbmcgdGhlIHJlcXVlc3QgYW5kIHN5bnRoZXRpYyBub2RlcyBhZGRlZCBieSB0c2lja2xlXG4gIGZ1bmN0aW9uIHNob3VsZFZpc2l0KHBvczogbnVtYmVyLCBlbmQ6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAocG9zIDw9IG1heCAmJiBlbmQgPj0gbWluKSB8fCBwb3MgPT0gLTE7XG4gIH1cblxuICBmdW5jdGlvbiB2aXNpdFNvdXJjZUZpbGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLlNvdXJjZUZpbGUge1xuICAgIGZ1bmN0aW9uIHRvcExldmVsU3RhdGVtZW50KG5vZGU6IHRzLlN0YXRlbWVudCk6IHRzLlN0YXRlbWVudCB7XG4gICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAgICAgZnVuY3Rpb24gdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgICAgICAgLy8gR2V0IHRoZSBvcmlnaW5hbCBub2RlIGJlZm9yZSB0c2lja2xlXG4gICAgICAgIGNvbnN0IHtwb3MsIGVuZCwga2luZCwgcGFyZW50OiBvcmlnaW5hbFBhcmVudH0gPSB0cy5nZXRPcmlnaW5hbE5vZGUobm9kZSk7XG4gICAgICAgIGNvbnN0IG5vZGVSZXF1ZXN0ID0gcmVxdWVzdHMuZ2V0KHBvcyk7XG4gICAgICAgIGlmIChub2RlUmVxdWVzdCAmJiBub2RlUmVxdWVzdC5raW5kID09IGtpbmQgJiYgbm9kZVJlcXVlc3QuZW5kID09IGVuZCkge1xuICAgICAgICAgIC8vIFRoaXMgbm9kZSBpcyByZXF1ZXN0ZWQgdG8gYmUgcmV3cml0dGVuIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBleHBvcnRlZCBuYW1lLlxuICAgICAgICAgIGlmIChvcmlnaW5hbFBhcmVudCAmJiBvcmlnaW5hbFBhcmVudC5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIC8vIEFzIHRoZSB2YWx1ZSByZXByZXNlbnRzIHRoZSB3aG9sZSBpbml0aWFsaXplciBvZiBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uLFxuICAgICAgICAgICAgLy8ganVzdCByZWZlciB0byB0aGF0IHZhcmlhYmxlLiBUaGlzIGUuZy4gaGVscHMgdG8gcHJlc2VydmUgY2xvc3VyZSBjb21tZW50c1xuICAgICAgICAgICAgLy8gYXQgdGhlIHJpZ2h0IHBsYWNlLlxuICAgICAgICAgICAgY29uc3QgdmFyUGFyZW50ID0gb3JpZ2luYWxQYXJlbnQgYXMgdHMuVmFyaWFibGVEZWNsYXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh2YXJQYXJlbnQubmFtZS5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgY29uc3QgdmFyTmFtZSA9IHZhclBhcmVudC5uYW1lLnRleHQ7XG4gICAgICAgICAgICAgIGNvbnN0IGV4cG9ydE5hbWUgPSBub2RlUmVxdWVzdC5uYW1lO1xuICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogZXhwb3J0TmFtZSxcbiAgICAgICAgICAgICAgICBub2RlOiB0cy5jcmVhdGVJZGVudGlmaWVyKHZhck5hbWUpLFxuICAgICAgICAgICAgICAgIG9yZGVyOiBEZWNsYXJhdGlvbk9yZGVyLkFmdGVyU3RtdFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJlY29yZCB0aGF0IHRoZSBub2RlIG5lZWRzIHRvIGJlIG1vdmVkIHRvIGFuIGV4cG9ydGVkIHZhcmlhYmxlIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICAgICAgICBjb25zdCBleHBvcnROYW1lID0gbm9kZVJlcXVlc3QubmFtZTtcbiAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaCh7bmFtZTogZXhwb3J0TmFtZSwgbm9kZSwgb3JkZXI6IERlY2xhcmF0aW9uT3JkZXIuQmVmb3JlU3RtdH0pO1xuICAgICAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKGV4cG9ydE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHQgPSBub2RlO1xuICAgICAgICBpZiAoc2hvdWxkVmlzaXQocG9zLCBlbmQpICYmICFpc0xleGljYWxTY29wZShub2RlKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgLy8gR2V0IHRoZSBvcmlnaW5hbCBub2RlIGJlZm9yZSB0c2lja2xlXG4gICAgICBjb25zdCB7cG9zLCBlbmR9ID0gdHMuZ2V0T3JpZ2luYWxOb2RlKG5vZGUpO1xuICAgICAgbGV0IHJlc3VsdFN0bXQ6IHRzLlN0YXRlbWVudDtcbiAgICAgIGlmIChzaG91bGRWaXNpdChwb3MsIGVuZCkpIHtcbiAgICAgICAgcmVzdWx0U3RtdCA9IHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSwgY29udGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRTdG10ID0gbm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgaW5zZXJ0cy5wdXNoKHtyZWxhdGl2ZVRvOiByZXN1bHRTdG10LCBkZWNsYXJhdGlvbnN9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRTdG10O1xuICAgIH1cblxuICAgIGxldCBuZXdTdGF0ZW1lbnRzID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzLm1hcCh0b3BMZXZlbFN0YXRlbWVudCk7XG5cbiAgICBpZiAoaW5zZXJ0cy5sZW5ndGgpIHtcbiAgICAgIC8vIEluc2VydCB0aGUgZGVjbGFyYXRpb25zIHJlbGF0aXZlIHRvIHRoZSByZXdyaXR0ZW4gc3RhdGVtZW50IHRoYXQgcmVmZXJlbmNlcyB0aGVtLlxuICAgICAgY29uc3QgaW5zZXJ0TWFwID0gdG9NYXAoaW5zZXJ0cywgaSA9PiBpLnJlbGF0aXZlVG8pO1xuICAgICAgY29uc3QgdG1wU3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBbXTtcbiAgICAgIG5ld1N0YXRlbWVudHMuZm9yRWFjaChzdGF0ZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCBpbnNlcnQgPSBpbnNlcnRNYXAuZ2V0KHN0YXRlbWVudCk7XG4gICAgICAgIGlmIChpbnNlcnQpIHtcbiAgICAgICAgICBjb25zdCBiZWZvcmUgPSBpbnNlcnQuZGVjbGFyYXRpb25zLmZpbHRlcihkID0+IGQub3JkZXIgPT09IERlY2xhcmF0aW9uT3JkZXIuQmVmb3JlU3RtdCk7XG4gICAgICAgICAgaWYgKGJlZm9yZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRtcFN0YXRlbWVudHMucHVzaChjcmVhdGVWYXJpYWJsZVN0YXRlbWVudEZvckRlY2xhcmF0aW9ucyhiZWZvcmUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG1wU3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgY29uc3QgYWZ0ZXIgPSBpbnNlcnQuZGVjbGFyYXRpb25zLmZpbHRlcihkID0+IGQub3JkZXIgPT09IERlY2xhcmF0aW9uT3JkZXIuQWZ0ZXJTdG10KTtcbiAgICAgICAgICBpZiAoYWZ0ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0bXBTdGF0ZW1lbnRzLnB1c2goY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnRGb3JEZWNsYXJhdGlvbnMoYWZ0ZXIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG1wU3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBJbnNlcnQgYW4gZXhwb3J0cyBjbGF1c2UgdG8gZXhwb3J0IHRoZSBkZWNsYXJhdGlvbnNcbiAgICAgIHRtcFN0YXRlbWVudHMucHVzaCh0cy5jcmVhdGVFeHBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAvKiBkZWNvcmF0b3JzICovIHVuZGVmaW5lZCxcbiAgICAgICAgICAvKiBtb2RpZmllcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgIHRzLmNyZWF0ZU5hbWVkRXhwb3J0cyhcbiAgICAgICAgICAgICAgaW5zZXJ0c1xuICAgICAgICAgICAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgICAoYWNjdW11bGF0b3IsIGluc2VydCkgPT4gWy4uLmFjY3VtdWxhdG9yLCAuLi5pbnNlcnQuZGVjbGFyYXRpb25zXSxcbiAgICAgICAgICAgICAgICAgICAgICBbXSBhcyBEZWNsYXJhdGlvbltdKVxuICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbiA9PiB0cy5jcmVhdGVFeHBvcnRTcGVjaWZpZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHByb3BlcnR5TmFtZSAqLyB1bmRlZmluZWQsIGRlY2xhcmF0aW9uLm5hbWUpKSkpKTtcblxuICAgICAgbmV3U3RhdGVtZW50cyA9IHRtcFN0YXRlbWVudHM7XG4gICAgfVxuICAgIC8vIE5vdGU6IFdlIGNhbm5vdCB1c2UgdHMudXBkYXRlU291cmNlZmlsZSBoZXJlIGFzXG4gICAgLy8gaXQgZG9lcyBub3Qgd29yayB3ZWxsIHdpdGggZGVjb3JhdG9ycy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzM4NFxuICAgIGNvbnN0IG5ld1NmID0gdHMuZ2V0TXV0YWJsZUNsb25lKHNvdXJjZUZpbGUpO1xuICAgIGlmICghKHNvdXJjZUZpbGUuZmxhZ3MgJiB0cy5Ob2RlRmxhZ3MuU3ludGhlc2l6ZWQpKSB7XG4gICAgICBuZXdTZi5mbGFncyAmPSB+dHMuTm9kZUZsYWdzLlN5bnRoZXNpemVkO1xuICAgIH1cbiAgICBuZXdTZi5zdGF0ZW1lbnRzID0gdHMuc2V0VGV4dFJhbmdlKHRzLmNyZWF0ZU5vZGVBcnJheShuZXdTdGF0ZW1lbnRzKSwgc291cmNlRmlsZS5zdGF0ZW1lbnRzKTtcbiAgICByZXR1cm4gbmV3U2Y7XG4gIH1cblxuICByZXR1cm4gdmlzaXRTb3VyY2VGaWxlKHNvdXJjZUZpbGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVWYXJpYWJsZVN0YXRlbWVudEZvckRlY2xhcmF0aW9ucyhkZWNsYXJhdGlvbnM6IERlY2xhcmF0aW9uW10pOiB0cy5WYXJpYWJsZVN0YXRlbWVudCB7XG4gIGNvbnN0IHZhckRlY2xzID0gZGVjbGFyYXRpb25zLm1hcChcbiAgICAgIGkgPT4gdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbihpLm5hbWUsIC8qIHR5cGUgKi8gdW5kZWZpbmVkLCBpLm5vZGUgYXMgdHMuRXhwcmVzc2lvbikpO1xuICByZXR1cm4gdHMuY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgICAvKiBtb2RpZmllcnMgKi8gdW5kZWZpbmVkLCB0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCh2YXJEZWNscywgdHMuTm9kZUZsYWdzLkNvbnN0KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHByZXNzaW9uTG93ZXJpbmdUcmFuc2Zvcm1GYWN0b3J5KFxuICAgIHJlcXVlc3RzTWFwOiBSZXF1ZXN0c01hcCwgcHJvZ3JhbTogdHMuUHJvZ3JhbSk6IChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpID0+XG4gICAgKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpID0+IHRzLlNvdXJjZUZpbGUge1xuICAvLyBSZXR1cm4gdGhlIGZhY3RvcnlcbiAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpID0+IChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuU291cmNlRmlsZSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgdGhlIG9yaWdpbmFsIFNvdXJjZUZpbGUgZm9yIHJlYWRpbmcgbWV0YWRhdGEsIGFuZCBub3QgdGhlIHRyYW5zZm9ybWVkIG9uZS5cbiAgICBjb25zdCBvcmlnaW5hbEZpbGUgPSBwcm9ncmFtLmdldFNvdXJjZUZpbGUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgaWYgKG9yaWdpbmFsRmlsZSkge1xuICAgICAgY29uc3QgcmVxdWVzdHMgPSByZXF1ZXN0c01hcC5nZXRSZXF1ZXN0cyhvcmlnaW5hbEZpbGUpO1xuICAgICAgaWYgKHJlcXVlc3RzICYmIHJlcXVlc3RzLnNpemUpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybVNvdXJjZUZpbGUoc291cmNlRmlsZSwgcmVxdWVzdHMsIGNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlRmlsZTtcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0c01hcCB7IGdldFJlcXVlc3RzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBSZXF1ZXN0TG9jYXRpb25NYXA7IH1cblxuaW50ZXJmYWNlIE1ldGFkYXRhQW5kTG93ZXJpbmdSZXF1ZXN0cyB7XG4gIG1ldGFkYXRhOiBNb2R1bGVNZXRhZGF0YXx1bmRlZmluZWQ7XG4gIHJlcXVlc3RzOiBSZXF1ZXN0TG9jYXRpb25NYXA7XG59XG5cbmZ1bmN0aW9uIGlzRWxpZ2libGVGb3JMb3dlcmluZyhub2RlOiB0cy5Ob2RlIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIGlmIChub2RlKSB7XG4gICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5Tb3VyY2VGaWxlOlxuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkRlY29yYXRvcjpcbiAgICAgICAgLy8gTG93ZXIgZXhwcmVzc2lvbnMgdGhhdCBhcmUgbG9jYWwgdG8gdGhlIG1vZHVsZSBzY29wZSBvclxuICAgICAgICAvLyBpbiBhIGRlY29yYXRvci5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbjpcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5JbnRlcmZhY2VEZWNsYXJhdGlvbjpcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5FbnVtRGVjbGFyYXRpb246XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbjpcbiAgICAgICAgLy8gRG9uJ3QgbG93ZXIgZXhwcmVzc2lvbnMgaW4gYSBkZWNsYXJhdGlvbi5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb246XG4gICAgICAgIGNvbnN0IGlzRXhwb3J0ZWQgPSAodHMuZ2V0Q29tYmluZWRNb2RpZmllckZsYWdzKG5vZGUgYXMgdHMuVmFyaWFibGVEZWNsYXJhdGlvbikgJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRzLk1vZGlmaWVyRmxhZ3MuRXhwb3J0KSA9PSAwO1xuICAgICAgICAvLyBUaGlzIG1pZ2h0IGJlIHVubmVjZXNzYXJ5LCBhcyB0aGUgdmFyaWFibGUgbWlnaHQgYmUgZXhwb3J0ZWQgYW5kIG9ubHkgdXNlZCBhcyBhIHJlZmVyZW5jZVxuICAgICAgICAvLyBpbiBhbm90aGVyIGV4cHJlc3Npb24uIEhvd2V2ZXIsIHRoZSB2YXJpYWJsZSBhbHNvIG1pZ2h0IGJlIGludm9sdmVkIGluIHByb3ZpZGVyXG4gICAgICAgIC8vIGRlZmluaXRpb25zLiBJZiB0aGF0J3MgdGhlIGNhc2UsIHRoZXJlIGlzIGEgc3BlY2lmaWMgdG9rZW4gKGBST1VURVNgKSB3aGljaCB0aGUgY29tcGlsZXJcbiAgICAgICAgLy8gYXR0ZW1wdHMgdG8gdW5kZXJzdGFuZCBkZWVwbHkuIFN1Yi1leHByZXNzaW9ucyB3aXRoaW4gdGhhdCB0b2tlbiAoYGxvYWRDaGlsZHJlbmAgZm9yXG4gICAgICAgIC8vIGV4YW1wbGUpIG1pZ2h0IGFsc28gcmVxdWlyZSBsb3dlcmluZyBldmVuIGlmIHRoZSB0b3AtbGV2ZWwgZGVjbGFyYXRpb24gaXMgYWxyZWFkeVxuICAgICAgICAvLyBwcm9wZXJseSBleHBvcnRlZC5cbiAgICAgICAgY29uc3QgdmFyTm9kZSA9IG5vZGUgYXMgdHMuVmFyaWFibGVEZWNsYXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIGlzRXhwb3J0ZWQgfHwgKHZhck5vZGUuaW5pdGlhbGl6ZXIgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24odmFyTm9kZS5pbml0aWFsaXplcikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24odmFyTm9kZS5pbml0aWFsaXplcikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5pc0NhbGxFeHByZXNzaW9uKHZhck5vZGUuaW5pdGlhbGl6ZXIpKSk7XG4gICAgfVxuICAgIHJldHVybiBpc0VsaWdpYmxlRm9yTG93ZXJpbmcobm9kZS5wYXJlbnQpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3QodmFsdWUpICE9PSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaXNSZXdyaXR0ZW4odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNNZXRhZGF0YUdsb2JhbFJlZmVyZW5jZUV4cHJlc3Npb24odmFsdWUpICYmIGlzTG93ZXJlZFN5bWJvbCh2YWx1ZS5uYW1lKTtcbn1cblxuZnVuY3Rpb24gaXNMaXRlcmFsRmllbGROYW1lZChub2RlOiB0cy5Ob2RlLCBuYW1lczogU2V0PHN0cmluZz4pOiBib29sZWFuIHtcbiAgaWYgKG5vZGUucGFyZW50ICYmIG5vZGUucGFyZW50LmtpbmQgPT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFzc2lnbm1lbnQpIHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IG5vZGUucGFyZW50IGFzIHRzLlByb3BlcnR5QXNzaWdubWVudDtcbiAgICBpZiAocHJvcGVydHkucGFyZW50ICYmIHByb3BlcnR5LnBhcmVudC5raW5kID09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24gJiZcbiAgICAgICAgcHJvcGVydHkubmFtZSAmJiBwcm9wZXJ0eS5uYW1lLmtpbmQgPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5uYW1lIGFzIHRzLklkZW50aWZpZXI7XG4gICAgICByZXR1cm4gbmFtZXMuaGFzKHByb3BlcnR5TmFtZS50ZXh0KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY2xhc3MgTG93ZXJNZXRhZGF0YVRyYW5zZm9ybSBpbXBsZW1lbnRzIFJlcXVlc3RzTWFwLCBNZXRhZGF0YVRyYW5zZm9ybWVyIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgY2FjaGUgITogTWV0YWRhdGFDYWNoZTtcbiAgcHJpdmF0ZSByZXF1ZXN0cyA9IG5ldyBNYXA8c3RyaW5nLCBSZXF1ZXN0TG9jYXRpb25NYXA+KCk7XG4gIHByaXZhdGUgbG93ZXJhYmxlRmllbGROYW1lczogU2V0PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IobG93ZXJhYmxlRmllbGROYW1lczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmxvd2VyYWJsZUZpZWxkTmFtZXMgPSBuZXcgU2V0PHN0cmluZz4obG93ZXJhYmxlRmllbGROYW1lcyk7XG4gIH1cblxuICAvLyBSZXF1ZXN0TWFwXG4gIGdldFJlcXVlc3RzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBSZXF1ZXN0TG9jYXRpb25NYXAge1xuICAgIGxldCByZXN1bHQgPSB0aGlzLnJlcXVlc3RzLmdldChzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgLy8gRm9yY2UgdGhlIG1ldGFkYXRhIGZvciB0aGlzIHNvdXJjZSBmaWxlIHRvIGJlIGNvbGxlY3RlZCB3aGljaFxuICAgICAgLy8gd2lsbCByZWN1cnNpdmVseSBjYWxsIHN0YXJ0KCkgcG9wdWxhdGluZyB0aGUgcmVxdWVzdCBtYXA7XG4gICAgICB0aGlzLmNhY2hlLmdldE1ldGFkYXRhKHNvdXJjZUZpbGUpO1xuXG4gICAgICAvLyBJZiB3ZSBzdGlsbCBkb24ndCBoYXZlIHRoZSByZXF1ZXN0ZWQgbWV0YWRhdGEsIHRoZSBmaWxlIGlzIG5vdCBhIG1vZHVsZVxuICAgICAgLy8gb3IgaXMgYSBkZWNsYXJhdGlvbiBmaWxlIHNvIHJldHVybiBhbiBlbXB0eSBtYXAuXG4gICAgICByZXN1bHQgPSB0aGlzLnJlcXVlc3RzLmdldChzb3VyY2VGaWxlLmZpbGVOYW1lKSB8fCBuZXcgTWFwPG51bWJlciwgTG93ZXJpbmdSZXF1ZXN0PigpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gTWV0YWRhdGFUcmFuc2Zvcm1lclxuICBjb25uZWN0KGNhY2hlOiBNZXRhZGF0YUNhY2hlKTogdm9pZCB7IHRoaXMuY2FjaGUgPSBjYWNoZTsgfVxuXG4gIHN0YXJ0KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBWYWx1ZVRyYW5zZm9ybXx1bmRlZmluZWQge1xuICAgIGxldCBpZGVudE51bWJlciA9IDA7XG4gICAgY29uc3QgZnJlc2hJZGVudCA9ICgpID0+IGNyZWF0ZUxvd2VyZWRTeW1ib2woaWRlbnROdW1iZXIrKyk7XG4gICAgY29uc3QgcmVxdWVzdHMgPSBuZXcgTWFwPG51bWJlciwgTG93ZXJpbmdSZXF1ZXN0PigpO1xuICAgIHRoaXMucmVxdWVzdHMuc2V0KHNvdXJjZUZpbGUuZmlsZU5hbWUsIHJlcXVlc3RzKTtcblxuICAgIGNvbnN0IHJlcGxhY2VOb2RlID0gKG5vZGU6IHRzLk5vZGUpID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBmcmVzaElkZW50KCk7XG4gICAgICByZXF1ZXN0cy5zZXQobm9kZS5wb3MsIHtuYW1lLCBraW5kOiBub2RlLmtpbmQsIGxvY2F0aW9uOiBub2RlLnBvcywgZW5kOiBub2RlLmVuZH0pO1xuICAgICAgcmV0dXJuIHtfX3N5bWJvbGljOiAncmVmZXJlbmNlJywgbmFtZX07XG4gICAgfTtcblxuICAgIGNvbnN0IGlzRXhwb3J0ZWRTeW1ib2wgPSAoKCkgPT4ge1xuICAgICAgbGV0IGV4cG9ydFRhYmxlOiBTZXQ8c3RyaW5nPjtcbiAgICAgIHJldHVybiAobm9kZTogdHMuTm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5raW5kID09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgICAgICAgIGNvbnN0IGlkZW50ID0gbm9kZSBhcyB0cy5JZGVudGlmaWVyO1xuXG4gICAgICAgICAgaWYgKCFleHBvcnRUYWJsZSkge1xuICAgICAgICAgICAgZXhwb3J0VGFibGUgPSBjcmVhdGVFeHBvcnRUYWJsZUZvcihzb3VyY2VGaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGV4cG9ydFRhYmxlLmhhcyhpZGVudC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBjb25zdCBpc0V4cG9ydGVkUHJvcGVydHlBY2Nlc3MgPSAobm9kZTogdHMuTm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgcGFlID0gbm9kZSBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gICAgICAgIGlmIChpc0V4cG9ydGVkU3ltYm9sKHBhZS5leHByZXNzaW9uKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhc0xvd2VyYWJsZVBhcmVudENhY2hlID0gbmV3IE1hcDx0cy5Ob2RlLCBib29sZWFuPigpO1xuXG4gICAgY29uc3Qgc2hvdWxkQmVMb3dlcmVkID0gKG5vZGU6IHRzLk5vZGUgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbGV0IGxvd2VyYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgaWYgKChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQXJyb3dGdW5jdGlvbiB8fFxuICAgICAgICAgICBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25FeHByZXNzaW9uKSAmJlxuICAgICAgICAgIGlzRWxpZ2libGVGb3JMb3dlcmluZyhub2RlKSkge1xuICAgICAgICBsb3dlcmFibGUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBpc0xpdGVyYWxGaWVsZE5hbWVkKG5vZGUsIHRoaXMubG93ZXJhYmxlRmllbGROYW1lcykgJiYgaXNFbGlnaWJsZUZvckxvd2VyaW5nKG5vZGUpICYmXG4gICAgICAgICAgIWlzRXhwb3J0ZWRTeW1ib2wobm9kZSkgJiYgIWlzRXhwb3J0ZWRQcm9wZXJ0eUFjY2Vzcyhub2RlKSkge1xuICAgICAgICBsb3dlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvd2VyYWJsZTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFzTG93ZXJhYmxlUGFyZW50ID0gKG5vZGU6IHRzLk5vZGUgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFoYXNMb3dlcmFibGVQYXJlbnRDYWNoZS5oYXMobm9kZSkpIHtcbiAgICAgICAgaGFzTG93ZXJhYmxlUGFyZW50Q2FjaGUuc2V0KFxuICAgICAgICAgICAgbm9kZSwgc2hvdWxkQmVMb3dlcmVkKG5vZGUucGFyZW50KSB8fCBoYXNMb3dlcmFibGVQYXJlbnQobm9kZS5wYXJlbnQpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNMb3dlcmFibGVQYXJlbnRDYWNoZS5nZXQobm9kZSkgITtcbiAgICB9O1xuXG4gICAgY29uc3QgaXNMb3dlcmFibGUgPSAobm9kZTogdHMuTm9kZSB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2hvdWxkQmVMb3dlcmVkKG5vZGUpICYmICFoYXNMb3dlcmFibGVQYXJlbnQobm9kZSk7XG4gICAgfTtcblxuICAgIHJldHVybiAodmFsdWU6IE1ldGFkYXRhVmFsdWUsIG5vZGU6IHRzLk5vZGUpOiBNZXRhZGF0YVZhbHVlID0+IHtcbiAgICAgIGlmICghaXNQcmltaXRpdmUodmFsdWUpICYmICFpc1Jld3JpdHRlbih2YWx1ZSkgJiYgaXNMb3dlcmFibGUobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VOb2RlKG5vZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRXhwb3J0VGFibGVGb3Ioc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgZXhwb3J0VGFibGUgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLy8gTGF6aWx5IGNvbGxlY3QgYWxsIHRoZSBleHBvcnRzIGZyb20gdGhlIHNvdXJjZSBmaWxlXG4gIHRzLmZvckVhY2hDaGlsZChzb3VyY2VGaWxlLCBmdW5jdGlvbiBzY2FuKG5vZGUpIHtcbiAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb246XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbjpcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5JbnRlcmZhY2VEZWNsYXJhdGlvbjpcbiAgICAgICAgaWYgKCh0cy5nZXRDb21iaW5lZE1vZGlmaWVyRmxhZ3Mobm9kZSBhcyB0cy5EZWNsYXJhdGlvbikgJiB0cy5Nb2RpZmllckZsYWdzLkV4cG9ydCkgIT0gMCkge1xuICAgICAgICAgIGNvbnN0IGNsYXNzRGVjbGFyYXRpb24gPVxuICAgICAgICAgICAgICBub2RlIGFzKHRzLkNsYXNzRGVjbGFyYXRpb24gfCB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uIHwgdHMuSW50ZXJmYWNlRGVjbGFyYXRpb24pO1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSBjbGFzc0RlY2xhcmF0aW9uLm5hbWU7XG4gICAgICAgICAgaWYgKG5hbWUpIGV4cG9ydFRhYmxlLmFkZChuYW1lLnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50OlxuICAgICAgICBjb25zdCB2YXJpYWJsZVN0YXRlbWVudCA9IG5vZGUgYXMgdHMuVmFyaWFibGVTdGF0ZW1lbnQ7XG4gICAgICAgIGZvciAoY29uc3QgZGVjbGFyYXRpb24gb2YgdmFyaWFibGVTdGF0ZW1lbnQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgIHNjYW4oZGVjbGFyYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb246XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb24gPSBub2RlIGFzIHRzLlZhcmlhYmxlRGVjbGFyYXRpb247XG4gICAgICAgIGlmICgodHMuZ2V0Q29tYmluZWRNb2RpZmllckZsYWdzKHZhcmlhYmxlRGVjbGFyYXRpb24pICYgdHMuTW9kaWZpZXJGbGFncy5FeHBvcnQpICE9IDAgJiZcbiAgICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZS5raW5kID09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSB2YXJpYWJsZURlY2xhcmF0aW9uLm5hbWUgYXMgdHMuSWRlbnRpZmllcjtcbiAgICAgICAgICBleHBvcnRUYWJsZS5hZGQobmFtZS50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5FeHBvcnREZWNsYXJhdGlvbjpcbiAgICAgICAgY29uc3QgZXhwb3J0RGVjbGFyYXRpb24gPSBub2RlIGFzIHRzLkV4cG9ydERlY2xhcmF0aW9uO1xuICAgICAgICBjb25zdCB7bW9kdWxlU3BlY2lmaWVyLCBleHBvcnRDbGF1c2V9ID0gZXhwb3J0RGVjbGFyYXRpb247XG4gICAgICAgIGlmICghbW9kdWxlU3BlY2lmaWVyICYmIGV4cG9ydENsYXVzZSkge1xuICAgICAgICAgIGV4cG9ydENsYXVzZS5lbGVtZW50cy5mb3JFYWNoKHNwZWMgPT4geyBleHBvcnRUYWJsZS5hZGQoc3BlYy5uYW1lLnRleHQpOyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBleHBvcnRUYWJsZTtcbn1cbiJdfQ==
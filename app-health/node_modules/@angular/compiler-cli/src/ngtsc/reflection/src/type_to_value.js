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
        define("@angular/compiler-cli/src/ngtsc/reflection/src/type_to_value", ["require", "exports", "tslib", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    /**
     * Potentially convert a `ts.TypeNode` to a `TypeValueReference`, which indicates how to use the
     * type given in the `ts.TypeNode` in a value position.
     *
     * This can return `null` if the `typeNode` is `null`, if it does not refer to a symbol with a value
     * declaration, or if it is not possible to statically understand.
     */
    function typeToValue(typeNode, checker) {
        // It's not possible to get a value expression if the parameter doesn't even have a type.
        if (typeNode === null || !ts.isTypeReferenceNode(typeNode)) {
            return null;
        }
        var symbols = resolveTypeSymbols(typeNode, checker);
        if (symbols === null) {
            return null;
        }
        var local = symbols.local, decl = symbols.decl;
        // It's only valid to convert a type reference to a value reference if the type actually
        // has a value declaration associated with it.
        if (decl.valueDeclaration === undefined) {
            return null;
        }
        // The type points to a valid value declaration. Rewrite the TypeReference into an
        // Expression which references the value pointed to by the TypeReference, if possible.
        // Look at the local `ts.Symbol`'s declarations and see if it comes from an import
        // statement. If so, extract the module specifier and the name of the imported type.
        var firstDecl = local.declarations && local.declarations[0];
        if (firstDecl && ts.isImportClause(firstDecl) && firstDecl.name !== undefined) {
            // This is a default import.
            return {
                local: true,
                // Copying the name here ensures the generated references will be correctly transformed along
                // with the import.
                expression: ts.updateIdentifier(firstDecl.name),
                defaultImportStatement: firstDecl.parent,
            };
        }
        else if (firstDecl && isImportSource(firstDecl)) {
            var origin_1 = extractModuleAndNameFromImport(firstDecl, symbols.importName);
            return tslib_1.__assign({ local: false, valueDeclaration: decl.valueDeclaration }, origin_1);
        }
        else {
            var expression = typeNodeToValueExpr(typeNode);
            if (expression !== null) {
                return {
                    local: true,
                    expression: expression,
                    defaultImportStatement: null,
                };
            }
            else {
                return null;
            }
        }
    }
    exports.typeToValue = typeToValue;
    /**
     * Attempt to extract a `ts.Expression` that's equivalent to a `ts.TypeNode`, as the two have
     * different AST shapes but can reference the same symbols.
     *
     * This will return `null` if an equivalent expression cannot be constructed.
     */
    function typeNodeToValueExpr(node) {
        if (ts.isTypeReferenceNode(node)) {
            return entityNameToValue(node.typeName);
        }
        else {
            return null;
        }
    }
    exports.typeNodeToValueExpr = typeNodeToValueExpr;
    /**
     * Resolve a `TypeReference` node to the `ts.Symbol`s for both its declaration and its local source.
     *
     * In the event that the `TypeReference` refers to a locally declared symbol, these will be the
     * same. If the `TypeReference` refers to an imported symbol, then `decl` will be the fully resolved
     * `ts.Symbol` of the referenced symbol. `local` will be the `ts.Symbol` of the `ts.Identifer` which
     * points to the import statement by which the symbol was imported.
     *
     * In the event `typeRef` refers to a default import, an `importName` will also be returned to
     * give the identifier name within the current file by which the import is known.
     */
    function resolveTypeSymbols(typeRef, checker) {
        var typeName = typeRef.typeName;
        // typeRefSymbol is the ts.Symbol of the entire type reference.
        var typeRefSymbol = checker.getSymbolAtLocation(typeName);
        if (typeRefSymbol === undefined) {
            return null;
        }
        // local is the ts.Symbol for the local ts.Identifier for the type.
        // If the type is actually locally declared or is imported by name, for example:
        //   import {Foo} from './foo';
        // then it'll be the same as top. If the type is imported via a namespace import, for example:
        //   import * as foo from './foo';
        // and then referenced as:
        //   constructor(f: foo.Foo)
        // then local will be the ts.Symbol of `foo`, whereas top will be the ts.Symbol of `foo.Foo`.
        // This allows tracking of the import behind whatever type reference exists.
        var local = typeRefSymbol;
        var importName = null;
        // TODO(alxhub): this is technically not correct. The user could have any import type with any
        // amount of qualification following the imported type:
        //
        // import * as foo from 'foo'
        // constructor(inject: foo.X.Y.Z)
        //
        // What we really want is the ability to express the arbitrary operation of `.X.Y.Z` on top of
        // whatever import we generate for 'foo'. This logic is sufficient for now, though.
        if (ts.isQualifiedName(typeName) && ts.isIdentifier(typeName.left) &&
            ts.isIdentifier(typeName.right)) {
            var localTmp = checker.getSymbolAtLocation(typeName.left);
            if (localTmp !== undefined) {
                local = localTmp;
                importName = typeName.right.text;
            }
        }
        // De-alias the top-level type reference symbol to get the symbol of the actual declaration.
        var decl = typeRefSymbol;
        if (typeRefSymbol.flags & ts.SymbolFlags.Alias) {
            decl = checker.getAliasedSymbol(typeRefSymbol);
        }
        return { local: local, decl: decl, importName: importName };
    }
    function entityNameToValue(node) {
        if (ts.isQualifiedName(node)) {
            var left = entityNameToValue(node.left);
            return left !== null ? ts.createPropertyAccess(left, node.right) : null;
        }
        else if (ts.isIdentifier(node)) {
            return ts.getMutableClone(node);
        }
        else {
            return null;
        }
    }
    function isImportSource(node) {
        return ts.isImportSpecifier(node) || ts.isNamespaceImport(node);
    }
    function extractModuleAndNameFromImport(node, localName) {
        var name;
        var moduleSpecifier;
        switch (node.kind) {
            case ts.SyntaxKind.ImportSpecifier:
                // The symbol was imported by name, in a ts.ImportSpecifier.
                name = (node.propertyName || node.name).text;
                moduleSpecifier = node.parent.parent.parent.moduleSpecifier;
                break;
            case ts.SyntaxKind.NamespaceImport:
                // The symbol was imported via a namespace import. In this case, the name to use when
                // importing it was extracted by resolveTypeSymbols.
                if (localName === null) {
                    // resolveTypeSymbols() should have extracted the correct local name for the import.
                    throw new Error("Debug failure: no local name provided for NamespaceImport");
                }
                name = localName;
                moduleSpecifier = node.parent.parent.moduleSpecifier;
                break;
            default:
                throw new Error("Unreachable: " + ts.SyntaxKind[node.kind]);
        }
        if (!ts.isStringLiteral(moduleSpecifier)) {
            throw new Error('not a module specifier');
        }
        var moduleName = moduleSpecifier.text;
        return { moduleName: moduleName, name: name };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV90b192YWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcmVmbGVjdGlvbi9zcmMvdHlwZV90b192YWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFJakM7Ozs7OztPQU1HO0lBQ0gsU0FBZ0IsV0FBVyxDQUN2QixRQUE0QixFQUFFLE9BQXVCO1FBQ3ZELHlGQUF5RjtRQUN6RixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDMUQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVNLElBQUEscUJBQUssRUFBRSxtQkFBSSxDQUFZO1FBQzlCLHdGQUF3RjtRQUN4Riw4Q0FBOEM7UUFDOUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxrRkFBa0Y7UUFDbEYsc0ZBQXNGO1FBRXRGLGtGQUFrRjtRQUNsRixvRkFBb0Y7UUFDcEYsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlELElBQUksU0FBUyxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDN0UsNEJBQTRCO1lBQzVCLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsNkZBQTZGO2dCQUM3RixtQkFBbUI7Z0JBQ25CLFVBQVUsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDL0Msc0JBQXNCLEVBQUUsU0FBUyxDQUFDLE1BQU07YUFDekMsQ0FBQztTQUNIO2FBQU0sSUFBSSxTQUFTLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pELElBQU0sUUFBTSxHQUFHLDhCQUE4QixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0UsMEJBQVEsS0FBSyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLElBQUssUUFBTSxFQUFFO1NBQzNFO2FBQU07WUFDTCxJQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZCLE9BQU87b0JBQ0wsS0FBSyxFQUFFLElBQUk7b0JBQ1gsVUFBVSxZQUFBO29CQUNWLHNCQUFzQixFQUFFLElBQUk7aUJBQzdCLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7SUFDSCxDQUFDO0lBbERELGtDQWtEQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsSUFBaUI7UUFDbkQsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEMsT0FBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDekM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBTkQsa0RBTUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxPQUE2QixFQUFFLE9BQXVCO1FBRWhGLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDbEMsK0RBQStEO1FBQy9ELElBQU0sYUFBYSxHQUF3QixPQUFPLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakYsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxtRUFBbUU7UUFDbkUsZ0ZBQWdGO1FBQ2hGLCtCQUErQjtRQUMvQiw4RkFBOEY7UUFDOUYsa0NBQWtDO1FBQ2xDLDBCQUEwQjtRQUMxQiw0QkFBNEI7UUFDNUIsNkZBQTZGO1FBQzdGLDRFQUE0RTtRQUM1RSxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUM7UUFDMUIsSUFBSSxVQUFVLEdBQWdCLElBQUksQ0FBQztRQUVuQyw4RkFBOEY7UUFDOUYsdURBQXVEO1FBQ3ZELEVBQUU7UUFDRiw2QkFBNkI7UUFDN0IsaUNBQWlDO1FBQ2pDLEVBQUU7UUFDRiw4RkFBOEY7UUFDOUYsbUZBQW1GO1FBQ25GLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDOUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RCxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQzFCLEtBQUssR0FBRyxRQUFRLENBQUM7Z0JBQ2pCLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzthQUNsQztTQUNGO1FBRUQsNEZBQTRGO1FBQzVGLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQztRQUN6QixJQUFJLGFBQWEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDOUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sRUFBQyxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxVQUFVLFlBQUEsRUFBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxTQUFTLGlCQUFpQixDQUFDLElBQW1CO1FBQzVDLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixJQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ3pFO2FBQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUFvQjtRQUMxQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELFNBQVMsOEJBQThCLENBQ25DLElBQStELEVBQy9ELFNBQXdCO1FBQzFCLElBQUksSUFBWSxDQUFDO1FBQ2pCLElBQUksZUFBOEIsQ0FBQztRQUNuQyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWU7Z0JBQ2hDLDREQUE0RDtnQkFDNUQsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztnQkFDNUQsTUFBTTtZQUNSLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlO2dCQUNoQyxxRkFBcUY7Z0JBQ3JGLG9EQUFvRDtnQkFDcEQsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO29CQUN0QixvRkFBb0Y7b0JBQ3BGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztpQkFDOUU7Z0JBQ0QsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDakIsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztnQkFDckQsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWdCLEVBQUUsQ0FBQyxVQUFVLENBQUUsSUFBZ0IsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1NBQzVFO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQztRQUN4QyxPQUFPLEVBQUMsVUFBVSxZQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztJQUM1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtUeXBlVmFsdWVSZWZlcmVuY2V9IGZyb20gJy4vaG9zdCc7XG5cbi8qKlxuICogUG90ZW50aWFsbHkgY29udmVydCBhIGB0cy5UeXBlTm9kZWAgdG8gYSBgVHlwZVZhbHVlUmVmZXJlbmNlYCwgd2hpY2ggaW5kaWNhdGVzIGhvdyB0byB1c2UgdGhlXG4gKiB0eXBlIGdpdmVuIGluIHRoZSBgdHMuVHlwZU5vZGVgIGluIGEgdmFsdWUgcG9zaXRpb24uXG4gKlxuICogVGhpcyBjYW4gcmV0dXJuIGBudWxsYCBpZiB0aGUgYHR5cGVOb2RlYCBpcyBgbnVsbGAsIGlmIGl0IGRvZXMgbm90IHJlZmVyIHRvIGEgc3ltYm9sIHdpdGggYSB2YWx1ZVxuICogZGVjbGFyYXRpb24sIG9yIGlmIGl0IGlzIG5vdCBwb3NzaWJsZSB0byBzdGF0aWNhbGx5IHVuZGVyc3RhbmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlVG9WYWx1ZShcbiAgICB0eXBlTm9kZTogdHMuVHlwZU5vZGUgfCBudWxsLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IFR5cGVWYWx1ZVJlZmVyZW5jZXxudWxsIHtcbiAgLy8gSXQncyBub3QgcG9zc2libGUgdG8gZ2V0IGEgdmFsdWUgZXhwcmVzc2lvbiBpZiB0aGUgcGFyYW1ldGVyIGRvZXNuJ3QgZXZlbiBoYXZlIGEgdHlwZS5cbiAgaWYgKHR5cGVOb2RlID09PSBudWxsIHx8ICF0cy5pc1R5cGVSZWZlcmVuY2VOb2RlKHR5cGVOb2RlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qgc3ltYm9scyA9IHJlc29sdmVUeXBlU3ltYm9scyh0eXBlTm9kZSwgY2hlY2tlcik7XG4gIGlmIChzeW1ib2xzID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7bG9jYWwsIGRlY2x9ID0gc3ltYm9scztcbiAgLy8gSXQncyBvbmx5IHZhbGlkIHRvIGNvbnZlcnQgYSB0eXBlIHJlZmVyZW5jZSB0byBhIHZhbHVlIHJlZmVyZW5jZSBpZiB0aGUgdHlwZSBhY3R1YWxseVxuICAvLyBoYXMgYSB2YWx1ZSBkZWNsYXJhdGlvbiBhc3NvY2lhdGVkIHdpdGggaXQuXG4gIGlmIChkZWNsLnZhbHVlRGVjbGFyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gVGhlIHR5cGUgcG9pbnRzIHRvIGEgdmFsaWQgdmFsdWUgZGVjbGFyYXRpb24uIFJld3JpdGUgdGhlIFR5cGVSZWZlcmVuY2UgaW50byBhblxuICAvLyBFeHByZXNzaW9uIHdoaWNoIHJlZmVyZW5jZXMgdGhlIHZhbHVlIHBvaW50ZWQgdG8gYnkgdGhlIFR5cGVSZWZlcmVuY2UsIGlmIHBvc3NpYmxlLlxuXG4gIC8vIExvb2sgYXQgdGhlIGxvY2FsIGB0cy5TeW1ib2xgJ3MgZGVjbGFyYXRpb25zIGFuZCBzZWUgaWYgaXQgY29tZXMgZnJvbSBhbiBpbXBvcnRcbiAgLy8gc3RhdGVtZW50LiBJZiBzbywgZXh0cmFjdCB0aGUgbW9kdWxlIHNwZWNpZmllciBhbmQgdGhlIG5hbWUgb2YgdGhlIGltcG9ydGVkIHR5cGUuXG4gIGNvbnN0IGZpcnN0RGVjbCA9IGxvY2FsLmRlY2xhcmF0aW9ucyAmJiBsb2NhbC5kZWNsYXJhdGlvbnNbMF07XG5cbiAgaWYgKGZpcnN0RGVjbCAmJiB0cy5pc0ltcG9ydENsYXVzZShmaXJzdERlY2wpICYmIGZpcnN0RGVjbC5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBUaGlzIGlzIGEgZGVmYXVsdCBpbXBvcnQuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxvY2FsOiB0cnVlLFxuICAgICAgLy8gQ29weWluZyB0aGUgbmFtZSBoZXJlIGVuc3VyZXMgdGhlIGdlbmVyYXRlZCByZWZlcmVuY2VzIHdpbGwgYmUgY29ycmVjdGx5IHRyYW5zZm9ybWVkIGFsb25nXG4gICAgICAvLyB3aXRoIHRoZSBpbXBvcnQuXG4gICAgICBleHByZXNzaW9uOiB0cy51cGRhdGVJZGVudGlmaWVyKGZpcnN0RGVjbC5uYW1lKSxcbiAgICAgIGRlZmF1bHRJbXBvcnRTdGF0ZW1lbnQ6IGZpcnN0RGVjbC5wYXJlbnQsXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaXJzdERlY2wgJiYgaXNJbXBvcnRTb3VyY2UoZmlyc3REZWNsKSkge1xuICAgIGNvbnN0IG9yaWdpbiA9IGV4dHJhY3RNb2R1bGVBbmROYW1lRnJvbUltcG9ydChmaXJzdERlY2wsIHN5bWJvbHMuaW1wb3J0TmFtZSk7XG4gICAgcmV0dXJuIHtsb2NhbDogZmFsc2UsIHZhbHVlRGVjbGFyYXRpb246IGRlY2wudmFsdWVEZWNsYXJhdGlvbiwgLi4ub3JpZ2lufTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBleHByZXNzaW9uID0gdHlwZU5vZGVUb1ZhbHVlRXhwcih0eXBlTm9kZSk7XG4gICAgaWYgKGV4cHJlc3Npb24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxvY2FsOiB0cnVlLFxuICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICBkZWZhdWx0SW1wb3J0U3RhdGVtZW50OiBudWxsLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBleHRyYWN0IGEgYHRzLkV4cHJlc3Npb25gIHRoYXQncyBlcXVpdmFsZW50IHRvIGEgYHRzLlR5cGVOb2RlYCwgYXMgdGhlIHR3byBoYXZlXG4gKiBkaWZmZXJlbnQgQVNUIHNoYXBlcyBidXQgY2FuIHJlZmVyZW5jZSB0aGUgc2FtZSBzeW1ib2xzLlxuICpcbiAqIFRoaXMgd2lsbCByZXR1cm4gYG51bGxgIGlmIGFuIGVxdWl2YWxlbnQgZXhwcmVzc2lvbiBjYW5ub3QgYmUgY29uc3RydWN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlTm9kZVRvVmFsdWVFeHByKG5vZGU6IHRzLlR5cGVOb2RlKTogdHMuRXhwcmVzc2lvbnxudWxsIHtcbiAgaWYgKHRzLmlzVHlwZVJlZmVyZW5jZU5vZGUobm9kZSkpIHtcbiAgICByZXR1cm4gZW50aXR5TmFtZVRvVmFsdWUobm9kZS50eXBlTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgYFR5cGVSZWZlcmVuY2VgIG5vZGUgdG8gdGhlIGB0cy5TeW1ib2xgcyBmb3IgYm90aCBpdHMgZGVjbGFyYXRpb24gYW5kIGl0cyBsb2NhbCBzb3VyY2UuXG4gKlxuICogSW4gdGhlIGV2ZW50IHRoYXQgdGhlIGBUeXBlUmVmZXJlbmNlYCByZWZlcnMgdG8gYSBsb2NhbGx5IGRlY2xhcmVkIHN5bWJvbCwgdGhlc2Ugd2lsbCBiZSB0aGVcbiAqIHNhbWUuIElmIHRoZSBgVHlwZVJlZmVyZW5jZWAgcmVmZXJzIHRvIGFuIGltcG9ydGVkIHN5bWJvbCwgdGhlbiBgZGVjbGAgd2lsbCBiZSB0aGUgZnVsbHkgcmVzb2x2ZWRcbiAqIGB0cy5TeW1ib2xgIG9mIHRoZSByZWZlcmVuY2VkIHN5bWJvbC4gYGxvY2FsYCB3aWxsIGJlIHRoZSBgdHMuU3ltYm9sYCBvZiB0aGUgYHRzLklkZW50aWZlcmAgd2hpY2hcbiAqIHBvaW50cyB0byB0aGUgaW1wb3J0IHN0YXRlbWVudCBieSB3aGljaCB0aGUgc3ltYm9sIHdhcyBpbXBvcnRlZC5cbiAqXG4gKiBJbiB0aGUgZXZlbnQgYHR5cGVSZWZgIHJlZmVycyB0byBhIGRlZmF1bHQgaW1wb3J0LCBhbiBgaW1wb3J0TmFtZWAgd2lsbCBhbHNvIGJlIHJldHVybmVkIHRvXG4gKiBnaXZlIHRoZSBpZGVudGlmaWVyIG5hbWUgd2l0aGluIHRoZSBjdXJyZW50IGZpbGUgYnkgd2hpY2ggdGhlIGltcG9ydCBpcyBrbm93bi5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZVR5cGVTeW1ib2xzKHR5cGVSZWY6IHRzLlR5cGVSZWZlcmVuY2VOb2RlLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6XG4gICAge2xvY2FsOiB0cy5TeW1ib2wsIGRlY2w6IHRzLlN5bWJvbCwgaW1wb3J0TmFtZTogc3RyaW5nIHwgbnVsbH18bnVsbCB7XG4gIGNvbnN0IHR5cGVOYW1lID0gdHlwZVJlZi50eXBlTmFtZTtcbiAgLy8gdHlwZVJlZlN5bWJvbCBpcyB0aGUgdHMuU3ltYm9sIG9mIHRoZSBlbnRpcmUgdHlwZSByZWZlcmVuY2UuXG4gIGNvbnN0IHR5cGVSZWZTeW1ib2w6IHRzLlN5bWJvbHx1bmRlZmluZWQgPSBjaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24odHlwZU5hbWUpO1xuICBpZiAodHlwZVJlZlN5bWJvbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBsb2NhbCBpcyB0aGUgdHMuU3ltYm9sIGZvciB0aGUgbG9jYWwgdHMuSWRlbnRpZmllciBmb3IgdGhlIHR5cGUuXG4gIC8vIElmIHRoZSB0eXBlIGlzIGFjdHVhbGx5IGxvY2FsbHkgZGVjbGFyZWQgb3IgaXMgaW1wb3J0ZWQgYnkgbmFtZSwgZm9yIGV4YW1wbGU6XG4gIC8vICAgaW1wb3J0IHtGb299IGZyb20gJy4vZm9vJztcbiAgLy8gdGhlbiBpdCdsbCBiZSB0aGUgc2FtZSBhcyB0b3AuIElmIHRoZSB0eXBlIGlzIGltcG9ydGVkIHZpYSBhIG5hbWVzcGFjZSBpbXBvcnQsIGZvciBleGFtcGxlOlxuICAvLyAgIGltcG9ydCAqIGFzIGZvbyBmcm9tICcuL2Zvbyc7XG4gIC8vIGFuZCB0aGVuIHJlZmVyZW5jZWQgYXM6XG4gIC8vICAgY29uc3RydWN0b3IoZjogZm9vLkZvbylcbiAgLy8gdGhlbiBsb2NhbCB3aWxsIGJlIHRoZSB0cy5TeW1ib2wgb2YgYGZvb2AsIHdoZXJlYXMgdG9wIHdpbGwgYmUgdGhlIHRzLlN5bWJvbCBvZiBgZm9vLkZvb2AuXG4gIC8vIFRoaXMgYWxsb3dzIHRyYWNraW5nIG9mIHRoZSBpbXBvcnQgYmVoaW5kIHdoYXRldmVyIHR5cGUgcmVmZXJlbmNlIGV4aXN0cy5cbiAgbGV0IGxvY2FsID0gdHlwZVJlZlN5bWJvbDtcbiAgbGV0IGltcG9ydE5hbWU6IHN0cmluZ3xudWxsID0gbnVsbDtcblxuICAvLyBUT0RPKGFseGh1Yik6IHRoaXMgaXMgdGVjaG5pY2FsbHkgbm90IGNvcnJlY3QuIFRoZSB1c2VyIGNvdWxkIGhhdmUgYW55IGltcG9ydCB0eXBlIHdpdGggYW55XG4gIC8vIGFtb3VudCBvZiBxdWFsaWZpY2F0aW9uIGZvbGxvd2luZyB0aGUgaW1wb3J0ZWQgdHlwZTpcbiAgLy9cbiAgLy8gaW1wb3J0ICogYXMgZm9vIGZyb20gJ2ZvbydcbiAgLy8gY29uc3RydWN0b3IoaW5qZWN0OiBmb28uWC5ZLlopXG4gIC8vXG4gIC8vIFdoYXQgd2UgcmVhbGx5IHdhbnQgaXMgdGhlIGFiaWxpdHkgdG8gZXhwcmVzcyB0aGUgYXJiaXRyYXJ5IG9wZXJhdGlvbiBvZiBgLlguWS5aYCBvbiB0b3Agb2ZcbiAgLy8gd2hhdGV2ZXIgaW1wb3J0IHdlIGdlbmVyYXRlIGZvciAnZm9vJy4gVGhpcyBsb2dpYyBpcyBzdWZmaWNpZW50IGZvciBub3csIHRob3VnaC5cbiAgaWYgKHRzLmlzUXVhbGlmaWVkTmFtZSh0eXBlTmFtZSkgJiYgdHMuaXNJZGVudGlmaWVyKHR5cGVOYW1lLmxlZnQpICYmXG4gICAgICB0cy5pc0lkZW50aWZpZXIodHlwZU5hbWUucmlnaHQpKSB7XG4gICAgY29uc3QgbG9jYWxUbXAgPSBjaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24odHlwZU5hbWUubGVmdCk7XG4gICAgaWYgKGxvY2FsVG1wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxvY2FsID0gbG9jYWxUbXA7XG4gICAgICBpbXBvcnROYW1lID0gdHlwZU5hbWUucmlnaHQudGV4dDtcbiAgICB9XG4gIH1cblxuICAvLyBEZS1hbGlhcyB0aGUgdG9wLWxldmVsIHR5cGUgcmVmZXJlbmNlIHN5bWJvbCB0byBnZXQgdGhlIHN5bWJvbCBvZiB0aGUgYWN0dWFsIGRlY2xhcmF0aW9uLlxuICBsZXQgZGVjbCA9IHR5cGVSZWZTeW1ib2w7XG4gIGlmICh0eXBlUmVmU3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpIHtcbiAgICBkZWNsID0gY2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHR5cGVSZWZTeW1ib2wpO1xuICB9XG4gIHJldHVybiB7bG9jYWwsIGRlY2wsIGltcG9ydE5hbWV9O1xufVxuXG5mdW5jdGlvbiBlbnRpdHlOYW1lVG9WYWx1ZShub2RlOiB0cy5FbnRpdHlOYW1lKTogdHMuRXhwcmVzc2lvbnxudWxsIHtcbiAgaWYgKHRzLmlzUXVhbGlmaWVkTmFtZShub2RlKSkge1xuICAgIGNvbnN0IGxlZnQgPSBlbnRpdHlOYW1lVG9WYWx1ZShub2RlLmxlZnQpO1xuICAgIHJldHVybiBsZWZ0ICE9PSBudWxsID8gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MobGVmdCwgbm9kZS5yaWdodCkgOiBudWxsO1xuICB9IGVsc2UgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgIHJldHVybiB0cy5nZXRNdXRhYmxlQ2xvbmUobm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNJbXBvcnRTb3VyY2Uobm9kZTogdHMuRGVjbGFyYXRpb24pOiBub2RlIGlzKHRzLkltcG9ydFNwZWNpZmllciB8IHRzLk5hbWVzcGFjZUltcG9ydCkge1xuICByZXR1cm4gdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZSkgfHwgdHMuaXNOYW1lc3BhY2VJbXBvcnQobm9kZSk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RNb2R1bGVBbmROYW1lRnJvbUltcG9ydChcbiAgICBub2RlOiB0cy5JbXBvcnRTcGVjaWZpZXIgfCB0cy5OYW1lc3BhY2VJbXBvcnQgfCB0cy5JbXBvcnRDbGF1c2UsXG4gICAgbG9jYWxOYW1lOiBzdHJpbmcgfCBudWxsKToge25hbWU6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nfSB7XG4gIGxldCBuYW1lOiBzdHJpbmc7XG4gIGxldCBtb2R1bGVTcGVjaWZpZXI6IHRzLkV4cHJlc3Npb247XG4gIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLkltcG9ydFNwZWNpZmllcjpcbiAgICAgIC8vIFRoZSBzeW1ib2wgd2FzIGltcG9ydGVkIGJ5IG5hbWUsIGluIGEgdHMuSW1wb3J0U3BlY2lmaWVyLlxuICAgICAgbmFtZSA9IChub2RlLnByb3BlcnR5TmFtZSB8fCBub2RlLm5hbWUpLnRleHQ7XG4gICAgICBtb2R1bGVTcGVjaWZpZXIgPSBub2RlLnBhcmVudC5wYXJlbnQucGFyZW50Lm1vZHVsZVNwZWNpZmllcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5OYW1lc3BhY2VJbXBvcnQ6XG4gICAgICAvLyBUaGUgc3ltYm9sIHdhcyBpbXBvcnRlZCB2aWEgYSBuYW1lc3BhY2UgaW1wb3J0LiBJbiB0aGlzIGNhc2UsIHRoZSBuYW1lIHRvIHVzZSB3aGVuXG4gICAgICAvLyBpbXBvcnRpbmcgaXQgd2FzIGV4dHJhY3RlZCBieSByZXNvbHZlVHlwZVN5bWJvbHMuXG4gICAgICBpZiAobG9jYWxOYW1lID09PSBudWxsKSB7XG4gICAgICAgIC8vIHJlc29sdmVUeXBlU3ltYm9scygpIHNob3VsZCBoYXZlIGV4dHJhY3RlZCB0aGUgY29ycmVjdCBsb2NhbCBuYW1lIGZvciB0aGUgaW1wb3J0LlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERlYnVnIGZhaWx1cmU6IG5vIGxvY2FsIG5hbWUgcHJvdmlkZWQgZm9yIE5hbWVzcGFjZUltcG9ydGApO1xuICAgICAgfVxuICAgICAgbmFtZSA9IGxvY2FsTmFtZTtcbiAgICAgIG1vZHVsZVNwZWNpZmllciA9IG5vZGUucGFyZW50LnBhcmVudC5tb2R1bGVTcGVjaWZpZXI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlYWNoYWJsZTogJHt0cy5TeW50YXhLaW5kWyhub2RlIGFzIHRzLk5vZGUpLmtpbmRdfWApO1xuICB9XG5cbiAgaWYgKCF0cy5pc1N0cmluZ0xpdGVyYWwobW9kdWxlU3BlY2lmaWVyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGEgbW9kdWxlIHNwZWNpZmllcicpO1xuICB9XG4gIGNvbnN0IG1vZHVsZU5hbWUgPSBtb2R1bGVTcGVjaWZpZXIudGV4dDtcbiAgcmV0dXJuIHttb2R1bGVOYW1lLCBuYW1lfTtcbn1cbiJdfQ==
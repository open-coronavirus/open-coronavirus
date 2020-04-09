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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util", ["require", "exports", "tslib", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    function tsCastToAny(expr) {
        return ts.createParen(ts.createAsExpression(expr, ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)));
    }
    exports.tsCastToAny = tsCastToAny;
    /**
     * Create an expression which instantiates an element by its HTML tagName.
     *
     * Thanks to narrowing of `document.createElement()`, this expression will have its type inferred
     * based on the tag name, including for custom elements that have appropriate .d.ts definitions.
     */
    function tsCreateElement(tagName) {
        var createElement = ts.createPropertyAccess(
        /* expression */ ts.createIdentifier('document'), 'createElement');
        return ts.createCall(
        /* expression */ createElement, 
        /* typeArguments */ undefined, 
        /* argumentsArray */ [ts.createLiteral(tagName)]);
    }
    exports.tsCreateElement = tsCreateElement;
    /**
     * Create a `ts.VariableStatement` which declares a variable without explicit initialization.
     *
     * The initializer `null!` is used to bypass strict variable initialization checks.
     *
     * Unlike with `tsCreateVariable`, the type of the variable is explicitly specified.
     */
    function tsDeclareVariable(id, type) {
        var decl = ts.createVariableDeclaration(
        /* name */ id, 
        /* type */ type, 
        /* initializer */ ts.createNonNullExpression(ts.createNull()));
        return ts.createVariableStatement(
        /* modifiers */ undefined, 
        /* declarationList */ [decl]);
    }
    exports.tsDeclareVariable = tsDeclareVariable;
    /**
     * Create a `ts.VariableStatement` that initializes a variable with a given expression.
     *
     * Unlike with `tsDeclareVariable`, the type of the variable is inferred from the initializer
     * expression.
     */
    function tsCreateVariable(id, initializer) {
        var decl = ts.createVariableDeclaration(
        /* name */ id, 
        /* type */ undefined, 
        /* initializer */ initializer);
        return ts.createVariableStatement(
        /* modifiers */ undefined, 
        /* declarationList */ [decl]);
    }
    exports.tsCreateVariable = tsCreateVariable;
    /**
     * Construct a `ts.CallExpression` that calls a method on a receiver.
     */
    function tsCallMethod(receiver, methodName, args) {
        if (args === void 0) { args = []; }
        var methodAccess = ts.createPropertyAccess(receiver, methodName);
        return ts.createCall(
        /* expression */ methodAccess, 
        /* typeArguments */ undefined, 
        /* argumentsArray */ args);
    }
    exports.tsCallMethod = tsCallMethod;
    function checkIfClassIsExported(node) {
        // A class is exported if one of two conditions is met:
        // 1) it has the 'export' modifier.
        // 2) it's declared at the top level, and there is an export statement for the class.
        if (node.modifiers !== undefined &&
            node.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.ExportKeyword; })) {
            // Condition 1 is true, the class has an 'export' keyword attached.
            return true;
        }
        else if (node.parent !== undefined && ts.isSourceFile(node.parent) &&
            checkIfFileHasExport(node.parent, node.name.text)) {
            // Condition 2 is true, the class is exported via an 'export {}' statement.
            return true;
        }
        return false;
    }
    exports.checkIfClassIsExported = checkIfClassIsExported;
    function checkIfFileHasExport(sf, name) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = tslib_1.__values(sf.statements), _d = _c.next(); !_d.done; _d = _c.next()) {
                var stmt = _d.value;
                if (ts.isExportDeclaration(stmt) && stmt.exportClause !== undefined) {
                    try {
                        for (var _e = (e_2 = void 0, tslib_1.__values(stmt.exportClause.elements)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var element = _f.value;
                            if (element.propertyName === undefined && element.name.text === name) {
                                // The named declaration is directly exported.
                                return true;
                            }
                            else if (element.propertyName !== undefined && element.propertyName.text == name) {
                                // The named declaration is exported via an alias.
                                return true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
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
        return false;
    }
    function checkIfGenericTypesAreUnbound(node) {
        if (node.typeParameters === undefined) {
            return true;
        }
        return node.typeParameters.every(function (param) { return param.constraint === undefined; });
    }
    exports.checkIfGenericTypesAreUnbound = checkIfGenericTypesAreUnbound;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy90c191dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUdqQyxTQUFnQixXQUFXLENBQUMsSUFBbUI7UUFDN0MsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUNqQixFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBSEQsa0NBR0M7SUFHRDs7Ozs7T0FLRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxPQUFlO1FBQzdDLElBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0I7UUFDekMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sRUFBRSxDQUFDLFVBQVU7UUFDaEIsZ0JBQWdCLENBQUMsYUFBYTtRQUM5QixtQkFBbUIsQ0FBQyxTQUFTO1FBQzdCLG9CQUFvQixDQUFBLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQVBELDBDQU9DO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsRUFBaUIsRUFBRSxJQUFpQjtRQUNwRSxJQUFNLElBQUksR0FBRyxFQUFFLENBQUMseUJBQXlCO1FBQ3JDLFVBQVUsQ0FBQyxFQUFFO1FBQ2IsVUFBVSxDQUFDLElBQUk7UUFDZixpQkFBaUIsQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENB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Qiw2QkFBNkIsQ0FBQyxJQUEyQztRQUV2RixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQTlCLENBQThCLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBTkQsc0VBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9ufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHRzQ2FzdFRvQW55KGV4cHI6IHRzLkV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9uIHtcbiAgcmV0dXJuIHRzLmNyZWF0ZVBhcmVuKFxuICAgICAgdHMuY3JlYXRlQXNFeHByZXNzaW9uKGV4cHIsIHRzLmNyZWF0ZUtleXdvcmRUeXBlTm9kZSh0cy5TeW50YXhLaW5kLkFueUtleXdvcmQpKSk7XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYW4gZXhwcmVzc2lvbiB3aGljaCBpbnN0YW50aWF0ZXMgYW4gZWxlbWVudCBieSBpdHMgSFRNTCB0YWdOYW1lLlxuICpcbiAqIFRoYW5rcyB0byBuYXJyb3dpbmcgb2YgYGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoKWAsIHRoaXMgZXhwcmVzc2lvbiB3aWxsIGhhdmUgaXRzIHR5cGUgaW5mZXJyZWRcbiAqIGJhc2VkIG9uIHRoZSB0YWcgbmFtZSwgaW5jbHVkaW5nIGZvciBjdXN0b20gZWxlbWVudHMgdGhhdCBoYXZlIGFwcHJvcHJpYXRlIC5kLnRzIGRlZmluaXRpb25zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHNDcmVhdGVFbGVtZW50KHRhZ05hbWU6IHN0cmluZyk6IHRzLkV4cHJlc3Npb24ge1xuICBjb25zdCBjcmVhdGVFbGVtZW50ID0gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MoXG4gICAgICAvKiBleHByZXNzaW9uICovIHRzLmNyZWF0ZUlkZW50aWZpZXIoJ2RvY3VtZW50JyksICdjcmVhdGVFbGVtZW50Jyk7XG4gIHJldHVybiB0cy5jcmVhdGVDYWxsKFxuICAgICAgLyogZXhwcmVzc2lvbiAqLyBjcmVhdGVFbGVtZW50LFxuICAgICAgLyogdHlwZUFyZ3VtZW50cyAqLyB1bmRlZmluZWQsXG4gICAgICAvKiBhcmd1bWVudHNBcnJheSAqL1t0cy5jcmVhdGVMaXRlcmFsKHRhZ05hbWUpXSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYHRzLlZhcmlhYmxlU3RhdGVtZW50YCB3aGljaCBkZWNsYXJlcyBhIHZhcmlhYmxlIHdpdGhvdXQgZXhwbGljaXQgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogVGhlIGluaXRpYWxpemVyIGBudWxsIWAgaXMgdXNlZCB0byBieXBhc3Mgc3RyaWN0IHZhcmlhYmxlIGluaXRpYWxpemF0aW9uIGNoZWNrcy5cbiAqXG4gKiBVbmxpa2Ugd2l0aCBgdHNDcmVhdGVWYXJpYWJsZWAsIHRoZSB0eXBlIG9mIHRoZSB2YXJpYWJsZSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRzRGVjbGFyZVZhcmlhYmxlKGlkOiB0cy5JZGVudGlmaWVyLCB0eXBlOiB0cy5UeXBlTm9kZSk6IHRzLlZhcmlhYmxlU3RhdGVtZW50IHtcbiAgY29uc3QgZGVjbCA9IHRzLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAvKiBuYW1lICovIGlkLFxuICAgICAgLyogdHlwZSAqLyB0eXBlLFxuICAgICAgLyogaW5pdGlhbGl6ZXIgKi8gdHMuY3JlYXRlTm9uTnVsbEV4cHJlc3Npb24odHMuY3JlYXRlTnVsbCgpKSk7XG4gIHJldHVybiB0cy5jcmVhdGVWYXJpYWJsZVN0YXRlbWVudChcbiAgICAgIC8qIG1vZGlmaWVycyAqLyB1bmRlZmluZWQsXG4gICAgICAvKiBkZWNsYXJhdGlvbkxpc3QgKi9bZGVjbF0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGB0cy5WYXJpYWJsZVN0YXRlbWVudGAgdGhhdCBpbml0aWFsaXplcyBhIHZhcmlhYmxlIHdpdGggYSBnaXZlbiBleHByZXNzaW9uLlxuICpcbiAqIFVubGlrZSB3aXRoIGB0c0RlY2xhcmVWYXJpYWJsZWAsIHRoZSB0eXBlIG9mIHRoZSB2YXJpYWJsZSBpcyBpbmZlcnJlZCBmcm9tIHRoZSBpbml0aWFsaXplclxuICogZXhwcmVzc2lvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRzQ3JlYXRlVmFyaWFibGUoXG4gICAgaWQ6IHRzLklkZW50aWZpZXIsIGluaXRpYWxpemVyOiB0cy5FeHByZXNzaW9uKTogdHMuVmFyaWFibGVTdGF0ZW1lbnQge1xuICBjb25zdCBkZWNsID0gdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgIC8qIG5hbWUgKi8gaWQsXG4gICAgICAvKiB0eXBlICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIGluaXRpYWxpemVyICovIGluaXRpYWxpemVyKTtcbiAgcmV0dXJuIHRzLmNyZWF0ZVZhcmlhYmxlU3RhdGVtZW50KFxuICAgICAgLyogbW9kaWZpZXJzICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIGRlY2xhcmF0aW9uTGlzdCAqL1tkZWNsXSk7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGEgYHRzLkNhbGxFeHByZXNzaW9uYCB0aGF0IGNhbGxzIGEgbWV0aG9kIG9uIGEgcmVjZWl2ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0c0NhbGxNZXRob2QoXG4gICAgcmVjZWl2ZXI6IHRzLkV4cHJlc3Npb24sIG1ldGhvZE5hbWU6IHN0cmluZywgYXJnczogdHMuRXhwcmVzc2lvbltdID0gW10pOiB0cy5DYWxsRXhwcmVzc2lvbiB7XG4gIGNvbnN0IG1ldGhvZEFjY2VzcyA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHJlY2VpdmVyLCBtZXRob2ROYW1lKTtcbiAgcmV0dXJuIHRzLmNyZWF0ZUNhbGwoXG4gICAgICAvKiBleHByZXNzaW9uICovIG1ldGhvZEFjY2VzcyxcbiAgICAgIC8qIHR5cGVBcmd1bWVudHMgKi8gdW5kZWZpbmVkLFxuICAgICAgLyogYXJndW1lbnRzQXJyYXkgKi8gYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lmQ2xhc3NJc0V4cG9ydGVkKG5vZGU6IENsYXNzRGVjbGFyYXRpb24pOiBib29sZWFuIHtcbiAgLy8gQSBjbGFzcyBpcyBleHBvcnRlZCBpZiBvbmUgb2YgdHdvIGNvbmRpdGlvbnMgaXMgbWV0OlxuICAvLyAxKSBpdCBoYXMgdGhlICdleHBvcnQnIG1vZGlmaWVyLlxuICAvLyAyKSBpdCdzIGRlY2xhcmVkIGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCB0aGVyZSBpcyBhbiBleHBvcnQgc3RhdGVtZW50IGZvciB0aGUgY2xhc3MuXG4gIGlmIChub2RlLm1vZGlmaWVycyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBub2RlLm1vZGlmaWVycy5zb21lKG1vZCA9PiBtb2Qua2luZCA9PT0gdHMuU3ludGF4S2luZC5FeHBvcnRLZXl3b3JkKSkge1xuICAgIC8vIENvbmRpdGlvbiAxIGlzIHRydWUsIHRoZSBjbGFzcyBoYXMgYW4gJ2V4cG9ydCcga2V5d29yZCBhdHRhY2hlZC5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChcbiAgICAgIG5vZGUucGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHMuaXNTb3VyY2VGaWxlKG5vZGUucGFyZW50KSAmJlxuICAgICAgY2hlY2tJZkZpbGVIYXNFeHBvcnQobm9kZS5wYXJlbnQsIG5vZGUubmFtZS50ZXh0KSkge1xuICAgIC8vIENvbmRpdGlvbiAyIGlzIHRydWUsIHRoZSBjbGFzcyBpcyBleHBvcnRlZCB2aWEgYW4gJ2V4cG9ydCB7fScgc3RhdGVtZW50LlxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJZkZpbGVIYXNFeHBvcnQoc2Y6IHRzLlNvdXJjZUZpbGUsIG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBmb3IgKGNvbnN0IHN0bXQgb2Ygc2Yuc3RhdGVtZW50cykge1xuICAgIGlmICh0cy5pc0V4cG9ydERlY2xhcmF0aW9uKHN0bXQpICYmIHN0bXQuZXhwb3J0Q2xhdXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBzdG10LmV4cG9ydENsYXVzZS5lbGVtZW50cykge1xuICAgICAgICBpZiAoZWxlbWVudC5wcm9wZXJ0eU5hbWUgPT09IHVuZGVmaW5lZCAmJiBlbGVtZW50Lm5hbWUudGV4dCA9PT0gbmFtZSkge1xuICAgICAgICAgIC8vIFRoZSBuYW1lZCBkZWNsYXJhdGlvbiBpcyBkaXJlY3RseSBleHBvcnRlZC5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnByb3BlcnR5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGVsZW1lbnQucHJvcGVydHlOYW1lLnRleHQgPT0gbmFtZSkge1xuICAgICAgICAgIC8vIFRoZSBuYW1lZCBkZWNsYXJhdGlvbiBpcyBleHBvcnRlZCB2aWEgYW4gYWxpYXMuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJZkdlbmVyaWNUeXBlc0FyZVVuYm91bmQobm9kZTogQ2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPik6XG4gICAgYm9vbGVhbiB7XG4gIGlmIChub2RlLnR5cGVQYXJhbWV0ZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gbm9kZS50eXBlUGFyYW1ldGVycy5ldmVyeShwYXJhbSA9PiBwYXJhbS5jb25zdHJhaW50ID09PSB1bmRlZmluZWQpO1xufVxuIl19
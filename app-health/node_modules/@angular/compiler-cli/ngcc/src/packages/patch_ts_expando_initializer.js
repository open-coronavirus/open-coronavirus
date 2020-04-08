(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/patch_ts_expando_initializer", ["require", "exports", "typescript", "@angular/compiler-cli/ngcc/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    /**
     * Consider the following ES5 code that may have been generated for a class:
     *
     * ```
     * var A = (function(){
     *   function A() {}
     *   return A;
     * }());
     * A.staticProp = true;
     * ```
     *
     * Here, TypeScript marks the symbol for "A" as a so-called "expando symbol", which causes
     * "staticProp" to be added as an export of the "A" symbol.
     *
     * In the example above, symbol "A" has been assigned some flags to indicate that it represents a
     * class. Due to this flag, the symbol is considered an expando symbol and as such, "staticProp" is
     * stored in `ts.Symbol.exports`.
     *
     * A problem arises when "A" is not at the top-level, i.e. in UMD bundles. In that case, the symbol
     * does not have the flag that marks the symbol as a class. Therefore, TypeScript inspects "A"'s
     * initializer expression, which is an IIFE in the above example. Unfortunately however, only IIFEs
     * of the form `(function(){})()` qualify as initializer for an "expando symbol"; the slightly
     * different form seen in the example above, `(function(){}())`, does not. This prevents the "A"
     * symbol from being considered an expando symbol, in turn preventing "staticProp" from being stored
     * in `ts.Symbol.exports`.
     *
     * The logic for identifying symbols as "expando symbols" can be found here:
     * https://github.com/microsoft/TypeScript/blob/v3.4.5/src/compiler/binder.ts#L2656-L2685
     *
     * Notice how the `getExpandoInitializer` function is available on the "ts" namespace in the
     * compiled bundle, so we are able to override this function to accommodate for the alternative
     * IIFE notation. The original implementation can be found at:
     * https://github.com/Microsoft/TypeScript/blob/v3.4.5/src/compiler/utilities.ts#L1864-L1887
     *
     * Issue tracked in https://github.com/microsoft/TypeScript/issues/31778
     *
     * @returns the function to pass to `restoreGetExpandoInitializer` to undo the patch, or null if
     * the issue is known to have been fixed.
     */
    function patchTsGetExpandoInitializer() {
        if (isTs31778GetExpandoInitializerFixed()) {
            return null;
        }
        var originalGetExpandoInitializer = ts.getExpandoInitializer;
        if (originalGetExpandoInitializer === undefined) {
            throw makeUnsupportedTypeScriptError();
        }
        // Override the function to add support for recognizing the IIFE structure used in ES5 bundles.
        ts.getExpandoInitializer =
            function (initializer, isPrototypeAssignment) {
                // If the initializer is a call expression within parenthesis, unwrap the parenthesis
                // upfront such that unsupported IIFE syntax `(function(){}())` becomes `function(){}()`,
                // which is supported.
                if (ts.isParenthesizedExpression(initializer) &&
                    ts.isCallExpression(initializer.expression)) {
                    initializer = initializer.expression;
                }
                return originalGetExpandoInitializer(initializer, isPrototypeAssignment);
            };
        return originalGetExpandoInitializer;
    }
    exports.patchTsGetExpandoInitializer = patchTsGetExpandoInitializer;
    function restoreGetExpandoInitializer(originalGetExpandoInitializer) {
        if (originalGetExpandoInitializer !== null) {
            ts.getExpandoInitializer = originalGetExpandoInitializer;
        }
    }
    exports.restoreGetExpandoInitializer = restoreGetExpandoInitializer;
    var ts31778FixedResult = null;
    function isTs31778GetExpandoInitializerFixed() {
        // If the result has already been computed, return early.
        if (ts31778FixedResult !== null) {
            return ts31778FixedResult;
        }
        // Determine if the issue has been fixed by checking if an expando property is present in a
        // minimum reproduction using unpatched TypeScript.
        ts31778FixedResult = checkIfExpandoPropertyIsPresent();
        // If the issue does not appear to have been fixed, verify that applying the patch has the desired
        // effect.
        if (!ts31778FixedResult) {
            var originalGetExpandoInitializer = patchTsGetExpandoInitializer();
            try {
                var patchIsSuccessful = checkIfExpandoPropertyIsPresent();
                if (!patchIsSuccessful) {
                    throw makeUnsupportedTypeScriptError();
                }
            }
            finally {
                restoreGetExpandoInitializer(originalGetExpandoInitializer);
            }
        }
        return ts31778FixedResult;
    }
    /**
     * Verifies whether TS issue 31778 has been fixed by inspecting a symbol from a minimum
     * reproduction. If the symbol does in fact have the "expando" as export, the issue has been fixed.
     *
     * See https://github.com/microsoft/TypeScript/issues/31778 for details.
     */
    function checkIfExpandoPropertyIsPresent() {
        var sourceText = "\n    (function() {\n      var A = (function() {\n        function A() {}\n        return A;\n      }());\n      A.expando = true;\n    }());";
        var sourceFile = ts.createSourceFile('test.js', sourceText, ts.ScriptTarget.ES5, true, ts.ScriptKind.JS);
        var host = {
            getSourceFile: function () { return sourceFile; },
            fileExists: function () { return true; },
            readFile: function () { return ''; },
            writeFile: function () { },
            getDefaultLibFileName: function () { return ''; },
            getCurrentDirectory: function () { return ''; },
            getDirectories: function () { return []; },
            getCanonicalFileName: function (fileName) { return fileName; },
            useCaseSensitiveFileNames: function () { return true; },
            getNewLine: function () { return '\n'; },
        };
        var options = { noResolve: true, noLib: true, noEmit: true, allowJs: true };
        var program = ts.createProgram(['test.js'], options, host);
        function visitor(node) {
            if (ts.isVariableDeclaration(node) && utils_1.hasNameIdentifier(node) && node.name.text === 'A') {
                return node;
            }
            return ts.forEachChild(node, visitor);
        }
        var declaration = ts.forEachChild(sourceFile, visitor);
        if (declaration === undefined) {
            throw new Error('Unable to find declaration of outer A');
        }
        var symbol = program.getTypeChecker().getSymbolAtLocation(declaration.name);
        if (symbol === undefined) {
            throw new Error('Unable to resolve symbol of outer A');
        }
        return symbol.exports !== undefined && symbol.exports.has('expando');
    }
    function makeUnsupportedTypeScriptError() {
        return new Error('The TypeScript version used is not supported by ngcc.');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2hfdHNfZXhwYW5kb19pbml0aWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9wYWNrYWdlcy9wYXRjaF90c19leHBhbmRvX2luaXRpYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsK0JBQWlDO0lBQ2pDLDhEQUEyQztJQUUzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FzQ0c7SUFDSCxTQUFnQiw0QkFBNEI7UUFDMUMsSUFBSSxtQ0FBbUMsRUFBRSxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFNLDZCQUE2QixHQUFJLEVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztRQUN4RSxJQUFJLDZCQUE2QixLQUFLLFNBQVMsRUFBRTtZQUMvQyxNQUFNLDhCQUE4QixFQUFFLENBQUM7U0FDeEM7UUFFRCwrRkFBK0Y7UUFDOUYsRUFBVSxDQUFDLHFCQUFxQjtZQUM3QixVQUFDLFdBQW9CLEVBQUUscUJBQThCO2dCQUNuRCxxRkFBcUY7Z0JBQ3JGLHlGQUF5RjtnQkFDekYsc0JBQXNCO2dCQUN0QixJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLENBQUM7b0JBQ3pDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQy9DLFdBQVcsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO2lCQUN0QztnQkFDRCxPQUFPLDZCQUE2QixDQUFDLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQztRQUNOLE9BQU8sNkJBQTZCLENBQUM7SUFDdkMsQ0FBQztJQXZCRCxvRUF1QkM7SUFFRCxTQUFnQiw0QkFBNEIsQ0FBQyw2QkFBc0M7UUFDakYsSUFBSSw2QkFBNkIsS0FBSyxJ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LEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUF3QixDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELFNBQVMsOEJBQThCO1FBQ3JDLE9BQU8sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztJQUM1RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge2hhc05hbWVJZGVudGlmaWVyfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uc2lkZXIgdGhlIGZvbGxvd2luZyBFUzUgY29kZSB0aGF0IG1heSBoYXZlIGJlZW4gZ2VuZXJhdGVkIGZvciBhIGNsYXNzOlxuICpcbiAqIGBgYFxuICogdmFyIEEgPSAoZnVuY3Rpb24oKXtcbiAqICAgZnVuY3Rpb24gQSgpIHt9XG4gKiAgIHJldHVybiBBO1xuICogfSgpKTtcbiAqIEEuc3RhdGljUHJvcCA9IHRydWU7XG4gKiBgYGBcbiAqXG4gKiBIZXJlLCBUeXBlU2NyaXB0IG1hcmtzIHRoZSBzeW1ib2wgZm9yIFwiQVwiIGFzIGEgc28tY2FsbGVkIFwiZXhwYW5kbyBzeW1ib2xcIiwgd2hpY2ggY2F1c2VzXG4gKiBcInN0YXRpY1Byb3BcIiB0byBiZSBhZGRlZCBhcyBhbiBleHBvcnQgb2YgdGhlIFwiQVwiIHN5bWJvbC5cbiAqXG4gKiBJbiB0aGUgZXhhbXBsZSBhYm92ZSwgc3ltYm9sIFwiQVwiIGhhcyBiZWVuIGFzc2lnbmVkIHNvbWUgZmxhZ3MgdG8gaW5kaWNhdGUgdGhhdCBpdCByZXByZXNlbnRzIGFcbiAqIGNsYXNzLiBEdWUgdG8gdGhpcyBmbGFnLCB0aGUgc3ltYm9sIGlzIGNvbnNpZGVyZWQgYW4gZXhwYW5kbyBzeW1ib2wgYW5kIGFzIHN1Y2gsIFwic3RhdGljUHJvcFwiIGlzXG4gKiBzdG9yZWQgaW4gYHRzLlN5bWJvbC5leHBvcnRzYC5cbiAqXG4gKiBBIHByb2JsZW0gYXJpc2VzIHdoZW4gXCJBXCIgaXMgbm90IGF0IHRoZSB0b3AtbGV2ZWwsIGkuZS4gaW4gVU1EIGJ1bmRsZXMuIEluIHRoYXQgY2FzZSwgdGhlIHN5bWJvbFxuICogZG9lcyBub3QgaGF2ZSB0aGUgZmxhZyB0aGF0IG1hcmtzIHRoZSBzeW1ib2wgYXMgYSBjbGFzcy4gVGhlcmVmb3JlLCBUeXBlU2NyaXB0IGluc3BlY3RzIFwiQVwiJ3NcbiAqIGluaXRpYWxpemVyIGV4cHJlc3Npb24sIHdoaWNoIGlzIGFuIElJRkUgaW4gdGhlIGFib3ZlIGV4YW1wbGUuIFVuZm9ydHVuYXRlbHkgaG93ZXZlciwgb25seSBJSUZFc1xuICogb2YgdGhlIGZvcm0gYChmdW5jdGlvbigpe30pKClgIHF1YWxpZnkgYXMgaW5pdGlhbGl6ZXIgZm9yIGFuIFwiZXhwYW5kbyBzeW1ib2xcIjsgdGhlIHNsaWdodGx5XG4gKiBkaWZmZXJlbnQgZm9ybSBzZWVuIGluIHRoZSBleGFtcGxlIGFib3ZlLCBgKGZ1bmN0aW9uKCl7fSgpKWAsIGRvZXMgbm90LiBUaGlzIHByZXZlbnRzIHRoZSBcIkFcIlxuICogc3ltYm9sIGZyb20gYmVpbmcgY29uc2lkZXJlZCBhbiBleHBhbmRvIHN5bWJvbCwgaW4gdHVybiBwcmV2ZW50aW5nIFwic3RhdGljUHJvcFwiIGZyb20gYmVpbmcgc3RvcmVkXG4gKiBpbiBgdHMuU3ltYm9sLmV4cG9ydHNgLlxuICpcbiAqIFRoZSBsb2dpYyBmb3IgaWRlbnRpZnlpbmcgc3ltYm9scyBhcyBcImV4cGFuZG8gc3ltYm9sc1wiIGNhbiBiZSBmb3VuZCBoZXJlOlxuICogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvdjMuNC41L3NyYy9jb21waWxlci9iaW5kZXIudHMjTDI2NTYtTDI2ODVcbiAqXG4gKiBOb3RpY2UgaG93IHRoZSBgZ2V0RXhwYW5kb0luaXRpYWxpemVyYCBmdW5jdGlvbiBpcyBhdmFpbGFibGUgb24gdGhlIFwidHNcIiBuYW1lc3BhY2UgaW4gdGhlXG4gKiBjb21waWxlZCBidW5kbGUsIHNvIHdlIGFyZSBhYmxlIHRvIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gdG8gYWNjb21tb2RhdGUgZm9yIHRoZSBhbHRlcm5hdGl2ZVxuICogSUlGRSBub3RhdGlvbi4gVGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBhdDpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL3YzLjQuNS9zcmMvY29tcGlsZXIvdXRpbGl0aWVzLnRzI0wxODY0LUwxODg3XG4gKlxuICogSXNzdWUgdHJhY2tlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMxNzc4XG4gKlxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIHRvIHBhc3MgdG8gYHJlc3RvcmVHZXRFeHBhbmRvSW5pdGlhbGl6ZXJgIHRvIHVuZG8gdGhlIHBhdGNoLCBvciBudWxsIGlmXG4gKiB0aGUgaXNzdWUgaXMga25vd24gdG8gaGF2ZSBiZWVuIGZpeGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hUc0dldEV4cGFuZG9Jbml0aWFsaXplcigpOiB1bmtub3duIHtcbiAgaWYgKGlzVHMzMTc3OEdldEV4cGFuZG9Jbml0aWFsaXplckZpeGVkKCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IG9yaWdpbmFsR2V0RXhwYW5kb0luaXRpYWxpemVyID0gKHRzIGFzIGFueSkuZ2V0RXhwYW5kb0luaXRpYWxpemVyO1xuICBpZiAob3JpZ2luYWxHZXRFeHBhbmRvSW5pdGlhbGl6ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG1ha2VVbnN1cHBvcnRlZFR5cGVTY3JpcHRFcnJvcigpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIGZ1bmN0aW9uIHRvIGFkZCBzdXBwb3J0IGZvciByZWNvZ25pemluZyB0aGUgSUlGRSBzdHJ1Y3R1cmUgdXNlZCBpbiBFUzUgYnVuZGxlcy5cbiAgKHRzIGFzIGFueSkuZ2V0RXhwYW5kb0luaXRpYWxpemVyID1cbiAgICAgIChpbml0aWFsaXplcjogdHMuTm9kZSwgaXNQcm90b3R5cGVBc3NpZ25tZW50OiBib29sZWFuKTogdHMuRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIC8vIElmIHRoZSBpbml0aWFsaXplciBpcyBhIGNhbGwgZXhwcmVzc2lvbiB3aXRoaW4gcGFyZW50aGVzaXMsIHVud3JhcCB0aGUgcGFyZW50aGVzaXNcbiAgICAgICAgLy8gdXBmcm9udCBzdWNoIHRoYXQgdW5zdXBwb3J0ZWQgSUlGRSBzeW50YXggYChmdW5jdGlvbigpe30oKSlgIGJlY29tZXMgYGZ1bmN0aW9uKCl7fSgpYCxcbiAgICAgICAgLy8gd2hpY2ggaXMgc3VwcG9ydGVkLlxuICAgICAgICBpZiAodHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihpbml0aWFsaXplcikgJiZcbiAgICAgICAgICAgIHRzLmlzQ2FsbEV4cHJlc3Npb24oaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICBpbml0aWFsaXplciA9IGluaXRpYWxpemVyLmV4cHJlc3Npb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsR2V0RXhwYW5kb0luaXRpYWxpemVyKGluaXRpYWxpemVyLCBpc1Byb3RvdHlwZUFzc2lnbm1lbnQpO1xuICAgICAgfTtcbiAgcmV0dXJuIG9yaWdpbmFsR2V0RXhwYW5kb0luaXRpYWxpemVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzdG9yZUdldEV4cGFuZG9Jbml0aWFsaXplcihvcmlnaW5hbEdldEV4cGFuZG9Jbml0aWFsaXplcjogdW5rbm93bik6IHZvaWQge1xuICBpZiAob3JpZ2luYWxHZXRFeHBhbmRvSW5pdGlhbGl6ZXIgIT09IG51bGwpIHtcbiAgICAodHMgYXMgYW55KS5nZXRFeHBhbmRvSW5pdGlhbGl6ZXIgPSBvcmlnaW5hbEdldEV4cGFuZG9Jbml0aWFsaXplcjtcbiAgfVxufVxuXG5sZXQgdHMzMTc3OEZpeGVkUmVzdWx0OiBib29sZWFufG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBpc1RzMzE3NzhHZXRFeHBhbmRvSW5pdGlhbGl6ZXJGaXhlZCgpOiBib29sZWFuIHtcbiAgLy8gSWYgdGhlIHJlc3VsdCBoYXMgYWxyZWFkeSBiZWVuIGNvbXB1dGVkLCByZXR1cm4gZWFybHkuXG4gIGlmICh0czMxNzc4Rml4ZWRSZXN1bHQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gdHMzMTc3OEZpeGVkUmVzdWx0O1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBpc3N1ZSBoYXMgYmVlbiBmaXhlZCBieSBjaGVja2luZyBpZiBhbiBleHBhbmRvIHByb3BlcnR5IGlzIHByZXNlbnQgaW4gYVxuICAvLyBtaW5pbXVtIHJlcHJvZHVjdGlvbiB1c2luZyB1bnBhdGNoZWQgVHlwZVNjcmlwdC5cbiAgdHMzMTc3OEZpeGVkUmVzdWx0ID0gY2hlY2tJZkV4cGFuZG9Qcm9wZXJ0eUlzUHJlc2VudCgpO1xuXG4gIC8vIElmIHRoZSBpc3N1ZSBkb2VzIG5vdCBhcHBlYXIgdG8gaGF2ZSBiZWVuIGZpeGVkLCB2ZXJpZnkgdGhhdCBhcHBseWluZyB0aGUgcGF0Y2ggaGFzIHRoZSBkZXNpcmVkXG4gIC8vIGVmZmVjdC5cbiAgaWYgKCF0czMxNzc4Rml4ZWRSZXN1bHQpIHtcbiAgICBjb25zdCBvcmlnaW5hbEdldEV4cGFuZG9Jbml0aWFsaXplciA9IHBhdGNoVHNHZXRFeHBhbmRvSW5pdGlhbGl6ZXIoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGF0Y2hJc1N1Y2Nlc3NmdWwgPSBjaGVja0lmRXhwYW5kb1Byb3BlcnR5SXNQcmVzZW50KCk7XG4gICAgICBpZiAoIXBhdGNoSXNTdWNjZXNzZnVsKSB7XG4gICAgICAgIHRocm93IG1ha2VVbnN1cHBvcnRlZFR5cGVTY3JpcHRFcnJvcigpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICByZXN0b3JlR2V0RXhwYW5kb0luaXRpYWxpemVyKG9yaWdpbmFsR2V0RXhwYW5kb0luaXRpYWxpemVyKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHMzMTc3OEZpeGVkUmVzdWx0O1xufVxuXG4vKipcbiAqIFZlcmlmaWVzIHdoZXRoZXIgVFMgaXNzdWUgMzE3NzggaGFzIGJlZW4gZml4ZWQgYnkgaW5zcGVjdGluZyBhIHN5bWJvbCBmcm9tIGEgbWluaW11bVxuICogcmVwcm9kdWN0aW9uLiBJZiB0aGUgc3ltYm9sIGRvZXMgaW4gZmFjdCBoYXZlIHRoZSBcImV4cGFuZG9cIiBhcyBleHBvcnQsIHRoZSBpc3N1ZSBoYXMgYmVlbiBmaXhlZC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMTc3OCBmb3IgZGV0YWlscy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZkV4cGFuZG9Qcm9wZXJ0eUlzUHJlc2VudCgpOiBib29sZWFuIHtcbiAgY29uc3Qgc291cmNlVGV4dCA9IGBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgQSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gQSgpIHt9XG4gICAgICAgIHJldHVybiBBO1xuICAgICAgfSgpKTtcbiAgICAgIEEuZXhwYW5kbyA9IHRydWU7XG4gICAgfSgpKTtgO1xuICBjb25zdCBzb3VyY2VGaWxlID1cbiAgICAgIHRzLmNyZWF0ZVNvdXJjZUZpbGUoJ3Rlc3QuanMnLCBzb3VyY2VUZXh0LCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlLCB0cy5TY3JpcHRLaW5kLkpTKTtcbiAgY29uc3QgaG9zdDogdHMuQ29tcGlsZXJIb3N0ID0ge1xuICAgIGdldFNvdXJjZUZpbGUoKTogdHMuU291cmNlRmlsZSB8IHVuZGVmaW5lZHtyZXR1cm4gc291cmNlRmlsZTt9LFxuICAgIGZpbGVFeGlzdHMoKTogYm9vbGVhbntyZXR1cm4gdHJ1ZTt9LFxuICAgIHJlYWRGaWxlKCk6IHN0cmluZyB8IHVuZGVmaW5lZHtyZXR1cm4gJyc7fSxcbiAgICB3cml0ZUZpbGUoKSB7fSxcbiAgICBnZXREZWZhdWx0TGliRmlsZU5hbWUoKTogc3RyaW5ne3JldHVybiAnJzt9LFxuICAgIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5ne3JldHVybiAnJzt9LFxuICAgIGdldERpcmVjdG9yaWVzKCk6IHN0cmluZ1tde3JldHVybiBbXTt9LFxuICAgIGdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmd7cmV0dXJuIGZpbGVOYW1lO30sXG4gICAgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcygpOiBib29sZWFue3JldHVybiB0cnVlO30sXG4gICAgZ2V0TmV3TGluZSgpOiBzdHJpbmd7cmV0dXJuICdcXG4nO30sXG4gIH07XG4gIGNvbnN0IG9wdGlvbnMgPSB7bm9SZXNvbHZlOiB0cnVlLCBub0xpYjogdHJ1ZSwgbm9FbWl0OiB0cnVlLCBhbGxvd0pzOiB0cnVlfTtcbiAgY29uc3QgcHJvZ3JhbSA9IHRzLmNyZWF0ZVByb2dyYW0oWyd0ZXN0LmpzJ10sIG9wdGlvbnMsIGhvc3QpO1xuXG4gIGZ1bmN0aW9uIHZpc2l0b3Iobm9kZTogdHMuTm9kZSk6IHRzLlZhcmlhYmxlRGVjbGFyYXRpb258dW5kZWZpbmVkIHtcbiAgICBpZiAodHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpICYmIGhhc05hbWVJZGVudGlmaWVyKG5vZGUpICYmIG5vZGUubmFtZS50ZXh0ID09PSAnQScpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0b3IpO1xuICB9XG5cbiAgY29uc3QgZGVjbGFyYXRpb24gPSB0cy5mb3JFYWNoQ2hpbGQoc291cmNlRmlsZSwgdmlzaXRvcik7XG4gIGlmIChkZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBkZWNsYXJhdGlvbiBvZiBvdXRlciBBJyk7XG4gIH1cblxuICBjb25zdCBzeW1ib2wgPSBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCkuZ2V0U3ltYm9sQXRMb2NhdGlvbihkZWNsYXJhdGlvbi5uYW1lKTtcbiAgaWYgKHN5bWJvbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcmVzb2x2ZSBzeW1ib2wgb2Ygb3V0ZXIgQScpO1xuICB9XG4gIHJldHVybiBzeW1ib2wuZXhwb3J0cyAhPT0gdW5kZWZpbmVkICYmIHN5bWJvbC5leHBvcnRzLmhhcygnZXhwYW5kbycgYXMgdHMuX19TdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBtYWtlVW5zdXBwb3J0ZWRUeXBlU2NyaXB0RXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gbmV3IEVycm9yKCdUaGUgVHlwZVNjcmlwdCB2ZXJzaW9uIHVzZWQgaXMgbm90IHN1cHBvcnRlZCBieSBuZ2NjLicpO1xufVxuIl19
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler", "@angular/compiler-cli/src/diagnostics/expression_diagnostics", "@angular/compiler-cli/src/diagnostics/expression_type", "@angular/compiler-cli/src/diagnostics/symbols", "@angular/compiler-cli/src/diagnostics/typescript_symbols", "@angular/compiler-cli/src/version", "@angular/compiler-cli/src/metadata/index", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/entry_points", "@angular/compiler-cli/src/perform_compile", "@angular/compiler-cli/src/tooling", "@angular/compiler-cli/src/ngtools_api", "@angular/compiler-cli/src/transformers/util", "@angular/compiler-cli/src/ngtsc/tsc_plugin"], factory);
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
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var compiler_1 = require("@angular/compiler");
    exports.StaticReflector = compiler_1.StaticReflector;
    exports.StaticSymbol = compiler_1.StaticSymbol;
    var expression_diagnostics_1 = require("@angular/compiler-cli/src/diagnostics/expression_diagnostics");
    exports.getExpressionScope = expression_diagnostics_1.getExpressionScope;
    exports.getTemplateExpressionDiagnostics = expression_diagnostics_1.getTemplateExpressionDiagnostics;
    var expression_type_1 = require("@angular/compiler-cli/src/diagnostics/expression_type");
    exports.AstType = expression_type_1.AstType;
    var symbols_1 = require("@angular/compiler-cli/src/diagnostics/symbols");
    exports.BuiltinType = symbols_1.BuiltinType;
    var typescript_symbols_1 = require("@angular/compiler-cli/src/diagnostics/typescript_symbols");
    exports.getClassMembersFromDeclaration = typescript_symbols_1.getClassMembersFromDeclaration;
    exports.getPipesTable = typescript_symbols_1.getPipesTable;
    exports.getSymbolQuery = typescript_symbols_1.getSymbolQuery;
    var version_1 = require("@angular/compiler-cli/src/version");
    exports.VERSION = version_1.VERSION;
    tslib_1.__exportStar(require("@angular/compiler-cli/src/metadata/index"), exports);
    tslib_1.__exportStar(require("@angular/compiler-cli/src/transformers/api"), exports);
    tslib_1.__exportStar(require("@angular/compiler-cli/src/transformers/entry_points"), exports);
    tslib_1.__exportStar(require("@angular/compiler-cli/src/perform_compile"), exports);
    tslib_1.__exportStar(require("@angular/compiler-cli/src/tooling"), exports);
    var ngtools_api_1 = require("@angular/compiler-cli/src/ngtools_api");
    exports.__NGTOOLS_PRIVATE_API_2 = ngtools_api_1.NgTools_InternalApi_NG_2;
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    exports.ngToTsDiagnostic = util_1.ngToTsDiagnostic;
    var tsc_plugin_1 = require("@angular/compiler-cli/src/ngtsc/tsc_plugin");
    exports.NgTscPlugin = tsc_plugin_1.NgTscPlugin;
    file_system_1.setFileSystem(new file_system_1.NodeJSFileSystem());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsMkVBQXdFO0lBRXhFLDhDQUF5SDtJQUF4RCxxQ0FBQSxlQUFlLENBQUE7SUFBRSxrQ0FBQSxZQUFZLENBQUE7SUFDOUYsdUdBQXNJO0lBQXRHLHNEQUFBLGtCQUFrQixDQUFBO0lBQUUsb0VBQUEsZ0NBQWdDLENBQUE7SUFDcEYseUZBQXdGO0lBQWhGLG9DQUFBLE9BQU8sQ0FBQTtJQUNmLHlFQUEwSztJQUFsSyxnQ0FBQSxXQUFXLENBQUE7SUFDbkIsK0ZBQW1IO0lBQTNHLDhEQUFBLDhCQUE4QixDQUFBO0lBQUUsNkNBQUEsYUFBYSxDQUFBO0lBQUUsOENBQUEsY0FBYyxDQUFBO0lBQ3JFLDZEQUFzQztJQUE5Qiw0QkFBQSxPQUFPLENBQUE7SUFFZixtRkFBK0I7SUFDL0IscUZBQXVDO0lBQ3ZDLDhGQUFnRDtJQUVoRCxvRkFBc0M7SUFDdEMsNEVBQThCO0lBSzlCLHFFQUFzRjtJQUE5RSxnREFBQSx3QkFBd0IsQ0FBMkI7SUFFM0Qsb0VBQXlEO0lBQWpELGtDQUFBLGdCQUFnQixDQUFBO0lBQ3hCLHlFQUFtRDtJQUEzQyxtQ0FBQSxXQUFXLENBQUE7SUFFbkIsMkJBQWEsQ0FBQyxJQUFJLDhCQUFnQixFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Tm9kZUpTRmlsZVN5c3RlbSwgc2V0RmlsZVN5c3RlbX0gZnJvbSAnLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuXG5leHBvcnQge0FvdENvbXBpbGVySG9zdCwgQW90Q29tcGlsZXJIb3N0IGFzIFN0YXRpY1JlZmxlY3Rvckhvc3QsIFN0YXRpY1JlZmxlY3RvciwgU3RhdGljU3ltYm9sfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5leHBvcnQge0RpYWdub3N0aWNUZW1wbGF0ZUluZm8sIGdldEV4cHJlc3Npb25TY29wZSwgZ2V0VGVtcGxhdGVFeHByZXNzaW9uRGlhZ25vc3RpY3N9IGZyb20gJy4vc3JjL2RpYWdub3N0aWNzL2V4cHJlc3Npb25fZGlhZ25vc3RpY3MnO1xuZXhwb3J0IHtBc3RUeXBlLCBFeHByZXNzaW9uRGlhZ25vc3RpY3NDb250ZXh0fSBmcm9tICcuL3NyYy9kaWFnbm9zdGljcy9leHByZXNzaW9uX3R5cGUnO1xuZXhwb3J0IHtCdWlsdGluVHlwZSwgRGVjbGFyYXRpb25LaW5kLCBEZWZpbml0aW9uLCBQaXBlSW5mbywgUGlwZXMsIFNpZ25hdHVyZSwgU3BhbiwgU3ltYm9sLCBTeW1ib2xEZWNsYXJhdGlvbiwgU3ltYm9sUXVlcnksIFN5bWJvbFRhYmxlfSBmcm9tICcuL3NyYy9kaWFnbm9zdGljcy9zeW1ib2xzJztcbmV4cG9ydCB7Z2V0Q2xhc3NNZW1iZXJzRnJvbURlY2xhcmF0aW9uLCBnZXRQaXBlc1RhYmxlLCBnZXRTeW1ib2xRdWVyeX0gZnJvbSAnLi9zcmMvZGlhZ25vc3RpY3MvdHlwZXNjcmlwdF9zeW1ib2xzJztcbmV4cG9ydCB7VkVSU0lPTn0gZnJvbSAnLi9zcmMvdmVyc2lvbic7XG5cbmV4cG9ydCAqIGZyb20gJy4vc3JjL21ldGFkYXRhJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL3RyYW5zZm9ybWVycy9hcGknO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvdHJhbnNmb3JtZXJzL2VudHJ5X3BvaW50cyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vc3JjL3BlcmZvcm1fY29tcGlsZSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy90b29saW5nJztcblxuLy8gVE9ETyh0Ym9zY2gpOiByZW1vdmUgdGhpcyBvbmNlIGNsaSAxLjUgaXMgZnVsbHkgcmVsZWFzZWQsXG4vLyBhbmQgdXNhZ2VzIGluIEczIGFyZSBjaGFuZ2VkIHRvIGBDb21waWxlck9wdGlvbnNgLlxuZXhwb3J0IHtDb21waWxlck9wdGlvbnMgYXMgQW5ndWxhckNvbXBpbGVyT3B0aW9uc30gZnJvbSAnLi9zcmMvdHJhbnNmb3JtZXJzL2FwaSc7XG5leHBvcnQge05nVG9vbHNfSW50ZXJuYWxBcGlfTkdfMiBhcyBfX05HVE9PTFNfUFJJVkFURV9BUElfMn0gZnJvbSAnLi9zcmMvbmd0b29sc19hcGknO1xuXG5leHBvcnQge25nVG9Uc0RpYWdub3N0aWN9IGZyb20gJy4vc3JjL3RyYW5zZm9ybWVycy91dGlsJztcbmV4cG9ydCB7TmdUc2NQbHVnaW59IGZyb20gJy4vc3JjL25ndHNjL3RzY19wbHVnaW4nO1xuXG5zZXRGaWxlU3lzdGVtKG5ldyBOb2RlSlNGaWxlU3lzdGVtKCkpO1xuIl19
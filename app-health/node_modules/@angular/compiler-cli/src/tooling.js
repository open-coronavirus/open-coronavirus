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
        define("@angular/compiler-cli/src/tooling", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @module
     * @description
     * Tooling support helpers.
     */
    /**
     * Known values for global variables in `@angular/core` that Terser should set using
     * https://github.com/terser-js/terser#conditional-compilation
     */
    exports.GLOBAL_DEFS_FOR_TERSER = {
        ngDevMode: false,
        ngI18nClosureMode: false,
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdG9vbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVIOzs7O09BSUc7SUFFSDs7O09BR0c7SUFDVSxRQUFBLHNCQUFzQixHQUFHO1FBQ3BDLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLGlCQUFpQixFQUFFLEtBQUs7S0FDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRvb2xpbmcgc3VwcG9ydCBoZWxwZXJzLlxuICovXG5cbi8qKlxuICogS25vd24gdmFsdWVzIGZvciBnbG9iYWwgdmFyaWFibGVzIGluIGBAYW5ndWxhci9jb3JlYCB0aGF0IFRlcnNlciBzaG91bGQgc2V0IHVzaW5nXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGVyc2VyLWpzL3RlcnNlciNjb25kaXRpb25hbC1jb21waWxhdGlvblxuICovXG5leHBvcnQgY29uc3QgR0xPQkFMX0RFRlNfRk9SX1RFUlNFUiA9IHtcbiAgbmdEZXZNb2RlOiBmYWxzZSxcbiAgbmdJMThuQ2xvc3VyZU1vZGU6IGZhbHNlLFxufTtcbiJdfQ==
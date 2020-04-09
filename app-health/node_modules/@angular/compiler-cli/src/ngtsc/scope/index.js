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
        define("@angular/compiler-cli/src/ngtsc/scope", ["require", "exports", "@angular/compiler-cli/src/ngtsc/scope/src/dependency", "@angular/compiler-cli/src/ngtsc/scope/src/local"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependency_1 = require("@angular/compiler-cli/src/ngtsc/scope/src/dependency");
    exports.MetadataDtsModuleScopeResolver = dependency_1.MetadataDtsModuleScopeResolver;
    var local_1 = require("@angular/compiler-cli/src/ngtsc/scope/src/local");
    exports.LocalModuleScopeRegistry = local_1.LocalModuleScopeRegistry;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3Njb3BlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBR0gsbUZBQXdGO0lBQXhELHNEQUFBLDhCQUE4QixDQUFBO0lBQzlELHlFQUEwRjtJQUFoRSwyQ0FBQSx3QkFBd0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IHtFeHBvcnRTY29wZSwgU2NvcGVEYXRhfSBmcm9tICcuL3NyYy9hcGknO1xuZXhwb3J0IHtEdHNNb2R1bGVTY29wZVJlc29sdmVyLCBNZXRhZGF0YUR0c01vZHVsZVNjb3BlUmVzb2x2ZXJ9IGZyb20gJy4vc3JjL2RlcGVuZGVuY3knO1xuZXhwb3J0IHtMb2NhbE1vZHVsZVNjb3BlLCBMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnksIExvY2FsTmdNb2R1bGVEYXRhfSBmcm9tICcuL3NyYy9sb2NhbCc7XG4iXX0=
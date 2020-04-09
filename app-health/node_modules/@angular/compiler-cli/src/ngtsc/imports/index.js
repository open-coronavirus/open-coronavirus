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
        define("@angular/compiler-cli/src/ngtsc/imports", ["require", "exports", "@angular/compiler-cli/src/ngtsc/imports/src/alias", "@angular/compiler-cli/src/ngtsc/imports/src/core", "@angular/compiler-cli/src/ngtsc/imports/src/default", "@angular/compiler-cli/src/ngtsc/imports/src/emitter", "@angular/compiler-cli/src/ngtsc/imports/src/references", "@angular/compiler-cli/src/ngtsc/imports/src/resolver"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var alias_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/alias");
    exports.AliasGenerator = alias_1.AliasGenerator;
    exports.AliasStrategy = alias_1.AliasStrategy;
    var core_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/core");
    exports.NoopImportRewriter = core_1.NoopImportRewriter;
    exports.R3SymbolsImportRewriter = core_1.R3SymbolsImportRewriter;
    exports.validateAndRewriteCoreSymbol = core_1.validateAndRewriteCoreSymbol;
    var default_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/default");
    exports.DefaultImportTracker = default_1.DefaultImportTracker;
    exports.NOOP_DEFAULT_IMPORT_RECORDER = default_1.NOOP_DEFAULT_IMPORT_RECORDER;
    var emitter_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/emitter");
    exports.AbsoluteModuleStrategy = emitter_1.AbsoluteModuleStrategy;
    exports.FileToModuleStrategy = emitter_1.FileToModuleStrategy;
    exports.LocalIdentifierStrategy = emitter_1.LocalIdentifierStrategy;
    exports.LogicalProjectStrategy = emitter_1.LogicalProjectStrategy;
    exports.ReferenceEmitter = emitter_1.ReferenceEmitter;
    var references_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/references");
    exports.ImportMode = references_1.ImportMode;
    exports.Reference = references_1.Reference;
    var resolver_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/resolver");
    exports.ModuleResolver = resolver_1.ModuleResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ltcG9ydHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwyRUFBMEQ7SUFBbEQsaUNBQUEsY0FBYyxDQUFBO0lBQUUsZ0NBQUEsYUFBYSxDQUFBO0lBQ3JDLHlFQUFxSDtJQUE3RixvQ0FBQSxrQkFBa0IsQ0FBQTtJQUFFLHlDQUFBLHVCQUF1QixDQUFBO0lBQUUsOENBQUEsNEJBQTRCLENBQUE7SUFDakcsK0VBQXdHO0lBQXpFLHlDQUFBLG9CQUFvQixDQUFBO0lBQUUsaURBQUEsNEJBQTRCLENBQUE7SUFDakYsK0VBQXVMO0lBQS9LLDJDQUFBLHNCQUFzQixDQUFBO0lBQW9CLHlDQUFBLG9CQUFvQixDQUFBO0lBQUUsNENBQUEsdUJBQXVCLENBQUE7SUFBRSwyQ0FBQSxzQkFBc0IsQ0FBQTtJQUF5QixxQ0FBQSxnQkFBZ0IsQ0FBQTtJQUVoSyxxRkFBcUU7SUFBN0Qsa0NBQUEsVUFBVSxDQUFBO0lBQWdCLGlDQUFBLFNBQVMsQ0FBQTtJQUMzQyxpRkFBOEM7SUFBdEMsb0NBQUEsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQge0FsaWFzR2VuZXJhdG9yLCBBbGlhc1N0cmF0ZWd5fSBmcm9tICcuL3NyYy9hbGlhcyc7XG5leHBvcnQge0ltcG9ydFJld3JpdGVyLCBOb29wSW1wb3J0UmV3cml0ZXIsIFIzU3ltYm9sc0ltcG9ydFJld3JpdGVyLCB2YWxpZGF0ZUFuZFJld3JpdGVDb3JlU3ltYm9sfSBmcm9tICcuL3NyYy9jb3JlJztcbmV4cG9ydCB7RGVmYXVsdEltcG9ydFJlY29yZGVyLCBEZWZhdWx0SW1wb3J0VHJhY2tlciwgTk9PUF9ERUZBVUxUX0lNUE9SVF9SRUNPUkRFUn0gZnJvbSAnLi9zcmMvZGVmYXVsdCc7XG5leHBvcnQge0Fic29sdXRlTW9kdWxlU3RyYXRlZ3ksIEZpbGVUb01vZHVsZUhvc3QsIEZpbGVUb01vZHVsZVN0cmF0ZWd5LCBMb2NhbElkZW50aWZpZXJTdHJhdGVneSwgTG9naWNhbFByb2plY3RTdHJhdGVneSwgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5LCBSZWZlcmVuY2VFbWl0dGVyfSBmcm9tICcuL3NyYy9lbWl0dGVyJztcbmV4cG9ydCB7UmVleHBvcnR9IGZyb20gJy4vc3JjL3JlZXhwb3J0JztcbmV4cG9ydCB7SW1wb3J0TW9kZSwgT3duaW5nTW9kdWxlLCBSZWZlcmVuY2V9IGZyb20gJy4vc3JjL3JlZmVyZW5jZXMnO1xuZXhwb3J0IHtNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi9zcmMvcmVzb2x2ZXInO1xuIl19
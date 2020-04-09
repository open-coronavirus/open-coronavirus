(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/file_system", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system/src/cached_file_system", "@angular/compiler-cli/src/ngtsc/file_system/src/compiler_host", "@angular/compiler-cli/src/ngtsc/file_system/src/helpers", "@angular/compiler-cli/src/ngtsc/file_system/src/logical", "@angular/compiler-cli/src/ngtsc/file_system/src/node_js_file_system", "@angular/compiler-cli/src/ngtsc/file_system/src/util"], factory);
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
    var cached_file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/cached_file_system");
    exports.CachedFileSystem = cached_file_system_1.CachedFileSystem;
    var compiler_host_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/compiler_host");
    exports.NgtscCompilerHost = compiler_host_1.NgtscCompilerHost;
    var helpers_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/helpers");
    exports.absoluteFrom = helpers_1.absoluteFrom;
    exports.absoluteFromSourceFile = helpers_1.absoluteFromSourceFile;
    exports.basename = helpers_1.basename;
    exports.dirname = helpers_1.dirname;
    exports.getFileSystem = helpers_1.getFileSystem;
    exports.isRoot = helpers_1.isRoot;
    exports.join = helpers_1.join;
    exports.relative = helpers_1.relative;
    exports.relativeFrom = helpers_1.relativeFrom;
    exports.resolve = helpers_1.resolve;
    exports.setFileSystem = helpers_1.setFileSystem;
    var logical_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/logical");
    exports.LogicalFileSystem = logical_1.LogicalFileSystem;
    exports.LogicalProjectPath = logical_1.LogicalProjectPath;
    var node_js_file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/node_js_file_system");
    exports.NodeJSFileSystem = node_js_file_system_1.NodeJSFileSystem;
    var util_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/util");
    exports.getSourceFileOrError = util_1.getSourceFileOrError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gseUdBQTBEO0lBQWxELGdEQUFBLGdCQUFnQixDQUFBO0lBQ3hCLCtGQUFzRDtJQUE5Qyw0Q0FBQSxpQkFBaUIsQ0FBQTtJQUN6QixtRkFBbUs7SUFBM0osaUNBQUEsWUFBWSxDQUFBO0lBQUUsMkNBQUEsc0JBQXNCLENBQUE7SUFBRSw2QkFBQSxRQUFRLENBQUE7SUFBRSw0QkFBQSxPQUFPLENBQUE7SUFBRSxrQ0FBQSxhQUFhLENBQUE7SUFBRSwyQkFBQSxNQUFNLENBQUE7SUFBRSx5QkFBQSxJQUFJLENBQUE7SUFBRSw2QkFBQSxRQUFRLENBQUE7SUFBRSxpQ0FBQSxZQUFZLENBQUE7SUFBRSw0QkFBQSxPQUFPLENBQUE7SUFBRSxrQ0FBQSxhQUFhLENBQUE7SUFDNUksbUZBQW9FO0lBQTVELHNDQUFBLGlCQUFpQixDQUFBO0lBQUUsdUNBQUEsa0JBQWtCLENBQUE7SUFDN0MsMkdBQTJEO0lBQW5ELGlEQUFBLGdCQUFnQixDQUFBO0lBRXhCLDZFQUFnRDtJQUF4QyxzQ0FBQSxvQkFBb0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmV4cG9ydCB7Q2FjaGVkRmlsZVN5c3RlbX0gZnJvbSAnLi9zcmMvY2FjaGVkX2ZpbGVfc3lzdGVtJztcbmV4cG9ydCB7Tmd0c2NDb21waWxlckhvc3R9IGZyb20gJy4vc3JjL2NvbXBpbGVyX2hvc3QnO1xuZXhwb3J0IHthYnNvbHV0ZUZyb20sIGFic29sdXRlRnJvbVNvdXJjZUZpbGUsIGJhc2VuYW1lLCBkaXJuYW1lLCBnZXRGaWxlU3lzdGVtLCBpc1Jvb3QsIGpvaW4sIHJlbGF0aXZlLCByZWxhdGl2ZUZyb20sIHJlc29sdmUsIHNldEZpbGVTeXN0ZW19IGZyb20gJy4vc3JjL2hlbHBlcnMnO1xuZXhwb3J0IHtMb2dpY2FsRmlsZVN5c3RlbSwgTG9naWNhbFByb2plY3RQYXRofSBmcm9tICcuL3NyYy9sb2dpY2FsJztcbmV4cG9ydCB7Tm9kZUpTRmlsZVN5c3RlbX0gZnJvbSAnLi9zcmMvbm9kZV9qc19maWxlX3N5c3RlbSc7XG5leHBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3RhdHMsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCBQYXRoU3RyaW5nfSBmcm9tICcuL3NyYy90eXBlcyc7XG5leHBvcnQge2dldFNvdXJjZUZpbGVPckVycm9yfSBmcm9tICcuL3NyYy91dGlsJztcbiJdfQ==
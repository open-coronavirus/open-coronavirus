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
        define("@angular/compiler-cli/src/ngtsc/metadata", ["require", "exports", "@angular/compiler-cli/src/ngtsc/metadata/src/dts", "@angular/compiler-cli/src/ngtsc/metadata/src/registry", "@angular/compiler-cli/src/ngtsc/metadata/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dts_1 = require("@angular/compiler-cli/src/ngtsc/metadata/src/dts");
    exports.DtsMetadataReader = dts_1.DtsMetadataReader;
    var registry_1 = require("@angular/compiler-cli/src/ngtsc/metadata/src/registry");
    exports.CompoundMetadataRegistry = registry_1.CompoundMetadataRegistry;
    exports.LocalMetadataRegistry = registry_1.LocalMetadataRegistry;
    var util_1 = require("@angular/compiler-cli/src/ngtsc/metadata/src/util");
    exports.extractDirectiveGuards = util_1.extractDirectiveGuards;
    exports.CompoundMetadataReader = util_1.CompoundMetadataReader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL21ldGFkYXRhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBR0gsd0VBQTRDO0lBQXBDLGtDQUFBLGlCQUFpQixDQUFBO0lBQ3pCLGtGQUErRTtJQUF2RSw4Q0FBQSx3QkFBd0IsQ0FBQTtJQUFFLDJDQUFBLHFCQUFxQixDQUFBO0lBQ3ZELDBFQUEwRTtJQUFsRSx3Q0FBQSxzQkFBc0IsQ0FBQTtJQUFFLHdDQUFBLHNCQUFzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL3NyYy9hcGknO1xuZXhwb3J0IHtEdHNNZXRhZGF0YVJlYWRlcn0gZnJvbSAnLi9zcmMvZHRzJztcbmV4cG9ydCB7Q29tcG91bmRNZXRhZGF0YVJlZ2lzdHJ5LCBMb2NhbE1ldGFkYXRhUmVnaXN0cnl9IGZyb20gJy4vc3JjL3JlZ2lzdHJ5JztcbmV4cG9ydCB7ZXh0cmFjdERpcmVjdGl2ZUd1YXJkcywgQ29tcG91bmRNZXRhZGF0YVJlYWRlcn0gZnJvbSAnLi9zcmMvdXRpbCc7XG4iXX0=
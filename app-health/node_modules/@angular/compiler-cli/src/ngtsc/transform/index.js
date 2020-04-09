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
        define("@angular/compiler-cli/src/ngtsc/transform", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/transform/src/api", "@angular/compiler-cli/src/ngtsc/transform/src/compilation", "@angular/compiler-cli/src/ngtsc/transform/src/declaration", "@angular/compiler-cli/src/ngtsc/transform/src/transform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    tslib_1.__exportStar(require("@angular/compiler-cli/src/ngtsc/transform/src/api"), exports);
    var compilation_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/compilation");
    exports.IvyCompilation = compilation_1.IvyCompilation;
    var declaration_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/declaration");
    exports.DtsFileTransformer = declaration_1.DtsFileTransformer;
    exports.declarationTransformFactory = declaration_1.declarationTransformFactory;
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/transform");
    exports.ivyTransformFactory = transform_1.ivyTransformFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw0RkFBMEI7SUFDMUIseUZBQWlEO0lBQXpDLHVDQUFBLGNBQWMsQ0FBQTtJQUN0Qix5RkFBa0Y7SUFBMUUsMkNBQUEsa0JBQWtCLENBQUE7SUFBRSxvREFBQSwyQkFBMkIsQ0FBQTtJQUN2RCxxRkFBb0Q7SUFBNUMsMENBQUEsbUJBQW1CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vc3JjL2FwaSc7XG5leHBvcnQge0l2eUNvbXBpbGF0aW9ufSBmcm9tICcuL3NyYy9jb21waWxhdGlvbic7XG5leHBvcnQge0R0c0ZpbGVUcmFuc2Zvcm1lciwgZGVjbGFyYXRpb25UcmFuc2Zvcm1GYWN0b3J5fSBmcm9tICcuL3NyYy9kZWNsYXJhdGlvbic7XG5leHBvcnQge2l2eVRyYW5zZm9ybUZhY3Rvcnl9IGZyb20gJy4vc3JjL3RyYW5zZm9ybSc7XG4iXX0=
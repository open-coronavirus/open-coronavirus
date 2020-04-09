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
        define("@angular/compiler-cli/src/ngtsc/shims/src/typecheck_shim", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    /**
     * A `ShimGenerator` which adds a type-checking file to the `ts.Program`.
     *
     * This is a requirement for performant template type-checking, as TypeScript will only reuse
     * information in the main program when creating the type-checking program if the set of files in
     * each are exactly the same. Thus, the main program also needs the synthetic type-checking file.
     */
    var TypeCheckShimGenerator = /** @class */ (function () {
        function TypeCheckShimGenerator(typeCheckFile) {
            this.typeCheckFile = typeCheckFile;
        }
        TypeCheckShimGenerator.prototype.recognize = function (fileName) { return fileName === this.typeCheckFile; };
        TypeCheckShimGenerator.prototype.generate = function (genFileName, readFile) {
            return ts.createSourceFile(genFileName, 'export const USED_FOR_NG_TYPE_CHECKING = true;', ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        };
        return TypeCheckShimGenerator;
    }());
    exports.TypeCheckShimGenerator = TypeCheckShimGenerator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWNoZWNrX3NoaW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3NoaW1zL3NyYy90eXBlY2hlY2tfc2hpbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQU1qQzs7Ozs7O09BTUc7SUFDSDtRQUNFLGdDQUFvQixhQUE2QjtZQUE3QixrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7UUFBRyxDQUFDO1FBRXJELDBDQUFTLEdBQVQsVUFBVSxRQUF3QixJQUFhLE9BQU8sUUFBUSxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBRXhGLHlDQUFRLEdBQVIsVUFBUyxXQUEyQixFQUFFLFFBQW9EO1lBRXhGLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUN0QixXQUFXLEVBQUUsZ0RBQWdELEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUMzRixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFDSCw2QkFBQztJQUFELENBQUMsQUFYRCxJQVdDO0lBWFksd0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vZmlsZV9zeXN0ZW0nO1xuXG5pbXBvcnQge1NoaW1HZW5lcmF0b3J9IGZyb20gJy4vaG9zdCc7XG5cbi8qKlxuICogQSBgU2hpbUdlbmVyYXRvcmAgd2hpY2ggYWRkcyBhIHR5cGUtY2hlY2tpbmcgZmlsZSB0byB0aGUgYHRzLlByb2dyYW1gLlxuICpcbiAqIFRoaXMgaXMgYSByZXF1aXJlbWVudCBmb3IgcGVyZm9ybWFudCB0ZW1wbGF0ZSB0eXBlLWNoZWNraW5nLCBhcyBUeXBlU2NyaXB0IHdpbGwgb25seSByZXVzZVxuICogaW5mb3JtYXRpb24gaW4gdGhlIG1haW4gcHJvZ3JhbSB3aGVuIGNyZWF0aW5nIHRoZSB0eXBlLWNoZWNraW5nIHByb2dyYW0gaWYgdGhlIHNldCBvZiBmaWxlcyBpblxuICogZWFjaCBhcmUgZXhhY3RseSB0aGUgc2FtZS4gVGh1cywgdGhlIG1haW4gcHJvZ3JhbSBhbHNvIG5lZWRzIHRoZSBzeW50aGV0aWMgdHlwZS1jaGVja2luZyBmaWxlLlxuICovXG5leHBvcnQgY2xhc3MgVHlwZUNoZWNrU2hpbUdlbmVyYXRvciBpbXBsZW1lbnRzIFNoaW1HZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHR5cGVDaGVja0ZpbGU6IEFic29sdXRlRnNQYXRoKSB7fVxuXG4gIHJlY29nbml6ZShmaWxlTmFtZTogQWJzb2x1dGVGc1BhdGgpOiBib29sZWFuIHsgcmV0dXJuIGZpbGVOYW1lID09PSB0aGlzLnR5cGVDaGVja0ZpbGU7IH1cblxuICBnZW5lcmF0ZShnZW5GaWxlTmFtZTogQWJzb2x1dGVGc1BhdGgsIHJlYWRGaWxlOiAoZmlsZU5hbWU6IHN0cmluZykgPT4gdHMuU291cmNlRmlsZSB8IG51bGwpOlxuICAgICAgdHMuU291cmNlRmlsZXxudWxsIHtcbiAgICByZXR1cm4gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgICAgZ2VuRmlsZU5hbWUsICdleHBvcnQgY29uc3QgVVNFRF9GT1JfTkdfVFlQRV9DSEVDS0lORyA9IHRydWU7JywgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgdHJ1ZSxcbiAgICAgICAgdHMuU2NyaXB0S2luZC5UUyk7XG4gIH1cbn1cbiJdfQ==
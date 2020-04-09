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
        define("@angular/compiler-cli/src/ngtsc/entry_point/src/generator", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/util/src/path");
    var FlatIndexGenerator = /** @class */ (function () {
        function FlatIndexGenerator(entryPoint, relativeFlatIndexPath, moduleName) {
            this.entryPoint = entryPoint;
            this.moduleName = moduleName;
            this.flatIndexPath =
                file_system_1.join(file_system_1.dirname(entryPoint), relativeFlatIndexPath).replace(/\.js$/, '') + '.ts';
        }
        FlatIndexGenerator.prototype.recognize = function (fileName) { return fileName === this.flatIndexPath; };
        FlatIndexGenerator.prototype.generate = function () {
            var relativeEntryPoint = path_1.relativePathBetween(this.flatIndexPath, this.entryPoint);
            var contents = "/**\n * Generated bundle index. Do not edit.\n */\n\nexport * from '" + relativeEntryPoint + "';\n";
            var genFile = ts.createSourceFile(this.flatIndexPath, contents, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);
            if (this.moduleName !== null) {
                genFile.moduleName = this.moduleName;
            }
            return genFile;
        };
        return FlatIndexGenerator;
    }());
    exports.FlatIndexGenerator = FlatIndexGenerator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9lbnRyeV9wb2ludC9zcmMvZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOEJBQThCO0lBRTlCLCtCQUFpQztJQUVqQywyRUFBZ0U7SUFFaEUsc0VBQXdEO0lBRXhEO1FBR0UsNEJBQ2EsVUFBMEIsRUFBRSxxQkFBNkIsRUFDekQsVUFBdUI7WUFEdkIsZUFBVSxHQUFWLFVBQVUsQ0FBZ0I7WUFDMUIsZUFBVSxHQUFWLFVBQVUsQ0FBYTtZQUNsQyxJQUFJLENBQUMsYUFBYTtnQkFDZCxrQkFBSSxDQUFDLHFCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNwRixDQUFDO1FBRUQsc0NBQVMsR0FBVCxVQUFVLFFBQWdCLElBQWEsT0FBTyxRQUFRLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFaEYscUNBQVEsR0FBUjtZQUNFLElBQU0sa0JBQWtCLEdBQUcsMEJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEYsSUFBTSxRQUFRLEdBQUcseUVBSUosa0JBQWtCLFNBQ2xDLENBQUM7WUFDRSxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQy9CLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xGLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQzVCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUN0QztZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDSCx5QkFBQztJQUFELENBQUMsQUEzQkQsSUEyQkM7SUEzQlksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cIm5vZGVcIiAvPlxuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgZGlybmFtZSwgam9pbn0gZnJvbSAnLi4vLi4vZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtTaGltR2VuZXJhdG9yfSBmcm9tICcuLi8uLi9zaGltcyc7XG5pbXBvcnQge3JlbGF0aXZlUGF0aEJldHdlZW59IGZyb20gJy4uLy4uL3V0aWwvc3JjL3BhdGgnO1xuXG5leHBvcnQgY2xhc3MgRmxhdEluZGV4R2VuZXJhdG9yIGltcGxlbWVudHMgU2hpbUdlbmVyYXRvciB7XG4gIHJlYWRvbmx5IGZsYXRJbmRleFBhdGg6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IGVudHJ5UG9pbnQ6IEFic29sdXRlRnNQYXRoLCByZWxhdGl2ZUZsYXRJbmRleFBhdGg6IHN0cmluZyxcbiAgICAgIHJlYWRvbmx5IG1vZHVsZU5hbWU6IHN0cmluZ3xudWxsKSB7XG4gICAgdGhpcy5mbGF0SW5kZXhQYXRoID1cbiAgICAgICAgam9pbihkaXJuYW1lKGVudHJ5UG9pbnQpLCByZWxhdGl2ZUZsYXRJbmRleFBhdGgpLnJlcGxhY2UoL1xcLmpzJC8sICcnKSArICcudHMnO1xuICB9XG5cbiAgcmVjb2duaXplKGZpbGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIGZpbGVOYW1lID09PSB0aGlzLmZsYXRJbmRleFBhdGg7IH1cblxuICBnZW5lcmF0ZSgpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgICBjb25zdCByZWxhdGl2ZUVudHJ5UG9pbnQgPSByZWxhdGl2ZVBhdGhCZXR3ZWVuKHRoaXMuZmxhdEluZGV4UGF0aCwgdGhpcy5lbnRyeVBvaW50KTtcbiAgICBjb25zdCBjb250ZW50cyA9IGAvKipcbiAqIEdlbmVyYXRlZCBidW5kbGUgaW5kZXguIERvIG5vdCBlZGl0LlxuICovXG5cbmV4cG9ydCAqIGZyb20gJyR7cmVsYXRpdmVFbnRyeVBvaW50fSc7XG5gO1xuICAgIGNvbnN0IGdlbkZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICB0aGlzLmZsYXRJbmRleFBhdGgsIGNvbnRlbnRzLCB0cy5TY3JpcHRUYXJnZXQuRVMyMDE1LCB0cnVlLCB0cy5TY3JpcHRLaW5kLlRTKTtcbiAgICBpZiAodGhpcy5tb2R1bGVOYW1lICE9PSBudWxsKSB7XG4gICAgICBnZW5GaWxlLm1vZHVsZU5hbWUgPSB0aGlzLm1vZHVsZU5hbWU7XG4gICAgfVxuICAgIHJldHVybiBnZW5GaWxlO1xuICB9XG59XG4iXX0=
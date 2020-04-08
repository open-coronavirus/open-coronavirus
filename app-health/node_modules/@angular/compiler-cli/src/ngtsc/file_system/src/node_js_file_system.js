(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/file_system/src/node_js_file_system", ["require", "exports", "tslib", "fs", "path", "@angular/compiler-cli/src/ngtsc/file_system/src/helpers"], factory);
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
    /// <reference types="node" />
    var fs = require("fs");
    var p = require("path");
    var helpers_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/helpers");
    /**
     * A wrapper around the Node.js file-system (i.e the `fs` package).
     */
    var NodeJSFileSystem = /** @class */ (function () {
        function NodeJSFileSystem() {
            this._caseSensitive = undefined;
        }
        NodeJSFileSystem.prototype.exists = function (path) { return fs.existsSync(path); };
        NodeJSFileSystem.prototype.readFile = function (path) { return fs.readFileSync(path, 'utf8'); };
        NodeJSFileSystem.prototype.writeFile = function (path, data) {
            return fs.writeFileSync(path, data, 'utf8');
        };
        NodeJSFileSystem.prototype.symlink = function (target, path) { fs.symlinkSync(target, path); };
        NodeJSFileSystem.prototype.readdir = function (path) { return fs.readdirSync(path); };
        NodeJSFileSystem.prototype.lstat = function (path) { return fs.lstatSync(path); };
        NodeJSFileSystem.prototype.stat = function (path) { return fs.statSync(path); };
        NodeJSFileSystem.prototype.pwd = function () { return this.normalize(process.cwd()); };
        NodeJSFileSystem.prototype.copyFile = function (from, to) { fs.copyFileSync(from, to); };
        NodeJSFileSystem.prototype.moveFile = function (from, to) { fs.renameSync(from, to); };
        NodeJSFileSystem.prototype.mkdir = function (path) { fs.mkdirSync(path); };
        NodeJSFileSystem.prototype.ensureDir = function (path) {
            var parents = [];
            while (!this.isRoot(path) && !this.exists(path)) {
                parents.push(path);
                path = this.dirname(path);
            }
            while (parents.length) {
                this.mkdir(parents.pop());
            }
        };
        NodeJSFileSystem.prototype.isCaseSensitive = function () {
            if (this._caseSensitive === undefined) {
                this._caseSensitive = this.exists(togglePathCase(__filename));
            }
            return this._caseSensitive;
        };
        NodeJSFileSystem.prototype.resolve = function () {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            return this.normalize(p.resolve.apply(p, tslib_1.__spread(paths)));
        };
        NodeJSFileSystem.prototype.dirname = function (file) { return this.normalize(p.dirname(file)); };
        NodeJSFileSystem.prototype.join = function (basePath) {
            var paths = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                paths[_i - 1] = arguments[_i];
            }
            return this.normalize(p.join.apply(p, tslib_1.__spread([basePath], paths)));
        };
        NodeJSFileSystem.prototype.isRoot = function (path) { return this.dirname(path) === this.normalize(path); };
        NodeJSFileSystem.prototype.isRooted = function (path) { return p.isAbsolute(path); };
        NodeJSFileSystem.prototype.relative = function (from, to) {
            return helpers_1.relativeFrom(this.normalize(p.relative(from, to)));
        };
        NodeJSFileSystem.prototype.basename = function (filePath, extension) {
            return p.basename(filePath, extension);
        };
        NodeJSFileSystem.prototype.extname = function (path) { return p.extname(path); };
        NodeJSFileSystem.prototype.realpath = function (path) { return this.resolve(fs.realpathSync(path)); };
        NodeJSFileSystem.prototype.getDefaultLibLocation = function () {
            return this.resolve(require.resolve('typescript'), '..');
        };
        NodeJSFileSystem.prototype.normalize = function (path) {
            // Convert backslashes to forward slashes
            return path.replace(/\\/g, '/');
        };
        return NodeJSFileSystem;
    }());
    exports.NodeJSFileSystem = NodeJSFileSystem;
    /**
     * Toggle the case of each character in a file path.
     */
    function togglePathCase(str) {
        return helpers_1.absoluteFrom(str.replace(/\w/g, function (ch) { return ch.toUpperCase() === ch ? ch.toLowerCase() : ch.toUpperCase(); }));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9qc19maWxlX3N5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0vc3JjL25vZGVfanNfZmlsZV9zeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOEJBQThCO0lBQzlCLHVCQUF5QjtJQUN6Qix3QkFBMEI7SUFDMUIsbUZBQXFEO0lBR3JEOztPQUVHO0lBQ0g7UUFBQTtZQUNVLG1CQUFjLEdBQXNCLFNBQVMsQ0FBQztRQXVEeEQsQ0FBQztRQXREQyxpQ0FBTSxHQUFOLFVBQU8sSUFBb0IsSUFBYSxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLG1DQUFRLEdBQVIsVUFBUyxJQUFvQixJQUFZLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLG9DQUFTLEdBQVQsVUFBVSxJQUFvQixFQUFFLElBQVk7WUFDMUMsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELGtDQUFPLEdBQVAsVUFBUSxNQUFzQixFQUFFLElBQW9CLElBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdGLGtDQUFPLEdBQVAsVUFBUSxJQUFvQixJQUFtQixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFrQixDQUFDLENBQUMsQ0FBQztRQUM5RixnQ0FBSyxHQUFMLFVBQU0sSUFBb0IsSUFBZSxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLCtCQUFJLEdBQUosVUFBSyxJQUFvQixJQUFlLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkUsOEJBQUcsR0FBSCxjQUF3QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFtQixDQUFDLENBQUMsQ0FBQztRQUNqRixtQ0FBUSxHQUFSLFVBQVMsSUFBb0IsRUFBRSxFQUFrQixJQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RixtQ0FBUSxHQUFSLFVBQVMsSUFBb0IsRUFBRSxFQUFrQixJQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixnQ0FBSyxHQUFMLFVBQU0sSUFBb0IsSUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxvQ0FBUyxHQUFULFVBQVUsSUFBb0I7WUFDNUIsSUFBTSxPQUFPLEdBQXFCLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25CLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNCO1lBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUksQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQztRQUNELDBDQUFlLEdBQWY7WUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDL0Q7WUFDRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQztRQUNELGtDQUFPLEdBQVA7WUFBUSxlQUFrQjtpQkFBbEIsVUFBa0IsRUFBbEIscUJBQWtCLEVBQWxCLElBQWtCO2dCQUFsQiwwQkFBa0I7O1lBQ3hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFULENBQUMsbUJBQVksS0FBSyxHQUFvQixDQUFDO1FBQy9ELENBQUM7UUFFRCxrQ0FBTyxHQUFQLFVBQTBCLElBQU8sSUFBTyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBTSxDQUFDLENBQUMsQ0FBQztRQUN0RiwrQkFBSSxHQUFKLFVBQXVCLFFBQVc7WUFBRSxlQUFrQjtpQkFBbEIsVUFBa0IsRUFBbEIscUJBQWtCLEVBQWxCLElBQWtCO2dCQUFsQiw4QkFBa0I7O1lBQ3BELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFOLENBQUMsb0JBQU0sUUFBUSxHQUFLLEtBQUssR0FBTyxDQUFDO1FBQ3pELENBQUM7UUFDRCxpQ0FBTSxHQUFOLFVBQU8sSUFBb0IsSUFBYSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0YsbUNBQVEsR0FBUixVQUFTLElBQVksSUFBYSxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELG1DQUFRLEdBQVIsVUFBK0IsSUFBTyxFQUFFLEVBQUs7WUFDM0MsT0FBTyxzQkFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxtQ0FBUSxHQUFSLFVBQVMsUUFBZ0IsRUFBRSxTQUFrQjtZQUMzQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBZ0IsQ0FBQztRQUN4RCxDQUFDO1FBQ0Qsa0NBQU8sR0FBUCxVQUFRLElBQWdDLElBQVksT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RSxtQ0FBUSxHQUFSLFVBQVMsSUFBb0IsSUFBb0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsZ0RBQXFCLEdBQXJCO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELG9DQUFTLEdBQVQsVUFBNEIsSUFBTztZQUNqQyx5Q0FBeUM7WUFDekMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQU0sQ0FBQztRQUN2QyxDQUFDO1FBQ0gsdUJBQUM7SUFBRCxDQUFDLEFBeERELElBd0RDO0lBeERZLDRDQUFnQjtJQTBEN0I7O09BRUc7SUFDSCxTQUFTLGNBQWMsQ0FBQyxHQUFXO1FBQ2pDLE9BQU8sc0JBQVksQ0FDZixHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUE3RCxDQUE2RCxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJub2RlXCIgLz5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHAgZnJvbSAncGF0aCc7XG5pbXBvcnQge2Fic29sdXRlRnJvbSwgcmVsYXRpdmVGcm9tfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN0YXRzLCBGaWxlU3lzdGVtLCBQYXRoU2VnbWVudCwgUGF0aFN0cmluZ30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogQSB3cmFwcGVyIGFyb3VuZCB0aGUgTm9kZS5qcyBmaWxlLXN5c3RlbSAoaS5lIHRoZSBgZnNgIHBhY2thZ2UpLlxuICovXG5leHBvcnQgY2xhc3MgTm9kZUpTRmlsZVN5c3RlbSBpbXBsZW1lbnRzIEZpbGVTeXN0ZW0ge1xuICBwcml2YXRlIF9jYXNlU2Vuc2l0aXZlOiBib29sZWFufHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgZXhpc3RzKHBhdGg6IEFic29sdXRlRnNQYXRoKTogYm9vbGVhbiB7IHJldHVybiBmcy5leGlzdHNTeW5jKHBhdGgpOyB9XG4gIHJlYWRGaWxlKHBhdGg6IEFic29sdXRlRnNQYXRoKTogc3RyaW5nIHsgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhwYXRoLCAndXRmOCcpOyB9XG4gIHdyaXRlRmlsZShwYXRoOiBBYnNvbHV0ZUZzUGF0aCwgZGF0YTogc3RyaW5nKTogdm9pZCB7XG4gICAgcmV0dXJuIGZzLndyaXRlRmlsZVN5bmMocGF0aCwgZGF0YSwgJ3V0ZjgnKTtcbiAgfVxuICBzeW1saW5rKHRhcmdldDogQWJzb2x1dGVGc1BhdGgsIHBhdGg6IEFic29sdXRlRnNQYXRoKTogdm9pZCB7IGZzLnN5bWxpbmtTeW5jKHRhcmdldCwgcGF0aCk7IH1cbiAgcmVhZGRpcihwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IFBhdGhTZWdtZW50W10geyByZXR1cm4gZnMucmVhZGRpclN5bmMocGF0aCkgYXMgUGF0aFNlZ21lbnRbXTsgfVxuICBsc3RhdChwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEZpbGVTdGF0cyB7IHJldHVybiBmcy5sc3RhdFN5bmMocGF0aCk7IH1cbiAgc3RhdChwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEZpbGVTdGF0cyB7IHJldHVybiBmcy5zdGF0U3luYyhwYXRoKTsgfVxuICBwd2QoKTogQWJzb2x1dGVGc1BhdGggeyByZXR1cm4gdGhpcy5ub3JtYWxpemUocHJvY2Vzcy5jd2QoKSkgYXMgQWJzb2x1dGVGc1BhdGg7IH1cbiAgY29weUZpbGUoZnJvbTogQWJzb2x1dGVGc1BhdGgsIHRvOiBBYnNvbHV0ZUZzUGF0aCk6IHZvaWQgeyBmcy5jb3B5RmlsZVN5bmMoZnJvbSwgdG8pOyB9XG4gIG1vdmVGaWxlKGZyb206IEFic29sdXRlRnNQYXRoLCB0bzogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHsgZnMucmVuYW1lU3luYyhmcm9tLCB0byk7IH1cbiAgbWtkaXIocGF0aDogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHsgZnMubWtkaXJTeW5jKHBhdGgpOyB9XG4gIGVuc3VyZURpcihwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmVudHM6IEFic29sdXRlRnNQYXRoW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuaXNSb290KHBhdGgpICYmICF0aGlzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgcGFyZW50cy5wdXNoKHBhdGgpO1xuICAgICAgcGF0aCA9IHRoaXMuZGlybmFtZShwYXRoKTtcbiAgICB9XG4gICAgd2hpbGUgKHBhcmVudHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm1rZGlyKHBhcmVudHMucG9wKCkgISk7XG4gICAgfVxuICB9XG4gIGlzQ2FzZVNlbnNpdGl2ZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fY2FzZVNlbnNpdGl2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9jYXNlU2Vuc2l0aXZlID0gdGhpcy5leGlzdHModG9nZ2xlUGF0aENhc2UoX19maWxlbmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY2FzZVNlbnNpdGl2ZTtcbiAgfVxuICByZXNvbHZlKC4uLnBhdGhzOiBzdHJpbmdbXSk6IEFic29sdXRlRnNQYXRoIHtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUocC5yZXNvbHZlKC4uLnBhdGhzKSkgYXMgQWJzb2x1dGVGc1BhdGg7XG4gIH1cblxuICBkaXJuYW1lPFQgZXh0ZW5kcyBzdHJpbmc+KGZpbGU6IFQpOiBUIHsgcmV0dXJuIHRoaXMubm9ybWFsaXplKHAuZGlybmFtZShmaWxlKSkgYXMgVDsgfVxuICBqb2luPFQgZXh0ZW5kcyBzdHJpbmc+KGJhc2VQYXRoOiBULCAuLi5wYXRoczogc3RyaW5nW10pOiBUIHtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUocC5qb2luKGJhc2VQYXRoLCAuLi5wYXRocykpIGFzIFQ7XG4gIH1cbiAgaXNSb290KHBhdGg6IEFic29sdXRlRnNQYXRoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmRpcm5hbWUocGF0aCkgPT09IHRoaXMubm9ybWFsaXplKHBhdGgpOyB9XG4gIGlzUm9vdGVkKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gcC5pc0Fic29sdXRlKHBhdGgpOyB9XG4gIHJlbGF0aXZlPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihmcm9tOiBULCB0bzogVCk6IFBhdGhTZWdtZW50IHtcbiAgICByZXR1cm4gcmVsYXRpdmVGcm9tKHRoaXMubm9ybWFsaXplKHAucmVsYXRpdmUoZnJvbSwgdG8pKSk7XG4gIH1cbiAgYmFzZW5hbWUoZmlsZVBhdGg6IHN0cmluZywgZXh0ZW5zaW9uPzogc3RyaW5nKTogUGF0aFNlZ21lbnQge1xuICAgIHJldHVybiBwLmJhc2VuYW1lKGZpbGVQYXRoLCBleHRlbnNpb24pIGFzIFBhdGhTZWdtZW50O1xuICB9XG4gIGV4dG5hbWUocGF0aDogQWJzb2x1dGVGc1BhdGh8UGF0aFNlZ21lbnQpOiBzdHJpbmcgeyByZXR1cm4gcC5leHRuYW1lKHBhdGgpOyB9XG4gIHJlYWxwYXRoKHBhdGg6IEFic29sdXRlRnNQYXRoKTogQWJzb2x1dGVGc1BhdGggeyByZXR1cm4gdGhpcy5yZXNvbHZlKGZzLnJlYWxwYXRoU3luYyhwYXRoKSk7IH1cbiAgZ2V0RGVmYXVsdExpYkxvY2F0aW9uKCk6IEFic29sdXRlRnNQYXRoIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlKHJlcXVpcmUucmVzb2x2ZSgndHlwZXNjcmlwdCcpLCAnLi4nKTtcbiAgfVxuICBub3JtYWxpemU8VCBleHRlbmRzIHN0cmluZz4ocGF0aDogVCk6IFQge1xuICAgIC8vIENvbnZlcnQgYmFja3NsYXNoZXMgdG8gZm9yd2FyZCBzbGFzaGVzXG4gICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpIGFzIFQ7XG4gIH1cbn1cblxuLyoqXG4gKiBUb2dnbGUgdGhlIGNhc2Ugb2YgZWFjaCBjaGFyYWN0ZXIgaW4gYSBmaWxlIHBhdGguXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZVBhdGhDYXNlKHN0cjogc3RyaW5nKTogQWJzb2x1dGVGc1BhdGgge1xuICByZXR1cm4gYWJzb2x1dGVGcm9tKFxuICAgICAgc3RyLnJlcGxhY2UoL1xcdy9nLCBjaCA9PiBjaC50b1VwcGVyQ2FzZSgpID09PSBjaCA/IGNoLnRvTG93ZXJDYXNlKCkgOiBjaC50b1VwcGVyQ2FzZSgpKSk7XG59XG4iXX0=
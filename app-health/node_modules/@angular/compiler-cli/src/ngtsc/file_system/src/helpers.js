(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/file_system/src/helpers", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system/src/invalid_file_system", "@angular/compiler-cli/src/ngtsc/file_system/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var invalid_file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/invalid_file_system");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/util");
    var fs = new invalid_file_system_1.InvalidFileSystem();
    function getFileSystem() {
        return fs;
    }
    exports.getFileSystem = getFileSystem;
    function setFileSystem(fileSystem) {
        fs = fileSystem;
    }
    exports.setFileSystem = setFileSystem;
    /**
     * Convert the path `path` to an `AbsoluteFsPath`, throwing an error if it's not an absolute path.
     */
    function absoluteFrom(path) {
        if (!fs.isRooted(path)) {
            throw new Error("Internal Error: absoluteFrom(" + path + "): path is not absolute");
        }
        return fs.resolve(path);
    }
    exports.absoluteFrom = absoluteFrom;
    /**
     * Extract an `AbsoluteFsPath` from a `ts.SourceFile`.
     */
    function absoluteFromSourceFile(sf) {
        return fs.resolve(sf.fileName);
    }
    exports.absoluteFromSourceFile = absoluteFromSourceFile;
    /**
    * Convert the path `path` to a `PathSegment`, throwing an error if it's not a relative path.
    */
    function relativeFrom(path) {
        var normalized = util_1.normalizeSeparators(path);
        if (fs.isRooted(normalized)) {
            throw new Error("Internal Error: relativeFrom(" + path + "): path is not relative");
        }
        return normalized;
    }
    exports.relativeFrom = relativeFrom;
    /**
     * Static access to `dirname`.
     */
    function dirname(file) {
        return fs.dirname(file);
    }
    exports.dirname = dirname;
    /**
     * Static access to `join`.
     */
    function join(basePath) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        return fs.join.apply(fs, tslib_1.__spread([basePath], paths));
    }
    exports.join = join;
    /**
     * Static access to `resolve`s.
     */
    function resolve(basePath) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        return fs.resolve.apply(fs, tslib_1.__spread([basePath], paths));
    }
    exports.resolve = resolve;
    /** Returns true when the path provided is the root path. */
    function isRoot(path) {
        return fs.isRoot(path);
    }
    exports.isRoot = isRoot;
    /**
     * Static access to `relative`.
     */
    function relative(from, to) {
        return fs.relative(from, to);
    }
    exports.relative = relative;
    /**
     * Static access to `basename`.
     */
    function basename(filePath, extension) {
        return fs.basename(filePath, extension);
    }
    exports.basename = basename;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0vc3JjL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBU0EsMkdBQXdEO0lBRXhELDZFQUEyQztJQUUzQyxJQUFJLEVBQUUsR0FBZSxJQUFJLHVDQUFpQixFQUFFLENBQUM7SUFDN0MsU0FBZ0IsYUFBYTtRQUMzQixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFGRCxzQ0FFQztJQUNELFNBQWdCLGFBQWEsQ0FBQyxVQUFzQjtRQUNsRCxFQUFFLEdBQUcsVUFBVSxDQUFDO0lBQ2xCLENBQUM7SUFGRCxzQ0FFQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsWUFBWSxDQUFDLElBQVk7UUFDdkMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBZ0MsSUFBSSw0QkFBeUIsQ0FBQyxDQUFDO1NBQ2hGO1FBQ0QsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFMRCxvQ0FLQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsRUFBaUI7UUFDdEQsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRkQsd0RBRUM7SUFFRDs7TUFFRTtJQUNGLFNBQWdCLFlBQVksQ0FBQyxJQUFZO1FBQ3ZDLElBQU0sVUFBVSxHQUFHLDBCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFnQyxJQUFJLDRCQUF5QixDQUFDLENBQUM7U0FDaEY7UUFDRCxPQUFPLFVBQXlCLENBQUM7SUFDbkMsQ0FBQztJQU5ELG9DQU1DO0lBRUQ7O09BRUc7SUFDSCxTQUFnQixPQUFPLENBQXVCLElBQU87UUFDbkQsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFGRCwwQkFFQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsSUFBSSxDQUF1QixRQUFXO1FBQUUsZUFBa0I7YUFBbEIsVUFBa0IsRUFBbEIscUJBQWtCLEVBQWxCLElBQWtCO1lBQWxCLDhCQUFrQjs7UUFDeEUsT0FBTyxFQUFFLENBQUMsSUFBSSxPQUFQLEVBQUUsb0JBQU0sUUFBUSxHQUFLLEtBQUssR0FBRTtJQUNyQyxDQUFDO0lBRkQsb0JBRUM7SUFFRDs7T0FFRztJQUNILFNBQWdCLE9BQU8sQ0FBQyxRQUFnQjtRQUFFLGVBQWtCO2FBQWxCLFVBQWtCLEVBQWxCLHFCQUFrQixFQUFsQixJQUFrQjtZQUFsQiw4QkFBa0I7O1FBQzFELE9BQU8sRUFBRSxDQUFDLE9BQU8sT0FBVixFQUFFLG9CQUFTLFFBQVEsR0FBSyxLQUFLLEdBQUU7SUFDeEMsQ0FBQztJQUZELDBCQUVDO0lBRUQsNERBQTREO0lBQzVELFNBQWdCLE1BQU0sQ0FBQyxJQUFvQjtRQUN6QyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUZELHdCQUVDO0lBRUQ7O09BRUc7SUFDSCxTQUFnQixRQUFRLENBQXVCLElBQU8sRUFBRSxFQUFLO1FBQzNELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUZELDRCQUVDO0lBRUQ7O09BRUc7SUFDSCxTQUFnQixRQUFRLENBQUMsUUFBb0IsRUFBRSxTQUFrQjtRQUMvRCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBZ0IsQ0FBQztJQUN6RCxDQUFDO0lBRkQsNEJBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtJbnZhbGlkRmlsZVN5c3RlbX0gZnJvbSAnLi9pbnZhbGlkX2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCBQYXRoU3RyaW5nfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7bm9ybWFsaXplU2VwYXJhdG9yc30gZnJvbSAnLi91dGlsJztcblxubGV0IGZzOiBGaWxlU3lzdGVtID0gbmV3IEludmFsaWRGaWxlU3lzdGVtKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZVN5c3RlbSgpOiBGaWxlU3lzdGVtIHtcbiAgcmV0dXJuIGZzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbGVTeXN0ZW0oZmlsZVN5c3RlbTogRmlsZVN5c3RlbSkge1xuICBmcyA9IGZpbGVTeXN0ZW07XG59XG5cbi8qKlxuICogQ29udmVydCB0aGUgcGF0aCBgcGF0aGAgdG8gYW4gYEFic29sdXRlRnNQYXRoYCwgdGhyb3dpbmcgYW4gZXJyb3IgaWYgaXQncyBub3QgYW4gYWJzb2x1dGUgcGF0aC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFic29sdXRlRnJvbShwYXRoOiBzdHJpbmcpOiBBYnNvbHV0ZUZzUGF0aCB7XG4gIGlmICghZnMuaXNSb290ZWQocGF0aCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludGVybmFsIEVycm9yOiBhYnNvbHV0ZUZyb20oJHtwYXRofSk6IHBhdGggaXMgbm90IGFic29sdXRlYCk7XG4gIH1cbiAgcmV0dXJuIGZzLnJlc29sdmUocGF0aCk7XG59XG5cbi8qKlxuICogRXh0cmFjdCBhbiBgQWJzb2x1dGVGc1BhdGhgIGZyb20gYSBgdHMuU291cmNlRmlsZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKHNmOiB0cy5Tb3VyY2VGaWxlKTogQWJzb2x1dGVGc1BhdGgge1xuICByZXR1cm4gZnMucmVzb2x2ZShzZi5maWxlTmFtZSk7XG59XG5cbi8qKlxuKiBDb252ZXJ0IHRoZSBwYXRoIGBwYXRoYCB0byBhIGBQYXRoU2VnbWVudGAsIHRocm93aW5nIGFuIGVycm9yIGlmIGl0J3Mgbm90IGEgcmVsYXRpdmUgcGF0aC5cbiovXG5leHBvcnQgZnVuY3Rpb24gcmVsYXRpdmVGcm9tKHBhdGg6IHN0cmluZyk6IFBhdGhTZWdtZW50IHtcbiAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNlcGFyYXRvcnMocGF0aCk7XG4gIGlmIChmcy5pc1Jvb3RlZChub3JtYWxpemVkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWwgRXJyb3I6IHJlbGF0aXZlRnJvbSgke3BhdGh9KTogcGF0aCBpcyBub3QgcmVsYXRpdmVgKTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplZCBhcyBQYXRoU2VnbWVudDtcbn1cblxuLyoqXG4gKiBTdGF0aWMgYWNjZXNzIHRvIGBkaXJuYW1lYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpcm5hbWU8VCBleHRlbmRzIFBhdGhTdHJpbmc+KGZpbGU6IFQpOiBUIHtcbiAgcmV0dXJuIGZzLmRpcm5hbWUoZmlsZSk7XG59XG5cbi8qKlxuICogU3RhdGljIGFjY2VzcyB0byBgam9pbmAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqb2luPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihiYXNlUGF0aDogVCwgLi4ucGF0aHM6IHN0cmluZ1tdKTogVCB7XG4gIHJldHVybiBmcy5qb2luKGJhc2VQYXRoLCAuLi5wYXRocyk7XG59XG5cbi8qKlxuICogU3RhdGljIGFjY2VzcyB0byBgcmVzb2x2ZWBzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZShiYXNlUGF0aDogc3RyaW5nLCAuLi5wYXRoczogc3RyaW5nW10pOiBBYnNvbHV0ZUZzUGF0aCB7XG4gIHJldHVybiBmcy5yZXNvbHZlKGJhc2VQYXRoLCAuLi5wYXRocyk7XG59XG5cbi8qKiBSZXR1cm5zIHRydWUgd2hlbiB0aGUgcGF0aCBwcm92aWRlZCBpcyB0aGUgcm9vdCBwYXRoLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUm9vdChwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZnMuaXNSb290KHBhdGgpO1xufVxuXG4vKipcbiAqIFN0YXRpYyBhY2Nlc3MgdG8gYHJlbGF0aXZlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbGF0aXZlPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihmcm9tOiBULCB0bzogVCk6IFBhdGhTZWdtZW50IHtcbiAgcmV0dXJuIGZzLnJlbGF0aXZlKGZyb20sIHRvKTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgYWNjZXNzIHRvIGBiYXNlbmFtZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShmaWxlUGF0aDogUGF0aFN0cmluZywgZXh0ZW5zaW9uPzogc3RyaW5nKTogUGF0aFNlZ21lbnQge1xuICByZXR1cm4gZnMuYmFzZW5hbWUoZmlsZVBhdGgsIGV4dGVuc2lvbikgYXMgUGF0aFNlZ21lbnQ7XG59XG4iXX0=
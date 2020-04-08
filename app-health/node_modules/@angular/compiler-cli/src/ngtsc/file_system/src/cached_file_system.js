(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/file_system/src/cached_file_system", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * A wrapper around `FileSystem` that caches hits to `exists()` and
     * `readFile()` to improve performance.
     *
     * Be aware that any changes to the file system from outside of this
     * class could break the cache, leaving it with stale values.
     */
    var CachedFileSystem = /** @class */ (function () {
        function CachedFileSystem(delegate) {
            this.delegate = delegate;
            this.existsCache = new Map();
            this.readFileCache = new Map();
        }
        CachedFileSystem.prototype.exists = function (path) {
            if (!this.existsCache.has(path)) {
                this.existsCache.set(path, this.delegate.exists(path));
            }
            return this.existsCache.get(path);
        };
        CachedFileSystem.prototype.readFile = function (path) {
            if (!this.readFileCache.has(path)) {
                try {
                    if (this.lstat(path).isSymbolicLink()) {
                        // don't cache the value of a symbolic link
                        return this.delegate.readFile(path);
                    }
                    this.readFileCache.set(path, this.delegate.readFile(path));
                }
                catch (e) {
                    this.readFileCache.set(path, e);
                }
            }
            var result = this.readFileCache.get(path);
            if (typeof result === 'string') {
                return result;
            }
            else {
                throw result;
            }
        };
        CachedFileSystem.prototype.writeFile = function (path, data) {
            this.delegate.writeFile(path, data);
            this.readFileCache.set(path, data);
            this.existsCache.set(path, true);
        };
        CachedFileSystem.prototype.symlink = function (target, path) {
            this.delegate.symlink(target, path);
            this.existsCache.set(path, true);
        };
        CachedFileSystem.prototype.copyFile = function (from, to) {
            this.delegate.copyFile(from, to);
            this.existsCache.set(to, true);
        };
        CachedFileSystem.prototype.moveFile = function (from, to) {
            this.delegate.moveFile(from, to);
            this.existsCache.set(from, false);
            if (this.readFileCache.has(from)) {
                this.readFileCache.set(to, this.readFileCache.get(from));
                this.readFileCache.delete(from);
            }
            this.existsCache.set(to, true);
        };
        CachedFileSystem.prototype.mkdir = function (path) {
            this.delegate.mkdir(path);
            this.existsCache.set(path, true);
        };
        CachedFileSystem.prototype.ensureDir = function (path) {
            this.delegate.ensureDir(path);
            while (!this.isRoot(path)) {
                this.existsCache.set(path, true);
                path = this.dirname(path);
            }
        };
        CachedFileSystem.prototype.lstat = function (path) {
            var stat = this.delegate.lstat(path);
            // if the `path` does not exist then `lstat` will thrown an error.
            this.existsCache.set(path, true);
            return stat;
        };
        CachedFileSystem.prototype.stat = function (path) {
            var stat = this.delegate.stat(path);
            // if the `path` does not exist then `stat` will thrown an error.
            this.existsCache.set(path, true);
            return stat;
        };
        // The following methods simply call through to the delegate.
        CachedFileSystem.prototype.readdir = function (path) { return this.delegate.readdir(path); };
        CachedFileSystem.prototype.pwd = function () { return this.delegate.pwd(); };
        CachedFileSystem.prototype.extname = function (path) { return this.delegate.extname(path); };
        CachedFileSystem.prototype.isCaseSensitive = function () { return this.delegate.isCaseSensitive(); };
        CachedFileSystem.prototype.isRoot = function (path) { return this.delegate.isRoot(path); };
        CachedFileSystem.prototype.isRooted = function (path) { return this.delegate.isRooted(path); };
        CachedFileSystem.prototype.resolve = function () {
            var _a;
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            return (_a = this.delegate).resolve.apply(_a, tslib_1.__spread(paths));
        };
        CachedFileSystem.prototype.dirname = function (file) { return this.delegate.dirname(file); };
        CachedFileSystem.prototype.join = function (basePath) {
            var _a;
            var paths = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                paths[_i - 1] = arguments[_i];
            }
            return (_a = this.delegate).join.apply(_a, tslib_1.__spread([basePath], paths));
        };
        CachedFileSystem.prototype.relative = function (from, to) {
            return this.delegate.relative(from, to);
        };
        CachedFileSystem.prototype.basename = function (filePath, extension) {
            return this.delegate.basename(filePath, extension);
        };
        CachedFileSystem.prototype.realpath = function (filePath) { return this.delegate.realpath(filePath); };
        CachedFileSystem.prototype.getDefaultLibLocation = function () { return this.delegate.getDefaultLibLocation(); };
        CachedFileSystem.prototype.normalize = function (path) { return this.delegate.normalize(path); };
        return CachedFileSystem;
    }());
    exports.CachedFileSystem = CachedFileSystem;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkX2ZpbGVfc3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbS9zcmMvY2FjaGVkX2ZpbGVfc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVVBOzs7Ozs7T0FNRztJQUNIO1FBSUUsMEJBQW9CLFFBQW9CO1lBQXBCLGFBQVEsR0FBUixRQUFRLENBQVk7WUFIaEMsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztZQUNqRCxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1FBRVosQ0FBQztRQUU1QyxpQ0FBTSxHQUFOLFVBQU8sSUFBb0I7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN4RDtZQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFHLENBQUM7UUFDdEMsQ0FBQztRQUVELG1DQUFRLEdBQVIsVUFBUyxJQUFvQjtZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pDLElBQUk7b0JBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO3dCQUNyQywyQ0FBMkM7d0JBQzNDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3JDO29CQUNELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJ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LHVCQUFDO0lBQUQsQ0FBQyxBQTNHRCxJQTJHQztJQTNHWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3RhdHMsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCBQYXRoU3RyaW5nfSBmcm9tICcuL3R5cGVzJztcblxuXG4vKipcbiAqIEEgd3JhcHBlciBhcm91bmQgYEZpbGVTeXN0ZW1gIHRoYXQgY2FjaGVzIGhpdHMgdG8gYGV4aXN0cygpYCBhbmRcbiAqIGByZWFkRmlsZSgpYCB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLlxuICpcbiAqIEJlIGF3YXJlIHRoYXQgYW55IGNoYW5nZXMgdG8gdGhlIGZpbGUgc3lzdGVtIGZyb20gb3V0c2lkZSBvZiB0aGlzXG4gKiBjbGFzcyBjb3VsZCBicmVhayB0aGUgY2FjaGUsIGxlYXZpbmcgaXQgd2l0aCBzdGFsZSB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYWNoZWRGaWxlU3lzdGVtIGltcGxlbWVudHMgRmlsZVN5c3RlbSB7XG4gIHByaXZhdGUgZXhpc3RzQ2FjaGUgPSBuZXcgTWFwPEFic29sdXRlRnNQYXRoLCBib29sZWFuPigpO1xuICBwcml2YXRlIHJlYWRGaWxlQ2FjaGUgPSBuZXcgTWFwPEFic29sdXRlRnNQYXRoLCBhbnk+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkZWxlZ2F0ZTogRmlsZVN5c3RlbSkge31cblxuICBleGlzdHMocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuZXhpc3RzQ2FjaGUuaGFzKHBhdGgpKSB7XG4gICAgICB0aGlzLmV4aXN0c0NhY2hlLnNldChwYXRoLCB0aGlzLmRlbGVnYXRlLmV4aXN0cyhwYXRoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4aXN0c0NhY2hlLmdldChwYXRoKSAhO1xuICB9XG5cbiAgcmVhZEZpbGUocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5yZWFkRmlsZUNhY2hlLmhhcyhwYXRoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMubHN0YXQocGF0aCkuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICAgIC8vIGRvbid0IGNhY2hlIHRoZSB2YWx1ZSBvZiBhIHN5bWJvbGljIGxpbmtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5yZWFkRmlsZShwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlYWRGaWxlQ2FjaGUuc2V0KHBhdGgsIHRoaXMuZGVsZWdhdGUucmVhZEZpbGUocGF0aCkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLnJlYWRGaWxlQ2FjaGUuc2V0KHBhdGgsIGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJlYWRGaWxlQ2FjaGUuZ2V0KHBhdGgpO1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIHdyaXRlRmlsZShwYXRoOiBBYnNvbHV0ZUZzUGF0aCwgZGF0YTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kZWxlZ2F0ZS53cml0ZUZpbGUocGF0aCwgZGF0YSk7XG4gICAgdGhpcy5yZWFkRmlsZUNhY2hlLnNldChwYXRoLCBkYXRhKTtcbiAgICB0aGlzLmV4aXN0c0NhY2hlLnNldChwYXRoLCB0cnVlKTtcbiAgfVxuXG4gIHN5bWxpbmsodGFyZ2V0OiBBYnNvbHV0ZUZzUGF0aCwgcGF0aDogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHtcbiAgICB0aGlzLmRlbGVnYXRlLnN5bWxpbmsodGFyZ2V0LCBwYXRoKTtcbiAgICB0aGlzLmV4aXN0c0NhY2hlLnNldChwYXRoLCB0cnVlKTtcbiAgfVxuXG4gIGNvcHlGaWxlKGZyb206IEFic29sdXRlRnNQYXRoLCB0bzogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHtcbiAgICB0aGlzLmRlbGVnYXRlLmNvcHlGaWxlKGZyb20sIHRvKTtcbiAgICB0aGlzLmV4aXN0c0NhY2hlLnNldCh0bywgdHJ1ZSk7XG4gIH1cblxuICBtb3ZlRmlsZShmcm9tOiBBYnNvbHV0ZUZzUGF0aCwgdG86IEFic29sdXRlRnNQYXRoKTogdm9pZCB7XG4gICAgdGhpcy5kZWxlZ2F0ZS5tb3ZlRmlsZShmcm9tLCB0byk7XG4gICAgdGhpcy5leGlzdHNDYWNoZS5zZXQoZnJvbSwgZmFsc2UpO1xuICAgIGlmICh0aGlzLnJlYWRGaWxlQ2FjaGUuaGFzKGZyb20pKSB7XG4gICAgICB0aGlzLnJlYWRGaWxlQ2FjaGUuc2V0KHRvLCB0aGlzLnJlYWRGaWxlQ2FjaGUuZ2V0KGZyb20pKTtcbiAgICAgIHRoaXMucmVhZEZpbGVDYWNoZS5kZWxldGUoZnJvbSk7XG4gICAgfVxuICAgIHRoaXMuZXhpc3RzQ2FjaGUuc2V0KHRvLCB0cnVlKTtcbiAgfVxuXG4gIG1rZGlyKHBhdGg6IEFic29sdXRlRnNQYXRoKTogdm9pZCB7XG4gICAgdGhpcy5kZWxlZ2F0ZS5ta2RpcihwYXRoKTtcbiAgICB0aGlzLmV4aXN0c0NhY2hlLnNldChwYXRoLCB0cnVlKTtcbiAgfVxuXG4gIGVuc3VyZURpcihwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IHZvaWQge1xuICAgIHRoaXMuZGVsZWdhdGUuZW5zdXJlRGlyKHBhdGgpO1xuICAgIHdoaWxlICghdGhpcy5pc1Jvb3QocGF0aCkpIHtcbiAgICAgIHRoaXMuZXhpc3RzQ2FjaGUuc2V0KHBhdGgsIHRydWUpO1xuICAgICAgcGF0aCA9IHRoaXMuZGlybmFtZShwYXRoKTtcbiAgICB9XG4gIH1cblxuICBsc3RhdChwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEZpbGVTdGF0cyB7XG4gICAgY29uc3Qgc3RhdCA9IHRoaXMuZGVsZWdhdGUubHN0YXQocGF0aCk7XG4gICAgLy8gaWYgdGhlIGBwYXRoYCBkb2VzIG5vdCBleGlzdCB0aGVuIGBsc3RhdGAgd2lsbCB0aHJvd24gYW4gZXJyb3IuXG4gICAgdGhpcy5leGlzdHNDYWNoZS5zZXQocGF0aCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHN0YXQ7XG4gIH1cblxuICBzdGF0KHBhdGg6IEFic29sdXRlRnNQYXRoKTogRmlsZVN0YXRzIHtcbiAgICBjb25zdCBzdGF0ID0gdGhpcy5kZWxlZ2F0ZS5zdGF0KHBhdGgpO1xuICAgIC8vIGlmIHRoZSBgcGF0aGAgZG9lcyBub3QgZXhpc3QgdGhlbiBgc3RhdGAgd2lsbCB0aHJvd24gYW4gZXJyb3IuXG4gICAgdGhpcy5leGlzdHNDYWNoZS5zZXQocGF0aCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHN0YXQ7XG4gIH1cblxuICAvLyBUaGUgZm9sbG93aW5nIG1ldGhvZHMgc2ltcGx5IGNhbGwgdGhyb3VnaCB0byB0aGUgZGVsZWdhdGUuXG4gIHJlYWRkaXIocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBQYXRoU2VnbWVudFtdIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUucmVhZGRpcihwYXRoKTsgfVxuICBwd2QoKTogQWJzb2x1dGVGc1BhdGggeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5wd2QoKTsgfVxuICBleHRuYW1lKHBhdGg6IEFic29sdXRlRnNQYXRofFBhdGhTZWdtZW50KTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZXh0bmFtZShwYXRoKTsgfVxuICBpc0Nhc2VTZW5zaXRpdmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmlzQ2FzZVNlbnNpdGl2ZSgpOyB9XG4gIGlzUm9vdChwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5pc1Jvb3QocGF0aCk7IH1cbiAgaXNSb290ZWQocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmlzUm9vdGVkKHBhdGgpOyB9XG4gIHJlc29sdmUoLi4ucGF0aHM6IHN0cmluZ1tdKTogQWJzb2x1dGVGc1BhdGggeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5yZXNvbHZlKC4uLnBhdGhzKTsgfVxuICBkaXJuYW1lPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihmaWxlOiBUKTogVCB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmRpcm5hbWUoZmlsZSk7IH1cbiAgam9pbjxUIGV4dGVuZHMgUGF0aFN0cmluZz4oYmFzZVBhdGg6IFQsIC4uLnBhdGhzOiBzdHJpbmdbXSk6IFQge1xuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLmpvaW4oYmFzZVBhdGgsIC4uLnBhdGhzKTtcbiAgfVxuICByZWxhdGl2ZTxUIGV4dGVuZHMgUGF0aFN0cmluZz4oZnJvbTogVCwgdG86IFQpOiBQYXRoU2VnbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUucmVsYXRpdmUoZnJvbSwgdG8pO1xuICB9XG4gIGJhc2VuYW1lKGZpbGVQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbj86IHN0cmluZ3x1bmRlZmluZWQpOiBQYXRoU2VnbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuYmFzZW5hbWUoZmlsZVBhdGgsIGV4dGVuc2lvbik7XG4gIH1cbiAgcmVhbHBhdGgoZmlsZVBhdGg6IEFic29sdXRlRnNQYXRoKTogQWJzb2x1dGVGc1BhdGggeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5yZWFscGF0aChmaWxlUGF0aCk7IH1cbiAgZ2V0RGVmYXVsdExpYkxvY2F0aW9uKCk6IEFic29sdXRlRnNQYXRoIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0RGVmYXVsdExpYkxvY2F0aW9uKCk7IH1cbiAgbm9ybWFsaXplPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihwYXRoOiBUKTogVCB7IHJldHVybiB0aGlzLmRlbGVnYXRlLm5vcm1hbGl6ZShwYXRoKTsgfVxufVxuIl19
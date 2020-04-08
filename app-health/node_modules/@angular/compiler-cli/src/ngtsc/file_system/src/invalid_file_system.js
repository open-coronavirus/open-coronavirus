(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/file_system/src/invalid_file_system", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The default `FileSystem` that will always fail.
     *
     * This is a way of ensuring that the developer consciously chooses and
     * configures the `FileSystem` before using it; particularly important when
     * considering static functions like `absoluteFrom()` which rely on
     * the `FileSystem` under the hood.
     */
    var InvalidFileSystem = /** @class */ (function () {
        function InvalidFileSystem() {
        }
        InvalidFileSystem.prototype.exists = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.readFile = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.writeFile = function (path, data) { throw makeError(); };
        InvalidFileSystem.prototype.symlink = function (target, path) { throw makeError(); };
        InvalidFileSystem.prototype.readdir = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.lstat = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.stat = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.pwd = function () { throw makeError(); };
        InvalidFileSystem.prototype.extname = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.copyFile = function (from, to) { throw makeError(); };
        InvalidFileSystem.prototype.moveFile = function (from, to) { throw makeError(); };
        InvalidFileSystem.prototype.mkdir = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.ensureDir = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.isCaseSensitive = function () { throw makeError(); };
        InvalidFileSystem.prototype.resolve = function () {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            throw makeError();
        };
        InvalidFileSystem.prototype.dirname = function (file) { throw makeError(); };
        InvalidFileSystem.prototype.join = function (basePath) {
            var paths = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                paths[_i - 1] = arguments[_i];
            }
            throw makeError();
        };
        InvalidFileSystem.prototype.isRoot = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.isRooted = function (path) { throw makeError(); };
        InvalidFileSystem.prototype.relative = function (from, to) { throw makeError(); };
        InvalidFileSystem.prototype.basename = function (filePath, extension) { throw makeError(); };
        InvalidFileSystem.prototype.realpath = function (filePath) { throw makeError(); };
        InvalidFileSystem.prototype.getDefaultLibLocation = function () { throw makeError(); };
        InvalidFileSystem.prototype.normalize = function (path) { throw makeError(); };
        return InvalidFileSystem;
    }());
    exports.InvalidFileSystem = InvalidFileSystem;
    function makeError() {
        return new Error('FileSystem has not been configured. Please call `setFileSystem()` before calling this method.');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52YWxpZF9maWxlX3N5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0vc3JjL2ludmFsaWRfZmlsZV9zeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFTQTs7Ozs7OztPQU9HO0lBQ0g7UUFBQTtRQXlCQSxDQUFDO1FBeEJDLGtDQUFNLEdBQU4sVUFBTyxJQUFvQixJQUFhLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVELG9DQUFRLEdBQVIsVUFBUyxJQUFvQixJQUFZLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdELHFDQUFTLEdBQVQsVUFBVSxJQUFvQixFQUFFLElBQVksSUFBVSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxtQ0FBTyxHQUFQLFVBQVEsTUFBc0IsRUFBRSxJQUFvQixJQUFVLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLG1DQUFPLEdBQVAsVUFBUSxJQUFvQixJQUFtQixNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxpQ0FBSyxHQUFMLFVBQU0sSUFBb0IsSUFBZSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxnQ0FBSSxHQUFKLFVBQUssSUFBb0IsSUFBZSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCwrQkFBRyxHQUFILGNBQXdCLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVDLG1DQUFPLEdBQVAsVUFBUSxJQUFnQyxJQUFZLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLG9DQUFRLEdBQVIsVUFBUyxJQUFvQixFQUFFLEVBQWtCLElBQVUsTUFBTSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0Usb0NBQVEsR0FBUixVQUFTLElBQW9CLEVBQUUsRUFBa0IsSUFBVSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvRSxpQ0FBSyxHQUFMLFVBQU0sSUFBb0IsSUFBVSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RCxxQ0FBUyxHQUFULFVBQVUsSUFBb0IsSUFBVSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCwyQ0FBZSxHQUFmLGNBQTZCLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pELG1DQUFPLEdBQVA7WUFBUSxlQUFrQjtpQkFBbEIsVUFBa0IsRUFBbEIscUJBQWtCLEVBQWxCLElBQWtCO2dCQUFsQiwwQkFBa0I7O1lBQW9CLE1BQU0sU0FBUyxFQUFFLENBQUM7UUFBQyxDQUFDO1FBQ2xFLG1DQUFPLEdBQVAsVUFBOEIsSUFBTyxJQUFPLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLGdDQUFJLEdBQUosVUFBMkIsUUFBVztZQUFFLGVBQWtCO2lCQUFsQixVQUFrQixFQUFsQixxQkFBa0IsRUFBbEIsSUFBa0I7Z0JBQWxCLDhCQUFrQjs7WUFBTyxNQUFNLFNBQVMsRUFBRSxDQUFDO1FBQUMsQ0FBQztRQUNyRixrQ0FBTSxHQUFOLFVBQU8sSUFBb0IsSUFBYSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxvQ0FBUSxHQUFSLFVBQVMsSUFBWSxJQUFhLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELG9DQUFRLEdBQVIsVUFBK0IsSUFBTyxFQUFFLEVBQUssSUFBaUIsTUFBTSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEYsb0NBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsU0FBa0IsSUFBaUIsTUFBTSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEYsb0NBQVEsR0FBUixVQUFTLFFBQXdCLElBQW9CLE1BQU0sU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLGlEQUFxQixHQUFyQixjQUEwQyxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCxxQ0FBUyxHQUFULFVBQWdDLElBQU8sSUFBTyxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRSx3QkFBQztJQUFELENBQUMsQUF6QkQsSUF5QkM7SUF6QlksOENBQWlCO0lBMkI5QixTQUFTLFNBQVM7UUFDaEIsT0FBTyxJQUFJLEtBQUssQ0FDWiwrRkFBK0YsQ0FBQyxDQUFDO0lBQ3ZHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3RhdHMsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCBQYXRoU3RyaW5nfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBgRmlsZVN5c3RlbWAgdGhhdCB3aWxsIGFsd2F5cyBmYWlsLlxuICpcbiAqIFRoaXMgaXMgYSB3YXkgb2YgZW5zdXJpbmcgdGhhdCB0aGUgZGV2ZWxvcGVyIGNvbnNjaW91c2x5IGNob29zZXMgYW5kXG4gKiBjb25maWd1cmVzIHRoZSBgRmlsZVN5c3RlbWAgYmVmb3JlIHVzaW5nIGl0OyBwYXJ0aWN1bGFybHkgaW1wb3J0YW50IHdoZW5cbiAqIGNvbnNpZGVyaW5nIHN0YXRpYyBmdW5jdGlvbnMgbGlrZSBgYWJzb2x1dGVGcm9tKClgIHdoaWNoIHJlbHkgb25cbiAqIHRoZSBgRmlsZVN5c3RlbWAgdW5kZXIgdGhlIGhvb2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnZhbGlkRmlsZVN5c3RlbSBpbXBsZW1lbnRzIEZpbGVTeXN0ZW0ge1xuICBleGlzdHMocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBib29sZWFuIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgcmVhZEZpbGUocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBzdHJpbmcgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICB3cml0ZUZpbGUocGF0aDogQWJzb2x1dGVGc1BhdGgsIGRhdGE6IHN0cmluZyk6IHZvaWQgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBzeW1saW5rKHRhcmdldDogQWJzb2x1dGVGc1BhdGgsIHBhdGg6IEFic29sdXRlRnNQYXRoKTogdm9pZCB7IHRocm93IG1ha2VFcnJvcigpOyB9XG4gIHJlYWRkaXIocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBQYXRoU2VnbWVudFtdIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgbHN0YXQocGF0aDogQWJzb2x1dGVGc1BhdGgpOiBGaWxlU3RhdHMgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBzdGF0KHBhdGg6IEFic29sdXRlRnNQYXRoKTogRmlsZVN0YXRzIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgcHdkKCk6IEFic29sdXRlRnNQYXRoIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgZXh0bmFtZShwYXRoOiBBYnNvbHV0ZUZzUGF0aHxQYXRoU2VnbWVudCk6IHN0cmluZyB7IHRocm93IG1ha2VFcnJvcigpOyB9XG4gIGNvcHlGaWxlKGZyb206IEFic29sdXRlRnNQYXRoLCB0bzogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgbW92ZUZpbGUoZnJvbTogQWJzb2x1dGVGc1BhdGgsIHRvOiBBYnNvbHV0ZUZzUGF0aCk6IHZvaWQgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBta2RpcihwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IHZvaWQgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBlbnN1cmVEaXIocGF0aDogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgaXNDYXNlU2Vuc2l0aXZlKCk6IGJvb2xlYW4geyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICByZXNvbHZlKC4uLnBhdGhzOiBzdHJpbmdbXSk6IEFic29sdXRlRnNQYXRoIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgZGlybmFtZTxUIGV4dGVuZHMgUGF0aFN0cmluZz4oZmlsZTogVCk6IFQgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBqb2luPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihiYXNlUGF0aDogVCwgLi4ucGF0aHM6IHN0cmluZ1tdKTogVCB7IHRocm93IG1ha2VFcnJvcigpOyB9XG4gIGlzUm9vdChwYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW4geyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBpc1Jvb3RlZChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgcmVsYXRpdmU8VCBleHRlbmRzIFBhdGhTdHJpbmc+KGZyb206IFQsIHRvOiBUKTogUGF0aFNlZ21lbnQgeyB0aHJvdyBtYWtlRXJyb3IoKTsgfVxuICBiYXNlbmFtZShmaWxlUGF0aDogc3RyaW5nLCBleHRlbnNpb24/OiBzdHJpbmcpOiBQYXRoU2VnbWVudCB7IHRocm93IG1ha2VFcnJvcigpOyB9XG4gIHJlYWxwYXRoKGZpbGVQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEFic29sdXRlRnNQYXRoIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgZ2V0RGVmYXVsdExpYkxvY2F0aW9uKCk6IEFic29sdXRlRnNQYXRoIHsgdGhyb3cgbWFrZUVycm9yKCk7IH1cbiAgbm9ybWFsaXplPFQgZXh0ZW5kcyBQYXRoU3RyaW5nPihwYXRoOiBUKTogVCB7IHRocm93IG1ha2VFcnJvcigpOyB9XG59XG5cbmZ1bmN0aW9uIG1ha2VFcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICAgICdGaWxlU3lzdGVtIGhhcyBub3QgYmVlbiBjb25maWd1cmVkLiBQbGVhc2UgY2FsbCBgc2V0RmlsZVN5c3RlbSgpYCBiZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZC4nKTtcbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/file_utils", ["require", "exports", "fs", "path"], factory);
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
    var fs = require("fs");
    var path = require("path");
    var FileUtils = /** @class */ (function () {
        function FileUtils() {
        }
        FileUtils.readFile = function (absolutePath) { return fs.readFileSync(absolutePath, 'utf8'); };
        FileUtils.readFileBuffer = function (absolutePath) { return fs.readFileSync(absolutePath); };
        FileUtils.writeFile = function (absolutePath, contents) {
            FileUtils.ensureDir(path.dirname(absolutePath));
            fs.writeFileSync(absolutePath, contents);
        };
        FileUtils.ensureDir = function (absolutePath) {
            var parents = [];
            while (!FileUtils.isRoot(absolutePath) && !fs.existsSync(absolutePath)) {
                parents.push(absolutePath);
                absolutePath = path.dirname(absolutePath);
            }
            while (parents.length) {
                fs.mkdirSync(parents.pop());
            }
        };
        FileUtils.remove = function (p) {
            var stat = fs.statSync(p);
            if (stat.isFile()) {
                fs.unlinkSync(p);
            }
            else if (stat.isDirectory()) {
                fs.readdirSync(p).forEach(function (child) {
                    var absChild = path.resolve(p, child);
                    FileUtils.remove(absChild);
                });
                fs.rmdirSync(p);
            }
        };
        FileUtils.isRoot = function (absolutePath) {
            return path.dirname(absolutePath) === absolutePath;
        };
        return FileUtils;
    }());
    exports.FileUtils = FileUtils;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZV91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZmlsZV91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILHVCQUF5QjtJQUN6QiwyQkFBNkI7SUFFN0I7UUFBQTtRQXFDQSxDQUFDO1FBcENRLGtCQUFRLEdBQWYsVUFBZ0IsWUFBb0IsSUFBWSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4Rix3QkFBYyxHQUFyQixVQUFzQixZQUFvQixJQUFZLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEYsbUJBQVMsR0FBaEIsVUFBaUIsWUFBb0IsRUFBRSxRQUF1QjtZQUM1RCxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRU0sbUJBQVMsR0FBaEIsVUFBaUIsWUFBb0I7WUFDbkMsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDdEUsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDM0IsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDM0M7WUFDRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBSSxDQUFDLENBQUM7YUFDL0I7UUFDSCxDQUFDO1FBRU0sZ0JBQU0sR0FBYixVQUFjLENBQVM7WUFDckIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDakIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDN0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO29CQUM3QixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDeEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQjtRQUNILENBQUM7UUFFTSxnQkFBTSxHQUFiLFVBQWMsWUFBb0I7WUFDaEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLFlBQVksQ0FBQztRQUNyRCxDQUFDO1FBQ0gsZ0JBQUM7SUFBRCxDQUFDLEFBckNELElBcUNDO0lBckNZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGNsYXNzIEZpbGVVdGlscyB7XG4gIHN0YXRpYyByZWFkRmlsZShhYnNvbHV0ZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBmcy5yZWFkRmlsZVN5bmMoYWJzb2x1dGVQYXRoLCAndXRmOCcpOyB9XG5cbiAgc3RhdGljIHJlYWRGaWxlQnVmZmVyKGFic29sdXRlUGF0aDogc3RyaW5nKTogQnVmZmVyIHsgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhhYnNvbHV0ZVBhdGgpOyB9XG5cbiAgc3RhdGljIHdyaXRlRmlsZShhYnNvbHV0ZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZ3xCdWZmZXIpIHtcbiAgICBGaWxlVXRpbHMuZW5zdXJlRGlyKHBhdGguZGlybmFtZShhYnNvbHV0ZVBhdGgpKTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKGFic29sdXRlUGF0aCwgY29udGVudHMpO1xuICB9XG5cbiAgc3RhdGljIGVuc3VyZURpcihhYnNvbHV0ZVBhdGg6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmVudHM6IHN0cmluZ1tdID0gW107XG4gICAgd2hpbGUgKCFGaWxlVXRpbHMuaXNSb290KGFic29sdXRlUGF0aCkgJiYgIWZzLmV4aXN0c1N5bmMoYWJzb2x1dGVQYXRoKSkge1xuICAgICAgcGFyZW50cy5wdXNoKGFic29sdXRlUGF0aCk7XG4gICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLmRpcm5hbWUoYWJzb2x1dGVQYXRoKTtcbiAgICB9XG4gICAgd2hpbGUgKHBhcmVudHMubGVuZ3RoKSB7XG4gICAgICBmcy5ta2RpclN5bmMocGFyZW50cy5wb3AoKSAhKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlKHA6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhwKTtcbiAgICBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgZnMudW5saW5rU3luYyhwKTtcbiAgICB9IGVsc2UgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgZnMucmVhZGRpclN5bmMocCkuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGNvbnN0IGFic0NoaWxkID0gcGF0aC5yZXNvbHZlKHAsIGNoaWxkKTtcbiAgICAgICAgRmlsZVV0aWxzLnJlbW92ZShhYnNDaGlsZCk7XG4gICAgICB9KTtcbiAgICAgIGZzLnJtZGlyU3luYyhwKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaXNSb290KGFic29sdXRlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHBhdGguZGlybmFtZShhYnNvbHV0ZVBhdGgpID09PSBhYnNvbHV0ZVBhdGg7XG4gIH1cbn1cbiJdfQ==
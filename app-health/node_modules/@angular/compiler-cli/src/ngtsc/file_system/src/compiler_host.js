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
        define("@angular/compiler-cli/src/ngtsc/file_system/src/compiler_host", ["require", "exports", "os", "typescript", "@angular/compiler-cli/src/ngtsc/file_system/src/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    var os = require("os");
    var ts = require("typescript");
    var helpers_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/helpers");
    var NgtscCompilerHost = /** @class */ (function () {
        function NgtscCompilerHost(fs, options) {
            if (options === void 0) { options = {}; }
            this.fs = fs;
            this.options = options;
        }
        NgtscCompilerHost.prototype.getSourceFile = function (fileName, languageVersion) {
            var text = this.readFile(fileName);
            return text !== undefined ? ts.createSourceFile(fileName, text, languageVersion, true) :
                undefined;
        };
        NgtscCompilerHost.prototype.getDefaultLibFileName = function (options) {
            return this.fs.join(this.getDefaultLibLocation(), ts.getDefaultLibFileName(options));
        };
        NgtscCompilerHost.prototype.getDefaultLibLocation = function () { return this.fs.getDefaultLibLocation(); };
        NgtscCompilerHost.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            var path = helpers_1.absoluteFrom(fileName);
            this.fs.ensureDir(this.fs.dirname(path));
            this.fs.writeFile(path, data);
        };
        NgtscCompilerHost.prototype.getCurrentDirectory = function () { return this.fs.pwd(); };
        NgtscCompilerHost.prototype.getCanonicalFileName = function (fileName) {
            return this.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
        };
        NgtscCompilerHost.prototype.useCaseSensitiveFileNames = function () { return this.fs.isCaseSensitive(); };
        NgtscCompilerHost.prototype.getNewLine = function () {
            switch (this.options.newLine) {
                case ts.NewLineKind.CarriageReturnLineFeed:
                    return '\r\n';
                case ts.NewLineKind.LineFeed:
                    return '\n';
                default:
                    return os.EOL;
            }
        };
        NgtscCompilerHost.prototype.fileExists = function (fileName) {
            var absPath = this.fs.resolve(fileName);
            return this.fs.exists(absPath) && this.fs.stat(absPath).isFile();
        };
        NgtscCompilerHost.prototype.readFile = function (fileName) {
            var absPath = this.fs.resolve(fileName);
            if (!this.fileExists(absPath)) {
                return undefined;
            }
            return this.fs.readFile(absPath);
        };
        return NgtscCompilerHost;
    }());
    exports.NgtscCompilerHost = NgtscCompilerHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0vc3JjL2NvbXBpbGVyX2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCw4QkFBOEI7SUFDOUIsdUJBQXlCO0lBQ3pCLCtCQUFpQztJQUVqQyxtRkFBdUM7SUFHdkM7UUFDRSwyQkFBc0IsRUFBYyxFQUFZLE9BQWdDO1lBQWhDLHdCQUFBLEVBQUEsWUFBZ0M7WUFBMUQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUFZLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQUcsQ0FBQztRQUVwRix5Q0FBYSxHQUFiLFVBQWMsUUFBZ0IsRUFBRSxlQUFnQztZQUM5RCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVELFNBQVMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsaURBQXFCLEdBQXJCLFVBQXNCLE9BQTJCO1lBQy9DLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkYsQ0FBQztRQUVELGlEQUFxQixHQUFyQixjQUFrQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0UscUNBQVMsR0FBVCxVQUNJLFFBQWdCLEVBQUUsSUFBWSxFQUFFLGtCQUEyQixFQUMzRCxPQUE4QyxFQUM5QyxXQUEwQztZQUM1QyxJQUFNLElBQUksR0FBRyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFFRCwrQ0FBbUIsR0FBbkIsY0FBZ0MsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV2RCxnREFBb0IsR0FBcEIsVUFBcUIsUUFBZ0I7WUFDbkMsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzVFLENBQUM7UUFFRCxxREFBeUIsR0FBekIsY0FBdUMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxRSxzQ0FBVSxHQUFWO1lBQ0UsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDNUIsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLHNCQUFzQjtvQkFDeEMsT0FBTyxNQUFNLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRO29CQUMxQixPQUFPLElBQUksQ0FBQztnQkFDZDtvQkFDRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDakI7UUFDSCxDQUFDO1FBRUQsc0NBQVUsR0FBVixVQUFXLFFBQWdCO1lBQ3pCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkUsQ0FBQztRQUVELG9DQUFRLEdBQVIsVUFBUyxRQUFnQjtZQUN2QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDN0IsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFDRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUF2REQsSUF1REM7SUF2RFksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cIm5vZGVcIiAvPlxuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7YWJzb2x1dGVGcm9tfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHtGaWxlU3lzdGVtfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIE5ndHNjQ29tcGlsZXJIb3N0IGltcGxlbWVudHMgdHMuQ29tcGlsZXJIb3N0IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZzOiBGaWxlU3lzdGVtLCBwcm90ZWN0ZWQgb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zID0ge30pIHt9XG5cbiAgZ2V0U291cmNlRmlsZShmaWxlTmFtZTogc3RyaW5nLCBsYW5ndWFnZVZlcnNpb246IHRzLlNjcmlwdFRhcmdldCk6IHRzLlNvdXJjZUZpbGV8dW5kZWZpbmVkIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5yZWFkRmlsZShmaWxlTmFtZSk7XG4gICAgcmV0dXJuIHRleHQgIT09IHVuZGVmaW5lZCA/IHRzLmNyZWF0ZVNvdXJjZUZpbGUoZmlsZU5hbWUsIHRleHQsIGxhbmd1YWdlVmVyc2lvbiwgdHJ1ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXREZWZhdWx0TGliRmlsZU5hbWUob3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mcy5qb2luKHRoaXMuZ2V0RGVmYXVsdExpYkxvY2F0aW9uKCksIHRzLmdldERlZmF1bHRMaWJGaWxlTmFtZShvcHRpb25zKSk7XG4gIH1cblxuICBnZXREZWZhdWx0TGliTG9jYXRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZnMuZ2V0RGVmYXVsdExpYkxvY2F0aW9uKCk7IH1cblxuICB3cml0ZUZpbGUoXG4gICAgICBmaWxlTmFtZTogc3RyaW5nLCBkYXRhOiBzdHJpbmcsIHdyaXRlQnl0ZU9yZGVyTWFyazogYm9vbGVhbixcbiAgICAgIG9uRXJyb3I6ICgobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKXx1bmRlZmluZWQsXG4gICAgICBzb3VyY2VGaWxlcz86IFJlYWRvbmx5QXJyYXk8dHMuU291cmNlRmlsZT4pOiB2b2lkIHtcbiAgICBjb25zdCBwYXRoID0gYWJzb2x1dGVGcm9tKGZpbGVOYW1lKTtcbiAgICB0aGlzLmZzLmVuc3VyZURpcih0aGlzLmZzLmRpcm5hbWUocGF0aCkpO1xuICAgIHRoaXMuZnMud3JpdGVGaWxlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgZ2V0Q3VycmVudERpcmVjdG9yeSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5mcy5wd2QoKTsgfVxuXG4gIGdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMgPyBmaWxlTmFtZSA6IGZpbGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5mcy5pc0Nhc2VTZW5zaXRpdmUoKTsgfVxuXG4gIGdldE5ld0xpbmUoKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHRoaXMub3B0aW9ucy5uZXdMaW5lKSB7XG4gICAgICBjYXNlIHRzLk5ld0xpbmVLaW5kLkNhcnJpYWdlUmV0dXJuTGluZUZlZWQ6XG4gICAgICAgIHJldHVybiAnXFxyXFxuJztcbiAgICAgIGNhc2UgdHMuTmV3TGluZUtpbmQuTGluZUZlZWQ6XG4gICAgICAgIHJldHVybiAnXFxuJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBvcy5FT0w7XG4gICAgfVxuICB9XG5cbiAgZmlsZUV4aXN0cyhmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWJzUGF0aCA9IHRoaXMuZnMucmVzb2x2ZShmaWxlTmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuZnMuZXhpc3RzKGFic1BhdGgpICYmIHRoaXMuZnMuc3RhdChhYnNQYXRoKS5pc0ZpbGUoKTtcbiAgfVxuXG4gIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBhYnNQYXRoID0gdGhpcy5mcy5yZXNvbHZlKGZpbGVOYW1lKTtcbiAgICBpZiAoIXRoaXMuZmlsZUV4aXN0cyhhYnNQYXRoKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZnMucmVhZEZpbGUoYWJzUGF0aCk7XG4gIH1cbn1cbiJdfQ==
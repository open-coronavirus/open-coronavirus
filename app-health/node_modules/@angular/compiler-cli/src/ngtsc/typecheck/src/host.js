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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/host", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A `ts.CompilerHost` which augments source files with type checking code from a
     * `TypeCheckContext`.
     */
    var TypeCheckProgramHost = /** @class */ (function () {
        function TypeCheckProgramHost(sfMap, delegate) {
            this.delegate = delegate;
            this.sfMap = sfMap;
            if (delegate.getDirectories !== undefined) {
                this.getDirectories = function (path) { return delegate.getDirectories(path); };
            }
        }
        TypeCheckProgramHost.prototype.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
            // Look in the cache for the source file.
            var sf = this.sfMap.get(fileName);
            if (sf === undefined) {
                // There should be no cache misses, but just in case, delegate getSourceFile in the event of
                // a cache miss.
                sf = this.delegate.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
                sf && this.sfMap.set(fileName, sf);
            }
            else {
                // TypeScript doesn't allow returning redirect source files. To avoid unforseen errors we
                // return the original source file instead of the redirect target.
                var redirectInfo = sf.redirectInfo;
                if (redirectInfo !== undefined) {
                    sf = redirectInfo.unredirected;
                }
            }
            return sf;
        };
        // The rest of the methods simply delegate to the underlying `ts.CompilerHost`.
        TypeCheckProgramHost.prototype.getDefaultLibFileName = function (options) {
            return this.delegate.getDefaultLibFileName(options);
        };
        TypeCheckProgramHost.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            throw new Error("TypeCheckProgramHost should never write files");
        };
        TypeCheckProgramHost.prototype.getCurrentDirectory = function () { return this.delegate.getCurrentDirectory(); };
        TypeCheckProgramHost.prototype.getCanonicalFileName = function (fileName) {
            return this.delegate.getCanonicalFileName(fileName);
        };
        TypeCheckProgramHost.prototype.useCaseSensitiveFileNames = function () { return this.delegate.useCaseSensitiveFileNames(); };
        TypeCheckProgramHost.prototype.getNewLine = function () { return this.delegate.getNewLine(); };
        TypeCheckProgramHost.prototype.fileExists = function (fileName) {
            return this.sfMap.has(fileName) || this.delegate.fileExists(fileName);
        };
        TypeCheckProgramHost.prototype.readFile = function (fileName) { return this.delegate.readFile(fileName); };
        return TypeCheckProgramHost;
    }());
    exports.TypeCheckProgramHost = TypeCheckProgramHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBS0g7OztPQUdHO0lBQ0g7UUFNRSw4QkFBWSxLQUFpQyxFQUFVLFFBQXlCO1lBQXpCLGFBQVEsR0FBUixRQUFRLENBQWlCO1lBQzlFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBRW5CLElBQUksUUFBUSxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBQyxJQUFZLElBQUssT0FBQSxRQUFRLENBQUMsY0FBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQzthQUN6RTtRQUNILENBQUM7UUFFRCw0Q0FBYSxHQUFiLFVBQ0ksUUFBZ0IsRUFBRSxlQUFnQyxFQUNsRCxPQUErQyxFQUMvQyx5QkFBNkM7WUFDL0MseUNBQXlDO1lBQ3pDLElBQUksRUFBRSxHQUE0QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLDRGQUE0RjtnQkFDNUYsZ0JBQWdCO2dCQUNoQixFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQzVCLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLHlCQUF5QixDQUFDLENBQUM7Z0JBQ25FLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDcEM7aUJBQU07Z0JBQ0wseUZBQXlGO2dCQUN6RixrRUFBa0U7Z0JBQ2xFLElBQU0sWUFBWSxHQUFJLEVBQVUsQ0FBQyxZQUFZLENBQUM7Z0JBQzlDLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsRUFBRSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7aUJBQ2hDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFFRCwrRUFBK0U7UUFFL0Usb0RBQXFCLEdBQXJCLFVBQXNCLE9BQTJCO1lBQy9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUQsd0NBQVMsR0FBVCxVQUNJLFFBQWdCLEVBQUUsSUFBWSxFQUFFLGtCQUEyQixFQUMzRCxPQUE4QyxFQUM5QyxXQUFtRDtZQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELGtEQUFtQixHQUFuQixjQUFnQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFJN0UsbURBQW9CLEdBQXBCLFVBQXFCLFFBQWdCO1lBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUQsd0RBQXlCLEdBQXpCLGNBQXVDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxRix5Q0FBVSxHQUFWLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0QseUNBQVUsR0FBVixVQUFXLFFBQWdCO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVELHVDQUFRLEdBQVIsVUFBUyxRQUFnQixJQUFzQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRiwyQkFBQztJQUFELENBQUMsQUFuRUQsSUFtRUM7SUFuRVksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7VHlwZUNoZWNrQ29udGV4dH0gZnJvbSAnLi9jb250ZXh0JztcblxuLyoqXG4gKiBBIGB0cy5Db21waWxlckhvc3RgIHdoaWNoIGF1Z21lbnRzIHNvdXJjZSBmaWxlcyB3aXRoIHR5cGUgY2hlY2tpbmcgY29kZSBmcm9tIGFcbiAqIGBUeXBlQ2hlY2tDb250ZXh0YC5cbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGVDaGVja1Byb2dyYW1Ib3N0IGltcGxlbWVudHMgdHMuQ29tcGlsZXJIb3N0IHtcbiAgLyoqXG4gICAqIE1hcCBvZiBzb3VyY2UgZmlsZSBuYW1lcyB0byBgdHMuU291cmNlRmlsZWAgaW5zdGFuY2VzLlxuICAgKi9cbiAgcHJpdmF0ZSBzZk1hcDogTWFwPHN0cmluZywgdHMuU291cmNlRmlsZT47XG5cbiAgY29uc3RydWN0b3Ioc2ZNYXA6IE1hcDxzdHJpbmcsIHRzLlNvdXJjZUZpbGU+LCBwcml2YXRlIGRlbGVnYXRlOiB0cy5Db21waWxlckhvc3QpIHtcbiAgICB0aGlzLnNmTWFwID0gc2ZNYXA7XG5cbiAgICBpZiAoZGVsZWdhdGUuZ2V0RGlyZWN0b3JpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5nZXREaXJlY3RvcmllcyA9IChwYXRoOiBzdHJpbmcpID0+IGRlbGVnYXRlLmdldERpcmVjdG9yaWVzICEocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0U291cmNlRmlsZShcbiAgICAgIGZpbGVOYW1lOiBzdHJpbmcsIGxhbmd1YWdlVmVyc2lvbjogdHMuU2NyaXB0VGFyZ2V0LFxuICAgICAgb25FcnJvcj86ICgobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKXx1bmRlZmluZWQsXG4gICAgICBzaG91bGRDcmVhdGVOZXdTb3VyY2VGaWxlPzogYm9vbGVhbnx1bmRlZmluZWQpOiB0cy5Tb3VyY2VGaWxlfHVuZGVmaW5lZCB7XG4gICAgLy8gTG9vayBpbiB0aGUgY2FjaGUgZm9yIHRoZSBzb3VyY2UgZmlsZS5cbiAgICBsZXQgc2Y6IHRzLlNvdXJjZUZpbGV8dW5kZWZpbmVkID0gdGhpcy5zZk1hcC5nZXQoZmlsZU5hbWUpO1xuICAgIGlmIChzZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBUaGVyZSBzaG91bGQgYmUgbm8gY2FjaGUgbWlzc2VzLCBidXQganVzdCBpbiBjYXNlLCBkZWxlZ2F0ZSBnZXRTb3VyY2VGaWxlIGluIHRoZSBldmVudCBvZlxuICAgICAgLy8gYSBjYWNoZSBtaXNzLlxuICAgICAgc2YgPSB0aGlzLmRlbGVnYXRlLmdldFNvdXJjZUZpbGUoXG4gICAgICAgICAgZmlsZU5hbWUsIGxhbmd1YWdlVmVyc2lvbiwgb25FcnJvciwgc2hvdWxkQ3JlYXRlTmV3U291cmNlRmlsZSk7XG4gICAgICBzZiAmJiB0aGlzLnNmTWFwLnNldChmaWxlTmFtZSwgc2YpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUeXBlU2NyaXB0IGRvZXNuJ3QgYWxsb3cgcmV0dXJuaW5nIHJlZGlyZWN0IHNvdXJjZSBmaWxlcy4gVG8gYXZvaWQgdW5mb3JzZWVuIGVycm9ycyB3ZVxuICAgICAgLy8gcmV0dXJuIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSBpbnN0ZWFkIG9mIHRoZSByZWRpcmVjdCB0YXJnZXQuXG4gICAgICBjb25zdCByZWRpcmVjdEluZm8gPSAoc2YgYXMgYW55KS5yZWRpcmVjdEluZm87XG4gICAgICBpZiAocmVkaXJlY3RJbmZvICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2YgPSByZWRpcmVjdEluZm8udW5yZWRpcmVjdGVkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2Y7XG4gIH1cblxuICAvLyBUaGUgcmVzdCBvZiB0aGUgbWV0aG9kcyBzaW1wbHkgZGVsZWdhdGUgdG8gdGhlIHVuZGVybHlpbmcgYHRzLkNvbXBpbGVySG9zdGAuXG5cbiAgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0RGVmYXVsdExpYkZpbGVOYW1lKG9wdGlvbnMpO1xuICB9XG5cbiAgd3JpdGVGaWxlKFxuICAgICAgZmlsZU5hbWU6IHN0cmluZywgZGF0YTogc3RyaW5nLCB3cml0ZUJ5dGVPcmRlck1hcms6IGJvb2xlYW4sXG4gICAgICBvbkVycm9yOiAoKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCl8dW5kZWZpbmVkLFxuICAgICAgc291cmNlRmlsZXM6IFJlYWRvbmx5QXJyYXk8dHMuU291cmNlRmlsZT58dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUeXBlQ2hlY2tQcm9ncmFtSG9zdCBzaG91bGQgbmV2ZXIgd3JpdGUgZmlsZXNgKTtcbiAgfVxuXG4gIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0Q3VycmVudERpcmVjdG9yeSgpOyB9XG5cbiAgZ2V0RGlyZWN0b3JpZXM/OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmdbXTtcblxuICBnZXRDYW5vbmljYWxGaWxlTmFtZShmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5nZXRDYW5vbmljYWxGaWxlTmFtZShmaWxlTmFtZSk7XG4gIH1cblxuICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS51c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk7IH1cblxuICBnZXROZXdMaW5lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmdldE5ld0xpbmUoKTsgfVxuXG4gIGZpbGVFeGlzdHMoZmlsZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNmTWFwLmhhcyhmaWxlTmFtZSkgfHwgdGhpcy5kZWxlZ2F0ZS5maWxlRXhpc3RzKGZpbGVOYW1lKTtcbiAgfVxuXG4gIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUucmVhZEZpbGUoZmlsZU5hbWUpOyB9XG59Il19
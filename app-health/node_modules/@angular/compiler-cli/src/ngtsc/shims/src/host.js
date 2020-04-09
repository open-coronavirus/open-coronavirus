(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/shims/src/host", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    /**
     * A wrapper around a `ts.CompilerHost` which supports generated files.
     */
    var GeneratedShimsHostWrapper = /** @class */ (function () {
        function GeneratedShimsHostWrapper(delegate, shimGenerators) {
            this.delegate = delegate;
            this.shimGenerators = shimGenerators;
            if (delegate.resolveModuleNames !== undefined) {
                this.resolveModuleNames =
                    function (moduleNames, containingFile, reusedNames, redirectedReference) {
                        return delegate.resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference);
                    };
            }
            if (delegate.resolveTypeReferenceDirectives) {
                this.resolveTypeReferenceDirectives = function (names, containingFile) {
                    return delegate.resolveTypeReferenceDirectives(names, containingFile);
                };
            }
            if (delegate.directoryExists !== undefined) {
                this.directoryExists = function (directoryName) { return delegate.directoryExists(directoryName); };
            }
            if (delegate.getDirectories !== undefined) {
                this.getDirectories = function (path) { return delegate.getDirectories(path); };
            }
        }
        GeneratedShimsHostWrapper.prototype.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
            var _this = this;
            for (var i = 0; i < this.shimGenerators.length; i++) {
                var generator = this.shimGenerators[i];
                // TypeScript internal paths are guaranteed to be POSIX-like absolute file paths.
                var absoluteFsPath = file_system_1.resolve(fileName);
                if (generator.recognize(absoluteFsPath)) {
                    var readFile = function (originalFile) {
                        return _this.delegate.getSourceFile(originalFile, languageVersion, onError, shouldCreateNewSourceFile) ||
                            null;
                    };
                    return generator.generate(absoluteFsPath, readFile) || undefined;
                }
            }
            return this.delegate.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        };
        GeneratedShimsHostWrapper.prototype.getDefaultLibFileName = function (options) {
            return this.delegate.getDefaultLibFileName(options);
        };
        GeneratedShimsHostWrapper.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            return this.delegate.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
        };
        GeneratedShimsHostWrapper.prototype.getCurrentDirectory = function () { return this.delegate.getCurrentDirectory(); };
        GeneratedShimsHostWrapper.prototype.getCanonicalFileName = function (fileName) {
            return this.delegate.getCanonicalFileName(fileName);
        };
        GeneratedShimsHostWrapper.prototype.useCaseSensitiveFileNames = function () { return this.delegate.useCaseSensitiveFileNames(); };
        GeneratedShimsHostWrapper.prototype.getNewLine = function () { return this.delegate.getNewLine(); };
        GeneratedShimsHostWrapper.prototype.fileExists = function (fileName) {
            // Consider the file as existing whenever
            //  1) it really does exist in the delegate host, or
            //  2) at least one of the shim generators recognizes it
            // Note that we can pass the file name as branded absolute fs path because TypeScript
            // internally only passes POSIX-like paths.
            return this.delegate.fileExists(fileName) ||
                this.shimGenerators.some(function (gen) { return gen.recognize(file_system_1.absoluteFrom(fileName)); });
        };
        GeneratedShimsHostWrapper.prototype.readFile = function (fileName) { return this.delegate.readFile(fileName); };
        return GeneratedShimsHostWrapper;
    }());
    exports.GeneratedShimsHostWrapper = GeneratedShimsHostWrapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc2hpbXMvc3JjL2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFRQSwyRUFBd0U7SUFvQnhFOztPQUVHO0lBQ0g7UUFDRSxtQ0FBb0IsUUFBeUIsRUFBVSxjQUErQjtZQUFsRSxhQUFRLEdBQVIsUUFBUSxDQUFpQjtZQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtZQUNwRixJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsS0FBSyxTQUFTLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0I7b0JBQ25CLFVBQUMsV0FBcUIsRUFBRSxjQUFzQixFQUFFLFdBQXNCLEVBQ3JFLG1CQUFpRDt3QkFDOUMsT0FBQSxRQUFRLENBQUMsa0JBQW9CLENBQ3pCLFdBQVcsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixDQUFDO29CQURsRSxDQUNrRSxDQUFDO2FBQzVFO1lBQ0QsSUFBSSxRQUFRLENBQUMsOEJBQThCLEVBQUU7Z0JBTTNDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxVQUFDLEtBQWUsRUFBRSxjQUFzQjtvQkFDMUUsT0FBQyxRQUFRLENBQUMsOEJBQXNFLENBQzVFLEtBQUssRUFBRSxjQUFjLENBQUM7Z0JBRDFCLENBQzBCLENBQUM7YUFDaEM7WUFDRCxJQUFJLFFBQVEsQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUMxQyxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQUMsYUFBcUIsSUFBSyxPQUFBLFFBQVEsQ0FBQyxlQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDO2FBQzdGO1lBQ0QsSUFBSSxRQUFRLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFDLElBQVksSUFBSyxPQUFBLFFBQVEs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Z2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIGFic29sdXRlRnJvbSwgcmVzb2x2ZX0gZnJvbSAnLi4vLi4vZmlsZV9zeXN0ZW0nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNoaW1HZW5lcmF0b3Ige1xuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBnZW5lcmF0b3IgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIHRoZSBnaXZlbiBmaWxlLlxuICAgKi9cbiAgcmVjb2duaXplKGZpbGVOYW1lOiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgc2hpbSdzIGB0cy5Tb3VyY2VGaWxlYCBmb3IgdGhlIGdpdmVuIG9yaWdpbmFsIGZpbGUuXG4gICAqXG4gICAqIGByZWFkRmlsZWAgaXMgYSBmdW5jdGlvbiB3aGljaCBhbGxvd3MgdGhlIGdlbmVyYXRvciB0byBsb29rIHVwIHRoZSBjb250ZW50cyBvZiBleGlzdGluZyBzb3VyY2VcbiAgICogZmlsZXMuIEl0IHJldHVybnMgbnVsbCBpZiB0aGUgcmVxdWVzdGVkIGZpbGUgZG9lc24ndCBleGlzdC5cbiAgICpcbiAgICogSWYgYGdlbmVyYXRlYCByZXR1cm5zIG51bGwsIHRoZW4gdGhlIHNoaW0gZ2VuZXJhdG9yIGRlY2xpbmVzIHRvIGdlbmVyYXRlIHRoZSBmaWxlIGFmdGVyIGFsbC5cbiAgICovXG4gIGdlbmVyYXRlKGdlbkZpbGVOYW1lOiBBYnNvbHV0ZUZzUGF0aCwgcmVhZEZpbGU6IChmaWxlTmFtZTogc3RyaW5nKSA9PiB0cy5Tb3VyY2VGaWxlIHwgbnVsbCk6XG4gICAgICB0cy5Tb3VyY2VGaWxlfG51bGw7XG59XG5cbi8qKlxuICogQSB3cmFwcGVyIGFyb3VuZCBhIGB0cy5Db21waWxlckhvc3RgIHdoaWNoIHN1cHBvcnRzIGdlbmVyYXRlZCBmaWxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyYXRlZFNoaW1zSG9zdFdyYXBwZXIgaW1wbGVtZW50cyB0cy5Db21waWxlckhvc3Qge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlbGVnYXRlOiB0cy5Db21waWxlckhvc3QsIHByaXZhdGUgc2hpbUdlbmVyYXRvcnM6IFNoaW1HZW5lcmF0b3JbXSkge1xuICAgIGlmIChkZWxlZ2F0ZS5yZXNvbHZlTW9kdWxlTmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZXNvbHZlTW9kdWxlTmFtZXMgPVxuICAgICAgICAgIChtb2R1bGVOYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcsIHJldXNlZE5hbWVzPzogc3RyaW5nW10sXG4gICAgICAgICAgIHJlZGlyZWN0ZWRSZWZlcmVuY2U/OiB0cy5SZXNvbHZlZFByb2plY3RSZWZlcmVuY2UpID0+XG4gICAgICAgICAgICAgIGRlbGVnYXRlLnJlc29sdmVNb2R1bGVOYW1lcyAhKFxuICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZXMsIGNvbnRhaW5pbmdGaWxlLCByZXVzZWROYW1lcywgcmVkaXJlY3RlZFJlZmVyZW5jZSk7XG4gICAgfVxuICAgIGlmIChkZWxlZ2F0ZS5yZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMpIHtcbiAgICAgIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBUeXBlU2NyaXB0IDIuOSBhbmQgb2xkZXIgc2luY2UgcmV0dXJuXG4gICAgICAvLyB0eXBlIGhhcyBjaGFuZ2VkIGZyb20gKHRzLlJlc29sdmVkVHlwZVJlZmVyZW5jZURpcmVjdGl2ZSB8IHVuZGVmaW5lZClbXVxuICAgICAgLy8gdG8gdHMuUmVzb2x2ZWRUeXBlUmVmZXJlbmNlRGlyZWN0aXZlW10gaW4gVHlwZXNjcmlwdCAzLjBcbiAgICAgIHR5cGUgdHMzUmVzb2x2ZVR5cGVSZWZlcmVuY2VEaXJlY3RpdmVzID0gKG5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZykgPT5cbiAgICAgICAgICB0cy5SZXNvbHZlZFR5cGVSZWZlcmVuY2VEaXJlY3RpdmVbXTtcbiAgICAgIHRoaXMucmVzb2x2ZVR5cGVSZWZlcmVuY2VEaXJlY3RpdmVzID0gKG5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZykgPT5cbiAgICAgICAgICAoZGVsZWdhdGUucmVzb2x2ZVR5cGVSZWZlcmVuY2VEaXJlY3RpdmVzIGFzIHRzM1Jlc29sdmVUeXBlUmVmZXJlbmNlRGlyZWN0aXZlcykgIShcbiAgICAgICAgICAgICAgbmFtZXMsIGNvbnRhaW5pbmdGaWxlKTtcbiAgICB9XG4gICAgaWYgKGRlbGVnYXRlLmRpcmVjdG9yeUV4aXN0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRpcmVjdG9yeUV4aXN0cyA9IChkaXJlY3RvcnlOYW1lOiBzdHJpbmcpID0+IGRlbGVnYXRlLmRpcmVjdG9yeUV4aXN0cyAhKGRpcmVjdG9yeU5hbWUpO1xuICAgIH1cbiAgICBpZiAoZGVsZWdhdGUuZ2V0RGlyZWN0b3JpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5nZXREaXJlY3RvcmllcyA9IChwYXRoOiBzdHJpbmcpID0+IGRlbGVnYXRlLmdldERpcmVjdG9yaWVzICEocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZU1vZHVsZU5hbWVzPzpcbiAgICAgIChtb2R1bGVOYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcsIHJldXNlZE5hbWVzPzogc3RyaW5nW10sXG4gICAgICAgcmVkaXJlY3RlZFJlZmVyZW5jZT86IHRzLlJlc29sdmVkUHJvamVjdFJlZmVyZW5jZSkgPT4gKHRzLlJlc29sdmVkTW9kdWxlIHwgdW5kZWZpbmVkKVtdO1xuXG4gIHJlc29sdmVUeXBlUmVmZXJlbmNlRGlyZWN0aXZlcz86XG4gICAgICAobmFtZXM6IHN0cmluZ1tdLCBjb250YWluaW5nRmlsZTogc3RyaW5nKSA9PiB0cy5SZXNvbHZlZFR5cGVSZWZlcmVuY2VEaXJlY3RpdmVbXTtcblxuICBkaXJlY3RvcnlFeGlzdHM/OiAoZGlyZWN0b3J5TmFtZTogc3RyaW5nKSA9PiBib29sZWFuO1xuXG4gIGdldFNvdXJjZUZpbGUoXG4gICAgICBmaWxlTmFtZTogc3RyaW5nLCBsYW5ndWFnZVZlcnNpb246IHRzLlNjcmlwdFRhcmdldCxcbiAgICAgIG9uRXJyb3I/OiAoKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCl8dW5kZWZpbmVkLFxuICAgICAgc2hvdWxkQ3JlYXRlTmV3U291cmNlRmlsZT86IGJvb2xlYW58dW5kZWZpbmVkKTogdHMuU291cmNlRmlsZXx1bmRlZmluZWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGltR2VuZXJhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZ2VuZXJhdG9yID0gdGhpcy5zaGltR2VuZXJhdG9yc1tpXTtcbiAgICAgIC8vIFR5cGVTY3JpcHQgaW50ZXJuYWwgcGF0aHMgYXJlIGd1YXJhbnRlZWQgdG8gYmUgUE9TSVgtbGlrZSBhYnNvbHV0ZSBmaWxlIHBhdGhzLlxuICAgICAgY29uc3QgYWJzb2x1dGVGc1BhdGggPSByZXNvbHZlKGZpbGVOYW1lKTtcbiAgICAgIGlmIChnZW5lcmF0b3IucmVjb2duaXplKGFic29sdXRlRnNQYXRoKSkge1xuICAgICAgICBjb25zdCByZWFkRmlsZSA9IChvcmlnaW5hbEZpbGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLmdldFNvdXJjZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEZpbGUsIGxhbmd1YWdlVmVyc2lvbiwgb25FcnJvciwgc2hvdWxkQ3JlYXRlTmV3U291cmNlRmlsZSkgfHxcbiAgICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZ2VuZXJhdG9yLmdlbmVyYXRlKGFic29sdXRlRnNQYXRoLCByZWFkRmlsZSkgfHwgdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5nZXRTb3VyY2VGaWxlKFxuICAgICAgICBmaWxlTmFtZSwgbGFuZ3VhZ2VWZXJzaW9uLCBvbkVycm9yLCBzaG91bGRDcmVhdGVOZXdTb3VyY2VGaWxlKTtcbiAgfVxuXG4gIGdldERlZmF1bHRMaWJGaWxlTmFtZShvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLmdldERlZmF1bHRMaWJGaWxlTmFtZShvcHRpb25zKTtcbiAgfVxuXG4gIHdyaXRlRmlsZShcbiAgICAgIGZpbGVOYW1lOiBzdHJpbmcsIGRhdGE6IHN0cmluZywgd3JpdGVCeXRlT3JkZXJNYXJrOiBib29sZWFuLFxuICAgICAgb25FcnJvcjogKChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpfHVuZGVmaW5lZCxcbiAgICAgIHNvdXJjZUZpbGVzOiBSZWFkb25seUFycmF5PHRzLlNvdXJjZUZpbGU+fHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLndyaXRlRmlsZShmaWxlTmFtZSwgZGF0YSwgd3JpdGVCeXRlT3JkZXJNYXJrLCBvbkVycm9yLCBzb3VyY2VGaWxlcyk7XG4gIH1cblxuICBnZXRDdXJyZW50RGlyZWN0b3J5KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmdldEN1cnJlbnREaXJlY3RvcnkoKTsgfVxuXG4gIGdldERpcmVjdG9yaWVzPzogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW107XG5cbiAgZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpO1xuICB9XG5cbiAgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUudXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcygpOyB9XG5cbiAgZ2V0TmV3TGluZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5nZXROZXdMaW5lKCk7IH1cblxuICBmaWxlRXhpc3RzKGZpbGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAvLyBDb25zaWRlciB0aGUgZmlsZSBhcyBleGlzdGluZyB3aGVuZXZlclxuICAgIC8vICAxKSBpdCByZWFsbHkgZG9lcyBleGlzdCBpbiB0aGUgZGVsZWdhdGUgaG9zdCwgb3JcbiAgICAvLyAgMikgYXQgbGVhc3Qgb25lIG9mIHRoZSBzaGltIGdlbmVyYXRvcnMgcmVjb2duaXplcyBpdFxuICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4gcGFzcyB0aGUgZmlsZSBuYW1lIGFzIGJyYW5kZWQgYWJzb2x1dGUgZnMgcGF0aCBiZWNhdXNlIFR5cGVTY3JpcHRcbiAgICAvLyBpbnRlcm5hbGx5IG9ubHkgcGFzc2VzIFBPU0lYLWxpa2UgcGF0aHMuXG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZmlsZUV4aXN0cyhmaWxlTmFtZSkgfHxcbiAgICAgICAgdGhpcy5zaGltR2VuZXJhdG9ycy5zb21lKGdlbiA9PiBnZW4ucmVjb2duaXplKGFic29sdXRlRnJvbShmaWxlTmFtZSkpKTtcbiAgfVxuXG4gIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUucmVhZEZpbGUoZmlsZU5hbWUpOyB9XG59XG4iXX0=
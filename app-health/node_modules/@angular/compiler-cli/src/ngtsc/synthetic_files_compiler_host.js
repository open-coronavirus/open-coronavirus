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
        define("@angular/compiler-cli/src/ngtsc/synthetic_files_compiler_host", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * Extension of the TypeScript compiler host that supports files added to the Program which
     * were never on disk.
     *
     * This is used for backwards-compatibility with the ViewEngine compiler, which used ngsummary
     * and ngfactory files as inputs to the program. We call these inputs "synthetic".
     *
     * They need to be program inputs because user code may import from these generated files.
     *
     * TODO(alxhub): remove this after all ng_module users have migrated to Ivy
     */
    var SyntheticFilesCompilerHost = /** @class */ (function () {
        function SyntheticFilesCompilerHost(rootFiles, delegate, generatedFiles) {
            var e_1, _a;
            this.rootFiles = rootFiles;
            this.delegate = delegate;
            /**
             * SourceFiles which are added to the program but which never existed on disk.
             */
            this.syntheticFiles = new Map();
            // Allow ngtsc to contribute in-memory synthetic files, which will be loaded
            // as if they existed on disk as action inputs.
            var angularGeneratedFiles = generatedFiles(rootFiles);
            try {
                for (var _b = tslib_1.__values(Object.keys(angularGeneratedFiles)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var f = _c.value;
                    var generator = angularGeneratedFiles[f];
                    var generated = generator(delegate);
                    if (generated) {
                        this.syntheticFiles.set(generated.fileName, generated);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (delegate.getDirectories !== undefined) {
                this.getDirectories = function (path) { return delegate.getDirectories(path); };
            }
        }
        SyntheticFilesCompilerHost.prototype.fileExists = function (filePath) {
            if (this.syntheticFiles.has(filePath)) {
                return true;
            }
            return this.delegate.fileExists(filePath);
        };
        /** Loads a source file from in-memory map, or delegates. */
        SyntheticFilesCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
            var syntheticFile = this.syntheticFiles.get(fileName);
            if (syntheticFile) {
                return syntheticFile;
            }
            return this.delegate.getSourceFile(fileName, languageVersion, onError);
        };
        Object.defineProperty(SyntheticFilesCompilerHost.prototype, "inputFiles", {
            get: function () { return tslib_1.__spread(this.rootFiles, Array.from(this.syntheticFiles.keys())); },
            enumerable: true,
            configurable: true
        });
        SyntheticFilesCompilerHost.prototype.fileNameToModuleId = function (fileName) {
            return fileName; // TODO: Ivy logic. don't forget that the delegate has the google3 logic
        };
        // Delegate everything else to the original compiler host.
        SyntheticFilesCompilerHost.prototype.getDefaultLibFileName = function (options) {
            return this.delegate.getDefaultLibFileName(options);
        };
        SyntheticFilesCompilerHost.prototype.writeFile = function (fileName, content, writeByteOrderMark, onError, sourceFiles) {
            this.delegate.writeFile(fileName, content, writeByteOrderMark, onError, sourceFiles);
        };
        SyntheticFilesCompilerHost.prototype.getCanonicalFileName = function (path) { return this.delegate.getCanonicalFileName(path); };
        SyntheticFilesCompilerHost.prototype.getCurrentDirectory = function () { return this.delegate.getCurrentDirectory(); };
        SyntheticFilesCompilerHost.prototype.useCaseSensitiveFileNames = function () { return this.delegate.useCaseSensitiveFileNames(); };
        SyntheticFilesCompilerHost.prototype.getNewLine = function () { return this.delegate.getNewLine(); };
        SyntheticFilesCompilerHost.prototype.readFile = function (fileName) { return this.delegate.readFile(fileName); };
        SyntheticFilesCompilerHost.prototype.trace = function (s) { console.error(s); };
        return SyntheticFilesCompilerHost;
    }());
    exports.SyntheticFilesCompilerHost = SyntheticFilesCompilerHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGhldGljX2ZpbGVzX2NvbXBpbGVyX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3N5bnRoZXRpY19maWxlc19jb21waWxlcl9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUtIOzs7Ozs7Ozs7O09BVUc7SUFDSDtRQU1FLG9DQUNZLFNBQW1CLEVBQVUsUUFBeUIsRUFDOUQsY0FFQzs7WUFITyxjQUFTLEdBQVQsU0FBUyxDQUFVO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7WUFObEU7O2VBRUc7WUFDSCxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO1lBT2hELDRFQUE0RTtZQUM1RSwrQ0FBK0M7WUFDL0MsSUFBTSxxQkFBcUIsR0FBRyxjQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDOztnQkFDMUQsS0FBZ0IsSUFBQSxLQUFBLGlCQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBL0MsSUFBTSxDQUFDLFdBQUE7b0JBQ1YsSUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxTQUFTLEVBQUU7d0JBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztxQkFDeEQ7aUJBQ0Y7Ozs7Ozs7OztZQUNELElBQUksUUFBUSxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBQyxJQUFZLElBQUssT0FBQSxRQUFRLENBQUMsY0FBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQzthQUN6RTtRQUNILENBQUM7UUFFRCwrQ0FBVSxHQUFWLFVBQVcsUUFBZ0I7WUFDekIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDckMsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELDREQUE0RDtRQUM1RCxrREFBYSxHQUFiLFVBQ0ksUUFBZ0IsRUFBRSxlQUFnQyxFQUNsRCxPQUFtQztZQUNyQyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4RCxJQUFJLGFBQWEsRUFBRTtnQkFDakIsT0FBTyxhQUFlLENBQUM7YUFDeEI7WUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekUsQ0FBQztRQUVELHNCQUFJLGtEQUFVO2lCQUFkLGNBQW1CLHdCQUFXLElBQUksQ0FBQyxTQUFTLEVBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7V0FBQTtRQUUzRix1REFBa0IsR0FBbEIsVUFBbUIsUUFBZ0I7WUFDakMsT0FBTyxRQUFRLENBQUMsQ0FBRSx3RUFBd0U7UUFDNUYsQ0FBQztRQUVELDBEQUEwRDtRQUUxRCwwREFBcUIsR0FBckIsVUFBc0IsT0FBMkI7WUFDL0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCw4Q0FBUyxHQUFULFVBQ0ksUUFBZ0IsRUFBRSxPQUFlLEVBQUUsa0JBQTJCLEVBQzlELE9BQThDLEVBQzlDLFdBQW1EO1lBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFFRCx5REFBb0IsR0FBcEIsVUFBcUIsSUFBWSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkYsd0RBQW1CLEdBQW5CLGNBQWdDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU3RSw4REFBeUIsR0FBekIsY0FBdUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFGLCtDQUFVLEdBQVYsY0FBdUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUkzRCw2Q0FBUSxHQUFSLFVBQVMsUUFBZ0IsSUFBc0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekYsMENBQUssR0FBTCxVQUFNLENBQVMsSUFBVSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxpQ0FBQztJQUFELENBQUMsQUE1RUQsSUE0RUM7SUE1RVksZ0VBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsdWdpbkNvbXBpbGVySG9zdH0gZnJvbSAnQGJhemVsL3R5cGVzY3JpcHQvaW50ZXJuYWwvdHNjX3dyYXBwZWQvcGx1Z2luX2FwaSc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBFeHRlbnNpb24gb2YgdGhlIFR5cGVTY3JpcHQgY29tcGlsZXIgaG9zdCB0aGF0IHN1cHBvcnRzIGZpbGVzIGFkZGVkIHRvIHRoZSBQcm9ncmFtIHdoaWNoXG4gKiB3ZXJlIG5ldmVyIG9uIGRpc2suXG4gKlxuICogVGhpcyBpcyB1c2VkIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBWaWV3RW5naW5lIGNvbXBpbGVyLCB3aGljaCB1c2VkIG5nc3VtbWFyeVxuICogYW5kIG5nZmFjdG9yeSBmaWxlcyBhcyBpbnB1dHMgdG8gdGhlIHByb2dyYW0uIFdlIGNhbGwgdGhlc2UgaW5wdXRzIFwic3ludGhldGljXCIuXG4gKlxuICogVGhleSBuZWVkIHRvIGJlIHByb2dyYW0gaW5wdXRzIGJlY2F1c2UgdXNlciBjb2RlIG1heSBpbXBvcnQgZnJvbSB0aGVzZSBnZW5lcmF0ZWQgZmlsZXMuXG4gKlxuICogVE9ETyhhbHhodWIpOiByZW1vdmUgdGhpcyBhZnRlciBhbGwgbmdfbW9kdWxlIHVzZXJzIGhhdmUgbWlncmF0ZWQgdG8gSXZ5XG4gKi9cbmV4cG9ydCBjbGFzcyBTeW50aGV0aWNGaWxlc0NvbXBpbGVySG9zdCBpbXBsZW1lbnRzIFBsdWdpbkNvbXBpbGVySG9zdCB7XG4gIC8qKlxuICAgKiBTb3VyY2VGaWxlcyB3aGljaCBhcmUgYWRkZWQgdG8gdGhlIHByb2dyYW0gYnV0IHdoaWNoIG5ldmVyIGV4aXN0ZWQgb24gZGlzay5cbiAgICovXG4gIHN5bnRoZXRpY0ZpbGVzID0gbmV3IE1hcDxzdHJpbmcsIHRzLlNvdXJjZUZpbGU+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJvb3RGaWxlczogc3RyaW5nW10sIHByaXZhdGUgZGVsZWdhdGU6IHRzLkNvbXBpbGVySG9zdCxcbiAgICAgIGdlbmVyYXRlZEZpbGVzOiAocm9vdEZpbGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICBbZmlsZU5hbWU6IHN0cmluZ106IChob3N0OiB0cy5Db21waWxlckhvc3QpID0+IHRzLlNvdXJjZUZpbGUgfCB1bmRlZmluZWRcbiAgICAgIH0pIHtcbiAgICAvLyBBbGxvdyBuZ3RzYyB0byBjb250cmlidXRlIGluLW1lbW9yeSBzeW50aGV0aWMgZmlsZXMsIHdoaWNoIHdpbGwgYmUgbG9hZGVkXG4gICAgLy8gYXMgaWYgdGhleSBleGlzdGVkIG9uIGRpc2sgYXMgYWN0aW9uIGlucHV0cy5cbiAgICBjb25zdCBhbmd1bGFyR2VuZXJhdGVkRmlsZXMgPSBnZW5lcmF0ZWRGaWxlcyAhKHJvb3RGaWxlcyk7XG4gICAgZm9yIChjb25zdCBmIG9mIE9iamVjdC5rZXlzKGFuZ3VsYXJHZW5lcmF0ZWRGaWxlcykpIHtcbiAgICAgIGNvbnN0IGdlbmVyYXRvciA9IGFuZ3VsYXJHZW5lcmF0ZWRGaWxlc1tmXTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZCA9IGdlbmVyYXRvcihkZWxlZ2F0ZSk7XG4gICAgICBpZiAoZ2VuZXJhdGVkKSB7XG4gICAgICAgIHRoaXMuc3ludGhldGljRmlsZXMuc2V0KGdlbmVyYXRlZC5maWxlTmFtZSwgZ2VuZXJhdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRlbGVnYXRlLmdldERpcmVjdG9yaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZ2V0RGlyZWN0b3JpZXMgPSAocGF0aDogc3RyaW5nKSA9PiBkZWxlZ2F0ZS5nZXREaXJlY3RvcmllcyAhKHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGZpbGVFeGlzdHMoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnN5bnRoZXRpY0ZpbGVzLmhhcyhmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5maWxlRXhpc3RzKGZpbGVQYXRoKTtcbiAgfVxuXG4gIC8qKiBMb2FkcyBhIHNvdXJjZSBmaWxlIGZyb20gaW4tbWVtb3J5IG1hcCwgb3IgZGVsZWdhdGVzLiAqL1xuICBnZXRTb3VyY2VGaWxlKFxuICAgICAgZmlsZU5hbWU6IHN0cmluZywgbGFuZ3VhZ2VWZXJzaW9uOiB0cy5TY3JpcHRUYXJnZXQsXG4gICAgICBvbkVycm9yPzogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCk6IHRzLlNvdXJjZUZpbGV8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBzeW50aGV0aWNGaWxlID0gdGhpcy5zeW50aGV0aWNGaWxlcy5nZXQoZmlsZU5hbWUpO1xuICAgIGlmIChzeW50aGV0aWNGaWxlKSB7XG4gICAgICByZXR1cm4gc3ludGhldGljRmlsZSAhO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5nZXRTb3VyY2VGaWxlKGZpbGVOYW1lLCBsYW5ndWFnZVZlcnNpb24sIG9uRXJyb3IpO1xuICB9XG5cbiAgZ2V0IGlucHV0RmlsZXMoKSB7IHJldHVybiBbLi4udGhpcy5yb290RmlsZXMsIC4uLkFycmF5LmZyb20odGhpcy5zeW50aGV0aWNGaWxlcy5rZXlzKCkpXTsgfVxuXG4gIGZpbGVOYW1lVG9Nb2R1bGVJZChmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGZpbGVOYW1lOyAgLy8gVE9ETzogSXZ5IGxvZ2ljLiBkb24ndCBmb3JnZXQgdGhhdCB0aGUgZGVsZWdhdGUgaGFzIHRoZSBnb29nbGUzIGxvZ2ljXG4gIH1cblxuICAvLyBEZWxlZ2F0ZSBldmVyeXRoaW5nIGVsc2UgdG8gdGhlIG9yaWdpbmFsIGNvbXBpbGVyIGhvc3QuXG5cbiAgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0RGVmYXVsdExpYkZpbGVOYW1lKG9wdGlvbnMpO1xuICB9XG5cbiAgd3JpdGVGaWxlKFxuICAgICAgZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCB3cml0ZUJ5dGVPcmRlck1hcms6IGJvb2xlYW4sXG4gICAgICBvbkVycm9yOiAoKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCl8dW5kZWZpbmVkLFxuICAgICAgc291cmNlRmlsZXM6IFJlYWRvbmx5QXJyYXk8dHMuU291cmNlRmlsZT58dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5kZWxlZ2F0ZS53cml0ZUZpbGUoZmlsZU5hbWUsIGNvbnRlbnQsIHdyaXRlQnl0ZU9yZGVyTWFyaywgb25FcnJvciwgc291cmNlRmlsZXMpO1xuICB9XG5cbiAgZ2V0Q2Fub25pY2FsRmlsZU5hbWUocGF0aDogc3RyaW5nKSB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmdldENhbm9uaWNhbEZpbGVOYW1lKHBhdGgpOyB9XG5cbiAgZ2V0Q3VycmVudERpcmVjdG9yeSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5nZXRDdXJyZW50RGlyZWN0b3J5KCk7IH1cblxuICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS51c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk7IH1cblxuICBnZXROZXdMaW5lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmdldE5ld0xpbmUoKTsgfVxuXG4gIGdldERpcmVjdG9yaWVzPzogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW107XG5cbiAgcmVhZEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZ3x1bmRlZmluZWQgeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5yZWFkRmlsZShmaWxlTmFtZSk7IH1cblxuICB0cmFjZShzOiBzdHJpbmcpOiB2b2lkIHsgY29uc29sZS5lcnJvcihzKTsgfVxufVxuIl19
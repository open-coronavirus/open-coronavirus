(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
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
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    /**
     * This FileWriter overwrites the transformed file, in-place, while creating
     * a back-up of the original file with an extra `.bak` extension.
     */
    var InPlaceFileWriter = /** @class */ (function () {
        function InPlaceFileWriter(fs) {
            this.fs = fs;
        }
        InPlaceFileWriter.prototype.writeBundle = function (_entryPoint, _bundle, transformedFiles) {
            var _this = this;
            transformedFiles.forEach(function (file) { return _this.writeFileAndBackup(file); });
        };
        InPlaceFileWriter.prototype.writeFileAndBackup = function (file) {
            this.fs.ensureDir(file_system_1.dirname(file.path));
            var backPath = file_system_1.absoluteFrom(file.path + ".__ivy_ngcc_bak");
            if (this.fs.exists(backPath)) {
                throw new Error("Tried to overwrite " + backPath + " with an ngcc back up file, which is disallowed.");
            }
            if (this.fs.exists(file.path)) {
                this.fs.moveFile(file.path, backPath);
            }
            this.fs.writeFile(file.path, file.contents);
        };
        return InPlaceFileWriter;
    }());
    exports.InPlaceFileWriter = InPlaceFileWriter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5fcGxhY2VfZmlsZV93cml0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvd3JpdGluZy9pbl9wbGFjZV9maWxlX3dyaXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUNBOzs7Ozs7T0FNRztJQUNILDJFQUFpRjtJQU1qRjs7O09BR0c7SUFDSDtRQUNFLDJCQUFzQixFQUFjO1lBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFHLENBQUM7UUFFeEMsdUNBQVcsR0FBWCxVQUFZLFdBQXVCLEVBQUUsT0FBeUIsRUFBRSxnQkFBK0I7WUFBL0YsaUJBRUM7WUFEQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRVMsOENBQWtCLEdBQTVCLFVBQTZCLElBQWlCO1lBQzVDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLHFCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBTSxRQUFRLEdBQUcsMEJBQVksQ0FBSSxJQUFJLENBQUMsSUFBSSxvQkFBaUIsQ0FBQyxDQUFDO1lBQzdELElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sSUFBSSxLQUFLLENBQ1gsd0JBQXNCLFFBQVEscURBQWtELENBQUMsQ0FBQzthQUN2RjtZQUNELElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM3QixJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3ZDO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQW5CRCxJQW1CQztJQW5CWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RmlsZVN5c3RlbSwgYWJzb2x1dGVGcm9tLCBkaXJuYW1lfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtFbnRyeVBvaW50fSBmcm9tICcuLi9wYWNrYWdlcy9lbnRyeV9wb2ludCc7XG5pbXBvcnQge0VudHJ5UG9pbnRCdW5kbGV9IGZyb20gJy4uL3BhY2thZ2VzL2VudHJ5X3BvaW50X2J1bmRsZSc7XG5pbXBvcnQge0ZpbGVUb1dyaXRlfSBmcm9tICcuLi9yZW5kZXJpbmcvdXRpbHMnO1xuaW1wb3J0IHtGaWxlV3JpdGVyfSBmcm9tICcuL2ZpbGVfd3JpdGVyJztcblxuLyoqXG4gKiBUaGlzIEZpbGVXcml0ZXIgb3ZlcndyaXRlcyB0aGUgdHJhbnNmb3JtZWQgZmlsZSwgaW4tcGxhY2UsIHdoaWxlIGNyZWF0aW5nXG4gKiBhIGJhY2stdXAgb2YgdGhlIG9yaWdpbmFsIGZpbGUgd2l0aCBhbiBleHRyYSBgLmJha2AgZXh0ZW5zaW9uLlxuICovXG5leHBvcnQgY2xhc3MgSW5QbGFjZUZpbGVXcml0ZXIgaW1wbGVtZW50cyBGaWxlV3JpdGVyIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZzOiBGaWxlU3lzdGVtKSB7fVxuXG4gIHdyaXRlQnVuZGxlKF9lbnRyeVBvaW50OiBFbnRyeVBvaW50LCBfYnVuZGxlOiBFbnRyeVBvaW50QnVuZGxlLCB0cmFuc2Zvcm1lZEZpbGVzOiBGaWxlVG9Xcml0ZVtdKSB7XG4gICAgdHJhbnNmb3JtZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4gdGhpcy53cml0ZUZpbGVBbmRCYWNrdXAoZmlsZSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHdyaXRlRmlsZUFuZEJhY2t1cChmaWxlOiBGaWxlVG9Xcml0ZSk6IHZvaWQge1xuICAgIHRoaXMuZnMuZW5zdXJlRGlyKGRpcm5hbWUoZmlsZS5wYXRoKSk7XG4gICAgY29uc3QgYmFja1BhdGggPSBhYnNvbHV0ZUZyb20oYCR7ZmlsZS5wYXRofS5fX2l2eV9uZ2NjX2Jha2ApO1xuICAgIGlmICh0aGlzLmZzLmV4aXN0cyhiYWNrUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVHJpZWQgdG8gb3ZlcndyaXRlICR7YmFja1BhdGh9IHdpdGggYW4gbmdjYyBiYWNrIHVwIGZpbGUsIHdoaWNoIGlzIGRpc2FsbG93ZWQuYCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmZzLmV4aXN0cyhmaWxlLnBhdGgpKSB7XG4gICAgICB0aGlzLmZzLm1vdmVGaWxlKGZpbGUucGF0aCwgYmFja1BhdGgpO1xuICAgIH1cbiAgICB0aGlzLmZzLndyaXRlRmlsZShmaWxlLnBhdGgsIGZpbGUuY29udGVudHMpO1xuICB9XG59XG4iXX0=
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/ngcc/src/writing/in_place_file_writer"], factory);
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
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var in_place_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer");
    var NGCC_DIRECTORY = '__ivy_ngcc__';
    /**
     * This FileWriter creates a copy of the original entry-point, then writes the transformed
     * files onto the files in this copy, and finally updates the package.json with a new
     * entry-point format property that points to this new entry-point.
     *
     * If there are transformed typings files in this bundle, they are updated in-place (see the
     * `InPlaceFileWriter`).
     */
    var NewEntryPointFileWriter = /** @class */ (function (_super) {
        tslib_1.__extends(NewEntryPointFileWriter, _super);
        function NewEntryPointFileWriter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NewEntryPointFileWriter.prototype.writeBundle = function (entryPoint, bundle, transformedFiles) {
            var _this = this;
            // The new folder is at the root of the overall package
            var ngccFolder = file_system_1.join(entryPoint.package, NGCC_DIRECTORY);
            this.copyBundle(bundle, entryPoint.package, ngccFolder);
            transformedFiles.forEach(function (file) { return _this.writeFile(file, entryPoint.package, ngccFolder); });
            this.updatePackageJson(entryPoint, bundle.formatProperty, ngccFolder);
        };
        NewEntryPointFileWriter.prototype.copyBundle = function (bundle, packagePath, ngccFolder) {
            var _this = this;
            bundle.src.program.getSourceFiles().forEach(function (sourceFile) {
                var relativePath = file_system_1.relative(packagePath, file_system_1.absoluteFromSourceFile(sourceFile));
                var isOutsidePackage = relativePath.startsWith('..');
                if (!sourceFile.isDeclarationFile && !isOutsidePackage) {
                    var newFilePath = file_system_1.join(ngccFolder, relativePath);
                    _this.fs.ensureDir(file_system_1.dirname(newFilePath));
                    _this.fs.copyFile(file_system_1.absoluteFromSourceFile(sourceFile), newFilePath);
                }
            });
        };
        NewEntryPointFileWriter.prototype.writeFile = function (file, packagePath, ngccFolder) {
            if (typescript_1.isDtsPath(file.path.replace(/\.map$/, ''))) {
                // This is either `.d.ts` or `.d.ts.map` file
                _super.prototype.writeFileAndBackup.call(this, file);
            }
            else {
                var relativePath = file_system_1.relative(packagePath, file.path);
                var newFilePath = file_system_1.join(ngccFolder, relativePath);
                this.fs.ensureDir(file_system_1.dirname(newFilePath));
                this.fs.writeFile(newFilePath, file.contents);
            }
        };
        NewEntryPointFileWriter.prototype.updatePackageJson = function (entryPoint, formatProperty, ngccFolder) {
            var formatPath = file_system_1.join(entryPoint.path, entryPoint.packageJson[formatProperty]);
            var newFormatPath = file_system_1.join(ngccFolder, file_system_1.relative(entryPoint.package, formatPath));
            var newFormatProperty = formatProperty + '_ivy_ngcc';
            entryPoint.packageJson[newFormatProperty] = file_system_1.relative(entryPoint.path, newFormatPath);
            this.fs.writeFile(file_system_1.join(entryPoint.path, 'package.json'), JSON.stringify(entryPoint.packageJson));
        };
        return NewEntryPointFileWriter;
    }(in_place_file_writer_1.InPlaceFileWriter));
    exports.NewEntryPointFileWriter = NewEntryPointFileWriter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3X2VudHJ5X3BvaW50X2ZpbGVfd3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3dyaXRpbmcvbmV3X2VudHJ5X3BvaW50X2ZpbGVfd3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNBOzs7Ozs7T0FNRztJQUNILDJFQUErRztJQUMvRyxrRkFBaUU7SUFLakUsb0dBQXlEO0lBRXpELElBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUV0Qzs7Ozs7OztPQU9HO0lBQ0g7UUFBNkMsbURBQWlCO1FBQTlEOztRQTRDQSxDQUFDO1FBM0NDLDZDQUFXLEdBQVgsVUFBWSxVQUFzQixFQUFFLE1BQXdCLEVBQUUsZ0JBQStCO1lBQTdGLGlCQU1DO1lBTEMsdURBQXVEO1lBQ3ZELElBQU0sVUFBVSxHQUFHLGtCQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQXBELENBQW9ELENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVTLDRDQUFVLEdBQXBCLFVBQ0ksTUFBd0IsRUFBRSxXQUEyQixFQUFFLFVBQTBCO1lBRHJGLGlCQVdDO1lBVEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtnQkFDcEQsSUFBTSxZQUFZLEdBQUcsc0JBQVEsQ0FBQyxXQUFXLEVBQUUsb0NBQXNCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0UsSUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3RELElBQU0sV0FBVyxHQUFHLGtCQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUNuRCxLQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxxQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLEtBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLG9DQUFzQixDQUFDLFVBQVUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2lCQUNuRTtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVTLDJDQUFTLEdBQW5CLFVBQW9CLElBQWlCLEVBQUUsV0FBMkIsRUFBRSxVQUEwQjtZQUU1RixJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlDLDZDQUE2QztnQkFDN0MsaUJBQU0sa0JBQWtCLFlBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEM7aUJBQU07Z0JBQ0wsSUFBTSxZQUFZLEdBQUcsc0JBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0RCxJQUFNLFdBQVcsR0FBRyxrQkFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMscUJBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQy9DO1FBQ0gsQ0FBQztRQUVTLG1EQUFpQixHQUEzQixVQUNJLFVBQXNCLEVBQUUsY0FBc0MsRUFBRSxVQUEwQjtZQUM1RixJQUFNLFVBQVUsR0FBRyxrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUcsQ0FBQyxDQUFDO1lBQ25GLElBQU0sYUFBYSxHQUFHLGtCQUFJLENBQUMsVUFBVSxFQUFFLHNCQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLElBQU0saUJBQWlCLEdBQUcsY0FBYyxHQUFHLFdBQVcsQ0FBQztZQUN0RCxVQUFVLENBQUMsV0FBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLHNCQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FDYixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNyRixDQUFDO1FBQ0gsOEJBQUM7SUFBRCxDQUFDLEFBNUNELENBQTZDLHdDQUFpQixHQTRDN0Q7SUE1Q1ksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlLCBkaXJuYW1lLCBqb2luLCByZWxhdGl2ZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7aXNEdHNQYXRofSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5pbXBvcnQge0VudHJ5UG9pbnQsIEVudHJ5UG9pbnRKc29uUHJvcGVydHl9IGZyb20gJy4uL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7RW50cnlQb2ludEJ1bmRsZX0gZnJvbSAnLi4vcGFja2FnZXMvZW50cnlfcG9pbnRfYnVuZGxlJztcbmltcG9ydCB7RmlsZVRvV3JpdGV9IGZyb20gJy4uL3JlbmRlcmluZy91dGlscyc7XG5cbmltcG9ydCB7SW5QbGFjZUZpbGVXcml0ZXJ9IGZyb20gJy4vaW5fcGxhY2VfZmlsZV93cml0ZXInO1xuXG5jb25zdCBOR0NDX0RJUkVDVE9SWSA9ICdfX2l2eV9uZ2NjX18nO1xuXG4vKipcbiAqIFRoaXMgRmlsZVdyaXRlciBjcmVhdGVzIGEgY29weSBvZiB0aGUgb3JpZ2luYWwgZW50cnktcG9pbnQsIHRoZW4gd3JpdGVzIHRoZSB0cmFuc2Zvcm1lZFxuICogZmlsZXMgb250byB0aGUgZmlsZXMgaW4gdGhpcyBjb3B5LCBhbmQgZmluYWxseSB1cGRhdGVzIHRoZSBwYWNrYWdlLmpzb24gd2l0aCBhIG5ld1xuICogZW50cnktcG9pbnQgZm9ybWF0IHByb3BlcnR5IHRoYXQgcG9pbnRzIHRvIHRoaXMgbmV3IGVudHJ5LXBvaW50LlxuICpcbiAqIElmIHRoZXJlIGFyZSB0cmFuc2Zvcm1lZCB0eXBpbmdzIGZpbGVzIGluIHRoaXMgYnVuZGxlLCB0aGV5IGFyZSB1cGRhdGVkIGluLXBsYWNlIChzZWUgdGhlXG4gKiBgSW5QbGFjZUZpbGVXcml0ZXJgKS5cbiAqL1xuZXhwb3J0IGNsYXNzIE5ld0VudHJ5UG9pbnRGaWxlV3JpdGVyIGV4dGVuZHMgSW5QbGFjZUZpbGVXcml0ZXIge1xuICB3cml0ZUJ1bmRsZShlbnRyeVBvaW50OiBFbnRyeVBvaW50LCBidW5kbGU6IEVudHJ5UG9pbnRCdW5kbGUsIHRyYW5zZm9ybWVkRmlsZXM6IEZpbGVUb1dyaXRlW10pIHtcbiAgICAvLyBUaGUgbmV3IGZvbGRlciBpcyBhdCB0aGUgcm9vdCBvZiB0aGUgb3ZlcmFsbCBwYWNrYWdlXG4gICAgY29uc3QgbmdjY0ZvbGRlciA9IGpvaW4oZW50cnlQb2ludC5wYWNrYWdlLCBOR0NDX0RJUkVDVE9SWSk7XG4gICAgdGhpcy5jb3B5QnVuZGxlKGJ1bmRsZSwgZW50cnlQb2ludC5wYWNrYWdlLCBuZ2NjRm9sZGVyKTtcbiAgICB0cmFuc2Zvcm1lZEZpbGVzLmZvckVhY2goZmlsZSA9PiB0aGlzLndyaXRlRmlsZShmaWxlLCBlbnRyeVBvaW50LnBhY2thZ2UsIG5nY2NGb2xkZXIpKTtcbiAgICB0aGlzLnVwZGF0ZVBhY2thZ2VKc29uKGVudHJ5UG9pbnQsIGJ1bmRsZS5mb3JtYXRQcm9wZXJ0eSwgbmdjY0ZvbGRlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29weUJ1bmRsZShcbiAgICAgIGJ1bmRsZTogRW50cnlQb2ludEJ1bmRsZSwgcGFja2FnZVBhdGg6IEFic29sdXRlRnNQYXRoLCBuZ2NjRm9sZGVyOiBBYnNvbHV0ZUZzUGF0aCkge1xuICAgIGJ1bmRsZS5zcmMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpLmZvckVhY2goc291cmNlRmlsZSA9PiB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZShwYWNrYWdlUGF0aCwgYWJzb2x1dGVGcm9tU291cmNlRmlsZShzb3VyY2VGaWxlKSk7XG4gICAgICBjb25zdCBpc091dHNpZGVQYWNrYWdlID0gcmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4uJyk7XG4gICAgICBpZiAoIXNvdXJjZUZpbGUuaXNEZWNsYXJhdGlvbkZpbGUgJiYgIWlzT3V0c2lkZVBhY2thZ2UpIHtcbiAgICAgICAgY29uc3QgbmV3RmlsZVBhdGggPSBqb2luKG5nY2NGb2xkZXIsIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKGRpcm5hbWUobmV3RmlsZVBhdGgpKTtcbiAgICAgICAgdGhpcy5mcy5jb3B5RmlsZShhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKHNvdXJjZUZpbGUpLCBuZXdGaWxlUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgd3JpdGVGaWxlKGZpbGU6IEZpbGVUb1dyaXRlLCBwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgsIG5nY2NGb2xkZXI6IEFic29sdXRlRnNQYXRoKTpcbiAgICAgIHZvaWQge1xuICAgIGlmIChpc0R0c1BhdGgoZmlsZS5wYXRoLnJlcGxhY2UoL1xcLm1hcCQvLCAnJykpKSB7XG4gICAgICAvLyBUaGlzIGlzIGVpdGhlciBgLmQudHNgIG9yIGAuZC50cy5tYXBgIGZpbGVcbiAgICAgIHN1cGVyLndyaXRlRmlsZUFuZEJhY2t1cChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocGFja2FnZVBhdGgsIGZpbGUucGF0aCk7XG4gICAgICBjb25zdCBuZXdGaWxlUGF0aCA9IGpvaW4obmdjY0ZvbGRlciwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKGRpcm5hbWUobmV3RmlsZVBhdGgpKTtcbiAgICAgIHRoaXMuZnMud3JpdGVGaWxlKG5ld0ZpbGVQYXRoLCBmaWxlLmNvbnRlbnRzKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlUGFja2FnZUpzb24oXG4gICAgICBlbnRyeVBvaW50OiBFbnRyeVBvaW50LCBmb3JtYXRQcm9wZXJ0eTogRW50cnlQb2ludEpzb25Qcm9wZXJ0eSwgbmdjY0ZvbGRlcjogQWJzb2x1dGVGc1BhdGgpIHtcbiAgICBjb25zdCBmb3JtYXRQYXRoID0gam9pbihlbnRyeVBvaW50LnBhdGgsIGVudHJ5UG9pbnQucGFja2FnZUpzb25bZm9ybWF0UHJvcGVydHldICEpO1xuICAgIGNvbnN0IG5ld0Zvcm1hdFBhdGggPSBqb2luKG5nY2NGb2xkZXIsIHJlbGF0aXZlKGVudHJ5UG9pbnQucGFja2FnZSwgZm9ybWF0UGF0aCkpO1xuICAgIGNvbnN0IG5ld0Zvcm1hdFByb3BlcnR5ID0gZm9ybWF0UHJvcGVydHkgKyAnX2l2eV9uZ2NjJztcbiAgICAoZW50cnlQb2ludC5wYWNrYWdlSnNvbiBhcyBhbnkpW25ld0Zvcm1hdFByb3BlcnR5XSA9IHJlbGF0aXZlKGVudHJ5UG9pbnQucGF0aCwgbmV3Rm9ybWF0UGF0aCk7XG4gICAgdGhpcy5mcy53cml0ZUZpbGUoXG4gICAgICAgIGpvaW4oZW50cnlQb2ludC5wYXRoLCAncGFja2FnZS5qc29uJyksIEpTT04uc3RyaW5naWZ5KGVudHJ5UG9pbnQucGFja2FnZUpzb24pKTtcbiAgfVxufVxuIl19
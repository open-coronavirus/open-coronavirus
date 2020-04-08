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
        define("@angular/compiler-cli/src/ngtsc/shims/src/summary_generator", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/shims/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/shims/src/util");
    var SummaryGenerator = /** @class */ (function () {
        function SummaryGenerator(map) {
            this.map = map;
        }
        SummaryGenerator.prototype.getSummaryFileNames = function () { return Array.from(this.map.keys()); };
        SummaryGenerator.prototype.recognize = function (fileName) { return this.map.has(fileName); };
        SummaryGenerator.prototype.generate = function (genFilePath, readFile) {
            var e_1, _a, e_2, _b;
            var originalPath = this.map.get(genFilePath);
            var original = readFile(originalPath);
            if (original === null) {
                return null;
            }
            // Collect a list of classes that need to have factory types emitted for them. This list is
            // overly broad as at this point the ts.TypeChecker has not been created and so it can't be used
            // to semantically understand which decorators are Angular decorators. It's okay to output an
            // overly broad set of summary exports as the exports are no-ops anyway, and summaries are a
            // compatibility layer which will be removed after Ivy is enabled.
            var symbolNames = [];
            try {
                for (var _c = tslib_1.__values(original.statements), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var stmt = _d.value;
                    if (ts.isClassDeclaration(stmt)) {
                        // If the class isn't exported, or if it's not decorated, then skip it.
                        if (!isExported(stmt) || stmt.decorators === undefined || stmt.name === undefined) {
                            continue;
                        }
                        symbolNames.push(stmt.name.text);
                    }
                    else if (ts.isExportDeclaration(stmt)) {
                        // Look for an export statement of the form "export {...};". If it doesn't match that, then
                        // skip it.
                        if (stmt.exportClause === undefined || stmt.moduleSpecifier !== undefined) {
                            continue;
                        }
                        try {
                            for (var _e = (e_2 = void 0, tslib_1.__values(stmt.exportClause.elements)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var specifier = _f.value;
                                // At this point, there is no guarantee that specifier here refers to a class declaration,
                                // but that's okay.
                                // Use specifier.name as that's guaranteed to be the exported name, regardless of whether
                                // specifier.propertyName is set.
                                symbolNames.push(specifier.name.text);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var varLines = symbolNames.map(function (name) { return "export const " + name + "NgSummary: any = null;"; });
            if (varLines.length === 0) {
                // In the event there are no other exports, add an empty export to ensure the generated
                // summary file is still an ES module.
                varLines.push("export const \u0275empty = null;");
            }
            var sourceText = varLines.join('\n');
            var genFile = ts.createSourceFile(genFilePath, sourceText, original.languageVersion, true, ts.ScriptKind.TS);
            if (original.moduleName !== undefined) {
                genFile.moduleName =
                    util_1.generatedModuleName(original.moduleName, original.fileName, '.ngsummary');
            }
            return genFile;
        };
        SummaryGenerator.forRootFiles = function (files) {
            var map = new Map();
            files.filter(function (sourceFile) { return typescript_1.isNonDeclarationTsPath(sourceFile); })
                .forEach(function (sourceFile) {
                return map.set(file_system_1.absoluteFrom(sourceFile.replace(/\.ts$/, '.ngsummary.ts')), sourceFile);
            });
            return new SummaryGenerator(map);
        };
        return SummaryGenerator;
    }());
    exports.SummaryGenerator = SummaryGenerator;
    function isExported(decl) {
        return decl.modifiers !== undefined &&
            decl.modifiers.some(function (mod) { return mod.kind == ts.SyntaxKind.ExportKeyword; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3NoaW1zL3NyYy9zdW1tYXJ5X2dlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMsMkVBQStEO0lBQy9ELGtGQUFpRTtJQUdqRSx1RUFBMkM7SUFFM0M7UUFDRSwwQkFBNEIsR0FBZ0M7WUFBaEMsUUFBRyxHQUFILEdBQUcsQ0FBNkI7UUFBRyxDQUFDO1FBRWhFLDhDQUFtQixHQUFuQixjQUFrQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RSxvQ0FBUyxHQUFULFVBQVUsUUFBd0IsSUFBYSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRSxtQ0FBUSxHQUFSLFVBQVMsV0FBMkIsRUFBRSxRQUFvRDs7WUFFeEYsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFHLENBQUM7WUFDakQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3hDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDckIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELDJGQUEyRjtZQUMzRixnR0FBZ0c7WUFDaEcsNkZBQTZGO1lBQzdGLDRGQUE0RjtZQUM1RixrRUFBa0U7WUFDbEUsSUFBTSxXQUFXLEdBQWEsRUFBRSxDQUFDOztnQkFDakMsS0FBbUIsSUFBQSxLQUFBLGlCQUFBLFFBQVEsQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7b0JBQW5DLElBQU0sSUFB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LENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDO0lBQzFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBhYnNvbHV0ZUZyb219IGZyb20gJy4uLy4uL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7aXNOb25EZWNsYXJhdGlvblRzUGF0aH0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7U2hpbUdlbmVyYXRvcn0gZnJvbSAnLi9ob3N0JztcbmltcG9ydCB7Z2VuZXJhdGVkTW9kdWxlTmFtZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGNsYXNzIFN1bW1hcnlHZW5lcmF0b3IgaW1wbGVtZW50cyBTaGltR2VuZXJhdG9yIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcDogTWFwPEFic29sdXRlRnNQYXRoLCBzdHJpbmc+KSB7fVxuXG4gIGdldFN1bW1hcnlGaWxlTmFtZXMoKTogc3RyaW5nW10geyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLm1hcC5rZXlzKCkpOyB9XG5cbiAgcmVjb2duaXplKGZpbGVOYW1lOiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tYXAuaGFzKGZpbGVOYW1lKTsgfVxuXG4gIGdlbmVyYXRlKGdlbkZpbGVQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcmVhZEZpbGU6IChmaWxlTmFtZTogc3RyaW5nKSA9PiB0cy5Tb3VyY2VGaWxlIHwgbnVsbCk6XG4gICAgICB0cy5Tb3VyY2VGaWxlfG51bGwge1xuICAgIGNvbnN0IG9yaWdpbmFsUGF0aCA9IHRoaXMubWFwLmdldChnZW5GaWxlUGF0aCkgITtcbiAgICBjb25zdCBvcmlnaW5hbCA9IHJlYWRGaWxlKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKG9yaWdpbmFsID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGEgbGlzdCBvZiBjbGFzc2VzIHRoYXQgbmVlZCB0byBoYXZlIGZhY3RvcnkgdHlwZXMgZW1pdHRlZCBmb3IgdGhlbS4gVGhpcyBsaXN0IGlzXG4gICAgLy8gb3Zlcmx5IGJyb2FkIGFzIGF0IHRoaXMgcG9pbnQgdGhlIHRzLlR5cGVDaGVja2VyIGhhcyBub3QgYmVlbiBjcmVhdGVkIGFuZCBzbyBpdCBjYW4ndCBiZSB1c2VkXG4gICAgLy8gdG8gc2VtYW50aWNhbGx5IHVuZGVyc3RhbmQgd2hpY2ggZGVjb3JhdG9ycyBhcmUgQW5ndWxhciBkZWNvcmF0b3JzLiBJdCdzIG9rYXkgdG8gb3V0cHV0IGFuXG4gICAgLy8gb3Zlcmx5IGJyb2FkIHNldCBvZiBzdW1tYXJ5IGV4cG9ydHMgYXMgdGhlIGV4cG9ydHMgYXJlIG5vLW9wcyBhbnl3YXksIGFuZCBzdW1tYXJpZXMgYXJlIGFcbiAgICAvLyBjb21wYXRpYmlsaXR5IGxheWVyIHdoaWNoIHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBJdnkgaXMgZW5hYmxlZC5cbiAgICBjb25zdCBzeW1ib2xOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHN0bXQgb2Ygb3JpZ2luYWwuc3RhdGVtZW50cykge1xuICAgICAgaWYgKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihzdG10KSkge1xuICAgICAgICAvLyBJZiB0aGUgY2xhc3MgaXNuJ3QgZXhwb3J0ZWQsIG9yIGlmIGl0J3Mgbm90IGRlY29yYXRlZCwgdGhlbiBza2lwIGl0LlxuICAgICAgICBpZiAoIWlzRXhwb3J0ZWQoc3RtdCkgfHwgc3RtdC5kZWNvcmF0b3JzID09PSB1bmRlZmluZWQgfHwgc3RtdC5uYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xOYW1lcy5wdXNoKHN0bXQubmFtZS50ZXh0KTtcbiAgICAgIH0gZWxzZSBpZiAodHMuaXNFeHBvcnREZWNsYXJhdGlvbihzdG10KSkge1xuICAgICAgICAvLyBMb29rIGZvciBhbiBleHBvcnQgc3RhdGVtZW50IG9mIHRoZSBmb3JtIFwiZXhwb3J0IHsuLi59O1wiLiBJZiBpdCBkb2Vzbid0IG1hdGNoIHRoYXQsIHRoZW5cbiAgICAgICAgLy8gc2tpcCBpdC5cbiAgICAgICAgaWYgKHN0bXQuZXhwb3J0Q2xhdXNlID09PSB1bmRlZmluZWQgfHwgc3RtdC5tb2R1bGVTcGVjaWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBzcGVjaWZpZXIgb2Ygc3RtdC5leHBvcnRDbGF1c2UuZWxlbWVudHMpIHtcbiAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBzcGVjaWZpZXIgaGVyZSByZWZlcnMgdG8gYSBjbGFzcyBkZWNsYXJhdGlvbixcbiAgICAgICAgICAvLyBidXQgdGhhdCdzIG9rYXkuXG5cbiAgICAgICAgICAvLyBVc2Ugc3BlY2lmaWVyLm5hbWUgYXMgdGhhdCdzIGd1YXJhbnRlZWQgdG8gYmUgdGhlIGV4cG9ydGVkIG5hbWUsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlclxuICAgICAgICAgIC8vIHNwZWNpZmllci5wcm9wZXJ0eU5hbWUgaXMgc2V0LlxuICAgICAgICAgIHN5bWJvbE5hbWVzLnB1c2goc3BlY2lmaWVyLm5hbWUudGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB2YXJMaW5lcyA9IHN5bWJvbE5hbWVzLm1hcChuYW1lID0+IGBleHBvcnQgY29uc3QgJHtuYW1lfU5nU3VtbWFyeTogYW55ID0gbnVsbDtgKTtcblxuICAgIGlmICh2YXJMaW5lcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEluIHRoZSBldmVudCB0aGVyZSBhcmUgbm8gb3RoZXIgZXhwb3J0cywgYWRkIGFuIGVtcHR5IGV4cG9ydCB0byBlbnN1cmUgdGhlIGdlbmVyYXRlZFxuICAgICAgLy8gc3VtbWFyeSBmaWxlIGlzIHN0aWxsIGFuIEVTIG1vZHVsZS5cbiAgICAgIHZhckxpbmVzLnB1c2goYGV4cG9ydCBjb25zdCDJtWVtcHR5ID0gbnVsbDtgKTtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlVGV4dCA9IHZhckxpbmVzLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGdlbkZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICBnZW5GaWxlUGF0aCwgc291cmNlVGV4dCwgb3JpZ2luYWwubGFuZ3VhZ2VWZXJzaW9uLCB0cnVlLCB0cy5TY3JpcHRLaW5kLlRTKTtcbiAgICBpZiAob3JpZ2luYWwubW9kdWxlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBnZW5GaWxlLm1vZHVsZU5hbWUgPVxuICAgICAgICAgIGdlbmVyYXRlZE1vZHVsZU5hbWUob3JpZ2luYWwubW9kdWxlTmFtZSwgb3JpZ2luYWwuZmlsZU5hbWUsICcubmdzdW1tYXJ5Jyk7XG4gICAgfVxuICAgIHJldHVybiBnZW5GaWxlO1xuICB9XG5cbiAgc3RhdGljIGZvclJvb3RGaWxlcyhmaWxlczogUmVhZG9ubHlBcnJheTxBYnNvbHV0ZUZzUGF0aD4pOiBTdW1tYXJ5R2VuZXJhdG9yIHtcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwPEFic29sdXRlRnNQYXRoLCBzdHJpbmc+KCk7XG4gICAgZmlsZXMuZmlsdGVyKHNvdXJjZUZpbGUgPT4gaXNOb25EZWNsYXJhdGlvblRzUGF0aChzb3VyY2VGaWxlKSlcbiAgICAgICAgLmZvckVhY2goXG4gICAgICAgICAgICBzb3VyY2VGaWxlID0+XG4gICAgICAgICAgICAgICAgbWFwLnNldChhYnNvbHV0ZUZyb20oc291cmNlRmlsZS5yZXBsYWNlKC9cXC50cyQvLCAnLm5nc3VtbWFyeS50cycpKSwgc291cmNlRmlsZSkpO1xuICAgIHJldHVybiBuZXcgU3VtbWFyeUdlbmVyYXRvcihtYXApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRXhwb3J0ZWQoZGVjbDogdHMuRGVjbGFyYXRpb24pOiBib29sZWFuIHtcbiAgcmV0dXJuIGRlY2wubW9kaWZpZXJzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIGRlY2wubW9kaWZpZXJzLnNvbWUobW9kID0+IG1vZC5raW5kID09IHRzLlN5bnRheEtpbmQuRXhwb3J0S2V5d29yZCk7XG59XG4iXX0=
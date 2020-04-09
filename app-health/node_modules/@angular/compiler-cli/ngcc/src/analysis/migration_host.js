(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/analysis/migration_host", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/ngcc/src/analysis/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var util_1 = require("@angular/compiler-cli/ngcc/src/analysis/util");
    /**
     * The standard implementation of `MigrationHost`, which is created by the
     * `DecorationAnalyzer`.
     */
    var DefaultMigrationHost = /** @class */ (function () {
        function DefaultMigrationHost(reflectionHost, metadata, evaluator, handlers, analyzedFiles) {
            this.reflectionHost = reflectionHost;
            this.metadata = metadata;
            this.evaluator = evaluator;
            this.handlers = handlers;
            this.analyzedFiles = analyzedFiles;
        }
        DefaultMigrationHost.prototype.injectSyntheticDecorator = function (clazz, decorator) {
            var classSymbol = this.reflectionHost.getClassSymbol(clazz);
            var newAnalyzedClass = util_1.analyzeDecorators(classSymbol, [decorator], this.handlers);
            if (newAnalyzedClass === null) {
                return;
            }
            var analyzedFile = getOrCreateAnalyzedFile(this.analyzedFiles, clazz.getSourceFile());
            var oldAnalyzedClass = analyzedFile.analyzedClasses.find(function (c) { return c.declaration === clazz; });
            if (oldAnalyzedClass === undefined) {
                analyzedFile.analyzedClasses.push(newAnalyzedClass);
            }
            else {
                mergeAnalyzedClasses(oldAnalyzedClass, newAnalyzedClass);
            }
        };
        return DefaultMigrationHost;
    }());
    exports.DefaultMigrationHost = DefaultMigrationHost;
    function getOrCreateAnalyzedFile(analyzedFiles, sourceFile) {
        var analyzedFile = analyzedFiles.find(function (file) { return file.sourceFile === sourceFile; });
        if (analyzedFile !== undefined) {
            return analyzedFile;
        }
        else {
            var newAnalyzedFile = { sourceFile: sourceFile, analyzedClasses: [] };
            analyzedFiles.push(newAnalyzedFile);
            return newAnalyzedFile;
        }
    }
    function mergeAnalyzedClasses(oldClass, newClass) {
        var e_1, _a, _b, _c;
        if (newClass.decorators !== null) {
            if (oldClass.decorators === null) {
                oldClass.decorators = newClass.decorators;
            }
            else {
                var _loop_1 = function (newDecorator) {
                    if (oldClass.decorators.some(function (d) { return d.name === newDecorator.name; })) {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.NGCC_MIGRATION_DECORATOR_INJECTION_ERROR, newClass.declaration, "Attempted to inject \"" + newDecorator.name + "\" decorator over a pre-existing decorator with the same name on the \"" + newClass.name + "\" class.");
                    }
                };
                try {
                    for (var _d = tslib_1.__values(newClass.decorators), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var newDecorator = _e.value;
                        _loop_1(newDecorator);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                (_b = oldClass.decorators).push.apply(_b, tslib_1.__spread(newClass.decorators));
            }
        }
        if (newClass.diagnostics !== undefined) {
            if (oldClass.diagnostics === undefined) {
                oldClass.diagnostics = newClass.diagnostics;
            }
            else {
                (_c = oldClass.diagnostics).push.apply(_c, tslib_1.__spread(newClass.diagnostics));
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvYW5hbHlzaXMvbWlncmF0aW9uX2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEsMkVBQStFO0lBUS9FLHFFQUF5QztJQUV6Qzs7O09BR0c7SUFDSDtRQUNFLDhCQUNhLGNBQWtDLEVBQVcsUUFBd0IsRUFDckUsU0FBMkIsRUFBVSxRQUFzQyxFQUM1RSxhQUE2QjtZQUY1QixtQkFBYyxHQUFkLGNBQWMsQ0FBb0I7WUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUNyRSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtZQUFVLGFBQVEsR0FBUixRQUFRLENBQThCO1lBQzVFLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQUFHLENBQUM7UUFFN0MsdURBQXdCLEdBQXhCLFVBQXlCLEtBQXVCLEVBQUUsU0FBb0I7WUFDcEUsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFHLENBQUM7WUFDaEUsSUFBTSxnQkFBZ0IsR0FBRyx3QkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEYsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7Z0JBQzdCLE9BQU87YUFDUjtZQUVELElBQU0sWUFBWSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDeEYsSUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUF2QixDQUF1QixDQUFDLENBQUM7WUFDekYsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDckQ7aUJBQU07Z0JBQ0wsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzthQUMxRDtRQUNILENBQUM7UUFDSCwyQkFBQztJQUFELENBQUMsQUFyQkQsSUFxQkM7SUFyQlksb0RBQW9CO0lBdUJqQyxTQUFTLHVCQUF1QixDQUM1QixhQUE2QixFQUFFLFVBQXlCO1FBQzFELElBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1FBQ2hGLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUM5QixPQUFPLFlBQVksQ0FBQztTQUNyQjthQUFNO1lBQ0wsSUFBTSxlQUFlLEdBQWlCLEVBQUMsVUFBVSxZQUFBLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBQyxDQUFDO1lBQ3hFLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDcEMsT0FBTyxlQUFlLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsU0FBUyxvQkFBb0IsQ0FBQyxRQUF1QixFQUFFLFFBQXVCOztRQUM1RSxJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFFO1lBQ2hDLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQzthQUMzQztpQkFBTTt3Q0FDTSxZQUFZO29CQUNyQixJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsSUFBSSxFQUE1QixDQUE0QixDQUFDLEVBQUU7d0JBQy9ELE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyx3Q0FBd0MsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUN4RSwyQkFBd0IsWUFBWSxDQUFDLElBQUksK0VBQXdFLFFBQVEsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxDQUFDO3FCQUMvSTs7O29CQUxILEtBQTJCLElBQUEsS0FBQSxpQkFBQSxRQUFRLENBQUMsVUFBVSxDQUFBLGdCQUFBO3dCQUF6QyxJQUFNLFlBQVksV0FBQTtnQ0FBWixZQUFZO3FCQU10Qjs7Ozs7Ozs7O2dCQUNELENBQUEsS0FBQSxRQUFRLENBQUMsVUFBVSxDQUFBLENBQUMsSUFBSSw0QkFBSSxRQUFRLENBQUMsVUFBVSxHQUFFO2FBQ2xEO1NBQ0Y7UUFFRCxJQUFJLFFBQVEsQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ3RDLElBQUksUUFBUSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQ3RDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQzthQUM3QztpQkFBTTtnQkFDTCxDQUFBLEtBQUEsUUFBUSxDQUFDLFdBQVcsQ0FBQSxDQUFDLElBQUksNEJBQUksUUFBUSxDQUFDLFdBQVcsR0FBRTthQUNwRDtTQUNGO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtNZXRhZGF0YVJlYWRlcn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL21ldGFkYXRhJztcbmltcG9ydCB7UGFydGlhbEV2YWx1YXRvcn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3BhcnRpYWxfZXZhbHVhdG9yJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbiwgRGVjb3JhdG9yfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvcmVmbGVjdGlvbic7XG5pbXBvcnQge0RlY29yYXRvckhhbmRsZXJ9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy90cmFuc2Zvcm0nO1xuaW1wb3J0IHtOZ2NjUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvbmdjY19ob3N0JztcbmltcG9ydCB7TWlncmF0aW9uSG9zdH0gZnJvbSAnLi4vbWlncmF0aW9ucy9taWdyYXRpb24nO1xuaW1wb3J0IHtBbmFseXplZENsYXNzLCBBbmFseXplZEZpbGV9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHthbmFseXplRGVjb3JhdG9yc30gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBUaGUgc3RhbmRhcmQgaW1wbGVtZW50YXRpb24gb2YgYE1pZ3JhdGlvbkhvc3RgLCB3aGljaCBpcyBjcmVhdGVkIGJ5IHRoZVxuICogYERlY29yYXRpb25BbmFseXplcmAuXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0TWlncmF0aW9uSG9zdCBpbXBsZW1lbnRzIE1pZ3JhdGlvbkhvc3Qge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IHJlZmxlY3Rpb25Ib3N0OiBOZ2NjUmVmbGVjdGlvbkhvc3QsIHJlYWRvbmx5IG1ldGFkYXRhOiBNZXRhZGF0YVJlYWRlcixcbiAgICAgIHJlYWRvbmx5IGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvciwgcHJpdmF0ZSBoYW5kbGVyczogRGVjb3JhdG9ySGFuZGxlcjxhbnksIGFueT5bXSxcbiAgICAgIHByaXZhdGUgYW5hbHl6ZWRGaWxlczogQW5hbHl6ZWRGaWxlW10pIHt9XG5cbiAgaW5qZWN0U3ludGhldGljRGVjb3JhdG9yKGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uLCBkZWNvcmF0b3I6IERlY29yYXRvcik6IHZvaWQge1xuICAgIGNvbnN0IGNsYXNzU3ltYm9sID0gdGhpcy5yZWZsZWN0aW9uSG9zdC5nZXRDbGFzc1N5bWJvbChjbGF6eikgITtcbiAgICBjb25zdCBuZXdBbmFseXplZENsYXNzID0gYW5hbHl6ZURlY29yYXRvcnMoY2xhc3NTeW1ib2wsIFtkZWNvcmF0b3JdLCB0aGlzLmhhbmRsZXJzKTtcbiAgICBpZiAobmV3QW5hbHl6ZWRDbGFzcyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFuYWx5emVkRmlsZSA9IGdldE9yQ3JlYXRlQW5hbHl6ZWRGaWxlKHRoaXMuYW5hbHl6ZWRGaWxlcywgY2xhenouZ2V0U291cmNlRmlsZSgpKTtcbiAgICBjb25zdCBvbGRBbmFseXplZENsYXNzID0gYW5hbHl6ZWRGaWxlLmFuYWx5emVkQ2xhc3Nlcy5maW5kKGMgPT4gYy5kZWNsYXJhdGlvbiA9PT0gY2xhenopO1xuICAgIGlmIChvbGRBbmFseXplZENsYXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFuYWx5emVkRmlsZS5hbmFseXplZENsYXNzZXMucHVzaChuZXdBbmFseXplZENsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VBbmFseXplZENsYXNzZXMob2xkQW5hbHl6ZWRDbGFzcywgbmV3QW5hbHl6ZWRDbGFzcyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldE9yQ3JlYXRlQW5hbHl6ZWRGaWxlKFxuICAgIGFuYWx5emVkRmlsZXM6IEFuYWx5emVkRmlsZVtdLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogQW5hbHl6ZWRGaWxlIHtcbiAgY29uc3QgYW5hbHl6ZWRGaWxlID0gYW5hbHl6ZWRGaWxlcy5maW5kKGZpbGUgPT4gZmlsZS5zb3VyY2VGaWxlID09PSBzb3VyY2VGaWxlKTtcbiAgaWYgKGFuYWx5emVkRmlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGFuYWx5emVkRmlsZTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBuZXdBbmFseXplZEZpbGU6IEFuYWx5emVkRmlsZSA9IHtzb3VyY2VGaWxlLCBhbmFseXplZENsYXNzZXM6IFtdfTtcbiAgICBhbmFseXplZEZpbGVzLnB1c2gobmV3QW5hbHl6ZWRGaWxlKTtcbiAgICByZXR1cm4gbmV3QW5hbHl6ZWRGaWxlO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlQW5hbHl6ZWRDbGFzc2VzKG9sZENsYXNzOiBBbmFseXplZENsYXNzLCBuZXdDbGFzczogQW5hbHl6ZWRDbGFzcykge1xuICBpZiAobmV3Q2xhc3MuZGVjb3JhdG9ycyAhPT0gbnVsbCkge1xuICAgIGlmIChvbGRDbGFzcy5kZWNvcmF0b3JzID09PSBudWxsKSB7XG4gICAgICBvbGRDbGFzcy5kZWNvcmF0b3JzID0gbmV3Q2xhc3MuZGVjb3JhdG9ycztcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBuZXdEZWNvcmF0b3Igb2YgbmV3Q2xhc3MuZGVjb3JhdG9ycykge1xuICAgICAgICBpZiAob2xkQ2xhc3MuZGVjb3JhdG9ycy5zb21lKGQgPT4gZC5uYW1lID09PSBuZXdEZWNvcmF0b3IubmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgICAgIEVycm9yQ29kZS5OR0NDX01JR1JBVElPTl9ERUNPUkFUT1JfSU5KRUNUSU9OX0VSUk9SLCBuZXdDbGFzcy5kZWNsYXJhdGlvbixcbiAgICAgICAgICAgICAgYEF0dGVtcHRlZCB0byBpbmplY3QgXCIke25ld0RlY29yYXRvci5uYW1lfVwiIGRlY29yYXRvciBvdmVyIGEgcHJlLWV4aXN0aW5nIGRlY29yYXRvciB3aXRoIHRoZSBzYW1lIG5hbWUgb24gdGhlIFwiJHtuZXdDbGFzcy5uYW1lfVwiIGNsYXNzLmApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvbGRDbGFzcy5kZWNvcmF0b3JzLnB1c2goLi4ubmV3Q2xhc3MuZGVjb3JhdG9ycyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG5ld0NsYXNzLmRpYWdub3N0aWNzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAob2xkQ2xhc3MuZGlhZ25vc3RpY3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb2xkQ2xhc3MuZGlhZ25vc3RpY3MgPSBuZXdDbGFzcy5kaWFnbm9zdGljcztcbiAgICB9IGVsc2Uge1xuICAgICAgb2xkQ2xhc3MuZGlhZ25vc3RpY3MucHVzaCguLi5uZXdDbGFzcy5kaWFnbm9zdGljcyk7XG4gICAgfVxuICB9XG59XG4iXX0=
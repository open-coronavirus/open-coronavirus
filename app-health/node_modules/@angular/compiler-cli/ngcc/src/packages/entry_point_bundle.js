(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/entry_point_bundle", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/file_system/src/compiler_host", "@angular/compiler-cli/ngcc/src/packages/bundle_program", "@angular/compiler-cli/ngcc/src/packages/ngcc_compiler_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var compiler_host_1 = require("@angular/compiler-cli/src/ngtsc/file_system/src/compiler_host");
    var bundle_program_1 = require("@angular/compiler-cli/ngcc/src/packages/bundle_program");
    var ngcc_compiler_host_1 = require("@angular/compiler-cli/ngcc/src/packages/ngcc_compiler_host");
    /**
     * Get an object that describes a formatted bundle for an entry-point.
     * @param fs The current file-system being used.
     * @param entryPoint The entry-point that contains the bundle.
     * @param formatPath The path to the source files for this bundle.
     * @param isCore This entry point is the Angular core package.
     * @param formatProperty The property in the package.json that holds the formatPath.
     * @param format The underlying format of the bundle.
     * @param transformDts Whether to transform the typings along with this bundle.
     * @param pathMappings An optional set of mappings to use when compiling files.
     * @param mirrorDtsFromSrc If true then the `dts` program will contain additional files that
     * were guessed by mapping the `src` files to `dts` files.
     */
    function makeEntryPointBundle(fs, entryPoint, formatPath, isCore, formatProperty, format, transformDts, pathMappings, mirrorDtsFromSrc) {
        if (mirrorDtsFromSrc === void 0) { mirrorDtsFromSrc = false; }
        // Create the TS program and necessary helpers.
        var options = tslib_1.__assign({ allowJs: true, maxNodeModuleJsDepth: Infinity, noLib: true, rootDir: entryPoint.path }, pathMappings);
        var srcHost = new ngcc_compiler_host_1.NgccSourcesCompilerHost(fs, options, entryPoint.path);
        var dtsHost = new compiler_host_1.NgtscCompilerHost(fs, options);
        var rootDirs = [file_system_1.absoluteFrom(entryPoint.path)];
        // Create the bundle programs, as necessary.
        var absFormatPath = fs.resolve(entryPoint.path, formatPath);
        var typingsPath = fs.resolve(entryPoint.path, entryPoint.typings);
        var src = bundle_program_1.makeBundleProgram(fs, isCore, absFormatPath, 'r3_symbols.js', options, srcHost);
        var additionalDtsFiles = transformDts && mirrorDtsFromSrc ?
            computePotentialDtsFilesFromJsFiles(fs, src.program, absFormatPath, typingsPath) :
            [];
        var dts = transformDts ?
            bundle_program_1.makeBundleProgram(fs, isCore, typingsPath, 'r3_symbols.d.ts', options, dtsHost, additionalDtsFiles) :
            null;
        var isFlatCore = isCore && src.r3SymbolsFile === null;
        return { entryPoint: entryPoint, format: format, formatProperty: formatProperty, rootDirs: rootDirs, isCore: isCore, isFlatCore: isFlatCore, src: src, dts: dts };
    }
    exports.makeEntryPointBundle = makeEntryPointBundle;
    function computePotentialDtsFilesFromJsFiles(fs, srcProgram, formatPath, typingsPath) {
        var e_1, _a;
        var relativePath = fs.relative(fs.dirname(formatPath), fs.dirname(typingsPath));
        var additionalFiles = [];
        try {
            for (var _b = tslib_1.__values(srcProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sf = _c.value;
                if (!sf.fileName.endsWith('.js')) {
                    continue;
                }
                var dtsPath = fs.resolve(fs.dirname(sf.fileName), relativePath, fs.basename(sf.fileName, '.js') + '.d.ts');
                if (fs.exists(dtsPath)) {
                    additionalFiles.push(dtsPath);
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
        return additionalFiles;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnRfYnVuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3BhY2thZ2VzL2VudHJ5X3BvaW50X2J1bmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFRQSwyRUFBd0Y7SUFDeEYsK0ZBQW1GO0lBRW5GLHlGQUFrRTtJQUVsRSxpR0FBNkQ7SUFpQjdEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILFNBQWdCLG9CQUFvQixDQUNoQyxFQUFjLEVBQUUsVUFBc0IsRUFBRSxVQUFrQixFQUFFLE1BQWUsRUFDM0UsY0FBc0MsRUFBRSxNQUF3QixFQUFFLFlBQXFCLEVBQ3ZGLFlBQTJCLEVBQUUsZ0JBQWlDO1FBQWpDLGlDQUFBLEVBQUEsd0JBQWlDO1FBQ2hFLCtDQUErQztRQUMvQyxJQUFNLE9BQU8sc0JBQ1gsT0FBTyxFQUFFLElBQUksRUFDYixvQkFBb0IsRUFBRSxRQUFRLEVBQzlCLEtBQUssRUFBRSxJQUFJLEVBQ1gsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLElBQUssWUFBWSxDQUMxQyxDQUFDO1FBQ0YsSUFBTSxPQUFPLEdBQUcsSUFBSSw0Q0FBdUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRSxJQUFNLE9BQU8sR0FBRyxJQUFJLGlDQUFpQixDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxJQUFNLFFBQVEsR0FBRyxDQUFDLDBCQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFakQsNENBQTRDO1FBQzVDLElBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RCxJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BFLElBQU0sR0FBRyxHQUFHLGtDQUFpQixDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUYsSUFBTSxrQkFBa0IsR0FBRyxZQUFZLElBQUksZ0JBQWdCLENBQUMsQ0FBQztZQUN6RCxtQ0FBbUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNsRixFQUFFLENBQUM7UUFDUCxJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQztZQUN0QixrQ0FBaUIsQ0FDYixFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUM7UUFDVCxJQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksR0FBRyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUM7UUFFeEQsT0FBTyxFQUFDLFVBQVUsWUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLGNBQWMsZ0JBQUEsRUFBRSxRQUFRLFVBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxHQUFHLEtBQUEsRUFBQyxDQUFDO0lBQ3RGLENBQUM7SUE3QkQsb0RBNkJDO0lBRUQsU0FBUyxtQ0FBbUMsQ0FDeEMsRUFBYyxFQUFFLFVBQXNCLEVBQUUsVUFBMEIsRUFDbEUsV0FBMkI7O1FBQzdCLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDbEYsSUFBTSxlQUFlLEdBQXFCLEVBQUUsQ0FBQzs7WUFDN0MsS0FBaUIsSUFBQSxLQUFBLGlCQUFBLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBekMsSUFBTSxFQUFFLFdBQUE7Z0JBQ1gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNoQyxTQUFTO2lCQUNWO2dCQUNELElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQ3RCLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7Z0JBQ3RGLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDdEIsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDL0I7YUFDRjs7Ozs7Ozs7O1FBQ0QsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgYWJzb2x1dGVGcm9tfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtOZ3RzY0NvbXBpbGVySG9zdH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtL3NyYy9jb21waWxlcl9ob3N0JztcbmltcG9ydCB7UGF0aE1hcHBpbmdzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0J1bmRsZVByb2dyYW0sIG1ha2VCdW5kbGVQcm9ncmFtfSBmcm9tICcuL2J1bmRsZV9wcm9ncmFtJztcbmltcG9ydCB7RW50cnlQb2ludCwgRW50cnlQb2ludEZvcm1hdCwgRW50cnlQb2ludEpzb25Qcm9wZXJ0eX0gZnJvbSAnLi9lbnRyeV9wb2ludCc7XG5pbXBvcnQge05nY2NTb3VyY2VzQ29tcGlsZXJIb3N0fSBmcm9tICcuL25nY2NfY29tcGlsZXJfaG9zdCc7XG5cbi8qKlxuICogQSBidW5kbGUgb2YgZmlsZXMgYW5kIHBhdGhzIChhbmQgVFMgcHJvZ3JhbXMpIHRoYXQgY29ycmVzcG9uZCB0byBhIHBhcnRpY3VsYXJcbiAqIGZvcm1hdCBvZiBhIHBhY2thZ2UgZW50cnktcG9pbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50cnlQb2ludEJ1bmRsZSB7XG4gIGVudHJ5UG9pbnQ6IEVudHJ5UG9pbnQ7XG4gIGZvcm1hdFByb3BlcnR5OiBFbnRyeVBvaW50SnNvblByb3BlcnR5O1xuICBmb3JtYXQ6IEVudHJ5UG9pbnRGb3JtYXQ7XG4gIGlzQ29yZTogYm9vbGVhbjtcbiAgaXNGbGF0Q29yZTogYm9vbGVhbjtcbiAgcm9vdERpcnM6IEFic29sdXRlRnNQYXRoW107XG4gIHNyYzogQnVuZGxlUHJvZ3JhbTtcbiAgZHRzOiBCdW5kbGVQcm9ncmFtfG51bGw7XG59XG5cbi8qKlxuICogR2V0IGFuIG9iamVjdCB0aGF0IGRlc2NyaWJlcyBhIGZvcm1hdHRlZCBidW5kbGUgZm9yIGFuIGVudHJ5LXBvaW50LlxuICogQHBhcmFtIGZzIFRoZSBjdXJyZW50IGZpbGUtc3lzdGVtIGJlaW5nIHVzZWQuXG4gKiBAcGFyYW0gZW50cnlQb2ludCBUaGUgZW50cnktcG9pbnQgdGhhdCBjb250YWlucyB0aGUgYnVuZGxlLlxuICogQHBhcmFtIGZvcm1hdFBhdGggVGhlIHBhdGggdG8gdGhlIHNvdXJjZSBmaWxlcyBmb3IgdGhpcyBidW5kbGUuXG4gKiBAcGFyYW0gaXNDb3JlIFRoaXMgZW50cnkgcG9pbnQgaXMgdGhlIEFuZ3VsYXIgY29yZSBwYWNrYWdlLlxuICogQHBhcmFtIGZvcm1hdFByb3BlcnR5IFRoZSBwcm9wZXJ0eSBpbiB0aGUgcGFja2FnZS5qc29uIHRoYXQgaG9sZHMgdGhlIGZvcm1hdFBhdGguXG4gKiBAcGFyYW0gZm9ybWF0IFRoZSB1bmRlcmx5aW5nIGZvcm1hdCBvZiB0aGUgYnVuZGxlLlxuICogQHBhcmFtIHRyYW5zZm9ybUR0cyBXaGV0aGVyIHRvIHRyYW5zZm9ybSB0aGUgdHlwaW5ncyBhbG9uZyB3aXRoIHRoaXMgYnVuZGxlLlxuICogQHBhcmFtIHBhdGhNYXBwaW5ncyBBbiBvcHRpb25hbCBzZXQgb2YgbWFwcGluZ3MgdG8gdXNlIHdoZW4gY29tcGlsaW5nIGZpbGVzLlxuICogQHBhcmFtIG1pcnJvckR0c0Zyb21TcmMgSWYgdHJ1ZSB0aGVuIHRoZSBgZHRzYCBwcm9ncmFtIHdpbGwgY29udGFpbiBhZGRpdGlvbmFsIGZpbGVzIHRoYXRcbiAqIHdlcmUgZ3Vlc3NlZCBieSBtYXBwaW5nIHRoZSBgc3JjYCBmaWxlcyB0byBgZHRzYCBmaWxlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFbnRyeVBvaW50QnVuZGxlKFxuICAgIGZzOiBGaWxlU3lzdGVtLCBlbnRyeVBvaW50OiBFbnRyeVBvaW50LCBmb3JtYXRQYXRoOiBzdHJpbmcsIGlzQ29yZTogYm9vbGVhbixcbiAgICBmb3JtYXRQcm9wZXJ0eTogRW50cnlQb2ludEpzb25Qcm9wZXJ0eSwgZm9ybWF0OiBFbnRyeVBvaW50Rm9ybWF0LCB0cmFuc2Zvcm1EdHM6IGJvb2xlYW4sXG4gICAgcGF0aE1hcHBpbmdzPzogUGF0aE1hcHBpbmdzLCBtaXJyb3JEdHNGcm9tU3JjOiBib29sZWFuID0gZmFsc2UpOiBFbnRyeVBvaW50QnVuZGxlfG51bGwge1xuICAvLyBDcmVhdGUgdGhlIFRTIHByb2dyYW0gYW5kIG5lY2Vzc2FyeSBoZWxwZXJzLlxuICBjb25zdCBvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMgPSB7XG4gICAgYWxsb3dKczogdHJ1ZSxcbiAgICBtYXhOb2RlTW9kdWxlSnNEZXB0aDogSW5maW5pdHksXG4gICAgbm9MaWI6IHRydWUsXG4gICAgcm9vdERpcjogZW50cnlQb2ludC5wYXRoLCAuLi5wYXRoTWFwcGluZ3NcbiAgfTtcbiAgY29uc3Qgc3JjSG9zdCA9IG5ldyBOZ2NjU291cmNlc0NvbXBpbGVySG9zdChmcywgb3B0aW9ucywgZW50cnlQb2ludC5wYXRoKTtcbiAgY29uc3QgZHRzSG9zdCA9IG5ldyBOZ3RzY0NvbXBpbGVySG9zdChmcywgb3B0aW9ucyk7XG4gIGNvbnN0IHJvb3REaXJzID0gW2Fic29sdXRlRnJvbShlbnRyeVBvaW50LnBhdGgpXTtcblxuICAvLyBDcmVhdGUgdGhlIGJ1bmRsZSBwcm9ncmFtcywgYXMgbmVjZXNzYXJ5LlxuICBjb25zdCBhYnNGb3JtYXRQYXRoID0gZnMucmVzb2x2ZShlbnRyeVBvaW50LnBhdGgsIGZvcm1hdFBhdGgpO1xuICBjb25zdCB0eXBpbmdzUGF0aCA9IGZzLnJlc29sdmUoZW50cnlQb2ludC5wYXRoLCBlbnRyeVBvaW50LnR5cGluZ3MpO1xuICBjb25zdCBzcmMgPSBtYWtlQnVuZGxlUHJvZ3JhbShmcywgaXNDb3JlLCBhYnNGb3JtYXRQYXRoLCAncjNfc3ltYm9scy5qcycsIG9wdGlvbnMsIHNyY0hvc3QpO1xuICBjb25zdCBhZGRpdGlvbmFsRHRzRmlsZXMgPSB0cmFuc2Zvcm1EdHMgJiYgbWlycm9yRHRzRnJvbVNyYyA/XG4gICAgICBjb21wdXRlUG90ZW50aWFsRHRzRmlsZXNGcm9tSnNGaWxlcyhmcywgc3JjLnByb2dyYW0sIGFic0Zvcm1hdFBhdGgsIHR5cGluZ3NQYXRoKSA6XG4gICAgICBbXTtcbiAgY29uc3QgZHRzID0gdHJhbnNmb3JtRHRzID9cbiAgICAgIG1ha2VCdW5kbGVQcm9ncmFtKFxuICAgICAgICAgIGZzLCBpc0NvcmUsIHR5cGluZ3NQYXRoLCAncjNfc3ltYm9scy5kLnRzJywgb3B0aW9ucywgZHRzSG9zdCwgYWRkaXRpb25hbER0c0ZpbGVzKSA6XG4gICAgICBudWxsO1xuICBjb25zdCBpc0ZsYXRDb3JlID0gaXNDb3JlICYmIHNyYy5yM1N5bWJvbHNGaWxlID09PSBudWxsO1xuXG4gIHJldHVybiB7ZW50cnlQb2ludCwgZm9ybWF0LCBmb3JtYXRQcm9wZXJ0eSwgcm9vdERpcnMsIGlzQ29yZSwgaXNGbGF0Q29yZSwgc3JjLCBkdHN9O1xufVxuXG5mdW5jdGlvbiBjb21wdXRlUG90ZW50aWFsRHRzRmlsZXNGcm9tSnNGaWxlcyhcbiAgICBmczogRmlsZVN5c3RlbSwgc3JjUHJvZ3JhbTogdHMuUHJvZ3JhbSwgZm9ybWF0UGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgdHlwaW5nc1BhdGg6IEFic29sdXRlRnNQYXRoKSB7XG4gIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGZzLnJlbGF0aXZlKGZzLmRpcm5hbWUoZm9ybWF0UGF0aCksIGZzLmRpcm5hbWUodHlwaW5nc1BhdGgpKTtcbiAgY29uc3QgYWRkaXRpb25hbEZpbGVzOiBBYnNvbHV0ZUZzUGF0aFtdID0gW107XG4gIGZvciAoY29uc3Qgc2Ygb2Ygc3JjUHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKSB7XG4gICAgaWYgKCFzZi5maWxlTmFtZS5lbmRzV2l0aCgnLmpzJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBkdHNQYXRoID0gZnMucmVzb2x2ZShcbiAgICAgICAgZnMuZGlybmFtZShzZi5maWxlTmFtZSksIHJlbGF0aXZlUGF0aCwgZnMuYmFzZW5hbWUoc2YuZmlsZU5hbWUsICcuanMnKSArICcuZC50cycpO1xuICAgIGlmIChmcy5leGlzdHMoZHRzUGF0aCkpIHtcbiAgICAgIGFkZGl0aW9uYWxGaWxlcy5wdXNoKGR0c1BhdGgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYWRkaXRpb25hbEZpbGVzO1xufSJdfQ==
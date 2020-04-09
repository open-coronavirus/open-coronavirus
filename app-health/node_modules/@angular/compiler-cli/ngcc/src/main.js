(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/main", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/dependency_resolver", "@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/module_resolver", "@angular/compiler-cli/ngcc/src/dependencies/umd_dependency_host", "@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder", "@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder", "@angular/compiler-cli/ngcc/src/logging/console_logger", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/packages/configuration", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/packages/entry_point_bundle", "@angular/compiler-cli/ngcc/src/packages/transformer", "@angular/compiler-cli/ngcc/src/writing/in_place_file_writer", "@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer"], factory);
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
    var commonjs_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host");
    var dependency_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dependency_resolver");
    var esm_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host");
    var module_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/module_resolver");
    var umd_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/umd_dependency_host");
    var directory_walker_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder");
    var targeted_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder");
    var console_logger_1 = require("@angular/compiler-cli/ngcc/src/logging/console_logger");
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var configuration_1 = require("@angular/compiler-cli/ngcc/src/packages/configuration");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var entry_point_bundle_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point_bundle");
    var transformer_1 = require("@angular/compiler-cli/ngcc/src/packages/transformer");
    var in_place_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer");
    var new_entry_point_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer");
    var SUPPORTED_FORMATS = ['esm5', 'esm2015', 'umd', 'commonjs'];
    /**
     * This is the main entry-point into ngcc (aNGular Compatibility Compiler).
     *
     * You can call this function to process one or more npm packages, to ensure
     * that they are compatible with the ivy compiler (ngtsc).
     *
     * @param options The options telling ngcc what to compile and how.
     */
    function mainNgcc(_a) {
        var e_1, _b;
        var basePath = _a.basePath, targetEntryPointPath = _a.targetEntryPointPath, _c = _a.propertiesToConsider, propertiesToConsider = _c === void 0 ? entry_point_1.SUPPORTED_FORMAT_PROPERTIES : _c, _d = _a.compileAllFormats, compileAllFormats = _d === void 0 ? true : _d, _e = _a.createNewEntryPointFormats, createNewEntryPointFormats = _e === void 0 ? false : _e, _f = _a.logger, logger = _f === void 0 ? new console_logger_1.ConsoleLogger(console_logger_1.LogLevel.info) : _f, pathMappings = _a.pathMappings;
        var fileSystem = file_system_1.getFileSystem();
        var transformer = new transformer_1.Transformer(fileSystem, logger);
        var moduleResolver = new module_resolver_1.ModuleResolver(fileSystem, pathMappings);
        var esmDependencyHost = new esm_dependency_host_1.EsmDependencyHost(fileSystem, moduleResolver);
        var umdDependencyHost = new umd_dependency_host_1.UmdDependencyHost(fileSystem, moduleResolver);
        var commonJsDependencyHost = new commonjs_dependency_host_1.CommonJsDependencyHost(fileSystem, moduleResolver);
        var resolver = new dependency_resolver_1.DependencyResolver(fileSystem, logger, {
            esm5: esmDependencyHost,
            esm2015: esmDependencyHost,
            umd: umdDependencyHost,
            commonjs: commonJsDependencyHost
        });
        var absBasePath = file_system_1.absoluteFrom(basePath);
        var config = new configuration_1.NgccConfiguration(fileSystem, file_system_1.dirname(absBasePath));
        var fileWriter = getFileWriter(fileSystem, createNewEntryPointFormats);
        var entryPoints = getEntryPoints(fileSystem, config, logger, resolver, absBasePath, targetEntryPointPath, pathMappings, propertiesToConsider, compileAllFormats);
        try {
            for (var entryPoints_1 = tslib_1.__values(entryPoints), entryPoints_1_1 = entryPoints_1.next(); !entryPoints_1_1.done; entryPoints_1_1 = entryPoints_1.next()) {
                var entryPoint = entryPoints_1_1.value;
                // Are we compiling the Angular core?
                var isCore = entryPoint.name === '@angular/core';
                var compiledFormats = new Set();
                var entryPointPackageJson = entryPoint.packageJson;
                var entryPointPackageJsonPath = fileSystem.resolve(entryPoint.path, 'package.json');
                var hasProcessedDts = build_marker_1.hasBeenProcessed(entryPointPackageJson, 'typings');
                for (var i = 0; i < propertiesToConsider.length; i++) {
                    var property = propertiesToConsider[i];
                    var formatPath = entryPointPackageJson[property];
                    var format = entry_point_1.getEntryPointFormat(fileSystem, entryPoint, property);
                    // No format then this property is not supposed to be compiled.
                    if (!formatPath || !format || SUPPORTED_FORMATS.indexOf(format) === -1)
                        continue;
                    if (build_marker_1.hasBeenProcessed(entryPointPackageJson, property)) {
                        compiledFormats.add(formatPath);
                        logger.debug("Skipping " + entryPoint.name + " : " + property + " (already compiled).");
                        continue;
                    }
                    var isFirstFormat = compiledFormats.size === 0;
                    var processDts = !hasProcessedDts && isFirstFormat;
                    // We don't break if this if statement fails because we still want to mark
                    // the property as processed even if its underlying format has been built already.
                    if (!compiledFormats.has(formatPath) && (compileAllFormats || isFirstFormat)) {
                        var bundle = entry_point_bundle_1.makeEntryPointBundle(fileSystem, entryPoint, formatPath, isCore, property, format, processDts, pathMappings, true);
                        if (bundle) {
                            logger.info("Compiling " + entryPoint.name + " : " + property + " as " + format);
                            var transformedFiles = transformer.transform(bundle);
                            fileWriter.writeBundle(entryPoint, bundle, transformedFiles);
                            compiledFormats.add(formatPath);
                        }
                        else {
                            logger.warn("Skipping " + entryPoint.name + " : " + format + " (no valid entry point file for this format).");
                        }
                    }
                    // Either this format was just compiled or its underlying format was compiled because of a
                    // previous property.
                    if (compiledFormats.has(formatPath)) {
                        build_marker_1.markAsProcessed(fileSystem, entryPointPackageJson, entryPointPackageJsonPath, property);
                        if (processDts) {
                            build_marker_1.markAsProcessed(fileSystem, entryPointPackageJson, entryPointPackageJsonPath, 'typings');
                        }
                    }
                }
                if (compiledFormats.size === 0) {
                    throw new Error("Failed to compile any formats for entry-point at (" + entryPoint.path + "). Tried " + propertiesToConsider + ".");
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (entryPoints_1_1 && !entryPoints_1_1.done && (_b = entryPoints_1.return)) _b.call(entryPoints_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    exports.mainNgcc = mainNgcc;
    function getFileWriter(fs, createNewEntryPointFormats) {
        return createNewEntryPointFormats ? new new_entry_point_file_writer_1.NewEntryPointFileWriter(fs) : new in_place_file_writer_1.InPlaceFileWriter(fs);
    }
    function getEntryPoints(fs, config, logger, resolver, basePath, targetEntryPointPath, pathMappings, propertiesToConsider, compileAllFormats) {
        var _a = (targetEntryPointPath !== undefined) ?
            getTargetedEntryPoints(fs, config, logger, resolver, basePath, targetEntryPointPath, propertiesToConsider, compileAllFormats, pathMappings) :
            getAllEntryPoints(fs, config, logger, resolver, basePath, pathMappings), entryPoints = _a.entryPoints, invalidEntryPoints = _a.invalidEntryPoints;
        logInvalidEntryPoints(logger, invalidEntryPoints);
        return entryPoints;
    }
    function getTargetedEntryPoints(fs, config, logger, resolver, basePath, targetEntryPointPath, propertiesToConsider, compileAllFormats, pathMappings) {
        var absoluteTargetEntryPointPath = file_system_1.resolve(basePath, targetEntryPointPath);
        if (hasProcessedTargetEntryPoint(fs, absoluteTargetEntryPointPath, propertiesToConsider, compileAllFormats)) {
            logger.debug('The target entry-point has already been processed');
            return { entryPoints: [], invalidEntryPoints: [], ignoredDependencies: [] };
        }
        var finder = new targeted_entry_point_finder_1.TargetedEntryPointFinder(fs, config, logger, resolver, basePath, absoluteTargetEntryPointPath, pathMappings);
        var entryPointInfo = finder.findEntryPoints();
        if (entryPointInfo.entryPoints.length === 0) {
            markNonAngularPackageAsProcessed(fs, absoluteTargetEntryPointPath, propertiesToConsider);
        }
        return entryPointInfo;
    }
    function getAllEntryPoints(fs, config, logger, resolver, basePath, pathMappings) {
        var finder = new directory_walker_entry_point_finder_1.DirectoryWalkerEntryPointFinder(fs, config, logger, resolver, basePath, pathMappings);
        return finder.findEntryPoints();
    }
    function hasProcessedTargetEntryPoint(fs, targetPath, propertiesToConsider, compileAllFormats) {
        var e_2, _a;
        var packageJsonPath = file_system_1.resolve(targetPath, 'package.json');
        // It might be that this target is configured in which case its package.json might not exist.
        if (!fs.exists(packageJsonPath)) {
            return false;
        }
        var packageJson = JSON.parse(fs.readFile(packageJsonPath));
        try {
            for (var propertiesToConsider_1 = tslib_1.__values(propertiesToConsider), propertiesToConsider_1_1 = propertiesToConsider_1.next(); !propertiesToConsider_1_1.done; propertiesToConsider_1_1 = propertiesToConsider_1.next()) {
                var property = propertiesToConsider_1_1.value;
                if (packageJson[property]) {
                    // Here is a property that should be processed
                    if (build_marker_1.hasBeenProcessed(packageJson, property)) {
                        if (!compileAllFormats) {
                            // It has been processed and we only need one, so we are done.
                            return true;
                        }
                    }
                    else {
                        // It has not been processed but we need all of them, so we are done.
                        return false;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (propertiesToConsider_1_1 && !propertiesToConsider_1_1.done && (_a = propertiesToConsider_1.return)) _a.call(propertiesToConsider_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Either all formats need to be compiled and there were none that were unprocessed,
        // Or only the one matching format needs to be compiled but there was at least one matching
        // property before the first processed format that was unprocessed.
        return true;
    }
    /**
     * If we get here, then the requested entry-point did not contain anything compiled by
     * the old Angular compiler. Therefore there is nothing for ngcc to do.
     * So mark all formats in this entry-point as processed so that clients of ngcc can avoid
     * triggering ngcc for this entry-point in the future.
     */
    function markNonAngularPackageAsProcessed(fs, path, propertiesToConsider) {
        var packageJsonPath = file_system_1.resolve(path, 'package.json');
        var packageJson = JSON.parse(fs.readFile(packageJsonPath));
        propertiesToConsider.forEach(function (formatProperty) {
            if (packageJson[formatProperty])
                build_marker_1.markAsProcessed(fs, packageJson, packageJsonPath, formatProperty);
        });
    }
    function logInvalidEntryPoints(logger, invalidEntryPoints) {
        invalidEntryPoints.forEach(function (invalidEntryPoint) {
            logger.debug("Invalid entry-point " + invalidEntryPoint.entryPoint.path + ".", "It is missing required dependencies:\n" +
                invalidEntryPoint.missingDependencies.map(function (dep) { return " - " + dep; }).join('\n'));
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFzSDtJQUN0SCxpSEFBK0U7SUFDL0UsdUdBQWdIO0lBQ2hILHVHQUFxRTtJQUNyRSwrRkFBOEQ7SUFDOUQsdUdBQXFFO0lBQ3JFLDZJQUF5RztJQUN6Ryw2SEFBMEY7SUFDMUYsd0ZBQWlFO0lBRWpFLHFGQUEwRTtJQUMxRSx1RkFBMkQ7SUFDM0QsbUZBQThJO0lBQzlJLGlHQUFtRTtJQUNuRSxtRkFBbUQ7SUFHbkQsb0dBQWlFO0lBQ2pFLGtIQUE4RTtJQTZDOUUsSUFBTSxpQkFBaUIsR0FBdUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUVyRjs7Ozs7OztPQU9HO0lBQ0gsU0FBZ0IsUUFBUSxDQUNwQixFQUVzRTs7WUFGckUsc0JBQVEsRUFBRSw4Q0FBb0IsRUFBRSw0QkFBa0QsRUFBbEQscUZBQWtELEVBQ2xGLHlCQUF3QixFQUF4Qiw2Q0FBd0IsRUFBRSxrQ0FBa0MsRUFBbEMsdURBQWtDLEVBQzVELGNBQXlDLEVBQXpDLGdHQUF5QyxFQUFFLDhCQUFZO1FBQzFELElBQU0sVUFBVSxHQUFHLDJCQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFNLFdBQVcsR0FBRyxJQUFJLHlCQUFXLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELElBQU0sY0FBYyxHQUFHLElBQUksZ0NBQWMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDcEUsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLHVDQUFpQixDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM1RSxJQUFNLGlCQUFpQixHQUFHLElBQUksdUNBQWlCLENBQUMs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ckUsT0FBTyxLQUFLLENBQUM7cUJBQ2Q7aUJBQ0Y7YUFDRjs7Ozs7Ozs7O1FBQ0Qsb0ZBQW9GO1FBQ3BGLDJGQUEyRjtRQUMzRixtRUFBbUU7UUFDbkUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLGdDQUFnQyxDQUNyQyxFQUFjLEVBQUUsSUFBb0IsRUFBRSxvQkFBOEI7UUFDdEUsSUFBTSxlQUFlLEdBQUcscUJBQU8sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDN0Qsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFVBQUEsY0FBYztZQUN6QyxJQUFJLFdBQVcsQ0FBQyxjQUFjLENBQUM7Z0JBQzdCLDhCQUFlLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsY0FBd0MsQ0FBQyxDQUFDO1FBQ2hHLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMscUJBQXFCLENBQUMsTUFBYyxFQUFFLGtCQUF1QztRQUNwRixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxpQkFBaUI7WUFDMUMsTUFBTSxDQUFDLEtBQUssQ0FDUix5QkFBdUIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksTUFBRyxFQUMzRCx3Q0FBd0M7Z0JBQ3BDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLFFBQU0sR0FBSyxFQUFYLENBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIGFic29sdXRlRnJvbSwgZGlybmFtZSwgZ2V0RmlsZVN5c3RlbSwgcmVzb2x2ZX0gZnJvbSAnLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Q29tbW9uSnNEZXBlbmRlbmN5SG9zdH0gZnJvbSAnLi9kZXBlbmRlbmNpZXMvY29tbW9uanNfZGVwZW5kZW5jeV9ob3N0JztcbmltcG9ydCB7RGVwZW5kZW5jeVJlc29sdmVyLCBJbnZhbGlkRW50cnlQb2ludCwgU29ydGVkRW50cnlQb2ludHNJbmZvfSBmcm9tICcuL2RlcGVuZGVuY2llcy9kZXBlbmRlbmN5X3Jlc29sdmVyJztcbmltcG9ydCB7RXNtRGVwZW5kZW5jeUhvc3R9IGZyb20gJy4vZGVwZW5kZW5jaWVzL2VzbV9kZXBlbmRlbmN5X2hvc3QnO1xuaW1wb3J0IHtNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi9kZXBlbmRlbmNpZXMvbW9kdWxlX3Jlc29sdmVyJztcbmltcG9ydCB7VW1kRGVwZW5kZW5jeUhvc3R9IGZyb20gJy4vZGVwZW5kZW5jaWVzL3VtZF9kZXBlbmRlbmN5X2hvc3QnO1xuaW1wb3J0IHtEaXJlY3RvcnlXYWxrZXJFbnRyeVBvaW50RmluZGVyfSBmcm9tICcuL2VudHJ5X3BvaW50X2ZpbmRlci9kaXJlY3Rvcnlfd2Fsa2VyX2VudHJ5X3BvaW50X2ZpbmRlcic7XG5pbXBvcnQge1RhcmdldGVkRW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi9lbnRyeV9wb2ludF9maW5kZXIvdGFyZ2V0ZWRfZW50cnlfcG9pbnRfZmluZGVyJztcbmltcG9ydCB7Q29uc29sZUxvZ2dlciwgTG9nTGV2ZWx9IGZyb20gJy4vbG9nZ2luZy9jb25zb2xlX2xvZ2dlcic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi9sb2dnaW5nL2xvZ2dlcic7XG5pbXBvcnQge2hhc0JlZW5Qcm9jZXNzZWQsIG1hcmtBc1Byb2Nlc3NlZH0gZnJvbSAnLi9wYWNrYWdlcy9idWlsZF9tYXJrZXInO1xuaW1wb3J0IHtOZ2NjQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9wYWNrYWdlcy9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7RW50cnlQb2ludCwgRW50cnlQb2ludEZvcm1hdCwgRW50cnlQb2ludEpzb25Qcm9wZXJ0eSwgU1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTLCBnZXRFbnRyeVBvaW50Rm9ybWF0fSBmcm9tICcuL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7bWFrZUVudHJ5UG9pbnRCdW5kbGV9IGZyb20gJy4vcGFja2FnZXMvZW50cnlfcG9pbnRfYnVuZGxlJztcbmltcG9ydCB7VHJhbnNmb3JtZXJ9IGZyb20gJy4vcGFja2FnZXMvdHJhbnNmb3JtZXInO1xuaW1wb3J0IHtQYXRoTWFwcGluZ3N9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtGaWxlV3JpdGVyfSBmcm9tICcuL3dyaXRpbmcvZmlsZV93cml0ZXInO1xuaW1wb3J0IHtJblBsYWNlRmlsZVdyaXRlcn0gZnJvbSAnLi93cml0aW5nL2luX3BsYWNlX2ZpbGVfd3JpdGVyJztcbmltcG9ydCB7TmV3RW50cnlQb2ludEZpbGVXcml0ZXJ9IGZyb20gJy4vd3JpdGluZy9uZXdfZW50cnlfcG9pbnRfZmlsZV93cml0ZXInO1xuXG4vKipcbiAqIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgbmdjYyBjb21waWxlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2NjT3B0aW9ucyB7XG4gIC8qKiBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgYG5vZGVfbW9kdWxlc2AgZm9sZGVyIHRoYXQgY29udGFpbnMgdGhlIHBhY2thZ2VzIHRvIHByb2Nlc3MuICovXG4gIGJhc2VQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgcHJpbWFyeSBwYWNrYWdlIHRvIGJlIHByb2Nlc3NlZC4gSWYgbm90IGFic29sdXRlIHRoZW4gaXQgbXVzdCBiZSByZWxhdGl2ZSB0b1xuICAgKiBgYmFzZVBhdGhgLlxuICAgKlxuICAgKiBBbGwgaXRzIGRlcGVuZGVuY2llcyB3aWxsIG5lZWQgdG8gYmUgcHJvY2Vzc2VkIHRvby5cbiAgICovXG4gIHRhcmdldEVudHJ5UG9pbnRQYXRoPzogc3RyaW5nO1xuICAvKipcbiAgICogV2hpY2ggZW50cnktcG9pbnQgcHJvcGVydGllcyBpbiB0aGUgcGFja2FnZS5qc29uIHRvIGNvbnNpZGVyIHdoZW4gcHJvY2Vzc2luZyBhbiBlbnRyeS1wb2ludC5cbiAgICogRWFjaCBwcm9wZXJ0eSBzaG91bGQgaG9sZCBhIHBhdGggdG8gdGhlIHBhcnRpY3VsYXIgYnVuZGxlIGZvcm1hdCBmb3IgdGhlIGVudHJ5LXBvaW50LlxuICAgKiBEZWZhdWx0cyB0byBhbGwgdGhlIHByb3BlcnRpZXMgaW4gdGhlIHBhY2thZ2UuanNvbi5cbiAgICovXG4gIHByb3BlcnRpZXNUb0NvbnNpZGVyPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHByb2Nlc3MgYWxsIGZvcm1hdHMgc3BlY2lmaWVkIGJ5IChgcHJvcGVydGllc1RvQ29uc2lkZXJgKSAgb3IgdG8gc3RvcCBwcm9jZXNzaW5nXG4gICAqIHRoaXMgZW50cnktcG9pbnQgYXQgdGhlIGZpcnN0IG1hdGNoaW5nIGZvcm1hdC4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAgKi9cbiAgY29tcGlsZUFsbEZvcm1hdHM/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgbmV3IGVudHJ5LXBvaW50cyBidW5kbGVzIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nIHRoZSBvcmlnaW5hbCBmaWxlcy5cbiAgICovXG4gIGNyZWF0ZU5ld0VudHJ5UG9pbnRGb3JtYXRzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFByb3ZpZGUgYSBsb2dnZXIgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGxvZyBtZXNzYWdlcy5cbiAgICovXG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgLyoqXG4gICAqIFBhdGhzIG1hcHBpbmcgY29uZmlndXJhdGlvbiAoYHBhdGhzYCBhbmQgYGJhc2VVcmxgKSwgYXMgZm91bmQgaW4gYHRzLkNvbXBpbGVyT3B0aW9uc2AuXG4gICAqIFRoZXNlIGFyZSB1c2VkIHRvIHJlc29sdmUgcGF0aHMgdG8gbG9jYWxseSBidWlsdCBBbmd1bGFyIGxpYnJhcmllcy5cbiAgICovXG4gIHBhdGhNYXBwaW5ncz86IFBhdGhNYXBwaW5ncztcbiAgLyoqXG4gICAqIFByb3ZpZGUgYSBmaWxlLXN5c3RlbSBzZXJ2aWNlIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IG5nY2MgZm9yIGFsbCBmaWxlIGludGVyYWN0aW9ucy5cbiAgICovXG4gIGZpbGVTeXN0ZW0/OiBGaWxlU3lzdGVtO1xufVxuXG5jb25zdCBTVVBQT1JURURfRk9STUFUUzogRW50cnlQb2ludEZvcm1hdFtdID0gWydlc201JywgJ2VzbTIwMTUnLCAndW1kJywgJ2NvbW1vbmpzJ107XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgbWFpbiBlbnRyeS1wb2ludCBpbnRvIG5nY2MgKGFOR3VsYXIgQ29tcGF0aWJpbGl0eSBDb21waWxlcikuXG4gKlxuICogWW91IGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gcHJvY2VzcyBvbmUgb3IgbW9yZSBucG0gcGFja2FnZXMsIHRvIGVuc3VyZVxuICogdGhhdCB0aGV5IGFyZSBjb21wYXRpYmxlIHdpdGggdGhlIGl2eSBjb21waWxlciAobmd0c2MpLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIHRlbGxpbmcgbmdjYyB3aGF0IHRvIGNvbXBpbGUgYW5kIGhvdy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1haW5OZ2NjKFxuICAgIHtiYXNlUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGgsIHByb3BlcnRpZXNUb0NvbnNpZGVyID0gU1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTLFxuICAgICBjb21waWxlQWxsRm9ybWF0cyA9IHRydWUsIGNyZWF0ZU5ld0VudHJ5UG9pbnRGb3JtYXRzID0gZmFsc2UsXG4gICAgIGxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKExvZ0xldmVsLmluZm8pLCBwYXRoTWFwcGluZ3N9OiBOZ2NjT3B0aW9ucyk6IHZvaWQge1xuICBjb25zdCBmaWxlU3lzdGVtID0gZ2V0RmlsZVN5c3RlbSgpO1xuICBjb25zdCB0cmFuc2Zvcm1lciA9IG5ldyBUcmFuc2Zvcm1lcihmaWxlU3lzdGVtLCBsb2dnZXIpO1xuICBjb25zdCBtb2R1bGVSZXNvbHZlciA9IG5ldyBNb2R1bGVSZXNvbHZlcihmaWxlU3lzdGVtLCBwYXRoTWFwcGluZ3MpO1xuICBjb25zdCBlc21EZXBlbmRlbmN5SG9zdCA9IG5ldyBFc21EZXBlbmRlbmN5SG9zdChmaWxlU3lzdGVtLCBtb2R1bGVSZXNvbHZlcik7XG4gIGNvbnN0IHVtZERlcGVuZGVuY3lIb3N0ID0gbmV3IFVtZERlcGVuZGVuY3lIb3N0KGZpbGVTeXN0ZW0sIG1vZHVsZVJlc29sdmVyKTtcbiAgY29uc3QgY29tbW9uSnNEZXBlbmRlbmN5SG9zdCA9IG5ldyBDb21tb25Kc0RlcGVuZGVuY3lIb3N0KGZpbGVTeXN0ZW0sIG1vZHVsZVJlc29sdmVyKTtcbiAgY29uc3QgcmVzb2x2ZXIgPSBuZXcgRGVwZW5kZW5jeVJlc29sdmVyKGZpbGVTeXN0ZW0sIGxvZ2dlciwge1xuICAgIGVzbTU6IGVzbURlcGVuZGVuY3lIb3N0LFxuICAgIGVzbTIwMTU6IGVzbURlcGVuZGVuY3lIb3N0LFxuICAgIHVtZDogdW1kRGVwZW5kZW5jeUhvc3QsXG4gICAgY29tbW9uanM6IGNvbW1vbkpzRGVwZW5kZW5jeUhvc3RcbiAgfSk7XG4gIGNvbnN0IGFic0Jhc2VQYXRoID0gYWJzb2x1dGVGcm9tKGJhc2VQYXRoKTtcbiAgY29uc3QgY29uZmlnID0gbmV3IE5nY2NDb25maWd1cmF0aW9uKGZpbGVTeXN0ZW0sIGRpcm5hbWUoYWJzQmFzZVBhdGgpKTtcbiAgY29uc3QgZmlsZVdyaXRlciA9IGdldEZpbGVXcml0ZXIoZmlsZVN5c3RlbSwgY3JlYXRlTmV3RW50cnlQb2ludEZvcm1hdHMpO1xuICBjb25zdCBlbnRyeVBvaW50cyA9IGdldEVudHJ5UG9pbnRzKFxuICAgICAgZmlsZVN5c3RlbSwgY29uZmlnLCBsb2dnZXIsIHJlc29sdmVyLCBhYnNCYXNlUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGgsIHBhdGhNYXBwaW5ncyxcbiAgICAgIHByb3BlcnRpZXNUb0NvbnNpZGVyLCBjb21waWxlQWxsRm9ybWF0cyk7XG4gIGZvciAoY29uc3QgZW50cnlQb2ludCBvZiBlbnRyeVBvaW50cykge1xuICAgIC8vIEFyZSB3ZSBjb21waWxpbmcgdGhlIEFuZ3VsYXIgY29yZT9cbiAgICBjb25zdCBpc0NvcmUgPSBlbnRyeVBvaW50Lm5hbWUgPT09ICdAYW5ndWxhci9jb3JlJztcblxuICAgIGNvbnN0IGNvbXBpbGVkRm9ybWF0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGVudHJ5UG9pbnRQYWNrYWdlSnNvbiA9IGVudHJ5UG9pbnQucGFja2FnZUpzb247XG4gICAgY29uc3QgZW50cnlQb2ludFBhY2thZ2VKc29uUGF0aCA9IGZpbGVTeXN0ZW0ucmVzb2x2ZShlbnRyeVBvaW50LnBhdGgsICdwYWNrYWdlLmpzb24nKTtcblxuICAgIGNvbnN0IGhhc1Byb2Nlc3NlZER0cyA9IGhhc0JlZW5Qcm9jZXNzZWQoZW50cnlQb2ludFBhY2thZ2VKc29uLCAndHlwaW5ncycpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzVG9Db25zaWRlci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcHJvcGVydHkgPSBwcm9wZXJ0aWVzVG9Db25zaWRlcltpXSBhcyBFbnRyeVBvaW50SnNvblByb3BlcnR5O1xuICAgICAgY29uc3QgZm9ybWF0UGF0aCA9IGVudHJ5UG9pbnRQYWNrYWdlSnNvbltwcm9wZXJ0eV07XG4gICAgICBjb25zdCBmb3JtYXQgPSBnZXRFbnRyeVBvaW50Rm9ybWF0KGZpbGVTeXN0ZW0sIGVudHJ5UG9pbnQsIHByb3BlcnR5KTtcblxuICAgICAgLy8gTm8gZm9ybWF0IHRoZW4gdGhpcyBwcm9wZXJ0eSBpcyBub3Qgc3VwcG9zZWQgdG8gYmUgY29tcGlsZWQuXG4gICAgICBpZiAoIWZvcm1hdFBhdGggfHwgIWZvcm1hdCB8fCBTVVBQT1JURURfRk9STUFUUy5pbmRleE9mKGZvcm1hdCkgPT09IC0xKSBjb250aW51ZTtcblxuICAgICAgaWYgKGhhc0JlZW5Qcm9jZXNzZWQoZW50cnlQb2ludFBhY2thZ2VKc29uLCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgY29tcGlsZWRGb3JtYXRzLmFkZChmb3JtYXRQYXRoKTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBTa2lwcGluZyAke2VudHJ5UG9pbnQubmFtZX0gOiAke3Byb3BlcnR5fSAoYWxyZWFkeSBjb21waWxlZCkuYCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0ZpcnN0Rm9ybWF0ID0gY29tcGlsZWRGb3JtYXRzLnNpemUgPT09IDA7XG4gICAgICBjb25zdCBwcm9jZXNzRHRzID0gIWhhc1Byb2Nlc3NlZER0cyAmJiBpc0ZpcnN0Rm9ybWF0O1xuXG4gICAgICAvLyBXZSBkb24ndCBicmVhayBpZiB0aGlzIGlmIHN0YXRlbWVudCBmYWlscyBiZWNhdXNlIHdlIHN0aWxsIHdhbnQgdG8gbWFya1xuICAgICAgLy8gdGhlIHByb3BlcnR5IGFzIHByb2Nlc3NlZCBldmVuIGlmIGl0cyB1bmRlcmx5aW5nIGZvcm1hdCBoYXMgYmVlbiBidWlsdCBhbHJlYWR5LlxuICAgICAgaWYgKCFjb21waWxlZEZvcm1hdHMuaGFzKGZvcm1hdFBhdGgpICYmIChjb21waWxlQWxsRm9ybWF0cyB8fCBpc0ZpcnN0Rm9ybWF0KSkge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBtYWtlRW50cnlQb2ludEJ1bmRsZShcbiAgICAgICAgICAgIGZpbGVTeXN0ZW0sIGVudHJ5UG9pbnQsIGZvcm1hdFBhdGgsIGlzQ29yZSwgcHJvcGVydHksIGZvcm1hdCwgcHJvY2Vzc0R0cywgcGF0aE1hcHBpbmdzLFxuICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIGlmIChidW5kbGUpIHtcbiAgICAgICAgICBsb2dnZXIuaW5mbyhgQ29tcGlsaW5nICR7ZW50cnlQb2ludC5uYW1lfSA6ICR7cHJvcGVydHl9IGFzICR7Zm9ybWF0fWApO1xuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkRmlsZXMgPSB0cmFuc2Zvcm1lci50cmFuc2Zvcm0oYnVuZGxlKTtcbiAgICAgICAgICBmaWxlV3JpdGVyLndyaXRlQnVuZGxlKGVudHJ5UG9pbnQsIGJ1bmRsZSwgdHJhbnNmb3JtZWRGaWxlcyk7XG4gICAgICAgICAgY29tcGlsZWRGb3JtYXRzLmFkZChmb3JtYXRQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dnZXIud2FybihcbiAgICAgICAgICAgICAgYFNraXBwaW5nICR7ZW50cnlQb2ludC5uYW1lfSA6ICR7Zm9ybWF0fSAobm8gdmFsaWQgZW50cnkgcG9pbnQgZmlsZSBmb3IgdGhpcyBmb3JtYXQpLmApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEVpdGhlciB0aGlzIGZvcm1hdCB3YXMganVzdCBjb21waWxlZCBvciBpdHMgdW5kZXJseWluZyBmb3JtYXQgd2FzIGNvbXBpbGVkIGJlY2F1c2Ugb2YgYVxuICAgICAgLy8gcHJldmlvdXMgcHJvcGVydHkuXG4gICAgICBpZiAoY29tcGlsZWRGb3JtYXRzLmhhcyhmb3JtYXRQYXRoKSkge1xuICAgICAgICBtYXJrQXNQcm9jZXNzZWQoZmlsZVN5c3RlbSwgZW50cnlQb2ludFBhY2thZ2VKc29uLCBlbnRyeVBvaW50UGFja2FnZUpzb25QYXRoLCBwcm9wZXJ0eSk7XG4gICAgICAgIGlmIChwcm9jZXNzRHRzKSB7XG4gICAgICAgICAgbWFya0FzUHJvY2Vzc2VkKGZpbGVTeXN0ZW0sIGVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgZW50cnlQb2ludFBhY2thZ2VKc29uUGF0aCwgJ3R5cGluZ3MnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb21waWxlZEZvcm1hdHMuc2l6ZSA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBGYWlsZWQgdG8gY29tcGlsZSBhbnkgZm9ybWF0cyBmb3IgZW50cnktcG9pbnQgYXQgKCR7ZW50cnlQb2ludC5wYXRofSkuIFRyaWVkICR7cHJvcGVydGllc1RvQ29uc2lkZXJ9LmApO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRGaWxlV3JpdGVyKGZzOiBGaWxlU3lzdGVtLCBjcmVhdGVOZXdFbnRyeVBvaW50Rm9ybWF0czogYm9vbGVhbik6IEZpbGVXcml0ZXIge1xuICByZXR1cm4gY3JlYXRlTmV3RW50cnlQb2ludEZvcm1hdHMgPyBuZXcgTmV3RW50cnlQb2ludEZpbGVXcml0ZXIoZnMpIDogbmV3IEluUGxhY2VGaWxlV3JpdGVyKGZzKTtcbn1cblxuZnVuY3Rpb24gZ2V0RW50cnlQb2ludHMoXG4gICAgZnM6IEZpbGVTeXN0ZW0sIGNvbmZpZzogTmdjY0NvbmZpZ3VyYXRpb24sIGxvZ2dlcjogTG9nZ2VyLCByZXNvbHZlcjogRGVwZW5kZW5jeVJlc29sdmVyLFxuICAgIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBwYXRoTWFwcGluZ3M6IFBhdGhNYXBwaW5ncyB8IHVuZGVmaW5lZCwgcHJvcGVydGllc1RvQ29uc2lkZXI6IHN0cmluZ1tdLFxuICAgIGNvbXBpbGVBbGxGb3JtYXRzOiBib29sZWFuKTogRW50cnlQb2ludFtdIHtcbiAgY29uc3Qge2VudHJ5UG9pbnRzLCBpbnZhbGlkRW50cnlQb2ludHN9ID0gKHRhcmdldEVudHJ5UG9pbnRQYXRoICE9PSB1bmRlZmluZWQpID9cbiAgICAgIGdldFRhcmdldGVkRW50cnlQb2ludHMoXG4gICAgICAgICAgZnMsIGNvbmZpZywgbG9nZ2VyLCByZXNvbHZlciwgYmFzZVBhdGgsIHRhcmdldEVudHJ5UG9pbnRQYXRoLCBwcm9wZXJ0aWVzVG9Db25zaWRlcixcbiAgICAgICAgICBjb21waWxlQWxsRm9ybWF0cywgcGF0aE1hcHBpbmdzKSA6XG4gICAgICBnZXRBbGxFbnRyeVBvaW50cyhmcywgY29uZmlnLCBsb2dnZXIsIHJlc29sdmVyLCBiYXNlUGF0aCwgcGF0aE1hcHBpbmdzKTtcbiAgbG9nSW52YWxpZEVudHJ5UG9pbnRzKGxvZ2dlciwgaW52YWxpZEVudHJ5UG9pbnRzKTtcbiAgcmV0dXJuIGVudHJ5UG9pbnRzO1xufVxuXG5mdW5jdGlvbiBnZXRUYXJnZXRlZEVudHJ5UG9pbnRzKFxuICAgIGZzOiBGaWxlU3lzdGVtLCBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLCBsb2dnZXI6IExvZ2dlciwgcmVzb2x2ZXI6IERlcGVuZGVuY3lSZXNvbHZlcixcbiAgICBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHRhcmdldEVudHJ5UG9pbnRQYXRoOiBzdHJpbmcsIHByb3BlcnRpZXNUb0NvbnNpZGVyOiBzdHJpbmdbXSxcbiAgICBjb21waWxlQWxsRm9ybWF0czogYm9vbGVhbiwgcGF0aE1hcHBpbmdzOiBQYXRoTWFwcGluZ3MgfCB1bmRlZmluZWQpOiBTb3J0ZWRFbnRyeVBvaW50c0luZm8ge1xuICBjb25zdCBhYnNvbHV0ZVRhcmdldEVudHJ5UG9pbnRQYXRoID0gcmVzb2x2ZShiYXNlUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGgpO1xuICBpZiAoaGFzUHJvY2Vzc2VkVGFyZ2V0RW50cnlQb2ludChcbiAgICAgICAgICBmcywgYWJzb2x1dGVUYXJnZXRFbnRyeVBvaW50UGF0aCwgcHJvcGVydGllc1RvQ29uc2lkZXIsIGNvbXBpbGVBbGxGb3JtYXRzKSkge1xuICAgIGxvZ2dlci5kZWJ1ZygnVGhlIHRhcmdldCBlbnRyeS1wb2ludCBoYXMgYWxyZWFkeSBiZWVuIHByb2Nlc3NlZCcpO1xuICAgIHJldHVybiB7ZW50cnlQb2ludHM6IFtdLCBpbnZhbGlkRW50cnlQb2ludHM6IFtdLCBpZ25vcmVkRGVwZW5kZW5jaWVzOiBbXX07XG4gIH1cbiAgY29uc3QgZmluZGVyID0gbmV3IFRhcmdldGVkRW50cnlQb2ludEZpbmRlcihcbiAgICAgIGZzLCBjb25maWcsIGxvZ2dlciwgcmVzb2x2ZXIsIGJhc2VQYXRoLCBhYnNvbHV0ZVRhcmdldEVudHJ5UG9pbnRQYXRoLCBwYXRoTWFwcGluZ3MpO1xuICBjb25zdCBlbnRyeVBvaW50SW5mbyA9IGZpbmRlci5maW5kRW50cnlQb2ludHMoKTtcbiAgaWYgKGVudHJ5UG9pbnRJbmZvLmVudHJ5UG9pbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIG1hcmtOb25Bbmd1bGFyUGFja2FnZUFzUHJvY2Vzc2VkKGZzLCBhYnNvbHV0ZVRhcmdldEVudHJ5UG9pbnRQYXRoLCBwcm9wZXJ0aWVzVG9Db25zaWRlcik7XG4gIH1cbiAgcmV0dXJuIGVudHJ5UG9pbnRJbmZvO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxFbnRyeVBvaW50cyhcbiAgICBmczogRmlsZVN5c3RlbSwgY29uZmlnOiBOZ2NjQ29uZmlndXJhdGlvbiwgbG9nZ2VyOiBMb2dnZXIsIHJlc29sdmVyOiBEZXBlbmRlbmN5UmVzb2x2ZXIsXG4gICAgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRoLCBwYXRoTWFwcGluZ3M6IFBhdGhNYXBwaW5ncyB8IHVuZGVmaW5lZCk6IFNvcnRlZEVudHJ5UG9pbnRzSW5mbyB7XG4gIGNvbnN0IGZpbmRlciA9XG4gICAgICBuZXcgRGlyZWN0b3J5V2Fsa2VyRW50cnlQb2ludEZpbmRlcihmcywgY29uZmlnLCBsb2dnZXIsIHJlc29sdmVyLCBiYXNlUGF0aCwgcGF0aE1hcHBpbmdzKTtcbiAgcmV0dXJuIGZpbmRlci5maW5kRW50cnlQb2ludHMoKTtcbn1cblxuZnVuY3Rpb24gaGFzUHJvY2Vzc2VkVGFyZ2V0RW50cnlQb2ludChcbiAgICBmczogRmlsZVN5c3RlbSwgdGFyZ2V0UGF0aDogQWJzb2x1dGVGc1BhdGgsIHByb3BlcnRpZXNUb0NvbnNpZGVyOiBzdHJpbmdbXSxcbiAgICBjb21waWxlQWxsRm9ybWF0czogYm9vbGVhbikge1xuICBjb25zdCBwYWNrYWdlSnNvblBhdGggPSByZXNvbHZlKHRhcmdldFBhdGgsICdwYWNrYWdlLmpzb24nKTtcbiAgLy8gSXQgbWlnaHQgYmUgdGhhdCB0aGlzIHRhcmdldCBpcyBjb25maWd1cmVkIGluIHdoaWNoIGNhc2UgaXRzIHBhY2thZ2UuanNvbiBtaWdodCBub3QgZXhpc3QuXG4gIGlmICghZnMuZXhpc3RzKHBhY2thZ2VKc29uUGF0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlKHBhY2thZ2VKc29uUGF0aCkpO1xuXG4gIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcGVydGllc1RvQ29uc2lkZXIpIHtcbiAgICBpZiAocGFja2FnZUpzb25bcHJvcGVydHldKSB7XG4gICAgICAvLyBIZXJlIGlzIGEgcHJvcGVydHkgdGhhdCBzaG91bGQgYmUgcHJvY2Vzc2VkXG4gICAgICBpZiAoaGFzQmVlblByb2Nlc3NlZChwYWNrYWdlSnNvbiwgcHJvcGVydHkgYXMgRW50cnlQb2ludEpzb25Qcm9wZXJ0eSkpIHtcbiAgICAgICAgaWYgKCFjb21waWxlQWxsRm9ybWF0cykge1xuICAgICAgICAgIC8vIEl0IGhhcyBiZWVuIHByb2Nlc3NlZCBhbmQgd2Ugb25seSBuZWVkIG9uZSwgc28gd2UgYXJlIGRvbmUuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEl0IGhhcyBub3QgYmVlbiBwcm9jZXNzZWQgYnV0IHdlIG5lZWQgYWxsIG9mIHRoZW0sIHNvIHdlIGFyZSBkb25lLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIEVpdGhlciBhbGwgZm9ybWF0cyBuZWVkIHRvIGJlIGNvbXBpbGVkIGFuZCB0aGVyZSB3ZXJlIG5vbmUgdGhhdCB3ZXJlIHVucHJvY2Vzc2VkLFxuICAvLyBPciBvbmx5IHRoZSBvbmUgbWF0Y2hpbmcgZm9ybWF0IG5lZWRzIHRvIGJlIGNvbXBpbGVkIGJ1dCB0aGVyZSB3YXMgYXQgbGVhc3Qgb25lIG1hdGNoaW5nXG4gIC8vIHByb3BlcnR5IGJlZm9yZSB0aGUgZmlyc3QgcHJvY2Vzc2VkIGZvcm1hdCB0aGF0IHdhcyB1bnByb2Nlc3NlZC5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogSWYgd2UgZ2V0IGhlcmUsIHRoZW4gdGhlIHJlcXVlc3RlZCBlbnRyeS1wb2ludCBkaWQgbm90IGNvbnRhaW4gYW55dGhpbmcgY29tcGlsZWQgYnlcbiAqIHRoZSBvbGQgQW5ndWxhciBjb21waWxlci4gVGhlcmVmb3JlIHRoZXJlIGlzIG5vdGhpbmcgZm9yIG5nY2MgdG8gZG8uXG4gKiBTbyBtYXJrIGFsbCBmb3JtYXRzIGluIHRoaXMgZW50cnktcG9pbnQgYXMgcHJvY2Vzc2VkIHNvIHRoYXQgY2xpZW50cyBvZiBuZ2NjIGNhbiBhdm9pZFxuICogdHJpZ2dlcmluZyBuZ2NjIGZvciB0aGlzIGVudHJ5LXBvaW50IGluIHRoZSBmdXR1cmUuXG4gKi9cbmZ1bmN0aW9uIG1hcmtOb25Bbmd1bGFyUGFja2FnZUFzUHJvY2Vzc2VkKFxuICAgIGZzOiBGaWxlU3lzdGVtLCBwYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcHJvcGVydGllc1RvQ29uc2lkZXI6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IHBhY2thZ2VKc29uUGF0aCA9IHJlc29sdmUocGF0aCwgJ3BhY2thZ2UuanNvbicpO1xuICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGUocGFja2FnZUpzb25QYXRoKSk7XG4gIHByb3BlcnRpZXNUb0NvbnNpZGVyLmZvckVhY2goZm9ybWF0UHJvcGVydHkgPT4ge1xuICAgIGlmIChwYWNrYWdlSnNvbltmb3JtYXRQcm9wZXJ0eV0pXG4gICAgICBtYXJrQXNQcm9jZXNzZWQoZnMsIHBhY2thZ2VKc29uLCBwYWNrYWdlSnNvblBhdGgsIGZvcm1hdFByb3BlcnR5IGFzIEVudHJ5UG9pbnRKc29uUHJvcGVydHkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9nSW52YWxpZEVudHJ5UG9pbnRzKGxvZ2dlcjogTG9nZ2VyLCBpbnZhbGlkRW50cnlQb2ludHM6IEludmFsaWRFbnRyeVBvaW50W10pOiB2b2lkIHtcbiAgaW52YWxpZEVudHJ5UG9pbnRzLmZvckVhY2goaW52YWxpZEVudHJ5UG9pbnQgPT4ge1xuICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgYEludmFsaWQgZW50cnktcG9pbnQgJHtpbnZhbGlkRW50cnlQb2ludC5lbnRyeVBvaW50LnBhdGh9LmAsXG4gICAgICAgIGBJdCBpcyBtaXNzaW5nIHJlcXVpcmVkIGRlcGVuZGVuY2llczpcXG5gICtcbiAgICAgICAgICAgIGludmFsaWRFbnRyeVBvaW50Lm1pc3NpbmdEZXBlbmRlbmNpZXMubWFwKGRlcCA9PiBgIC0gJHtkZXB9YCkuam9pbignXFxuJykpO1xuICB9KTtcbn1cbiJdfQ==
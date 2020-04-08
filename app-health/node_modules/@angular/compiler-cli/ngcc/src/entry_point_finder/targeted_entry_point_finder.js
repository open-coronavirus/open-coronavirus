(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/entry_point_finder/utils"], factory);
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
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/utils");
    /**
     * An EntryPointFinder that starts from a target entry-point and only finds
     * entry-points that are dependencies of the target.
     *
     * This is faster than searching the entire file-system for all the entry-points,
     * and is used primarily by the CLI integration.
     */
    var TargetedEntryPointFinder = /** @class */ (function () {
        function TargetedEntryPointFinder(fs, config, logger, resolver, basePath, targetPath, pathMappings) {
            this.fs = fs;
            this.config = config;
            this.logger = logger;
            this.resolver = resolver;
            this.basePath = basePath;
            this.targetPath = targetPath;
            this.pathMappings = pathMappings;
            this.unprocessedPaths = [];
            this.unsortedEntryPoints = new Map();
            this.basePaths = utils_1.getBasePaths(this.basePath, this.pathMappings);
        }
        TargetedEntryPointFinder.prototype.findEntryPoints = function () {
            this.unprocessedPaths = [this.targetPath];
            while (this.unprocessedPaths.length > 0) {
                this.processNextPath();
            }
            var targetEntryPoint = this.unsortedEntryPoints.get(this.targetPath);
            return this.resolver.sortEntryPointsByDependency(Array.from(this.unsortedEntryPoints.values()), targetEntryPoint);
        };
        TargetedEntryPointFinder.prototype.processNextPath = function () {
            var _this = this;
            var path = this.unprocessedPaths.shift();
            var entryPoint = this.getEntryPoint(path);
            if (entryPoint !== null) {
                this.unsortedEntryPoints.set(entryPoint.path, entryPoint);
                var deps = this.resolver.getEntryPointDependencies(entryPoint);
                deps.dependencies.forEach(function (dep) {
                    if (!_this.unsortedEntryPoints.has(dep)) {
                        _this.unprocessedPaths.push(dep);
                    }
                });
            }
        };
        TargetedEntryPointFinder.prototype.getEntryPoint = function (entryPointPath) {
            var packagePath = this.computePackagePath(entryPointPath);
            return entry_point_1.getEntryPointInfo(this.fs, this.config, this.logger, packagePath, entryPointPath);
        };
        /**
         * Search down to the `entryPointPath` from each `basePath` for the first `package.json` that we
         * come to. This is the path to the entry-point's containing package. For example if `basePath` is
         * `/a/b/c` and `entryPointPath` is `/a/b/c/d/e` and there exists `/a/b/c/d/package.json` and
         * `/a/b/c/d/e/package.json`, then we will return `/a/b/c/d`.
         *
         * To account for nested `node_modules` we actually start the search at the last `node_modules` in
         * the `entryPointPath` that is below the `basePath`. E.g. if `basePath` is `/a/b/c` and
         * `entryPointPath` is `/a/b/c/d/node_modules/x/y/z`, we start the search at
         * `/a/b/c/d/node_modules`.
         */
        TargetedEntryPointFinder.prototype.computePackagePath = function (entryPointPath) {
            var e_1, _a, e_2, _b;
            try {
                for (var _c = tslib_1.__values(this.basePaths), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var basePath = _d.value;
                    if (entryPointPath.startsWith(basePath)) {
                        var packagePath = basePath;
                        var segments = this.splitPath(file_system_1.relative(basePath, entryPointPath));
                        // Start the search at the last nested `node_modules` folder if the relative
                        // `entryPointPath` contains one or more.
                        var nodeModulesIndex = segments.lastIndexOf(file_system_1.relativeFrom('node_modules'));
                        while (nodeModulesIndex >= 0) {
                            packagePath = file_system_1.join(packagePath, segments.shift());
                            nodeModulesIndex--;
                        }
                        try {
                            // Note that we skip the first `packagePath` and start looking from the first folder below
                            // it because that will be the `node_modules` folder.
                            for (var segments_1 = (e_2 = void 0, tslib_1.__values(segments)), segments_1_1 = segments_1.next(); !segments_1_1.done; segments_1_1 = segments_1.next()) {
                                var segment = segments_1_1.value;
                                packagePath = file_system_1.join(packagePath, segment);
                                if (this.fs.exists(file_system_1.join(packagePath, 'package.json'))) {
                                    return packagePath;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (segments_1_1 && !segments_1_1.done && (_b = segments_1.return)) _b.call(segments_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        // If we got here then we couldn't find a `packagePath` for the current `basePath` but since
                        // `basePath`s are guaranteed not to be a sub-directory each other then no other `basePath`
                        // will match either.
                        break;
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
            // If we get here then none of the `basePaths` matched the `entryPointPath`, which
            // is somewhat unexpected and means that this entry-point lives completely outside
            // any of the `basePaths`.
            // All we can do is assume that his entry-point is a primary entry-point to a package.
            return entryPointPath;
        };
        /**
         * Split the given `path` into path segments using an FS independent algorithm.
         * @param path The path to split.
         */
        TargetedEntryPointFinder.prototype.splitPath = function (path) {
            var segments = [];
            while (path !== '.') {
                segments.unshift(this.fs.basename(path));
                path = this.fs.dirname(path);
            }
            return segments;
        };
        return TargetedEntryPointFinder;
    }());
    exports.TargetedEntryPointFinder = TargetedEntryPointFinder;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0ZWRfZW50cnlfcG9pbnRfZmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2VudHJ5X3BvaW50X2ZpbmRlci90YXJnZXRlZF9lbnRyeV9wb2ludF9maW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsMkVBQXFIO0lBSXJILG1GQUFzRTtJQUd0RSxpRkFBcUM7SUFFckM7Ozs7OztPQU1HO0lBQ0g7UUFLRSxrQ0FDWSxFQUFjLEVBQVUsTUFBeUIsRUFBVSxNQUFjLEVBQ3pFLFFBQTRCLEVBQVUsUUFBd0IsRUFDOUQsVUFBMEIsRUFBVSxZQUFvQztZQUZ4RSxPQUFFLEdBQUYsRUFBRSxDQUFZO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBQ3pFLGFBQVEsR0FBUixRQUFRLENBQW9CO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFDOUQsZUFBVSxHQUFWLFVBQVUsQ0FBZ0I7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBd0I7WUFQNUUscUJBQWdCLEdBQXFCLEVBQUUsQ0FBQztZQUN4Qyx3QkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztZQUM1RCxjQUFTLEdBQUcsb0JBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUtvQixDQUFDO1FBRXhGLGtEQUFlLEdBQWY7WUFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3hCO1lBQ0QsSUFBTSxnQkFBZ0IsR0FB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aUJBQ0Y7Ozs7Ozs7OztZQUNELGtGQUFrRjtZQUNsRixrRkFBa0Y7WUFDbEYsMEJBQTBCO1lBQzFCLHNGQUFzRjtZQUN0RixPQUFPLGNBQWMsQ0FBQztRQUN4QixDQUFDO1FBR0Q7OztXQUdHO1FBQ0ssNENBQVMsR0FBakIsVUFBa0IsSUFBaUI7WUFDakMsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sSUFBSSxLQUFLLEdBQUcsRUFBRTtnQkFDbkIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUI7WUFDRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO1FBQ0gsK0JBQUM7SUFBRCxDQUFDLEFBbkdELElBbUdDO0lBbkdZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCBqb2luLCByZWxhdGl2ZSwgcmVsYXRpdmVGcm9tfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtEZXBlbmRlbmN5UmVzb2x2ZXIsIFNvcnRlZEVudHJ5UG9pbnRzSW5mb30gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2RlcGVuZGVuY3lfcmVzb2x2ZXInO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyJztcbmltcG9ydCB7TmdjY0NvbmZpZ3VyYXRpb259IGZyb20gJy4uL3BhY2thZ2VzL2NvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtFbnRyeVBvaW50LCBnZXRFbnRyeVBvaW50SW5mb30gZnJvbSAnLi4vcGFja2FnZXMvZW50cnlfcG9pbnQnO1xuaW1wb3J0IHtQYXRoTWFwcGluZ3N9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7RW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuaW1wb3J0IHtnZXRCYXNlUGF0aHN9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEFuIEVudHJ5UG9pbnRGaW5kZXIgdGhhdCBzdGFydHMgZnJvbSBhIHRhcmdldCBlbnRyeS1wb2ludCBhbmQgb25seSBmaW5kc1xuICogZW50cnktcG9pbnRzIHRoYXQgYXJlIGRlcGVuZGVuY2llcyBvZiB0aGUgdGFyZ2V0LlxuICpcbiAqIFRoaXMgaXMgZmFzdGVyIHRoYW4gc2VhcmNoaW5nIHRoZSBlbnRpcmUgZmlsZS1zeXN0ZW0gZm9yIGFsbCB0aGUgZW50cnktcG9pbnRzLFxuICogYW5kIGlzIHVzZWQgcHJpbWFyaWx5IGJ5IHRoZSBDTEkgaW50ZWdyYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXJnZXRlZEVudHJ5UG9pbnRGaW5kZXIgaW1wbGVtZW50cyBFbnRyeVBvaW50RmluZGVyIHtcbiAgcHJpdmF0ZSB1bnByb2Nlc3NlZFBhdGhzOiBBYnNvbHV0ZUZzUGF0aFtdID0gW107XG4gIHByaXZhdGUgdW5zb3J0ZWRFbnRyeVBvaW50cyA9IG5ldyBNYXA8QWJzb2x1dGVGc1BhdGgsIEVudHJ5UG9pbnQ+KCk7XG4gIHByaXZhdGUgYmFzZVBhdGhzID0gZ2V0QmFzZVBhdGhzKHRoaXMuYmFzZVBhdGgsIHRoaXMucGF0aE1hcHBpbmdzKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0sIHByaXZhdGUgY29uZmlnOiBOZ2NjQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICAgIHByaXZhdGUgcmVzb2x2ZXI6IERlcGVuZGVuY3lSZXNvbHZlciwgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIHRhcmdldFBhdGg6IEFic29sdXRlRnNQYXRoLCBwcml2YXRlIHBhdGhNYXBwaW5nczogUGF0aE1hcHBpbmdzfHVuZGVmaW5lZCkge31cblxuICBmaW5kRW50cnlQb2ludHMoKTogU29ydGVkRW50cnlQb2ludHNJbmZvIHtcbiAgICB0aGlzLnVucHJvY2Vzc2VkUGF0aHMgPSBbdGhpcy50YXJnZXRQYXRoXTtcbiAgICB3aGlsZSAodGhpcy51bnByb2Nlc3NlZFBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucHJvY2Vzc05leHRQYXRoKCk7XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldEVudHJ5UG9pbnQgPSB0aGlzLnVuc29ydGVkRW50cnlQb2ludHMuZ2V0KHRoaXMudGFyZ2V0UGF0aCk7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZXIuc29ydEVudHJ5UG9pbnRzQnlEZXBlbmRlbmN5KFxuICAgICAgICBBcnJheS5mcm9tKHRoaXMudW5zb3J0ZWRFbnRyeVBvaW50cy52YWx1ZXMoKSksIHRhcmdldEVudHJ5UG9pbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzTmV4dFBhdGgoKTogdm9pZCB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMudW5wcm9jZXNzZWRQYXRocy5zaGlmdCgpICE7XG4gICAgY29uc3QgZW50cnlQb2ludCA9IHRoaXMuZ2V0RW50cnlQb2ludChwYXRoKTtcbiAgICBpZiAoZW50cnlQb2ludCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy51bnNvcnRlZEVudHJ5UG9pbnRzLnNldChlbnRyeVBvaW50LnBhdGgsIGVudHJ5UG9pbnQpO1xuICAgICAgY29uc3QgZGVwcyA9IHRoaXMucmVzb2x2ZXIuZ2V0RW50cnlQb2ludERlcGVuZGVuY2llcyhlbnRyeVBvaW50KTtcbiAgICAgIGRlcHMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnVuc29ydGVkRW50cnlQb2ludHMuaGFzKGRlcCkpIHtcbiAgICAgICAgICB0aGlzLnVucHJvY2Vzc2VkUGF0aHMucHVzaChkZXApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEVudHJ5UG9pbnQoZW50cnlQb2ludFBhdGg6IEFic29sdXRlRnNQYXRoKTogRW50cnlQb2ludHxudWxsIHtcbiAgICBjb25zdCBwYWNrYWdlUGF0aCA9IHRoaXMuY29tcHV0ZVBhY2thZ2VQYXRoKGVudHJ5UG9pbnRQYXRoKTtcbiAgICByZXR1cm4gZ2V0RW50cnlQb2ludEluZm8odGhpcy5mcywgdGhpcy5jb25maWcsIHRoaXMubG9nZ2VyLCBwYWNrYWdlUGF0aCwgZW50cnlQb2ludFBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBkb3duIHRvIHRoZSBgZW50cnlQb2ludFBhdGhgIGZyb20gZWFjaCBgYmFzZVBhdGhgIGZvciB0aGUgZmlyc3QgYHBhY2thZ2UuanNvbmAgdGhhdCB3ZVxuICAgKiBjb21lIHRvLiBUaGlzIGlzIHRoZSBwYXRoIHRvIHRoZSBlbnRyeS1wb2ludCdzIGNvbnRhaW5pbmcgcGFja2FnZS4gRm9yIGV4YW1wbGUgaWYgYGJhc2VQYXRoYCBpc1xuICAgKiBgL2EvYi9jYCBhbmQgYGVudHJ5UG9pbnRQYXRoYCBpcyBgL2EvYi9jL2QvZWAgYW5kIHRoZXJlIGV4aXN0cyBgL2EvYi9jL2QvcGFja2FnZS5qc29uYCBhbmRcbiAgICogYC9hL2IvYy9kL2UvcGFja2FnZS5qc29uYCwgdGhlbiB3ZSB3aWxsIHJldHVybiBgL2EvYi9jL2RgLlxuICAgKlxuICAgKiBUbyBhY2NvdW50IGZvciBuZXN0ZWQgYG5vZGVfbW9kdWxlc2Agd2UgYWN0dWFsbHkgc3RhcnQgdGhlIHNlYXJjaCBhdCB0aGUgbGFzdCBgbm9kZV9tb2R1bGVzYCBpblxuICAgKiB0aGUgYGVudHJ5UG9pbnRQYXRoYCB0aGF0IGlzIGJlbG93IHRoZSBgYmFzZVBhdGhgLiBFLmcuIGlmIGBiYXNlUGF0aGAgaXMgYC9hL2IvY2AgYW5kXG4gICAqIGBlbnRyeVBvaW50UGF0aGAgaXMgYC9hL2IvYy9kL25vZGVfbW9kdWxlcy94L3kvemAsIHdlIHN0YXJ0IHRoZSBzZWFyY2ggYXRcbiAgICogYC9hL2IvYy9kL25vZGVfbW9kdWxlc2AuXG4gICAqL1xuICBwcml2YXRlIGNvbXB1dGVQYWNrYWdlUGF0aChlbnRyeVBvaW50UGF0aDogQWJzb2x1dGVGc1BhdGgpOiBBYnNvbHV0ZUZzUGF0aCB7XG4gICAgZm9yIChjb25zdCBiYXNlUGF0aCBvZiB0aGlzLmJhc2VQYXRocykge1xuICAgICAgaWYgKGVudHJ5UG9pbnRQYXRoLnN0YXJ0c1dpdGgoYmFzZVBhdGgpKSB7XG4gICAgICAgIGxldCBwYWNrYWdlUGF0aCA9IGJhc2VQYXRoO1xuICAgICAgICBjb25zdCBzZWdtZW50cyA9IHRoaXMuc3BsaXRQYXRoKHJlbGF0aXZlKGJhc2VQYXRoLCBlbnRyeVBvaW50UGF0aCkpO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSBzZWFyY2ggYXQgdGhlIGxhc3QgbmVzdGVkIGBub2RlX21vZHVsZXNgIGZvbGRlciBpZiB0aGUgcmVsYXRpdmVcbiAgICAgICAgLy8gYGVudHJ5UG9pbnRQYXRoYCBjb250YWlucyBvbmUgb3IgbW9yZS5cbiAgICAgICAgbGV0IG5vZGVNb2R1bGVzSW5kZXggPSBzZWdtZW50cy5sYXN0SW5kZXhPZihyZWxhdGl2ZUZyb20oJ25vZGVfbW9kdWxlcycpKTtcbiAgICAgICAgd2hpbGUgKG5vZGVNb2R1bGVzSW5kZXggPj0gMCkge1xuICAgICAgICAgIHBhY2thZ2VQYXRoID0gam9pbihwYWNrYWdlUGF0aCwgc2VnbWVudHMuc2hpZnQoKSAhKTtcbiAgICAgICAgICBub2RlTW9kdWxlc0luZGV4LS07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RlIHRoYXQgd2Ugc2tpcCB0aGUgZmlyc3QgYHBhY2thZ2VQYXRoYCBhbmQgc3RhcnQgbG9va2luZyBmcm9tIHRoZSBmaXJzdCBmb2xkZXIgYmVsb3dcbiAgICAgICAgLy8gaXQgYmVjYXVzZSB0aGF0IHdpbGwgYmUgdGhlIGBub2RlX21vZHVsZXNgIGZvbGRlci5cbiAgICAgICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHNlZ21lbnRzKSB7XG4gICAgICAgICAgcGFja2FnZVBhdGggPSBqb2luKHBhY2thZ2VQYXRoLCBzZWdtZW50KTtcbiAgICAgICAgICBpZiAodGhpcy5mcy5leGlzdHMoam9pbihwYWNrYWdlUGF0aCwgJ3BhY2thZ2UuanNvbicpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhY2thZ2VQYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCBoZXJlIHRoZW4gd2UgY291bGRuJ3QgZmluZCBhIGBwYWNrYWdlUGF0aGAgZm9yIHRoZSBjdXJyZW50IGBiYXNlUGF0aGAgYnV0IHNpbmNlXG4gICAgICAgIC8vIGBiYXNlUGF0aGBzIGFyZSBndWFyYW50ZWVkIG5vdCB0byBiZSBhIHN1Yi1kaXJlY3RvcnkgZWFjaCBvdGhlciB0aGVuIG5vIG90aGVyIGBiYXNlUGF0aGBcbiAgICAgICAgLy8gd2lsbCBtYXRjaCBlaXRoZXIuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJZiB3ZSBnZXQgaGVyZSB0aGVuIG5vbmUgb2YgdGhlIGBiYXNlUGF0aHNgIG1hdGNoZWQgdGhlIGBlbnRyeVBvaW50UGF0aGAsIHdoaWNoXG4gICAgLy8gaXMgc29tZXdoYXQgdW5leHBlY3RlZCBhbmQgbWVhbnMgdGhhdCB0aGlzIGVudHJ5LXBvaW50IGxpdmVzIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgIC8vIGFueSBvZiB0aGUgYGJhc2VQYXRoc2AuXG4gICAgLy8gQWxsIHdlIGNhbiBkbyBpcyBhc3N1bWUgdGhhdCBoaXMgZW50cnktcG9pbnQgaXMgYSBwcmltYXJ5IGVudHJ5LXBvaW50IHRvIGEgcGFja2FnZS5cbiAgICByZXR1cm4gZW50cnlQb2ludFBhdGg7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTcGxpdCB0aGUgZ2l2ZW4gYHBhdGhgIGludG8gcGF0aCBzZWdtZW50cyB1c2luZyBhbiBGUyBpbmRlcGVuZGVudCBhbGdvcml0aG0uXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIHNwbGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBzcGxpdFBhdGgocGF0aDogUGF0aFNlZ21lbnQpIHtcbiAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAgIHdoaWxlIChwYXRoICE9PSAnLicpIHtcbiAgICAgIHNlZ21lbnRzLnVuc2hpZnQodGhpcy5mcy5iYXNlbmFtZShwYXRoKSk7XG4gICAgICBwYXRoID0gdGhpcy5mcy5kaXJuYW1lKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gc2VnbWVudHM7XG4gIH1cbn1cbiJdfQ==
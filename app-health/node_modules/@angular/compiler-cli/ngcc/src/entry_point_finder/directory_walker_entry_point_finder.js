(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/entry_point_finder/utils"], factory);
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
     * An EntryPointFinder that searches for all entry-points that can be found given a `basePath` and
     * `pathMappings`.
     */
    var DirectoryWalkerEntryPointFinder = /** @class */ (function () {
        function DirectoryWalkerEntryPointFinder(fs, config, logger, resolver, sourceDirectory, pathMappings) {
            this.fs = fs;
            this.config = config;
            this.logger = logger;
            this.resolver = resolver;
            this.sourceDirectory = sourceDirectory;
            this.pathMappings = pathMappings;
            this.basePaths = utils_1.getBasePaths(this.sourceDirectory, this.pathMappings);
        }
        /**
         * Search the `sourceDirectory`, and sub-directories, using `pathMappings` as necessary, to find
         * all package entry-points.
         */
        DirectoryWalkerEntryPointFinder.prototype.findEntryPoints = function () {
            var _this = this;
            var unsortedEntryPoints = this.basePaths.reduce(function (entryPoints, basePath) { return entryPoints.concat(_this.walkDirectoryForEntryPoints(basePath)); }, []);
            return this.resolver.sortEntryPointsByDependency(unsortedEntryPoints);
        };
        /**
         * Look for entry points that need to be compiled, starting at the source directory.
         * The function will recurse into directories that start with `@...`, e.g. `@angular/...`.
         * @param sourceDirectory An absolute path to the root directory where searching begins.
         */
        DirectoryWalkerEntryPointFinder.prototype.walkDirectoryForEntryPoints = function (sourceDirectory) {
            var _this = this;
            var entryPoints = this.getEntryPointsForPackage(sourceDirectory);
            if (entryPoints.length > 0) {
                // The `sourceDirectory` is an entry-point itself so no need to search its sub-directories.
                return entryPoints;
            }
            this.fs
                .readdir(sourceDirectory)
                // Not interested in hidden files
                .filter(function (p) { return !p.startsWith('.'); })
                // Ignore node_modules
                .filter(function (p) { return p !== 'node_modules'; })
                // Only interested in directories (and only those that are not symlinks)
                .filter(function (p) {
                var stat = _this.fs.lstat(file_system_1.resolve(sourceDirectory, p));
                return stat.isDirectory() && !stat.isSymbolicLink();
            })
                .forEach(function (p) {
                // Either the directory is a potential package or a namespace containing packages (e.g
                // `@angular`).
                var packagePath = file_system_1.join(sourceDirectory, p);
                entryPoints.push.apply(entryPoints, tslib_1.__spread(_this.walkDirectoryForEntryPoints(packagePath)));
                // Also check for any nested node_modules in this package
                var nestedNodeModulesPath = file_system_1.join(packagePath, 'node_modules');
                if (_this.fs.exists(nestedNodeModulesPath)) {
                    entryPoints.push.apply(entryPoints, tslib_1.__spread(_this.walkDirectoryForEntryPoints(nestedNodeModulesPath)));
                }
            });
            return entryPoints;
        };
        /**
         * Recurse the folder structure looking for all the entry points
         * @param packagePath The absolute path to an npm package that may contain entry points
         * @returns An array of entry points that were discovered.
         */
        DirectoryWalkerEntryPointFinder.prototype.getEntryPointsForPackage = function (packagePath) {
            var _this = this;
            var entryPoints = [];
            // Try to get an entry point from the top level package directory
            var topLevelEntryPoint = entry_point_1.getEntryPointInfo(this.fs, this.config, this.logger, packagePath, packagePath);
            // If there is no primary entry-point then exit
            if (topLevelEntryPoint === null) {
                return [];
            }
            // Otherwise store it and search for secondary entry-points
            entryPoints.push(topLevelEntryPoint);
            this.walkDirectory(packagePath, packagePath, function (path, isDirectory) {
                // If the path is a JS file then strip its extension and see if we can match an entry-point.
                var possibleEntryPointPath = isDirectory ? path : stripJsExtension(path);
                var subEntryPoint = entry_point_1.getEntryPointInfo(_this.fs, _this.config, _this.logger, packagePath, possibleEntryPointPath);
                if (subEntryPoint !== null) {
                    entryPoints.push(subEntryPoint);
                }
            });
            return entryPoints;
        };
        /**
         * Recursively walk a directory and its sub-directories, applying a given
         * function to each directory.
         * @param dir the directory to recursively walk.
         * @param fn the function to apply to each directory.
         */
        DirectoryWalkerEntryPointFinder.prototype.walkDirectory = function (packagePath, dir, fn) {
            var _this = this;
            return this.fs
                .readdir(dir)
                // Not interested in hidden files
                .filter(function (path) { return !path.startsWith('.'); })
                // Ignore node_modules
                .filter(function (path) { return path !== 'node_modules'; })
                .map(function (path) { return file_system_1.resolve(dir, path); })
                .forEach(function (path) {
                var stat = _this.fs.lstat(path);
                if (stat.isSymbolicLink()) {
                    // We are not interested in symbolic links
                    return;
                }
                fn(path, stat.isDirectory());
                if (stat.isDirectory()) {
                    _this.walkDirectory(packagePath, path, fn);
                }
            });
        };
        return DirectoryWalkerEntryPointFinder;
    }());
    exports.DirectoryWalkerEntryPointFinder = DirectoryWalkerEntryPointFinder;
    function stripJsExtension(filePath) {
        return filePath.replace(/\.js$/, '');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0b3J5X3dhbGtlcl9lbnRyeV9wb2ludF9maW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvZW50cnlfcG9pbnRfZmluZGVyL2RpcmVjdG9yeV93YWxrZXJfZW50cnlfcG9pbnRfZmluZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUF5RjtJQUl6RixtRkFBc0U7SUFHdEUsaUZBQXFDO0lBRXJDOzs7T0FHRztJQUNIO1FBRUUseUNBQ1ksRUFBYyxFQUFVLE1BQXlCLEVBQVUsTUFBYyxFQUN6RSxRQUE0QixFQUFVLGVBQStCLEVBQ3JFLFlBQW9DO1lBRnBDLE9BQUUsR0FBRixFQUFFLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFtQjtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7WUFDekUsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7WUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7WUFDckUsaUJBQVksR0FBWixZQUFZLENBQXdCO1lBSnhDLGNBQVMsR0FBRyxvQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBSXZCLENBQUM7UUFDcEQ7OztXQUdHO1FBQ0gseURBQWUsR0FBZjtZQUFBLGlCQUtDO1lBSkMsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDN0MsVUFBQyxXQUFXLEVBQUUsUUFBUSxJQUFLLE9BQUEsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBOUQsQ0FBOEQsRUFDekYsRUFBRSxDQUFDLENBQUM7WUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN4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QW1CLFFBQVc7UUFDckQsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQU0sQ0FBQztJQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgam9pbiwgcmVzb2x2ZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7RGVwZW5kZW5jeVJlc29sdmVyLCBTb3J0ZWRFbnRyeVBvaW50c0luZm99IGZyb20gJy4uL2RlcGVuZGVuY2llcy9kZXBlbmRlbmN5X3Jlc29sdmVyJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlcic7XG5pbXBvcnQge05nY2NDb25maWd1cmF0aW9ufSBmcm9tICcuLi9wYWNrYWdlcy9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7RW50cnlQb2ludCwgZ2V0RW50cnlQb2ludEluZm99IGZyb20gJy4uL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7UGF0aE1hcHBpbmdzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0VudHJ5UG9pbnRGaW5kZXJ9IGZyb20gJy4vaW50ZXJmYWNlJztcbmltcG9ydCB7Z2V0QmFzZVBhdGhzfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBBbiBFbnRyeVBvaW50RmluZGVyIHRoYXQgc2VhcmNoZXMgZm9yIGFsbCBlbnRyeS1wb2ludHMgdGhhdCBjYW4gYmUgZm91bmQgZ2l2ZW4gYSBgYmFzZVBhdGhgIGFuZFxuICogYHBhdGhNYXBwaW5nc2AuXG4gKi9cbmV4cG9ydCBjbGFzcyBEaXJlY3RvcnlXYWxrZXJFbnRyeVBvaW50RmluZGVyIGltcGxlbWVudHMgRW50cnlQb2ludEZpbmRlciB7XG4gIHByaXZhdGUgYmFzZVBhdGhzID0gZ2V0QmFzZVBhdGhzKHRoaXMuc291cmNlRGlyZWN0b3J5LCB0aGlzLnBhdGhNYXBwaW5ncyk7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBmczogRmlsZVN5c3RlbSwgcHJpdmF0ZSBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLCBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgICAgcHJpdmF0ZSByZXNvbHZlcjogRGVwZW5kZW5jeVJlc29sdmVyLCBwcml2YXRlIHNvdXJjZURpcmVjdG9yeTogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIHBhdGhNYXBwaW5nczogUGF0aE1hcHBpbmdzfHVuZGVmaW5lZCkge31cbiAgLyoqXG4gICAqIFNlYXJjaCB0aGUgYHNvdXJjZURpcmVjdG9yeWAsIGFuZCBzdWItZGlyZWN0b3JpZXMsIHVzaW5nIGBwYXRoTWFwcGluZ3NgIGFzIG5lY2Vzc2FyeSwgdG8gZmluZFxuICAgKiBhbGwgcGFja2FnZSBlbnRyeS1wb2ludHMuXG4gICAqL1xuICBmaW5kRW50cnlQb2ludHMoKTogU29ydGVkRW50cnlQb2ludHNJbmZvIHtcbiAgICBjb25zdCB1bnNvcnRlZEVudHJ5UG9pbnRzID0gdGhpcy5iYXNlUGF0aHMucmVkdWNlPEVudHJ5UG9pbnRbXT4oXG4gICAgICAgIChlbnRyeVBvaW50cywgYmFzZVBhdGgpID0+IGVudHJ5UG9pbnRzLmNvbmNhdCh0aGlzLndhbGtEaXJlY3RvcnlGb3JFbnRyeVBvaW50cyhiYXNlUGF0aCkpLFxuICAgICAgICBbXSk7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZXIuc29ydEVudHJ5UG9pbnRzQnlEZXBlbmRlbmN5KHVuc29ydGVkRW50cnlQb2ludHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvb2sgZm9yIGVudHJ5IHBvaW50cyB0aGF0IG5lZWQgdG8gYmUgY29tcGlsZWQsIHN0YXJ0aW5nIGF0IHRoZSBzb3VyY2UgZGlyZWN0b3J5LlxuICAgKiBUaGUgZnVuY3Rpb24gd2lsbCByZWN1cnNlIGludG8gZGlyZWN0b3JpZXMgdGhhdCBzdGFydCB3aXRoIGBALi4uYCwgZS5nLiBgQGFuZ3VsYXIvLi4uYC5cbiAgICogQHBhcmFtIHNvdXJjZURpcmVjdG9yeSBBbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSByb290IGRpcmVjdG9yeSB3aGVyZSBzZWFyY2hpbmcgYmVnaW5zLlxuICAgKi9cbiAgcHJpdmF0ZSB3YWxrRGlyZWN0b3J5Rm9yRW50cnlQb2ludHMoc291cmNlRGlyZWN0b3J5OiBBYnNvbHV0ZUZzUGF0aCk6IEVudHJ5UG9pbnRbXSB7XG4gICAgY29uc3QgZW50cnlQb2ludHMgPSB0aGlzLmdldEVudHJ5UG9pbnRzRm9yUGFja2FnZShzb3VyY2VEaXJlY3RvcnkpO1xuICAgIGlmIChlbnRyeVBvaW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBUaGUgYHNvdXJjZURpcmVjdG9yeWAgaXMgYW4gZW50cnktcG9pbnQgaXRzZWxmIHNvIG5vIG5lZWQgdG8gc2VhcmNoIGl0cyBzdWItZGlyZWN0b3JpZXMuXG4gICAgICByZXR1cm4gZW50cnlQb2ludHM7XG4gICAgfVxuXG4gICAgdGhpcy5mc1xuICAgICAgICAucmVhZGRpcihzb3VyY2VEaXJlY3RvcnkpXG4gICAgICAgIC8vIE5vdCBpbnRlcmVzdGVkIGluIGhpZGRlbiBmaWxlc1xuICAgICAgICAuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aCgnLicpKVxuICAgICAgICAvLyBJZ25vcmUgbm9kZV9tb2R1bGVzXG4gICAgICAgIC5maWx0ZXIocCA9PiBwICE9PSAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgLy8gT25seSBpbnRlcmVzdGVkIGluIGRpcmVjdG9yaWVzIChhbmQgb25seSB0aG9zZSB0aGF0IGFyZSBub3Qgc3ltbGlua3MpXG4gICAgICAgIC5maWx0ZXIocCA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdCA9IHRoaXMuZnMubHN0YXQocmVzb2x2ZShzb3VyY2VEaXJlY3RvcnksIHApKTtcbiAgICAgICAgICByZXR1cm4gc3RhdC5pc0RpcmVjdG9yeSgpICYmICFzdGF0LmlzU3ltYm9saWNMaW5rKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgIC8vIEVpdGhlciB0aGUgZGlyZWN0b3J5IGlzIGEgcG90ZW50aWFsIHBhY2thZ2Ugb3IgYSBuYW1lc3BhY2UgY29udGFpbmluZyBwYWNrYWdlcyAoZS5nXG4gICAgICAgICAgLy8gYEBhbmd1bGFyYCkuXG4gICAgICAgICAgY29uc3QgcGFja2FnZVBhdGggPSBqb2luKHNvdXJjZURpcmVjdG9yeSwgcCk7XG4gICAgICAgICAgZW50cnlQb2ludHMucHVzaCguLi50aGlzLndhbGtEaXJlY3RvcnlGb3JFbnRyeVBvaW50cyhwYWNrYWdlUGF0aCkpO1xuXG4gICAgICAgICAgLy8gQWxzbyBjaGVjayBmb3IgYW55IG5lc3RlZCBub2RlX21vZHVsZXMgaW4gdGhpcyBwYWNrYWdlXG4gICAgICAgICAgY29uc3QgbmVzdGVkTm9kZU1vZHVsZXNQYXRoID0gam9pbihwYWNrYWdlUGF0aCwgJ25vZGVfbW9kdWxlcycpO1xuICAgICAgICAgIGlmICh0aGlzLmZzLmV4aXN0cyhuZXN0ZWROb2RlTW9kdWxlc1BhdGgpKSB7XG4gICAgICAgICAgICBlbnRyeVBvaW50cy5wdXNoKC4uLnRoaXMud2Fsa0RpcmVjdG9yeUZvckVudHJ5UG9pbnRzKG5lc3RlZE5vZGVNb2R1bGVzUGF0aCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIGVudHJ5UG9pbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2UgdGhlIGZvbGRlciBzdHJ1Y3R1cmUgbG9va2luZyBmb3IgYWxsIHRoZSBlbnRyeSBwb2ludHNcbiAgICogQHBhcmFtIHBhY2thZ2VQYXRoIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIGFuIG5wbSBwYWNrYWdlIHRoYXQgbWF5IGNvbnRhaW4gZW50cnkgcG9pbnRzXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGVudHJ5IHBvaW50cyB0aGF0IHdlcmUgZGlzY292ZXJlZC5cbiAgICovXG4gIHByaXZhdGUgZ2V0RW50cnlQb2ludHNGb3JQYWNrYWdlKHBhY2thZ2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEVudHJ5UG9pbnRbXSB7XG4gICAgY29uc3QgZW50cnlQb2ludHM6IEVudHJ5UG9pbnRbXSA9IFtdO1xuXG4gICAgLy8gVHJ5IHRvIGdldCBhbiBlbnRyeSBwb2ludCBmcm9tIHRoZSB0b3AgbGV2ZWwgcGFja2FnZSBkaXJlY3RvcnlcbiAgICBjb25zdCB0b3BMZXZlbEVudHJ5UG9pbnQgPVxuICAgICAgICBnZXRFbnRyeVBvaW50SW5mbyh0aGlzLmZzLCB0aGlzLmNvbmZpZywgdGhpcy5sb2dnZXIsIHBhY2thZ2VQYXRoLCBwYWNrYWdlUGF0aCk7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyBwcmltYXJ5IGVudHJ5LXBvaW50IHRoZW4gZXhpdFxuICAgIGlmICh0b3BMZXZlbEVudHJ5UG9pbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2Ugc3RvcmUgaXQgYW5kIHNlYXJjaCBmb3Igc2Vjb25kYXJ5IGVudHJ5LXBvaW50c1xuICAgIGVudHJ5UG9pbnRzLnB1c2godG9wTGV2ZWxFbnRyeVBvaW50KTtcbiAgICB0aGlzLndhbGtEaXJlY3RvcnkocGFja2FnZVBhdGgsIHBhY2thZ2VQYXRoLCAocGF0aCwgaXNEaXJlY3RvcnkpID0+IHtcbiAgICAgIC8vIElmIHRoZSBwYXRoIGlzIGEgSlMgZmlsZSB0aGVuIHN0cmlwIGl0cyBleHRlbnNpb24gYW5kIHNlZSBpZiB3ZSBjYW4gbWF0Y2ggYW4gZW50cnktcG9pbnQuXG4gICAgICBjb25zdCBwb3NzaWJsZUVudHJ5UG9pbnRQYXRoID0gaXNEaXJlY3RvcnkgPyBwYXRoIDogc3RyaXBKc0V4dGVuc2lvbihwYXRoKTtcbiAgICAgIGNvbnN0IHN1YkVudHJ5UG9pbnQgPVxuICAgICAgICAgIGdldEVudHJ5UG9pbnRJbmZvKHRoaXMuZnMsIHRoaXMuY29uZmlnLCB0aGlzLmxvZ2dlciwgcGFja2FnZVBhdGgsIHBvc3NpYmxlRW50cnlQb2ludFBhdGgpO1xuICAgICAgaWYgKHN1YkVudHJ5UG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgZW50cnlQb2ludHMucHVzaChzdWJFbnRyeVBvaW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlbnRyeVBvaW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSB3YWxrIGEgZGlyZWN0b3J5IGFuZCBpdHMgc3ViLWRpcmVjdG9yaWVzLCBhcHBseWluZyBhIGdpdmVuXG4gICAqIGZ1bmN0aW9uIHRvIGVhY2ggZGlyZWN0b3J5LlxuICAgKiBAcGFyYW0gZGlyIHRoZSBkaXJlY3RvcnkgdG8gcmVjdXJzaXZlbHkgd2Fsay5cbiAgICogQHBhcmFtIGZuIHRoZSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGRpcmVjdG9yeS5cbiAgICovXG4gIHByaXZhdGUgd2Fsa0RpcmVjdG9yeShcbiAgICAgIHBhY2thZ2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgZGlyOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIGZuOiAocGF0aDogQWJzb2x1dGVGc1BhdGgsIGlzRGlyZWN0b3J5OiBib29sZWFuKSA9PiB2b2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuZnNcbiAgICAgICAgLnJlYWRkaXIoZGlyKVxuICAgICAgICAvLyBOb3QgaW50ZXJlc3RlZCBpbiBoaWRkZW4gZmlsZXNcbiAgICAgICAgLmZpbHRlcihwYXRoID0+ICFwYXRoLnN0YXJ0c1dpdGgoJy4nKSlcbiAgICAgICAgLy8gSWdub3JlIG5vZGVfbW9kdWxlc1xuICAgICAgICAuZmlsdGVyKHBhdGggPT4gcGF0aCAhPT0gJ25vZGVfbW9kdWxlcycpXG4gICAgICAgIC5tYXAocGF0aCA9PiByZXNvbHZlKGRpciwgcGF0aCkpXG4gICAgICAgIC5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXQgPSB0aGlzLmZzLmxzdGF0KHBhdGgpO1xuXG4gICAgICAgICAgaWYgKHN0YXQuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICAgICAgLy8gV2UgYXJlIG5vdCBpbnRlcmVzdGVkIGluIHN5bWJvbGljIGxpbmtzXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm4ocGF0aCwgc3RhdC5pc0RpcmVjdG9yeSgpKTtcblxuICAgICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHRoaXMud2Fsa0RpcmVjdG9yeShwYWNrYWdlUGF0aCwgcGF0aCwgZm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaXBKc0V4dGVuc2lvbjxUIGV4dGVuZHMgc3RyaW5nPihmaWxlUGF0aDogVCk6IFQge1xuICByZXR1cm4gZmlsZVBhdGgucmVwbGFjZSgvXFwuanMkLywgJycpIGFzIFQ7XG59XG4iXX0=
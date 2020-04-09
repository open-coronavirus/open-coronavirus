(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/entry_point_finder/utils", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
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
     * Extract all the base-paths that we need to search for entry-points.
     *
     * This always contains the standard base-path (`sourceDirectory`).
     * But it also parses the `paths` mappings object to guess additional base-paths.
     *
     * For example:
     *
     * ```
     * getBasePaths('/node_modules', {baseUrl: '/dist', paths: {'*': ['lib/*', 'lib/generated/*']}})
     * > ['/node_modules', '/dist/lib']
     * ```
     *
     * Notice that `'/dist'` is not included as there is no `'*'` path,
     * and `'/dist/lib/generated'` is not included as it is covered by `'/dist/lib'`.
     *
     * @param sourceDirectory The standard base-path (e.g. node_modules).
     * @param pathMappings Path mapping configuration, from which to extract additional base-paths.
     */
    function getBasePaths(sourceDirectory, pathMappings) {
        var fs = file_system_1.getFileSystem();
        var basePaths = [sourceDirectory];
        if (pathMappings) {
            var baseUrl_1 = file_system_1.resolve(pathMappings.baseUrl);
            Object.values(pathMappings.paths).forEach(function (paths) { return paths.forEach(function (path) {
                // We only want base paths that exist and are not files
                var basePath = file_system_1.join(baseUrl_1, extractPathPrefix(path));
                while (basePath !== baseUrl_1 && (!fs.exists(basePath) || fs.stat(basePath).isFile())) {
                    basePath = fs.dirname(basePath);
                }
                basePaths.push(basePath);
            }); });
        }
        basePaths.sort(); // Get the paths in order with the shorter ones first.
        return basePaths.filter(removeDeeperPaths);
    }
    exports.getBasePaths = getBasePaths;
    /**
     * Extract everything in the `path` up to the first `*`.
     * @param path The path to parse.
     * @returns The extracted prefix.
     */
    function extractPathPrefix(path) {
        return path.split('*', 1)[0];
    }
    /**
     * A filter function that removes paths that are already covered by higher paths.
     *
     * @param value The current path.
     * @param index The index of the current path.
     * @param array The array of paths (sorted alphabetically).
     * @returns true if this path is not already covered by a previous path.
     */
    function removeDeeperPaths(value, index, array) {
        for (var i = 0; i < index; i++) {
            if (value.startsWith(array[i]))
                return false;
        }
        return true;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvZW50cnlfcG9pbnRfZmluZGVyL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsMkVBQTRGO0lBRzVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSCxTQUFnQixZQUFZLENBQ3hCLGVBQStCLEVBQUUsWUFBc0M7UUFDekUsSUFBTSxFQUFFLEdBQUcsMkJBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksU0FBUyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEMsSUFBSSxZQUFZLEVBQUU7WUFDaEIsSUFBTSxTQUFPLEdBQUcscUJBQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ25FLHVEQUF1RDtnQkFDdkQsSUFBSSxRQUFRLEdBQUcsa0JBQUksQ0FBQyxTQUFPLEVBQUUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEQsT0FBTyxRQUFRLEtBQUssU0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtvQkFDbkYsUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ2pDO2dCQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBUGlELENBT2pELENBQUMsQ0FBQztTQUNMO1FBQ0QsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUUsc0RBQXNEO1FBQ3pFLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFqQkQsb0NBaUJDO0lBRUQ7Ozs7T0FJRztJQUNILFNBQVMsaUJBQWlCLENBQUMsSUFBWTtRQUNyQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxLQUFxQixFQUFFLEtBQWEsRUFBRSxLQUF1QjtRQUN0RixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7U0FDOUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBnZXRGaWxlU3lzdGVtLCBqb2luLCByZXNvbHZlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtQYXRoTWFwcGluZ3N9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBFeHRyYWN0IGFsbCB0aGUgYmFzZS1wYXRocyB0aGF0IHdlIG5lZWQgdG8gc2VhcmNoIGZvciBlbnRyeS1wb2ludHMuXG4gKlxuICogVGhpcyBhbHdheXMgY29udGFpbnMgdGhlIHN0YW5kYXJkIGJhc2UtcGF0aCAoYHNvdXJjZURpcmVjdG9yeWApLlxuICogQnV0IGl0IGFsc28gcGFyc2VzIHRoZSBgcGF0aHNgIG1hcHBpbmdzIG9iamVjdCB0byBndWVzcyBhZGRpdGlvbmFsIGJhc2UtcGF0aHMuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBnZXRCYXNlUGF0aHMoJy9ub2RlX21vZHVsZXMnLCB7YmFzZVVybDogJy9kaXN0JywgcGF0aHM6IHsnKic6IFsnbGliLyonLCAnbGliL2dlbmVyYXRlZC8qJ119fSlcbiAqID4gWycvbm9kZV9tb2R1bGVzJywgJy9kaXN0L2xpYiddXG4gKiBgYGBcbiAqXG4gKiBOb3RpY2UgdGhhdCBgJy9kaXN0J2AgaXMgbm90IGluY2x1ZGVkIGFzIHRoZXJlIGlzIG5vIGAnKidgIHBhdGgsXG4gKiBhbmQgYCcvZGlzdC9saWIvZ2VuZXJhdGVkJ2AgaXMgbm90IGluY2x1ZGVkIGFzIGl0IGlzIGNvdmVyZWQgYnkgYCcvZGlzdC9saWInYC5cbiAqXG4gKiBAcGFyYW0gc291cmNlRGlyZWN0b3J5IFRoZSBzdGFuZGFyZCBiYXNlLXBhdGggKGUuZy4gbm9kZV9tb2R1bGVzKS5cbiAqIEBwYXJhbSBwYXRoTWFwcGluZ3MgUGF0aCBtYXBwaW5nIGNvbmZpZ3VyYXRpb24sIGZyb20gd2hpY2ggdG8gZXh0cmFjdCBhZGRpdGlvbmFsIGJhc2UtcGF0aHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNlUGF0aHMoXG4gICAgc291cmNlRGlyZWN0b3J5OiBBYnNvbHV0ZUZzUGF0aCwgcGF0aE1hcHBpbmdzOiBQYXRoTWFwcGluZ3MgfCB1bmRlZmluZWQpOiBBYnNvbHV0ZUZzUGF0aFtdIHtcbiAgY29uc3QgZnMgPSBnZXRGaWxlU3lzdGVtKCk7XG4gIGxldCBiYXNlUGF0aHMgPSBbc291cmNlRGlyZWN0b3J5XTtcbiAgaWYgKHBhdGhNYXBwaW5ncykge1xuICAgIGNvbnN0IGJhc2VVcmwgPSByZXNvbHZlKHBhdGhNYXBwaW5ncy5iYXNlVXJsKTtcbiAgICBPYmplY3QudmFsdWVzKHBhdGhNYXBwaW5ncy5wYXRocykuZm9yRWFjaChwYXRocyA9PiBwYXRocy5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgLy8gV2Ugb25seSB3YW50IGJhc2UgcGF0aHMgdGhhdCBleGlzdCBhbmQgYXJlIG5vdCBmaWxlc1xuICAgICAgbGV0IGJhc2VQYXRoID0gam9pbihiYXNlVXJsLCBleHRyYWN0UGF0aFByZWZpeChwYXRoKSk7XG4gICAgICB3aGlsZSAoYmFzZVBhdGggIT09IGJhc2VVcmwgJiYgKCFmcy5leGlzdHMoYmFzZVBhdGgpIHx8IGZzLnN0YXQoYmFzZVBhdGgpLmlzRmlsZSgpKSkge1xuICAgICAgICBiYXNlUGF0aCA9IGZzLmRpcm5hbWUoYmFzZVBhdGgpO1xuICAgICAgfVxuICAgICAgYmFzZVBhdGhzLnB1c2goYmFzZVBhdGgpO1xuICAgIH0pKTtcbiAgfVxuICBiYXNlUGF0aHMuc29ydCgpOyAgLy8gR2V0IHRoZSBwYXRocyBpbiBvcmRlciB3aXRoIHRoZSBzaG9ydGVyIG9uZXMgZmlyc3QuXG4gIHJldHVybiBiYXNlUGF0aHMuZmlsdGVyKHJlbW92ZURlZXBlclBhdGhzKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IGV2ZXJ5dGhpbmcgaW4gdGhlIGBwYXRoYCB1cCB0byB0aGUgZmlyc3QgYCpgLlxuICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBUaGUgZXh0cmFjdGVkIHByZWZpeC5cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFBhdGhQcmVmaXgocGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KCcqJywgMSlbMF07XG59XG5cbi8qKlxuICogQSBmaWx0ZXIgZnVuY3Rpb24gdGhhdCByZW1vdmVzIHBhdGhzIHRoYXQgYXJlIGFscmVhZHkgY292ZXJlZCBieSBoaWdoZXIgcGF0aHMuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSBjdXJyZW50IHBhdGguXG4gKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHBhdGguXG4gKiBAcGFyYW0gYXJyYXkgVGhlIGFycmF5IG9mIHBhdGhzIChzb3J0ZWQgYWxwaGFiZXRpY2FsbHkpLlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGlzIHBhdGggaXMgbm90IGFscmVhZHkgY292ZXJlZCBieSBhIHByZXZpb3VzIHBhdGguXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZURlZXBlclBhdGhzKHZhbHVlOiBBYnNvbHV0ZUZzUGF0aCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IEFic29sdXRlRnNQYXRoW10pIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleDsgaSsrKSB7XG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoYXJyYXlbaV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=
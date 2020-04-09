(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/configuration", ["require", "exports", "vm", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
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
    var vm = require("vm");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var NGCC_CONFIG_FILENAME = 'ngcc.config.js';
    var NgccConfiguration = /** @class */ (function () {
        function NgccConfiguration(fs, baseDir) {
            this.fs = fs;
            // TODO: change string => ModuleSpecifier when we tighten the path types in #30556
            this.cache = new Map();
            var projectConfig = this.loadProjectConfig(baseDir);
            for (var packagePath in projectConfig.packages) {
                var absPackagePath = file_system_1.resolve(baseDir, 'node_modules', packagePath);
                var packageConfig = projectConfig.packages[packagePath];
                packageConfig.entryPoints =
                    this.processEntryPoints(absPackagePath, packageConfig.entryPoints);
                this.cache.set(absPackagePath, packageConfig);
            }
        }
        NgccConfiguration.prototype.getConfig = function (packagePath) {
            if (this.cache.has(packagePath)) {
                return this.cache.get(packagePath);
            }
            var packageConfig = this.loadPackageConfig(packagePath);
            packageConfig.entryPoints = this.processEntryPoints(packagePath, packageConfig.entryPoints);
            this.cache.set(packagePath, packageConfig);
            return packageConfig;
        };
        NgccConfiguration.prototype.loadProjectConfig = function (baseDir) {
            var configFilePath = file_system_1.join(baseDir, NGCC_CONFIG_FILENAME);
            if (this.fs.exists(configFilePath)) {
                try {
                    return this.evalSrcFile(configFilePath);
                }
                catch (e) {
                    throw new Error("Invalid project configuration file at \"" + configFilePath + "\": " + e.message);
                }
            }
            else {
                return { packages: {} };
            }
        };
        NgccConfiguration.prototype.loadPackageConfig = function (packagePath) {
            var configFilePath = file_system_1.join(packagePath, NGCC_CONFIG_FILENAME);
            if (this.fs.exists(configFilePath)) {
                try {
                    return this.evalSrcFile(configFilePath);
                }
                catch (e) {
                    throw new Error("Invalid package configuration file at \"" + configFilePath + "\": " + e.message);
                }
            }
            else {
                return { entryPoints: {} };
            }
        };
        NgccConfiguration.prototype.evalSrcFile = function (srcPath) {
            var src = this.fs.readFile(srcPath);
            var theExports = {};
            var sandbox = {
                module: { exports: theExports },
                exports: theExports, require: require,
                __dirname: file_system_1.dirname(srcPath),
                __filename: srcPath
            };
            vm.runInNewContext(src, sandbox, { filename: srcPath });
            return sandbox.module.exports;
        };
        NgccConfiguration.prototype.processEntryPoints = function (packagePath, entryPoints) {
            var processedEntryPoints = {};
            for (var entryPointPath in entryPoints) {
                // Change the keys to be absolute paths
                processedEntryPoints[file_system_1.resolve(packagePath, entryPointPath)] = entryPoints[entryPointPath];
            }
            return processedEntryPoints;
        };
        return NgccConfiguration;
    }());
    exports.NgccConfiguration = NgccConfiguration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9wYWNrYWdlcy9jb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsdUJBQXlCO0lBQ3pCLDJFQUFrRztJQXNDbEcsSUFBTSxvQkFBb0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUU5QztRQUlFLDJCQUFvQixFQUFjLEVBQUUsT0FBdUI7WUFBdkMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUhsQyxrRkFBa0Y7WUFDMUUsVUFBSyxHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO1lBR25ELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0RCxLQUFLLElBQU0sV0FBVyxJQUFJLGFBQWEsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hELElBQU0sY0FBYyxHQUFHLHFCQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDckUsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDMUQsYUFBYSxDQUFDLFdBQVc7b0JBQ3JCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDL0M7UUFDSCxDQUFDO1FBRUQscUNBQVMsR0FBVCxVQUFVLFdBQTJCO1lBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQy9CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFHLENBQUM7YUFDdEM7WUFFRCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUQsYUFBYSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDM0MsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUVPLDZDQUFpQixHQUF6QixVQUEwQixPQUF1QjtZQUMvQyxJQUFNLGNBQWMsR0FBRyxrQkFBSSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzNELElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ2xDLElBQUk7b0JBQ0YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUN6QztnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUEwQyxjQUFjLFNBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzVGO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQzthQUN2QjtRQUNILENBQUM7UUFFTyw2Q0FBaUIsR0FBekIsVUFBMEIsV0FBMkI7WUFDbkQsSUFBTSxjQUFjLEdBQUcsa0JBQUksQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUMvRCxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNsQyxJQUFJO29CQUNGLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztpQkFDekM7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBMEMsY0FBYyxTQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM1RjthQUNGO2lCQUFNO2dCQUNMLE9BQU8sRUFBQyxXQUFXLEVBQUUsRUFBRSxFQUFDLENBQUM7YUFDMUI7UUFDSCxDQUFDO1FBRU8sdUNBQVcsR0FBbkIsVUFBb0IsT0FBdUI7WUFDekMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLElBQU0sT0FBTyxHQUFHO2dCQUNkLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUM7Z0JBQzdCLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxTQUFBO2dCQUM1QixTQUFTLEVBQUUscUJBQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFVBQVUsRUFBRSxPQUFPO2FBQ3BCLENBQUM7WUFDRixFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUN0RCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2hDLENBQUM7UUFFTyw4Q0FBa0IsR0FBMUIsVUFDSSxXQUEyQixFQUFFLFdBQThEO1lBRTdGLElBQU0sb0JBQW9CLEdBQXNELEVBQUUsQ0FBQztZQUNuRixLQUFLLElBQU0sY0FBYyxJQUFJLFdBQVcsRUFBRTtnQkFDeEMsdUNBQXVDO2dCQUN2QyxvQkFBb0IsQ0FBQyxxQkFBTyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUMxRjtZQUNELE9BQU8sb0JBQW9CLENBQUM7UUFDOUIsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQTNFRCxJQTJFQztJQTNFWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB2bSBmcm9tICd2bSc7XG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtLCBkaXJuYW1lLCBqb2luLCByZXNvbHZlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtQYWNrYWdlSnNvbkZvcm1hdFByb3BlcnRpZXN9IGZyb20gJy4vZW50cnlfcG9pbnQnO1xuXG4vKipcbiAqIFRoZSBmb3JtYXQgb2YgYSBwcm9qZWN0IGxldmVsIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2NjUHJvamVjdENvbmZpZyB7IHBhY2thZ2VzOiB7W3BhY2thZ2VQYXRoOiBzdHJpbmddOiBOZ2NjUGFja2FnZUNvbmZpZ307IH1cblxuLyoqXG4gKiBUaGUgZm9ybWF0IG9mIGEgcGFja2FnZSBsZXZlbCBjb25maWd1cmF0aW9uIGZpbGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdjY1BhY2thZ2VDb25maWcge1xuICAvKipcbiAgICogVGhlIGVudHJ5LXBvaW50cyB0byBjb25maWd1cmUgZm9yIHRoaXMgcGFja2FnZS5cbiAgICpcbiAgICogSW4gdGhlIGNvbmZpZyBmaWxlIHRoZSBrZXlzIGNhbiBiZSBwYXRocyByZWxhdGl2ZSB0byB0aGUgcGFja2FnZSBwYXRoO1xuICAgKiBidXQgd2hlbiBiZWluZyByZWFkIGJhY2sgZnJvbSB0aGUgYE5nY2NDb25maWd1cmF0aW9uYCBzZXJ2aWNlLCB0aGVzZSBwYXRoc1xuICAgKiB3aWxsIGJlIGFic29sdXRlLlxuICAgKi9cbiAgZW50cnlQb2ludHM6IHtbZW50cnlQb2ludFBhdGg6IHN0cmluZ106IE5nY2NFbnRyeVBvaW50Q29uZmlnO307XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBhbiBlbnRyeS1wb2ludC5cbiAqXG4gKiBUaGUgZXhpc3RlbmNlIG9mIGEgY29uZmlndXJhdGlvbiBmb3IgYSBwYXRoIHRlbGxzIG5nY2MgdGhhdCB0aGlzIHNob3VsZCBiZSBjb25zaWRlcmVkIGZvclxuICogcHJvY2Vzc2luZyBhcyBhbiBlbnRyeS1wb2ludC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2NjRW50cnlQb2ludENvbmZpZyB7XG4gIC8qKiBEbyBub3QgcHJvY2VzcyAob3IgZXZlbiBhY2tub3dsZWRnZSB0aGUgZXhpc3RlbmNlIG9mKSB0aGlzIGVudHJ5LXBvaW50LCBpZiB0cnVlLiAqL1xuICBpZ25vcmU/OiBib29sZWFuO1xuICAvKipcbiAgICogVGhpcyBwcm9wZXJ0eSwgaWYgcHJvdmlkZWQsIGhvbGRzIHZhbHVlcyB0aGF0IHdpbGwgb3ZlcnJpZGUgZXF1aXZhbGVudCBwcm9wZXJ0aWVzIGluIGFuXG4gICAqIGVudHJ5LXBvaW50J3MgcGFja2FnZS5qc29uIGZpbGUuXG4gICAqL1xuICBvdmVycmlkZT86IFBhY2thZ2VKc29uRm9ybWF0UHJvcGVydGllcztcbn1cblxuY29uc3QgTkdDQ19DT05GSUdfRklMRU5BTUUgPSAnbmdjYy5jb25maWcuanMnO1xuXG5leHBvcnQgY2xhc3MgTmdjY0NvbmZpZ3VyYXRpb24ge1xuICAvLyBUT0RPOiBjaGFuZ2Ugc3RyaW5nID0+IE1vZHVsZVNwZWNpZmllciB3aGVuIHdlIHRpZ2h0ZW4gdGhlIHBhdGggdHlwZXMgaW4gIzMwNTU2XG4gIHByaXZhdGUgY2FjaGUgPSBuZXcgTWFwPHN0cmluZywgTmdjY1BhY2thZ2VDb25maWc+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmczogRmlsZVN5c3RlbSwgYmFzZURpcjogQWJzb2x1dGVGc1BhdGgpIHtcbiAgICBjb25zdCBwcm9qZWN0Q29uZmlnID0gdGhpcy5sb2FkUHJvamVjdENvbmZpZyhiYXNlRGlyKTtcbiAgICBmb3IgKGNvbnN0IHBhY2thZ2VQYXRoIGluIHByb2plY3RDb25maWcucGFja2FnZXMpIHtcbiAgICAgIGNvbnN0IGFic1BhY2thZ2VQYXRoID0gcmVzb2x2ZShiYXNlRGlyLCAnbm9kZV9tb2R1bGVzJywgcGFja2FnZVBhdGgpO1xuICAgICAgY29uc3QgcGFja2FnZUNvbmZpZyA9IHByb2plY3RDb25maWcucGFja2FnZXNbcGFja2FnZVBhdGhdO1xuICAgICAgcGFja2FnZUNvbmZpZy5lbnRyeVBvaW50cyA9XG4gICAgICAgICAgdGhpcy5wcm9jZXNzRW50cnlQb2ludHMoYWJzUGFja2FnZVBhdGgsIHBhY2thZ2VDb25maWcuZW50cnlQb2ludHMpO1xuICAgICAgdGhpcy5jYWNoZS5zZXQoYWJzUGFja2FnZVBhdGgsIHBhY2thZ2VDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbmZpZyhwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgpOiBOZ2NjUGFja2FnZUNvbmZpZyB7XG4gICAgaWYgKHRoaXMuY2FjaGUuaGFzKHBhY2thZ2VQYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0KHBhY2thZ2VQYXRoKSAhO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VDb25maWcgPSB0aGlzLmxvYWRQYWNrYWdlQ29uZmlnKHBhY2thZ2VQYXRoKTtcbiAgICBwYWNrYWdlQ29uZmlnLmVudHJ5UG9pbnRzID0gdGhpcy5wcm9jZXNzRW50cnlQb2ludHMocGFja2FnZVBhdGgsIHBhY2thZ2VDb25maWcuZW50cnlQb2ludHMpO1xuICAgIHRoaXMuY2FjaGUuc2V0KHBhY2thZ2VQYXRoLCBwYWNrYWdlQ29uZmlnKTtcbiAgICByZXR1cm4gcGFja2FnZUNvbmZpZztcbiAgfVxuXG4gIHByaXZhdGUgbG9hZFByb2plY3RDb25maWcoYmFzZURpcjogQWJzb2x1dGVGc1BhdGgpOiBOZ2NjUHJvamVjdENvbmZpZyB7XG4gICAgY29uc3QgY29uZmlnRmlsZVBhdGggPSBqb2luKGJhc2VEaXIsIE5HQ0NfQ09ORklHX0ZJTEVOQU1FKTtcbiAgICBpZiAodGhpcy5mcy5leGlzdHMoY29uZmlnRmlsZVBhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsU3JjRmlsZShjb25maWdGaWxlUGF0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwcm9qZWN0IGNvbmZpZ3VyYXRpb24gZmlsZSBhdCBcIiR7Y29uZmlnRmlsZVBhdGh9XCI6IGAgKyBlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge3BhY2thZ2VzOiB7fX07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkUGFja2FnZUNvbmZpZyhwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgpOiBOZ2NjUGFja2FnZUNvbmZpZyB7XG4gICAgY29uc3QgY29uZmlnRmlsZVBhdGggPSBqb2luKHBhY2thZ2VQYXRoLCBOR0NDX0NPTkZJR19GSUxFTkFNRSk7XG4gICAgaWYgKHRoaXMuZnMuZXhpc3RzKGNvbmZpZ0ZpbGVQYXRoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbFNyY0ZpbGUoY29uZmlnRmlsZVBhdGgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFja2FnZSBjb25maWd1cmF0aW9uIGZpbGUgYXQgXCIke2NvbmZpZ0ZpbGVQYXRofVwiOiBgICsgZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlbnRyeVBvaW50czoge319O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXZhbFNyY0ZpbGUoc3JjUGF0aDogQWJzb2x1dGVGc1BhdGgpOiBhbnkge1xuICAgIGNvbnN0IHNyYyA9IHRoaXMuZnMucmVhZEZpbGUoc3JjUGF0aCk7XG4gICAgY29uc3QgdGhlRXhwb3J0cyA9IHt9O1xuICAgIGNvbnN0IHNhbmRib3ggPSB7XG4gICAgICBtb2R1bGU6IHtleHBvcnRzOiB0aGVFeHBvcnRzfSxcbiAgICAgIGV4cG9ydHM6IHRoZUV4cG9ydHMsIHJlcXVpcmUsXG4gICAgICBfX2Rpcm5hbWU6IGRpcm5hbWUoc3JjUGF0aCksXG4gICAgICBfX2ZpbGVuYW1lOiBzcmNQYXRoXG4gICAgfTtcbiAgICB2bS5ydW5Jbk5ld0NvbnRleHQoc3JjLCBzYW5kYm94LCB7ZmlsZW5hbWU6IHNyY1BhdGh9KTtcbiAgICByZXR1cm4gc2FuZGJveC5tb2R1bGUuZXhwb3J0cztcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc0VudHJ5UG9pbnRzKFxuICAgICAgcGFja2FnZVBhdGg6IEFic29sdXRlRnNQYXRoLCBlbnRyeVBvaW50czoge1tlbnRyeVBvaW50UGF0aDogc3RyaW5nXTogTmdjY0VudHJ5UG9pbnRDb25maWc7fSk6XG4gICAgICB7W2VudHJ5UG9pbnRQYXRoOiBzdHJpbmddOiBOZ2NjRW50cnlQb2ludENvbmZpZzt9IHtcbiAgICBjb25zdCBwcm9jZXNzZWRFbnRyeVBvaW50czoge1tlbnRyeVBvaW50UGF0aDogc3RyaW5nXTogTmdjY0VudHJ5UG9pbnRDb25maWc7fSA9IHt9O1xuICAgIGZvciAoY29uc3QgZW50cnlQb2ludFBhdGggaW4gZW50cnlQb2ludHMpIHtcbiAgICAgIC8vIENoYW5nZSB0aGUga2V5cyB0byBiZSBhYnNvbHV0ZSBwYXRoc1xuICAgICAgcHJvY2Vzc2VkRW50cnlQb2ludHNbcmVzb2x2ZShwYWNrYWdlUGF0aCwgZW50cnlQb2ludFBhdGgpXSA9IGVudHJ5UG9pbnRzW2VudHJ5UG9pbnRQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2Nlc3NlZEVudHJ5UG9pbnRzO1xuICB9XG59Il19
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
        define("@angular/compiler-cli/src/ngtsc/routing/src/analyzer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/routing/src/lazy", "@angular/compiler-cli/src/ngtsc/routing/src/route"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var lazy_1 = require("@angular/compiler-cli/src/ngtsc/routing/src/lazy");
    var route_1 = require("@angular/compiler-cli/src/ngtsc/routing/src/route");
    var NgModuleRouteAnalyzer = /** @class */ (function () {
        function NgModuleRouteAnalyzer(moduleResolver, evaluator) {
            this.evaluator = evaluator;
            this.modules = new Map();
            this.entryPointManager = new route_1.RouterEntryPointManager(moduleResolver);
        }
        NgModuleRouteAnalyzer.prototype.add = function (sourceFile, moduleName, imports, exports, providers) {
            var key = route_1.entryPointKeyFor(sourceFile.fileName, moduleName);
            if (this.modules.has(key)) {
                throw new Error("Double route analyzing for '" + key + "'.");
            }
            this.modules.set(key, {
                sourceFile: sourceFile, moduleName: moduleName, imports: imports, exports: exports, providers: providers,
            });
        };
        NgModuleRouteAnalyzer.prototype.listLazyRoutes = function (entryModuleKey) {
            var _this = this;
            if ((entryModuleKey !== undefined) && !this.modules.has(entryModuleKey)) {
                throw new Error("Failed to list lazy routes: Unknown module '" + entryModuleKey + "'.");
            }
            var routes = [];
            var scannedModuleKeys = new Set();
            var pendingModuleKeys = entryModuleKey ? [entryModuleKey] : Array.from(this.modules.keys());
            // When listing lazy routes for a specific entry module, we need to recursively extract
            // "transitive" routes from imported/exported modules. This is not necessary when listing all
            // lazy routes, because all analyzed modules will be scanned anyway.
            var scanRecursively = entryModuleKey !== undefined;
            while (pendingModuleKeys.length > 0) {
                var key = pendingModuleKeys.pop();
                if (scannedModuleKeys.has(key)) {
                    continue;
                }
                else {
                    scannedModuleKeys.add(key);
                }
                var data = this.modules.get(key);
                var entryPoints = lazy_1.scanForRouteEntryPoints(data.sourceFile, data.moduleName, data, this.entryPointManager, this.evaluator);
                routes.push.apply(routes, tslib_1.__spread(entryPoints.map(function (entryPoint) { return ({
                    route: entryPoint.loadChildren,
                    module: entryPoint.from,
                    referencedModule: entryPoint.resolvedTo,
                }); })));
                if (scanRecursively) {
                    pendingModuleKeys.push.apply(pendingModuleKeys, tslib_1.__spread(tslib_1.__spread(entryPoints.map(function (_a) {
                        var resolvedTo = _a.resolvedTo;
                        return route_1.entryPointKeyFor(resolvedTo.filePath, resolvedTo.moduleName);
                    }), lazy_1.scanForCandidateTransitiveModules(data.imports, this.evaluator), lazy_1.scanForCandidateTransitiveModules(data.exports, this.evaluator)).filter(function (key) { return _this.modules.has(key); })));
                }
            }
            return routes;
        };
        return NgModuleRouteAnalyzer;
    }());
    exports.NgModuleRouteAnalyzer = NgModuleRouteAnalyzer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3JvdXRpbmcvc3JjL2FuYWx5emVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQU9ILHlFQUFrRjtJQUNsRiwyRUFBa0U7SUFnQmxFO1FBSUUsK0JBQVksY0FBOEIsRUFBVSxTQUEyQjtZQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtZQUh2RSxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQWdDLENBQUM7WUFJeEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksK0JBQXVCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUVELG1DQUFHLEdBQUgsVUFBSSxVQUF5QixFQUFFLFVBQWtCLEVBQUUsT0FBMkIsRUFDMUUsT0FBMkIsRUFBRSxTQUE2QjtZQUM1RCxJQUFNLEdBQUcsR0FBRyx3QkFBZ0IsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzlELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQStCLEdBQUcsT0FBSSxDQUFDLENBQUM7YUFDekQ7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDWixHQUFHLEVBQUU7Z0JBQ0ksVUFBVSxZQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsU0FBUyxXQUFBO2FBQ3RELENBQUMsQ0FBQztRQUNkLENBQUM7UUFFRCw4Q0FBYyxHQUFkLFVBQWUsY0FBaUM7WUFBaEQsaUJBZ0RDO1lBL0NDLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDdkUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBK0MsY0FBYyxPQUFJLENBQUMsQ0FBQzthQUNwRjtZQUVELElBQU0sTUFBTSxHQUFnQixFQUFFLENBQUM7WUFDL0IsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1lBQzVDLElBQU0saUJBQWlCLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUU5Rix1RkFBdUY7WUFDdkYsNkZBQTZGO1lBQzdGLG9FQUFvRTtZQUNwRSxJQUFNLGVBQWUsR0FBRyxjQUFjLEtBQUssU0FBUyxDQUFDO1lBRXJELE9BQU8saUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkMsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxFQUFJLENBQUM7Z0JBRXRDLElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM5QixTQUFTO2lCQUNWO3FCQUFNO29CQUNMLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDNUI7Z0JBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFHLENBQUM7Z0JBQ3JDLElBQU0sV0FBVyxHQUFHLDhCQUF1QixDQUN2QyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXBGLE1BQU0sQ0FBQyxJQUFJLE9BQVgsTUFBTSxtQkFBUyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsQ0FBQztvQkFDYixLQUFLLEVBQUUsVUFBVSxDQUFDLFlBQVk7b0JBQzlCLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSTtvQkFDdkIsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLFVBQVU7aUJBQ3hDLENBQUMsRUFKWSxDQUlaLENBQUMsR0FBRTtnQkFFcEMsSUFBSSxlQUFlLEVBQUU7b0JBQ25CLGlCQUFpQixDQUFDLElBQUksT0FBdEIsaUJBQWlCLG1CQUNWLGlCQUVJLFdBQVcsQ0FBQyxHQUFHLENBQ2QsVUFBQyxFQUFZOzRCQUFYLDBCQUFVO3dCQUFNLE9BQUEsd0JBQWdCLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDO29CQUE1RCxDQUE0RCxDQUFDLEVBRWhGLHdDQUFpQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUUvRCx3Q0FBaUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFDeEUsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQXJCLENBQXFCLENBQUMsR0FBRTtpQkFDekM7YUFDRjtZQUVELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFDSCw0QkFBQztJQUFELENBQUMsQUFyRUQsSUFxRUM7SUFyRVksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge1BhcnRpYWxFdmFsdWF0b3J9IGZyb20gJy4uLy4uL3BhcnRpYWxfZXZhbHVhdG9yJztcblxuaW1wb3J0IHtzY2FuRm9yQ2FuZGlkYXRlVHJhbnNpdGl2ZU1vZHVsZXMsIHNjYW5Gb3JSb3V0ZUVudHJ5UG9pbnRzfSBmcm9tICcuL2xhenknO1xuaW1wb3J0IHtSb3V0ZXJFbnRyeVBvaW50TWFuYWdlciwgZW50cnlQb2ludEtleUZvcn0gZnJvbSAnLi9yb3V0ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdNb2R1bGVSYXdSb3V0ZURhdGEge1xuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlO1xuICBtb2R1bGVOYW1lOiBzdHJpbmc7XG4gIGltcG9ydHM6IHRzLkV4cHJlc3Npb258bnVsbDtcbiAgZXhwb3J0czogdHMuRXhwcmVzc2lvbnxudWxsO1xuICBwcm92aWRlcnM6IHRzLkV4cHJlc3Npb258bnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMYXp5Um91dGUge1xuICByb3V0ZTogc3RyaW5nO1xuICBtb2R1bGU6IHtuYW1lOiBzdHJpbmcsIGZpbGVQYXRoOiBzdHJpbmd9O1xuICByZWZlcmVuY2VkTW9kdWxlOiB7bmFtZTogc3RyaW5nLCBmaWxlUGF0aDogc3RyaW5nfTtcbn1cblxuZXhwb3J0IGNsYXNzIE5nTW9kdWxlUm91dGVBbmFseXplciB7XG4gIHByaXZhdGUgbW9kdWxlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZ01vZHVsZVJhd1JvdXRlRGF0YT4oKTtcbiAgcHJpdmF0ZSBlbnRyeVBvaW50TWFuYWdlcjogUm91dGVyRW50cnlQb2ludE1hbmFnZXI7XG5cbiAgY29uc3RydWN0b3IobW9kdWxlUmVzb2x2ZXI6IE1vZHVsZVJlc29sdmVyLCBwcml2YXRlIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcikge1xuICAgIHRoaXMuZW50cnlQb2ludE1hbmFnZXIgPSBuZXcgUm91dGVyRW50cnlQb2ludE1hbmFnZXIobW9kdWxlUmVzb2x2ZXIpO1xuICB9XG5cbiAgYWRkKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG1vZHVsZU5hbWU6IHN0cmluZywgaW1wb3J0czogdHMuRXhwcmVzc2lvbnxudWxsLFxuICAgICAgZXhwb3J0czogdHMuRXhwcmVzc2lvbnxudWxsLCBwcm92aWRlcnM6IHRzLkV4cHJlc3Npb258bnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IGtleSA9IGVudHJ5UG9pbnRLZXlGb3Ioc291cmNlRmlsZS5maWxlTmFtZSwgbW9kdWxlTmFtZSk7XG4gICAgaWYgKHRoaXMubW9kdWxlcy5oYXMoa2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEb3VibGUgcm91dGUgYW5hbHl6aW5nIGZvciAnJHtrZXl9Jy5gKTtcbiAgICB9XG4gICAgdGhpcy5tb2R1bGVzLnNldChcbiAgICAgICAga2V5LCB7XG4gICAgICAgICAgICAgICAgIHNvdXJjZUZpbGUsIG1vZHVsZU5hbWUsIGltcG9ydHMsIGV4cG9ydHMsIHByb3ZpZGVycyxcbiAgICAgICAgICAgICB9KTtcbiAgfVxuXG4gIGxpc3RMYXp5Um91dGVzKGVudHJ5TW9kdWxlS2V5Pzogc3RyaW5nfHVuZGVmaW5lZCk6IExhenlSb3V0ZVtdIHtcbiAgICBpZiAoKGVudHJ5TW9kdWxlS2V5ICE9PSB1bmRlZmluZWQpICYmICF0aGlzLm1vZHVsZXMuaGFzKGVudHJ5TW9kdWxlS2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbGlzdCBsYXp5IHJvdXRlczogVW5rbm93biBtb2R1bGUgJyR7ZW50cnlNb2R1bGVLZXl9Jy5gKTtcbiAgICB9XG5cbiAgICBjb25zdCByb3V0ZXM6IExhenlSb3V0ZVtdID0gW107XG4gICAgY29uc3Qgc2Nhbm5lZE1vZHVsZUtleXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBwZW5kaW5nTW9kdWxlS2V5cyA9IGVudHJ5TW9kdWxlS2V5ID8gW2VudHJ5TW9kdWxlS2V5XSA6IEFycmF5LmZyb20odGhpcy5tb2R1bGVzLmtleXMoKSk7XG5cbiAgICAvLyBXaGVuIGxpc3RpbmcgbGF6eSByb3V0ZXMgZm9yIGEgc3BlY2lmaWMgZW50cnkgbW9kdWxlLCB3ZSBuZWVkIHRvIHJlY3Vyc2l2ZWx5IGV4dHJhY3RcbiAgICAvLyBcInRyYW5zaXRpdmVcIiByb3V0ZXMgZnJvbSBpbXBvcnRlZC9leHBvcnRlZCBtb2R1bGVzLiBUaGlzIGlzIG5vdCBuZWNlc3Nhcnkgd2hlbiBsaXN0aW5nIGFsbFxuICAgIC8vIGxhenkgcm91dGVzLCBiZWNhdXNlIGFsbCBhbmFseXplZCBtb2R1bGVzIHdpbGwgYmUgc2Nhbm5lZCBhbnl3YXkuXG4gICAgY29uc3Qgc2NhblJlY3Vyc2l2ZWx5ID0gZW50cnlNb2R1bGVLZXkgIT09IHVuZGVmaW5lZDtcblxuICAgIHdoaWxlIChwZW5kaW5nTW9kdWxlS2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBrZXkgPSBwZW5kaW5nTW9kdWxlS2V5cy5wb3AoKSAhO1xuXG4gICAgICBpZiAoc2Nhbm5lZE1vZHVsZUtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2FubmVkTW9kdWxlS2V5cy5hZGQoa2V5KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YSA9IHRoaXMubW9kdWxlcy5nZXQoa2V5KSAhO1xuICAgICAgY29uc3QgZW50cnlQb2ludHMgPSBzY2FuRm9yUm91dGVFbnRyeVBvaW50cyhcbiAgICAgICAgICBkYXRhLnNvdXJjZUZpbGUsIGRhdGEubW9kdWxlTmFtZSwgZGF0YSwgdGhpcy5lbnRyeVBvaW50TWFuYWdlciwgdGhpcy5ldmFsdWF0b3IpO1xuXG4gICAgICByb3V0ZXMucHVzaCguLi5lbnRyeVBvaW50cy5tYXAoZW50cnlQb2ludCA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGU6IGVudHJ5UG9pbnQubG9hZENoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlOiBlbnRyeVBvaW50LmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VkTW9kdWxlOiBlbnRyeVBvaW50LnJlc29sdmVkVG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKTtcblxuICAgICAgaWYgKHNjYW5SZWN1cnNpdmVseSkge1xuICAgICAgICBwZW5kaW5nTW9kdWxlS2V5cy5wdXNoKFxuICAgICAgICAgICAgLi4uW1xuICAgICAgICAgICAgICAgIC8vIFNjYW4gdGhlIHJldHJpZXZlZCBsYXp5IHJvdXRlIGVudHJ5IHBvaW50cy5cbiAgICAgICAgICAgICAgICAuLi5lbnRyeVBvaW50cy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICh7cmVzb2x2ZWRUb30pID0+IGVudHJ5UG9pbnRLZXlGb3IocmVzb2x2ZWRUby5maWxlUGF0aCwgcmVzb2x2ZWRUby5tb2R1bGVOYW1lKSksXG4gICAgICAgICAgICAgICAgLy8gU2NhbiB0aGUgY3VycmVudCBtb2R1bGUncyBpbXBvcnRlZCBtb2R1bGVzLlxuICAgICAgICAgICAgICAgIC4uLnNjYW5Gb3JDYW5kaWRhdGVUcmFuc2l0aXZlTW9kdWxlcyhkYXRhLmltcG9ydHMsIHRoaXMuZXZhbHVhdG9yKSxcbiAgICAgICAgICAgICAgICAvLyBTY2FuIHRoZSBjdXJyZW50IG1vZHVsZSdzIGV4cG9ydGVkIG1vZHVsZXMuXG4gICAgICAgICAgICAgICAgLi4uc2NhbkZvckNhbmRpZGF0ZVRyYW5zaXRpdmVNb2R1bGVzKGRhdGEuZXhwb3J0cywgdGhpcy5ldmFsdWF0b3IpLFxuICAgICAgICBdLmZpbHRlcihrZXkgPT4gdGhpcy5tb2R1bGVzLmhhcyhrZXkpKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxufVxuIl19
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
        define("@angular/compiler-cli/src/ngtsc/routing/src/route", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var RouterEntryPoint = /** @class */ (function () {
        function RouterEntryPoint() {
        }
        return RouterEntryPoint;
    }());
    exports.RouterEntryPoint = RouterEntryPoint;
    var RouterEntryPointImpl = /** @class */ (function () {
        function RouterEntryPointImpl(filePath, moduleName) {
            this.filePath = filePath;
            this.moduleName = moduleName;
        }
        Object.defineProperty(RouterEntryPointImpl.prototype, "name", {
            get: function () { return this.moduleName; },
            enumerable: true,
            configurable: true
        });
        // For debugging purposes.
        RouterEntryPointImpl.prototype.toString = function () { return "RouterEntryPoint(name: " + this.name + ", filePath: " + this.filePath + ")"; };
        return RouterEntryPointImpl;
    }());
    var RouterEntryPointManager = /** @class */ (function () {
        function RouterEntryPointManager(moduleResolver) {
            this.moduleResolver = moduleResolver;
            this.map = new Map();
        }
        RouterEntryPointManager.prototype.resolveLoadChildrenIdentifier = function (loadChildrenIdentifier, context) {
            var _a = tslib_1.__read(loadChildrenIdentifier.split('#'), 2), relativeFile = _a[0], moduleName = _a[1];
            if (moduleName === undefined) {
                return null;
            }
            var resolvedSf = this.moduleResolver.resolveModuleName(relativeFile, context);
            if (resolvedSf === null) {
                return null;
            }
            return this.fromNgModule(resolvedSf, moduleName);
        };
        RouterEntryPointManager.prototype.fromNgModule = function (sf, moduleName) {
            var key = entryPointKeyFor(sf.fileName, moduleName);
            if (!this.map.has(key)) {
                this.map.set(key, new RouterEntryPointImpl(sf.fileName, moduleName));
            }
            return this.map.get(key);
        };
        return RouterEntryPointManager;
    }());
    exports.RouterEntryPointManager = RouterEntryPointManager;
    function entryPointKeyFor(filePath, moduleName) {
        // Drop the extension to be compatible with how cli calls `listLazyRoutes(entryRoute)`.
        return filePath.replace(/\.tsx?$/i, '') + "#" + moduleName;
    }
    exports.entryPointKeyFor = entryPointKeyFor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3JvdXRpbmcvc3JjL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQU1IO1FBQUE7UUFPQSxDQUFDO1FBQUQsdUJBQUM7SUFBRCxDQUFDLEFBUEQsSUFPQztJQVBxQiw0Q0FBZ0I7SUFTdEM7UUFDRSw4QkFBcUIsUUFBZ0IsRUFBVyxVQUFrQjtZQUE3QyxhQUFRLEdBQVIsUUFBUSxDQUFRO1lBQVcsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFHLENBQUM7UUFFdEUsc0JBQUksc0NBQUk7aUJBQVIsY0FBcUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFFOUMsMEJBQTBCO1FBQzFCLHVDQUFRLEdBQVIsY0FBcUIsT0FBTyw0QkFBMEIsSUFBSSxDQUFDLElBQUksb0JBQWUsSUFBSSxDQUFDLFFBQVEsTUFBRyxDQUFDLENBQUMsQ0FBQztRQUNuRywyQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBRUQ7UUFHRSxpQ0FBb0IsY0FBOEI7WUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1lBRjFDLFFBQUcsR0FBRyxJQUFJLEdBQUcsRUFBNEIsQ0FBQztRQUVHLENBQUM7UUFFdEQsK0RBQTZCLEdBQTdCLFVBQThCLHNCQUE4QixFQUFFLE9BQXNCO1lBRTVFLElBQUEseURBQThELEVBQTdELG9CQUFZLEVBQUUsa0JBQStDLENBQUM7WUFDckUsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEYsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQsOENBQVksR0FBWixVQUFhLEVBQWlCLEVBQUUsVUFBa0I7WUFDaEQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUN0RTtZQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFHLENBQUM7UUFDN0IsQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQXpCRCxJQXlCQztJQXpCWSwwREFBdUI7SUEyQnBDLFNBQWdCLGdCQUFnQixDQUFDLFFBQWdCLEVBQUUsVUFBa0I7UUFDbkUsdUZBQXVGO1FBQ3ZGLE9BQVUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFNBQUksVUFBWSxDQUFDO0lBQzdELENBQUM7SUFIRCw0Q0FHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7TW9kdWxlUmVzb2x2ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm91dGVyRW50cnlQb2ludCB7XG4gIGFic3RyYWN0IHJlYWRvbmx5IGZpbGVQYXRoOiBzdHJpbmc7XG5cbiAgYWJzdHJhY3QgcmVhZG9ubHkgbW9kdWxlTmFtZTogc3RyaW5nO1xuXG4gIC8vIEFsaWFzIG9mIG1vZHVsZU5hbWUgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCB3aGF0IGBuZ3Rvb2xzX2FwaWAgcmV0dXJuZWQuXG4gIGFic3RyYWN0IHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbn1cblxuY2xhc3MgUm91dGVyRW50cnlQb2ludEltcGwgaW1wbGVtZW50cyBSb3V0ZXJFbnRyeVBvaW50IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZmlsZVBhdGg6IHN0cmluZywgcmVhZG9ubHkgbW9kdWxlTmFtZTogc3RyaW5nKSB7fVxuXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm1vZHVsZU5hbWU7IH1cblxuICAvLyBGb3IgZGVidWdnaW5nIHB1cnBvc2VzLlxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gYFJvdXRlckVudHJ5UG9pbnQobmFtZTogJHt0aGlzLm5hbWV9LCBmaWxlUGF0aDogJHt0aGlzLmZpbGVQYXRofSlgOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXJFbnRyeVBvaW50TWFuYWdlciB7XG4gIHByaXZhdGUgbWFwID0gbmV3IE1hcDxzdHJpbmcsIFJvdXRlckVudHJ5UG9pbnQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtb2R1bGVSZXNvbHZlcjogTW9kdWxlUmVzb2x2ZXIpIHt9XG5cbiAgcmVzb2x2ZUxvYWRDaGlsZHJlbklkZW50aWZpZXIobG9hZENoaWxkcmVuSWRlbnRpZmllcjogc3RyaW5nLCBjb250ZXh0OiB0cy5Tb3VyY2VGaWxlKTpcbiAgICAgIFJvdXRlckVudHJ5UG9pbnR8bnVsbCB7XG4gICAgY29uc3QgW3JlbGF0aXZlRmlsZSwgbW9kdWxlTmFtZV0gPSBsb2FkQ2hpbGRyZW5JZGVudGlmaWVyLnNwbGl0KCcjJyk7XG4gICAgaWYgKG1vZHVsZU5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHJlc29sdmVkU2YgPSB0aGlzLm1vZHVsZVJlc29sdmVyLnJlc29sdmVNb2R1bGVOYW1lKHJlbGF0aXZlRmlsZSwgY29udGV4dCk7XG4gICAgaWYgKHJlc29sdmVkU2YgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5mcm9tTmdNb2R1bGUocmVzb2x2ZWRTZiwgbW9kdWxlTmFtZSk7XG4gIH1cblxuICBmcm9tTmdNb2R1bGUoc2Y6IHRzLlNvdXJjZUZpbGUsIG1vZHVsZU5hbWU6IHN0cmluZyk6IFJvdXRlckVudHJ5UG9pbnQge1xuICAgIGNvbnN0IGtleSA9IGVudHJ5UG9pbnRLZXlGb3Ioc2YuZmlsZU5hbWUsIG1vZHVsZU5hbWUpO1xuICAgIGlmICghdGhpcy5tYXAuaGFzKGtleSkpIHtcbiAgICAgIHRoaXMubWFwLnNldChrZXksIG5ldyBSb3V0ZXJFbnRyeVBvaW50SW1wbChzZi5maWxlTmFtZSwgbW9kdWxlTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KGtleSkgITtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW50cnlQb2ludEtleUZvcihmaWxlUGF0aDogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBEcm9wIHRoZSBleHRlbnNpb24gdG8gYmUgY29tcGF0aWJsZSB3aXRoIGhvdyBjbGkgY2FsbHMgYGxpc3RMYXp5Um91dGVzKGVudHJ5Um91dGUpYC5cbiAgcmV0dXJuIGAke2ZpbGVQYXRoLnJlcGxhY2UoL1xcLnRzeD8kL2ksICcnKX0jJHttb2R1bGVOYW1lfWA7XG59XG4iXX0=
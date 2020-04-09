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
        define("@angular/compiler-cli/src/ngtsc/routing/src/lazy", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/routing/src/route"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var route_1 = require("@angular/compiler-cli/src/ngtsc/routing/src/route");
    var ROUTES_MARKER = '__ngRoutesMarker__';
    function scanForCandidateTransitiveModules(expr, evaluator) {
        if (expr === null) {
            return [];
        }
        var candidateModuleKeys = [];
        var entries = evaluator.evaluate(expr);
        function recursivelyAddModules(entry) {
            var e_1, _a;
            if (Array.isArray(entry)) {
                try {
                    for (var entry_1 = tslib_1.__values(entry), entry_1_1 = entry_1.next(); !entry_1_1.done; entry_1_1 = entry_1.next()) {
                        var e = entry_1_1.value;
                        recursivelyAddModules(e);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (entry_1_1 && !entry_1_1.done && (_a = entry_1.return)) _a.call(entry_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else if (entry instanceof Map) {
                if (entry.has('ngModule')) {
                    recursivelyAddModules(entry.get('ngModule'));
                }
            }
            else if ((entry instanceof imports_1.Reference) && hasIdentifier(entry.node)) {
                var filePath = entry.node.getSourceFile().fileName;
                var moduleName = entry.node.name.text;
                candidateModuleKeys.push(route_1.entryPointKeyFor(filePath, moduleName));
            }
        }
        recursivelyAddModules(entries);
        return candidateModuleKeys;
    }
    exports.scanForCandidateTransitiveModules = scanForCandidateTransitiveModules;
    function scanForRouteEntryPoints(ngModule, moduleName, data, entryPointManager, evaluator) {
        var e_2, _a;
        var loadChildrenIdentifiers = [];
        var from = entryPointManager.fromNgModule(ngModule, moduleName);
        if (data.providers !== null) {
            loadChildrenIdentifiers.push.apply(loadChildrenIdentifiers, tslib_1.__spread(scanForProviders(data.providers, evaluator)));
        }
        if (data.imports !== null) {
            loadChildrenIdentifiers.push.apply(loadChildrenIdentifiers, tslib_1.__spread(scanForRouterModuleUsage(data.imports, evaluator)));
        }
        if (data.exports !== null) {
            loadChildrenIdentifiers.push.apply(loadChildrenIdentifiers, tslib_1.__spread(scanForRouterModuleUsage(data.exports, evaluator)));
        }
        var routes = [];
        try {
            for (var loadChildrenIdentifiers_1 = tslib_1.__values(loadChildrenIdentifiers), loadChildrenIdentifiers_1_1 = loadChildrenIdentifiers_1.next(); !loadChildrenIdentifiers_1_1.done; loadChildrenIdentifiers_1_1 = loadChildrenIdentifiers_1.next()) {
                var loadChildren = loadChildrenIdentifiers_1_1.value;
                var resolvedTo = entryPointManager.resolveLoadChildrenIdentifier(loadChildren, ngModule);
                if (resolvedTo !== null) {
                    routes.push({
                        loadChildren: loadChildren, from: from, resolvedTo: resolvedTo,
                    });
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (loadChildrenIdentifiers_1_1 && !loadChildrenIdentifiers_1_1.done && (_a = loadChildrenIdentifiers_1.return)) _a.call(loadChildrenIdentifiers_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return routes;
    }
    exports.scanForRouteEntryPoints = scanForRouteEntryPoints;
    function scanForProviders(expr, evaluator) {
        var loadChildrenIdentifiers = [];
        var providers = evaluator.evaluate(expr);
        function recursivelyAddProviders(provider) {
            var e_3, _a;
            if (Array.isArray(provider)) {
                try {
                    for (var provider_1 = tslib_1.__values(provider), provider_1_1 = provider_1.next(); !provider_1_1.done; provider_1_1 = provider_1.next()) {
                        var entry = provider_1_1.value;
                        recursivelyAddProviders(entry);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (provider_1_1 && !provider_1_1.done && (_a = provider_1.return)) _a.call(provider_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            else if (provider instanceof Map) {
                if (provider.has('provide') && provider.has('useValue')) {
                    var provide = provider.get('provide');
                    var useValue = provider.get('useValue');
                    if (isRouteToken(provide) && Array.isArray(useValue)) {
                        loadChildrenIdentifiers.push.apply(loadChildrenIdentifiers, tslib_1.__spread(scanForLazyRoutes(useValue)));
                    }
                }
            }
        }
        recursivelyAddProviders(providers);
        return loadChildrenIdentifiers;
    }
    function scanForRouterModuleUsage(expr, evaluator) {
        var loadChildrenIdentifiers = [];
        var imports = evaluator.evaluate(expr, routerModuleFFR);
        function recursivelyAddRoutes(imp) {
            var e_4, _a;
            if (Array.isArray(imp)) {
                try {
                    for (var imp_1 = tslib_1.__values(imp), imp_1_1 = imp_1.next(); !imp_1_1.done; imp_1_1 = imp_1.next()) {
                        var entry = imp_1_1.value;
                        recursivelyAddRoutes(entry);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (imp_1_1 && !imp_1_1.done && (_a = imp_1.return)) _a.call(imp_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            else if (imp instanceof Map) {
                if (imp.has(ROUTES_MARKER) && imp.has('routes')) {
                    var routes = imp.get('routes');
                    if (Array.isArray(routes)) {
                        loadChildrenIdentifiers.push.apply(loadChildrenIdentifiers, tslib_1.__spread(scanForLazyRoutes(routes)));
                    }
                }
            }
        }
        recursivelyAddRoutes(imports);
        return loadChildrenIdentifiers;
    }
    function scanForLazyRoutes(routes) {
        var loadChildrenIdentifiers = [];
        function recursivelyScanRoutes(routes) {
            var e_5, _a;
            try {
                for (var routes_1 = tslib_1.__values(routes), routes_1_1 = routes_1.next(); !routes_1_1.done; routes_1_1 = routes_1.next()) {
                    var route = routes_1_1.value;
                    if (!(route instanceof Map)) {
                        continue;
                    }
                    if (route.has('loadChildren')) {
                        var loadChildren = route.get('loadChildren');
                        if (typeof loadChildren === 'string') {
                            loadChildrenIdentifiers.push(loadChildren);
                        }
                    }
                    else if (route.has('children')) {
                        var children = route.get('children');
                        if (Array.isArray(children)) {
                            recursivelyScanRoutes(children);
                        }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (routes_1_1 && !routes_1_1.done && (_a = routes_1.return)) _a.call(routes_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        recursivelyScanRoutes(routes);
        return loadChildrenIdentifiers;
    }
    /**
     * A foreign function resolver that converts `RouterModule.forRoot/forChild(X)` to a special object
     * of the form `{__ngRoutesMarker__: true, routes: X}`.
     *
     * These objects are then recognizable inside the larger set of imports/exports.
     */
    var routerModuleFFR = function routerModuleFFR(ref, args) {
        if (!isMethodNodeReference(ref) || !ts.isClassDeclaration(ref.node.parent)) {
            return null;
        }
        else if (ref.bestGuessOwningModule === null ||
            ref.bestGuessOwningModule.specifier !== '@angular/router') {
            return null;
        }
        else if (ref.node.parent.name === undefined || ref.node.parent.name.text !== 'RouterModule') {
            return null;
        }
        else if (!ts.isIdentifier(ref.node.name) ||
            (ref.node.name.text !== 'forRoot' && ref.node.name.text !== 'forChild')) {
            return null;
        }
        var routes = args[0];
        return ts.createObjectLiteral([
            ts.createPropertyAssignment(ROUTES_MARKER, ts.createTrue()),
            ts.createPropertyAssignment('routes', routes),
        ]);
    };
    function hasIdentifier(node) {
        var node_ = node;
        return (node_.name !== undefined) && ts.isIdentifier(node_.name);
    }
    function isMethodNodeReference(ref) {
        return ts.isMethodDeclaration(ref.node);
    }
    function isRouteToken(ref) {
        return ref instanceof imports_1.Reference && ref.bestGuessOwningModule !== null &&
            ref.bestGuessOwningModule.specifier === '@angular/router' && ref.debugName === 'ROUTES';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvcm91dGluZy9zcmMvbGF6eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMsbUVBQXdDO0lBSXhDLDJFQUFvRjtJQUVwRixJQUFNLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQztJQVEzQyxTQUFnQixpQ0FBaUMsQ0FDN0MsSUFBMEIsRUFBRSxTQUEyQjtRQUN6RCxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDakIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELElBQU0sbUJBQW1CLEdBQWEsRUFBRSxDQUFDO1FBQ3pDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsU0FBUyxxQkFBcUIsQ0FBQyxLQUFvQjs7WUFDakQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFOztvQkFDeEIsS0FBZ0IsSUFBQSxVQUFBLGlCQUFBLEtBQUssQ0FBQSw0QkFBQSwrQ0FBRTt3QkFBbEIsSUFBTSxDQUFDLGtCQUFBO3dCQUNWLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMxQjs7Ozs7Ozs7O2FBQ0Y7aUJBQU0sSUFBSSxLQUFLLFlBQVksR0FBRyxFQUFFO2dCQUMvQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3pCLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFHLENBQUMsQ0FBQztpQkFDaEQ7YUFDRjtpQkFBTSxJQUFJLENBQUMsS0FBSyxZQUFZLG1CQUFTLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNwRSxJQUFNLFFBQVEsR0FBRyxL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QztJQUVELFNBQVMscUJBQXFCLENBQzFCLEdBQWlGO1FBRW5GLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsU0FBUyxZQUFZLENBQUMsR0FBa0I7UUFDdEMsT0FBTyxHQUFHLFlBQVksbUJBQVMsSUFBSSxHQUFHLENBQUMscUJBQXFCLEtBQUssSUFBSTtZQUNqRSxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxLQUFLLGlCQUFpQixJQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDO0lBQzlGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0ZvcmVpZ25GdW5jdGlvblJlc29sdmVyLCBQYXJ0aWFsRXZhbHVhdG9yLCBSZXNvbHZlZFZhbHVlfSBmcm9tICcuLi8uLi9wYXJ0aWFsX2V2YWx1YXRvcic7XG5cbmltcG9ydCB7TmdNb2R1bGVSYXdSb3V0ZURhdGF9IGZyb20gJy4vYW5hbHl6ZXInO1xuaW1wb3J0IHtSb3V0ZXJFbnRyeVBvaW50LCBSb3V0ZXJFbnRyeVBvaW50TWFuYWdlciwgZW50cnlQb2ludEtleUZvcn0gZnJvbSAnLi9yb3V0ZSc7XG5cbmNvbnN0IFJPVVRFU19NQVJLRVIgPSAnX19uZ1JvdXRlc01hcmtlcl9fJztcblxuZXhwb3J0IGludGVyZmFjZSBMYXp5Um91dGVFbnRyeSB7XG4gIGxvYWRDaGlsZHJlbjogc3RyaW5nO1xuICBmcm9tOiBSb3V0ZXJFbnRyeVBvaW50O1xuICByZXNvbHZlZFRvOiBSb3V0ZXJFbnRyeVBvaW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbkZvckNhbmRpZGF0ZVRyYW5zaXRpdmVNb2R1bGVzKFxuICAgIGV4cHI6IHRzLkV4cHJlc3Npb24gfCBudWxsLCBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IpOiBzdHJpbmdbXSB7XG4gIGlmIChleHByID09PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgY2FuZGlkYXRlTW9kdWxlS2V5czogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgZW50cmllcyA9IGV2YWx1YXRvci5ldmFsdWF0ZShleHByKTtcblxuICBmdW5jdGlvbiByZWN1cnNpdmVseUFkZE1vZHVsZXMoZW50cnk6IFJlc29sdmVkVmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeSkpIHtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBlbnRyeSkge1xuICAgICAgICByZWN1cnNpdmVseUFkZE1vZHVsZXMoZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbnRyeSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgaWYgKGVudHJ5LmhhcygnbmdNb2R1bGUnKSkge1xuICAgICAgICByZWN1cnNpdmVseUFkZE1vZHVsZXMoZW50cnkuZ2V0KCduZ01vZHVsZScpICEpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGVudHJ5IGluc3RhbmNlb2YgUmVmZXJlbmNlKSAmJiBoYXNJZGVudGlmaWVyKGVudHJ5Lm5vZGUpKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGVudHJ5Lm5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IGVudHJ5Lm5vZGUubmFtZS50ZXh0O1xuICAgICAgY2FuZGlkYXRlTW9kdWxlS2V5cy5wdXNoKGVudHJ5UG9pbnRLZXlGb3IoZmlsZVBhdGgsIG1vZHVsZU5hbWUpKTtcbiAgICB9XG4gIH1cblxuICByZWN1cnNpdmVseUFkZE1vZHVsZXMoZW50cmllcyk7XG4gIHJldHVybiBjYW5kaWRhdGVNb2R1bGVLZXlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbkZvclJvdXRlRW50cnlQb2ludHMoXG4gICAgbmdNb2R1bGU6IHRzLlNvdXJjZUZpbGUsIG1vZHVsZU5hbWU6IHN0cmluZywgZGF0YTogTmdNb2R1bGVSYXdSb3V0ZURhdGEsXG4gICAgZW50cnlQb2ludE1hbmFnZXI6IFJvdXRlckVudHJ5UG9pbnRNYW5hZ2VyLCBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IpOiBMYXp5Um91dGVFbnRyeVtdIHtcbiAgY29uc3QgbG9hZENoaWxkcmVuSWRlbnRpZmllcnM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGZyb20gPSBlbnRyeVBvaW50TWFuYWdlci5mcm9tTmdNb2R1bGUobmdNb2R1bGUsIG1vZHVsZU5hbWUpO1xuICBpZiAoZGF0YS5wcm92aWRlcnMgIT09IG51bGwpIHtcbiAgICBsb2FkQ2hpbGRyZW5JZGVudGlmaWVycy5wdXNoKC4uLnNjYW5Gb3JQcm92aWRlcnMoZGF0YS5wcm92aWRlcnMsIGV2YWx1YXRvcikpO1xuICB9XG4gIGlmIChkYXRhLmltcG9ydHMgIT09IG51bGwpIHtcbiAgICBsb2FkQ2hpbGRyZW5JZGVudGlmaWVycy5wdXNoKC4uLnNjYW5Gb3JSb3V0ZXJNb2R1bGVVc2FnZShkYXRhLmltcG9ydHMsIGV2YWx1YXRvcikpO1xuICB9XG4gIGlmIChkYXRhLmV4cG9ydHMgIT09IG51bGwpIHtcbiAgICBsb2FkQ2hpbGRyZW5JZGVudGlmaWVycy5wdXNoKC4uLnNjYW5Gb3JSb3V0ZXJNb2R1bGVVc2FnZShkYXRhLmV4cG9ydHMsIGV2YWx1YXRvcikpO1xuICB9XG4gIGNvbnN0IHJvdXRlczogTGF6eVJvdXRlRW50cnlbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGxvYWRDaGlsZHJlbiBvZiBsb2FkQ2hpbGRyZW5JZGVudGlmaWVycykge1xuICAgIGNvbnN0IHJlc29sdmVkVG8gPSBlbnRyeVBvaW50TWFuYWdlci5yZXNvbHZlTG9hZENoaWxkcmVuSWRlbnRpZmllcihsb2FkQ2hpbGRyZW4sIG5nTW9kdWxlKTtcbiAgICBpZiAocmVzb2x2ZWRUbyAhPT0gbnVsbCkge1xuICAgICAgcm91dGVzLnB1c2goe1xuICAgICAgICAgIGxvYWRDaGlsZHJlbiwgZnJvbSwgcmVzb2x2ZWRUbyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcm91dGVzO1xufVxuXG5mdW5jdGlvbiBzY2FuRm9yUHJvdmlkZXJzKGV4cHI6IHRzLkV4cHJlc3Npb24sIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcik6IHN0cmluZ1tdIHtcbiAgY29uc3QgbG9hZENoaWxkcmVuSWRlbnRpZmllcnM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHByb3ZpZGVycyA9IGV2YWx1YXRvci5ldmFsdWF0ZShleHByKTtcblxuICBmdW5jdGlvbiByZWN1cnNpdmVseUFkZFByb3ZpZGVycyhwcm92aWRlcjogUmVzb2x2ZWRWYWx1ZSk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3ZpZGVyKSkge1xuICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBwcm92aWRlcikge1xuICAgICAgICByZWN1cnNpdmVseUFkZFByb3ZpZGVycyhlbnRyeSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcm92aWRlciBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgaWYgKHByb3ZpZGVyLmhhcygncHJvdmlkZScpICYmIHByb3ZpZGVyLmhhcygndXNlVmFsdWUnKSkge1xuICAgICAgICBjb25zdCBwcm92aWRlID0gcHJvdmlkZXIuZ2V0KCdwcm92aWRlJyk7XG4gICAgICAgIGNvbnN0IHVzZVZhbHVlID0gcHJvdmlkZXIuZ2V0KCd1c2VWYWx1ZScpO1xuICAgICAgICBpZiAoaXNSb3V0ZVRva2VuKHByb3ZpZGUpICYmIEFycmF5LmlzQXJyYXkodXNlVmFsdWUpKSB7XG4gICAgICAgICAgbG9hZENoaWxkcmVuSWRlbnRpZmllcnMucHVzaCguLi5zY2FuRm9yTGF6eVJvdXRlcyh1c2VWYWx1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlbHlBZGRQcm92aWRlcnMocHJvdmlkZXJzKTtcbiAgcmV0dXJuIGxvYWRDaGlsZHJlbklkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBzY2FuRm9yUm91dGVyTW9kdWxlVXNhZ2UoZXhwcjogdHMuRXhwcmVzc2lvbiwgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yKTogc3RyaW5nW10ge1xuICBjb25zdCBsb2FkQ2hpbGRyZW5JZGVudGlmaWVyczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgaW1wb3J0cyA9IGV2YWx1YXRvci5ldmFsdWF0ZShleHByLCByb3V0ZXJNb2R1bGVGRlIpO1xuXG4gIGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5QWRkUm91dGVzKGltcDogUmVzb2x2ZWRWYWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGltcCkpIHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgaW1wKSB7XG4gICAgICAgIHJlY3Vyc2l2ZWx5QWRkUm91dGVzKGVudHJ5KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGltcCBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgaWYgKGltcC5oYXMoUk9VVEVTX01BUktFUikgJiYgaW1wLmhhcygncm91dGVzJykpIHtcbiAgICAgICAgY29uc3Qgcm91dGVzID0gaW1wLmdldCgncm91dGVzJyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJvdXRlcykpIHtcbiAgICAgICAgICBsb2FkQ2hpbGRyZW5JZGVudGlmaWVycy5wdXNoKC4uLnNjYW5Gb3JMYXp5Um91dGVzKHJvdXRlcykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlbHlBZGRSb3V0ZXMoaW1wb3J0cyk7XG4gIHJldHVybiBsb2FkQ2hpbGRyZW5JZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gc2NhbkZvckxhenlSb3V0ZXMocm91dGVzOiBSZXNvbHZlZFZhbHVlW10pOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGxvYWRDaGlsZHJlbklkZW50aWZpZXJzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5U2NhblJvdXRlcyhyb3V0ZXM6IFJlc29sdmVkVmFsdWVbXSk6IHZvaWQge1xuICAgIGZvciAobGV0IHJvdXRlIG9mIHJvdXRlcykge1xuICAgICAgaWYgKCEocm91dGUgaW5zdGFuY2VvZiBNYXApKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLmhhcygnbG9hZENoaWxkcmVuJykpIHtcbiAgICAgICAgY29uc3QgbG9hZENoaWxkcmVuID0gcm91dGUuZ2V0KCdsb2FkQ2hpbGRyZW4nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBsb2FkQ2hpbGRyZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgbG9hZENoaWxkcmVuSWRlbnRpZmllcnMucHVzaChsb2FkQ2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJvdXRlLmhhcygnY2hpbGRyZW4nKSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHJvdXRlLmdldCgnY2hpbGRyZW4nKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICAgICAgcmVjdXJzaXZlbHlTY2FuUm91dGVzKGNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2l2ZWx5U2NhblJvdXRlcyhyb3V0ZXMpO1xuICByZXR1cm4gbG9hZENoaWxkcmVuSWRlbnRpZmllcnM7XG59XG5cbi8qKlxuICogQSBmb3JlaWduIGZ1bmN0aW9uIHJlc29sdmVyIHRoYXQgY29udmVydHMgYFJvdXRlck1vZHVsZS5mb3JSb290L2ZvckNoaWxkKFgpYCB0byBhIHNwZWNpYWwgb2JqZWN0XG4gKiBvZiB0aGUgZm9ybSBge19fbmdSb3V0ZXNNYXJrZXJfXzogdHJ1ZSwgcm91dGVzOiBYfWAuXG4gKlxuICogVGhlc2Ugb2JqZWN0cyBhcmUgdGhlbiByZWNvZ25pemFibGUgaW5zaWRlIHRoZSBsYXJnZXIgc2V0IG9mIGltcG9ydHMvZXhwb3J0cy5cbiAqL1xuY29uc3Qgcm91dGVyTW9kdWxlRkZSOiBGb3JlaWduRnVuY3Rpb25SZXNvbHZlciA9XG4gICAgZnVuY3Rpb24gcm91dGVyTW9kdWxlRkZSKFxuICAgICAgICByZWY6IFJlZmVyZW5jZTx0cy5GdW5jdGlvbkRlY2xhcmF0aW9ufHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4sXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5QXJyYXk8dHMuRXhwcmVzc2lvbj4pOiB0cy5FeHByZXNzaW9uIHxcbiAgICBudWxsIHtcbiAgICAgIGlmICghaXNNZXRob2ROb2RlUmVmZXJlbmNlKHJlZikgfHwgIXRzLmlzQ2xhc3NEZWNsYXJhdGlvbihyZWYubm9kZS5wYXJlbnQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICByZWYuYmVzdEd1ZXNzT3duaW5nTW9kdWxlID09PSBudWxsIHx8XG4gICAgICAgICAgcmVmLmJlc3RHdWVzc093bmluZ01vZHVsZS5zcGVjaWZpZXIgIT09ICdAYW5ndWxhci9yb3V0ZXInKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICByZWYubm9kZS5wYXJlbnQubmFtZSA9PT0gdW5kZWZpbmVkIHx8IHJlZi5ub2RlLnBhcmVudC5uYW1lLnRleHQgIT09ICdSb3V0ZXJNb2R1bGUnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAhdHMuaXNJZGVudGlmaWVyKHJlZi5ub2RlLm5hbWUpIHx8XG4gICAgICAgICAgKHJlZi5ub2RlLm5hbWUudGV4dCAhPT0gJ2ZvclJvb3QnICYmIHJlZi5ub2RlLm5hbWUudGV4dCAhPT0gJ2ZvckNoaWxkJykpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvdXRlcyA9IGFyZ3NbMF07XG4gICAgICByZXR1cm4gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChbXG4gICAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChST1VURVNfTUFSS0VSLCB0cy5jcmVhdGVUcnVlKCkpLFxuICAgICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3JvdXRlcycsIHJvdXRlcyksXG4gICAgICBdKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBoYXNJZGVudGlmaWVyKG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLk5vZGUme25hbWU6IHRzLklkZW50aWZpZXJ9IHtcbiAgY29uc3Qgbm9kZV8gPSBub2RlIGFzIHRzLk5hbWVkRGVjbGFyYXRpb247XG4gIHJldHVybiAobm9kZV8ubmFtZSAhPT0gdW5kZWZpbmVkKSAmJiB0cy5pc0lkZW50aWZpZXIobm9kZV8ubmFtZSk7XG59XG5cbmZ1bmN0aW9uIGlzTWV0aG9kTm9kZVJlZmVyZW5jZShcbiAgICByZWY6IFJlZmVyZW5jZTx0cy5GdW5jdGlvbkRlY2xhcmF0aW9ufHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4pOlxuICAgIHJlZiBpcyBSZWZlcmVuY2U8dHMuTWV0aG9kRGVjbGFyYXRpb24+IHtcbiAgcmV0dXJuIHRzLmlzTWV0aG9kRGVjbGFyYXRpb24ocmVmLm5vZGUpO1xufVxuXG5mdW5jdGlvbiBpc1JvdXRlVG9rZW4ocmVmOiBSZXNvbHZlZFZhbHVlKTogYm9vbGVhbiB7XG4gIHJldHVybiByZWYgaW5zdGFuY2VvZiBSZWZlcmVuY2UgJiYgcmVmLmJlc3RHdWVzc093bmluZ01vZHVsZSAhPT0gbnVsbCAmJlxuICAgICAgcmVmLmJlc3RHdWVzc093bmluZ01vZHVsZS5zcGVjaWZpZXIgPT09ICdAYW5ndWxhci9yb3V0ZXInICYmIHJlZi5kZWJ1Z05hbWUgPT09ICdST1VURVMnO1xufVxuIl19
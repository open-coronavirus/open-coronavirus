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
        define("@angular/compiler-cli/ngcc/src/dependencies/dependency_resolver", ["require", "exports", "tslib", "dependency-graph", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/packages/entry_point"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var dependency_graph_1 = require("dependency-graph");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    /**
     * A class that resolves dependencies between entry-points.
     */
    var DependencyResolver = /** @class */ (function () {
        function DependencyResolver(fs, logger, hosts) {
            this.fs = fs;
            this.logger = logger;
            this.hosts = hosts;
        }
        /**
         * Sort the array of entry points so that the dependant entry points always come later than
         * their dependencies in the array.
         * @param entryPoints An array entry points to sort.
         * @param target If provided, only return entry-points depended on by this entry-point.
         * @returns the result of sorting the entry points by dependency.
         */
        DependencyResolver.prototype.sortEntryPointsByDependency = function (entryPoints, target) {
            var _a = this.computeDependencyGraph(entryPoints), invalidEntryPoints = _a.invalidEntryPoints, ignoredDependencies = _a.ignoredDependencies, graph = _a.graph;
            var sortedEntryPointNodes;
            if (target) {
                if (target.compiledByAngular) {
                    sortedEntryPointNodes = graph.dependenciesOf(target.path);
                    sortedEntryPointNodes.push(target.path);
                }
                else {
                    sortedEntryPointNodes = [];
                }
            }
            else {
                sortedEntryPointNodes = graph.overallOrder();
            }
            return {
                entryPoints: sortedEntryPointNodes.map(function (path) { return graph.getNodeData(path); }),
                invalidEntryPoints: invalidEntryPoints,
                ignoredDependencies: ignoredDependencies,
            };
        };
        DependencyResolver.prototype.getEntryPointDependencies = function (entryPoint) {
            var formatInfo = this.getEntryPointFormatInfo(entryPoint);
            var host = this.hosts[formatInfo.format];
            if (!host) {
                throw new Error("Could not find a suitable format for computing dependencies of entry-point: '" + entryPoint.path + "'.");
            }
            return host.findDependencies(formatInfo.path);
        };
        /**
         * Computes a dependency graph of the given entry-points.
         *
         * The graph only holds entry-points that ngcc cares about and whose dependencies
         * (direct and transitive) all exist.
         */
        DependencyResolver.prototype.computeDependencyGraph = function (entryPoints) {
            var _this = this;
            var invalidEntryPoints = [];
            var ignoredDependencies = [];
            var graph = new dependency_graph_1.DepGraph();
            var angularEntryPoints = entryPoints.filter(function (entryPoint) { return entryPoint.compiledByAngular; });
            // Add the Angular compiled entry points to the graph as nodes
            angularEntryPoints.forEach(function (entryPoint) { return graph.addNode(entryPoint.path, entryPoint); });
            // Now add the dependencies between them
            angularEntryPoints.forEach(function (entryPoint) {
                var _a = _this.getEntryPointDependencies(entryPoint), dependencies = _a.dependencies, missing = _a.missing, deepImports = _a.deepImports;
                if (missing.size > 0) {
                    // This entry point has dependencies that are missing
                    // so remove it from the graph.
                    removeNodes(entryPoint, Array.from(missing));
                }
                else {
                    dependencies.forEach(function (dependencyPath) {
                        if (!graph.hasNode(entryPoint.path)) {
                            // The entry-point has already been identified as invalid so we don't need
                            // to do any further work on it.
                        }
                        else if (graph.hasNode(dependencyPath)) {
                            // The entry-point is still valid (i.e. has no missing dependencies) and
                            // the dependency maps to an entry point that exists in the graph so add it
                            graph.addDependency(entryPoint.path, dependencyPath);
                        }
                        else if (invalidEntryPoints.some(function (i) { return i.entryPoint.path === dependencyPath; })) {
                            // The dependency path maps to an entry-point that was previously removed
                            // from the graph, so remove this entry-point as well.
                            removeNodes(entryPoint, [dependencyPath]);
                        }
                        else {
                            // The dependency path points to a package that ngcc does not care about.
                            ignoredDependencies.push({ entryPoint: entryPoint, dependencyPath: dependencyPath });
                        }
                    });
                }
                if (deepImports.size) {
                    var imports = Array.from(deepImports).map(function (i) { return "'" + i + "'"; }).join(', ');
                    _this.logger.warn("Entry point '" + entryPoint.name + "' contains deep imports into " + imports + ". " +
                        "This is probably not a problem, but may cause the compilation of entry points to be out of order.");
                }
            });
            return { invalidEntryPoints: invalidEntryPoints, ignoredDependencies: ignoredDependencies, graph: graph };
            function removeNodes(entryPoint, missingDependencies) {
                var nodesToRemove = tslib_1.__spread([entryPoint.path], graph.dependantsOf(entryPoint.path));
                nodesToRemove.forEach(function (node) {
                    invalidEntryPoints.push({ entryPoint: graph.getNodeData(node), missingDependencies: missingDependencies });
                    graph.removeNode(node);
                });
            }
        };
        DependencyResolver.prototype.getEntryPointFormatInfo = function (entryPoint) {
            var properties = Object.keys(entryPoint.packageJson);
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                var format = entry_point_1.getEntryPointFormat(this.fs, entryPoint, property);
                if (format === 'esm2015' || format === 'esm5' || format === 'umd' || format === 'commonjs') {
                    var formatPath = entryPoint.packageJson[property];
                    return { format: format, path: file_system_1.resolve(entryPoint.path, formatPath) };
                }
            }
            throw new Error("There is no appropriate source code format in '" + entryPoint.path + "' entry-point.");
        };
        return DependencyResolver;
    }());
    exports.DependencyResolver = DependencyResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jeV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9kZXBlbmRlbmNpZXMvZGVwZW5kZW5jeV9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCxxREFBMEM7SUFDMUMsMkVBQW1GO0lBRW5GLG1GQUFrSDtJQW1EbEg7O09BRUc7SUFDSDtRQUNFLDRCQUNZLEVBQWMsRUFBVSxNQUFjLEVBQ3RDLEtBQXdEO1lBRHhELE9BQUUsR0FBRixFQUFFLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBQ3RDLFVBQUssR0FBTCxLQUFLLENBQW1EO1FBQUcsQ0FBQztRQUN4RTs7Ozs7O1dBTUc7UUFDSCx3REFBMkIsR0FBM0IsVUFBNEIsV0FBeUIsRUFBRSxNQUFtQjtZQUVsRSxJQUFBLDZDQUNzQyxFQURyQywwQ0FBa0IsRUFBRSw0Q0FBbUIsRUFBRSxnQkFDSixDQUFDO1lBRTdDLElBQUkscUJBQStCLENBQUM7WUFDcEMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsSUFBSSxNQUFNLENBQUMsaUJBQWlCLEVBQUU7b0JBQzVCLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxRCxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN6QztxQkFBTTtvQkFDTCxxQkFBcUIsR0FBRyxFQUFFLENBQUM7aUJBQzVCO2FBQ0Y7aUJBQU07Z0JBQ0wscUJBQXFCLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQzlDO1lBRUQsT0FBTztnQkFDTCxXQUFXLEVBQUUscUJBQXFCLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSyxDQUFDLFdBQVcs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QVEsQ0FBQyxDQUFDO2dCQUVsRSxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxNQUFNLEtBQUssS0FBSyxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7b0JBQzFGLElBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFHLENBQUM7b0JBQ3RELE9BQU8sRUFBQyxNQUFNLFFBQUEsRUFBRSxJQUFJLEVBQUUscUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUFDLENBQUM7aUJBQzdEO2FBQ0Y7WUFDRCxNQUFNLElBQUksS0FBSyxDQUNYLG9EQUFrRCxVQUFVLENBQUMsSUFBSSxtQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pGLENBQUM7UUFDSCx5QkFBQztJQUFELENBQUMsQUEzSEQsSUEySEM7SUEzSFksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RlcEdyYXBofSBmcm9tICdkZXBlbmRlbmN5LWdyYXBoJztcbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIHJlc29sdmV9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXInO1xuaW1wb3J0IHtFbnRyeVBvaW50LCBFbnRyeVBvaW50Rm9ybWF0LCBFbnRyeVBvaW50SnNvblByb3BlcnR5LCBnZXRFbnRyeVBvaW50Rm9ybWF0fSBmcm9tICcuLi9wYWNrYWdlcy9lbnRyeV9wb2ludCc7XG5pbXBvcnQge0RlcGVuZGVuY3lIb3N0LCBEZXBlbmRlbmN5SW5mb30gZnJvbSAnLi9kZXBlbmRlbmN5X2hvc3QnO1xuXG4vKipcbiAqIEhvbGRzIGluZm9ybWF0aW9uIGFib3V0IGVudHJ5IHBvaW50cyB0aGF0IGFyZSByZW1vdmVkIGJlY2F1c2VcbiAqIHRoZXkgaGF2ZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgbWlzc2luZyAoZGlyZWN0bHkgb3IgdHJhbnNpdGl2ZWx5KS5cbiAqXG4gKiBUaGlzIG1pZ2h0IG5vdCBiZSBhbiBlcnJvciwgYmVjYXVzZSBzdWNoIGFuIGVudHJ5IHBvaW50IG1pZ2h0IG5vdCBhY3R1YWxseSBiZSB1c2VkXG4gKiBpbiB0aGUgYXBwbGljYXRpb24uIElmIGl0IGlzIHVzZWQgdGhlbiB0aGUgYG5nY2AgYXBwbGljYXRpb24gY29tcGlsYXRpb24gd291bGRcbiAqIGZhaWwgYWxzbywgc28gd2UgZG9uJ3QgbmVlZCBuZ2NjIHRvIGNhdGNoIHRoaXMuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIGFuIGFwcGxpY2F0aW9uIHRoYXQgdXNlcyB0aGUgYEBhbmd1bGFyL3JvdXRlcmAgcGFja2FnZS5cbiAqIFRoaXMgcGFja2FnZSBpbmNsdWRlcyBhbiBlbnRyeS1wb2ludCBjYWxsZWQgYEBhbmd1bGFyL3JvdXRlci91cGdyYWRlYCwgd2hpY2ggaGFzIGEgZGVwZW5kZW5jeVxuICogb24gdGhlIGBAYW5ndWxhci91cGdyYWRlYCBwYWNrYWdlLlxuICogSWYgdGhlIGFwcGxpY2F0aW9uIG5ldmVyIHVzZXMgY29kZSBmcm9tIGBAYW5ndWxhci9yb3V0ZXIvdXBncmFkZWAgdGhlbiB0aGVyZSBpcyBubyBuZWVkIGZvclxuICogYEBhbmd1bGFyL3VwZ3JhZGVgIHRvIGJlIGluc3RhbGxlZC5cbiAqIEluIHRoaXMgY2FzZSB0aGUgbmdjYyB0b29sIHNob3VsZCBqdXN0IGlnbm9yZSB0aGUgYEBhbmd1bGFyL3JvdXRlci91cGdyYWRlYCBlbmQtcG9pbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW52YWxpZEVudHJ5UG9pbnQge1xuICBlbnRyeVBvaW50OiBFbnRyeVBvaW50O1xuICBtaXNzaW5nRGVwZW5kZW5jaWVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBIb2xkcyBpbmZvcm1hdGlvbiBhYm91dCBkZXBlbmRlbmNpZXMgb2YgYW4gZW50cnktcG9pbnQgdGhhdCBkbyBub3QgbmVlZCB0byBiZSBwcm9jZXNzZWRcbiAqIGJ5IHRoZSBuZ2NjIHRvb2wuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBgcnhqc2AgcGFja2FnZSBkb2VzIG5vdCBjb250YWluIGFueSBBbmd1bGFyIGRlY29yYXRvcnMgdGhhdCBuZWVkIHRvIGJlXG4gKiBjb21waWxlZCBhbmQgc28gdGhpcyBjYW4gYmUgc2FmZWx5IGlnbm9yZWQgYnkgbmdjYy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJZ25vcmVkRGVwZW5kZW5jeSB7XG4gIGVudHJ5UG9pbnQ6IEVudHJ5UG9pbnQ7XG4gIGRlcGVuZGVuY3lQYXRoOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVwZW5kZW5jeURpYWdub3N0aWNzIHtcbiAgaW52YWxpZEVudHJ5UG9pbnRzOiBJbnZhbGlkRW50cnlQb2ludFtdO1xuICBpZ25vcmVkRGVwZW5kZW5jaWVzOiBJZ25vcmVkRGVwZW5kZW5jeVtdO1xufVxuXG4vKipcbiAqIEEgbGlzdCBvZiBlbnRyeS1wb2ludHMsIHNvcnRlZCBieSB0aGVpciBkZXBlbmRlbmNpZXMuXG4gKlxuICogVGhlIGBlbnRyeVBvaW50c2AgYXJyYXkgd2lsbCBiZSBvcmRlcmVkIHNvIHRoYXQgbm8gZW50cnkgcG9pbnQgZGVwZW5kcyB1cG9uIGFuIGVudHJ5IHBvaW50IHRoYXRcbiAqIGFwcGVhcnMgbGF0ZXIgaW4gdGhlIGFycmF5LlxuICpcbiAqIFNvbWUgZW50cnkgcG9pbnRzIG9yIHRoZWlyIGRlcGVuZGVuY2llcyBtYXkgYmUgaGF2ZSBiZWVuIGlnbm9yZWQuIFRoZXNlIGFyZSBjYXB0dXJlZCBmb3JcbiAqIGRpYWdub3N0aWMgcHVycG9zZXMgaW4gYGludmFsaWRFbnRyeVBvaW50c2AgYW5kIGBpZ25vcmVkRGVwZW5kZW5jaWVzYCByZXNwZWN0aXZlbHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU29ydGVkRW50cnlQb2ludHNJbmZvIGV4dGVuZHMgRGVwZW5kZW5jeURpYWdub3N0aWNzIHsgZW50cnlQb2ludHM6IEVudHJ5UG9pbnRbXTsgfVxuXG4vKipcbiAqIEEgY2xhc3MgdGhhdCByZXNvbHZlcyBkZXBlbmRlbmNpZXMgYmV0d2VlbiBlbnRyeS1wb2ludHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBEZXBlbmRlbmN5UmVzb2x2ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0sIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgICBwcml2YXRlIGhvc3RzOiBQYXJ0aWFsPFJlY29yZDxFbnRyeVBvaW50Rm9ybWF0LCBEZXBlbmRlbmN5SG9zdD4+KSB7fVxuICAvKipcbiAgICogU29ydCB0aGUgYXJyYXkgb2YgZW50cnkgcG9pbnRzIHNvIHRoYXQgdGhlIGRlcGVuZGFudCBlbnRyeSBwb2ludHMgYWx3YXlzIGNvbWUgbGF0ZXIgdGhhblxuICAgKiB0aGVpciBkZXBlbmRlbmNpZXMgaW4gdGhlIGFycmF5LlxuICAgKiBAcGFyYW0gZW50cnlQb2ludHMgQW4gYXJyYXkgZW50cnkgcG9pbnRzIHRvIHNvcnQuXG4gICAqIEBwYXJhbSB0YXJnZXQgSWYgcHJvdmlkZWQsIG9ubHkgcmV0dXJuIGVudHJ5LXBvaW50cyBkZXBlbmRlZCBvbiBieSB0aGlzIGVudHJ5LXBvaW50LlxuICAgKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHNvcnRpbmcgdGhlIGVudHJ5IHBvaW50cyBieSBkZXBlbmRlbmN5LlxuICAgKi9cbiAgc29ydEVudHJ5UG9pbnRzQnlEZXBlbmRlbmN5KGVudHJ5UG9pbnRzOiBFbnRyeVBvaW50W10sIHRhcmdldD86IEVudHJ5UG9pbnQpOlxuICAgICAgU29ydGVkRW50cnlQb2ludHNJbmZvIHtcbiAgICBjb25zdCB7aW52YWxpZEVudHJ5UG9pbnRzLCBpZ25vcmVkRGVwZW5kZW5jaWVzLCBncmFwaH0gPVxuICAgICAgICB0aGlzLmNvbXB1dGVEZXBlbmRlbmN5R3JhcGgoZW50cnlQb2ludHMpO1xuXG4gICAgbGV0IHNvcnRlZEVudHJ5UG9pbnROb2Rlczogc3RyaW5nW107XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgaWYgKHRhcmdldC5jb21waWxlZEJ5QW5ndWxhcikge1xuICAgICAgICBzb3J0ZWRFbnRyeVBvaW50Tm9kZXMgPSBncmFwaC5kZXBlbmRlbmNpZXNPZih0YXJnZXQucGF0aCk7XG4gICAgICAgIHNvcnRlZEVudHJ5UG9pbnROb2Rlcy5wdXNoKHRhcmdldC5wYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvcnRlZEVudHJ5UG9pbnROb2RlcyA9IFtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzb3J0ZWRFbnRyeVBvaW50Tm9kZXMgPSBncmFwaC5vdmVyYWxsT3JkZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW50cnlQb2ludHM6IHNvcnRlZEVudHJ5UG9pbnROb2Rlcy5tYXAocGF0aCA9PiBncmFwaC5nZXROb2RlRGF0YShwYXRoKSksXG4gICAgICBpbnZhbGlkRW50cnlQb2ludHMsXG4gICAgICBpZ25vcmVkRGVwZW5kZW5jaWVzLFxuICAgIH07XG4gIH1cblxuICBnZXRFbnRyeVBvaW50RGVwZW5kZW5jaWVzKGVudHJ5UG9pbnQ6IEVudHJ5UG9pbnQpOiBEZXBlbmRlbmN5SW5mbyB7XG4gICAgY29uc3QgZm9ybWF0SW5mbyA9IHRoaXMuZ2V0RW50cnlQb2ludEZvcm1hdEluZm8oZW50cnlQb2ludCk7XG4gICAgY29uc3QgaG9zdCA9IHRoaXMuaG9zdHNbZm9ybWF0SW5mby5mb3JtYXRdO1xuICAgIGlmICghaG9zdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDb3VsZCBub3QgZmluZCBhIHN1aXRhYmxlIGZvcm1hdCBmb3IgY29tcHV0aW5nIGRlcGVuZGVuY2llcyBvZiBlbnRyeS1wb2ludDogJyR7ZW50cnlQb2ludC5wYXRofScuYCk7XG4gICAgfVxuICAgIHJldHVybiBob3N0LmZpbmREZXBlbmRlbmNpZXMoZm9ybWF0SW5mby5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyBhIGRlcGVuZGVuY3kgZ3JhcGggb2YgdGhlIGdpdmVuIGVudHJ5LXBvaW50cy5cbiAgICpcbiAgICogVGhlIGdyYXBoIG9ubHkgaG9sZHMgZW50cnktcG9pbnRzIHRoYXQgbmdjYyBjYXJlcyBhYm91dCBhbmQgd2hvc2UgZGVwZW5kZW5jaWVzXG4gICAqIChkaXJlY3QgYW5kIHRyYW5zaXRpdmUpIGFsbCBleGlzdC5cbiAgICovXG4gIHByaXZhdGUgY29tcHV0ZURlcGVuZGVuY3lHcmFwaChlbnRyeVBvaW50czogRW50cnlQb2ludFtdKTogRGVwZW5kZW5jeUdyYXBoIHtcbiAgICBjb25zdCBpbnZhbGlkRW50cnlQb2ludHM6IEludmFsaWRFbnRyeVBvaW50W10gPSBbXTtcbiAgICBjb25zdCBpZ25vcmVkRGVwZW5kZW5jaWVzOiBJZ25vcmVkRGVwZW5kZW5jeVtdID0gW107XG4gICAgY29uc3QgZ3JhcGggPSBuZXcgRGVwR3JhcGg8RW50cnlQb2ludD4oKTtcblxuICAgIGNvbnN0IGFuZ3VsYXJFbnRyeVBvaW50cyA9IGVudHJ5UG9pbnRzLmZpbHRlcihlbnRyeVBvaW50ID0+IGVudHJ5UG9pbnQuY29tcGlsZWRCeUFuZ3VsYXIpO1xuXG4gICAgLy8gQWRkIHRoZSBBbmd1bGFyIGNvbXBpbGVkIGVudHJ5IHBvaW50cyB0byB0aGUgZ3JhcGggYXMgbm9kZXNcbiAgICBhbmd1bGFyRW50cnlQb2ludHMuZm9yRWFjaChlbnRyeVBvaW50ID0+IGdyYXBoLmFkZE5vZGUoZW50cnlQb2ludC5wYXRoLCBlbnRyeVBvaW50KSk7XG5cbiAgICAvLyBOb3cgYWRkIHRoZSBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGVtXG4gICAgYW5ndWxhckVudHJ5UG9pbnRzLmZvckVhY2goZW50cnlQb2ludCA9PiB7XG4gICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzLCBtaXNzaW5nLCBkZWVwSW1wb3J0c30gPSB0aGlzLmdldEVudHJ5UG9pbnREZXBlbmRlbmNpZXMoZW50cnlQb2ludCk7XG5cbiAgICAgIGlmIChtaXNzaW5nLnNpemUgPiAwKSB7XG4gICAgICAgIC8vIFRoaXMgZW50cnkgcG9pbnQgaGFzIGRlcGVuZGVuY2llcyB0aGF0IGFyZSBtaXNzaW5nXG4gICAgICAgIC8vIHNvIHJlbW92ZSBpdCBmcm9tIHRoZSBncmFwaC5cbiAgICAgICAgcmVtb3ZlTm9kZXMoZW50cnlQb2ludCwgQXJyYXkuZnJvbShtaXNzaW5nKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChkZXBlbmRlbmN5UGF0aCA9PiB7XG4gICAgICAgICAgaWYgKCFncmFwaC5oYXNOb2RlKGVudHJ5UG9pbnQucGF0aCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBlbnRyeS1wb2ludCBoYXMgYWxyZWFkeSBiZWVuIGlkZW50aWZpZWQgYXMgaW52YWxpZCBzbyB3ZSBkb24ndCBuZWVkXG4gICAgICAgICAgICAvLyB0byBkbyBhbnkgZnVydGhlciB3b3JrIG9uIGl0LlxuICAgICAgICAgIH0gZWxzZSBpZiAoZ3JhcGguaGFzTm9kZShkZXBlbmRlbmN5UGF0aCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBlbnRyeS1wb2ludCBpcyBzdGlsbCB2YWxpZCAoaS5lLiBoYXMgbm8gbWlzc2luZyBkZXBlbmRlbmNpZXMpIGFuZFxuICAgICAgICAgICAgLy8gdGhlIGRlcGVuZGVuY3kgbWFwcyB0byBhbiBlbnRyeSBwb2ludCB0aGF0IGV4aXN0cyBpbiB0aGUgZ3JhcGggc28gYWRkIGl0XG4gICAgICAgICAgICBncmFwaC5hZGREZXBlbmRlbmN5KGVudHJ5UG9pbnQucGF0aCwgZGVwZW5kZW5jeVBhdGgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaW52YWxpZEVudHJ5UG9pbnRzLnNvbWUoaSA9PiBpLmVudHJ5UG9pbnQucGF0aCA9PT0gZGVwZW5kZW5jeVBhdGgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVwZW5kZW5jeSBwYXRoIG1hcHMgdG8gYW4gZW50cnktcG9pbnQgdGhhdCB3YXMgcHJldmlvdXNseSByZW1vdmVkXG4gICAgICAgICAgICAvLyBmcm9tIHRoZSBncmFwaCwgc28gcmVtb3ZlIHRoaXMgZW50cnktcG9pbnQgYXMgd2VsbC5cbiAgICAgICAgICAgIHJlbW92ZU5vZGVzKGVudHJ5UG9pbnQsIFtkZXBlbmRlbmN5UGF0aF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVwZW5kZW5jeSBwYXRoIHBvaW50cyB0byBhIHBhY2thZ2UgdGhhdCBuZ2NjIGRvZXMgbm90IGNhcmUgYWJvdXQuXG4gICAgICAgICAgICBpZ25vcmVkRGVwZW5kZW5jaWVzLnB1c2goe2VudHJ5UG9pbnQsIGRlcGVuZGVuY3lQYXRofSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZXBJbXBvcnRzLnNpemUpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0cyA9IEFycmF5LmZyb20oZGVlcEltcG9ydHMpLm1hcChpID0+IGAnJHtpfSdgKS5qb2luKCcsICcpO1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKFxuICAgICAgICAgICAgYEVudHJ5IHBvaW50ICcke2VudHJ5UG9pbnQubmFtZX0nIGNvbnRhaW5zIGRlZXAgaW1wb3J0cyBpbnRvICR7aW1wb3J0c30uIGAgK1xuICAgICAgICAgICAgYFRoaXMgaXMgcHJvYmFibHkgbm90IGEgcHJvYmxlbSwgYnV0IG1heSBjYXVzZSB0aGUgY29tcGlsYXRpb24gb2YgZW50cnkgcG9pbnRzIHRvIGJlIG91dCBvZiBvcmRlci5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB7aW52YWxpZEVudHJ5UG9pbnRzLCBpZ25vcmVkRGVwZW5kZW5jaWVzLCBncmFwaH07XG5cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlcyhlbnRyeVBvaW50OiBFbnRyeVBvaW50LCBtaXNzaW5nRGVwZW5kZW5jaWVzOiBzdHJpbmdbXSkge1xuICAgICAgY29uc3Qgbm9kZXNUb1JlbW92ZSA9IFtlbnRyeVBvaW50LnBhdGgsIC4uLmdyYXBoLmRlcGVuZGFudHNPZihlbnRyeVBvaW50LnBhdGgpXTtcbiAgICAgIG5vZGVzVG9SZW1vdmUuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgaW52YWxpZEVudHJ5UG9pbnRzLnB1c2goe2VudHJ5UG9pbnQ6IGdyYXBoLmdldE5vZGVEYXRhKG5vZGUpLCBtaXNzaW5nRGVwZW5kZW5jaWVzfSk7XG4gICAgICAgIGdyYXBoLnJlbW92ZU5vZGUobm9kZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEVudHJ5UG9pbnRGb3JtYXRJbmZvKGVudHJ5UG9pbnQ6IEVudHJ5UG9pbnQpOlxuICAgICAge2Zvcm1hdDogRW50cnlQb2ludEZvcm1hdCwgcGF0aDogQWJzb2x1dGVGc1BhdGh9IHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoZW50cnlQb2ludC5wYWNrYWdlSnNvbik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnRpZXNbaV0gYXMgRW50cnlQb2ludEpzb25Qcm9wZXJ0eTtcbiAgICAgIGNvbnN0IGZvcm1hdCA9IGdldEVudHJ5UG9pbnRGb3JtYXQodGhpcy5mcywgZW50cnlQb2ludCwgcHJvcGVydHkpO1xuXG4gICAgICBpZiAoZm9ybWF0ID09PSAnZXNtMjAxNScgfHwgZm9ybWF0ID09PSAnZXNtNScgfHwgZm9ybWF0ID09PSAndW1kJyB8fCBmb3JtYXQgPT09ICdjb21tb25qcycpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0UGF0aCA9IGVudHJ5UG9pbnQucGFja2FnZUpzb25bcHJvcGVydHldICE7XG4gICAgICAgIHJldHVybiB7Zm9ybWF0LCBwYXRoOiByZXNvbHZlKGVudHJ5UG9pbnQucGF0aCwgZm9ybWF0UGF0aCl9O1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUaGVyZSBpcyBubyBhcHByb3ByaWF0ZSBzb3VyY2UgY29kZSBmb3JtYXQgaW4gJyR7ZW50cnlQb2ludC5wYXRofScgZW50cnktcG9pbnQuYCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIERlcGVuZGVuY3lHcmFwaCBleHRlbmRzIERlcGVuZGVuY3lEaWFnbm9zdGljcyB7XG4gIGdyYXBoOiBEZXBHcmFwaDxFbnRyeVBvaW50Pjtcbn1cbiJdfQ==
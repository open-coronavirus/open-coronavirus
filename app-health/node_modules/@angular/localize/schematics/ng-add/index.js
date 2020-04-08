/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * @fileoverview Schematics for ng-new project that builds with Bazel.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/schematics/ng-add", ["require", "exports", "tslib", "@angular-devkit/core", "@angular-devkit/schematics", "@schematics/angular/utility/config", "@schematics/angular/utility/project-targets", "@schematics/angular/utility/validation", "@schematics/angular/utility/workspace-models"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular-devkit/schematics");
    var config_1 = require("@schematics/angular/utility/config");
    var project_targets_1 = require("@schematics/angular/utility/project-targets");
    var validation_1 = require("@schematics/angular/utility/validation");
    var workspace_models_1 = require("@schematics/angular/utility/workspace-models");
    exports.localizePolyfill = "import '@angular/localize/init';";
    function getAllOptionValues(host, projectName, builderName, optionName) {
        var targets = project_targets_1.getProjectTargets(host, projectName);
        // Find all targets of a specific build in a project.
        var builderTargets = Object.values(targets).filter(function (target) { return target.builder === builderName; });
        // Get all options contained in target configuration partials.
        var configurationOptions = builderTargets.filter(function (t) { return t.configurations; })
            .map(function (t) { return Object.values(t.configurations); })
            .reduce(function (acc, cur) { return acc.concat.apply(acc, tslib_1.__spread(cur)); }, []);
        // Now we have all option sets. We can use it to find all references to a given property.
        var allOptions = tslib_1.__spread(builderTargets.map(function (t) { return t.options; }), configurationOptions);
        // Get all values for the option name and dedupe them.
        // Deduping will only work for primitives, but the keys we want here are strings so it's ok.
        var optionValues = allOptions.filter(function (o) { return o[optionName]; })
            .map(function (o) { return o[optionName]; })
            .reduce(function (acc, cur) { return !acc.includes(cur) ? acc.concat(cur) : acc; }, []);
        return optionValues;
    }
    function prendendToTargetOptionFile(projectName, builderName, optionName, str) {
        return function (host) {
            // Get all known polyfills for browser builders on this project.
            var optionValues = getAllOptionValues(host, projectName, builderName, optionName);
            optionValues.forEach(function (path) {
                var data = host.read(path);
                if (!data) {
                    // If the file doesn't exist, just ignore it.
                    return;
                }
                var content = core_1.virtualFs.fileBufferToString(data);
                if (content.includes(exports.localizePolyfill) ||
                    content.includes(exports.localizePolyfill.replace(/'/g, '"'))) {
                    // If the file already contains the polyfill (or variations), ignore it too.
                    return;
                }
                // Add string at the start of the file.
                var recorder = host.beginUpdate(path);
                recorder.insertLeft(0, str);
                host.commitUpdate(recorder);
            });
        };
    }
    function default_1(options) {
        return function (host) {
            options.name = options.name || config_1.getWorkspace(host).defaultProject;
            if (!options.name) {
                throw new Error('Please specify a project using "--name project-name"');
            }
            validation_1.validateProjectName(options.name);
            var localizeStr = "/***************************************************************************************************\n * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.\n */\n" + exports.localizePolyfill + "\n";
            return schematics_1.chain([
                prendendToTargetOptionFile(options.name, workspace_models_1.Builders.Browser, 'polyfills', localizeStr),
                prendendToTargetOptionFile(options.name, workspace_models_1.Builders.Server, 'main', localizeStr),
            ]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zY2hlbWF0aWNzL25nLWFkZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRzs7Ozs7Ozs7Ozs7OztJQUVILDZDQUErQztJQUMvQyx5REFBNkQ7SUFDN0QsNkRBQWdFO0lBQ2hFLCtFQUE4RTtJQUM5RSxxRUFBMkU7SUFDM0UsaUZBQWdIO0lBS25HLFFBQUEsZ0JBQWdCLEdBQUcsa0NBQWtDLENBQUM7SUFFbkUsU0FBUyxrQkFBa0IsQ0FDdkIsSUFBVSxFQUFFLFdBQW1CLEVBQUUsV0FBbUIsRUFBRSxVQUFrQjtRQUMxRSxJQUFNLE9BQU8sR0FBRyxtQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFckQscURBQXFEO1FBQ3JELElBQU0sY0FBYyxHQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDekIsVUFBQyxNQUFpRCxJQUFLLE9BQUEsTUFBTSxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQTlCLENBQThCLENBQUMsQ0FBQztRQUUvRiw4REFBOEQ7UUFDOUQsSUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLGNBQWMsRUFBaEIsQ0FBZ0IsQ0FBQzthQUN2QyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFnQixDQUFDLEVBQWpDLENBQWlDLENBQUM7YUFDM0MsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSyxPQUFBLEdBQUcsQ0FBQyxNQUFNLE9BQVYsR0FBRyxtQkFBVyxHQUFHLElBQWpCLENBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0UseUZBQXlGO1FBQ3pGLElBQU0s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WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICpcbiAqIEBmaWxlb3ZlcnZpZXcgU2NoZW1hdGljcyBmb3IgbmctbmV3IHByb2plY3QgdGhhdCBidWlsZHMgd2l0aCBCYXplbC5cbiAqL1xuXG5pbXBvcnQge3ZpcnR1YWxGc30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtSdWxlLCBUcmVlLCBjaGFpbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtnZXRQcm9qZWN0VGFyZ2V0c30gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3Byb2plY3QtdGFyZ2V0cyc7XG5pbXBvcnQge3ZhbGlkYXRlUHJvamVjdE5hbWV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS92YWxpZGF0aW9uJztcbmltcG9ydCB7QnJvd3NlckJ1aWxkZXJUYXJnZXQsIEJ1aWxkZXJzLCBTZXJ2ZUJ1aWxkZXJUYXJnZXR9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcblxuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuXG5leHBvcnQgY29uc3QgbG9jYWxpemVQb2x5ZmlsbCA9IGBpbXBvcnQgJ0Bhbmd1bGFyL2xvY2FsaXplL2luaXQnO2A7XG5cbmZ1bmN0aW9uIGdldEFsbE9wdGlvblZhbHVlczxUPihcbiAgICBob3N0OiBUcmVlLCBwcm9qZWN0TmFtZTogc3RyaW5nLCBidWlsZGVyTmFtZTogc3RyaW5nLCBvcHRpb25OYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgdGFyZ2V0cyA9IGdldFByb2plY3RUYXJnZXRzKGhvc3QsIHByb2plY3ROYW1lKTtcblxuICAvLyBGaW5kIGFsbCB0YXJnZXRzIG9mIGEgc3BlY2lmaWMgYnVpbGQgaW4gYSBwcm9qZWN0LlxuICBjb25zdCBidWlsZGVyVGFyZ2V0czogKEJyb3dzZXJCdWlsZGVyVGFyZ2V0IHwgU2VydmVCdWlsZGVyVGFyZ2V0KVtdID1cbiAgICAgIE9iamVjdC52YWx1ZXModGFyZ2V0cykuZmlsdGVyKFxuICAgICAgICAgICh0YXJnZXQ6IEJyb3dzZXJCdWlsZGVyVGFyZ2V0IHwgU2VydmVCdWlsZGVyVGFyZ2V0KSA9PiB0YXJnZXQuYnVpbGRlciA9PT0gYnVpbGRlck5hbWUpO1xuXG4gIC8vIEdldCBhbGwgb3B0aW9ucyBjb250YWluZWQgaW4gdGFyZ2V0IGNvbmZpZ3VyYXRpb24gcGFydGlhbHMuXG4gIGNvbnN0IGNvbmZpZ3VyYXRpb25PcHRpb25zID0gYnVpbGRlclRhcmdldHMuZmlsdGVyKHQgPT4gdC5jb25maWd1cmF0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh0ID0+IE9iamVjdC52YWx1ZXModC5jb25maWd1cmF0aW9ucyAhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBjdXIpID0+IGFjYy5jb25jYXQoLi4uY3VyKSwgW10pO1xuXG4gIC8vIE5vdyB3ZSBoYXZlIGFsbCBvcHRpb24gc2V0cy4gV2UgY2FuIHVzZSBpdCB0byBmaW5kIGFsbCByZWZlcmVuY2VzIHRvIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIGNvbnN0IGFsbE9wdGlvbnMgPSBbXG4gICAgLi4uYnVpbGRlclRhcmdldHMubWFwKHQgPT4gdC5vcHRpb25zKSxcbiAgICAuLi5jb25maWd1cmF0aW9uT3B0aW9ucyxcbiAgXTtcblxuICAvLyBHZXQgYWxsIHZhbHVlcyBmb3IgdGhlIG9wdGlvbiBuYW1lIGFuZCBkZWR1cGUgdGhlbS5cbiAgLy8gRGVkdXBpbmcgd2lsbCBvbmx5IHdvcmsgZm9yIHByaW1pdGl2ZXMsIGJ1dCB0aGUga2V5cyB3ZSB3YW50IGhlcmUgYXJlIHN0cmluZ3Mgc28gaXQncyBvay5cbiAgY29uc3Qgb3B0aW9uVmFsdWVzOiBUW10gPVxuICAgICAgYWxsT3B0aW9ucy5maWx0ZXIobyA9PiBvW29wdGlvbk5hbWVdKVxuICAgICAgICAgIC5tYXAobyA9PiBvW29wdGlvbk5hbWVdKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYywgY3VyKSA9PiAhYWNjLmluY2x1ZGVzKGN1cikgPyBhY2MuY29uY2F0KGN1cikgOiBhY2MsIFtdKTtcblxuICByZXR1cm4gb3B0aW9uVmFsdWVzO1xufVxuXG5cbmZ1bmN0aW9uIHByZW5kZW5kVG9UYXJnZXRPcHRpb25GaWxlKFxuICAgIHByb2plY3ROYW1lOiBzdHJpbmcsIGJ1aWxkZXJOYW1lOiBzdHJpbmcsIG9wdGlvbk5hbWU6IHN0cmluZywgc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgLy8gR2V0IGFsbCBrbm93biBwb2x5ZmlsbHMgZm9yIGJyb3dzZXIgYnVpbGRlcnMgb24gdGhpcyBwcm9qZWN0LlxuICAgIGNvbnN0IG9wdGlvblZhbHVlcyA9IGdldEFsbE9wdGlvblZhbHVlczxzdHJpbmc+KGhvc3QsIHByb2plY3ROYW1lLCBidWlsZGVyTmFtZSwgb3B0aW9uTmFtZSk7XG5cbiAgICBvcHRpb25WYWx1ZXMuZm9yRWFjaChwYXRoID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBob3N0LnJlYWQocGF0aCk7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgLy8gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwganVzdCBpZ25vcmUgaXQuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoZGF0YSk7XG4gICAgICBpZiAoY29udGVudC5pbmNsdWRlcyhsb2NhbGl6ZVBvbHlmaWxsKSB8fFxuICAgICAgICAgIGNvbnRlbnQuaW5jbHVkZXMobG9jYWxpemVQb2x5ZmlsbC5yZXBsYWNlKC8nL2csICdcIicpKSkge1xuICAgICAgICAvLyBJZiB0aGUgZmlsZSBhbHJlYWR5IGNvbnRhaW5zIHRoZSBwb2x5ZmlsbCAob3IgdmFyaWF0aW9ucyksIGlnbm9yZSBpdCB0b28uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHN0cmluZyBhdCB0aGUgc3RhcnQgb2YgdGhlIGZpbGUuXG4gICAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUocGF0aCk7XG4gICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KDAsIHN0cik7XG4gICAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgZ2V0V29ya3NwYWNlKGhvc3QpLmRlZmF1bHRQcm9qZWN0O1xuICAgIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IGEgcHJvamVjdCB1c2luZyBcIi0tbmFtZSBwcm9qZWN0LW5hbWVcIicpO1xuICAgIH1cbiAgICB2YWxpZGF0ZVByb2plY3ROYW1lKG9wdGlvbnMubmFtZSk7XG5cbiAgICBjb25zdCBsb2NhbGl6ZVN0ciA9XG4gICAgICAgIGAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBMb2FkIFxcYCRsb2NhbGl6ZVxcYCBvbnRvIHRoZSBnbG9iYWwgc2NvcGUgLSB1c2VkIGlmIGkxOG4gdGFncyBhcHBlYXIgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuXG4gKi9cbiR7bG9jYWxpemVQb2x5ZmlsbH1cbmA7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgcHJlbmRlbmRUb1RhcmdldE9wdGlvbkZpbGUob3B0aW9ucy5uYW1lLCBCdWlsZGVycy5Ccm93c2VyLCAncG9seWZpbGxzJywgbG9jYWxpemVTdHIpLFxuICAgICAgcHJlbmRlbmRUb1RhcmdldE9wdGlvbkZpbGUob3B0aW9ucy5uYW1lLCBCdWlsZGVycy5TZXJ2ZXIsICdtYWluJywgbG9jYWxpemVTdHIpLFxuICAgIF0pO1xuICB9O1xufVxuIl19
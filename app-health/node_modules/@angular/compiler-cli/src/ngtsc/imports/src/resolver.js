(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/imports/src/resolver", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    /**
     * Used by `RouterEntryPointManager` and `NgModuleRouteAnalyzer` (which is in turn is used by
     * `NgModuleDecoratorHandler`) for resolving the module source-files references in lazy-loaded
     * routes (relative to the source-file containing the `NgModule` that provides the route
     * definitions).
     */
    var ModuleResolver = /** @class */ (function () {
        function ModuleResolver(program, compilerOptions, host) {
            this.program = program;
            this.compilerOptions = compilerOptions;
            this.host = host;
        }
        ModuleResolver.prototype.resolveModuleName = function (module, containingFile) {
            var resolved = typescript_1.resolveModuleName(module, containingFile.fileName, this.compilerOptions, this.host);
            if (resolved === undefined) {
                return null;
            }
            return typescript_1.getSourceFileOrNull(this.program, file_system_1.absoluteFrom(resolved.resolvedFileName));
        };
        return ModuleResolver;
    }());
    exports.ModuleResolver = ModuleResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ltcG9ydHMvc3JjL3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBUUEsMkVBQStDO0lBQy9DLGtGQUFpRjtJQVFqRjs7Ozs7T0FLRztJQUNIO1FBQ0Usd0JBQ1ksT0FBbUIsRUFBVSxlQUFtQyxFQUNoRSxJQUFxQjtZQURyQixZQUFPLEdBQVAsT0FBTyxDQUFZO1lBQVUsb0JBQWUsR0FBZixlQUFlLENBQW9CO1lBQ2hFLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQUcsQ0FBQztRQUVyQywwQ0FBaUIsR0FBakIsVUFBa0IsTUFBYyxFQUFFLGNBQTZCO1lBQzdELElBQU0sUUFBUSxHQUNWLDhCQUFpQixDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hGLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sZ0NBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSwwQkFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDcEYsQ0FBQztRQUNILHFCQUFDO0lBQUQsQ0FBQyxBQWJELElBYUM7SUFiWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHthYnNvbHV0ZUZyb219IGZyb20gJy4uLy4uL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Z2V0U291cmNlRmlsZU9yTnVsbCwgcmVzb2x2ZU1vZHVsZU5hbWV9IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4vcmVmZXJlbmNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVmZXJlbmNlUmVzb2x2ZXIge1xuICByZXNvbHZlKGRlY2w6IHRzLkRlY2xhcmF0aW9uLCBpbXBvcnRGcm9tSGludDogc3RyaW5nfG51bGwsIGZyb21GaWxlOiBzdHJpbmcpOlxuICAgICAgUmVmZXJlbmNlPHRzLkRlY2xhcmF0aW9uPjtcbn1cblxuLyoqXG4gKiBVc2VkIGJ5IGBSb3V0ZXJFbnRyeVBvaW50TWFuYWdlcmAgYW5kIGBOZ01vZHVsZVJvdXRlQW5hbHl6ZXJgICh3aGljaCBpcyBpbiB0dXJuIGlzIHVzZWQgYnlcbiAqIGBOZ01vZHVsZURlY29yYXRvckhhbmRsZXJgKSBmb3IgcmVzb2x2aW5nIHRoZSBtb2R1bGUgc291cmNlLWZpbGVzIHJlZmVyZW5jZXMgaW4gbGF6eS1sb2FkZWRcbiAqIHJvdXRlcyAocmVsYXRpdmUgdG8gdGhlIHNvdXJjZS1maWxlIGNvbnRhaW5pbmcgdGhlIGBOZ01vZHVsZWAgdGhhdCBwcm92aWRlcyB0aGUgcm91dGVcbiAqIGRlZmluaXRpb25zKS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vZHVsZVJlc29sdmVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHByb2dyYW06IHRzLlByb2dyYW0sIHByaXZhdGUgY29tcGlsZXJPcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMsXG4gICAgICBwcml2YXRlIGhvc3Q6IHRzLkNvbXBpbGVySG9zdCkge31cblxuICByZXNvbHZlTW9kdWxlTmFtZShtb2R1bGU6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5Tb3VyY2VGaWxlfG51bGwge1xuICAgIGNvbnN0IHJlc29sdmVkID1cbiAgICAgICAgcmVzb2x2ZU1vZHVsZU5hbWUobW9kdWxlLCBjb250YWluaW5nRmlsZS5maWxlTmFtZSwgdGhpcy5jb21waWxlck9wdGlvbnMsIHRoaXMuaG9zdCk7XG4gICAgaWYgKHJlc29sdmVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0U291cmNlRmlsZU9yTnVsbCh0aGlzLnByb2dyYW0sIGFic29sdXRlRnJvbShyZXNvbHZlZC5yZXNvbHZlZEZpbGVOYW1lKSk7XG4gIH1cbn1cbiJdfQ==
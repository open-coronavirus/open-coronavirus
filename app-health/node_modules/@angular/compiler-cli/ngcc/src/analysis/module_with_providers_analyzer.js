(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/analysis/module_with_providers_analyzer", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/ngcc/src/utils"], factory);
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
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    exports.ModuleWithProvidersAnalyses = Map;
    var ModuleWithProvidersAnalyzer = /** @class */ (function () {
        function ModuleWithProvidersAnalyzer(host, referencesRegistry) {
            this.host = host;
            this.referencesRegistry = referencesRegistry;
        }
        ModuleWithProvidersAnalyzer.prototype.analyzeProgram = function (program) {
            var _this = this;
            var analyses = new exports.ModuleWithProvidersAnalyses();
            var rootFiles = this.getRootFiles(program);
            rootFiles.forEach(function (f) {
                var fns = _this.host.getModuleWithProvidersFunctions(f);
                fns && fns.forEach(function (fn) {
                    var dtsFn = _this.getDtsDeclarationForFunction(fn);
                    var typeParam = dtsFn.type && ts.isTypeReferenceNode(dtsFn.type) &&
                        dtsFn.type.typeArguments && dtsFn.type.typeArguments[0] ||
                        null;
                    if (!typeParam || isAnyKeyword(typeParam)) {
                        // Either we do not have a parameterized type or the type is `any`.
                        var ngModule = fn.ngModule;
                        // For internal (non-library) module references, redirect the module's value declaration
                        // to its type declaration.
                        if (ngModule.viaModule === null) {
                            var dtsNgModule = _this.host.getDtsDeclaration(ngModule.node);
                            if (!dtsNgModule) {
                                throw new Error("No typings declaration can be found for the referenced NgModule class in " + fn.declaration.getText() + ".");
                            }
                            if (!ts.isClassDeclaration(dtsNgModule) || !utils_1.hasNameIdentifier(dtsNgModule)) {
                                throw new Error("The referenced NgModule in " + fn.declaration.getText() + " is not a named class declaration in the typings program; instead we get " + dtsNgModule.getText());
                            }
                            // Record the usage of the internal module as it needs to become an exported symbol
                            _this.referencesRegistry.add(ngModule.node, new imports_1.Reference(ngModule.node));
                            ngModule = { node: dtsNgModule, viaModule: null };
                        }
                        var dtsFile = dtsFn.getSourceFile();
                        var analysis = analyses.has(dtsFile) ? analyses.get(dtsFile) : [];
                        analysis.push({ declaration: dtsFn, ngModule: ngModule });
                        analyses.set(dtsFile, analysis);
                    }
                });
            });
            return analyses;
        };
        ModuleWithProvidersAnalyzer.prototype.getRootFiles = function (program) {
            return program.getRootFileNames().map(function (f) { return program.getSourceFile(f); }).filter(utils_1.isDefined);
        };
        ModuleWithProvidersAnalyzer.prototype.getDtsDeclarationForFunction = function (fn) {
            var dtsFn = null;
            var containerClass = fn.container && this.host.getClassSymbol(fn.container);
            if (containerClass) {
                var dtsClass = this.host.getDtsDeclaration(containerClass.valueDeclaration);
                // Get the declaration of the matching static method
                dtsFn = dtsClass && ts.isClassDeclaration(dtsClass) ?
                    dtsClass.members
                        .find(function (member) { return ts.isMethodDeclaration(member) && ts.isIdentifier(member.name) &&
                        member.name.text === fn.name; }) :
                    null;
            }
            else {
                dtsFn = this.host.getDtsDeclaration(fn.declaration);
            }
            if (!dtsFn) {
                throw new Error("Matching type declaration for " + fn.declaration.getText() + " is missing");
            }
            if (!isFunctionOrMethod(dtsFn)) {
                throw new Error("Matching type declaration for " + fn.declaration.getText() + " is not a function: " + dtsFn.getText());
            }
            return dtsFn;
        };
        return ModuleWithProvidersAnalyzer;
    }());
    exports.ModuleWithProvidersAnalyzer = ModuleWithProvidersAnalyzer;
    function isFunctionOrMethod(declaration) {
        return ts.isFunctionDeclaration(declaration) || ts.isMethodDeclaration(declaration);
    }
    function isAnyKeyword(typeParam) {
        return typeParam.kind === ts.SyntaxKind.AnyKeyword;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3dpdGhfcHJvdmlkZXJzX2FuYWx5emVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2FuYWx5c2lzL21vZHVsZV93aXRoX3Byb3ZpZGVyc19hbmFseXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtCQUFpQztJQUdqQyxtRUFBcUQ7SUFHckQsOERBQXNEO0lBZ0J6QyxRQUFBLDJCQUEyQixHQUFHLEdBQUcsQ0FBQztJQUUvQztRQUNFLHFDQUFvQixJQUF3QixFQUFVLGtCQUFzQztZQUF4RSxTQUFJLEdBQUosSUFBSSxDQUFvQjtZQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFBRyxDQUFDO1FBRWhHLG9EQUFjLEdBQWQsVUFBZSxPQUFtQjtZQUFsQyxpQkFzQ0M7WUFyQ0MsSUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBMkIsRUFBRSxDQUFDO1lBQ25ELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7Z0JBQ2pCLElBQU0sR0FBRyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtvQkFDbkIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLDRCQUE0QixDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUMxRCxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFD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QyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDcEUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLElBQUksRUFEdEIsQ0FDc0IsQ0FBbUIsQ0FBQyxDQUFDO29CQUM3RCxJQUFJLENBQUM7YUFDVjtpQkFBTTtnQkFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDckQ7WUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQWlDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLGdCQUFhLENBQUMsQ0FBQzthQUN6RjtZQUNELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FDWCxtQ0FBaUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsNEJBQXVCLEtBQUssQ0FBQyxPQUFPLEVBQUksQ0FBQyxDQUFDO2FBQ3hHO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBdkVELElBdUVDO0lBdkVZLGtFQUEyQjtJQTBFeEMsU0FBUyxrQkFBa0IsQ0FBQyxXQUEyQjtRQUVyRCxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELFNBQVMsWUFBWSxDQUFDLFNBQXNCO1FBQzFDLE9BQU8sU0FBUyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztJQUNyRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7UmVmZXJlbmNlc1JlZ2lzdHJ5fSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9pbXBvcnRzJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbiwgRGVjbGFyYXRpb259IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9yZWZsZWN0aW9uJztcbmltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVyc0Z1bmN0aW9uLCBOZ2NjUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvbmdjY19ob3N0JztcbmltcG9ydCB7aGFzTmFtZUlkZW50aWZpZXIsIGlzRGVmaW5lZH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZVdpdGhQcm92aWRlcnNJbmZvIHtcbiAgLyoqXG4gICAqIFRoZSBkZWNsYXJhdGlvbiAoaW4gdGhlIC5kLnRzIGZpbGUpIG9mIHRoZSBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAgICogYSBgTW9kdWxlV2l0aFByb3ZpZGVycyBvYmplY3QsIGJ1dCBoYXMgYSBzaWduYXR1cmUgdGhhdCBuZWVkc1xuICAgKiBhIHR5cGUgcGFyYW1ldGVyIGFkZGluZy5cbiAgICovXG4gIGRlY2xhcmF0aW9uOiB0cy5NZXRob2REZWNsYXJhdGlvbnx0cy5GdW5jdGlvbkRlY2xhcmF0aW9uO1xuICAvKipcbiAgICogVGhlIE5nTW9kdWxlIGNsYXNzIGRlY2xhcmF0aW9uIChpbiB0aGUgLmQudHMgZmlsZSkgdG8gYWRkIGFzIGEgdHlwZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBuZ01vZHVsZTogRGVjbGFyYXRpb248Q2xhc3NEZWNsYXJhdGlvbj47XG59XG5cbmV4cG9ydCB0eXBlIE1vZHVsZVdpdGhQcm92aWRlcnNBbmFseXNlcyA9IE1hcDx0cy5Tb3VyY2VGaWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzSW5mb1tdPjtcbmV4cG9ydCBjb25zdCBNb2R1bGVXaXRoUHJvdmlkZXJzQW5hbHlzZXMgPSBNYXA7XG5cbmV4cG9ydCBjbGFzcyBNb2R1bGVXaXRoUHJvdmlkZXJzQW5hbHl6ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGhvc3Q6IE5nY2NSZWZsZWN0aW9uSG9zdCwgcHJpdmF0ZSByZWZlcmVuY2VzUmVnaXN0cnk6IFJlZmVyZW5jZXNSZWdpc3RyeSkge31cblxuICBhbmFseXplUHJvZ3JhbShwcm9ncmFtOiB0cy5Qcm9ncmFtKTogTW9kdWxlV2l0aFByb3ZpZGVyc0FuYWx5c2VzIHtcbiAgICBjb25zdCBhbmFseXNlcyA9IG5ldyBNb2R1bGVXaXRoUHJvdmlkZXJzQW5hbHlzZXMoKTtcbiAgICBjb25zdCByb290RmlsZXMgPSB0aGlzLmdldFJvb3RGaWxlcyhwcm9ncmFtKTtcbiAgICByb290RmlsZXMuZm9yRWFjaChmID0+IHtcbiAgICAgIGNvbnN0IGZucyA9IHRoaXMuaG9zdC5nZXRNb2R1bGVXaXRoUHJvdmlkZXJzRnVuY3Rpb25zKGYpO1xuICAgICAgZm5zICYmIGZucy5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgY29uc3QgZHRzRm4gPSB0aGlzLmdldER0c0RlY2xhcmF0aW9uRm9yRnVuY3Rpb24oZm4pO1xuICAgICAgICBjb25zdCB0eXBlUGFyYW0gPSBkdHNGbi50eXBlICYmIHRzLmlzVHlwZVJlZmVyZW5jZU5vZGUoZHRzRm4udHlwZSkgJiZcbiAgICAgICAgICAgICAgICBkdHNGbi50eXBlLnR5cGVBcmd1bWVudHMgJiYgZHRzRm4udHlwZS50eXBlQXJndW1lbnRzWzBdIHx8XG4gICAgICAgICAgICBudWxsO1xuICAgICAgICBpZiAoIXR5cGVQYXJhbSB8fCBpc0FueUtleXdvcmQodHlwZVBhcmFtKSkge1xuICAgICAgICAgIC8vIEVpdGhlciB3ZSBkbyBub3QgaGF2ZSBhIHBhcmFtZXRlcml6ZWQgdHlwZSBvciB0aGUgdHlwZSBpcyBgYW55YC5cbiAgICAgICAgICBsZXQgbmdNb2R1bGUgPSBmbi5uZ01vZHVsZTtcbiAgICAgICAgICAvLyBGb3IgaW50ZXJuYWwgKG5vbi1saWJyYXJ5KSBtb2R1bGUgcmVmZXJlbmNlcywgcmVkaXJlY3QgdGhlIG1vZHVsZSdzIHZhbHVlIGRlY2xhcmF0aW9uXG4gICAgICAgICAgLy8gdG8gaXRzIHR5cGUgZGVjbGFyYXRpb24uXG4gICAgICAgICAgaWYgKG5nTW9kdWxlLnZpYU1vZHVsZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgZHRzTmdNb2R1bGUgPSB0aGlzLmhvc3QuZ2V0RHRzRGVjbGFyYXRpb24obmdNb2R1bGUubm9kZSk7XG4gICAgICAgICAgICBpZiAoIWR0c05nTW9kdWxlKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBObyB0eXBpbmdzIGRlY2xhcmF0aW9uIGNhbiBiZSBmb3VuZCBmb3IgdGhlIHJlZmVyZW5jZWQgTmdNb2R1bGUgY2xhc3MgaW4gJHtmbi5kZWNsYXJhdGlvbi5nZXRUZXh0KCl9LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0cy5pc0NsYXNzRGVjbGFyYXRpb24oZHRzTmdNb2R1bGUpIHx8ICFoYXNOYW1lSWRlbnRpZmllcihkdHNOZ01vZHVsZSkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgYFRoZSByZWZlcmVuY2VkIE5nTW9kdWxlIGluICR7Zm4uZGVjbGFyYXRpb24uZ2V0VGV4dCgpfSBpcyBub3QgYSBuYW1lZCBjbGFzcyBkZWNsYXJhdGlvbiBpbiB0aGUgdHlwaW5ncyBwcm9ncmFtOyBpbnN0ZWFkIHdlIGdldCAke2R0c05nTW9kdWxlLmdldFRleHQoKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlY29yZCB0aGUgdXNhZ2Ugb2YgdGhlIGludGVybmFsIG1vZHVsZSBhcyBpdCBuZWVkcyB0byBiZWNvbWUgYW4gZXhwb3J0ZWQgc3ltYm9sXG4gICAgICAgICAgICB0aGlzLnJlZmVyZW5jZXNSZWdpc3RyeS5hZGQobmdNb2R1bGUubm9kZSwgbmV3IFJlZmVyZW5jZShuZ01vZHVsZS5ub2RlKSk7XG5cbiAgICAgICAgICAgIG5nTW9kdWxlID0ge25vZGU6IGR0c05nTW9kdWxlLCB2aWFNb2R1bGU6IG51bGx9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBkdHNGaWxlID0gZHRzRm4uZ2V0U291cmNlRmlsZSgpO1xuICAgICAgICAgIGNvbnN0IGFuYWx5c2lzID0gYW5hbHlzZXMuaGFzKGR0c0ZpbGUpID8gYW5hbHlzZXMuZ2V0KGR0c0ZpbGUpIDogW107XG4gICAgICAgICAgYW5hbHlzaXMucHVzaCh7ZGVjbGFyYXRpb246IGR0c0ZuLCBuZ01vZHVsZX0pO1xuICAgICAgICAgIGFuYWx5c2VzLnNldChkdHNGaWxlLCBhbmFseXNpcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBhbmFseXNlcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Um9vdEZpbGVzKHByb2dyYW06IHRzLlByb2dyYW0pOiB0cy5Tb3VyY2VGaWxlW10ge1xuICAgIHJldHVybiBwcm9ncmFtLmdldFJvb3RGaWxlTmFtZXMoKS5tYXAoZiA9PiBwcm9ncmFtLmdldFNvdXJjZUZpbGUoZikpLmZpbHRlcihpc0RlZmluZWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREdHNEZWNsYXJhdGlvbkZvckZ1bmN0aW9uKGZuOiBNb2R1bGVXaXRoUHJvdmlkZXJzRnVuY3Rpb24pIHtcbiAgICBsZXQgZHRzRm46IHRzLkRlY2xhcmF0aW9ufG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGNvbnRhaW5lckNsYXNzID0gZm4uY29udGFpbmVyICYmIHRoaXMuaG9zdC5nZXRDbGFzc1N5bWJvbChmbi5jb250YWluZXIpO1xuICAgIGlmIChjb250YWluZXJDbGFzcykge1xuICAgICAgY29uc3QgZHRzQ2xhc3MgPSB0aGlzLmhvc3QuZ2V0RHRzRGVjbGFyYXRpb24oY29udGFpbmVyQ2xhc3MudmFsdWVEZWNsYXJhdGlvbik7XG4gICAgICAvLyBHZXQgdGhlIGRlY2xhcmF0aW9uIG9mIHRoZSBtYXRjaGluZyBzdGF0aWMgbWV0aG9kXG4gICAgICBkdHNGbiA9IGR0c0NsYXNzICYmIHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihkdHNDbGFzcykgP1xuICAgICAgICAgIGR0c0NsYXNzLm1lbWJlcnNcbiAgICAgICAgICAgICAgLmZpbmQoXG4gICAgICAgICAgICAgICAgICBtZW1iZXIgPT4gdHMuaXNNZXRob2REZWNsYXJhdGlvbihtZW1iZXIpICYmIHRzLmlzSWRlbnRpZmllcihtZW1iZXIubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICBtZW1iZXIubmFtZS50ZXh0ID09PSBmbi5uYW1lKSBhcyB0cy5EZWNsYXJhdGlvbiA6XG4gICAgICAgICAgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZHRzRm4gPSB0aGlzLmhvc3QuZ2V0RHRzRGVjbGFyYXRpb24oZm4uZGVjbGFyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoIWR0c0ZuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hdGNoaW5nIHR5cGUgZGVjbGFyYXRpb24gZm9yICR7Zm4uZGVjbGFyYXRpb24uZ2V0VGV4dCgpfSBpcyBtaXNzaW5nYCk7XG4gICAgfVxuICAgIGlmICghaXNGdW5jdGlvbk9yTWV0aG9kKGR0c0ZuKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBNYXRjaGluZyB0eXBlIGRlY2xhcmF0aW9uIGZvciAke2ZuLmRlY2xhcmF0aW9uLmdldFRleHQoKX0gaXMgbm90IGEgZnVuY3Rpb246ICR7ZHRzRm4uZ2V0VGV4dCgpfWApO1xuICAgIH1cbiAgICByZXR1cm4gZHRzRm47XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uT3JNZXRob2QoZGVjbGFyYXRpb246IHRzLkRlY2xhcmF0aW9uKTogZGVjbGFyYXRpb24gaXMgdHMuRnVuY3Rpb25EZWNsYXJhdGlvbnxcbiAgICB0cy5NZXRob2REZWNsYXJhdGlvbiB7XG4gIHJldHVybiB0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pIHx8IHRzLmlzTWV0aG9kRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pO1xufVxuXG5mdW5jdGlvbiBpc0FueUtleXdvcmQodHlwZVBhcmFtOiB0cy5UeXBlTm9kZSk6IHR5cGVQYXJhbSBpcyB0cy5LZXl3b3JkVHlwZU5vZGUge1xuICByZXR1cm4gdHlwZVBhcmFtLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQW55S2V5d29yZDtcbn1cbiJdfQ==
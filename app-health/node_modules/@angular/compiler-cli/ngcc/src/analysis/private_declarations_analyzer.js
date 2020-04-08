(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/analysis/private_declarations_analyzer", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    /**
     * This class will analyze a program to find all the declared classes
     * (i.e. on an NgModule) that are not publicly exported via an entry-point.
     */
    var PrivateDeclarationsAnalyzer = /** @class */ (function () {
        function PrivateDeclarationsAnalyzer(host, referencesRegistry) {
            this.host = host;
            this.referencesRegistry = referencesRegistry;
        }
        PrivateDeclarationsAnalyzer.prototype.analyzeProgram = function (program) {
            var rootFiles = this.getRootFiles(program);
            return this.getPrivateDeclarations(rootFiles, this.referencesRegistry.getDeclarationMap());
        };
        PrivateDeclarationsAnalyzer.prototype.getRootFiles = function (program) {
            return program.getRootFileNames().map(function (f) { return program.getSourceFile(f); }).filter(utils_1.isDefined);
        };
        PrivateDeclarationsAnalyzer.prototype.getPrivateDeclarations = function (rootFiles, declarations) {
            var _this = this;
            var privateDeclarations = new Map(declarations);
            var exportAliasDeclarations = new Map();
            rootFiles.forEach(function (f) {
                var exports = _this.host.getExportsOfModule(f);
                if (exports) {
                    exports.forEach(function (declaration, exportedName) {
                        if (utils_1.hasNameIdentifier(declaration.node)) {
                            if (privateDeclarations.has(declaration.node.name)) {
                                var privateDeclaration = privateDeclarations.get(declaration.node.name);
                                if (privateDeclaration.node !== declaration.node) {
                                    throw new Error(declaration.node.name.text + " is declared multiple times.");
                                }
                                if (declaration.node.name.text === exportedName) {
                                    // This declaration is public so we can remove it from the list
                                    privateDeclarations.delete(declaration.node.name);
                                }
                                else if (!_this.host.getDtsDeclaration(declaration.node)) {
                                    // The referenced declaration is exported publicly but via an alias.
                                    // In some cases the original declaration is missing from the dts program, such as
                                    // when rolling up (flattening) the dts files.
                                    // This is because the original declaration gets renamed to the exported alias.
                                    // There is a constraint on this which we cannot handle. Consider the following
                                    // code:
                                    //
                                    // /src/entry_point.js:
                                    //     export {MyComponent as aliasedMyComponent} from './a';
                                    //     export {MyComponent} from './b';`
                                    //
                                    // /src/a.js:
                                    //     export class MyComponent {}
                                    //
                                    // /src/b.js:
                                    //     export class MyComponent {}
                                    //
                                    // //typings/entry_point.d.ts:
                                    //     export declare class aliasedMyComponent {}
                                    //     export declare class MyComponent {}
                                    //
                                    // In this case we would end up matching the `MyComponent` from `/src/a.js` to the
                                    // `MyComponent` declared in `/typings/entry_point.d.ts` even though that
                                    // declaration is actually for the `MyComponent` in `/src/b.js`.
                                    exportAliasDeclarations.set(declaration.node.name, exportedName);
                                }
                            }
                        }
                    });
                }
            });
            return Array.from(privateDeclarations.keys()).map(function (id) {
                var from = file_system_1.absoluteFromSourceFile(id.getSourceFile());
                var declaration = privateDeclarations.get(id);
                var alias = exportAliasDeclarations.has(id) ? exportAliasDeclarations.get(id) : null;
                var dtsDeclaration = _this.host.getDtsDeclaration(declaration.node);
                var dtsFrom = dtsDeclaration && file_system_1.absoluteFromSourceFile(dtsDeclaration.getSourceFile());
                return { identifier: id.text, from: from, dtsFrom: dtsFrom, alias: alias };
            });
        };
        return PrivateDeclarationsAnalyzer;
    }());
    exports.PrivateDeclarationsAnalyzer = PrivateDeclarationsAnalyzer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZV9kZWNsYXJhdGlvbnNfYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvYW5hbHlzaXMvcHJpdmF0ZV9kZWNsYXJhdGlvbnNfYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFTQSwyRUFBc0Y7SUFHdEYsOERBQXNEO0lBV3REOzs7T0FHRztJQUNIO1FBQ0UscUNBQ1ksSUFBd0IsRUFBVSxrQkFBMEM7WUFBNUUsU0FBSSxHQUFKLElBQUksQ0FBb0I7WUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXdCO1FBQUcsQ0FBQztRQUU1RixvREFBYyxHQUFkLFVBQWUsT0FBbUI7WUFDaEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUM3RixDQUFDO1FBRU8sa0RBQVksR0FBcEIsVUFBcUIsT0FBbUI7WUFDdEMsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFTLENBQUMsQ0FBQztRQUN6RixDQUFDO1FBRU8sNERBQXNCLEdBQTlCLFVBQ0ksU0FBMEIsRUFDMUIsWUFBNkM7WUFGakQsaUJBZ0VDO1lBN0RDLElBQU0sbUJBQW1CLEdBQW9DLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25GLElBQU0sdUJBQXVCLEdBQStCLElBQUksR0FBRyxFQUFFLENBQUM7WUFFdEUsU0FBUyxDQUFDLE9BQU8sQ0FB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OEVDO0lBOUVZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtOZ2NjUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvbmdjY19ob3N0JztcbmltcG9ydCB7aGFzTmFtZUlkZW50aWZpZXIsIGlzRGVmaW5lZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtOZ2NjUmVmZXJlbmNlc1JlZ2lzdHJ5fSBmcm9tICcuL25nY2NfcmVmZXJlbmNlc19yZWdpc3RyeSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0SW5mbyB7XG4gIGlkZW50aWZpZXI6IHN0cmluZztcbiAgZnJvbTogQWJzb2x1dGVGc1BhdGg7XG4gIGR0c0Zyb20/OiBBYnNvbHV0ZUZzUGF0aHxudWxsO1xuICBhbGlhcz86IHN0cmluZ3xudWxsO1xufVxuZXhwb3J0IHR5cGUgUHJpdmF0ZURlY2xhcmF0aW9uc0FuYWx5c2VzID0gRXhwb3J0SW5mb1tdO1xuXG4vKipcbiAqIFRoaXMgY2xhc3Mgd2lsbCBhbmFseXplIGEgcHJvZ3JhbSB0byBmaW5kIGFsbCB0aGUgZGVjbGFyZWQgY2xhc3Nlc1xuICogKGkuZS4gb24gYW4gTmdNb2R1bGUpIHRoYXQgYXJlIG5vdCBwdWJsaWNseSBleHBvcnRlZCB2aWEgYW4gZW50cnktcG9pbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBQcml2YXRlRGVjbGFyYXRpb25zQW5hbHl6ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaG9zdDogTmdjY1JlZmxlY3Rpb25Ib3N0LCBwcml2YXRlIHJlZmVyZW5jZXNSZWdpc3RyeTogTmdjY1JlZmVyZW5jZXNSZWdpc3RyeSkge31cblxuICBhbmFseXplUHJvZ3JhbShwcm9ncmFtOiB0cy5Qcm9ncmFtKTogUHJpdmF0ZURlY2xhcmF0aW9uc0FuYWx5c2VzIHtcbiAgICBjb25zdCByb290RmlsZXMgPSB0aGlzLmdldFJvb3RGaWxlcyhwcm9ncmFtKTtcbiAgICByZXR1cm4gdGhpcy5nZXRQcml2YXRlRGVjbGFyYXRpb25zKHJvb3RGaWxlcywgdGhpcy5yZWZlcmVuY2VzUmVnaXN0cnkuZ2V0RGVjbGFyYXRpb25NYXAoKSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJvb3RGaWxlcyhwcm9ncmFtOiB0cy5Qcm9ncmFtKTogdHMuU291cmNlRmlsZVtdIHtcbiAgICByZXR1cm4gcHJvZ3JhbS5nZXRSb290RmlsZU5hbWVzKCkubWFwKGYgPT4gcHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGYpKS5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHJpdmF0ZURlY2xhcmF0aW9ucyhcbiAgICAgIHJvb3RGaWxlczogdHMuU291cmNlRmlsZVtdLFxuICAgICAgZGVjbGFyYXRpb25zOiBNYXA8dHMuSWRlbnRpZmllciwgRGVjbGFyYXRpb24+KTogUHJpdmF0ZURlY2xhcmF0aW9uc0FuYWx5c2VzIHtcbiAgICBjb25zdCBwcml2YXRlRGVjbGFyYXRpb25zOiBNYXA8dHMuSWRlbnRpZmllciwgRGVjbGFyYXRpb24+ID0gbmV3IE1hcChkZWNsYXJhdGlvbnMpO1xuICAgIGNvbnN0IGV4cG9ydEFsaWFzRGVjbGFyYXRpb25zOiBNYXA8dHMuSWRlbnRpZmllciwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIHJvb3RGaWxlcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgY29uc3QgZXhwb3J0cyA9IHRoaXMuaG9zdC5nZXRFeHBvcnRzT2ZNb2R1bGUoZik7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBleHBvcnRzLmZvckVhY2goKGRlY2xhcmF0aW9uLCBleHBvcnRlZE5hbWUpID0+IHtcbiAgICAgICAgICBpZiAoaGFzTmFtZUlkZW50aWZpZXIoZGVjbGFyYXRpb24ubm9kZSkpIHtcbiAgICAgICAgICAgIGlmIChwcml2YXRlRGVjbGFyYXRpb25zLmhhcyhkZWNsYXJhdGlvbi5ub2RlLm5hbWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHByaXZhdGVEZWNsYXJhdGlvbiA9IHByaXZhdGVEZWNsYXJhdGlvbnMuZ2V0KGRlY2xhcmF0aW9uLm5vZGUubmFtZSkgITtcbiAgICAgICAgICAgICAgaWYgKHByaXZhdGVEZWNsYXJhdGlvbi5ub2RlICE9PSBkZWNsYXJhdGlvbi5ub2RlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2RlY2xhcmF0aW9uLm5vZGUubmFtZS50ZXh0fSBpcyBkZWNsYXJlZCBtdWx0aXBsZSB0aW1lcy5gKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChkZWNsYXJhdGlvbi5ub2RlLm5hbWUudGV4dCA9PT0gZXhwb3J0ZWROYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBkZWNsYXJhdGlvbiBpcyBwdWJsaWMgc28gd2UgY2FuIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgcHJpdmF0ZURlY2xhcmF0aW9ucy5kZWxldGUoZGVjbGFyYXRpb24ubm9kZS5uYW1lKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5ob3N0LmdldER0c0RlY2xhcmF0aW9uKGRlY2xhcmF0aW9uLm5vZGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIHJlZmVyZW5jZWQgZGVjbGFyYXRpb24gaXMgZXhwb3J0ZWQgcHVibGljbHkgYnV0IHZpYSBhbiBhbGlhcy5cbiAgICAgICAgICAgICAgICAvLyBJbiBzb21lIGNhc2VzIHRoZSBvcmlnaW5hbCBkZWNsYXJhdGlvbiBpcyBtaXNzaW5nIGZyb20gdGhlIGR0cyBwcm9ncmFtLCBzdWNoIGFzXG4gICAgICAgICAgICAgICAgLy8gd2hlbiByb2xsaW5nIHVwIChmbGF0dGVuaW5nKSB0aGUgZHRzIGZpbGVzLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGUgb3JpZ2luYWwgZGVjbGFyYXRpb24gZ2V0cyByZW5hbWVkIHRvIHRoZSBleHBvcnRlZCBhbGlhcy5cblxuICAgICAgICAgICAgICAgIC8vIFRoZXJlIGlzIGEgY29uc3RyYWludCBvbiB0aGlzIHdoaWNoIHdlIGNhbm5vdCBoYW5kbGUuIENvbnNpZGVyIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAvLyBjb2RlOlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gL3NyYy9lbnRyeV9wb2ludC5qczpcbiAgICAgICAgICAgICAgICAvLyAgICAgZXhwb3J0IHtNeUNvbXBvbmVudCBhcyBhbGlhc2VkTXlDb21wb25lbnR9IGZyb20gJy4vYSc7XG4gICAgICAgICAgICAgICAgLy8gICAgIGV4cG9ydCB7TXlDb21wb25lbnR9IGZyb20gJy4vYic7YFxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gL3NyYy9hLmpzOlxuICAgICAgICAgICAgICAgIC8vICAgICBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQge31cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIC9zcmMvYi5qczpcbiAgICAgICAgICAgICAgICAvLyAgICAgZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IHt9XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyAvL3R5cGluZ3MvZW50cnlfcG9pbnQuZC50czpcbiAgICAgICAgICAgICAgICAvLyAgICAgZXhwb3J0IGRlY2xhcmUgY2xhc3MgYWxpYXNlZE15Q29tcG9uZW50IHt9XG4gICAgICAgICAgICAgICAgLy8gICAgIGV4cG9ydCBkZWNsYXJlIGNsYXNzIE15Q29tcG9uZW50IHt9XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBJbiB0aGlzIGNhc2Ugd2Ugd291bGQgZW5kIHVwIG1hdGNoaW5nIHRoZSBgTXlDb21wb25lbnRgIGZyb20gYC9zcmMvYS5qc2AgdG8gdGhlXG4gICAgICAgICAgICAgICAgLy8gYE15Q29tcG9uZW50YCBkZWNsYXJlZCBpbiBgL3R5cGluZ3MvZW50cnlfcG9pbnQuZC50c2AgZXZlbiB0aG91Z2ggdGhhdFxuICAgICAgICAgICAgICAgIC8vIGRlY2xhcmF0aW9uIGlzIGFjdHVhbGx5IGZvciB0aGUgYE15Q29tcG9uZW50YCBpbiBgL3NyYy9iLmpzYC5cblxuICAgICAgICAgICAgICAgIGV4cG9ydEFsaWFzRGVjbGFyYXRpb25zLnNldChkZWNsYXJhdGlvbi5ub2RlLm5hbWUsIGV4cG9ydGVkTmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20ocHJpdmF0ZURlY2xhcmF0aW9ucy5rZXlzKCkpLm1hcChpZCA9PiB7XG4gICAgICBjb25zdCBmcm9tID0gYWJzb2x1dGVGcm9tU291cmNlRmlsZShpZC5nZXRTb3VyY2VGaWxlKCkpO1xuICAgICAgY29uc3QgZGVjbGFyYXRpb24gPSBwcml2YXRlRGVjbGFyYXRpb25zLmdldChpZCkgITtcbiAgICAgIGNvbnN0IGFsaWFzID0gZXhwb3J0QWxpYXNEZWNsYXJhdGlvbnMuaGFzKGlkKSA/IGV4cG9ydEFsaWFzRGVjbGFyYXRpb25zLmdldChpZCkgISA6IG51bGw7XG4gICAgICBjb25zdCBkdHNEZWNsYXJhdGlvbiA9IHRoaXMuaG9zdC5nZXREdHNEZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5ub2RlKTtcbiAgICAgIGNvbnN0IGR0c0Zyb20gPSBkdHNEZWNsYXJhdGlvbiAmJiBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKGR0c0RlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG5cbiAgICAgIHJldHVybiB7aWRlbnRpZmllcjogaWQudGV4dCwgZnJvbSwgZHRzRnJvbSwgYWxpYXN9O1xuICAgIH0pO1xuICB9XG59XG4iXX0=
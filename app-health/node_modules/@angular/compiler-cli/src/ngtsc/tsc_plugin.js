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
        define("@angular/compiler-cli/src/ngtsc/tsc_plugin", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/synthetic_files_compiler_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var synthetic_files_compiler_host_1 = require("@angular/compiler-cli/src/ngtsc/synthetic_files_compiler_host");
    // Copied from tsc_wrapped/plugin_api.ts to avoid a runtime dependency on the
    // @bazel/typescript package - it would be strange for non-Bazel users of
    // Angular to fetch that package.
    function createProxy(delegate) {
        var e_1, _a;
        var proxy = Object.create(null);
        var _loop_1 = function (k) {
            proxy[k] = function () { return delegate[k].apply(delegate, arguments); };
        };
        try {
            for (var _b = tslib_1.__values(Object.keys(delegate)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                _loop_1(k);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return proxy;
    }
    var NgTscPlugin = /** @class */ (function () {
        function NgTscPlugin(angularCompilerOptions) {
            this.angularCompilerOptions = angularCompilerOptions;
        }
        NgTscPlugin.prototype.wrapHost = function (inputFiles, compilerHost) {
            return new synthetic_files_compiler_host_1.SyntheticFilesCompilerHost(inputFiles, compilerHost, function (rootFiles) {
                // For demo purposes, assume that the first .ts rootFile is the only
                // one that needs ngfactory.js/d.ts back-compat files produced.
                var tsInputs = rootFiles.filter(function (f) { return f.endsWith('.ts') && !f.endsWith('.d.ts'); });
                var factoryPath = tsInputs[0].replace(/\.ts/, '.ngfactory.ts');
                return {
                    factoryPath: function (host) {
                        return ts.createSourceFile(factoryPath, 'contents', ts.ScriptTarget.ES5);
                    },
                };
            });
        };
        NgTscPlugin.prototype.wrap = function (program, config, host) {
            var proxy = createProxy(program);
            proxy.getSemanticDiagnostics = function (sourceFile) {
                var result = tslib_1.__spread(program.getSemanticDiagnostics(sourceFile));
                // For demo purposes, trigger a diagnostic when the sourcefile has a magic string
                if (sourceFile.text.indexOf('diag') >= 0) {
                    var fake = {
                        file: sourceFile,
                        start: 0,
                        length: 3,
                        messageText: 'Example Angular Compiler Diagnostic',
                        category: ts.DiagnosticCategory.Error,
                        code: 12345,
                        // source is the name of the plugin.
                        source: 'ngtsc',
                    };
                    result.push(fake);
                }
                return result;
            };
            return proxy;
        };
        NgTscPlugin.prototype.createTransformers = function (host) {
            var afterDeclarations = [function (context) { return function (sf) {
                    var visitor = function (node) {
                        if (ts.isClassDeclaration(node)) {
                            // For demo purposes, transform the class name in the .d.ts output
                            return ts.updateClassDeclaration(node, node.decorators, node.modifiers, ts.createIdentifier('NEWNAME'), node.typeParameters, node.heritageClauses, node.members);
                        }
                        return ts.visitEachChild(node, visitor, context);
                    };
                    return visitor(sf);
                }; }];
            return { afterDeclarations: afterDeclarations };
        };
        return NgTscPlugin;
    }());
    exports.NgTscPlugin = NgTscPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjX3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHNjX3BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFHSCwrQkFBaUM7SUFFakMsK0dBQTJFO0lBRTNFLDZFQUE2RTtJQUM3RSx5RUFBeUU7SUFDekUsaUNBQWlDO0lBQ2pDLFNBQVMsV0FBVyxDQUFJLFFBQVc7O1FBQ2pDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ3ZCLENBQUM7WUFDVixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYSxPQUFRLFFBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1lBRHBGLEtBQWdCLElBQUEsS0FBQSxpQkFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBLGdCQUFBO2dCQUFoQyxJQUFNLENBQUMsV0FBQTt3QkFBRCxDQUFDO2FBRVg7Ozs7Ozs7OztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEO1FBQ0UscUJBQW9CLHNCQUErQjtZQUEvQiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQVM7UUFBRyxDQUFDO1FBRXZELDhCQUFRLEdBQVIsVUFBUyxVQUFvQixFQUFFLFlBQTZCO1lBQzFELE9BQU8sSUFBSSwwREFBMEIsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFVBQUMsU0FBbUI7Z0JBQ2xGLG9FQUFvRTtnQkFDcEUsK0RBQStEO2dCQUMvRCxJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQXpDLENBQXlDLENBQUMsQ0FBQztnQkFDbEYsSUFBTSxXQUFXLEdBQVcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRXpFLE9BQU87b0JBQ0wsV0FBVyxFQUFFLFVBQUMsSUFBcUI7d0JBQ2xCLE9BQUEsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7b0JBQWpFLENBQWlFO2lCQUNuRixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsMEJBQUksR0FBSixVQUFLLE9BQW1CLEVBQUUsTUFBVSxFQUFFLElBQXFCO1lBQ3pELElBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxLQUFLLENBQUMsc0JBQXNCLEdBQUcsVUFBQyxVQUF5QjtnQkFDdkQsSUFBTSxNQUFNLG9CQUF3QixPQUFPLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFFaEYsaUZBQWlGO2dCQUNqRixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDeEMsSUFBTSxJQUFJLEdBQWtCO3dCQUMxQixJQUFJLEVBQUUsVUFBVTt3QkFDaEIsS0FBSyxFQUFFLENBQUM7d0JBQ1IsTUFBTSxFQUFFLENBQUM7d0JBQ1QsV0FBVyxFQUFFLHFDQUFxQzt3QkFDbEQsUUFBUSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO3dCQUNyQyxJQUFJLEVBQUUsS0FBSzt3QkFDWCxvQ0FBb0M7d0JBQ3BDLE1BQU0sRUFBRSxPQUFPO3FCQUNoQixDQUFDO29CQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ25CO2dCQUNELE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQztZQUNGLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELHdDQUFrQixHQUFsQixVQUFtQixJQUF3QjtZQUN6QyxJQUFNLGlCQUFpQixHQUNuQixDQUFDLFVBQUMsT0FBaUMsSUFBSyxPQUFBLFVBQUMsRUFBNkI7b0JBQ3BFLElBQU0sT0FBTyxHQUFHLFVBQUMsSUFBYTt3QkFDNUIsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQy9CLGtFQUFrRTs0QkFDbEUsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUNyRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUM5RDt3QkFDRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDO29CQUNGLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBa0IsQ0FBQztnQkFDdEMsQ0FBQyxFQVh1QyxDQVd2QyxDQUFDLENBQUM7WUFDUCxPQUFPLEVBQUMsaUJBQWlCLG1CQUFBLEVBQUMsQ0FBQztRQUM3QixDQUFDO1FBQ0gsa0JBQUM7SUFBRCxDQUFDLEFBekRELElBeURDO0lBekRZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsdWdpbkNvbXBpbGVySG9zdCwgVHNjUGx1Z2lufSBmcm9tICdAYmF6ZWwvdHlwZXNjcmlwdC9pbnRlcm5hbC90c2Nfd3JhcHBlZC9wbHVnaW5fYXBpJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1N5bnRoZXRpY0ZpbGVzQ29tcGlsZXJIb3N0fSBmcm9tICcuL3N5bnRoZXRpY19maWxlc19jb21waWxlcl9ob3N0JztcblxuLy8gQ29waWVkIGZyb20gdHNjX3dyYXBwZWQvcGx1Z2luX2FwaS50cyB0byBhdm9pZCBhIHJ1bnRpbWUgZGVwZW5kZW5jeSBvbiB0aGVcbi8vIEBiYXplbC90eXBlc2NyaXB0IHBhY2thZ2UgLSBpdCB3b3VsZCBiZSBzdHJhbmdlIGZvciBub24tQmF6ZWwgdXNlcnMgb2Zcbi8vIEFuZ3VsYXIgdG8gZmV0Y2ggdGhhdCBwYWNrYWdlLlxuZnVuY3Rpb24gY3JlYXRlUHJveHk8VD4oZGVsZWdhdGU6IFQpOiBUIHtcbiAgY29uc3QgcHJveHkgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoZGVsZWdhdGUpKSB7XG4gICAgcHJveHlba10gPSBmdW5jdGlvbigpIHsgcmV0dXJuIChkZWxlZ2F0ZSBhcyBhbnkpW2tdLmFwcGx5KGRlbGVnYXRlLCBhcmd1bWVudHMpOyB9O1xuICB9XG4gIHJldHVybiBwcm94eTtcbn1cblxuZXhwb3J0IGNsYXNzIE5nVHNjUGx1Z2luIGltcGxlbWVudHMgVHNjUGx1Z2luIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhbmd1bGFyQ29tcGlsZXJPcHRpb25zOiB1bmtub3duKSB7fVxuXG4gIHdyYXBIb3N0KGlucHV0RmlsZXM6IHN0cmluZ1tdLCBjb21waWxlckhvc3Q6IHRzLkNvbXBpbGVySG9zdCkge1xuICAgIHJldHVybiBuZXcgU3ludGhldGljRmlsZXNDb21waWxlckhvc3QoaW5wdXRGaWxlcywgY29tcGlsZXJIb3N0LCAocm9vdEZpbGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgLy8gRm9yIGRlbW8gcHVycG9zZXMsIGFzc3VtZSB0aGF0IHRoZSBmaXJzdCAudHMgcm9vdEZpbGUgaXMgdGhlIG9ubHlcbiAgICAgIC8vIG9uZSB0aGF0IG5lZWRzIG5nZmFjdG9yeS5qcy9kLnRzIGJhY2stY29tcGF0IGZpbGVzIHByb2R1Y2VkLlxuICAgICAgY29uc3QgdHNJbnB1dHMgPSByb290RmlsZXMuZmlsdGVyKGYgPT4gZi5lbmRzV2l0aCgnLnRzJykgJiYgIWYuZW5kc1dpdGgoJy5kLnRzJykpO1xuICAgICAgY29uc3QgZmFjdG9yeVBhdGg6IHN0cmluZyA9IHRzSW5wdXRzWzBdLnJlcGxhY2UoL1xcLnRzLywgJy5uZ2ZhY3RvcnkudHMnKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmFjdG9yeVBhdGg6IChob3N0OiB0cy5Db21waWxlckhvc3QpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgdHMuY3JlYXRlU291cmNlRmlsZShmYWN0b3J5UGF0aCwgJ2NvbnRlbnRzJywgdHMuU2NyaXB0VGFyZ2V0LkVTNSksXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgd3JhcChwcm9ncmFtOiB0cy5Qcm9ncmFtLCBjb25maWc6IHt9LCBob3N0OiB0cy5Db21waWxlckhvc3QpIHtcbiAgICBjb25zdCBwcm94eSA9IGNyZWF0ZVByb3h5KHByb2dyYW0pO1xuICAgIHByb3h5LmdldFNlbWFudGljRGlhZ25vc3RpY3MgPSAoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0OiB0cy5EaWFnbm9zdGljW10gPSBbLi4ucHJvZ3JhbS5nZXRTZW1hbnRpY0RpYWdub3N0aWNzKHNvdXJjZUZpbGUpXTtcblxuICAgICAgLy8gRm9yIGRlbW8gcHVycG9zZXMsIHRyaWdnZXIgYSBkaWFnbm9zdGljIHdoZW4gdGhlIHNvdXJjZWZpbGUgaGFzIGEgbWFnaWMgc3RyaW5nXG4gICAgICBpZiAoc291cmNlRmlsZS50ZXh0LmluZGV4T2YoJ2RpYWcnKSA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGZha2U6IHRzLkRpYWdub3N0aWMgPSB7XG4gICAgICAgICAgZmlsZTogc291cmNlRmlsZSxcbiAgICAgICAgICBzdGFydDogMCxcbiAgICAgICAgICBsZW5ndGg6IDMsXG4gICAgICAgICAgbWVzc2FnZVRleHQ6ICdFeGFtcGxlIEFuZ3VsYXIgQ29tcGlsZXIgRGlhZ25vc3RpYycsXG4gICAgICAgICAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcixcbiAgICAgICAgICBjb2RlOiAxMjM0NSxcbiAgICAgICAgICAvLyBzb3VyY2UgaXMgdGhlIG5hbWUgb2YgdGhlIHBsdWdpbi5cbiAgICAgICAgICBzb3VyY2U6ICduZ3RzYycsXG4gICAgICAgIH07XG4gICAgICAgIHJlc3VsdC5wdXNoKGZha2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIGNyZWF0ZVRyYW5zZm9ybWVycyhob3N0OiBQbHVnaW5Db21waWxlckhvc3QpIHtcbiAgICBjb25zdCBhZnRlckRlY2xhcmF0aW9uczogQXJyYXk8dHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGV8dHMuQnVuZGxlPj4gPVxuICAgICAgICBbKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCkgPT4gKHNmOiB0cy5Tb3VyY2VGaWxlIHwgdHMuQnVuZGxlKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmlzaXRvciA9IChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSA9PiB7XG4gICAgICAgICAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgIC8vIEZvciBkZW1vIHB1cnBvc2VzLCB0cmFuc2Zvcm0gdGhlIGNsYXNzIG5hbWUgaW4gdGhlIC5kLnRzIG91dHB1dFxuICAgICAgICAgICAgICByZXR1cm4gdHMudXBkYXRlQ2xhc3NEZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICAgIG5vZGUsIG5vZGUuZGVjb3JhdG9ycywgbm9kZS5tb2RpZmllcnMsIHRzLmNyZWF0ZUlkZW50aWZpZXIoJ05FV05BTUUnKSxcbiAgICAgICAgICAgICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMsIG5vZGUuaGVyaXRhZ2VDbGF1c2VzLCBub2RlLm1lbWJlcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHZpc2l0b3Ioc2YpIGFzIHRzLlNvdXJjZUZpbGU7XG4gICAgICAgIH1dO1xuICAgIHJldHVybiB7YWZ0ZXJEZWNsYXJhdGlvbnN9O1xuICB9XG59XG4iXX0=
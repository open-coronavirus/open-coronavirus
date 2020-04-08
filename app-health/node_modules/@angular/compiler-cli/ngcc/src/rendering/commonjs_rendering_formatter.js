(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/commonjs_rendering_formatter", ["require", "exports", "tslib", "canonical-path", "typescript", "@angular/compiler-cli/ngcc/src/host/commonjs_host", "@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter", "@angular/compiler-cli/ngcc/src/rendering/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var canonical_path_1 = require("canonical-path");
    var ts = require("typescript");
    var commonjs_host_1 = require("@angular/compiler-cli/ngcc/src/host/commonjs_host");
    var esm5_rendering_formatter_1 = require("@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/rendering/utils");
    /**
     * A RenderingFormatter that works with CommonJS files, instead of `import` and `export` statements
     * the module is an IIFE with a factory function call with dependencies, which are defined in a
     * wrapper function for AMD, CommonJS and global module formats.
     */
    var CommonJsRenderingFormatter = /** @class */ (function (_super) {
        tslib_1.__extends(CommonJsRenderingFormatter, _super);
        function CommonJsRenderingFormatter(commonJsHost, isCore) {
            var _this = _super.call(this, commonJsHost, isCore) || this;
            _this.commonJsHost = commonJsHost;
            return _this;
        }
        /**
         *  Add the imports below any in situ imports as `require` calls.
         */
        CommonJsRenderingFormatter.prototype.addImports = function (output, imports, file) {
            var insertionPoint = this.findEndOfImports(file);
            var renderedImports = imports.map(function (i) { return "var " + i.qualifier + " = require('" + i.specifier + "');\n"; }).join('');
            output.appendLeft(insertionPoint, renderedImports);
        };
        /**
         * Add the exports to the bottom of the file.
         */
        CommonJsRenderingFormatter.prototype.addExports = function (output, entryPointBasePath, exports, importManager, file) {
            exports.forEach(function (e) {
                var basePath = utils_1.stripExtension(e.from);
                var relativePath = './' + canonical_path_1.relative(canonical_path_1.dirname(entryPointBasePath), basePath);
                var namedImport = entryPointBasePath !== basePath ?
                    importManager.generateNamedImport(relativePath, e.identifier) :
                    { symbol: e.identifier, moduleImport: null };
                var importNamespace = namedImport.moduleImport ? namedImport.moduleImport + "." : '';
                var exportStr = "\nexports." + e.identifier + " = " + importNamespace + namedImport.symbol + ";";
                output.append(exportStr);
            });
        };
        CommonJsRenderingFormatter.prototype.findEndOfImports = function (sf) {
            var e_1, _a;
            try {
                for (var _b = tslib_1.__values(sf.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var statement = _c.value;
                    if (ts.isExpressionStatement(statement) && commonjs_host_1.isRequireCall(statement.expression)) {
                        continue;
                    }
                    var declarations = ts.isVariableStatement(statement) ?
                        Array.from(statement.declarationList.declarations) :
                        [];
                    if (declarations.some(function (d) { return !d.initializer || !commonjs_host_1.isRequireCall(d.initializer); })) {
                        return statement.getStart();
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return 0;
        };
        return CommonJsRenderingFormatter;
    }(esm5_rendering_formatter_1.Esm5RenderingFormatter));
    exports.CommonJsRenderingFormatter = CommonJsRenderingFormatter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanNfcmVuZGVyaW5nX2Zvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9yZW5kZXJpbmcvY29tbW9uanNfcmVuZGVyaW5nX2Zvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCxpREFBaUQ7SUFDakQsK0JBQWlDO0lBSWpDLG1GQUFvRDtJQUVwRCw4R0FBa0U7SUFDbEUsd0VBQXVDO0lBRXZDOzs7O09BSUc7SUFDSDtRQUFnRCxzREFBc0I7UUFDcEUsb0NBQXNCLFlBQWdDLEVBQUUsTUFBZTtZQUF2RSxZQUNFLGtCQUFNLFlBQVksRUFBRSxNQUFNLENBQUMsU0FDNUI7WUFGcUIsa0JBQVksR0FBWixZQUFZLENBQW9COztRQUV0RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCwrQ0FBVSxHQUFWLFVBQVcsTUFBbUIsRUFBRSxPQUFpQixFQUFFLElBQW1CO1lBQ3BFLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxJQUFNLGVBQWUsR0FDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFNBQU8sQ0FBQyxDQUFDLFNBQVMsb0JBQWUsQ0FBQyxDQUFDLFNBQVMsVUFBTyxFQUFuRCxDQUFtRCxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25GLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFFRDs7V0FFRztRQUNILCtDQUFVLEdBQVYsVUFDSSxNQUFtQixFQUFFLGtCQUEwQixFQUFFLE9BQXFCLEVBQ3RFLGFBQTRCLEVBQUUsSUFBbUI7WUFDbkQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7Z0JBQ2YsSUFBTSxRQUFRLEdBQUcsc0JBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sWUFBWSxHQUFHLElBQUksR0FBRyx5QkFBUSxDQUFDLHdCQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDNUUsSUFBTSxXQUFXLEdBQUcsa0JBQWtCLEtBQUssUUFBUSxDQUFDLENBQUM7b0JBQ2pELGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQy9ELEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUMvQyxJQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBSSxXQUFXLENBQUMsWUFBWSxNQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDdkYsSUFBTSxTQUFTLEdBQUcsZUFBYSxDQUFDLENBQUMsVUFBVSxXQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsTUFBTSxNQUFHLENBQUM7Z0JBQ3pGLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRVMscURBQWdCLEdBQTFCLFVBQTJCLEVBQWlCOzs7Z0JBQzFDLEtBQXdCLElBQUEsS0FBQSxpQkFBQSxFQUFFLENBQUMsVUFBVSxDQUFBLGdCQUFBLDRCQUFFO29CQUFsQyxJQUFNLFNBQVMsV0FBQTtvQkFDbEIsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksNkJBQWEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7d0JBQzlFLFNBQVM7cUJBQ1Y7b0JBQ0QsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNwRCxFQUFFLENBQUM7b0JBQ1AsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsNkJBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQS9DLENBQStDLENBQUMsRUFBRTt3QkFDM0UsT0FBTyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQzdCO2lCQUNGOzs7Ozs7Ozs7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNYLENBQUM7UUFDSCxpQ0FBQztJQUFELENBQUMsQUEvQ0QsQ0FBZ0QsaURBQXNCLEdBK0NyRTtJQS9DWSxnRUFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Rpcm5hbWUsIHJlbGF0aXZlfSBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuaW1wb3J0IHtJbXBvcnQsIEltcG9ydE1hbmFnZXJ9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy90cmFuc2xhdG9yJztcbmltcG9ydCB7RXhwb3J0SW5mb30gZnJvbSAnLi4vYW5hbHlzaXMvcHJpdmF0ZV9kZWNsYXJhdGlvbnNfYW5hbHl6ZXInO1xuaW1wb3J0IHtpc1JlcXVpcmVDYWxsfSBmcm9tICcuLi9ob3N0L2NvbW1vbmpzX2hvc3QnO1xuaW1wb3J0IHtOZ2NjUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvbmdjY19ob3N0JztcbmltcG9ydCB7RXNtNVJlbmRlcmluZ0Zvcm1hdHRlcn0gZnJvbSAnLi9lc201X3JlbmRlcmluZ19mb3JtYXR0ZXInO1xuaW1wb3J0IHtzdHJpcEV4dGVuc2lvbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogQSBSZW5kZXJpbmdGb3JtYXR0ZXIgdGhhdCB3b3JrcyB3aXRoIENvbW1vbkpTIGZpbGVzLCBpbnN0ZWFkIG9mIGBpbXBvcnRgIGFuZCBgZXhwb3J0YCBzdGF0ZW1lbnRzXG4gKiB0aGUgbW9kdWxlIGlzIGFuIElJRkUgd2l0aCBhIGZhY3RvcnkgZnVuY3Rpb24gY2FsbCB3aXRoIGRlcGVuZGVuY2llcywgd2hpY2ggYXJlIGRlZmluZWQgaW4gYVxuICogd3JhcHBlciBmdW5jdGlvbiBmb3IgQU1ELCBDb21tb25KUyBhbmQgZ2xvYmFsIG1vZHVsZSBmb3JtYXRzLlxuICovXG5leHBvcnQgY2xhc3MgQ29tbW9uSnNSZW5kZXJpbmdGb3JtYXR0ZXIgZXh0ZW5kcyBFc201UmVuZGVyaW5nRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNvbW1vbkpzSG9zdDogTmdjY1JlZmxlY3Rpb25Ib3N0LCBpc0NvcmU6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihjb21tb25Kc0hvc3QsIGlzQ29yZSk7XG4gIH1cblxuICAvKipcbiAgICogIEFkZCB0aGUgaW1wb3J0cyBiZWxvdyBhbnkgaW4gc2l0dSBpbXBvcnRzIGFzIGByZXF1aXJlYCBjYWxscy5cbiAgICovXG4gIGFkZEltcG9ydHMob3V0cHV0OiBNYWdpY1N0cmluZywgaW1wb3J0czogSW1wb3J0W10sIGZpbGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCBpbnNlcnRpb25Qb2ludCA9IHRoaXMuZmluZEVuZE9mSW1wb3J0cyhmaWxlKTtcbiAgICBjb25zdCByZW5kZXJlZEltcG9ydHMgPVxuICAgICAgICBpbXBvcnRzLm1hcChpID0+IGB2YXIgJHtpLnF1YWxpZmllcn0gPSByZXF1aXJlKCcke2kuc3BlY2lmaWVyfScpO1xcbmApLmpvaW4oJycpO1xuICAgIG91dHB1dC5hcHBlbmRMZWZ0KGluc2VydGlvblBvaW50LCByZW5kZXJlZEltcG9ydHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZXhwb3J0cyB0byB0aGUgYm90dG9tIG9mIHRoZSBmaWxlLlxuICAgKi9cbiAgYWRkRXhwb3J0cyhcbiAgICAgIG91dHB1dDogTWFnaWNTdHJpbmcsIGVudHJ5UG9pbnRCYXNlUGF0aDogc3RyaW5nLCBleHBvcnRzOiBFeHBvcnRJbmZvW10sXG4gICAgICBpbXBvcnRNYW5hZ2VyOiBJbXBvcnRNYW5hZ2VyLCBmaWxlOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7XG4gICAgZXhwb3J0cy5mb3JFYWNoKGUgPT4ge1xuICAgICAgY29uc3QgYmFzZVBhdGggPSBzdHJpcEV4dGVuc2lvbihlLmZyb20pO1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gJy4vJyArIHJlbGF0aXZlKGRpcm5hbWUoZW50cnlQb2ludEJhc2VQYXRoKSwgYmFzZVBhdGgpO1xuICAgICAgY29uc3QgbmFtZWRJbXBvcnQgPSBlbnRyeVBvaW50QmFzZVBhdGggIT09IGJhc2VQYXRoID9cbiAgICAgICAgICBpbXBvcnRNYW5hZ2VyLmdlbmVyYXRlTmFtZWRJbXBvcnQocmVsYXRpdmVQYXRoLCBlLmlkZW50aWZpZXIpIDpcbiAgICAgICAgICB7c3ltYm9sOiBlLmlkZW50aWZpZXIsIG1vZHVsZUltcG9ydDogbnVsbH07XG4gICAgICBjb25zdCBpbXBvcnROYW1lc3BhY2UgPSBuYW1lZEltcG9ydC5tb2R1bGVJbXBvcnQgPyBgJHtuYW1lZEltcG9ydC5tb2R1bGVJbXBvcnR9LmAgOiAnJztcbiAgICAgIGNvbnN0IGV4cG9ydFN0ciA9IGBcXG5leHBvcnRzLiR7ZS5pZGVudGlmaWVyfSA9ICR7aW1wb3J0TmFtZXNwYWNlfSR7bmFtZWRJbXBvcnQuc3ltYm9sfTtgO1xuICAgICAgb3V0cHV0LmFwcGVuZChleHBvcnRTdHIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZpbmRFbmRPZkltcG9ydHMoc2Y6IHRzLlNvdXJjZUZpbGUpOiBudW1iZXIge1xuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHNmLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICh0cy5pc0V4cHJlc3Npb25TdGF0ZW1lbnQoc3RhdGVtZW50KSAmJiBpc1JlcXVpcmVDYWxsKHN0YXRlbWVudC5leHByZXNzaW9uKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRlY2xhcmF0aW9ucyA9IHRzLmlzVmFyaWFibGVTdGF0ZW1lbnQoc3RhdGVtZW50KSA/XG4gICAgICAgICAgQXJyYXkuZnJvbShzdGF0ZW1lbnQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucykgOlxuICAgICAgICAgIFtdO1xuICAgICAgaWYgKGRlY2xhcmF0aW9ucy5zb21lKGQgPT4gIWQuaW5pdGlhbGl6ZXIgfHwgIWlzUmVxdWlyZUNhbGwoZC5pbml0aWFsaXplcikpKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZW1lbnQuZ2V0U3RhcnQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiJdfQ==
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
        define("@angular/compiler-cli/ngcc/src/analysis/ngcc_references_registry", ["require", "exports", "@angular/compiler-cli/ngcc/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    /**
     * This is a place for DecoratorHandlers to register references that they
     * find in their analysis of the code.
     *
     * This registry is used to ensure that these references are publicly exported
     * from libraries that are compiled by ngcc.
     */
    var NgccReferencesRegistry = /** @class */ (function () {
        function NgccReferencesRegistry(host) {
            this.host = host;
            this.map = new Map();
        }
        /**
         * Register one or more references in the registry.
         * Only `ResolveReference` references are stored. Other types are ignored.
         * @param references A collection of references to register.
         */
        NgccReferencesRegistry.prototype.add = function (source) {
            var _this = this;
            var references = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                references[_i - 1] = arguments[_i];
            }
            references.forEach(function (ref) {
                // Only store relative references. We are not interested in literals.
                if (ref.bestGuessOwningModule === null && utils_1.hasNameIdentifier(ref.node)) {
                    var declaration = _this.host.getDeclarationOfIdentifier(ref.node.name);
                    if (declaration && utils_1.hasNameIdentifier(declaration.node)) {
                        _this.map.set(declaration.node.name, declaration);
                    }
                }
            });
        };
        /**
         * Create and return a mapping for the registered resolved references.
         * @returns A map of reference identifiers to reference declarations.
         */
        NgccReferencesRegistry.prototype.getDeclarationMap = function () { return this.map; };
        return NgccReferencesRegistry;
    }());
    exports.NgccReferencesRegistry = NgccReferencesRegistry;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdjY19yZWZlcmVuY2VzX3JlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2FuYWx5c2lzL25nY2NfcmVmZXJlbmNlc19yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQU1ILDhEQUEyQztJQUUzQzs7Ozs7O09BTUc7SUFDSDtRQUdFLGdDQUFvQixJQUFvQjtZQUFwQixTQUFJLEdBQUosSUFBSSxDQUFnQjtZQUZoQyxRQUFHLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFFVCxDQUFDO1FBRTVDOzs7O1dBSUc7UUFDSCxvQ0FBRyxHQUFILFVBQUksTUFBc0I7WUFBMUIsaUJBVUM7WUFWMkIsb0JBQTBDO2lCQUExQyxVQUEwQyxFQUExQyxxQkFBMEMsRUFBMUMsSUFBMEM7Z0JBQTFDLG1DQUEwQzs7WUFDcEUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7Z0JBQ3BCLHFFQUFxRTtnQkFDckUsSUFBSSxHQUFHLENBQUMscUJBQXFCLEtBQUssSUFBSSxJQUFJLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDckUsSUFBTSxXQUFXLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4RSxJQUFJLFdBQVcsSUFBSSx5QkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3RELEtBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO3FCQUNsRDtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVEOzs7V0FHRztRQUNILGtEQUFpQixHQUFqQixjQUF1RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNFLDZCQUFDO0lBQUQsQ0FBQyxBQTNCRCxJQTJCQztJQTNCWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtSZWZlcmVuY2VzUmVnaXN0cnl9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucyc7XG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ltcG9ydHMnO1xuaW1wb3J0IHtEZWNsYXJhdGlvbiwgUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9yZWZsZWN0aW9uJztcbmltcG9ydCB7aGFzTmFtZUlkZW50aWZpZXJ9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBUaGlzIGlzIGEgcGxhY2UgZm9yIERlY29yYXRvckhhbmRsZXJzIHRvIHJlZ2lzdGVyIHJlZmVyZW5jZXMgdGhhdCB0aGV5XG4gKiBmaW5kIGluIHRoZWlyIGFuYWx5c2lzIG9mIHRoZSBjb2RlLlxuICpcbiAqIFRoaXMgcmVnaXN0cnkgaXMgdXNlZCB0byBlbnN1cmUgdGhhdCB0aGVzZSByZWZlcmVuY2VzIGFyZSBwdWJsaWNseSBleHBvcnRlZFxuICogZnJvbSBsaWJyYXJpZXMgdGhhdCBhcmUgY29tcGlsZWQgYnkgbmdjYy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5nY2NSZWZlcmVuY2VzUmVnaXN0cnkgaW1wbGVtZW50cyBSZWZlcmVuY2VzUmVnaXN0cnkge1xuICBwcml2YXRlIG1hcCA9IG5ldyBNYXA8dHMuSWRlbnRpZmllciwgRGVjbGFyYXRpb24+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBob3N0OiBSZWZsZWN0aW9uSG9zdCkge31cblxuICAvKipcbiAgICogUmVnaXN0ZXIgb25lIG9yIG1vcmUgcmVmZXJlbmNlcyBpbiB0aGUgcmVnaXN0cnkuXG4gICAqIE9ubHkgYFJlc29sdmVSZWZlcmVuY2VgIHJlZmVyZW5jZXMgYXJlIHN0b3JlZC4gT3RoZXIgdHlwZXMgYXJlIGlnbm9yZWQuXG4gICAqIEBwYXJhbSByZWZlcmVuY2VzIEEgY29sbGVjdGlvbiBvZiByZWZlcmVuY2VzIHRvIHJlZ2lzdGVyLlxuICAgKi9cbiAgYWRkKHNvdXJjZTogdHMuRGVjbGFyYXRpb24sIC4uLnJlZmVyZW5jZXM6IFJlZmVyZW5jZTx0cy5EZWNsYXJhdGlvbj5bXSk6IHZvaWQge1xuICAgIHJlZmVyZW5jZXMuZm9yRWFjaChyZWYgPT4ge1xuICAgICAgLy8gT25seSBzdG9yZSByZWxhdGl2ZSByZWZlcmVuY2VzLiBXZSBhcmUgbm90IGludGVyZXN0ZWQgaW4gbGl0ZXJhbHMuXG4gICAgICBpZiAocmVmLmJlc3RHdWVzc093bmluZ01vZHVsZSA9PT0gbnVsbCAmJiBoYXNOYW1lSWRlbnRpZmllcihyZWYubm9kZSkpIHtcbiAgICAgICAgY29uc3QgZGVjbGFyYXRpb24gPSB0aGlzLmhvc3QuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIocmVmLm5vZGUubmFtZSk7XG4gICAgICAgIGlmIChkZWNsYXJhdGlvbiAmJiBoYXNOYW1lSWRlbnRpZmllcihkZWNsYXJhdGlvbi5ub2RlKSkge1xuICAgICAgICAgIHRoaXMubWFwLnNldChkZWNsYXJhdGlvbi5ub2RlLm5hbWUsIGRlY2xhcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbWFwcGluZyBmb3IgdGhlIHJlZ2lzdGVyZWQgcmVzb2x2ZWQgcmVmZXJlbmNlcy5cbiAgICogQHJldHVybnMgQSBtYXAgb2YgcmVmZXJlbmNlIGlkZW50aWZpZXJzIHRvIHJlZmVyZW5jZSBkZWNsYXJhdGlvbnMuXG4gICAqL1xuICBnZXREZWNsYXJhdGlvbk1hcCgpOiBNYXA8dHMuSWRlbnRpZmllciwgRGVjbGFyYXRpb24+IHsgcmV0dXJuIHRoaXMubWFwOyB9XG59XG4iXX0=
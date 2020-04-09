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
        define("@angular/compiler-cli/src/ngtsc/cycles/src/imports", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    /**
     * A cached graph of imports in the `ts.Program`.
     *
     * The `ImportGraph` keeps track of dependencies (imports) of individual `ts.SourceFile`s. Only
     * dependencies within the same program are tracked; imports into packages on NPM are not.
     */
    var ImportGraph = /** @class */ (function () {
        function ImportGraph(resolver) {
            this.resolver = resolver;
            this.map = new Map();
        }
        /**
         * List the direct (not transitive) imports of a given `ts.SourceFile`.
         *
         * This operation is cached.
         */
        ImportGraph.prototype.importsOf = function (sf) {
            if (!this.map.has(sf)) {
                this.map.set(sf, this.scanImports(sf));
            }
            return this.map.get(sf);
        };
        /**
         * Lists the transitive imports of a given `ts.SourceFile`.
         */
        ImportGraph.prototype.transitiveImportsOf = function (sf) {
            var imports = new Set();
            this.transitiveImportsOfHelper(sf, imports);
            return imports;
        };
        ImportGraph.prototype.transitiveImportsOfHelper = function (sf, results) {
            var _this = this;
            if (results.has(sf)) {
                return;
            }
            results.add(sf);
            this.importsOf(sf).forEach(function (imported) { _this.transitiveImportsOfHelper(imported, results); });
        };
        /**
         * Add a record of an import from `sf` to `imported`, that's not present in the original
         * `ts.Program` but will be remembered by the `ImportGraph`.
         */
        ImportGraph.prototype.addSyntheticImport = function (sf, imported) {
            if (isLocalFile(imported)) {
                this.importsOf(sf).add(imported);
            }
        };
        ImportGraph.prototype.scanImports = function (sf) {
            var _this = this;
            var imports = new Set();
            // Look through the source file for import statements.
            sf.statements.forEach(function (stmt) {
                if ((ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt)) &&
                    stmt.moduleSpecifier !== undefined && ts.isStringLiteral(stmt.moduleSpecifier)) {
                    // Resolve the module to a file, and check whether that file is in the ts.Program.
                    var moduleName = stmt.moduleSpecifier.text;
                    var moduleFile = _this.resolver.resolveModuleName(moduleName, sf);
                    if (moduleFile !== null && isLocalFile(moduleFile)) {
                        // Record this local import.
                        imports.add(moduleFile);
                    }
                }
            });
            return imports;
        };
        return ImportGraph;
    }());
    exports.ImportGraph = ImportGraph;
    function isLocalFile(sf) {
        return !sf.fileName.endsWith('.d.ts');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvY3ljbGVzL3NyYy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBSWpDOzs7OztPQUtHO0lBQ0g7UUFHRSxxQkFBb0IsUUFBd0I7WUFBeEIsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFGcEMsUUFBRyxHQUFHLElBQUksR0FBRyxFQUFxQyxDQUFDO1FBRVosQ0FBQztRQUVoRDs7OztXQUlHO1FBQ0gsK0JBQVMsR0FBVCxVQUFVLEVBQWlCO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFHLENBQUM7UUFDNUIsQ0FBQztRQUVEOztXQUVHO1FBQ0gseUNBQW1CLEdBQW5CLFVBQW9CLEVBQWlCO1lBQ25DLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1lBQ3pDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUVPLCtDQUF5QixHQUFqQyxVQUFrQyxFQUFpQixFQUFFLE9BQTJCO1lBQWhGLGlCQU1DO1lBTEMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQixPQUFPO2FBQ1I7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUSxJQUFNLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRyxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsd0NBQWtCLEdBQWxCLFVBQW1CLEVBQWlCLEVBQUUsUUFBdUI7WUFDM0QsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQztRQUVPLGlDQUFXLEdBQW5CLFVBQW9CLEVBQWlCO1lBQXJDLGlCQWdCQztZQWZDLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1lBQ3pDLHNEQUFzRDtZQUN0RCxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ3hCLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5RCxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVMsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtvQkFDbEYsa0ZBQWtGO29CQUNsRixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztvQkFDN0MsSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ25FLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUU7d0JBQ2xELDRCQUE0Qjt3QkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDekI7aUJBQ0Y7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDSCxrQkFBQztJQUFELENBQUMsQUE3REQsSUE2REM7SUE3RFksa0NBQVc7SUErRHhCLFNBQVMsV0FBVyxDQUFDLEVBQWlCO1FBQ3BDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5cbi8qKlxuICogQSBjYWNoZWQgZ3JhcGggb2YgaW1wb3J0cyBpbiB0aGUgYHRzLlByb2dyYW1gLlxuICpcbiAqIFRoZSBgSW1wb3J0R3JhcGhgIGtlZXBzIHRyYWNrIG9mIGRlcGVuZGVuY2llcyAoaW1wb3J0cykgb2YgaW5kaXZpZHVhbCBgdHMuU291cmNlRmlsZWBzLiBPbmx5XG4gKiBkZXBlbmRlbmNpZXMgd2l0aGluIHRoZSBzYW1lIHByb2dyYW0gYXJlIHRyYWNrZWQ7IGltcG9ydHMgaW50byBwYWNrYWdlcyBvbiBOUE0gYXJlIG5vdC5cbiAqL1xuZXhwb3J0IGNsYXNzIEltcG9ydEdyYXBoIHtcbiAgcHJpdmF0ZSBtYXAgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIFNldDx0cy5Tb3VyY2VGaWxlPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlc29sdmVyOiBNb2R1bGVSZXNvbHZlcikge31cblxuICAvKipcbiAgICogTGlzdCB0aGUgZGlyZWN0IChub3QgdHJhbnNpdGl2ZSkgaW1wb3J0cyBvZiBhIGdpdmVuIGB0cy5Tb3VyY2VGaWxlYC5cbiAgICpcbiAgICogVGhpcyBvcGVyYXRpb24gaXMgY2FjaGVkLlxuICAgKi9cbiAgaW1wb3J0c09mKHNmOiB0cy5Tb3VyY2VGaWxlKTogU2V0PHRzLlNvdXJjZUZpbGU+IHtcbiAgICBpZiAoIXRoaXMubWFwLmhhcyhzZikpIHtcbiAgICAgIHRoaXMubWFwLnNldChzZiwgdGhpcy5zY2FuSW1wb3J0cyhzZikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KHNmKSAhO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RzIHRoZSB0cmFuc2l0aXZlIGltcG9ydHMgb2YgYSBnaXZlbiBgdHMuU291cmNlRmlsZWAuXG4gICAqL1xuICB0cmFuc2l0aXZlSW1wb3J0c09mKHNmOiB0cy5Tb3VyY2VGaWxlKTogU2V0PHRzLlNvdXJjZUZpbGU+IHtcbiAgICBjb25zdCBpbXBvcnRzID0gbmV3IFNldDx0cy5Tb3VyY2VGaWxlPigpO1xuICAgIHRoaXMudHJhbnNpdGl2ZUltcG9ydHNPZkhlbHBlcihzZiwgaW1wb3J0cyk7XG4gICAgcmV0dXJuIGltcG9ydHM7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zaXRpdmVJbXBvcnRzT2ZIZWxwZXIoc2Y6IHRzLlNvdXJjZUZpbGUsIHJlc3VsdHM6IFNldDx0cy5Tb3VyY2VGaWxlPik6IHZvaWQge1xuICAgIGlmIChyZXN1bHRzLmhhcyhzZikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzdWx0cy5hZGQoc2YpO1xuICAgIHRoaXMuaW1wb3J0c09mKHNmKS5mb3JFYWNoKGltcG9ydGVkID0+IHsgdGhpcy50cmFuc2l0aXZlSW1wb3J0c09mSGVscGVyKGltcG9ydGVkLCByZXN1bHRzKTsgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVjb3JkIG9mIGFuIGltcG9ydCBmcm9tIGBzZmAgdG8gYGltcG9ydGVkYCwgdGhhdCdzIG5vdCBwcmVzZW50IGluIHRoZSBvcmlnaW5hbFxuICAgKiBgdHMuUHJvZ3JhbWAgYnV0IHdpbGwgYmUgcmVtZW1iZXJlZCBieSB0aGUgYEltcG9ydEdyYXBoYC5cbiAgICovXG4gIGFkZFN5bnRoZXRpY0ltcG9ydChzZjogdHMuU291cmNlRmlsZSwgaW1wb3J0ZWQ6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBpZiAoaXNMb2NhbEZpbGUoaW1wb3J0ZWQpKSB7XG4gICAgICB0aGlzLmltcG9ydHNPZihzZikuYWRkKGltcG9ydGVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNjYW5JbXBvcnRzKHNmOiB0cy5Tb3VyY2VGaWxlKTogU2V0PHRzLlNvdXJjZUZpbGU+IHtcbiAgICBjb25zdCBpbXBvcnRzID0gbmV3IFNldDx0cy5Tb3VyY2VGaWxlPigpO1xuICAgIC8vIExvb2sgdGhyb3VnaCB0aGUgc291cmNlIGZpbGUgZm9yIGltcG9ydCBzdGF0ZW1lbnRzLlxuICAgIHNmLnN0YXRlbWVudHMuZm9yRWFjaChzdG10ID0+IHtcbiAgICAgIGlmICgodHMuaXNJbXBvcnREZWNsYXJhdGlvbihzdG10KSB8fCB0cy5pc0V4cG9ydERlY2xhcmF0aW9uKHN0bXQpKSAmJlxuICAgICAgICAgIHN0bXQubW9kdWxlU3BlY2lmaWVyICE9PSB1bmRlZmluZWQgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKHN0bXQubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgICAvLyBSZXNvbHZlIHRoZSBtb2R1bGUgdG8gYSBmaWxlLCBhbmQgY2hlY2sgd2hldGhlciB0aGF0IGZpbGUgaXMgaW4gdGhlIHRzLlByb2dyYW0uXG4gICAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBzdG10Lm1vZHVsZVNwZWNpZmllci50ZXh0O1xuICAgICAgICBjb25zdCBtb2R1bGVGaWxlID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlTW9kdWxlTmFtZShtb2R1bGVOYW1lLCBzZik7XG4gICAgICAgIGlmIChtb2R1bGVGaWxlICE9PSBudWxsICYmIGlzTG9jYWxGaWxlKG1vZHVsZUZpbGUpKSB7XG4gICAgICAgICAgLy8gUmVjb3JkIHRoaXMgbG9jYWwgaW1wb3J0LlxuICAgICAgICAgIGltcG9ydHMuYWRkKG1vZHVsZUZpbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGltcG9ydHM7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNMb2NhbEZpbGUoc2Y6IHRzLlNvdXJjZUZpbGUpOiBib29sZWFuIHtcbiAgcmV0dXJuICFzZi5maWxlTmFtZS5lbmRzV2l0aCgnLmQudHMnKTtcbn1cbiJdfQ==
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
        define("@angular/compiler-cli/src/ngtsc/incremental/src/state", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * Accumulates state between compilations.
     */
    var IncrementalState = /** @class */ (function () {
        function IncrementalState(unchangedFiles, metadata, modifiedResourceFiles) {
            this.unchangedFiles = unchangedFiles;
            this.metadata = metadata;
            this.modifiedResourceFiles = modifiedResourceFiles;
        }
        IncrementalState.reconcile = function (previousState, oldProgram, newProgram, modifiedResourceFiles) {
            var e_1, _a;
            var unchangedFiles = new Set();
            var metadata = new Map();
            var oldFiles = new Set(oldProgram.getSourceFiles());
            var newFiles = new Set(newProgram.getSourceFiles());
            try {
                // Compute the set of files that are unchanged (both in themselves and their dependencies).
                for (var _b = tslib_1.__values(newProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var newFile = _c.value;
                    if (oldFiles.has(newFile)) {
                        var oldDeps = previousState.getFileDependencies(newFile);
                        if (oldDeps.every(function (oldDep) { return newFiles.has(oldDep); })) {
                            // The file and its dependencies are unchanged.
                            unchangedFiles.add(newFile);
                            // Copy over its metadata too
                            var meta = previousState.metadata.get(newFile);
                            if (meta) {
                                metadata.set(newFile, meta);
                            }
                        }
                    }
                    else if (newFile.isDeclarationFile) {
                        // A typings file has changed so trigger a full rebuild of the Angular analyses
                        return IncrementalState.fresh();
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
            return new IncrementalState(unchangedFiles, metadata, modifiedResourceFiles);
        };
        IncrementalState.fresh = function () {
            return new IncrementalState(new Set(), new Map(), null);
        };
        IncrementalState.prototype.safeToSkip = function (sf) {
            return this.unchangedFiles.has(sf) && !this.hasChangedResourceDependencies(sf);
        };
        IncrementalState.prototype.trackFileDependency = function (dep, src) {
            var metadata = this.ensureMetadata(src);
            metadata.fileDependencies.add(dep);
        };
        IncrementalState.prototype.getFileDependencies = function (file) {
            var meta = this.metadata.get(file);
            return meta ? Array.from(meta.fileDependencies) : [];
        };
        IncrementalState.prototype.getNgModuleMetadata = function (ref) {
            var metadata = this.metadata.get(ref.node.getSourceFile()) || null;
            return metadata && metadata.ngModuleMeta.get(ref.node) || null;
        };
        IncrementalState.prototype.registerNgModuleMetadata = function (meta) {
            var metadata = this.ensureMetadata(meta.ref.node.getSourceFile());
            metadata.ngModuleMeta.set(meta.ref.node, meta);
        };
        IncrementalState.prototype.getDirectiveMetadata = function (ref) {
            var metadata = this.metadata.get(ref.node.getSourceFile()) || null;
            return metadata && metadata.directiveMeta.get(ref.node) || null;
        };
        IncrementalState.prototype.registerDirectiveMetadata = function (meta) {
            var metadata = this.ensureMetadata(meta.ref.node.getSourceFile());
            metadata.directiveMeta.set(meta.ref.node, meta);
        };
        IncrementalState.prototype.getPipeMetadata = function (ref) {
            var metadata = this.metadata.get(ref.node.getSourceFile()) || null;
            return metadata && metadata.pipeMeta.get(ref.node) || null;
        };
        IncrementalState.prototype.registerPipeMetadata = function (meta) {
            var metadata = this.ensureMetadata(meta.ref.node.getSourceFile());
            metadata.pipeMeta.set(meta.ref.node, meta);
        };
        IncrementalState.prototype.recordResourceDependency = function (file, resourcePath) {
            var metadata = this.ensureMetadata(file);
            metadata.resourcePaths.add(resourcePath);
        };
        IncrementalState.prototype.ensureMetadata = function (sf) {
            var metadata = this.metadata.get(sf) || new FileMetadata();
            this.metadata.set(sf, metadata);
            return metadata;
        };
        IncrementalState.prototype.hasChangedResourceDependencies = function (sf) {
            var _this = this;
            if (this.modifiedResourceFiles === null || !this.metadata.has(sf)) {
                return false;
            }
            var resourceDeps = this.metadata.get(sf).resourcePaths;
            return Array.from(resourceDeps.keys())
                .some(function (resourcePath) { return _this.modifiedResourceFiles.has(resourcePath); });
        };
        return IncrementalState;
    }());
    exports.IncrementalState = IncrementalState;
    /**
     * Information about the whether a source file can have analysis or emission can be skipped.
     */
    var FileMetadata = /** @class */ (function () {
        function FileMetadata() {
            /** A set of source files that this file depends upon. */
            this.fileDependencies = new Set();
            this.resourcePaths = new Set();
            this.directiveMeta = new Map();
            this.ngModuleMeta = new Map();
            this.pipeMeta = new Map();
        }
        return FileMetadata;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2luY3JlbWVudGFsL3NyYy9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFVSDs7T0FFRztJQUNIO1FBRUUsMEJBQ1ksY0FBa0MsRUFDbEMsUUFBMEMsRUFDMUMscUJBQXVDO1lBRnZDLG1CQUFjLEdBQWQsY0FBYyxDQUFvQjtZQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFrQztZQUMxQywwQkFBcUIsR0FBckIscUJBQXFCLENBQWtCO1FBQUcsQ0FBQztRQUVoRCwwQkFBUyxHQUFoQixVQUNJLGFBQStCLEVBQUUsVUFBc0IsRUFBRSxVQUFzQixFQUMvRSxxQkFBdUM7O1lBQ3pDLElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1lBQ2hELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUErQixDQUFDO1lBQ3hELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFnQixVQUFVLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUNyRSxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBZ0IsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7O2dCQUVyRSwyRkFBMkY7Z0JBQzNGLEtBQXNCLElBQUEsS0FBQSxpQkFBQSxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7b0JBQTlDLElBQU0sT0FBTyxXQUFBO29CQUNoQixJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3pCLElBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDM0QsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsUUFBUSxD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LEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoQyxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO1FBRU8seURBQThCLEdBQXRDLFVBQXVDLEVBQWlCO1lBQXhELGlCQU9DO1lBTkMsSUFBSSxJQUFJLENBQUMscUJBQXFCLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2pFLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFDRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUcsQ0FBQyxhQUFhLENBQUM7WUFDM0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsWUFBWSxJQUFJLE9BQUEsS0FBSSxDQUFDLHFCQUF1QixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFDSCx1QkFBQztJQUFELENBQUMsQUF0R0QsSUFzR0M7SUF0R1ksNENBQWdCO0lBd0c3Qjs7T0FFRztJQUNIO1FBQUE7WUFDRSx5REFBeUQ7WUFDekQscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7WUFDNUMsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1lBQ2xDLGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQW1DLENBQUM7WUFDM0QsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztZQUN6RCxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFDbkQsQ0FBQztRQUFELG1CQUFDO0lBQUQsQ0FBQyxBQVBELElBT0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0RpcmVjdGl2ZU1ldGEsIE1ldGFkYXRhUmVhZGVyLCBNZXRhZGF0YVJlZ2lzdHJ5LCBOZ01vZHVsZU1ldGEsIFBpcGVNZXRhfSBmcm9tICcuLi8uLi9tZXRhZGF0YSc7XG5pbXBvcnQge0RlcGVuZGVuY3lUcmFja2VyfSBmcm9tICcuLi8uLi9wYXJ0aWFsX2V2YWx1YXRvcic7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtSZXNvdXJjZURlcGVuZGVuY3lSZWNvcmRlcn0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvcmVzb3VyY2VfcmVjb3JkZXInO1xuXG4vKipcbiAqIEFjY3VtdWxhdGVzIHN0YXRlIGJldHdlZW4gY29tcGlsYXRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgSW5jcmVtZW50YWxTdGF0ZSBpbXBsZW1lbnRzIERlcGVuZGVuY3lUcmFja2VyLCBNZXRhZGF0YVJlYWRlciwgTWV0YWRhdGFSZWdpc3RyeSxcbiAgICBSZXNvdXJjZURlcGVuZGVuY3lSZWNvcmRlciB7XG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHVuY2hhbmdlZEZpbGVzOiBTZXQ8dHMuU291cmNlRmlsZT4sXG4gICAgICBwcml2YXRlIG1ldGFkYXRhOiBNYXA8dHMuU291cmNlRmlsZSwgRmlsZU1ldGFkYXRhPixcbiAgICAgIHByaXZhdGUgbW9kaWZpZWRSZXNvdXJjZUZpbGVzOiBTZXQ8c3RyaW5nPnxudWxsKSB7fVxuXG4gIHN0YXRpYyByZWNvbmNpbGUoXG4gICAgICBwcmV2aW91c1N0YXRlOiBJbmNyZW1lbnRhbFN0YXRlLCBvbGRQcm9ncmFtOiB0cy5Qcm9ncmFtLCBuZXdQcm9ncmFtOiB0cy5Qcm9ncmFtLFxuICAgICAgbW9kaWZpZWRSZXNvdXJjZUZpbGVzOiBTZXQ8c3RyaW5nPnxudWxsKTogSW5jcmVtZW50YWxTdGF0ZSB7XG4gICAgY29uc3QgdW5jaGFuZ2VkRmlsZXMgPSBuZXcgU2V0PHRzLlNvdXJjZUZpbGU+KCk7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIEZpbGVNZXRhZGF0YT4oKTtcbiAgICBjb25zdCBvbGRGaWxlcyA9IG5ldyBTZXQ8dHMuU291cmNlRmlsZT4ob2xkUHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKTtcbiAgICBjb25zdCBuZXdGaWxlcyA9IG5ldyBTZXQ8dHMuU291cmNlRmlsZT4obmV3UHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKTtcblxuICAgIC8vIENvbXB1dGUgdGhlIHNldCBvZiBmaWxlcyB0aGF0IGFyZSB1bmNoYW5nZWQgKGJvdGggaW4gdGhlbXNlbHZlcyBhbmQgdGhlaXIgZGVwZW5kZW5jaWVzKS5cbiAgICBmb3IgKGNvbnN0IG5ld0ZpbGUgb2YgbmV3UHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKSB7XG4gICAgICBpZiAob2xkRmlsZXMuaGFzKG5ld0ZpbGUpKSB7XG4gICAgICAgIGNvbnN0IG9sZERlcHMgPSBwcmV2aW91c1N0YXRlLmdldEZpbGVEZXBlbmRlbmNpZXMobmV3RmlsZSk7XG4gICAgICAgIGlmIChvbGREZXBzLmV2ZXJ5KG9sZERlcCA9PiBuZXdGaWxlcy5oYXMob2xkRGVwKSkpIHtcbiAgICAgICAgICAvLyBUaGUgZmlsZSBhbmQgaXRzIGRlcGVuZGVuY2llcyBhcmUgdW5jaGFuZ2VkLlxuICAgICAgICAgIHVuY2hhbmdlZEZpbGVzLmFkZChuZXdGaWxlKTtcbiAgICAgICAgICAvLyBDb3B5IG92ZXIgaXRzIG1ldGFkYXRhIHRvb1xuICAgICAgICAgIGNvbnN0IG1ldGEgPSBwcmV2aW91c1N0YXRlLm1ldGFkYXRhLmdldChuZXdGaWxlKTtcbiAgICAgICAgICBpZiAobWV0YSkge1xuICAgICAgICAgICAgbWV0YWRhdGEuc2V0KG5ld0ZpbGUsIG1ldGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChuZXdGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAgIC8vIEEgdHlwaW5ncyBmaWxlIGhhcyBjaGFuZ2VkIHNvIHRyaWdnZXIgYSBmdWxsIHJlYnVpbGQgb2YgdGhlIEFuZ3VsYXIgYW5hbHlzZXNcbiAgICAgICAgcmV0dXJuIEluY3JlbWVudGFsU3RhdGUuZnJlc2goKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEluY3JlbWVudGFsU3RhdGUodW5jaGFuZ2VkRmlsZXMsIG1ldGFkYXRhLCBtb2RpZmllZFJlc291cmNlRmlsZXMpO1xuICB9XG5cbiAgc3RhdGljIGZyZXNoKCk6IEluY3JlbWVudGFsU3RhdGUge1xuICAgIHJldHVybiBuZXcgSW5jcmVtZW50YWxTdGF0ZShcbiAgICAgICAgbmV3IFNldDx0cy5Tb3VyY2VGaWxlPigpLCBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIEZpbGVNZXRhZGF0YT4oKSwgbnVsbCk7XG4gIH1cblxuICBzYWZlVG9Ta2lwKHNmOiB0cy5Tb3VyY2VGaWxlKTogYm9vbGVhbnxQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy51bmNoYW5nZWRGaWxlcy5oYXMoc2YpICYmICF0aGlzLmhhc0NoYW5nZWRSZXNvdXJjZURlcGVuZGVuY2llcyhzZik7XG4gIH1cblxuICB0cmFja0ZpbGVEZXBlbmRlbmN5KGRlcDogdHMuU291cmNlRmlsZSwgc3JjOiB0cy5Tb3VyY2VGaWxlKSB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmVuc3VyZU1ldGFkYXRhKHNyYyk7XG4gICAgbWV0YWRhdGEuZmlsZURlcGVuZGVuY2llcy5hZGQoZGVwKTtcbiAgfVxuXG4gIGdldEZpbGVEZXBlbmRlbmNpZXMoZmlsZTogdHMuU291cmNlRmlsZSk6IHRzLlNvdXJjZUZpbGVbXSB7XG4gICAgY29uc3QgbWV0YSA9IHRoaXMubWV0YWRhdGEuZ2V0KGZpbGUpO1xuICAgIHJldHVybiBtZXRhID8gQXJyYXkuZnJvbShtZXRhLmZpbGVEZXBlbmRlbmNpZXMpIDogW107XG4gIH1cblxuICBnZXROZ01vZHVsZU1ldGFkYXRhKHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+KTogTmdNb2R1bGVNZXRhfG51bGwge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5tZXRhZGF0YS5nZXQocmVmLm5vZGUuZ2V0U291cmNlRmlsZSgpKSB8fCBudWxsO1xuICAgIHJldHVybiBtZXRhZGF0YSAmJiBtZXRhZGF0YS5uZ01vZHVsZU1ldGEuZ2V0KHJlZi5ub2RlKSB8fCBudWxsO1xuICB9XG4gIHJlZ2lzdGVyTmdNb2R1bGVNZXRhZGF0YShtZXRhOiBOZ01vZHVsZU1ldGEpOiB2b2lkIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZW5zdXJlTWV0YWRhdGEobWV0YS5yZWYubm9kZS5nZXRTb3VyY2VGaWxlKCkpO1xuICAgIG1ldGFkYXRhLm5nTW9kdWxlTWV0YS5zZXQobWV0YS5yZWYubm9kZSwgbWV0YSk7XG4gIH1cblxuICBnZXREaXJlY3RpdmVNZXRhZGF0YShyZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPik6IERpcmVjdGl2ZU1ldGF8bnVsbCB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLm1ldGFkYXRhLmdldChyZWYubm9kZS5nZXRTb3VyY2VGaWxlKCkpIHx8IG51bGw7XG4gICAgcmV0dXJuIG1ldGFkYXRhICYmIG1ldGFkYXRhLmRpcmVjdGl2ZU1ldGEuZ2V0KHJlZi5ub2RlKSB8fCBudWxsO1xuICB9XG4gIHJlZ2lzdGVyRGlyZWN0aXZlTWV0YWRhdGEobWV0YTogRGlyZWN0aXZlTWV0YSk6IHZvaWQge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5lbnN1cmVNZXRhZGF0YShtZXRhLnJlZi5ub2RlLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgbWV0YWRhdGEuZGlyZWN0aXZlTWV0YS5zZXQobWV0YS5yZWYubm9kZSwgbWV0YSk7XG4gIH1cblxuICBnZXRQaXBlTWV0YWRhdGEocmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4pOiBQaXBlTWV0YXxudWxsIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMubWV0YWRhdGEuZ2V0KHJlZi5ub2RlLmdldFNvdXJjZUZpbGUoKSkgfHwgbnVsbDtcbiAgICByZXR1cm4gbWV0YWRhdGEgJiYgbWV0YWRhdGEucGlwZU1ldGEuZ2V0KHJlZi5ub2RlKSB8fCBudWxsO1xuICB9XG4gIHJlZ2lzdGVyUGlwZU1ldGFkYXRhKG1ldGE6IFBpcGVNZXRhKTogdm9pZCB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmVuc3VyZU1ldGFkYXRhKG1ldGEucmVmLm5vZGUuZ2V0U291cmNlRmlsZSgpKTtcbiAgICBtZXRhZGF0YS5waXBlTWV0YS5zZXQobWV0YS5yZWYubm9kZSwgbWV0YSk7XG4gIH1cblxuICByZWNvcmRSZXNvdXJjZURlcGVuZGVuY3koZmlsZTogdHMuU291cmNlRmlsZSwgcmVzb3VyY2VQYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZW5zdXJlTWV0YWRhdGEoZmlsZSk7XG4gICAgbWV0YWRhdGEucmVzb3VyY2VQYXRocy5hZGQocmVzb3VyY2VQYXRoKTtcbiAgfVxuXG4gIHByaXZhdGUgZW5zdXJlTWV0YWRhdGEoc2Y6IHRzLlNvdXJjZUZpbGUpOiBGaWxlTWV0YWRhdGEge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5tZXRhZGF0YS5nZXQoc2YpIHx8IG5ldyBGaWxlTWV0YWRhdGEoKTtcbiAgICB0aGlzLm1ldGFkYXRhLnNldChzZiwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgaGFzQ2hhbmdlZFJlc291cmNlRGVwZW5kZW5jaWVzKHNmOiB0cy5Tb3VyY2VGaWxlKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubW9kaWZpZWRSZXNvdXJjZUZpbGVzID09PSBudWxsIHx8ICF0aGlzLm1ldGFkYXRhLmhhcyhzZikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcmVzb3VyY2VEZXBzID0gdGhpcy5tZXRhZGF0YS5nZXQoc2YpICEucmVzb3VyY2VQYXRocztcbiAgICByZXR1cm4gQXJyYXkuZnJvbShyZXNvdXJjZURlcHMua2V5cygpKVxuICAgICAgICAuc29tZShyZXNvdXJjZVBhdGggPT4gdGhpcy5tb2RpZmllZFJlc291cmNlRmlsZXMgIS5oYXMocmVzb3VyY2VQYXRoKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgd2hldGhlciBhIHNvdXJjZSBmaWxlIGNhbiBoYXZlIGFuYWx5c2lzIG9yIGVtaXNzaW9uIGNhbiBiZSBza2lwcGVkLlxuICovXG5jbGFzcyBGaWxlTWV0YWRhdGEge1xuICAvKiogQSBzZXQgb2Ygc291cmNlIGZpbGVzIHRoYXQgdGhpcyBmaWxlIGRlcGVuZHMgdXBvbi4gKi9cbiAgZmlsZURlcGVuZGVuY2llcyA9IG5ldyBTZXQ8dHMuU291cmNlRmlsZT4oKTtcbiAgcmVzb3VyY2VQYXRocyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBkaXJlY3RpdmVNZXRhID0gbmV3IE1hcDxDbGFzc0RlY2xhcmF0aW9uLCBEaXJlY3RpdmVNZXRhPigpO1xuICBuZ01vZHVsZU1ldGEgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIE5nTW9kdWxlTWV0YT4oKTtcbiAgcGlwZU1ldGEgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIFBpcGVNZXRhPigpO1xufVxuIl19
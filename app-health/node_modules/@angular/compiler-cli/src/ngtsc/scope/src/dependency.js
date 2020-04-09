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
        define("@angular/compiler-cli/src/ngtsc/scope/src/dependency", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * Reads Angular metadata from classes declared in .d.ts files and computes an `ExportScope`.
     *
     * Given an NgModule declared in a .d.ts file, this resolver can produce a transitive `ExportScope`
     * of all of the directives/pipes it exports. It does this by reading metadata off of Ivy static
     * fields on directives, components, pipes, and NgModules.
     */
    var MetadataDtsModuleScopeResolver = /** @class */ (function () {
        /**
         * @param dtsMetaReader a `MetadataReader` which can read metadata from `.d.ts` files.
         */
        function MetadataDtsModuleScopeResolver(dtsMetaReader, aliasGenerator) {
            this.dtsMetaReader = dtsMetaReader;
            this.aliasGenerator = aliasGenerator;
            /**
             * Cache which holds fully resolved scopes for NgModule classes from .d.ts files.
             */
            this.cache = new Map();
        }
        /**
         * Resolve a `Reference`'d NgModule from a .d.ts file and produce a transitive `ExportScope`
         * listing the directives and pipes which that NgModule exports to others.
         *
         * This operation relies on a `Reference` instead of a direct TypeScrpt node as the `Reference`s
         * produced depend on how the original NgModule was imported.
         */
        MetadataDtsModuleScopeResolver.prototype.resolve = function (ref) {
            var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
            var clazz = ref.node;
            var sourceFile = clazz.getSourceFile();
            if (!sourceFile.isDeclarationFile) {
                throw new Error("Debug error: DtsModuleScopeResolver.read(" + ref.debugName + " from " + sourceFile.fileName + "), but not a .d.ts file");
            }
            if (this.cache.has(clazz)) {
                return this.cache.get(clazz);
            }
            // Build up the export scope - those directives and pipes made visible by this module.
            var directives = [];
            var pipes = [];
            var meta = this.dtsMetaReader.getNgModuleMetadata(ref);
            if (meta === null) {
                this.cache.set(clazz, null);
                return null;
            }
            var declarations = new Set();
            try {
                for (var _e = tslib_1.__values(meta.declarations), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var declRef = _f.value;
                    declarations.add(declRef.node);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                // Only the 'exports' field of the NgModule's metadata is important. Imports and declarations
                // don't affect the export scope.
                for (var _g = tslib_1.__values(meta.exports), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var exportRef = _h.value;
                    // Attempt to process the export as a directive.
                    var directive = this.dtsMetaReader.getDirectiveMetadata(exportRef);
                    if (directive !== null) {
                        if (!declarations.has(exportRef.node)) {
                            directives.push(this.maybeAlias(directive, sourceFile));
                        }
                        else {
                            directives.push(directive);
                        }
                        continue;
                    }
                    // Attempt to process the export as a pipe.
                    var pipe = this.dtsMetaReader.getPipeMetadata(exportRef);
                    if (pipe !== null) {
                        if (!declarations.has(exportRef.node)) {
                            pipes.push(this.maybeAlias(pipe, sourceFile));
                        }
                        else {
                            pipes.push(pipe);
                        }
                        continue;
                    }
                    // Attempt to process the export as a module.
                    var exportScope = this.resolve(exportRef);
                    if (exportScope !== null) {
                        // It is a module. Add exported directives and pipes to the current scope. This might
                        // involve rewriting the `Reference`s to those types to have an alias expression if one is
                        // required.
                        if (this.aliasGenerator === null) {
                            // Fast path when aliases aren't required.
                            directives.push.apply(directives, tslib_1.__spread(exportScope.exported.directives));
                            pipes.push.apply(pipes, tslib_1.__spread(exportScope.exported.pipes));
                        }
                        else {
                            try {
                                // It's necessary to rewrite the `Reference`s to add alias expressions. This way, imports
                                // generated to these directives and pipes will use a shallow import to `sourceFile`
                                // instead of a deep import directly to the directive or pipe class.
                                //
                                // One important check here is whether the directive/pipe is declared in the same
                                // source file as the re-exporting NgModule. This can happen if both a directive, its
                                // NgModule, and the re-exporting NgModule are all in the same file. In this case,
                                // no import alias is needed as it would go to the same file anyway.
                                for (var _j = (e_3 = void 0, tslib_1.__values(exportScope.exported.directives)), _k = _j.next(); !_k.done; _k = _j.next()) {
                                    var directive_1 = _k.value;
                                    directives.push(this.maybeAlias(directive_1, sourceFile));
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            try {
                                for (var _l = (e_4 = void 0, tslib_1.__values(exportScope.exported.pipes)), _m = _l.next(); !_m.done; _m = _l.next()) {
                                    var pipe_1 = _m.value;
                                    pipes.push(this.maybeAlias(pipe_1, sourceFile));
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                        }
                    }
                    continue;
                    // The export was not a directive, a pipe, or a module. This is an error.
                    // TODO(alxhub): produce a ts.Diagnostic
                    throw new Error("Exported value " + exportRef.debugName + " was not a directive, pipe, or module");
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return {
                exported: { directives: directives, pipes: pipes },
            };
        };
        MetadataDtsModuleScopeResolver.prototype.maybeAlias = function (dirOrPipe, maybeAliasFrom) {
            if (this.aliasGenerator === null) {
                return dirOrPipe;
            }
            var ref = dirOrPipe.ref;
            if (ref.node.getSourceFile() !== maybeAliasFrom) {
                return tslib_1.__assign({}, dirOrPipe, { ref: ref.cloneWithAlias(this.aliasGenerator.aliasTo(ref.node, maybeAliasFrom)) });
            }
            else {
                return dirOrPipe;
            }
        };
        return MetadataDtsModuleScopeResolver;
    }());
    exports.MetadataDtsModuleScopeResolver = MetadataDtsModuleScopeResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc2NvcGUvc3JjL2RlcGVuZGVuY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBY0g7Ozs7OztPQU1HO0lBQ0g7UUFNRTs7V0FFRztRQUNILHdDQUFvQixhQUE2QixFQUFVLGNBQW1DO1lBQTFFLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtZQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFxQjtZQVI5Rjs7ZUFFRztZQUNLLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBc0MsQ0FBQztRQUttQyxDQUFDO1FBRWxHOzs7Ozs7V0FNRztRQUNILGdEQUFPLEdBQVAsVUFBUSxHQUFnQzs7WUFDdEMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN2QixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDakMsTUFBTSxJQUFJLEtBQUssQ0FDWCw4Q0FBNEMsR0FBRyxDQUFDLFNBQVMsY0FBUyxVQUFVLENBQUMsUUFBUSw0QkFBeUIsQ0FBQyxDQUFDO2FBQ3JIO1lBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUcsQ0FBQzthQUNoQztZQUVELHNGQUFzRjtZQUN0RixJQUFNLFVBQVUsR0FBb0IsRUFBRSxDQUFDO1lBQ3ZDLElBQU0sS0FBSyxHQUFlLEVBQUUsQ0FBQztZQUU3QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pE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RTtvQ0FBMUMsSUFBTSxNQUFJLFdBQUE7b0NBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2lDQUMvQzs7Ozs7Ozs7O3lCQUNGO3FCQUNGO29CQUNELFNBQVM7b0JBRVQseUVBQXlFO29CQUN6RSx3Q0FBd0M7b0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLFNBQVMsQ0FBQyxTQUFTLDBDQUF1QyxDQUFDLENBQUM7aUJBQy9GOzs7Ozs7Ozs7WUFFRCxPQUFPO2dCQUNMLFFBQVEsRUFBRSxFQUFDLFVBQVUsWUFBQSxFQUFFLEtBQUssT0FBQSxFQUFDO2FBQzlCLENBQUM7UUFDSixDQUFDO1FBRU8sbURBQVUsR0FBbEIsVUFBcUQsU0FBWSxFQUFFLGNBQTZCO1lBRTlGLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hDLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztZQUMxQixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssY0FBYyxFQUFFO2dCQUMvQyw0QkFDSyxTQUFTLElBQ1osR0FBRyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQyxJQUM5RTthQUNIO2lCQUFNO2dCQUNMLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1FBQ0gsQ0FBQztRQUNILHFDQUFDO0lBQUQsQ0FBQyxBQTVIRCxJQTRIQztJQTVIWSx3RUFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0FsaWFzR2VuZXJhdG9yLCBSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtEaXJlY3RpdmVNZXRhLCBNZXRhZGF0YVJlYWRlciwgUGlwZU1ldGF9IGZyb20gJy4uLy4uL21ldGFkYXRhJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5cbmltcG9ydCB7RXhwb3J0U2NvcGV9IGZyb20gJy4vYXBpJztcblxuZXhwb3J0IGludGVyZmFjZSBEdHNNb2R1bGVTY29wZVJlc29sdmVyIHtcbiAgcmVzb2x2ZShyZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPik6IEV4cG9ydFNjb3BlfG51bGw7XG59XG5cbi8qKlxuICogUmVhZHMgQW5ndWxhciBtZXRhZGF0YSBmcm9tIGNsYXNzZXMgZGVjbGFyZWQgaW4gLmQudHMgZmlsZXMgYW5kIGNvbXB1dGVzIGFuIGBFeHBvcnRTY29wZWAuXG4gKlxuICogR2l2ZW4gYW4gTmdNb2R1bGUgZGVjbGFyZWQgaW4gYSAuZC50cyBmaWxlLCB0aGlzIHJlc29sdmVyIGNhbiBwcm9kdWNlIGEgdHJhbnNpdGl2ZSBgRXhwb3J0U2NvcGVgXG4gKiBvZiBhbGwgb2YgdGhlIGRpcmVjdGl2ZXMvcGlwZXMgaXQgZXhwb3J0cy4gSXQgZG9lcyB0aGlzIGJ5IHJlYWRpbmcgbWV0YWRhdGEgb2ZmIG9mIEl2eSBzdGF0aWNcbiAqIGZpZWxkcyBvbiBkaXJlY3RpdmVzLCBjb21wb25lbnRzLCBwaXBlcywgYW5kIE5nTW9kdWxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE1ldGFkYXRhRHRzTW9kdWxlU2NvcGVSZXNvbHZlciBpbXBsZW1lbnRzIER0c01vZHVsZVNjb3BlUmVzb2x2ZXIge1xuICAvKipcbiAgICogQ2FjaGUgd2hpY2ggaG9sZHMgZnVsbHkgcmVzb2x2ZWQgc2NvcGVzIGZvciBOZ01vZHVsZSBjbGFzc2VzIGZyb20gLmQudHMgZmlsZXMuXG4gICAqL1xuICBwcml2YXRlIGNhY2hlID0gbmV3IE1hcDxDbGFzc0RlY2xhcmF0aW9uLCBFeHBvcnRTY29wZXxudWxsPigpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gZHRzTWV0YVJlYWRlciBhIGBNZXRhZGF0YVJlYWRlcmAgd2hpY2ggY2FuIHJlYWQgbWV0YWRhdGEgZnJvbSBgLmQudHNgIGZpbGVzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkdHNNZXRhUmVhZGVyOiBNZXRhZGF0YVJlYWRlciwgcHJpdmF0ZSBhbGlhc0dlbmVyYXRvcjogQWxpYXNHZW5lcmF0b3J8bnVsbCkge31cblxuICAvKipcbiAgICogUmVzb2x2ZSBhIGBSZWZlcmVuY2VgJ2QgTmdNb2R1bGUgZnJvbSBhIC5kLnRzIGZpbGUgYW5kIHByb2R1Y2UgYSB0cmFuc2l0aXZlIGBFeHBvcnRTY29wZWBcbiAgICogbGlzdGluZyB0aGUgZGlyZWN0aXZlcyBhbmQgcGlwZXMgd2hpY2ggdGhhdCBOZ01vZHVsZSBleHBvcnRzIHRvIG90aGVycy5cbiAgICpcbiAgICogVGhpcyBvcGVyYXRpb24gcmVsaWVzIG9uIGEgYFJlZmVyZW5jZWAgaW5zdGVhZCBvZiBhIGRpcmVjdCBUeXBlU2NycHQgbm9kZSBhcyB0aGUgYFJlZmVyZW5jZWBzXG4gICAqIHByb2R1Y2VkIGRlcGVuZCBvbiBob3cgdGhlIG9yaWdpbmFsIE5nTW9kdWxlIHdhcyBpbXBvcnRlZC5cbiAgICovXG4gIHJlc29sdmUocmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4pOiBFeHBvcnRTY29wZXxudWxsIHtcbiAgICBjb25zdCBjbGF6eiA9IHJlZi5ub2RlO1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBjbGF6ei5nZXRTb3VyY2VGaWxlKCk7XG4gICAgaWYgKCFzb3VyY2VGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYERlYnVnIGVycm9yOiBEdHNNb2R1bGVTY29wZVJlc29sdmVyLnJlYWQoJHtyZWYuZGVidWdOYW1lfSBmcm9tICR7c291cmNlRmlsZS5maWxlTmFtZX0pLCBidXQgbm90IGEgLmQudHMgZmlsZWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhY2hlLmhhcyhjbGF6eikpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldChjbGF6eikgITtcbiAgICB9XG5cbiAgICAvLyBCdWlsZCB1cCB0aGUgZXhwb3J0IHNjb3BlIC0gdGhvc2UgZGlyZWN0aXZlcyBhbmQgcGlwZXMgbWFkZSB2aXNpYmxlIGJ5IHRoaXMgbW9kdWxlLlxuICAgIGNvbnN0IGRpcmVjdGl2ZXM6IERpcmVjdGl2ZU1ldGFbXSA9IFtdO1xuICAgIGNvbnN0IHBpcGVzOiBQaXBlTWV0YVtdID0gW107XG5cbiAgICBjb25zdCBtZXRhID0gdGhpcy5kdHNNZXRhUmVhZGVyLmdldE5nTW9kdWxlTWV0YWRhdGEocmVmKTtcbiAgICBpZiAobWV0YSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5jYWNoZS5zZXQoY2xhenosIG51bGwpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGVjbGFyYXRpb25zID0gbmV3IFNldDxDbGFzc0RlY2xhcmF0aW9uPigpO1xuICAgIGZvciAoY29uc3QgZGVjbFJlZiBvZiBtZXRhLmRlY2xhcmF0aW9ucykge1xuICAgICAgZGVjbGFyYXRpb25zLmFkZChkZWNsUmVmLm5vZGUpO1xuICAgIH1cblxuICAgIC8vIE9ubHkgdGhlICdleHBvcnRzJyBmaWVsZCBvZiB0aGUgTmdNb2R1bGUncyBtZXRhZGF0YSBpcyBpbXBvcnRhbnQuIEltcG9ydHMgYW5kIGRlY2xhcmF0aW9uc1xuICAgIC8vIGRvbid0IGFmZmVjdCB0aGUgZXhwb3J0IHNjb3BlLlxuICAgIGZvciAoY29uc3QgZXhwb3J0UmVmIG9mIG1ldGEuZXhwb3J0cykge1xuICAgICAgLy8gQXR0ZW1wdCB0byBwcm9jZXNzIHRoZSBleHBvcnQgYXMgYSBkaXJlY3RpdmUuXG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSB0aGlzLmR0c01ldGFSZWFkZXIuZ2V0RGlyZWN0aXZlTWV0YWRhdGEoZXhwb3J0UmVmKTtcbiAgICAgIGlmIChkaXJlY3RpdmUgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKCFkZWNsYXJhdGlvbnMuaGFzKGV4cG9ydFJlZi5ub2RlKSkge1xuICAgICAgICAgIGRpcmVjdGl2ZXMucHVzaCh0aGlzLm1heWJlQWxpYXMoZGlyZWN0aXZlLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEF0dGVtcHQgdG8gcHJvY2VzcyB0aGUgZXhwb3J0IGFzIGEgcGlwZS5cbiAgICAgIGNvbnN0IHBpcGUgPSB0aGlzLmR0c01ldGFSZWFkZXIuZ2V0UGlwZU1ldGFkYXRhKGV4cG9ydFJlZik7XG4gICAgICBpZiAocGlwZSAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoIWRlY2xhcmF0aW9ucy5oYXMoZXhwb3J0UmVmLm5vZGUpKSB7XG4gICAgICAgICAgcGlwZXMucHVzaCh0aGlzLm1heWJlQWxpYXMocGlwZSwgc291cmNlRmlsZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBpcGVzLnB1c2gocGlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEF0dGVtcHQgdG8gcHJvY2VzcyB0aGUgZXhwb3J0IGFzIGEgbW9kdWxlLlxuICAgICAgY29uc3QgZXhwb3J0U2NvcGUgPSB0aGlzLnJlc29sdmUoZXhwb3J0UmVmKTtcbiAgICAgIGlmIChleHBvcnRTY29wZSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBJdCBpcyBhIG1vZHVsZS4gQWRkIGV4cG9ydGVkIGRpcmVjdGl2ZXMgYW5kIHBpcGVzIHRvIHRoZSBjdXJyZW50IHNjb3BlLiBUaGlzIG1pZ2h0XG4gICAgICAgIC8vIGludm9sdmUgcmV3cml0aW5nIHRoZSBgUmVmZXJlbmNlYHMgdG8gdGhvc2UgdHlwZXMgdG8gaGF2ZSBhbiBhbGlhcyBleHByZXNzaW9uIGlmIG9uZSBpc1xuICAgICAgICAvLyByZXF1aXJlZC5cbiAgICAgICAgaWYgKHRoaXMuYWxpYXNHZW5lcmF0b3IgPT09IG51bGwpIHtcbiAgICAgICAgICAvLyBGYXN0IHBhdGggd2hlbiBhbGlhc2VzIGFyZW4ndCByZXF1aXJlZC5cbiAgICAgICAgICBkaXJlY3RpdmVzLnB1c2goLi4uZXhwb3J0U2NvcGUuZXhwb3J0ZWQuZGlyZWN0aXZlcyk7XG4gICAgICAgICAgcGlwZXMucHVzaCguLi5leHBvcnRTY29wZS5leHBvcnRlZC5waXBlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSXQncyBuZWNlc3NhcnkgdG8gcmV3cml0ZSB0aGUgYFJlZmVyZW5jZWBzIHRvIGFkZCBhbGlhcyBleHByZXNzaW9ucy4gVGhpcyB3YXksIGltcG9ydHNcbiAgICAgICAgICAvLyBnZW5lcmF0ZWQgdG8gdGhlc2UgZGlyZWN0aXZlcyBhbmQgcGlwZXMgd2lsbCB1c2UgYSBzaGFsbG93IGltcG9ydCB0byBgc291cmNlRmlsZWBcbiAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGEgZGVlcCBpbXBvcnQgZGlyZWN0bHkgdG8gdGhlIGRpcmVjdGl2ZSBvciBwaXBlIGNsYXNzLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gT25lIGltcG9ydGFudCBjaGVjayBoZXJlIGlzIHdoZXRoZXIgdGhlIGRpcmVjdGl2ZS9waXBlIGlzIGRlY2xhcmVkIGluIHRoZSBzYW1lXG4gICAgICAgICAgLy8gc291cmNlIGZpbGUgYXMgdGhlIHJlLWV4cG9ydGluZyBOZ01vZHVsZS4gVGhpcyBjYW4gaGFwcGVuIGlmIGJvdGggYSBkaXJlY3RpdmUsIGl0c1xuICAgICAgICAgIC8vIE5nTW9kdWxlLCBhbmQgdGhlIHJlLWV4cG9ydGluZyBOZ01vZHVsZSBhcmUgYWxsIGluIHRoZSBzYW1lIGZpbGUuIEluIHRoaXMgY2FzZSxcbiAgICAgICAgICAvLyBubyBpbXBvcnQgYWxpYXMgaXMgbmVlZGVkIGFzIGl0IHdvdWxkIGdvIHRvIHRoZSBzYW1lIGZpbGUgYW55d2F5LlxuICAgICAgICAgIGZvciAoY29uc3QgZGlyZWN0aXZlIG9mIGV4cG9ydFNjb3BlLmV4cG9ydGVkLmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgICAgIGRpcmVjdGl2ZXMucHVzaCh0aGlzLm1heWJlQWxpYXMoZGlyZWN0aXZlLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoY29uc3QgcGlwZSBvZiBleHBvcnRTY29wZS5leHBvcnRlZC5waXBlcykge1xuICAgICAgICAgICAgcGlwZXMucHVzaCh0aGlzLm1heWJlQWxpYXMocGlwZSwgc291cmNlRmlsZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIFRoZSBleHBvcnQgd2FzIG5vdCBhIGRpcmVjdGl2ZSwgYSBwaXBlLCBvciBhIG1vZHVsZS4gVGhpcyBpcyBhbiBlcnJvci5cbiAgICAgIC8vIFRPRE8oYWx4aHViKTogcHJvZHVjZSBhIHRzLkRpYWdub3N0aWNcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwb3J0ZWQgdmFsdWUgJHtleHBvcnRSZWYuZGVidWdOYW1lfSB3YXMgbm90IGEgZGlyZWN0aXZlLCBwaXBlLCBvciBtb2R1bGVgKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZXhwb3J0ZWQ6IHtkaXJlY3RpdmVzLCBwaXBlc30sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbWF5YmVBbGlhczxUIGV4dGVuZHMgRGlyZWN0aXZlTWV0YXxQaXBlTWV0YT4oZGlyT3JQaXBlOiBULCBtYXliZUFsaWFzRnJvbTogdHMuU291cmNlRmlsZSk6XG4gICAgICBUIHtcbiAgICBpZiAodGhpcy5hbGlhc0dlbmVyYXRvciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGRpck9yUGlwZTtcbiAgICB9XG4gICAgY29uc3QgcmVmID0gZGlyT3JQaXBlLnJlZjtcbiAgICBpZiAocmVmLm5vZGUuZ2V0U291cmNlRmlsZSgpICE9PSBtYXliZUFsaWFzRnJvbSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGlyT3JQaXBlLFxuICAgICAgICByZWY6IHJlZi5jbG9uZVdpdGhBbGlhcyh0aGlzLmFsaWFzR2VuZXJhdG9yLmFsaWFzVG8ocmVmLm5vZGUsIG1heWJlQWxpYXNGcm9tKSksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGlyT3JQaXBlO1xuICAgIH1cbiAgfVxufVxuIl19
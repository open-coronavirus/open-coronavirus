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
        define("@angular/compiler-cli/src/ngtsc/scope/src/local", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    /**
     * A registry which collects information about NgModules, Directives, Components, and Pipes which
     * are local (declared in the ts.Program being compiled), and can produce `LocalModuleScope`s
     * which summarize the compilation scope of a component.
     *
     * This class implements the logic of NgModule declarations, imports, and exports and can produce,
     * for a given component, the set of directives and pipes which are "visible" in that component's
     * template.
     *
     * The `LocalModuleScopeRegistry` has two "modes" of operation. During analysis, data for each
     * individual NgModule, Directive, Component, and Pipe is added to the registry. No attempt is made
     * to traverse or validate the NgModule graph (imports, exports, etc). After analysis, one of
     * `getScopeOfModule` or `getScopeForComponent` can be called, which traverses the NgModule graph
     * and applies the NgModule logic to generate a `LocalModuleScope`, the full scope for the given
     * module or component.
     *
     * The `LocalModuleScopeRegistry` is also capable of producing `ts.Diagnostic` errors when Angular
     * semantics are violated.
     */
    var LocalModuleScopeRegistry = /** @class */ (function () {
        function LocalModuleScopeRegistry(localReader, dependencyScopeReader, refEmitter, aliasGenerator) {
            this.localReader = localReader;
            this.dependencyScopeReader = dependencyScopeReader;
            this.refEmitter = refEmitter;
            this.aliasGenerator = aliasGenerator;
            /**
             * Tracks whether the registry has been asked to produce scopes for a module or component. Once
             * this is true, the registry cannot accept registrations of new directives/pipes/modules as it
             * would invalidate the cached scope data.
             */
            this.sealed = false;
            /**
             * A map of components from the current compilation unit to the NgModule which declared them.
             *
             * As components and directives are not distinguished at the NgModule level, this map may also
             * contain directives. This doesn't cause any problems but isn't useful as there is no concept of
             * a directive's compilation scope.
             */
            this.declarationToModule = new Map();
            this.moduleToRef = new Map();
            /**
             * A cache of calculated `LocalModuleScope`s for each NgModule declared in the current program.
             *
             * A value of `undefined` indicates the scope was invalid and produced errors (therefore,
             * diagnostics should exist in the `scopeErrors` map).
             */
            this.cache = new Map();
            /**
             * Tracks whether a given component requires "remote scoping".
             *
             * Remote scoping is when the set of directives which apply to a given component is set in the
             * NgModule's file instead of directly on the ngComponentDef (which is sometimes needed to get
             * around cyclic import issues). This is not used in calculation of `LocalModuleScope`s, but is
             * tracked here for convenience.
             */
            this.remoteScoping = new Set();
            /**
             * Tracks errors accumulated in the processing of scopes for each module declaration.
             */
            this.scopeErrors = new Map();
        }
        /**
         * Add an NgModule's data to the registry.
         */
        LocalModuleScopeRegistry.prototype.registerNgModuleMetadata = function (data) {
            var e_1, _a;
            this.assertCollecting();
            this.moduleToRef.set(data.ref.node, data.ref);
            try {
                for (var _b = tslib_1.__values(data.declarations), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var decl = _c.value;
                    this.declarationToModule.set(decl.node, data.ref.node);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        LocalModuleScopeRegistry.prototype.registerDirectiveMetadata = function (directive) { };
        LocalModuleScopeRegistry.prototype.registerPipeMetadata = function (pipe) { };
        LocalModuleScopeRegistry.prototype.getScopeForComponent = function (clazz) {
            if (!this.declarationToModule.has(clazz)) {
                return null;
            }
            return this.getScopeOfModule(this.declarationToModule.get(clazz));
        };
        /**
         * Collects registered data for a module and its directives/pipes and convert it into a full
         * `LocalModuleScope`.
         *
         * This method implements the logic of NgModule imports and exports. It returns the
         * `LocalModuleScope` for the given NgModule if one can be produced, and `null` if no scope is
         * available or the scope contains errors.
         */
        LocalModuleScopeRegistry.prototype.getScopeOfModule = function (clazz) {
            var scope = this.moduleToRef.has(clazz) ?
                this.getScopeOfModuleReference(this.moduleToRef.get(clazz)) :
                null;
            // Translate undefined -> null.
            return scope !== undefined ? scope : null;
        };
        /**
         * Retrieves any `ts.Diagnostic`s produced during the calculation of the `LocalModuleScope` for
         * the given NgModule, or `null` if no errors were present.
         */
        LocalModuleScopeRegistry.prototype.getDiagnosticsOfModule = function (clazz) {
            // Required to ensure the errors are populated for the given class. If it has been processed
            // before, this will be a no-op due to the scope cache.
            this.getScopeOfModule(clazz);
            if (this.scopeErrors.has(clazz)) {
                return this.scopeErrors.get(clazz);
            }
            else {
                return null;
            }
        };
        /**
         * Returns a collection of the compilation scope for each registered declaration.
         */
        LocalModuleScopeRegistry.prototype.getCompilationScopes = function () {
            var _this = this;
            var scopes = [];
            this.declarationToModule.forEach(function (ngModule, declaration) {
                var scope = _this.getScopeOfModule(ngModule);
                if (scope !== null) {
                    scopes.push(tslib_1.__assign({ declaration: declaration, ngModule: ngModule }, scope.compilation));
                }
            });
            return scopes;
        };
        /**
         * Implementation of `getScopeOfModule` which accepts a reference to a class and differentiates
         * between:
         *
         * * no scope being available (returns `null`)
         * * a scope being produced with errors (returns `undefined`).
         */
        LocalModuleScopeRegistry.prototype.getScopeOfModuleReference = function (ref) {
            var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e, e_7, _f, e_8, _g, e_9, _h, e_10, _j;
            var _this = this;
            if (this.cache.has(ref.node)) {
                return this.cache.get(ref.node);
            }
            // Seal the registry to protect the integrity of the `LocalModuleScope` cache.
            this.sealed = true;
            // `ref` should be an NgModule previously added to the registry. If not, a scope for it
            // cannot be produced.
            var ngModule = this.localReader.getNgModuleMetadata(ref);
            if (ngModule === null) {
                this.cache.set(ref.node, null);
                return null;
            }
            // Errors produced during computation of the scope are recorded here. At the end, if this array
            // isn't empty then `undefined` will be cached and returned to indicate this scope is invalid.
            var diagnostics = [];
            // At this point, the goal is to produce two distinct transitive sets:
            // - the directives and pipes which are visible to components declared in the NgModule.
            // - the directives and pipes which are exported to any NgModules which import this one.
            // Directives and pipes in the compilation scope.
            var compilationDirectives = new Map();
            var compilationPipes = new Map();
            var declared = new Set();
            var sourceFile = ref.node.getSourceFile();
            // Directives and pipes exported to any importing NgModules.
            var exportDirectives = new Map();
            var exportPipes = new Map();
            try {
                // The algorithm is as follows:
                // 1) Add directives/pipes declared in the NgModule to the compilation scope.
                // 2) Add all of the directives/pipes from each NgModule imported into the current one to the
                //    compilation scope. At this point, the compilation scope is complete.
                // 3) For each entry in the NgModule's exports:
                //    a) Attempt to resolve it as an NgModule with its own exported directives/pipes. If it is
                //       one, add them to the export scope of this NgModule.
                //    b) Otherwise, it should be a class in the compilation scope of this NgModule. If it is,
                //       add it to the export scope.
                //    c) If it's neither an NgModule nor a directive/pipe in the compilation scope, then this
                //       is an error.
                // 1) add declarations.
                for (var _k = tslib_1.__values(ngModule.declarations), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var decl = _l.value;
                    var directive = this.localReader.getDirectiveMetadata(decl);
                    var pipe = this.localReader.getPipeMetadata(decl);
                    if (directive !== null) {
                        compilationDirectives.set(decl.node, tslib_1.__assign({}, directive, { ref: decl }));
                    }
                    else if (pipe !== null) {
                        compilationPipes.set(decl.node, tslib_1.__assign({}, pipe, { ref: decl }));
                    }
                    else {
                        // TODO(alxhub): produce a ts.Diagnostic. This can't be an error right now since some
                        // ngtools tests rely on analysis of broken components.
                        continue;
                    }
                    declared.add(decl.node);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_a = _k.return)) _a.call(_k);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                // 2) process imports.
                for (var _m = tslib_1.__values(ngModule.imports), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var decl = _o.value;
                    var importScope = this.getExportedScope(decl, diagnostics, ref.node, 'import');
                    if (importScope === null) {
                        // An import wasn't an NgModule, so record an error.
                        diagnostics.push(invalidRef(ref.node, decl, 'import'));
                        continue;
                    }
                    else if (importScope === undefined) {
                        // An import was an NgModule but contained errors of its own. Record this as an error too,
                        // because this scope is always going to be incorrect if one of its imports could not be
                        // read.
                        diagnostics.push(invalidTransitiveNgModuleRef(ref.node, decl, 'import'));
                        continue;
                    }
                    try {
                        for (var _p = (e_4 = void 0, tslib_1.__values(importScope.exported.directives)), _q = _p.next(); !_q.done; _q = _p.next()) {
                            var directive = _q.value;
                            compilationDirectives.set(directive.ref.node, directive);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_q && !_q.done && (_c = _p.return)) _c.call(_p);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    try {
                        for (var _r = (e_5 = void 0, tslib_1.__values(importScope.exported.pipes)), _s = _r.next(); !_s.done; _s = _r.next()) {
                            var pipe = _s.value;
                            compilationPipes.set(pipe.ref.node, pipe);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_s && !_s.done && (_d = _r.return)) _d.call(_r);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_b = _m.return)) _b.call(_m);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                // 3) process exports.
                // Exports can contain modules, components, or directives. They're processed differently.
                // Modules are straightforward. Directives and pipes from exported modules are added to the
                // export maps. Directives/pipes are different - they might be exports of declared types or
                // imported types.
                for (var _t = tslib_1.__values(ngModule.exports), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var decl = _u.value;
                    // Attempt to resolve decl as an NgModule.
                    var importScope = this.getExportedScope(decl, diagnostics, ref.node, 'export');
                    if (importScope === undefined) {
                        // An export was an NgModule but contained errors of its own. Record this as an error too,
                        // because this scope is always going to be incorrect if one of its exports could not be
                        // read.
                        diagnostics.push(invalidTransitiveNgModuleRef(ref.node, decl, 'export'));
                        continue;
                    }
                    else if (importScope !== null) {
                        try {
                            // decl is an NgModule.
                            for (var _v = (e_7 = void 0, tslib_1.__values(importScope.exported.directives)), _w = _v.next(); !_w.done; _w = _v.next()) {
                                var directive = _w.value;
                                exportDirectives.set(directive.ref.node, directive);
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_w && !_w.done && (_f = _v.return)) _f.call(_v);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        try {
                            for (var _x = (e_8 = void 0, tslib_1.__values(importScope.exported.pipes)), _y = _x.next(); !_y.done; _y = _x.next()) {
                                var pipe = _y.value;
                                exportPipes.set(pipe.ref.node, pipe);
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (_y && !_y.done && (_g = _x.return)) _g.call(_x);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                    }
                    else if (compilationDirectives.has(decl.node)) {
                        // decl is a directive or component in the compilation scope of this NgModule.
                        var directive = compilationDirectives.get(decl.node);
                        exportDirectives.set(decl.node, directive);
                    }
                    else if (compilationPipes.has(decl.node)) {
                        // decl is a pipe in the compilation scope of this NgModule.
                        var pipe = compilationPipes.get(decl.node);
                        exportPipes.set(decl.node, pipe);
                    }
                    else {
                        // decl is an unknown export.
                        if (this.localReader.getDirectiveMetadata(decl) !== null ||
                            this.localReader.getPipeMetadata(decl) !== null) {
                            diagnostics.push(invalidReexport(ref.node, decl));
                        }
                        else {
                            diagnostics.push(invalidRef(ref.node, decl, 'export'));
                        }
                        continue;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_e = _t.return)) _e.call(_t);
                }
                finally { if (e_6) throw e_6.error; }
            }
            var exported = {
                directives: Array.from(exportDirectives.values()),
                pipes: Array.from(exportPipes.values()),
            };
            var reexports = null;
            if (this.aliasGenerator !== null) {
                reexports = [];
                var addReexport = function (ref) {
                    if (!declared.has(ref.node) && ref.node.getSourceFile() !== sourceFile) {
                        var exportName = _this.aliasGenerator.aliasSymbolName(ref.node, sourceFile);
                        if (ref.alias && ref.alias instanceof compiler_1.ExternalExpr) {
                            reexports.push({
                                fromModule: ref.alias.value.moduleName,
                                symbolName: ref.alias.value.name,
                                asAlias: exportName,
                            });
                        }
                        else {
                            var expr = _this.refEmitter.emit(ref.cloneWithNoIdentifiers(), sourceFile);
                            if (!(expr instanceof compiler_1.ExternalExpr) || expr.value.moduleName === null ||
                                expr.value.name === null) {
                                throw new Error('Expected ExternalExpr');
                            }
                            reexports.push({
                                fromModule: expr.value.moduleName,
                                symbolName: expr.value.name,
                                asAlias: exportName,
                            });
                        }
                    }
                };
                try {
                    for (var _z = tslib_1.__values(exported.directives), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                        var ref_1 = _0.value.ref;
                        addReexport(ref_1);
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (_0 && !_0.done && (_h = _z.return)) _h.call(_z);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
                try {
                    for (var _1 = tslib_1.__values(exported.pipes), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                        var ref_2 = _2.value.ref;
                        addReexport(ref_2);
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (_2 && !_2.done && (_j = _1.return)) _j.call(_1);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            }
            // Check if this scope had any errors during production.
            if (diagnostics.length > 0) {
                // Cache undefined, to mark the fact that the scope is invalid.
                this.cache.set(ref.node, undefined);
                // Save the errors for retrieval.
                this.scopeErrors.set(ref.node, diagnostics);
                // Return undefined to indicate the scope is invalid.
                this.cache.set(ref.node, undefined);
                return undefined;
            }
            // Finally, produce the `LocalModuleScope` with both the compilation and export scopes.
            var scope = {
                compilation: {
                    directives: Array.from(compilationDirectives.values()),
                    pipes: Array.from(compilationPipes.values()),
                },
                exported: exported,
                reexports: reexports,
            };
            this.cache.set(ref.node, scope);
            return scope;
        };
        /**
         * Check whether a component requires remote scoping.
         */
        LocalModuleScopeRegistry.prototype.getRequiresRemoteScope = function (node) { return this.remoteScoping.has(node); };
        /**
         * Set a component as requiring remote scoping.
         */
        LocalModuleScopeRegistry.prototype.setComponentAsRequiringRemoteScoping = function (node) {
            this.remoteScoping.add(node);
        };
        /**
         * Look up the `ExportScope` of a given `Reference` to an NgModule.
         *
         * The NgModule in question may be declared locally in the current ts.Program, or it may be
         * declared in a .d.ts file.
         *
         * @returns `null` if no scope could be found, or `undefined` if an invalid scope
         * was found.
         *
         * May also contribute diagnostics of its own by adding to the given `diagnostics`
         * array parameter.
         */
        LocalModuleScopeRegistry.prototype.getExportedScope = function (ref, diagnostics, ownerForErrors, type) {
            if (ref.node.getSourceFile().isDeclarationFile) {
                // The NgModule is declared in a .d.ts file. Resolve it with the `DependencyScopeReader`.
                if (!ts.isClassDeclaration(ref.node)) {
                    // The NgModule is in a .d.ts file but is not declared as a ts.ClassDeclaration. This is an
                    // error in the .d.ts metadata.
                    var code = type === 'import' ? diagnostics_1.ErrorCode.NGMODULE_INVALID_IMPORT :
                        diagnostics_1.ErrorCode.NGMODULE_INVALID_EXPORT;
                    diagnostics.push(diagnostics_1.makeDiagnostic(code, typescript_1.identifierOfNode(ref.node) || ref.node, "Appears in the NgModule." + type + "s of " + typescript_1.nodeNameForError(ownerForErrors) + ", but could not be resolved to an NgModule"));
                    return undefined;
                }
                return this.dependencyScopeReader.resolve(ref);
            }
            else {
                // The NgModule is declared locally in the current program. Resolve it from the registry.
                return this.getScopeOfModuleReference(ref);
            }
        };
        LocalModuleScopeRegistry.prototype.assertCollecting = function () {
            if (this.sealed) {
                throw new Error("Assertion: LocalModuleScopeRegistry is not COLLECTING");
            }
        };
        return LocalModuleScopeRegistry;
    }());
    exports.LocalModuleScopeRegistry = LocalModuleScopeRegistry;
    /**
     * Produce a `ts.Diagnostic` for an invalid import or export from an NgModule.
     */
    function invalidRef(clazz, decl, type) {
        var code = type === 'import' ? diagnostics_1.ErrorCode.NGMODULE_INVALID_IMPORT : diagnostics_1.ErrorCode.NGMODULE_INVALID_EXPORT;
        var resolveTarget = type === 'import' ? 'NgModule' : 'NgModule, Component, Directive, or Pipe';
        return diagnostics_1.makeDiagnostic(code, typescript_1.identifierOfNode(decl.node) || decl.node, "Appears in the NgModule." + type + "s of " + typescript_1.nodeNameForError(clazz) + ", but could not be resolved to an " + resolveTarget + " class");
    }
    /**
     * Produce a `ts.Diagnostic` for an import or export which itself has errors.
     */
    function invalidTransitiveNgModuleRef(clazz, decl, type) {
        var code = type === 'import' ? diagnostics_1.ErrorCode.NGMODULE_INVALID_IMPORT : diagnostics_1.ErrorCode.NGMODULE_INVALID_EXPORT;
        return diagnostics_1.makeDiagnostic(code, typescript_1.identifierOfNode(decl.node) || decl.node, "Appears in the NgModule." + type + "s of " + typescript_1.nodeNameForError(clazz) + ", but itself has errors");
    }
    /**
     * Produce a `ts.Diagnostic` for an exported directive or pipe which was not declared or imported
     * by the NgModule in question.
     */
    function invalidReexport(clazz, decl) {
        return diagnostics_1.makeDiagnostic(diagnostics_1.ErrorCode.NGMODULE_INVALID_REEXPORT, typescript_1.identifierOfNode(decl.node) || decl.node, "Present in the NgModule.exports of " + typescript_1.nodeNameForError(clazz) + " but neither declared nor imported");
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3Njb3BlL3NyYy9sb2NhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBK0M7SUFDL0MsK0JBQWlDO0lBRWpDLDJFQUE0RDtJQUk1RCxrRkFBNkU7SUEwQjdFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSDtRQTBDRSxrQ0FDWSxXQUEyQixFQUFVLHFCQUE2QyxFQUNsRixVQUE0QixFQUFVLGNBQW1DO1lBRHpFLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtZQUFVLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBd0I7WUFDbEYsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7WUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBcUI7WUEzQ3JGOzs7O2VBSUc7WUFDSyxXQUFNLEdBQUcsS0FBSyxDQUFDO1lBRXZCOzs7Ozs7ZUFNRztZQUNLLHdCQUFtQixHQUFHLElBQUksR0FBRyxFQUFzQyxDQUFDO1lBRXBFLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQWlELENBQUM7WUFFL0U7Ozs7O2VBS0c7WUFDSyxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQXFELENBQUM7WUFFN0U7Ozs7Ozs7ZUFPRztZQUNLLGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7WUFFcEQ7O2VBRUc7WUFDSyxnQkFBVyxHQUFHLElBQUksR0FBRyxFQUFxQyxDQUFDO1FBSXFCLENBQUM7UUFFekY7O1dBRUc7UUFDSCwyREFBd0IsR0FBeEIsVUFBeUIsSUFBa0I7O1lBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMs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Q0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLHlDQUF5QyxDQUFDO1FBQ2pHLE9BQU8sNEJBQWMsQ0FDakIsSUFBSSxFQUFFLDZCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUM5Qyw2QkFBMkIsSUFBSSxhQUFRLDZCQUFnQixDQUFDLEtBQUssQ0FBQywwQ0FBcUMsYUFBYSxXQUFRLENBQUMsQ0FBQztJQUNoSSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLDRCQUE0QixDQUNqQyxLQUFxQixFQUFFLElBQStCLEVBQ3RELElBQXlCO1FBQzNCLElBQU0sSUFBSSxHQUNOLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLHVCQUFTLENBQUMsdUJBQXVCLENBQUM7UUFDOUYsT0FBTyw0QkFBYyxDQUNqQixJQUFJLEVBQUUsNkJBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQzlDLDZCQUEyQixJQUFJLGFBQVEsNkJBQWdCLENBQUMsS0FBSyxDQUFDLDRCQUF5QixDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsZUFBZSxDQUFDLEtBQXFCLEVBQUUsSUFBK0I7UUFDN0UsT0FBTyw0QkFBYyxDQUNqQix1QkFBUyxDQUFDLHlCQUF5QixFQUFFLDZCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUM3RSx3Q0FBc0MsNkJBQWdCLENBQUMsS0FBSyxDQUFDLHVDQUFvQyxDQUFDLENBQUM7SUFDekcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFeHRlcm5hbEV4cHJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Vycm9yQ29kZSwgbWFrZURpYWdub3N0aWN9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QWxpYXNHZW5lcmF0b3IsIFJlZXhwb3J0LCBSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXR0ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtEaXJlY3RpdmVNZXRhLCBMb2NhbE1ldGFkYXRhUmVnaXN0cnksIE1ldGFkYXRhUmVhZGVyLCBNZXRhZGF0YVJlZ2lzdHJ5LCBOZ01vZHVsZU1ldGEsIFBpcGVNZXRhfSBmcm9tICcuLi8uLi9tZXRhZGF0YSc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtpZGVudGlmaWVyT2ZOb2RlLCBub2RlTmFtZUZvckVycm9yfSBmcm9tICcuLi8uLi91dGlsL3NyYy90eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFeHBvcnRTY29wZSwgU2NvcGVEYXRhfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge0R0c01vZHVsZVNjb3BlUmVzb2x2ZXJ9IGZyb20gJy4vZGVwZW5kZW5jeSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxOZ01vZHVsZURhdGEge1xuICBkZWNsYXJhdGlvbnM6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdO1xuICBpbXBvcnRzOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj5bXTtcbiAgZXhwb3J0czogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxNb2R1bGVTY29wZSBleHRlbmRzIEV4cG9ydFNjb3BlIHtcbiAgY29tcGlsYXRpb246IFNjb3BlRGF0YTtcbiAgcmVleHBvcnRzOiBSZWV4cG9ydFtdfG51bGw7XG59XG5cbi8qKlxuICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNvbXBpbGF0aW9uIHNjb3BlIG9mIGEgcmVnaXN0ZXJlZCBkZWNsYXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21waWxhdGlvblNjb3BlIGV4dGVuZHMgU2NvcGVEYXRhIHtcbiAgLyoqIFRoZSBkZWNsYXJhdGlvbiB3aG9zZSBjb21waWxhdGlvbiBzY29wZSBpcyBkZXNjcmliZWQgaGVyZS4gKi9cbiAgZGVjbGFyYXRpb246IENsYXNzRGVjbGFyYXRpb247XG4gIC8qKiBUaGUgZGVjbGFyYXRpb24gb2YgdGhlIE5nTW9kdWxlIHRoYXQgZGVjbGFyZXMgdGhpcyBgZGVjbGFyYXRpb25gLiAqL1xuICBuZ01vZHVsZTogQ2xhc3NEZWNsYXJhdGlvbjtcbn1cblxuLyoqXG4gKiBBIHJlZ2lzdHJ5IHdoaWNoIGNvbGxlY3RzIGluZm9ybWF0aW9uIGFib3V0IE5nTW9kdWxlcywgRGlyZWN0aXZlcywgQ29tcG9uZW50cywgYW5kIFBpcGVzIHdoaWNoXG4gKiBhcmUgbG9jYWwgKGRlY2xhcmVkIGluIHRoZSB0cy5Qcm9ncmFtIGJlaW5nIGNvbXBpbGVkKSwgYW5kIGNhbiBwcm9kdWNlIGBMb2NhbE1vZHVsZVNjb3BlYHNcbiAqIHdoaWNoIHN1bW1hcml6ZSB0aGUgY29tcGlsYXRpb24gc2NvcGUgb2YgYSBjb21wb25lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpbXBsZW1lbnRzIHRoZSBsb2dpYyBvZiBOZ01vZHVsZSBkZWNsYXJhdGlvbnMsIGltcG9ydHMsIGFuZCBleHBvcnRzIGFuZCBjYW4gcHJvZHVjZSxcbiAqIGZvciBhIGdpdmVuIGNvbXBvbmVudCwgdGhlIHNldCBvZiBkaXJlY3RpdmVzIGFuZCBwaXBlcyB3aGljaCBhcmUgXCJ2aXNpYmxlXCIgaW4gdGhhdCBjb21wb25lbnQnc1xuICogdGVtcGxhdGUuXG4gKlxuICogVGhlIGBMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnlgIGhhcyB0d28gXCJtb2Rlc1wiIG9mIG9wZXJhdGlvbi4gRHVyaW5nIGFuYWx5c2lzLCBkYXRhIGZvciBlYWNoXG4gKiBpbmRpdmlkdWFsIE5nTW9kdWxlLCBEaXJlY3RpdmUsIENvbXBvbmVudCwgYW5kIFBpcGUgaXMgYWRkZWQgdG8gdGhlIHJlZ2lzdHJ5LiBObyBhdHRlbXB0IGlzIG1hZGVcbiAqIHRvIHRyYXZlcnNlIG9yIHZhbGlkYXRlIHRoZSBOZ01vZHVsZSBncmFwaCAoaW1wb3J0cywgZXhwb3J0cywgZXRjKS4gQWZ0ZXIgYW5hbHlzaXMsIG9uZSBvZlxuICogYGdldFNjb3BlT2ZNb2R1bGVgIG9yIGBnZXRTY29wZUZvckNvbXBvbmVudGAgY2FuIGJlIGNhbGxlZCwgd2hpY2ggdHJhdmVyc2VzIHRoZSBOZ01vZHVsZSBncmFwaFxuICogYW5kIGFwcGxpZXMgdGhlIE5nTW9kdWxlIGxvZ2ljIHRvIGdlbmVyYXRlIGEgYExvY2FsTW9kdWxlU2NvcGVgLCB0aGUgZnVsbCBzY29wZSBmb3IgdGhlIGdpdmVuXG4gKiBtb2R1bGUgb3IgY29tcG9uZW50LlxuICpcbiAqIFRoZSBgTG9jYWxNb2R1bGVTY29wZVJlZ2lzdHJ5YCBpcyBhbHNvIGNhcGFibGUgb2YgcHJvZHVjaW5nIGB0cy5EaWFnbm9zdGljYCBlcnJvcnMgd2hlbiBBbmd1bGFyXG4gKiBzZW1hbnRpY3MgYXJlIHZpb2xhdGVkLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxNb2R1bGVTY29wZVJlZ2lzdHJ5IGltcGxlbWVudHMgTWV0YWRhdGFSZWdpc3RyeSB7XG4gIC8qKlxuICAgKiBUcmFja3Mgd2hldGhlciB0aGUgcmVnaXN0cnkgaGFzIGJlZW4gYXNrZWQgdG8gcHJvZHVjZSBzY29wZXMgZm9yIGEgbW9kdWxlIG9yIGNvbXBvbmVudC4gT25jZVxuICAgKiB0aGlzIGlzIHRydWUsIHRoZSByZWdpc3RyeSBjYW5ub3QgYWNjZXB0IHJlZ2lzdHJhdGlvbnMgb2YgbmV3IGRpcmVjdGl2ZXMvcGlwZXMvbW9kdWxlcyBhcyBpdFxuICAgKiB3b3VsZCBpbnZhbGlkYXRlIHRoZSBjYWNoZWQgc2NvcGUgZGF0YS5cbiAgICovXG4gIHByaXZhdGUgc2VhbGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgbWFwIG9mIGNvbXBvbmVudHMgZnJvbSB0aGUgY3VycmVudCBjb21waWxhdGlvbiB1bml0IHRvIHRoZSBOZ01vZHVsZSB3aGljaCBkZWNsYXJlZCB0aGVtLlxuICAgKlxuICAgKiBBcyBjb21wb25lbnRzIGFuZCBkaXJlY3RpdmVzIGFyZSBub3QgZGlzdGluZ3Vpc2hlZCBhdCB0aGUgTmdNb2R1bGUgbGV2ZWwsIHRoaXMgbWFwIG1heSBhbHNvXG4gICAqIGNvbnRhaW4gZGlyZWN0aXZlcy4gVGhpcyBkb2Vzbid0IGNhdXNlIGFueSBwcm9ibGVtcyBidXQgaXNuJ3QgdXNlZnVsIGFzIHRoZXJlIGlzIG5vIGNvbmNlcHQgb2ZcbiAgICogYSBkaXJlY3RpdmUncyBjb21waWxhdGlvbiBzY29wZS5cbiAgICovXG4gIHByaXZhdGUgZGVjbGFyYXRpb25Ub01vZHVsZSA9IG5ldyBNYXA8Q2xhc3NEZWNsYXJhdGlvbiwgQ2xhc3NEZWNsYXJhdGlvbj4oKTtcblxuICBwcml2YXRlIG1vZHVsZVRvUmVmID0gbmV3IE1hcDxDbGFzc0RlY2xhcmF0aW9uLCBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4+KCk7XG5cbiAgLyoqXG4gICAqIEEgY2FjaGUgb2YgY2FsY3VsYXRlZCBgTG9jYWxNb2R1bGVTY29wZWBzIGZvciBlYWNoIE5nTW9kdWxlIGRlY2xhcmVkIGluIHRoZSBjdXJyZW50IHByb2dyYW0uXG4gICAqXG4gICAqIEEgdmFsdWUgb2YgYHVuZGVmaW5lZGAgaW5kaWNhdGVzIHRoZSBzY29wZSB3YXMgaW52YWxpZCBhbmQgcHJvZHVjZWQgZXJyb3JzICh0aGVyZWZvcmUsXG4gICAqIGRpYWdub3N0aWNzIHNob3VsZCBleGlzdCBpbiB0aGUgYHNjb3BlRXJyb3JzYCBtYXApLlxuICAgKi9cbiAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBNYXA8Q2xhc3NEZWNsYXJhdGlvbiwgTG9jYWxNb2R1bGVTY29wZXx1bmRlZmluZWR8bnVsbD4oKTtcblxuICAvKipcbiAgICogVHJhY2tzIHdoZXRoZXIgYSBnaXZlbiBjb21wb25lbnQgcmVxdWlyZXMgXCJyZW1vdGUgc2NvcGluZ1wiLlxuICAgKlxuICAgKiBSZW1vdGUgc2NvcGluZyBpcyB3aGVuIHRoZSBzZXQgb2YgZGlyZWN0aXZlcyB3aGljaCBhcHBseSB0byBhIGdpdmVuIGNvbXBvbmVudCBpcyBzZXQgaW4gdGhlXG4gICAqIE5nTW9kdWxlJ3MgZmlsZSBpbnN0ZWFkIG9mIGRpcmVjdGx5IG9uIHRoZSBuZ0NvbXBvbmVudERlZiAod2hpY2ggaXMgc29tZXRpbWVzIG5lZWRlZCB0byBnZXRcbiAgICogYXJvdW5kIGN5Y2xpYyBpbXBvcnQgaXNzdWVzKS4gVGhpcyBpcyBub3QgdXNlZCBpbiBjYWxjdWxhdGlvbiBvZiBgTG9jYWxNb2R1bGVTY29wZWBzLCBidXQgaXNcbiAgICogdHJhY2tlZCBoZXJlIGZvciBjb252ZW5pZW5jZS5cbiAgICovXG4gIHByaXZhdGUgcmVtb3RlU2NvcGluZyA9IG5ldyBTZXQ8Q2xhc3NEZWNsYXJhdGlvbj4oKTtcblxuICAvKipcbiAgICogVHJhY2tzIGVycm9ycyBhY2N1bXVsYXRlZCBpbiB0aGUgcHJvY2Vzc2luZyBvZiBzY29wZXMgZm9yIGVhY2ggbW9kdWxlIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBzY29wZUVycm9ycyA9IG5ldyBNYXA8Q2xhc3NEZWNsYXJhdGlvbiwgdHMuRGlhZ25vc3RpY1tdPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBsb2NhbFJlYWRlcjogTWV0YWRhdGFSZWFkZXIsIHByaXZhdGUgZGVwZW5kZW5jeVNjb3BlUmVhZGVyOiBEdHNNb2R1bGVTY29wZVJlc29sdmVyLFxuICAgICAgcHJpdmF0ZSByZWZFbWl0dGVyOiBSZWZlcmVuY2VFbWl0dGVyLCBwcml2YXRlIGFsaWFzR2VuZXJhdG9yOiBBbGlhc0dlbmVyYXRvcnxudWxsKSB7fVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gTmdNb2R1bGUncyBkYXRhIHRvIHRoZSByZWdpc3RyeS5cbiAgICovXG4gIHJlZ2lzdGVyTmdNb2R1bGVNZXRhZGF0YShkYXRhOiBOZ01vZHVsZU1ldGEpOiB2b2lkIHtcbiAgICB0aGlzLmFzc2VydENvbGxlY3RpbmcoKTtcbiAgICB0aGlzLm1vZHVsZVRvUmVmLnNldChkYXRhLnJlZi5ub2RlLCBkYXRhLnJlZik7XG4gICAgZm9yIChjb25zdCBkZWNsIG9mIGRhdGEuZGVjbGFyYXRpb25zKSB7XG4gICAgICB0aGlzLmRlY2xhcmF0aW9uVG9Nb2R1bGUuc2V0KGRlY2wubm9kZSwgZGF0YS5yZWYubm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJEaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmU6IERpcmVjdGl2ZU1ldGEpOiB2b2lkIHt9XG5cbiAgcmVnaXN0ZXJQaXBlTWV0YWRhdGEocGlwZTogUGlwZU1ldGEpOiB2b2lkIHt9XG5cbiAgZ2V0U2NvcGVGb3JDb21wb25lbnQoY2xheno6IENsYXNzRGVjbGFyYXRpb24pOiBMb2NhbE1vZHVsZVNjb3BlfG51bGwge1xuICAgIGlmICghdGhpcy5kZWNsYXJhdGlvblRvTW9kdWxlLmhhcyhjbGF6eikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRTY29wZU9mTW9kdWxlKHRoaXMuZGVjbGFyYXRpb25Ub01vZHVsZS5nZXQoY2xhenopICEpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3RzIHJlZ2lzdGVyZWQgZGF0YSBmb3IgYSBtb2R1bGUgYW5kIGl0cyBkaXJlY3RpdmVzL3BpcGVzIGFuZCBjb252ZXJ0IGl0IGludG8gYSBmdWxsXG4gICAqIGBMb2NhbE1vZHVsZVNjb3BlYC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaW1wbGVtZW50cyB0aGUgbG9naWMgb2YgTmdNb2R1bGUgaW1wb3J0cyBhbmQgZXhwb3J0cy4gSXQgcmV0dXJucyB0aGVcbiAgICogYExvY2FsTW9kdWxlU2NvcGVgIGZvciB0aGUgZ2l2ZW4gTmdNb2R1bGUgaWYgb25lIGNhbiBiZSBwcm9kdWNlZCwgYW5kIGBudWxsYCBpZiBubyBzY29wZSBpc1xuICAgKiBhdmFpbGFibGUgb3IgdGhlIHNjb3BlIGNvbnRhaW5zIGVycm9ycy5cbiAgICovXG4gIGdldFNjb3BlT2ZNb2R1bGUoY2xheno6IENsYXNzRGVjbGFyYXRpb24pOiBMb2NhbE1vZHVsZVNjb3BlfG51bGwge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5tb2R1bGVUb1JlZi5oYXMoY2xhenopID9cbiAgICAgICAgdGhpcy5nZXRTY29wZU9mTW9kdWxlUmVmZXJlbmNlKHRoaXMubW9kdWxlVG9SZWYuZ2V0KGNsYXp6KSAhKSA6XG4gICAgICAgIG51bGw7XG4gICAgLy8gVHJhbnNsYXRlIHVuZGVmaW5lZCAtPiBudWxsLlxuICAgIHJldHVybiBzY29wZSAhPT0gdW5kZWZpbmVkID8gc2NvcGUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhbnkgYHRzLkRpYWdub3N0aWNgcyBwcm9kdWNlZCBkdXJpbmcgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZSBgTG9jYWxNb2R1bGVTY29wZWAgZm9yXG4gICAqIHRoZSBnaXZlbiBOZ01vZHVsZSwgb3IgYG51bGxgIGlmIG5vIGVycm9ycyB3ZXJlIHByZXNlbnQuXG4gICAqL1xuICBnZXREaWFnbm9zdGljc09mTW9kdWxlKGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uKTogdHMuRGlhZ25vc3RpY1tdfG51bGwge1xuICAgIC8vIFJlcXVpcmVkIHRvIGVuc3VyZSB0aGUgZXJyb3JzIGFyZSBwb3B1bGF0ZWQgZm9yIHRoZSBnaXZlbiBjbGFzcy4gSWYgaXQgaGFzIGJlZW4gcHJvY2Vzc2VkXG4gICAgLy8gYmVmb3JlLCB0aGlzIHdpbGwgYmUgYSBuby1vcCBkdWUgdG8gdGhlIHNjb3BlIGNhY2hlLlxuICAgIHRoaXMuZ2V0U2NvcGVPZk1vZHVsZShjbGF6eik7XG5cbiAgICBpZiAodGhpcy5zY29wZUVycm9ycy5oYXMoY2xhenopKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY29wZUVycm9ycy5nZXQoY2xhenopICE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29sbGVjdGlvbiBvZiB0aGUgY29tcGlsYXRpb24gc2NvcGUgZm9yIGVhY2ggcmVnaXN0ZXJlZCBkZWNsYXJhdGlvbi5cbiAgICovXG4gIGdldENvbXBpbGF0aW9uU2NvcGVzKCk6IENvbXBpbGF0aW9uU2NvcGVbXSB7XG4gICAgY29uc3Qgc2NvcGVzOiBDb21waWxhdGlvblNjb3BlW10gPSBbXTtcbiAgICB0aGlzLmRlY2xhcmF0aW9uVG9Nb2R1bGUuZm9yRWFjaCgobmdNb2R1bGUsIGRlY2xhcmF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBzY29wZSA9IHRoaXMuZ2V0U2NvcGVPZk1vZHVsZShuZ01vZHVsZSk7XG4gICAgICBpZiAoc2NvcGUgIT09IG51bGwpIHtcbiAgICAgICAgc2NvcGVzLnB1c2goe2RlY2xhcmF0aW9uLCBuZ01vZHVsZSwgLi4uc2NvcGUuY29tcGlsYXRpb259KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc2NvcGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGF0aW9uIG9mIGBnZXRTY29wZU9mTW9kdWxlYCB3aGljaCBhY2NlcHRzIGEgcmVmZXJlbmNlIHRvIGEgY2xhc3MgYW5kIGRpZmZlcmVudGlhdGVzXG4gICAqIGJldHdlZW46XG4gICAqXG4gICAqICogbm8gc2NvcGUgYmVpbmcgYXZhaWxhYmxlIChyZXR1cm5zIGBudWxsYClcbiAgICogKiBhIHNjb3BlIGJlaW5nIHByb2R1Y2VkIHdpdGggZXJyb3JzIChyZXR1cm5zIGB1bmRlZmluZWRgKS5cbiAgICovXG4gIHByaXZhdGUgZ2V0U2NvcGVPZk1vZHVsZVJlZmVyZW5jZShyZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPik6IExvY2FsTW9kdWxlU2NvcGV8bnVsbFxuICAgICAgfHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY2FjaGUuaGFzKHJlZi5ub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0KHJlZi5ub2RlKTtcbiAgICB9XG5cbiAgICAvLyBTZWFsIHRoZSByZWdpc3RyeSB0byBwcm90ZWN0IHRoZSBpbnRlZ3JpdHkgb2YgdGhlIGBMb2NhbE1vZHVsZVNjb3BlYCBjYWNoZS5cbiAgICB0aGlzLnNlYWxlZCA9IHRydWU7XG5cbiAgICAvLyBgcmVmYCBzaG91bGQgYmUgYW4gTmdNb2R1bGUgcHJldmlvdXNseSBhZGRlZCB0byB0aGUgcmVnaXN0cnkuIElmIG5vdCwgYSBzY29wZSBmb3IgaXRcbiAgICAvLyBjYW5ub3QgYmUgcHJvZHVjZWQuXG4gICAgY29uc3QgbmdNb2R1bGUgPSB0aGlzLmxvY2FsUmVhZGVyLmdldE5nTW9kdWxlTWV0YWRhdGEocmVmKTtcbiAgICBpZiAobmdNb2R1bGUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuY2FjaGUuc2V0KHJlZi5ub2RlLCBudWxsKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBwcm9kdWNlZCBkdXJpbmcgY29tcHV0YXRpb24gb2YgdGhlIHNjb3BlIGFyZSByZWNvcmRlZCBoZXJlLiBBdCB0aGUgZW5kLCBpZiB0aGlzIGFycmF5XG4gICAgLy8gaXNuJ3QgZW1wdHkgdGhlbiBgdW5kZWZpbmVkYCB3aWxsIGJlIGNhY2hlZCBhbmQgcmV0dXJuZWQgdG8gaW5kaWNhdGUgdGhpcyBzY29wZSBpcyBpbnZhbGlkLlxuICAgIGNvbnN0IGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcblxuICAgIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBnb2FsIGlzIHRvIHByb2R1Y2UgdHdvIGRpc3RpbmN0IHRyYW5zaXRpdmUgc2V0czpcbiAgICAvLyAtIHRoZSBkaXJlY3RpdmVzIGFuZCBwaXBlcyB3aGljaCBhcmUgdmlzaWJsZSB0byBjb21wb25lbnRzIGRlY2xhcmVkIGluIHRoZSBOZ01vZHVsZS5cbiAgICAvLyAtIHRoZSBkaXJlY3RpdmVzIGFuZCBwaXBlcyB3aGljaCBhcmUgZXhwb3J0ZWQgdG8gYW55IE5nTW9kdWxlcyB3aGljaCBpbXBvcnQgdGhpcyBvbmUuXG5cbiAgICAvLyBEaXJlY3RpdmVzIGFuZCBwaXBlcyBpbiB0aGUgY29tcGlsYXRpb24gc2NvcGUuXG4gICAgY29uc3QgY29tcGlsYXRpb25EaXJlY3RpdmVzID0gbmV3IE1hcDx0cy5EZWNsYXJhdGlvbiwgRGlyZWN0aXZlTWV0YT4oKTtcbiAgICBjb25zdCBjb21waWxhdGlvblBpcGVzID0gbmV3IE1hcDx0cy5EZWNsYXJhdGlvbiwgUGlwZU1ldGE+KCk7XG5cbiAgICBjb25zdCBkZWNsYXJlZCA9IG5ldyBTZXQ8dHMuRGVjbGFyYXRpb24+KCk7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IHJlZi5ub2RlLmdldFNvdXJjZUZpbGUoKTtcblxuICAgIC8vIERpcmVjdGl2ZXMgYW5kIHBpcGVzIGV4cG9ydGVkIHRvIGFueSBpbXBvcnRpbmcgTmdNb2R1bGVzLlxuICAgIGNvbnN0IGV4cG9ydERpcmVjdGl2ZXMgPSBuZXcgTWFwPHRzLkRlY2xhcmF0aW9uLCBEaXJlY3RpdmVNZXRhPigpO1xuICAgIGNvbnN0IGV4cG9ydFBpcGVzID0gbmV3IE1hcDx0cy5EZWNsYXJhdGlvbiwgUGlwZU1ldGE+KCk7XG5cbiAgICAvLyBUaGUgYWxnb3JpdGhtIGlzIGFzIGZvbGxvd3M6XG4gICAgLy8gMSkgQWRkIGRpcmVjdGl2ZXMvcGlwZXMgZGVjbGFyZWQgaW4gdGhlIE5nTW9kdWxlIHRvIHRoZSBjb21waWxhdGlvbiBzY29wZS5cbiAgICAvLyAyKSBBZGQgYWxsIG9mIHRoZSBkaXJlY3RpdmVzL3BpcGVzIGZyb20gZWFjaCBOZ01vZHVsZSBpbXBvcnRlZCBpbnRvIHRoZSBjdXJyZW50IG9uZSB0byB0aGVcbiAgICAvLyAgICBjb21waWxhdGlvbiBzY29wZS4gQXQgdGhpcyBwb2ludCwgdGhlIGNvbXBpbGF0aW9uIHNjb3BlIGlzIGNvbXBsZXRlLlxuICAgIC8vIDMpIEZvciBlYWNoIGVudHJ5IGluIHRoZSBOZ01vZHVsZSdzIGV4cG9ydHM6XG4gICAgLy8gICAgYSkgQXR0ZW1wdCB0byByZXNvbHZlIGl0IGFzIGFuIE5nTW9kdWxlIHdpdGggaXRzIG93biBleHBvcnRlZCBkaXJlY3RpdmVzL3BpcGVzLiBJZiBpdCBpc1xuICAgIC8vICAgICAgIG9uZSwgYWRkIHRoZW0gdG8gdGhlIGV4cG9ydCBzY29wZSBvZiB0aGlzIE5nTW9kdWxlLlxuICAgIC8vICAgIGIpIE90aGVyd2lzZSwgaXQgc2hvdWxkIGJlIGEgY2xhc3MgaW4gdGhlIGNvbXBpbGF0aW9uIHNjb3BlIG9mIHRoaXMgTmdNb2R1bGUuIElmIGl0IGlzLFxuICAgIC8vICAgICAgIGFkZCBpdCB0byB0aGUgZXhwb3J0IHNjb3BlLlxuICAgIC8vICAgIGMpIElmIGl0J3MgbmVpdGhlciBhbiBOZ01vZHVsZSBub3IgYSBkaXJlY3RpdmUvcGlwZSBpbiB0aGUgY29tcGlsYXRpb24gc2NvcGUsIHRoZW4gdGhpc1xuICAgIC8vICAgICAgIGlzIGFuIGVycm9yLlxuXG4gICAgLy8gMSkgYWRkIGRlY2xhcmF0aW9ucy5cbiAgICBmb3IgKGNvbnN0IGRlY2wgb2YgbmdNb2R1bGUuZGVjbGFyYXRpb25zKSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSB0aGlzLmxvY2FsUmVhZGVyLmdldERpcmVjdGl2ZU1ldGFkYXRhKGRlY2wpO1xuICAgICAgY29uc3QgcGlwZSA9IHRoaXMubG9jYWxSZWFkZXIuZ2V0UGlwZU1ldGFkYXRhKGRlY2wpO1xuICAgICAgaWYgKGRpcmVjdGl2ZSAhPT0gbnVsbCkge1xuICAgICAgICBjb21waWxhdGlvbkRpcmVjdGl2ZXMuc2V0KGRlY2wubm9kZSwgey4uLmRpcmVjdGl2ZSwgcmVmOiBkZWNsfSk7XG4gICAgICB9IGVsc2UgaWYgKHBpcGUgIT09IG51bGwpIHtcbiAgICAgICAgY29tcGlsYXRpb25QaXBlcy5zZXQoZGVjbC5ub2RlLCB7Li4ucGlwZSwgcmVmOiBkZWNsfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPKGFseGh1Yik6IHByb2R1Y2UgYSB0cy5EaWFnbm9zdGljLiBUaGlzIGNhbid0IGJlIGFuIGVycm9yIHJpZ2h0IG5vdyBzaW5jZSBzb21lXG4gICAgICAgIC8vIG5ndG9vbHMgdGVzdHMgcmVseSBvbiBhbmFseXNpcyBvZiBicm9rZW4gY29tcG9uZW50cy5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGRlY2xhcmVkLmFkZChkZWNsLm5vZGUpO1xuICAgIH1cblxuICAgIC8vIDIpIHByb2Nlc3MgaW1wb3J0cy5cbiAgICBmb3IgKGNvbnN0IGRlY2wgb2YgbmdNb2R1bGUuaW1wb3J0cykge1xuICAgICAgY29uc3QgaW1wb3J0U2NvcGUgPSB0aGlzLmdldEV4cG9ydGVkU2NvcGUoZGVjbCwgZGlhZ25vc3RpY3MsIHJlZi5ub2RlLCAnaW1wb3J0Jyk7XG4gICAgICBpZiAoaW1wb3J0U2NvcGUgPT09IG51bGwpIHtcbiAgICAgICAgLy8gQW4gaW1wb3J0IHdhc24ndCBhbiBOZ01vZHVsZSwgc28gcmVjb3JkIGFuIGVycm9yLlxuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKGludmFsaWRSZWYocmVmLm5vZGUsIGRlY2wsICdpbXBvcnQnKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChpbXBvcnRTY29wZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEFuIGltcG9ydCB3YXMgYW4gTmdNb2R1bGUgYnV0IGNvbnRhaW5lZCBlcnJvcnMgb2YgaXRzIG93bi4gUmVjb3JkIHRoaXMgYXMgYW4gZXJyb3IgdG9vLFxuICAgICAgICAvLyBiZWNhdXNlIHRoaXMgc2NvcGUgaXMgYWx3YXlzIGdvaW5nIHRvIGJlIGluY29ycmVjdCBpZiBvbmUgb2YgaXRzIGltcG9ydHMgY291bGQgbm90IGJlXG4gICAgICAgIC8vIHJlYWQuXG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goaW52YWxpZFRyYW5zaXRpdmVOZ01vZHVsZVJlZihyZWYubm9kZSwgZGVjbCwgJ2ltcG9ydCcpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGRpcmVjdGl2ZSBvZiBpbXBvcnRTY29wZS5leHBvcnRlZC5kaXJlY3RpdmVzKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uRGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlLnJlZi5ub2RlLCBkaXJlY3RpdmUpO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBwaXBlIG9mIGltcG9ydFNjb3BlLmV4cG9ydGVkLnBpcGVzKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uUGlwZXMuc2V0KHBpcGUucmVmLm5vZGUsIHBpcGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDMpIHByb2Nlc3MgZXhwb3J0cy5cbiAgICAvLyBFeHBvcnRzIGNhbiBjb250YWluIG1vZHVsZXMsIGNvbXBvbmVudHMsIG9yIGRpcmVjdGl2ZXMuIFRoZXkncmUgcHJvY2Vzc2VkIGRpZmZlcmVudGx5LlxuICAgIC8vIE1vZHVsZXMgYXJlIHN0cmFpZ2h0Zm9yd2FyZC4gRGlyZWN0aXZlcyBhbmQgcGlwZXMgZnJvbSBleHBvcnRlZCBtb2R1bGVzIGFyZSBhZGRlZCB0byB0aGVcbiAgICAvLyBleHBvcnQgbWFwcy4gRGlyZWN0aXZlcy9waXBlcyBhcmUgZGlmZmVyZW50IC0gdGhleSBtaWdodCBiZSBleHBvcnRzIG9mIGRlY2xhcmVkIHR5cGVzIG9yXG4gICAgLy8gaW1wb3J0ZWQgdHlwZXMuXG4gICAgZm9yIChjb25zdCBkZWNsIG9mIG5nTW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIC8vIEF0dGVtcHQgdG8gcmVzb2x2ZSBkZWNsIGFzIGFuIE5nTW9kdWxlLlxuICAgICAgY29uc3QgaW1wb3J0U2NvcGUgPSB0aGlzLmdldEV4cG9ydGVkU2NvcGUoZGVjbCwgZGlhZ25vc3RpY3MsIHJlZi5ub2RlLCAnZXhwb3J0Jyk7XG4gICAgICBpZiAoaW1wb3J0U2NvcGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBBbiBleHBvcnQgd2FzIGFuIE5nTW9kdWxlIGJ1dCBjb250YWluZWQgZXJyb3JzIG9mIGl0cyBvd24uIFJlY29yZCB0aGlzIGFzIGFuIGVycm9yIHRvbyxcbiAgICAgICAgLy8gYmVjYXVzZSB0aGlzIHNjb3BlIGlzIGFsd2F5cyBnb2luZyB0byBiZSBpbmNvcnJlY3QgaWYgb25lIG9mIGl0cyBleHBvcnRzIGNvdWxkIG5vdCBiZVxuICAgICAgICAvLyByZWFkLlxuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKGludmFsaWRUcmFuc2l0aXZlTmdNb2R1bGVSZWYocmVmLm5vZGUsIGRlY2wsICdleHBvcnQnKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChpbXBvcnRTY29wZSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBkZWNsIGlzIGFuIE5nTW9kdWxlLlxuICAgICAgICBmb3IgKGNvbnN0IGRpcmVjdGl2ZSBvZiBpbXBvcnRTY29wZS5leHBvcnRlZC5kaXJlY3RpdmVzKSB7XG4gICAgICAgICAgZXhwb3J0RGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlLnJlZi5ub2RlLCBkaXJlY3RpdmUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcGlwZSBvZiBpbXBvcnRTY29wZS5leHBvcnRlZC5waXBlcykge1xuICAgICAgICAgIGV4cG9ydFBpcGVzLnNldChwaXBlLnJlZi5ub2RlLCBwaXBlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21waWxhdGlvbkRpcmVjdGl2ZXMuaGFzKGRlY2wubm9kZSkpIHtcbiAgICAgICAgLy8gZGVjbCBpcyBhIGRpcmVjdGl2ZSBvciBjb21wb25lbnQgaW4gdGhlIGNvbXBpbGF0aW9uIHNjb3BlIG9mIHRoaXMgTmdNb2R1bGUuXG4gICAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IGNvbXBpbGF0aW9uRGlyZWN0aXZlcy5nZXQoZGVjbC5ub2RlKSAhO1xuICAgICAgICBleHBvcnREaXJlY3RpdmVzLnNldChkZWNsLm5vZGUsIGRpcmVjdGl2ZSk7XG4gICAgICB9IGVsc2UgaWYgKGNvbXBpbGF0aW9uUGlwZXMuaGFzKGRlY2wubm9kZSkpIHtcbiAgICAgICAgLy8gZGVjbCBpcyBhIHBpcGUgaW4gdGhlIGNvbXBpbGF0aW9uIHNjb3BlIG9mIHRoaXMgTmdNb2R1bGUuXG4gICAgICAgIGNvbnN0IHBpcGUgPSBjb21waWxhdGlvblBpcGVzLmdldChkZWNsLm5vZGUpICE7XG4gICAgICAgIGV4cG9ydFBpcGVzLnNldChkZWNsLm5vZGUsIHBpcGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZGVjbCBpcyBhbiB1bmtub3duIGV4cG9ydC5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxSZWFkZXIuZ2V0RGlyZWN0aXZlTWV0YWRhdGEoZGVjbCkgIT09IG51bGwgfHxcbiAgICAgICAgICAgIHRoaXMubG9jYWxSZWFkZXIuZ2V0UGlwZU1ldGFkYXRhKGRlY2wpICE9PSBudWxsKSB7XG4gICAgICAgICAgZGlhZ25vc3RpY3MucHVzaChpbnZhbGlkUmVleHBvcnQocmVmLm5vZGUsIGRlY2wpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaWFnbm9zdGljcy5wdXNoKGludmFsaWRSZWYocmVmLm5vZGUsIGRlY2wsICdleHBvcnQnKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXhwb3J0ZWQgPSB7XG4gICAgICBkaXJlY3RpdmVzOiBBcnJheS5mcm9tKGV4cG9ydERpcmVjdGl2ZXMudmFsdWVzKCkpLFxuICAgICAgcGlwZXM6IEFycmF5LmZyb20oZXhwb3J0UGlwZXMudmFsdWVzKCkpLFxuICAgIH07XG5cbiAgICBsZXQgcmVleHBvcnRzOiBSZWV4cG9ydFtdfG51bGwgPSBudWxsO1xuICAgIGlmICh0aGlzLmFsaWFzR2VuZXJhdG9yICE9PSBudWxsKSB7XG4gICAgICByZWV4cG9ydHMgPSBbXTtcbiAgICAgIGNvbnN0IGFkZFJlZXhwb3J0ID0gKHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+KSA9PiB7XG4gICAgICAgIGlmICghZGVjbGFyZWQuaGFzKHJlZi5ub2RlKSAmJiByZWYubm9kZS5nZXRTb3VyY2VGaWxlKCkgIT09IHNvdXJjZUZpbGUpIHtcbiAgICAgICAgICBjb25zdCBleHBvcnROYW1lID0gdGhpcy5hbGlhc0dlbmVyYXRvciAhLmFsaWFzU3ltYm9sTmFtZShyZWYubm9kZSwgc291cmNlRmlsZSk7XG4gICAgICAgICAgaWYgKHJlZi5hbGlhcyAmJiByZWYuYWxpYXMgaW5zdGFuY2VvZiBFeHRlcm5hbEV4cHIpIHtcbiAgICAgICAgICAgIHJlZXhwb3J0cyAhLnB1c2goe1xuICAgICAgICAgICAgICBmcm9tTW9kdWxlOiByZWYuYWxpYXMudmFsdWUubW9kdWxlTmFtZSAhLFxuICAgICAgICAgICAgICBzeW1ib2xOYW1lOiByZWYuYWxpYXMudmFsdWUubmFtZSAhLFxuICAgICAgICAgICAgICBhc0FsaWFzOiBleHBvcnROYW1lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnJlZkVtaXR0ZXIuZW1pdChyZWYuY2xvbmVXaXRoTm9JZGVudGlmaWVycygpLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBFeHRlcm5hbEV4cHIpIHx8IGV4cHIudmFsdWUubW9kdWxlTmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIGV4cHIudmFsdWUubmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIEV4dGVybmFsRXhwcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVleHBvcnRzICEucHVzaCh7XG4gICAgICAgICAgICAgIGZyb21Nb2R1bGU6IGV4cHIudmFsdWUubW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgc3ltYm9sTmFtZTogZXhwci52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICBhc0FsaWFzOiBleHBvcnROYW1lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZm9yIChjb25zdCB7cmVmfSBvZiBleHBvcnRlZC5kaXJlY3RpdmVzKSB7XG4gICAgICAgIGFkZFJlZXhwb3J0KHJlZik7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IHtyZWZ9IG9mIGV4cG9ydGVkLnBpcGVzKSB7XG4gICAgICAgIGFkZFJlZXhwb3J0KHJlZik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBzY29wZSBoYWQgYW55IGVycm9ycyBkdXJpbmcgcHJvZHVjdGlvbi5cbiAgICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoID4gMCkge1xuICAgICAgLy8gQ2FjaGUgdW5kZWZpbmVkLCB0byBtYXJrIHRoZSBmYWN0IHRoYXQgdGhlIHNjb3BlIGlzIGludmFsaWQuXG4gICAgICB0aGlzLmNhY2hlLnNldChyZWYubm9kZSwgdW5kZWZpbmVkKTtcblxuICAgICAgLy8gU2F2ZSB0aGUgZXJyb3JzIGZvciByZXRyaWV2YWwuXG4gICAgICB0aGlzLnNjb3BlRXJyb3JzLnNldChyZWYubm9kZSwgZGlhZ25vc3RpY3MpO1xuXG4gICAgICAvLyBSZXR1cm4gdW5kZWZpbmVkIHRvIGluZGljYXRlIHRoZSBzY29wZSBpcyBpbnZhbGlkLlxuICAgICAgdGhpcy5jYWNoZS5zZXQocmVmLm5vZGUsIHVuZGVmaW5lZCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIEZpbmFsbHksIHByb2R1Y2UgdGhlIGBMb2NhbE1vZHVsZVNjb3BlYCB3aXRoIGJvdGggdGhlIGNvbXBpbGF0aW9uIGFuZCBleHBvcnQgc2NvcGVzLlxuICAgIGNvbnN0IHNjb3BlID0ge1xuICAgICAgY29tcGlsYXRpb246IHtcbiAgICAgICAgZGlyZWN0aXZlczogQXJyYXkuZnJvbShjb21waWxhdGlvbkRpcmVjdGl2ZXMudmFsdWVzKCkpLFxuICAgICAgICBwaXBlczogQXJyYXkuZnJvbShjb21waWxhdGlvblBpcGVzLnZhbHVlcygpKSxcbiAgICAgIH0sXG4gICAgICBleHBvcnRlZCxcbiAgICAgIHJlZXhwb3J0cyxcbiAgICB9O1xuICAgIHRoaXMuY2FjaGUuc2V0KHJlZi5ub2RlLCBzY29wZSk7XG4gICAgcmV0dXJuIHNjb3BlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBjb21wb25lbnQgcmVxdWlyZXMgcmVtb3RlIHNjb3BpbmcuXG4gICAqL1xuICBnZXRSZXF1aXJlc1JlbW90ZVNjb3BlKG5vZGU6IENsYXNzRGVjbGFyYXRpb24pOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucmVtb3RlU2NvcGluZy5oYXMobm9kZSk7IH1cblxuICAvKipcbiAgICogU2V0IGEgY29tcG9uZW50IGFzIHJlcXVpcmluZyByZW1vdGUgc2NvcGluZy5cbiAgICovXG4gIHNldENvbXBvbmVudEFzUmVxdWlyaW5nUmVtb3RlU2NvcGluZyhub2RlOiBDbGFzc0RlY2xhcmF0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdGVTY29waW5nLmFkZChub2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIHRoZSBgRXhwb3J0U2NvcGVgIG9mIGEgZ2l2ZW4gYFJlZmVyZW5jZWAgdG8gYW4gTmdNb2R1bGUuXG4gICAqXG4gICAqIFRoZSBOZ01vZHVsZSBpbiBxdWVzdGlvbiBtYXkgYmUgZGVjbGFyZWQgbG9jYWxseSBpbiB0aGUgY3VycmVudCB0cy5Qcm9ncmFtLCBvciBpdCBtYXkgYmVcbiAgICogZGVjbGFyZWQgaW4gYSAuZC50cyBmaWxlLlxuICAgKlxuICAgKiBAcmV0dXJucyBgbnVsbGAgaWYgbm8gc2NvcGUgY291bGQgYmUgZm91bmQsIG9yIGB1bmRlZmluZWRgIGlmIGFuIGludmFsaWQgc2NvcGVcbiAgICogd2FzIGZvdW5kLlxuICAgKlxuICAgKiBNYXkgYWxzbyBjb250cmlidXRlIGRpYWdub3N0aWNzIG9mIGl0cyBvd24gYnkgYWRkaW5nIHRvIHRoZSBnaXZlbiBgZGlhZ25vc3RpY3NgXG4gICAqIGFycmF5IHBhcmFtZXRlci5cbiAgICovXG4gIHByaXZhdGUgZ2V0RXhwb3J0ZWRTY29wZShcbiAgICAgIHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+LCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdLFxuICAgICAgb3duZXJGb3JFcnJvcnM6IHRzLkRlY2xhcmF0aW9uLCB0eXBlOiAnaW1wb3J0J3wnZXhwb3J0Jyk6IEV4cG9ydFNjb3BlfG51bGx8dW5kZWZpbmVkIHtcbiAgICBpZiAocmVmLm5vZGUuZ2V0U291cmNlRmlsZSgpLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAvLyBUaGUgTmdNb2R1bGUgaXMgZGVjbGFyZWQgaW4gYSAuZC50cyBmaWxlLiBSZXNvbHZlIGl0IHdpdGggdGhlIGBEZXBlbmRlbmN5U2NvcGVSZWFkZXJgLlxuICAgICAgaWYgKCF0cy5pc0NsYXNzRGVjbGFyYXRpb24ocmVmLm5vZGUpKSB7XG4gICAgICAgIC8vIFRoZSBOZ01vZHVsZSBpcyBpbiBhIC5kLnRzIGZpbGUgYnV0IGlzIG5vdCBkZWNsYXJlZCBhcyBhIHRzLkNsYXNzRGVjbGFyYXRpb24uIFRoaXMgaXMgYW5cbiAgICAgICAgLy8gZXJyb3IgaW4gdGhlIC5kLnRzIG1ldGFkYXRhLlxuICAgICAgICBjb25zdCBjb2RlID0gdHlwZSA9PT0gJ2ltcG9ydCcgPyBFcnJvckNvZGUuTkdNT0RVTEVfSU5WQUxJRF9JTVBPUlQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFcnJvckNvZGUuTkdNT0RVTEVfSU5WQUxJRF9FWFBPUlQ7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2gobWFrZURpYWdub3N0aWMoXG4gICAgICAgICAgICBjb2RlLCBpZGVudGlmaWVyT2ZOb2RlKHJlZi5ub2RlKSB8fCByZWYubm9kZSxcbiAgICAgICAgICAgIGBBcHBlYXJzIGluIHRoZSBOZ01vZHVsZS4ke3R5cGV9cyBvZiAke25vZGVOYW1lRm9yRXJyb3Iob3duZXJGb3JFcnJvcnMpfSwgYnV0IGNvdWxkIG5vdCBiZSByZXNvbHZlZCB0byBhbiBOZ01vZHVsZWApKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmRlcGVuZGVuY3lTY29wZVJlYWRlci5yZXNvbHZlKHJlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBOZ01vZHVsZSBpcyBkZWNsYXJlZCBsb2NhbGx5IGluIHRoZSBjdXJyZW50IHByb2dyYW0uIFJlc29sdmUgaXQgZnJvbSB0aGUgcmVnaXN0cnkuXG4gICAgICByZXR1cm4gdGhpcy5nZXRTY29wZU9mTW9kdWxlUmVmZXJlbmNlKHJlZik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRDb2xsZWN0aW5nKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNlYWxlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NlcnRpb246IExvY2FsTW9kdWxlU2NvcGVSZWdpc3RyeSBpcyBub3QgQ09MTEVDVElOR2ApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByb2R1Y2UgYSBgdHMuRGlhZ25vc3RpY2AgZm9yIGFuIGludmFsaWQgaW1wb3J0IG9yIGV4cG9ydCBmcm9tIGFuIE5nTW9kdWxlLlxuICovXG5mdW5jdGlvbiBpbnZhbGlkUmVmKFxuICAgIGNsYXp6OiB0cy5EZWNsYXJhdGlvbiwgZGVjbDogUmVmZXJlbmNlPHRzLkRlY2xhcmF0aW9uPixcbiAgICB0eXBlOiAnaW1wb3J0JyB8ICdleHBvcnQnKTogdHMuRGlhZ25vc3RpYyB7XG4gIGNvbnN0IGNvZGUgPVxuICAgICAgdHlwZSA9PT0gJ2ltcG9ydCcgPyBFcnJvckNvZGUuTkdNT0RVTEVfSU5WQUxJRF9JTVBPUlQgOiBFcnJvckNvZGUuTkdNT0RVTEVfSU5WQUxJRF9FWFBPUlQ7XG4gIGNvbnN0IHJlc29sdmVUYXJnZXQgPSB0eXBlID09PSAnaW1wb3J0JyA/ICdOZ01vZHVsZScgOiAnTmdNb2R1bGUsIENvbXBvbmVudCwgRGlyZWN0aXZlLCBvciBQaXBlJztcbiAgcmV0dXJuIG1ha2VEaWFnbm9zdGljKFxuICAgICAgY29kZSwgaWRlbnRpZmllck9mTm9kZShkZWNsLm5vZGUpIHx8IGRlY2wubm9kZSxcbiAgICAgIGBBcHBlYXJzIGluIHRoZSBOZ01vZHVsZS4ke3R5cGV9cyBvZiAke25vZGVOYW1lRm9yRXJyb3IoY2xhenopfSwgYnV0IGNvdWxkIG5vdCBiZSByZXNvbHZlZCB0byBhbiAke3Jlc29sdmVUYXJnZXR9IGNsYXNzYCk7XG59XG5cbi8qKlxuICogUHJvZHVjZSBhIGB0cy5EaWFnbm9zdGljYCBmb3IgYW4gaW1wb3J0IG9yIGV4cG9ydCB3aGljaCBpdHNlbGYgaGFzIGVycm9ycy5cbiAqL1xuZnVuY3Rpb24gaW52YWxpZFRyYW5zaXRpdmVOZ01vZHVsZVJlZihcbiAgICBjbGF6ejogdHMuRGVjbGFyYXRpb24sIGRlY2w6IFJlZmVyZW5jZTx0cy5EZWNsYXJhdGlvbj4sXG4gICAgdHlwZTogJ2ltcG9ydCcgfCAnZXhwb3J0Jyk6IHRzLkRpYWdub3N0aWMge1xuICBjb25zdCBjb2RlID1cbiAgICAgIHR5cGUgPT09ICdpbXBvcnQnID8gRXJyb3JDb2RlLk5HTU9EVUxFX0lOVkFMSURfSU1QT1JUIDogRXJyb3JDb2RlLk5HTU9EVUxFX0lOVkFMSURfRVhQT1JUO1xuICByZXR1cm4gbWFrZURpYWdub3N0aWMoXG4gICAgICBjb2RlLCBpZGVudGlmaWVyT2ZOb2RlKGRlY2wubm9kZSkgfHwgZGVjbC5ub2RlLFxuICAgICAgYEFwcGVhcnMgaW4gdGhlIE5nTW9kdWxlLiR7dHlwZX1zIG9mICR7bm9kZU5hbWVGb3JFcnJvcihjbGF6eil9LCBidXQgaXRzZWxmIGhhcyBlcnJvcnNgKTtcbn1cblxuLyoqXG4gKiBQcm9kdWNlIGEgYHRzLkRpYWdub3N0aWNgIGZvciBhbiBleHBvcnRlZCBkaXJlY3RpdmUgb3IgcGlwZSB3aGljaCB3YXMgbm90IGRlY2xhcmVkIG9yIGltcG9ydGVkXG4gKiBieSB0aGUgTmdNb2R1bGUgaW4gcXVlc3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRSZWV4cG9ydChjbGF6ejogdHMuRGVjbGFyYXRpb24sIGRlY2w6IFJlZmVyZW5jZTx0cy5EZWNsYXJhdGlvbj4pOiB0cy5EaWFnbm9zdGljIHtcbiAgcmV0dXJuIG1ha2VEaWFnbm9zdGljKFxuICAgICAgRXJyb3JDb2RlLk5HTU9EVUxFX0lOVkFMSURfUkVFWFBPUlQsIGlkZW50aWZpZXJPZk5vZGUoZGVjbC5ub2RlKSB8fCBkZWNsLm5vZGUsXG4gICAgICBgUHJlc2VudCBpbiB0aGUgTmdNb2R1bGUuZXhwb3J0cyBvZiAke25vZGVOYW1lRm9yRXJyb3IoY2xhenopfSBidXQgbmVpdGhlciBkZWNsYXJlZCBub3IgaW1wb3J0ZWRgKTtcbn1cbiJdfQ==
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
        define("@angular/compiler-cli/src/ngtsc/transform/src/compilation", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/transform/src/api", "@angular/compiler-cli/src/ngtsc/transform/src/declaration"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/api");
    var declaration_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/declaration");
    var EMPTY_ARRAY = [];
    /**
     * Manages a compilation of Ivy decorators into static fields across an entire ts.Program.
     *
     * The compilation is stateful - source files are analyzed and records of the operations that need
     * to be performed during the transform/emit process are maintained internally.
     */
    var IvyCompilation = /** @class */ (function () {
        /**
         * @param handlers array of `DecoratorHandler`s which will be executed against each class in the
         * program
         * @param checker TypeScript `TypeChecker` instance for the program
         * @param reflector `ReflectionHost` through which all reflection operations will be performed
         * @param coreImportsFrom a TypeScript `SourceFile` which exports symbols needed for Ivy imports
         * when compiling @angular/core, or `null` if the current program is not @angular/core. This is
         * `null` in most cases.
         */
        function IvyCompilation(handlers, reflector, importRewriter, incrementalState, perf, sourceToFactorySymbols, scopeRegistry) {
            this.handlers = handlers;
            this.reflector = reflector;
            this.importRewriter = importRewriter;
            this.incrementalState = incrementalState;
            this.perf = perf;
            this.sourceToFactorySymbols = sourceToFactorySymbols;
            this.scopeRegistry = scopeRegistry;
            /**
             * Tracks classes which have been analyzed and found to have an Ivy decorator, and the
             * information recorded about them for later compilation.
             */
            this.ivyClasses = new Map();
            /**
             * Tracks factory information which needs to be generated.
             */
            /**
             * Tracks the `DtsFileTransformer`s for each TS file that needs .d.ts transformations.
             */
            this.dtsMap = new Map();
            this.reexportMap = new Map();
            this._diagnostics = [];
        }
        Object.defineProperty(IvyCompilation.prototype, "exportStatements", {
            get: function () { return this.reexportMap; },
            enumerable: true,
            configurable: true
        });
        IvyCompilation.prototype.analyzeSync = function (sf) { return this.analyze(sf, false); };
        IvyCompilation.prototype.analyzeAsync = function (sf) { return this.analyze(sf, true); };
        IvyCompilation.prototype.detectHandlersForClass = function (node) {
            var e_1, _a;
            // The first step is to reflect the decorators.
            var classDecorators = this.reflector.getDecoratorsOfDeclaration(node);
            var ivyClass = null;
            try {
                // Look through the DecoratorHandlers to see if any are relevant.
                for (var _b = tslib_1.__values(this.handlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var handler = _c.value;
                    // An adapter is relevant if it matches one of the decorators on the class.
                    var detected = handler.detect(node, classDecorators);
                    if (detected === undefined) {
                        // This handler didn't match.
                        continue;
                    }
                    var isPrimaryHandler = handler.precedence === api_1.HandlerPrecedence.PRIMARY;
                    var isWeakHandler = handler.precedence === api_1.HandlerPrecedence.WEAK;
                    var match = {
                        handler: handler,
                        analyzed: null, detected: detected,
                    };
                    if (ivyClass === null) {
                        // This is the first handler to match this class. This path is a fast path through which
                        // most classes will flow.
                        ivyClass = {
                            matchedHandlers: [match],
                            hasPrimaryHandler: isPrimaryHandler,
                            hasWeakHandlers: isWeakHandler,
                        };
                        this.ivyClasses.set(node, ivyClass);
                    }
                    else {
                        // This is at least the second handler to match this class. This is a slower path that some
                        // classes will go through, which validates that the set of decorators applied to the class
                        // is valid.
                        // Validate according to rules as follows:
                        //
                        // * WEAK handlers are removed if a non-WEAK handler matches.
                        // * Only one PRIMARY handler can match at a time. Any other PRIMARY handler matching a
                        //   class with an existing PRIMARY handler is an error.
                        if (!isWeakHandler && ivyClass.hasWeakHandlers) {
                            // The current handler is not a WEAK handler, but the class has other WEAK handlers.
                            // Remove them.
                            ivyClass.matchedHandlers = ivyClass.matchedHandlers.filter(function (field) { return field.handler.precedence !== api_1.HandlerPrecedence.WEAK; });
                            ivyClass.hasWeakHandlers = false;
                        }
                        else if (isWeakHandler && !ivyClass.hasWeakHandlers) {
                            // The current handler is a WEAK handler, but the class has non-WEAK handlers already.
                            // Drop the current one.
                            continue;
                        }
                        if (isPrimaryHandler && ivyClass.hasPrimaryHandler) {
                            // The class already has a PRIMARY handler, and another one just matched.
                            this._diagnostics.push({
                                category: ts.DiagnosticCategory.Error,
                                code: Number('-99' + diagnostics_1.ErrorCode.DECORATOR_COLLISION),
                                file: typescript_1.getSourceFile(node),
                                start: node.getStart(undefined, false),
                                length: node.getWidth(),
                                messageText: 'Two incompatible decorators on class',
                            });
                            this.ivyClasses.delete(node);
                            return null;
                        }
                        // Otherwise, it's safe to accept the multiple decorators here. Update some of the metadata
                        // regarding this class.
                        ivyClass.matchedHandlers.push(match);
                        ivyClass.hasPrimaryHandler = ivyClass.hasPrimaryHandler || isPrimaryHandler;
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
            return ivyClass;
        };
        IvyCompilation.prototype.analyze = function (sf, preanalyze) {
            var _this = this;
            var promises = [];
            if (this.incrementalState.safeToSkip(sf)) {
                return;
            }
            var analyzeClass = function (node) {
                var e_2, _a;
                var ivyClass = _this.detectHandlersForClass(node);
                // If the class has no Ivy behavior (or had errors), skip it.
                if (ivyClass === null) {
                    return;
                }
                var _loop_1 = function (match) {
                    // The analyze() function will run the analysis phase of the handler.
                    var analyze = function () {
                        var _a;
                        var analyzeClassSpan = _this.perf.start('analyzeClass', node);
                        try {
                            match.analyzed = match.handler.analyze(node, match.detected.metadata);
                            if (match.analyzed.diagnostics !== undefined) {
                                (_a = _this._diagnostics).push.apply(_a, tslib_1.__spread(match.analyzed.diagnostics));
                            }
                            if (match.analyzed.factorySymbolName !== undefined &&
                                _this.sourceToFactorySymbols !== null &&
                                _this.sourceToFactorySymbols.has(sf.fileName)) {
                                _this.sourceToFactorySymbols.get(sf.fileName).add(match.analyzed.factorySymbolName);
                            }
                        }
                        catch (err) {
                            if (err instanceof diagnostics_1.FatalDiagnosticError) {
                                _this._diagnostics.push(err.toDiagnostic());
                            }
                            else {
                                throw err;
                            }
                        }
                        finally {
                            _this.perf.stop(analyzeClassSpan);
                        }
                    };
                    // If preanalysis was requested and a preanalysis step exists, then run preanalysis.
                    // Otherwise, skip directly to analysis.
                    if (preanalyze && match.handler.preanalyze !== undefined) {
                        // Preanalysis might return a Promise, indicating an async operation was necessary. Or it
                        // might return undefined, indicating no async step was needed and analysis can proceed
                        // immediately.
                        var preanalysis = match.handler.preanalyze(node, match.detected.metadata);
                        if (preanalysis !== undefined) {
                            // Await the results of preanalysis before running analysis.
                            promises.push(preanalysis.then(analyze));
                        }
                        else {
                            // No async preanalysis needed, skip directly to analysis.
                            analyze();
                        }
                    }
                    else {
                        // Not in preanalysis mode or not needed for this handler, skip directly to analysis.
                        analyze();
                    }
                };
                try {
                    // Loop through each matched handler that needs to be analyzed and analyze it, either
                    // synchronously or asynchronously.
                    for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var match = _c.value;
                        _loop_1(match);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            };
            var visit = function (node) {
                // Process nodes recursively, and look for class declarations with decorators.
                if (reflection_1.isNamedClassDeclaration(node)) {
                    analyzeClass(node);
                }
                ts.forEachChild(node, visit);
            };
            visit(sf);
            if (preanalyze && promises.length > 0) {
                return Promise.all(promises).then(function () { return undefined; });
            }
            else {
                return undefined;
            }
        };
        /**
         * Feeds components discovered in the compilation to a context for indexing.
         */
        IvyCompilation.prototype.index = function (context) {
            this.ivyClasses.forEach(function (ivyClass, declaration) {
                var e_3, _a;
                try {
                    for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var match = _c.value;
                        if (match.handler.index !== undefined && match.analyzed !== null &&
                            match.analyzed.analysis !== undefined) {
                            match.handler.index(context, declaration, match.analyzed.analysis);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            });
        };
        IvyCompilation.prototype.resolve = function () {
            var _this = this;
            var resolveSpan = this.perf.start('resolve');
            this.ivyClasses.forEach(function (ivyClass, node) {
                var e_4, _a, e_5, _b, _c;
                try {
                    for (var _d = tslib_1.__values(ivyClass.matchedHandlers), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var match = _e.value;
                        if (match.handler.resolve !== undefined && match.analyzed !== null &&
                            match.analyzed.analysis !== undefined) {
                            var resolveClassSpan = _this.perf.start('resolveClass', node);
                            try {
                                var res = match.handler.resolve(node, match.analyzed.analysis);
                                if (res.reexports !== undefined) {
                                    var fileName = node.getSourceFile().fileName;
                                    if (!_this.reexportMap.has(fileName)) {
                                        _this.reexportMap.set(fileName, new Map());
                                    }
                                    var fileReexports = _this.reexportMap.get(fileName);
                                    try {
                                        for (var _f = (e_5 = void 0, tslib_1.__values(res.reexports)), _g = _f.next(); !_g.done; _g = _f.next()) {
                                            var reexport = _g.value;
                                            fileReexports.set(reexport.asAlias, [reexport.fromModule, reexport.symbolName]);
                                        }
                                    }
                                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                    finally {
                                        try {
                                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                                        }
                                        finally { if (e_5) throw e_5.error; }
                                    }
                                }
                                if (res.diagnostics !== undefined) {
                                    (_c = _this._diagnostics).push.apply(_c, tslib_1.__spread(res.diagnostics));
                                }
                            }
                            catch (err) {
                                if (err instanceof diagnostics_1.FatalDiagnosticError) {
                                    _this._diagnostics.push(err.toDiagnostic());
                                }
                                else {
                                    throw err;
                                }
                            }
                            finally {
                                _this.perf.stop(resolveClassSpan);
                            }
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            });
            this.perf.stop(resolveSpan);
            this.recordNgModuleScopeDependencies();
        };
        IvyCompilation.prototype.recordNgModuleScopeDependencies = function () {
            var _this = this;
            var recordSpan = this.perf.start('recordDependencies');
            this.scopeRegistry.getCompilationScopes().forEach(function (scope) {
                var file = scope.declaration.getSourceFile();
                // Register the file containing the NgModule where the declaration is declared.
                _this.incrementalState.trackFileDependency(scope.ngModule.getSourceFile(), file);
                scope.directives.forEach(function (directive) {
                    return _this.incrementalState.trackFileDependency(directive.ref.node.getSourceFile(), file);
                });
                scope.pipes.forEach(function (pipe) { return _this.incrementalState.trackFileDependency(pipe.ref.node.getSourceFile(), file); });
            });
            this.perf.stop(recordSpan);
        };
        IvyCompilation.prototype.typeCheck = function (context) {
            this.ivyClasses.forEach(function (ivyClass, node) {
                var e_6, _a;
                try {
                    for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var match = _c.value;
                        if (match.handler.typeCheck !== undefined && match.analyzed !== null &&
                            match.analyzed.analysis !== undefined) {
                            match.handler.typeCheck(context, node, match.analyzed.analysis);
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            });
        };
        /**
         * Perform a compilation operation on the given class declaration and return instructions to an
         * AST transformer if any are available.
         */
        IvyCompilation.prototype.compileIvyFieldFor = function (node, constantPool) {
            var e_7, _a;
            // Look to see whether the original node was analyzed. If not, there's nothing to do.
            var original = ts.getOriginalNode(node);
            if (!reflection_1.isNamedClassDeclaration(original) || !this.ivyClasses.has(original)) {
                return undefined;
            }
            var ivyClass = this.ivyClasses.get(original);
            var res = [];
            try {
                for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var match = _c.value;
                    if (match.analyzed === null || match.analyzed.analysis === undefined) {
                        continue;
                    }
                    var compileSpan = this.perf.start('compileClass', original);
                    var compileMatchRes = match.handler.compile(node, match.analyzed.analysis, constantPool);
                    this.perf.stop(compileSpan);
                    if (!Array.isArray(compileMatchRes)) {
                        res.push(compileMatchRes);
                    }
                    else {
                        res.push.apply(res, tslib_1.__spread(compileMatchRes));
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            // Look up the .d.ts transformer for the input file and record that at least one field was
            // generated, which will allow the .d.ts to be transformed later.
            var fileName = original.getSourceFile().fileName;
            var dtsTransformer = this.getDtsTransformer(fileName);
            dtsTransformer.recordStaticField(reflection_1.reflectNameOfDeclaration(node), res);
            // Return the instruction to the transformer so the fields will be added.
            return res.length > 0 ? res : undefined;
        };
        /**
         * Lookup the `ts.Decorator` which triggered transformation of a particular class declaration.
         */
        IvyCompilation.prototype.ivyDecoratorsFor = function (node) {
            var e_8, _a;
            var original = ts.getOriginalNode(node);
            if (!reflection_1.isNamedClassDeclaration(original) || !this.ivyClasses.has(original)) {
                return EMPTY_ARRAY;
            }
            var ivyClass = this.ivyClasses.get(original);
            var decorators = [];
            try {
                for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var match = _c.value;
                    if (match.analyzed === null || match.analyzed.analysis === undefined) {
                        continue;
                    }
                    if (match.detected.trigger !== null && ts.isDecorator(match.detected.trigger)) {
                        decorators.push(match.detected.trigger);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return decorators;
        };
        /**
         * Process a declaration file and return a transformed version that incorporates the changes
         * made to the source file.
         */
        IvyCompilation.prototype.transformedDtsFor = function (file, context) {
            // No need to transform if it's not a declarations file, or if no changes have been requested
            // to the input file.
            // Due to the way TypeScript afterDeclarations transformers work, the SourceFile path is the
            // same as the original .ts.
            // The only way we know it's actually a declaration file is via the isDeclarationFile property.
            if (!file.isDeclarationFile || !this.dtsMap.has(file.fileName)) {
                return file;
            }
            // Return the transformed source.
            return this.dtsMap.get(file.fileName).transform(file, context);
        };
        Object.defineProperty(IvyCompilation.prototype, "diagnostics", {
            get: function () { return this._diagnostics; },
            enumerable: true,
            configurable: true
        });
        IvyCompilation.prototype.getDtsTransformer = function (tsFileName) {
            if (!this.dtsMap.has(tsFileName)) {
                this.dtsMap.set(tsFileName, new declaration_1.DtsFileTransformer(this.importRewriter));
            }
            return this.dtsMap.get(tsFileName);
        };
        return IvyCompilation;
    }());
    exports.IvyCompilation = IvyCompilation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvY29tcGlsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBR0gsK0JBQWlDO0lBRWpDLDJFQUFrRTtJQUtsRSx5RUFBcUg7SUFHckgsa0ZBQXdEO0lBRXhELHlFQUF1RztJQUN2Ryx5RkFBaUQ7SUFFakQsSUFBTSxXQUFXLEdBQVEsRUFBRSxDQUFDO0lBbUI1Qjs7Ozs7T0FLRztJQUNIO1FBb0JFOzs7Ozs7OztXQVFHO1FBQ0gsd0JBQ1ksUUFBc0MsRUFBVSxTQUF5QixFQUN6RSxjQUE4QixFQUFVLGdCQUFrQyxFQUMxRSxJQUFrQixFQUFVLHNCQUFxRCxFQUNqRixhQUF1QztZQUh2QyxhQUFRLEdBQVIsUUFBUSxDQUE4QjtZQUFVLGNBQVMsR0FBVCxTQUFTLENBQWdCO1lBQ3pFLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtZQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7WUFDMUUsU0FBSSxHQUFKLElBQUksQ0FBYztZQUFVLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBK0I7WUFDakYsa0JBQWEsR0FBYixhQUFhLENBQTBCO1lBaENuRDs7O2VBR0c7WUFDSyxlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7WUFFM0Q7O2VBRUc7WUFFSDs7ZUFFRztZQUNLLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztZQUUvQyxnQkFBVyxHQUFHLElBQUksR0FBRyxFQUF5QyxDQUFDO1lBQy9ELGlCQUFZLEdBQW9CLEVBQUUsQ0FBQztRQWdCVyxDQUFDO1FBR3ZELHNCQUFJLDRDQUFnQjtpQkFBcEIsY0FBcUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFF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TyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFFckUsMENBQWlCLEdBQXpCLFVBQTBCLFVBQWtCO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksZ0NBQWtCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7YUFDMUU7WUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRyxDQUFDO1FBQ3ZDLENBQUM7UUFDSCxxQkFBQztJQUFELENBQUMsQUFyWEQsSUFxWEM7SUFyWFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RhbnRQb29sfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0ltcG9ydFJld3JpdGVyfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7SW5jcmVtZW50YWxTdGF0ZX0gZnJvbSAnLi4vLi4vaW5jcmVtZW50YWwnO1xuaW1wb3J0IHtJbmRleGluZ0NvbnRleHR9IGZyb20gJy4uLy4uL2luZGV4ZXInO1xuaW1wb3J0IHtQZXJmUmVjb3JkZXJ9IGZyb20gJy4uLy4uL3BlcmYnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBSZWZsZWN0aW9uSG9zdCwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb24sIHJlZmxlY3ROYW1lT2ZEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0xvY2FsTW9kdWxlU2NvcGVSZWdpc3RyeX0gZnJvbSAnLi4vLi4vc2NvcGUnO1xuaW1wb3J0IHtUeXBlQ2hlY2tDb250ZXh0fSBmcm9tICcuLi8uLi90eXBlY2hlY2snO1xuaW1wb3J0IHtnZXRTb3VyY2VGaWxlfSBmcm9tICcuLi8uLi91dGlsL3NyYy90eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBbmFseXNpc091dHB1dCwgQ29tcGlsZVJlc3VsdCwgRGVjb3JhdG9ySGFuZGxlciwgRGV0ZWN0UmVzdWx0LCBIYW5kbGVyUHJlY2VkZW5jZX0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtEdHNGaWxlVHJhbnNmb3JtZXJ9IGZyb20gJy4vZGVjbGFyYXRpb24nO1xuXG5jb25zdCBFTVBUWV9BUlJBWTogYW55ID0gW107XG5cbi8qKlxuICogUmVjb3JkIG9mIGFuIGFkYXB0ZXIgd2hpY2ggZGVjaWRlZCB0byBlbWl0IGEgc3RhdGljIGZpZWxkLCBhbmQgdGhlIGFuYWx5c2lzIGl0IHBlcmZvcm1lZCB0b1xuICogcHJlcGFyZSBmb3IgdGhhdCBvcGVyYXRpb24uXG4gKi9cbmludGVyZmFjZSBNYXRjaGVkSGFuZGxlcjxBLCBNPiB7XG4gIGhhbmRsZXI6IERlY29yYXRvckhhbmRsZXI8QSwgTT47XG4gIGFuYWx5emVkOiBBbmFseXNpc091dHB1dDxBPnxudWxsO1xuICBkZXRlY3RlZDogRGV0ZWN0UmVzdWx0PE0+O1xufVxuXG5pbnRlcmZhY2UgSXZ5Q2xhc3Mge1xuICBtYXRjaGVkSGFuZGxlcnM6IE1hdGNoZWRIYW5kbGVyPGFueSwgYW55PltdO1xuXG4gIGhhc1dlYWtIYW5kbGVyczogYm9vbGVhbjtcbiAgaGFzUHJpbWFyeUhhbmRsZXI6IGJvb2xlYW47XG59XG5cbi8qKlxuICogTWFuYWdlcyBhIGNvbXBpbGF0aW9uIG9mIEl2eSBkZWNvcmF0b3JzIGludG8gc3RhdGljIGZpZWxkcyBhY3Jvc3MgYW4gZW50aXJlIHRzLlByb2dyYW0uXG4gKlxuICogVGhlIGNvbXBpbGF0aW9uIGlzIHN0YXRlZnVsIC0gc291cmNlIGZpbGVzIGFyZSBhbmFseXplZCBhbmQgcmVjb3JkcyBvZiB0aGUgb3BlcmF0aW9ucyB0aGF0IG5lZWRcbiAqIHRvIGJlIHBlcmZvcm1lZCBkdXJpbmcgdGhlIHRyYW5zZm9ybS9lbWl0IHByb2Nlc3MgYXJlIG1haW50YWluZWQgaW50ZXJuYWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIEl2eUNvbXBpbGF0aW9uIHtcbiAgLyoqXG4gICAqIFRyYWNrcyBjbGFzc2VzIHdoaWNoIGhhdmUgYmVlbiBhbmFseXplZCBhbmQgZm91bmQgdG8gaGF2ZSBhbiBJdnkgZGVjb3JhdG9yLCBhbmQgdGhlXG4gICAqIGluZm9ybWF0aW9uIHJlY29yZGVkIGFib3V0IHRoZW0gZm9yIGxhdGVyIGNvbXBpbGF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBpdnlDbGFzc2VzID0gbmV3IE1hcDxDbGFzc0RlY2xhcmF0aW9uLCBJdnlDbGFzcz4oKTtcblxuICAvKipcbiAgICogVHJhY2tzIGZhY3RvcnkgaW5mb3JtYXRpb24gd2hpY2ggbmVlZHMgdG8gYmUgZ2VuZXJhdGVkLlxuICAgKi9cblxuICAvKipcbiAgICogVHJhY2tzIHRoZSBgRHRzRmlsZVRyYW5zZm9ybWVyYHMgZm9yIGVhY2ggVFMgZmlsZSB0aGF0IG5lZWRzIC5kLnRzIHRyYW5zZm9ybWF0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgZHRzTWFwID0gbmV3IE1hcDxzdHJpbmcsIER0c0ZpbGVUcmFuc2Zvcm1lcj4oKTtcblxuICBwcml2YXRlIHJlZXhwb3J0TWFwID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+PigpO1xuICBwcml2YXRlIF9kaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdID0gW107XG5cblxuICAvKipcbiAgICogQHBhcmFtIGhhbmRsZXJzIGFycmF5IG9mIGBEZWNvcmF0b3JIYW5kbGVyYHMgd2hpY2ggd2lsbCBiZSBleGVjdXRlZCBhZ2FpbnN0IGVhY2ggY2xhc3MgaW4gdGhlXG4gICAqIHByb2dyYW1cbiAgICogQHBhcmFtIGNoZWNrZXIgVHlwZVNjcmlwdCBgVHlwZUNoZWNrZXJgIGluc3RhbmNlIGZvciB0aGUgcHJvZ3JhbVxuICAgKiBAcGFyYW0gcmVmbGVjdG9yIGBSZWZsZWN0aW9uSG9zdGAgdGhyb3VnaCB3aGljaCBhbGwgcmVmbGVjdGlvbiBvcGVyYXRpb25zIHdpbGwgYmUgcGVyZm9ybWVkXG4gICAqIEBwYXJhbSBjb3JlSW1wb3J0c0Zyb20gYSBUeXBlU2NyaXB0IGBTb3VyY2VGaWxlYCB3aGljaCBleHBvcnRzIHN5bWJvbHMgbmVlZGVkIGZvciBJdnkgaW1wb3J0c1xuICAgKiB3aGVuIGNvbXBpbGluZyBAYW5ndWxhci9jb3JlLCBvciBgbnVsbGAgaWYgdGhlIGN1cnJlbnQgcHJvZ3JhbSBpcyBub3QgQGFuZ3VsYXIvY29yZS4gVGhpcyBpc1xuICAgKiBgbnVsbGAgaW4gbW9zdCBjYXNlcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBoYW5kbGVyczogRGVjb3JhdG9ySGFuZGxlcjxhbnksIGFueT5bXSwgcHJpdmF0ZSByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0LFxuICAgICAgcHJpdmF0ZSBpbXBvcnRSZXdyaXRlcjogSW1wb3J0UmV3cml0ZXIsIHByaXZhdGUgaW5jcmVtZW50YWxTdGF0ZTogSW5jcmVtZW50YWxTdGF0ZSxcbiAgICAgIHByaXZhdGUgcGVyZjogUGVyZlJlY29yZGVyLCBwcml2YXRlIHNvdXJjZVRvRmFjdG9yeVN5bWJvbHM6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PnxudWxsLFxuICAgICAgcHJpdmF0ZSBzY29wZVJlZ2lzdHJ5OiBMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnkpIHt9XG5cblxuICBnZXQgZXhwb3J0U3RhdGVtZW50cygpOiBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPj4geyByZXR1cm4gdGhpcy5yZWV4cG9ydE1hcDsgfVxuXG4gIGFuYWx5emVTeW5jKHNmOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7IHJldHVybiB0aGlzLmFuYWx5emUoc2YsIGZhbHNlKTsgfVxuXG4gIGFuYWx5emVBc3luYyhzZjogdHMuU291cmNlRmlsZSk6IFByb21pc2U8dm9pZD58dW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuYW5hbHl6ZShzZiwgdHJ1ZSk7IH1cblxuICBwcml2YXRlIGRldGVjdEhhbmRsZXJzRm9yQ2xhc3Mobm9kZTogQ2xhc3NEZWNsYXJhdGlvbik6IEl2eUNsYXNzfG51bGwge1xuICAgIC8vIFRoZSBmaXJzdCBzdGVwIGlzIHRvIHJlZmxlY3QgdGhlIGRlY29yYXRvcnMuXG4gICAgY29uc3QgY2xhc3NEZWNvcmF0b3JzID0gdGhpcy5yZWZsZWN0b3IuZ2V0RGVjb3JhdG9yc09mRGVjbGFyYXRpb24obm9kZSk7XG4gICAgbGV0IGl2eUNsYXNzOiBJdnlDbGFzc3xudWxsID0gbnVsbDtcblxuICAgIC8vIExvb2sgdGhyb3VnaCB0aGUgRGVjb3JhdG9ySGFuZGxlcnMgdG8gc2VlIGlmIGFueSBhcmUgcmVsZXZhbnQuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyIG9mIHRoaXMuaGFuZGxlcnMpIHtcbiAgICAgIC8vIEFuIGFkYXB0ZXIgaXMgcmVsZXZhbnQgaWYgaXQgbWF0Y2hlcyBvbmUgb2YgdGhlIGRlY29yYXRvcnMgb24gdGhlIGNsYXNzLlxuICAgICAgY29uc3QgZGV0ZWN0ZWQgPSBoYW5kbGVyLmRldGVjdChub2RlLCBjbGFzc0RlY29yYXRvcnMpO1xuICAgICAgaWYgKGRldGVjdGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVGhpcyBoYW5kbGVyIGRpZG4ndCBtYXRjaC5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzUHJpbWFyeUhhbmRsZXIgPSBoYW5kbGVyLnByZWNlZGVuY2UgPT09IEhhbmRsZXJQcmVjZWRlbmNlLlBSSU1BUlk7XG4gICAgICBjb25zdCBpc1dlYWtIYW5kbGVyID0gaGFuZGxlci5wcmVjZWRlbmNlID09PSBIYW5kbGVyUHJlY2VkZW5jZS5XRUFLO1xuICAgICAgY29uc3QgbWF0Y2ggPSB7XG4gICAgICAgIGhhbmRsZXIsXG4gICAgICAgIGFuYWx5emVkOiBudWxsLCBkZXRlY3RlZCxcbiAgICAgIH07XG5cbiAgICAgIGlmIChpdnlDbGFzcyA9PT0gbnVsbCkge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBoYW5kbGVyIHRvIG1hdGNoIHRoaXMgY2xhc3MuIFRoaXMgcGF0aCBpcyBhIGZhc3QgcGF0aCB0aHJvdWdoIHdoaWNoXG4gICAgICAgIC8vIG1vc3QgY2xhc3NlcyB3aWxsIGZsb3cuXG4gICAgICAgIGl2eUNsYXNzID0ge1xuICAgICAgICAgIG1hdGNoZWRIYW5kbGVyczogW21hdGNoXSxcbiAgICAgICAgICBoYXNQcmltYXJ5SGFuZGxlcjogaXNQcmltYXJ5SGFuZGxlcixcbiAgICAgICAgICBoYXNXZWFrSGFuZGxlcnM6IGlzV2Vha0hhbmRsZXIsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaXZ5Q2xhc3Nlcy5zZXQobm9kZSwgaXZ5Q2xhc3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhdCBsZWFzdCB0aGUgc2Vjb25kIGhhbmRsZXIgdG8gbWF0Y2ggdGhpcyBjbGFzcy4gVGhpcyBpcyBhIHNsb3dlciBwYXRoIHRoYXQgc29tZVxuICAgICAgICAvLyBjbGFzc2VzIHdpbGwgZ28gdGhyb3VnaCwgd2hpY2ggdmFsaWRhdGVzIHRoYXQgdGhlIHNldCBvZiBkZWNvcmF0b3JzIGFwcGxpZWQgdG8gdGhlIGNsYXNzXG4gICAgICAgIC8vIGlzIHZhbGlkLlxuXG4gICAgICAgIC8vIFZhbGlkYXRlIGFjY29yZGluZyB0byBydWxlcyBhcyBmb2xsb3dzOlxuICAgICAgICAvL1xuICAgICAgICAvLyAqIFdFQUsgaGFuZGxlcnMgYXJlIHJlbW92ZWQgaWYgYSBub24tV0VBSyBoYW5kbGVyIG1hdGNoZXMuXG4gICAgICAgIC8vICogT25seSBvbmUgUFJJTUFSWSBoYW5kbGVyIGNhbiBtYXRjaCBhdCBhIHRpbWUuIEFueSBvdGhlciBQUklNQVJZIGhhbmRsZXIgbWF0Y2hpbmcgYVxuICAgICAgICAvLyAgIGNsYXNzIHdpdGggYW4gZXhpc3RpbmcgUFJJTUFSWSBoYW5kbGVyIGlzIGFuIGVycm9yLlxuXG4gICAgICAgIGlmICghaXNXZWFrSGFuZGxlciAmJiBpdnlDbGFzcy5oYXNXZWFrSGFuZGxlcnMpIHtcbiAgICAgICAgICAvLyBUaGUgY3VycmVudCBoYW5kbGVyIGlzIG5vdCBhIFdFQUsgaGFuZGxlciwgYnV0IHRoZSBjbGFzcyBoYXMgb3RoZXIgV0VBSyBoYW5kbGVycy5cbiAgICAgICAgICAvLyBSZW1vdmUgdGhlbS5cbiAgICAgICAgICBpdnlDbGFzcy5tYXRjaGVkSGFuZGxlcnMgPSBpdnlDbGFzcy5tYXRjaGVkSGFuZGxlcnMuZmlsdGVyKFxuICAgICAgICAgICAgICBmaWVsZCA9PiBmaWVsZC5oYW5kbGVyLnByZWNlZGVuY2UgIT09IEhhbmRsZXJQcmVjZWRlbmNlLldFQUspO1xuICAgICAgICAgIGl2eUNsYXNzLmhhc1dlYWtIYW5kbGVycyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzV2Vha0hhbmRsZXIgJiYgIWl2eUNsYXNzLmhhc1dlYWtIYW5kbGVycykge1xuICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGhhbmRsZXIgaXMgYSBXRUFLIGhhbmRsZXIsIGJ1dCB0aGUgY2xhc3MgaGFzIG5vbi1XRUFLIGhhbmRsZXJzIGFscmVhZHkuXG4gICAgICAgICAgLy8gRHJvcCB0aGUgY3VycmVudCBvbmUuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQcmltYXJ5SGFuZGxlciAmJiBpdnlDbGFzcy5oYXNQcmltYXJ5SGFuZGxlcikge1xuICAgICAgICAgIC8vIFRoZSBjbGFzcyBhbHJlYWR5IGhhcyBhIFBSSU1BUlkgaGFuZGxlciwgYW5kIGFub3RoZXIgb25lIGp1c3QgbWF0Y2hlZC5cbiAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICAgICAgICBjb2RlOiBOdW1iZXIoJy05OScgKyBFcnJvckNvZGUuREVDT1JBVE9SX0NPTExJU0lPTiksXG4gICAgICAgICAgICBmaWxlOiBnZXRTb3VyY2VGaWxlKG5vZGUpLFxuICAgICAgICAgICAgc3RhcnQ6IG5vZGUuZ2V0U3RhcnQodW5kZWZpbmVkLCBmYWxzZSksXG4gICAgICAgICAgICBsZW5ndGg6IG5vZGUuZ2V0V2lkdGgoKSxcbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0OiAnVHdvIGluY29tcGF0aWJsZSBkZWNvcmF0b3JzIG9uIGNsYXNzJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLml2eUNsYXNzZXMuZGVsZXRlKG5vZGUpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBpdCdzIHNhZmUgdG8gYWNjZXB0IHRoZSBtdWx0aXBsZSBkZWNvcmF0b3JzIGhlcmUuIFVwZGF0ZSBzb21lIG9mIHRoZSBtZXRhZGF0YVxuICAgICAgICAvLyByZWdhcmRpbmcgdGhpcyBjbGFzcy5cbiAgICAgICAgaXZ5Q2xhc3MubWF0Y2hlZEhhbmRsZXJzLnB1c2gobWF0Y2gpO1xuICAgICAgICBpdnlDbGFzcy5oYXNQcmltYXJ5SGFuZGxlciA9IGl2eUNsYXNzLmhhc1ByaW1hcnlIYW5kbGVyIHx8IGlzUHJpbWFyeUhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl2eUNsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuYWx5emUgYSBzb3VyY2UgZmlsZSBhbmQgcHJvZHVjZSBkaWFnbm9zdGljcyBmb3IgaXQgKGlmIGFueSkuXG4gICAqL1xuICBwcml2YXRlIGFuYWx5emUoc2Y6IHRzLlNvdXJjZUZpbGUsIHByZWFuYWx5emU6IGZhbHNlKTogdW5kZWZpbmVkO1xuICBwcml2YXRlIGFuYWx5emUoc2Y6IHRzLlNvdXJjZUZpbGUsIHByZWFuYWx5emU6IHRydWUpOiBQcm9taXNlPHZvaWQ+fHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBhbmFseXplKHNmOiB0cy5Tb3VyY2VGaWxlLCBwcmVhbmFseXplOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPnx1bmRlZmluZWQge1xuICAgIGNvbnN0IHByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcbiAgICBpZiAodGhpcy5pbmNyZW1lbnRhbFN0YXRlLnNhZmVUb1NraXAoc2YpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGFuYWx5emVDbGFzcyA9IChub2RlOiBDbGFzc0RlY2xhcmF0aW9uKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpdnlDbGFzcyA9IHRoaXMuZGV0ZWN0SGFuZGxlcnNGb3JDbGFzcyhub2RlKTtcblxuICAgICAgLy8gSWYgdGhlIGNsYXNzIGhhcyBubyBJdnkgYmVoYXZpb3IgKG9yIGhhZCBlcnJvcnMpLCBza2lwIGl0LlxuICAgICAgaWYgKGl2eUNsYXNzID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIGVhY2ggbWF0Y2hlZCBoYW5kbGVyIHRoYXQgbmVlZHMgdG8gYmUgYW5hbHl6ZWQgYW5kIGFuYWx5emUgaXQsIGVpdGhlclxuICAgICAgLy8gc3luY2hyb25vdXNseSBvciBhc3luY2hyb25vdXNseS5cbiAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgaXZ5Q2xhc3MubWF0Y2hlZEhhbmRsZXJzKSB7XG4gICAgICAgIC8vIFRoZSBhbmFseXplKCkgZnVuY3Rpb24gd2lsbCBydW4gdGhlIGFuYWx5c2lzIHBoYXNlIG9mIHRoZSBoYW5kbGVyLlxuICAgICAgICBjb25zdCBhbmFseXplID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFuYWx5emVDbGFzc1NwYW4gPSB0aGlzLnBlcmYuc3RhcnQoJ2FuYWx5emVDbGFzcycsIG5vZGUpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBtYXRjaC5hbmFseXplZCA9IG1hdGNoLmhhbmRsZXIuYW5hbHl6ZShub2RlLCBtYXRjaC5kZXRlY3RlZC5tZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIGlmIChtYXRjaC5hbmFseXplZC5kaWFnbm9zdGljcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RpYWdub3N0aWNzLnB1c2goLi4ubWF0Y2guYW5hbHl6ZWQuZGlhZ25vc3RpY3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWF0Y2guYW5hbHl6ZWQuZmFjdG9yeVN5bWJvbE5hbWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlVG9GYWN0b3J5U3ltYm9scyAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlVG9GYWN0b3J5U3ltYm9scy5oYXMoc2YuZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc291cmNlVG9GYWN0b3J5U3ltYm9scy5nZXQoc2YuZmlsZU5hbWUpICEuYWRkKG1hdGNoLmFuYWx5emVkLmZhY3RvcnlTeW1ib2xOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBGYXRhbERpYWdub3N0aWNFcnJvcikge1xuICAgICAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5wdXNoKGVyci50b0RpYWdub3N0aWMoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMucGVyZi5zdG9wKGFuYWx5emVDbGFzc1NwYW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiBwcmVhbmFseXNpcyB3YXMgcmVxdWVzdGVkIGFuZCBhIHByZWFuYWx5c2lzIHN0ZXAgZXhpc3RzLCB0aGVuIHJ1biBwcmVhbmFseXNpcy5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBza2lwIGRpcmVjdGx5IHRvIGFuYWx5c2lzLlxuICAgICAgICBpZiAocHJlYW5hbHl6ZSAmJiBtYXRjaC5oYW5kbGVyLnByZWFuYWx5emUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFByZWFuYWx5c2lzIG1pZ2h0IHJldHVybiBhIFByb21pc2UsIGluZGljYXRpbmcgYW4gYXN5bmMgb3BlcmF0aW9uIHdhcyBuZWNlc3NhcnkuIE9yIGl0XG4gICAgICAgICAgLy8gbWlnaHQgcmV0dXJuIHVuZGVmaW5lZCwgaW5kaWNhdGluZyBubyBhc3luYyBzdGVwIHdhcyBuZWVkZWQgYW5kIGFuYWx5c2lzIGNhbiBwcm9jZWVkXG4gICAgICAgICAgLy8gaW1tZWRpYXRlbHkuXG4gICAgICAgICAgY29uc3QgcHJlYW5hbHlzaXMgPSBtYXRjaC5oYW5kbGVyLnByZWFuYWx5emUobm9kZSwgbWF0Y2guZGV0ZWN0ZWQubWV0YWRhdGEpO1xuICAgICAgICAgIGlmIChwcmVhbmFseXNpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBBd2FpdCB0aGUgcmVzdWx0cyBvZiBwcmVhbmFseXNpcyBiZWZvcmUgcnVubmluZyBhbmFseXNpcy5cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJlYW5hbHlzaXMudGhlbihhbmFseXplKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGFzeW5jIHByZWFuYWx5c2lzIG5lZWRlZCwgc2tpcCBkaXJlY3RseSB0byBhbmFseXNpcy5cbiAgICAgICAgICAgIGFuYWx5emUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm90IGluIHByZWFuYWx5c2lzIG1vZGUgb3Igbm90IG5lZWRlZCBmb3IgdGhpcyBoYW5kbGVyLCBza2lwIGRpcmVjdGx5IHRvIGFuYWx5c2lzLlxuICAgICAgICAgIGFuYWx5emUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCB2aXNpdCA9IChub2RlOiB0cy5Ob2RlKTogdm9pZCA9PiB7XG4gICAgICAvLyBQcm9jZXNzIG5vZGVzIHJlY3Vyc2l2ZWx5LCBhbmQgbG9vayBmb3IgY2xhc3MgZGVjbGFyYXRpb25zIHdpdGggZGVjb3JhdG9ycy5cbiAgICAgIGlmIChpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICBhbmFseXplQ2xhc3Mobm9kZSk7XG4gICAgICB9XG4gICAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgdmlzaXQpO1xuICAgIH07XG5cbiAgICB2aXNpdChzZik7XG5cbiAgICBpZiAocHJlYW5hbHl6ZSAmJiBwcm9taXNlcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmVlZHMgY29tcG9uZW50cyBkaXNjb3ZlcmVkIGluIHRoZSBjb21waWxhdGlvbiB0byBhIGNvbnRleHQgZm9yIGluZGV4aW5nLlxuICAgKi9cbiAgaW5kZXgoY29udGV4dDogSW5kZXhpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5pdnlDbGFzc2VzLmZvckVhY2goKGl2eUNsYXNzLCBkZWNsYXJhdGlvbikgPT4ge1xuICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBpdnlDbGFzcy5tYXRjaGVkSGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKG1hdGNoLmhhbmRsZXIuaW5kZXggIT09IHVuZGVmaW5lZCAmJiBtYXRjaC5hbmFseXplZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgbWF0Y2guYW5hbHl6ZWQuYW5hbHlzaXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG1hdGNoLmhhbmRsZXIuaW5kZXgoY29udGV4dCwgZGVjbGFyYXRpb24sIG1hdGNoLmFuYWx5emVkLmFuYWx5c2lzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVzb2x2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCByZXNvbHZlU3BhbiA9IHRoaXMucGVyZi5zdGFydCgncmVzb2x2ZScpO1xuICAgIHRoaXMuaXZ5Q2xhc3Nlcy5mb3JFYWNoKChpdnlDbGFzcywgbm9kZSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBpdnlDbGFzcy5tYXRjaGVkSGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKG1hdGNoLmhhbmRsZXIucmVzb2x2ZSAhPT0gdW5kZWZpbmVkICYmIG1hdGNoLmFuYWx5emVkICE9PSBudWxsICYmXG4gICAgICAgICAgICBtYXRjaC5hbmFseXplZC5hbmFseXNpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgcmVzb2x2ZUNsYXNzU3BhbiA9IHRoaXMucGVyZi5zdGFydCgncmVzb2x2ZUNsYXNzJywgbm9kZSk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG1hdGNoLmhhbmRsZXIucmVzb2x2ZShub2RlLCBtYXRjaC5hbmFseXplZC5hbmFseXNpcyk7XG4gICAgICAgICAgICBpZiAocmVzLnJlZXhwb3J0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gbm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWU7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5yZWV4cG9ydE1hcC5oYXMoZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWV4cG9ydE1hcC5zZXQoZmlsZU5hbWUsIG5ldyBNYXA8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPigpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBmaWxlUmVleHBvcnRzID0gdGhpcy5yZWV4cG9ydE1hcC5nZXQoZmlsZU5hbWUpICE7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgcmVleHBvcnQgb2YgcmVzLnJlZXhwb3J0cykge1xuICAgICAgICAgICAgICAgIGZpbGVSZWV4cG9ydHMuc2V0KHJlZXhwb3J0LmFzQWxpYXMsIFtyZWV4cG9ydC5mcm9tTW9kdWxlLCByZWV4cG9ydC5zeW1ib2xOYW1lXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXMuZGlhZ25vc3RpY3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5wdXNoKC4uLnJlcy5kaWFnbm9zdGljcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRmF0YWxEaWFnbm9zdGljRXJyb3IpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZGlhZ25vc3RpY3MucHVzaChlcnIudG9EaWFnbm9zdGljKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLnBlcmYuc3RvcChyZXNvbHZlQ2xhc3NTcGFuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnBlcmYuc3RvcChyZXNvbHZlU3Bhbik7XG4gICAgdGhpcy5yZWNvcmROZ01vZHVsZVNjb3BlRGVwZW5kZW5jaWVzKCk7XG4gIH1cblxuICBwcml2YXRlIHJlY29yZE5nTW9kdWxlU2NvcGVEZXBlbmRlbmNpZXMoKSB7XG4gICAgY29uc3QgcmVjb3JkU3BhbiA9IHRoaXMucGVyZi5zdGFydCgncmVjb3JkRGVwZW5kZW5jaWVzJyk7XG4gICAgdGhpcy5zY29wZVJlZ2lzdHJ5ICEuZ2V0Q29tcGlsYXRpb25TY29wZXMoKS5mb3JFYWNoKHNjb3BlID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBzY29wZS5kZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICAvLyBSZWdpc3RlciB0aGUgZmlsZSBjb250YWluaW5nIHRoZSBOZ01vZHVsZSB3aGVyZSB0aGUgZGVjbGFyYXRpb24gaXMgZGVjbGFyZWQuXG4gICAgICB0aGlzLmluY3JlbWVudGFsU3RhdGUudHJhY2tGaWxlRGVwZW5kZW5jeShzY29wZS5uZ01vZHVsZS5nZXRTb3VyY2VGaWxlKCksIGZpbGUpO1xuICAgICAgc2NvcGUuZGlyZWN0aXZlcy5mb3JFYWNoKFxuICAgICAgICAgIGRpcmVjdGl2ZSA9PlxuICAgICAgICAgICAgICB0aGlzLmluY3JlbWVudGFsU3RhdGUudHJhY2tGaWxlRGVwZW5kZW5jeShkaXJlY3RpdmUucmVmLm5vZGUuZ2V0U291cmNlRmlsZSgpLCBmaWxlKSk7XG4gICAgICBzY29wZS5waXBlcy5mb3JFYWNoKFxuICAgICAgICAgIHBpcGUgPT4gdGhpcy5pbmNyZW1lbnRhbFN0YXRlLnRyYWNrRmlsZURlcGVuZGVuY3kocGlwZS5yZWYubm9kZS5nZXRTb3VyY2VGaWxlKCksIGZpbGUpKTtcbiAgICB9KTtcbiAgICB0aGlzLnBlcmYuc3RvcChyZWNvcmRTcGFuKTtcbiAgfVxuXG4gIHR5cGVDaGVjayhjb250ZXh0OiBUeXBlQ2hlY2tDb250ZXh0KTogdm9pZCB7XG4gICAgdGhpcy5pdnlDbGFzc2VzLmZvckVhY2goKGl2eUNsYXNzLCBub2RlKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGl2eUNsYXNzLm1hdGNoZWRIYW5kbGVycykge1xuICAgICAgICBpZiAobWF0Y2guaGFuZGxlci50eXBlQ2hlY2sgIT09IHVuZGVmaW5lZCAmJiBtYXRjaC5hbmFseXplZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgbWF0Y2guYW5hbHl6ZWQuYW5hbHlzaXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG1hdGNoLmhhbmRsZXIudHlwZUNoZWNrKGNvbnRleHQsIG5vZGUsIG1hdGNoLmFuYWx5emVkLmFuYWx5c2lzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gYSBjb21waWxhdGlvbiBvcGVyYXRpb24gb24gdGhlIGdpdmVuIGNsYXNzIGRlY2xhcmF0aW9uIGFuZCByZXR1cm4gaW5zdHJ1Y3Rpb25zIHRvIGFuXG4gICAqIEFTVCB0cmFuc2Zvcm1lciBpZiBhbnkgYXJlIGF2YWlsYWJsZS5cbiAgICovXG4gIGNvbXBpbGVJdnlGaWVsZEZvcihub2RlOiB0cy5EZWNsYXJhdGlvbiwgY29uc3RhbnRQb29sOiBDb25zdGFudFBvb2wpOiBDb21waWxlUmVzdWx0W118dW5kZWZpbmVkIHtcbiAgICAvLyBMb29rIHRvIHNlZSB3aGV0aGVyIHRoZSBvcmlnaW5hbCBub2RlIHdhcyBhbmFseXplZC4gSWYgbm90LCB0aGVyZSdzIG5vdGhpbmcgdG8gZG8uXG4gICAgY29uc3Qgb3JpZ2luYWwgPSB0cy5nZXRPcmlnaW5hbE5vZGUobm9kZSkgYXMgdHlwZW9mIG5vZGU7XG4gICAgaWYgKCFpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbihvcmlnaW5hbCkgfHwgIXRoaXMuaXZ5Q2xhc3Nlcy5oYXMob3JpZ2luYWwpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGl2eUNsYXNzID0gdGhpcy5pdnlDbGFzc2VzLmdldChvcmlnaW5hbCkgITtcblxuICAgIGxldCByZXM6IENvbXBpbGVSZXN1bHRbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBpdnlDbGFzcy5tYXRjaGVkSGFuZGxlcnMpIHtcbiAgICAgIGlmIChtYXRjaC5hbmFseXplZCA9PT0gbnVsbCB8fCBtYXRjaC5hbmFseXplZC5hbmFseXNpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21waWxlU3BhbiA9IHRoaXMucGVyZi5zdGFydCgnY29tcGlsZUNsYXNzJywgb3JpZ2luYWwpO1xuICAgICAgY29uc3QgY29tcGlsZU1hdGNoUmVzID1cbiAgICAgICAgICBtYXRjaC5oYW5kbGVyLmNvbXBpbGUobm9kZSBhcyBDbGFzc0RlY2xhcmF0aW9uLCBtYXRjaC5hbmFseXplZC5hbmFseXNpcywgY29uc3RhbnRQb29sKTtcbiAgICAgIHRoaXMucGVyZi5zdG9wKGNvbXBpbGVTcGFuKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21waWxlTWF0Y2hSZXMpKSB7XG4gICAgICAgIHJlcy5wdXNoKGNvbXBpbGVNYXRjaFJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMucHVzaCguLi5jb21waWxlTWF0Y2hSZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExvb2sgdXAgdGhlIC5kLnRzIHRyYW5zZm9ybWVyIGZvciB0aGUgaW5wdXQgZmlsZSBhbmQgcmVjb3JkIHRoYXQgYXQgbGVhc3Qgb25lIGZpZWxkIHdhc1xuICAgIC8vIGdlbmVyYXRlZCwgd2hpY2ggd2lsbCBhbGxvdyB0aGUgLmQudHMgdG8gYmUgdHJhbnNmb3JtZWQgbGF0ZXIuXG4gICAgY29uc3QgZmlsZU5hbWUgPSBvcmlnaW5hbC5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWU7XG4gICAgY29uc3QgZHRzVHJhbnNmb3JtZXIgPSB0aGlzLmdldER0c1RyYW5zZm9ybWVyKGZpbGVOYW1lKTtcbiAgICBkdHNUcmFuc2Zvcm1lci5yZWNvcmRTdGF0aWNGaWVsZChyZWZsZWN0TmFtZU9mRGVjbGFyYXRpb24obm9kZSkgISwgcmVzKTtcblxuICAgIC8vIFJldHVybiB0aGUgaW5zdHJ1Y3Rpb24gdG8gdGhlIHRyYW5zZm9ybWVyIHNvIHRoZSBmaWVsZHMgd2lsbCBiZSBhZGRlZC5cbiAgICByZXR1cm4gcmVzLmxlbmd0aCA+IDAgPyByZXMgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIHRoZSBgdHMuRGVjb3JhdG9yYCB3aGljaCB0cmlnZ2VyZWQgdHJhbnNmb3JtYXRpb24gb2YgYSBwYXJ0aWN1bGFyIGNsYXNzIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgaXZ5RGVjb3JhdG9yc0Zvcihub2RlOiB0cy5EZWNsYXJhdGlvbik6IHRzLkRlY29yYXRvcltdIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IHRzLmdldE9yaWdpbmFsTm9kZShub2RlKSBhcyB0eXBlb2Ygbm9kZTtcblxuICAgIGlmICghaXNOYW1lZENsYXNzRGVjbGFyYXRpb24ob3JpZ2luYWwpIHx8ICF0aGlzLml2eUNsYXNzZXMuaGFzKG9yaWdpbmFsKSkge1xuICAgICAgcmV0dXJuIEVNUFRZX0FSUkFZO1xuICAgIH1cbiAgICBjb25zdCBpdnlDbGFzcyA9IHRoaXMuaXZ5Q2xhc3Nlcy5nZXQob3JpZ2luYWwpICE7XG4gICAgY29uc3QgZGVjb3JhdG9yczogdHMuRGVjb3JhdG9yW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgaXZ5Q2xhc3MubWF0Y2hlZEhhbmRsZXJzKSB7XG4gICAgICBpZiAobWF0Y2guYW5hbHl6ZWQgPT09IG51bGwgfHwgbWF0Y2guYW5hbHl6ZWQuYW5hbHlzaXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaC5kZXRlY3RlZC50cmlnZ2VyICE9PSBudWxsICYmIHRzLmlzRGVjb3JhdG9yKG1hdGNoLmRldGVjdGVkLnRyaWdnZXIpKSB7XG4gICAgICAgIGRlY29yYXRvcnMucHVzaChtYXRjaC5kZXRlY3RlZC50cmlnZ2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb3JhdG9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgZGVjbGFyYXRpb24gZmlsZSBhbmQgcmV0dXJuIGEgdHJhbnNmb3JtZWQgdmVyc2lvbiB0aGF0IGluY29ycG9yYXRlcyB0aGUgY2hhbmdlc1xuICAgKiBtYWRlIHRvIHRoZSBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHRyYW5zZm9ybWVkRHRzRm9yKGZpbGU6IHRzLlNvdXJjZUZpbGUsIGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCk6IHRzLlNvdXJjZUZpbGUge1xuICAgIC8vIE5vIG5lZWQgdG8gdHJhbnNmb3JtIGlmIGl0J3Mgbm90IGEgZGVjbGFyYXRpb25zIGZpbGUsIG9yIGlmIG5vIGNoYW5nZXMgaGF2ZSBiZWVuIHJlcXVlc3RlZFxuICAgIC8vIHRvIHRoZSBpbnB1dCBmaWxlLlxuICAgIC8vIER1ZSB0byB0aGUgd2F5IFR5cGVTY3JpcHQgYWZ0ZXJEZWNsYXJhdGlvbnMgdHJhbnNmb3JtZXJzIHdvcmssIHRoZSBTb3VyY2VGaWxlIHBhdGggaXMgdGhlXG4gICAgLy8gc2FtZSBhcyB0aGUgb3JpZ2luYWwgLnRzLlxuICAgIC8vIFRoZSBvbmx5IHdheSB3ZSBrbm93IGl0J3MgYWN0dWFsbHkgYSBkZWNsYXJhdGlvbiBmaWxlIGlzIHZpYSB0aGUgaXNEZWNsYXJhdGlvbkZpbGUgcHJvcGVydHkuXG4gICAgaWYgKCFmaWxlLmlzRGVjbGFyYXRpb25GaWxlIHx8ICF0aGlzLmR0c01hcC5oYXMoZmlsZS5maWxlTmFtZSkpIHtcbiAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgdHJhbnNmb3JtZWQgc291cmNlLlxuICAgIHJldHVybiB0aGlzLmR0c01hcC5nZXQoZmlsZS5maWxlTmFtZSkgIS50cmFuc2Zvcm0oZmlsZSwgY29udGV4dCk7XG4gIH1cblxuICBnZXQgZGlhZ25vc3RpY3MoKTogUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljPiB7IHJldHVybiB0aGlzLl9kaWFnbm9zdGljczsgfVxuXG4gIHByaXZhdGUgZ2V0RHRzVHJhbnNmb3JtZXIodHNGaWxlTmFtZTogc3RyaW5nKTogRHRzRmlsZVRyYW5zZm9ybWVyIHtcbiAgICBpZiAoIXRoaXMuZHRzTWFwLmhhcyh0c0ZpbGVOYW1lKSkge1xuICAgICAgdGhpcy5kdHNNYXAuc2V0KHRzRmlsZU5hbWUsIG5ldyBEdHNGaWxlVHJhbnNmb3JtZXIodGhpcy5pbXBvcnRSZXdyaXRlcikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kdHNNYXAuZ2V0KHRzRmlsZU5hbWUpICE7XG4gIH1cbn1cbiJdfQ==
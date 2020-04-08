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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/context", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics", "@angular/compiler-cli/src/ngtsc/typecheck/src/environment", "@angular/compiler-cli/src/ngtsc/typecheck/src/host", "@angular/compiler-cli/src/ngtsc/typecheck/src/line_mappings", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_file", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_constructor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics");
    var environment_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/environment");
    var host_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/host");
    var line_mappings_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/line_mappings");
    var type_check_block_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block");
    var type_check_file_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_file");
    var type_constructor_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_constructor");
    /**
     * A template type checking context for a program.
     *
     * The `TypeCheckContext` allows registration of components and their templates which need to be
     * type checked. It also allows generation of modified `ts.SourceFile`s which contain the type
     * checking code.
     */
    var TypeCheckContext = /** @class */ (function () {
        function TypeCheckContext(config, refEmitter, typeCheckFilePath) {
            this.config = config;
            this.refEmitter = refEmitter;
            /**
             * A `Map` of `ts.SourceFile`s that the context has seen to the operations (additions of methods
             * or type-check blocks) that need to be eventually performed on that file.
             */
            this.opMap = new Map();
            /**
             * Tracks when an a particular class has a pending type constructor patching operation already
             * queued.
             */
            this.typeCtorPending = new Set();
            /**
             * This map keeps track of all template sources that have been type-checked by the reference name
             * that is attached to a TCB's function declaration as leading trivia. This enables translation
             * of diagnostics produced for TCB code to their source location in the template.
             */
            this.templateSources = new Map();
            this.typeCheckFile = new type_check_file_1.TypeCheckFile(typeCheckFilePath, this.config, this.refEmitter);
        }
        /**
         * Record a template for the given component `node`, with a `SelectorMatcher` for directive
         * matching.
         *
         * @param node class of the node being recorded.
         * @param template AST nodes of the template being recorded.
         * @param matcher `SelectorMatcher` which tracks directives that are in scope for this template.
         */
        TypeCheckContext.prototype.addTemplate = function (ref, boundTarget, pipes, file) {
            var e_1, _a;
            this.templateSources.set(diagnostics_1.getSourceReferenceName(ref.node), new TemplateSource(file));
            try {
                // Get all of the directives used in the template and record type constructors for all of them.
                for (var _b = tslib_1.__values(boundTarget.getUsedDirectives()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var dir = _c.value;
                    var dirRef = dir.ref;
                    var dirNode = dirRef.node;
                    if (type_constructor_1.requiresInlineTypeCtor(dirNode)) {
                        // Add a type constructor operation for the directive.
                        this.addInlineTypeCtor(dirNode.getSourceFile(), dirRef, {
                            fnName: 'ngTypeCtor',
                            // The constructor should have a body if the directive comes from a .ts file, but not if
                            // it comes from a .d.ts file. .d.ts declarations don't have bodies.
                            body: !dirNode.getSourceFile().isDeclarationFile,
                            fields: {
                                inputs: Object.keys(dir.inputs),
                                outputs: Object.keys(dir.outputs),
                                // TODO(alxhub): support queries
                                queries: dir.queries,
                            },
                        });
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
            if (type_check_block_1.requiresInlineTypeCheckBlock(ref.node)) {
                // This class didn't meet the requirements for external type checking, so generate an inline
                // TCB for the class.
                this.addInlineTypeCheckBlock(ref, { boundTarget: boundTarget, pipes: pipes });
            }
            else {
                // The class can be type-checked externally as normal.
                this.typeCheckFile.addTypeCheckBlock(ref, { boundTarget: boundTarget, pipes: pipes });
            }
        };
        /**
         * Record a type constructor for the given `node` with the given `ctorMetadata`.
         */
        TypeCheckContext.prototype.addInlineTypeCtor = function (sf, ref, ctorMeta) {
            if (this.typeCtorPending.has(ref.node)) {
                return;
            }
            this.typeCtorPending.add(ref.node);
            // Lazily construct the operation map.
            if (!this.opMap.has(sf)) {
                this.opMap.set(sf, []);
            }
            var ops = this.opMap.get(sf);
            // Push a `TypeCtorOp` into the operation queue for the source file.
            ops.push(new TypeCtorOp(ref, ctorMeta, this.config));
        };
        /**
         * Transform a `ts.SourceFile` into a version that includes type checking code.
         *
         * If this particular source file has no directives that require type constructors, or components
         * that require type check blocks, then it will be returned directly. Otherwise, a new
         * `ts.SourceFile` is parsed from modified text of the original. This is necessary to ensure the
         * added code has correct positional information associated with it.
         */
        TypeCheckContext.prototype.transform = function (sf) {
            var _this = this;
            // If there are no operations pending for this particular file, return it directly.
            if (!this.opMap.has(sf)) {
                return sf;
            }
            // Imports may need to be added to the file to support type-checking of directives used in the
            // template within it.
            var importManager = new translator_1.ImportManager(new imports_1.NoopImportRewriter(), '_i');
            // Each Op has a splitPoint index into the text where it needs to be inserted. Split the
            // original source text into chunks at these split points, where code will be inserted between
            // the chunks.
            var ops = this.opMap.get(sf).sort(orderOps);
            var textParts = splitStringAtPoints(sf.text, ops.map(function (op) { return op.splitPoint; }));
            // Use a `ts.Printer` to generate source code.
            var printer = ts.createPrinter({ omitTrailingSemicolon: true });
            // Begin with the intial section of the code text.
            var code = textParts[0];
            // Process each operation and use the printer to generate source code for it, inserting it into
            // the source code in between the original chunks.
            ops.forEach(function (op, idx) {
                var text = op.execute(importManager, sf, _this.refEmitter, printer);
                code += '\n\n' + text + textParts[idx + 1];
            });
            // Write out the imports that need to be added to the beginning of the file.
            var imports = importManager.getAllImports(sf.fileName)
                .map(function (i) { return "import * as " + i.qualifier + " from '" + i.specifier + "';"; })
                .join('\n');
            code = imports + '\n' + code;
            // Parse the new source file and return it.
            return ts.createSourceFile(sf.fileName, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        };
        TypeCheckContext.prototype.calculateTemplateDiagnostics = function (originalProgram, originalHost, originalOptions) {
            var e_2, _a, e_3, _b;
            var _this = this;
            var typeCheckSf = this.typeCheckFile.render();
            // First, build the map of original source files.
            var sfMap = new Map();
            var interestingFiles = [typeCheckSf];
            try {
                for (var _c = tslib_1.__values(originalProgram.getSourceFiles()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var originalSf = _d.value;
                    var sf = this.transform(originalSf);
                    sfMap.set(sf.fileName, sf);
                    if (!sf.isDeclarationFile && this.opMap.has(originalSf)) {
                        interestingFiles.push(sf);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            sfMap.set(typeCheckSf.fileName, typeCheckSf);
            var typeCheckProgram = ts.createProgram({
                host: new host_1.TypeCheckProgramHost(sfMap, originalHost),
                options: originalOptions,
                oldProgram: originalProgram,
                rootNames: originalProgram.getRootFileNames(),
            });
            var diagnostics = [];
            var resolveSpan = function (sourceLocation) {
                if (!_this.templateSources.has(sourceLocation.sourceReference)) {
                    return null;
                }
                var templateSource = _this.templateSources.get(sourceLocation.sourceReference);
                return templateSource.toParseSourceSpan(sourceLocation.start, sourceLocation.end);
            };
            var collectDiagnostics = function (diags) {
                var e_4, _a;
                try {
                    for (var diags_1 = tslib_1.__values(diags), diags_1_1 = diags_1.next(); !diags_1_1.done; diags_1_1 = diags_1.next()) {
                        var diagnostic = diags_1_1.value;
                        if (diagnostics_1.shouldReportDiagnostic(diagnostic)) {
                            var translated = diagnostics_1.translateDiagnostic(diagnostic, resolveSpan);
                            if (translated !== null) {
                                diagnostics.push(translated);
                            }
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (diags_1_1 && !diags_1_1.done && (_a = diags_1.return)) _a.call(diags_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            };
            try {
                for (var interestingFiles_1 = tslib_1.__values(interestingFiles), interestingFiles_1_1 = interestingFiles_1.next(); !interestingFiles_1_1.done; interestingFiles_1_1 = interestingFiles_1.next()) {
                    var sf = interestingFiles_1_1.value;
                    collectDiagnostics(typeCheckProgram.getSemanticDiagnostics(sf));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (interestingFiles_1_1 && !interestingFiles_1_1.done && (_b = interestingFiles_1.return)) _b.call(interestingFiles_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return {
                diagnostics: diagnostics,
                program: typeCheckProgram,
            };
        };
        TypeCheckContext.prototype.addInlineTypeCheckBlock = function (ref, tcbMeta) {
            var sf = ref.node.getSourceFile();
            if (!this.opMap.has(sf)) {
                this.opMap.set(sf, []);
            }
            var ops = this.opMap.get(sf);
            ops.push(new TcbOp(ref, tcbMeta, this.config));
        };
        return TypeCheckContext;
    }());
    exports.TypeCheckContext = TypeCheckContext;
    /**
     * Represents the source of a template that was processed during type-checking. This information is
     * used when translating parse offsets in diagnostics back to their original line/column location.
     */
    var TemplateSource = /** @class */ (function () {
        function TemplateSource(file) {
            this.file = file;
            this.lineStarts = null;
        }
        TemplateSource.prototype.toParseSourceSpan = function (start, end) {
            var startLoc = this.toParseLocation(start);
            var endLoc = this.toParseLocation(end);
            return new compiler_1.ParseSourceSpan(startLoc, endLoc);
        };
        TemplateSource.prototype.toParseLocation = function (position) {
            var lineStarts = this.acquireLineStarts();
            var _a = line_mappings_1.getLineAndCharacterFromPosition(lineStarts, position), line = _a.line, character = _a.character;
            return new compiler_1.ParseLocation(this.file, position, line, character);
        };
        TemplateSource.prototype.acquireLineStarts = function () {
            if (this.lineStarts === null) {
                this.lineStarts = line_mappings_1.computeLineStartsMap(this.file.content);
            }
            return this.lineStarts;
        };
        return TemplateSource;
    }());
    /**
     * A type check block operation which produces type check code for a particular component.
     */
    var TcbOp = /** @class */ (function () {
        function TcbOp(ref, meta, config) {
            this.ref = ref;
            this.meta = meta;
            this.config = config;
        }
        Object.defineProperty(TcbOp.prototype, "splitPoint", {
            /**
             * Type check blocks are inserted immediately after the end of the component class.
             */
            get: function () { return this.ref.node.end + 1; },
            enumerable: true,
            configurable: true
        });
        TcbOp.prototype.execute = function (im, sf, refEmitter, printer) {
            var env = new environment_1.Environment(this.config, im, refEmitter, sf);
            var fnName = ts.createIdentifier("_tcb_" + this.ref.node.pos);
            var fn = type_check_block_1.generateTypeCheckBlock(env, this.ref, fnName, this.meta);
            return printer.printNode(ts.EmitHint.Unspecified, fn, sf);
        };
        return TcbOp;
    }());
    /**
     * A type constructor operation which produces type constructor code for a particular directive.
     */
    var TypeCtorOp = /** @class */ (function () {
        function TypeCtorOp(ref, meta, config) {
            this.ref = ref;
            this.meta = meta;
            this.config = config;
        }
        Object.defineProperty(TypeCtorOp.prototype, "splitPoint", {
            /**
             * Type constructor operations are inserted immediately before the end of the directive class.
             */
            get: function () { return this.ref.node.end - 1; },
            enumerable: true,
            configurable: true
        });
        TypeCtorOp.prototype.execute = function (im, sf, refEmitter, printer) {
            var tcb = type_constructor_1.generateInlineTypeCtor(this.ref.node, this.meta, this.config);
            return printer.printNode(ts.EmitHint.Unspecified, tcb, sf);
        };
        return TypeCtorOp;
    }());
    /**
     * Compare two operations and return their split point ordering.
     */
    function orderOps(op1, op2) {
        return op1.splitPoint - op2.splitPoint;
    }
    /**
     * Split a string into chunks at any number of split points.
     */
    function splitStringAtPoints(str, points) {
        var splits = [];
        var start = 0;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            splits.push(str.substring(start, point));
            start = point;
        }
        splits.push(str.substring(start));
        return splits;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDhDQUErRjtJQUMvRiwrQkFBaUM7SUFHakMsbUVBQThFO0lBRTlFLHlFQUErQztJQUcvQyx5RkFBOEg7SUFDOUgseUZBQTBDO0lBQzFDLDJFQUE0QztJQUM1Qyw2RkFBc0Y7SUFDdEYsbUdBQXdGO0lBQ3hGLGlHQUFtRTtJQUNuRSxtR0FBa0Y7SUFJbEY7Ozs7OztPQU1HO0lBQ0g7UUFHRSwwQkFDWSxNQUEwQixFQUFVLFVBQTRCLEVBQ3hFLGlCQUFpQztZQUR6QixXQUFNLEdBQU4sTUFBTSxDQUFvQjtZQUFVLGVBQVUsR0FBVixVQUFVLENBQWtCO1lBSzVFOzs7ZUFHRztZQUNLLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztZQUUvQzs7O2VBR0c7WUFDSyxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1lBRXpEOzs7O2VBSUc7WUFDSyxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1lBcEIxRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksK0JBQWEsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBcUJEOzs7Ozs7O1dBT0c7UUFDSCxzQ0FBVyxHQUFYLFVBQ0ksR0FBcUQsRUFDckQsV0FBb0QsRUFDcEQsS0FBb0UsRUFDcEUsSUFBcUI7O1lBQ3ZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLG9DQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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O1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN6QyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ2Y7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsQyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0JvdW5kVGFyZ2V0LCBQYXJzZUxvY2F0aW9uLCBQYXJzZVNvdXJjZUZpbGUsIFBhcnNlU291cmNlU3Bhbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Tm9vcEltcG9ydFJld3JpdGVyLCBSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXR0ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9ufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7SW1wb3J0TWFuYWdlcn0gZnJvbSAnLi4vLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7VHlwZUNoZWNrQmxvY2tNZXRhZGF0YSwgVHlwZUNoZWNrYWJsZURpcmVjdGl2ZU1ldGEsIFR5cGVDaGVja2luZ0NvbmZpZywgVHlwZUN0b3JNZXRhZGF0YX0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtEaWFnbm9zdGljLCBTb3VyY2VMb2NhdGlvbiwgZ2V0U291cmNlUmVmZXJlbmNlTmFtZSwgc2hvdWxkUmVwb3J0RGlhZ25vc3RpYywgdHJhbnNsYXRlRGlhZ25vc3RpY30gZnJvbSAnLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0Vudmlyb25tZW50fSBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCB7VHlwZUNoZWNrUHJvZ3JhbUhvc3R9IGZyb20gJy4vaG9zdCc7XG5pbXBvcnQge2NvbXB1dGVMaW5lU3RhcnRzTWFwLCBnZXRMaW5lQW5kQ2hhcmFjdGVyRnJvbVBvc2l0aW9ufSBmcm9tICcuL2xpbmVfbWFwcGluZ3MnO1xuaW1wb3J0IHtnZW5lcmF0ZVR5cGVDaGVja0Jsb2NrLCByZXF1aXJlc0lubGluZVR5cGVDaGVja0Jsb2NrfSBmcm9tICcuL3R5cGVfY2hlY2tfYmxvY2snO1xuaW1wb3J0IHtUeXBlQ2hlY2tGaWxlLCB0eXBlQ2hlY2tGaWxlUGF0aH0gZnJvbSAnLi90eXBlX2NoZWNrX2ZpbGUnO1xuaW1wb3J0IHtnZW5lcmF0ZUlubGluZVR5cGVDdG9yLCByZXF1aXJlc0lubGluZVR5cGVDdG9yfSBmcm9tICcuL3R5cGVfY29uc3RydWN0b3InO1xuXG5cblxuLyoqXG4gKiBBIHRlbXBsYXRlIHR5cGUgY2hlY2tpbmcgY29udGV4dCBmb3IgYSBwcm9ncmFtLlxuICpcbiAqIFRoZSBgVHlwZUNoZWNrQ29udGV4dGAgYWxsb3dzIHJlZ2lzdHJhdGlvbiBvZiBjb21wb25lbnRzIGFuZCB0aGVpciB0ZW1wbGF0ZXMgd2hpY2ggbmVlZCB0byBiZVxuICogdHlwZSBjaGVja2VkLiBJdCBhbHNvIGFsbG93cyBnZW5lcmF0aW9uIG9mIG1vZGlmaWVkIGB0cy5Tb3VyY2VGaWxlYHMgd2hpY2ggY29udGFpbiB0aGUgdHlwZVxuICogY2hlY2tpbmcgY29kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGVDaGVja0NvbnRleHQge1xuICBwcml2YXRlIHR5cGVDaGVja0ZpbGU6IFR5cGVDaGVja0ZpbGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGNvbmZpZzogVHlwZUNoZWNraW5nQ29uZmlnLCBwcml2YXRlIHJlZkVtaXR0ZXI6IFJlZmVyZW5jZUVtaXR0ZXIsXG4gICAgICB0eXBlQ2hlY2tGaWxlUGF0aDogQWJzb2x1dGVGc1BhdGgpIHtcbiAgICB0aGlzLnR5cGVDaGVja0ZpbGUgPSBuZXcgVHlwZUNoZWNrRmlsZSh0eXBlQ2hlY2tGaWxlUGF0aCwgdGhpcy5jb25maWcsIHRoaXMucmVmRW1pdHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQSBgTWFwYCBvZiBgdHMuU291cmNlRmlsZWBzIHRoYXQgdGhlIGNvbnRleHQgaGFzIHNlZW4gdG8gdGhlIG9wZXJhdGlvbnMgKGFkZGl0aW9ucyBvZiBtZXRob2RzXG4gICAqIG9yIHR5cGUtY2hlY2sgYmxvY2tzKSB0aGF0IG5lZWQgdG8gYmUgZXZlbnR1YWxseSBwZXJmb3JtZWQgb24gdGhhdCBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBvcE1hcCA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgT3BbXT4oKTtcblxuICAvKipcbiAgICogVHJhY2tzIHdoZW4gYW4gYSBwYXJ0aWN1bGFyIGNsYXNzIGhhcyBhIHBlbmRpbmcgdHlwZSBjb25zdHJ1Y3RvciBwYXRjaGluZyBvcGVyYXRpb24gYWxyZWFkeVxuICAgKiBxdWV1ZWQuXG4gICAqL1xuICBwcml2YXRlIHR5cGVDdG9yUGVuZGluZyA9IG5ldyBTZXQ8dHMuQ2xhc3NEZWNsYXJhdGlvbj4oKTtcblxuICAvKipcbiAgICogVGhpcyBtYXAga2VlcHMgdHJhY2sgb2YgYWxsIHRlbXBsYXRlIHNvdXJjZXMgdGhhdCBoYXZlIGJlZW4gdHlwZS1jaGVja2VkIGJ5IHRoZSByZWZlcmVuY2UgbmFtZVxuICAgKiB0aGF0IGlzIGF0dGFjaGVkIHRvIGEgVENCJ3MgZnVuY3Rpb24gZGVjbGFyYXRpb24gYXMgbGVhZGluZyB0cml2aWEuIFRoaXMgZW5hYmxlcyB0cmFuc2xhdGlvblxuICAgKiBvZiBkaWFnbm9zdGljcyBwcm9kdWNlZCBmb3IgVENCIGNvZGUgdG8gdGhlaXIgc291cmNlIGxvY2F0aW9uIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHByaXZhdGUgdGVtcGxhdGVTb3VyY2VzID0gbmV3IE1hcDxzdHJpbmcsIFRlbXBsYXRlU291cmNlPigpO1xuXG4gIC8qKlxuICAgKiBSZWNvcmQgYSB0ZW1wbGF0ZSBmb3IgdGhlIGdpdmVuIGNvbXBvbmVudCBgbm9kZWAsIHdpdGggYSBgU2VsZWN0b3JNYXRjaGVyYCBmb3IgZGlyZWN0aXZlXG4gICAqIG1hdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSBjbGFzcyBvZiB0aGUgbm9kZSBiZWluZyByZWNvcmRlZC5cbiAgICogQHBhcmFtIHRlbXBsYXRlIEFTVCBub2RlcyBvZiB0aGUgdGVtcGxhdGUgYmVpbmcgcmVjb3JkZWQuXG4gICAqIEBwYXJhbSBtYXRjaGVyIGBTZWxlY3Rvck1hdGNoZXJgIHdoaWNoIHRyYWNrcyBkaXJlY3RpdmVzIHRoYXQgYXJlIGluIHNjb3BlIGZvciB0aGlzIHRlbXBsYXRlLlxuICAgKi9cbiAgYWRkVGVtcGxhdGUoXG4gICAgICByZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPHRzLkNsYXNzRGVjbGFyYXRpb24+PixcbiAgICAgIGJvdW5kVGFyZ2V0OiBCb3VuZFRhcmdldDxUeXBlQ2hlY2thYmxlRGlyZWN0aXZlTWV0YT4sXG4gICAgICBwaXBlczogTWFwPHN0cmluZywgUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4+PixcbiAgICAgIGZpbGU6IFBhcnNlU291cmNlRmlsZSk6IHZvaWQge1xuICAgIHRoaXMudGVtcGxhdGVTb3VyY2VzLnNldChnZXRTb3VyY2VSZWZlcmVuY2VOYW1lKHJlZi5ub2RlKSwgbmV3IFRlbXBsYXRlU291cmNlKGZpbGUpKTtcblxuICAgIC8vIEdldCBhbGwgb2YgdGhlIGRpcmVjdGl2ZXMgdXNlZCBpbiB0aGUgdGVtcGxhdGUgYW5kIHJlY29yZCB0eXBlIGNvbnN0cnVjdG9ycyBmb3IgYWxsIG9mIHRoZW0uXG4gICAgZm9yIChjb25zdCBkaXIgb2YgYm91bmRUYXJnZXQuZ2V0VXNlZERpcmVjdGl2ZXMoKSkge1xuICAgICAgY29uc3QgZGlyUmVmID0gZGlyLnJlZiBhcyBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPj47XG4gICAgICBjb25zdCBkaXJOb2RlID0gZGlyUmVmLm5vZGU7XG4gICAgICBpZiAocmVxdWlyZXNJbmxpbmVUeXBlQ3RvcihkaXJOb2RlKSkge1xuICAgICAgICAvLyBBZGQgYSB0eXBlIGNvbnN0cnVjdG9yIG9wZXJhdGlvbiBmb3IgdGhlIGRpcmVjdGl2ZS5cbiAgICAgICAgdGhpcy5hZGRJbmxpbmVUeXBlQ3RvcihkaXJOb2RlLmdldFNvdXJjZUZpbGUoKSwgZGlyUmVmLCB7XG4gICAgICAgICAgZm5OYW1lOiAnbmdUeXBlQ3RvcicsXG4gICAgICAgICAgLy8gVGhlIGNvbnN0cnVjdG9yIHNob3VsZCBoYXZlIGEgYm9keSBpZiB0aGUgZGlyZWN0aXZlIGNvbWVzIGZyb20gYSAudHMgZmlsZSwgYnV0IG5vdCBpZlxuICAgICAgICAgIC8vIGl0IGNvbWVzIGZyb20gYSAuZC50cyBmaWxlLiAuZC50cyBkZWNsYXJhdGlvbnMgZG9uJ3QgaGF2ZSBib2RpZXMuXG4gICAgICAgICAgYm9keTogIWRpck5vZGUuZ2V0U291cmNlRmlsZSgpLmlzRGVjbGFyYXRpb25GaWxlLFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgaW5wdXRzOiBPYmplY3Qua2V5cyhkaXIuaW5wdXRzKSxcbiAgICAgICAgICAgIG91dHB1dHM6IE9iamVjdC5rZXlzKGRpci5vdXRwdXRzKSxcbiAgICAgICAgICAgIC8vIFRPRE8oYWx4aHViKTogc3VwcG9ydCBxdWVyaWVzXG4gICAgICAgICAgICBxdWVyaWVzOiBkaXIucXVlcmllcyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVxdWlyZXNJbmxpbmVUeXBlQ2hlY2tCbG9jayhyZWYubm9kZSkpIHtcbiAgICAgIC8vIFRoaXMgY2xhc3MgZGlkbid0IG1lZXQgdGhlIHJlcXVpcmVtZW50cyBmb3IgZXh0ZXJuYWwgdHlwZSBjaGVja2luZywgc28gZ2VuZXJhdGUgYW4gaW5saW5lXG4gICAgICAvLyBUQ0IgZm9yIHRoZSBjbGFzcy5cbiAgICAgIHRoaXMuYWRkSW5saW5lVHlwZUNoZWNrQmxvY2socmVmLCB7Ym91bmRUYXJnZXQsIHBpcGVzfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBjbGFzcyBjYW4gYmUgdHlwZS1jaGVja2VkIGV4dGVybmFsbHkgYXMgbm9ybWFsLlxuICAgICAgdGhpcy50eXBlQ2hlY2tGaWxlLmFkZFR5cGVDaGVja0Jsb2NrKHJlZiwge2JvdW5kVGFyZ2V0LCBwaXBlc30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgYSB0eXBlIGNvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gYG5vZGVgIHdpdGggdGhlIGdpdmVuIGBjdG9yTWV0YWRhdGFgLlxuICAgKi9cbiAgYWRkSW5saW5lVHlwZUN0b3IoXG4gICAgICBzZjogdHMuU291cmNlRmlsZSwgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPj4sXG4gICAgICBjdG9yTWV0YTogVHlwZUN0b3JNZXRhZGF0YSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnR5cGVDdG9yUGVuZGluZy5oYXMocmVmLm5vZGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudHlwZUN0b3JQZW5kaW5nLmFkZChyZWYubm9kZSk7XG5cbiAgICAvLyBMYXppbHkgY29uc3RydWN0IHRoZSBvcGVyYXRpb24gbWFwLlxuICAgIGlmICghdGhpcy5vcE1hcC5oYXMoc2YpKSB7XG4gICAgICB0aGlzLm9wTWFwLnNldChzZiwgW10pO1xuICAgIH1cbiAgICBjb25zdCBvcHMgPSB0aGlzLm9wTWFwLmdldChzZikgITtcblxuICAgIC8vIFB1c2ggYSBgVHlwZUN0b3JPcGAgaW50byB0aGUgb3BlcmF0aW9uIHF1ZXVlIGZvciB0aGUgc291cmNlIGZpbGUuXG4gICAgb3BzLnB1c2gobmV3IFR5cGVDdG9yT3AocmVmLCBjdG9yTWV0YSwgdGhpcy5jb25maWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm0gYSBgdHMuU291cmNlRmlsZWAgaW50byBhIHZlcnNpb24gdGhhdCBpbmNsdWRlcyB0eXBlIGNoZWNraW5nIGNvZGUuXG4gICAqXG4gICAqIElmIHRoaXMgcGFydGljdWxhciBzb3VyY2UgZmlsZSBoYXMgbm8gZGlyZWN0aXZlcyB0aGF0IHJlcXVpcmUgdHlwZSBjb25zdHJ1Y3RvcnMsIG9yIGNvbXBvbmVudHNcbiAgICogdGhhdCByZXF1aXJlIHR5cGUgY2hlY2sgYmxvY2tzLCB0aGVuIGl0IHdpbGwgYmUgcmV0dXJuZWQgZGlyZWN0bHkuIE90aGVyd2lzZSwgYSBuZXdcbiAgICogYHRzLlNvdXJjZUZpbGVgIGlzIHBhcnNlZCBmcm9tIG1vZGlmaWVkIHRleHQgb2YgdGhlIG9yaWdpbmFsLiBUaGlzIGlzIG5lY2Vzc2FyeSB0byBlbnN1cmUgdGhlXG4gICAqIGFkZGVkIGNvZGUgaGFzIGNvcnJlY3QgcG9zaXRpb25hbCBpbmZvcm1hdGlvbiBhc3NvY2lhdGVkIHdpdGggaXQuXG4gICAqL1xuICB0cmFuc2Zvcm0oc2Y6IHRzLlNvdXJjZUZpbGUpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gb3BlcmF0aW9ucyBwZW5kaW5nIGZvciB0aGlzIHBhcnRpY3VsYXIgZmlsZSwgcmV0dXJuIGl0IGRpcmVjdGx5LlxuICAgIGlmICghdGhpcy5vcE1hcC5oYXMoc2YpKSB7XG4gICAgICByZXR1cm4gc2Y7XG4gICAgfVxuXG4gICAgLy8gSW1wb3J0cyBtYXkgbmVlZCB0byBiZSBhZGRlZCB0byB0aGUgZmlsZSB0byBzdXBwb3J0IHR5cGUtY2hlY2tpbmcgb2YgZGlyZWN0aXZlcyB1c2VkIGluIHRoZVxuICAgIC8vIHRlbXBsYXRlIHdpdGhpbiBpdC5cbiAgICBjb25zdCBpbXBvcnRNYW5hZ2VyID0gbmV3IEltcG9ydE1hbmFnZXIobmV3IE5vb3BJbXBvcnRSZXdyaXRlcigpLCAnX2knKTtcblxuICAgIC8vIEVhY2ggT3AgaGFzIGEgc3BsaXRQb2ludCBpbmRleCBpbnRvIHRoZSB0ZXh0IHdoZXJlIGl0IG5lZWRzIHRvIGJlIGluc2VydGVkLiBTcGxpdCB0aGVcbiAgICAvLyBvcmlnaW5hbCBzb3VyY2UgdGV4dCBpbnRvIGNodW5rcyBhdCB0aGVzZSBzcGxpdCBwb2ludHMsIHdoZXJlIGNvZGUgd2lsbCBiZSBpbnNlcnRlZCBiZXR3ZWVuXG4gICAgLy8gdGhlIGNodW5rcy5cbiAgICBjb25zdCBvcHMgPSB0aGlzLm9wTWFwLmdldChzZikgIS5zb3J0KG9yZGVyT3BzKTtcbiAgICBjb25zdCB0ZXh0UGFydHMgPSBzcGxpdFN0cmluZ0F0UG9pbnRzKHNmLnRleHQsIG9wcy5tYXAob3AgPT4gb3Auc3BsaXRQb2ludCkpO1xuXG4gICAgLy8gVXNlIGEgYHRzLlByaW50ZXJgIHRvIGdlbmVyYXRlIHNvdXJjZSBjb2RlLlxuICAgIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKHtvbWl0VHJhaWxpbmdTZW1pY29sb246IHRydWV9KTtcblxuICAgIC8vIEJlZ2luIHdpdGggdGhlIGludGlhbCBzZWN0aW9uIG9mIHRoZSBjb2RlIHRleHQuXG4gICAgbGV0IGNvZGUgPSB0ZXh0UGFydHNbMF07XG5cbiAgICAvLyBQcm9jZXNzIGVhY2ggb3BlcmF0aW9uIGFuZCB1c2UgdGhlIHByaW50ZXIgdG8gZ2VuZXJhdGUgc291cmNlIGNvZGUgZm9yIGl0LCBpbnNlcnRpbmcgaXQgaW50b1xuICAgIC8vIHRoZSBzb3VyY2UgY29kZSBpbiBiZXR3ZWVuIHRoZSBvcmlnaW5hbCBjaHVua3MuXG4gICAgb3BzLmZvckVhY2goKG9wLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSBvcC5leGVjdXRlKGltcG9ydE1hbmFnZXIsIHNmLCB0aGlzLnJlZkVtaXR0ZXIsIHByaW50ZXIpO1xuICAgICAgY29kZSArPSAnXFxuXFxuJyArIHRleHQgKyB0ZXh0UGFydHNbaWR4ICsgMV07XG4gICAgfSk7XG5cbiAgICAvLyBXcml0ZSBvdXQgdGhlIGltcG9ydHMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGUuXG4gICAgbGV0IGltcG9ydHMgPSBpbXBvcnRNYW5hZ2VyLmdldEFsbEltcG9ydHMoc2YuZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChpID0+IGBpbXBvcnQgKiBhcyAke2kucXVhbGlmaWVyfSBmcm9tICcke2kuc3BlY2lmaWVyfSc7YClcbiAgICAgICAgICAgICAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgY29kZSA9IGltcG9ydHMgKyAnXFxuJyArIGNvZGU7XG5cbiAgICAvLyBQYXJzZSB0aGUgbmV3IHNvdXJjZSBmaWxlIGFuZCByZXR1cm4gaXQuXG4gICAgcmV0dXJuIHRzLmNyZWF0ZVNvdXJjZUZpbGUoc2YuZmlsZU5hbWUsIGNvZGUsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUsIHRzLlNjcmlwdEtpbmQuVFMpO1xuICB9XG5cbiAgY2FsY3VsYXRlVGVtcGxhdGVEaWFnbm9zdGljcyhcbiAgICAgIG9yaWdpbmFsUHJvZ3JhbTogdHMuUHJvZ3JhbSwgb3JpZ2luYWxIb3N0OiB0cy5Db21waWxlckhvc3QsXG4gICAgICBvcmlnaW5hbE9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyk6IHtcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY1tdLFxuICAgIHByb2dyYW06IHRzLlByb2dyYW0sXG4gIH0ge1xuICAgIGNvbnN0IHR5cGVDaGVja1NmID0gdGhpcy50eXBlQ2hlY2tGaWxlLnJlbmRlcigpO1xuICAgIC8vIEZpcnN0LCBidWlsZCB0aGUgbWFwIG9mIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAgICBjb25zdCBzZk1hcCA9IG5ldyBNYXA8c3RyaW5nLCB0cy5Tb3VyY2VGaWxlPigpO1xuICAgIGNvbnN0IGludGVyZXN0aW5nRmlsZXM6IHRzLlNvdXJjZUZpbGVbXSA9IFt0eXBlQ2hlY2tTZl07XG4gICAgZm9yIChjb25zdCBvcmlnaW5hbFNmIG9mIG9yaWdpbmFsUHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKSB7XG4gICAgICBjb25zdCBzZiA9IHRoaXMudHJhbnNmb3JtKG9yaWdpbmFsU2YpO1xuICAgICAgc2ZNYXAuc2V0KHNmLmZpbGVOYW1lLCBzZik7XG4gICAgICBpZiAoIXNmLmlzRGVjbGFyYXRpb25GaWxlICYmIHRoaXMub3BNYXAuaGFzKG9yaWdpbmFsU2YpKSB7XG4gICAgICAgIGludGVyZXN0aW5nRmlsZXMucHVzaChzZik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2ZNYXAuc2V0KHR5cGVDaGVja1NmLmZpbGVOYW1lLCB0eXBlQ2hlY2tTZik7XG5cbiAgICBjb25zdCB0eXBlQ2hlY2tQcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbSh7XG4gICAgICBob3N0OiBuZXcgVHlwZUNoZWNrUHJvZ3JhbUhvc3Qoc2ZNYXAsIG9yaWdpbmFsSG9zdCksXG4gICAgICBvcHRpb25zOiBvcmlnaW5hbE9wdGlvbnMsXG4gICAgICBvbGRQcm9ncmFtOiBvcmlnaW5hbFByb2dyYW0sXG4gICAgICByb290TmFtZXM6IG9yaWdpbmFsUHJvZ3JhbS5nZXRSb290RmlsZU5hbWVzKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkaWFnbm9zdGljczogRGlhZ25vc3RpY1tdID0gW107XG4gICAgY29uc3QgcmVzb2x2ZVNwYW4gPSAoc291cmNlTG9jYXRpb246IFNvdXJjZUxvY2F0aW9uKTogUGFyc2VTb3VyY2VTcGFuIHwgbnVsbCA9PiB7XG4gICAgICBpZiAoIXRoaXMudGVtcGxhdGVTb3VyY2VzLmhhcyhzb3VyY2VMb2NhdGlvbi5zb3VyY2VSZWZlcmVuY2UpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgdGVtcGxhdGVTb3VyY2UgPSB0aGlzLnRlbXBsYXRlU291cmNlcy5nZXQoc291cmNlTG9jYXRpb24uc291cmNlUmVmZXJlbmNlKSAhO1xuICAgICAgcmV0dXJuIHRlbXBsYXRlU291cmNlLnRvUGFyc2VTb3VyY2VTcGFuKHNvdXJjZUxvY2F0aW9uLnN0YXJ0LCBzb3VyY2VMb2NhdGlvbi5lbmQpO1xuICAgIH07XG4gICAgY29uc3QgY29sbGVjdERpYWdub3N0aWNzID0gKGRpYWdzOiByZWFkb25seSB0cy5EaWFnbm9zdGljW10pOiB2b2lkID0+IHtcbiAgICAgIGZvciAoY29uc3QgZGlhZ25vc3RpYyBvZiBkaWFncykge1xuICAgICAgICBpZiAoc2hvdWxkUmVwb3J0RGlhZ25vc3RpYyhkaWFnbm9zdGljKSkge1xuICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZWQgPSB0cmFuc2xhdGVEaWFnbm9zdGljKGRpYWdub3N0aWMsIHJlc29sdmVTcGFuKTtcblxuICAgICAgICAgIGlmICh0cmFuc2xhdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHRyYW5zbGF0ZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IHNmIG9mIGludGVyZXN0aW5nRmlsZXMpIHtcbiAgICAgIGNvbGxlY3REaWFnbm9zdGljcyh0eXBlQ2hlY2tQcm9ncmFtLmdldFNlbWFudGljRGlhZ25vc3RpY3Moc2YpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGlhZ25vc3RpY3MsXG4gICAgICBwcm9ncmFtOiB0eXBlQ2hlY2tQcm9ncmFtLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFkZElubGluZVR5cGVDaGVja0Jsb2NrKFxuICAgICAgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPj4sXG4gICAgICB0Y2JNZXRhOiBUeXBlQ2hlY2tCbG9ja01ldGFkYXRhKTogdm9pZCB7XG4gICAgY29uc3Qgc2YgPSByZWYubm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgaWYgKCF0aGlzLm9wTWFwLmhhcyhzZikpIHtcbiAgICAgIHRoaXMub3BNYXAuc2V0KHNmLCBbXSk7XG4gICAgfVxuICAgIGNvbnN0IG9wcyA9IHRoaXMub3BNYXAuZ2V0KHNmKSAhO1xuICAgIG9wcy5wdXNoKG5ldyBUY2JPcChyZWYsIHRjYk1ldGEsIHRoaXMuY29uZmlnKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBzb3VyY2Ugb2YgYSB0ZW1wbGF0ZSB0aGF0IHdhcyBwcm9jZXNzZWQgZHVyaW5nIHR5cGUtY2hlY2tpbmcuIFRoaXMgaW5mb3JtYXRpb24gaXNcbiAqIHVzZWQgd2hlbiB0cmFuc2xhdGluZyBwYXJzZSBvZmZzZXRzIGluIGRpYWdub3N0aWNzIGJhY2sgdG8gdGhlaXIgb3JpZ2luYWwgbGluZS9jb2x1bW4gbG9jYXRpb24uXG4gKi9cbmNsYXNzIFRlbXBsYXRlU291cmNlIHtcbiAgcHJpdmF0ZSBsaW5lU3RhcnRzOiBudW1iZXJbXXxudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpbGU6IFBhcnNlU291cmNlRmlsZSkge31cblxuICB0b1BhcnNlU291cmNlU3BhbihzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IFBhcnNlU291cmNlU3BhbiB7XG4gICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnRvUGFyc2VMb2NhdGlvbihzdGFydCk7XG4gICAgY29uc3QgZW5kTG9jID0gdGhpcy50b1BhcnNlTG9jYXRpb24oZW5kKTtcbiAgICByZXR1cm4gbmV3IFBhcnNlU291cmNlU3BhbihzdGFydExvYywgZW5kTG9jKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9QYXJzZUxvY2F0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICBjb25zdCBsaW5lU3RhcnRzID0gdGhpcy5hY3F1aXJlTGluZVN0YXJ0cygpO1xuICAgIGNvbnN0IHtsaW5lLCBjaGFyYWN0ZXJ9ID0gZ2V0TGluZUFuZENoYXJhY3RlckZyb21Qb3NpdGlvbihsaW5lU3RhcnRzLCBwb3NpdGlvbik7XG4gICAgcmV0dXJuIG5ldyBQYXJzZUxvY2F0aW9uKHRoaXMuZmlsZSwgcG9zaXRpb24sIGxpbmUsIGNoYXJhY3Rlcik7XG4gIH1cblxuICBwcml2YXRlIGFjcXVpcmVMaW5lU3RhcnRzKCk6IG51bWJlcltdIHtcbiAgICBpZiAodGhpcy5saW5lU3RhcnRzID09PSBudWxsKSB7XG4gICAgICB0aGlzLmxpbmVTdGFydHMgPSBjb21wdXRlTGluZVN0YXJ0c01hcCh0aGlzLmZpbGUuY29udGVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxpbmVTdGFydHM7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvZGUgZ2VuZXJhdGlvbiBvcGVyYXRpb24gdGhhdCBuZWVkcyB0byBoYXBwZW4gd2l0aGluIGEgZ2l2ZW4gc291cmNlIGZpbGUuXG4gKi9cbmludGVyZmFjZSBPcCB7XG4gIC8qKlxuICAgKiBUaGUgbm9kZSBpbiB0aGUgZmlsZSB3aGljaCB3aWxsIGhhdmUgY29kZSBnZW5lcmF0ZWQgZm9yIGl0LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPj47XG5cbiAgLyoqXG4gICAqIEluZGV4IGludG8gdGhlIHNvdXJjZSB0ZXh0IHdoZXJlIHRoZSBjb2RlIGdlbmVyYXRlZCBieSB0aGUgb3BlcmF0aW9uIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHNwbGl0UG9pbnQ6IG51bWJlcjtcblxuICAvKipcbiAgICogRXhlY3V0ZSB0aGUgb3BlcmF0aW9uIGFuZCByZXR1cm4gdGhlIGdlbmVyYXRlZCBjb2RlIGFzIHRleHQuXG4gICAqL1xuICBleGVjdXRlKGltOiBJbXBvcnRNYW5hZ2VyLCBzZjogdHMuU291cmNlRmlsZSwgcmVmRW1pdHRlcjogUmVmZXJlbmNlRW1pdHRlciwgcHJpbnRlcjogdHMuUHJpbnRlcik6XG4gICAgICBzdHJpbmc7XG59XG5cbi8qKlxuICogQSB0eXBlIGNoZWNrIGJsb2NrIG9wZXJhdGlvbiB3aGljaCBwcm9kdWNlcyB0eXBlIGNoZWNrIGNvZGUgZm9yIGEgcGFydGljdWxhciBjb21wb25lbnQuXG4gKi9cbmNsYXNzIFRjYk9wIGltcGxlbWVudHMgT3Age1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4+LFxuICAgICAgcmVhZG9ubHkgbWV0YTogVHlwZUNoZWNrQmxvY2tNZXRhZGF0YSwgcmVhZG9ubHkgY29uZmlnOiBUeXBlQ2hlY2tpbmdDb25maWcpIHt9XG5cbiAgLyoqXG4gICAqIFR5cGUgY2hlY2sgYmxvY2tzIGFyZSBpbnNlcnRlZCBpbW1lZGlhdGVseSBhZnRlciB0aGUgZW5kIG9mIHRoZSBjb21wb25lbnQgY2xhc3MuXG4gICAqL1xuICBnZXQgc3BsaXRQb2ludCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5yZWYubm9kZS5lbmQgKyAxOyB9XG5cbiAgZXhlY3V0ZShpbTogSW1wb3J0TWFuYWdlciwgc2Y6IHRzLlNvdXJjZUZpbGUsIHJlZkVtaXR0ZXI6IFJlZmVyZW5jZUVtaXR0ZXIsIHByaW50ZXI6IHRzLlByaW50ZXIpOlxuICAgICAgc3RyaW5nIHtcbiAgICBjb25zdCBlbnYgPSBuZXcgRW52aXJvbm1lbnQodGhpcy5jb25maWcsIGltLCByZWZFbWl0dGVyLCBzZik7XG4gICAgY29uc3QgZm5OYW1lID0gdHMuY3JlYXRlSWRlbnRpZmllcihgX3RjYl8ke3RoaXMucmVmLm5vZGUucG9zfWApO1xuICAgIGNvbnN0IGZuID0gZ2VuZXJhdGVUeXBlQ2hlY2tCbG9jayhlbnYsIHRoaXMucmVmLCBmbk5hbWUsIHRoaXMubWV0YSk7XG4gICAgcmV0dXJuIHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBmbiwgc2YpO1xuICB9XG59XG5cbi8qKlxuICogQSB0eXBlIGNvbnN0cnVjdG9yIG9wZXJhdGlvbiB3aGljaCBwcm9kdWNlcyB0eXBlIGNvbnN0cnVjdG9yIGNvZGUgZm9yIGEgcGFydGljdWxhciBkaXJlY3RpdmUuXG4gKi9cbmNsYXNzIFR5cGVDdG9yT3AgaW1wbGVtZW50cyBPcCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcmVhZG9ubHkgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPj4sXG4gICAgICByZWFkb25seSBtZXRhOiBUeXBlQ3Rvck1ldGFkYXRhLCBwcml2YXRlIGNvbmZpZzogVHlwZUNoZWNraW5nQ29uZmlnKSB7fVxuXG4gIC8qKlxuICAgKiBUeXBlIGNvbnN0cnVjdG9yIG9wZXJhdGlvbnMgYXJlIGluc2VydGVkIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZW5kIG9mIHRoZSBkaXJlY3RpdmUgY2xhc3MuXG4gICAqL1xuICBnZXQgc3BsaXRQb2ludCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5yZWYubm9kZS5lbmQgLSAxOyB9XG5cbiAgZXhlY3V0ZShpbTogSW1wb3J0TWFuYWdlciwgc2Y6IHRzLlNvdXJjZUZpbGUsIHJlZkVtaXR0ZXI6IFJlZmVyZW5jZUVtaXR0ZXIsIHByaW50ZXI6IHRzLlByaW50ZXIpOlxuICAgICAgc3RyaW5nIHtcbiAgICBjb25zdCB0Y2IgPSBnZW5lcmF0ZUlubGluZVR5cGVDdG9yKHRoaXMucmVmLm5vZGUsIHRoaXMubWV0YSwgdGhpcy5jb25maWcpO1xuICAgIHJldHVybiBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgdGNiLCBzZik7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21wYXJlIHR3byBvcGVyYXRpb25zIGFuZCByZXR1cm4gdGhlaXIgc3BsaXQgcG9pbnQgb3JkZXJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9yZGVyT3BzKG9wMTogT3AsIG9wMjogT3ApOiBudW1iZXIge1xuICByZXR1cm4gb3AxLnNwbGl0UG9pbnQgLSBvcDIuc3BsaXRQb2ludDtcbn1cblxuLyoqXG4gKiBTcGxpdCBhIHN0cmluZyBpbnRvIGNodW5rcyBhdCBhbnkgbnVtYmVyIG9mIHNwbGl0IHBvaW50cy5cbiAqL1xuZnVuY3Rpb24gc3BsaXRTdHJpbmdBdFBvaW50cyhzdHI6IHN0cmluZywgcG9pbnRzOiBudW1iZXJbXSk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgc3BsaXRzOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgc3RhcnQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBvaW50ID0gcG9pbnRzW2ldO1xuICAgIHNwbGl0cy5wdXNoKHN0ci5zdWJzdHJpbmcoc3RhcnQsIHBvaW50KSk7XG4gICAgc3RhcnQgPSBwb2ludDtcbiAgfVxuICBzcGxpdHMucHVzaChzdHIuc3Vic3RyaW5nKHN0YXJ0KSk7XG4gIHJldHVybiBzcGxpdHM7XG59XG4iXX0=
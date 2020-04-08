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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/environment", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_constructor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var ts_util_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util");
    var type_constructor_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_constructor");
    /**
     * A context which hosts one or more Type Check Blocks (TCBs).
     *
     * An `Environment` supports the generation of TCBs by tracking necessary imports, declarations of
     * type constructors, and other statements beyond the type-checking code within the TCB itself.
     * Through method calls on `Environment`, the TCB generator can request `ts.Expression`s which
     * reference declarations in the `Environment` for these artifacts`.
     *
     * `Environment` can be used in a standalone fashion, or can be extended to support more specialized
     * usage.
     */
    var Environment = /** @class */ (function () {
        function Environment(config, importManager, refEmitter, contextFile) {
            this.config = config;
            this.importManager = importManager;
            this.refEmitter = refEmitter;
            this.contextFile = contextFile;
            this.nextIds = {
                pipeInst: 1,
                typeCtor: 1,
            };
            this.typeCtors = new Map();
            this.typeCtorStatements = [];
            this.pipeInsts = new Map();
            this.pipeInstStatements = [];
        }
        /**
         * Get an expression referring to a type constructor for the given directive.
         *
         * Depending on the shape of the directive itself, this could be either a reference to a declared
         * type constructor, or to an inline type constructor.
         */
        Environment.prototype.typeCtorFor = function (dir) {
            var dirRef = dir.ref;
            var node = dirRef.node;
            if (this.typeCtors.has(node)) {
                return this.typeCtors.get(node);
            }
            if (type_constructor_1.requiresInlineTypeCtor(node)) {
                // The constructor has already been created inline, we just need to construct a reference to
                // it.
                var ref = this.reference(dirRef);
                var typeCtorExpr = ts.createPropertyAccess(ref, 'ngTypeCtor');
                this.typeCtors.set(node, typeCtorExpr);
                return typeCtorExpr;
            }
            else {
                var fnName = "_ctor" + this.nextIds.typeCtor++;
                var nodeTypeRef = this.referenceType(dirRef);
                if (!ts.isTypeReferenceNode(nodeTypeRef)) {
                    throw new Error("Expected TypeReferenceNode from reference to " + dirRef.debugName);
                }
                var meta = {
                    fnName: fnName,
                    body: true,
                    fields: {
                        inputs: Object.keys(dir.inputs),
                        outputs: Object.keys(dir.outputs),
                        // TODO: support queries
                        queries: dir.queries,
                    }
                };
                var typeCtor = type_constructor_1.generateTypeCtorDeclarationFn(node, meta, nodeTypeRef.typeName, this.config);
                this.typeCtorStatements.push(typeCtor);
                var fnId = ts.createIdentifier(fnName);
                this.typeCtors.set(node, fnId);
                return fnId;
            }
        };
        /*
         * Get an expression referring to an instance of the given pipe.
         */
        Environment.prototype.pipeInst = function (ref) {
            if (this.pipeInsts.has(ref.node)) {
                return this.pipeInsts.get(ref.node);
            }
            var pipeType = this.referenceType(ref);
            var pipeInstId = ts.createIdentifier("_pipe" + this.nextIds.pipeInst++);
            this.pipeInstStatements.push(ts_util_1.tsDeclareVariable(pipeInstId, pipeType));
            this.pipeInsts.set(ref.node, pipeInstId);
            return pipeInstId;
        };
        /**
         * Generate a `ts.Expression` that references the given node.
         *
         * This may involve importing the node into the file if it's not declared there already.
         */
        Environment.prototype.reference = function (ref) {
            var ngExpr = this.refEmitter.emit(ref, this.contextFile);
            // Use `translateExpression` to convert the `Expression` into a `ts.Expression`.
            return translator_1.translateExpression(ngExpr, this.importManager, imports_1.NOOP_DEFAULT_IMPORT_RECORDER);
        };
        /**
         * Generate a `ts.TypeNode` that references the given node as a type.
         *
         * This may involve importing the node into the file if it's not declared there already.
         */
        Environment.prototype.referenceType = function (ref) {
            var ngExpr = this.refEmitter.emit(ref, this.contextFile);
            // Create an `ExpressionType` from the `Expression` and translate it via `translateType`.
            // TODO(alxhub): support references to types with generic arguments in a clean way.
            return translator_1.translateType(new compiler_1.ExpressionType(ngExpr), this.importManager);
        };
        /**
         * Generate a `ts.TypeNode` that references a given type from '@angular/core'.
         *
         * This will involve importing the type into the file, and will also add a number of generic type
         * parameters (using `any`) as requested.
         */
        Environment.prototype.referenceCoreType = function (name, typeParamCount) {
            if (typeParamCount === void 0) { typeParamCount = 0; }
            var external = new compiler_1.ExternalExpr({
                moduleName: '@angular/core',
                name: name,
            });
            var typeParams = null;
            if (typeParamCount > 0) {
                typeParams = [];
                for (var i = 0; i < typeParamCount; i++) {
                    typeParams.push(compiler_1.DYNAMIC_TYPE);
                }
            }
            return translator_1.translateType(new compiler_1.ExpressionType(external, null, typeParams), this.importManager);
        };
        Environment.prototype.getPreludeStatements = function () {
            return tslib_1.__spread(this.pipeInstStatements, this.typeCtorStatements);
        };
        return Environment;
    }());
    exports.Environment = Environment;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3R5cGVjaGVjay9zcmMvZW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQW1GO0lBQ25GLCtCQUFpQztJQUVqQyxtRUFBd0Y7SUFFeEYseUVBQW1GO0lBR25GLGlGQUE0QztJQUM1QyxtR0FBeUY7SUFFekY7Ozs7Ozs7Ozs7T0FVRztJQUNIO1FBWUUscUJBQ2EsTUFBMEIsRUFBWSxhQUE0QixFQUNuRSxVQUE0QixFQUFZLFdBQTBCO1lBRGpFLFdBQU0sR0FBTixNQUFNLENBQW9CO1lBQVksa0JBQWEsR0FBYixhQUFhLENBQWU7WUFDbkUsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7WUFBWSxnQkFBVyxHQUFYLFdBQVcsQ0FBZTtZQWJ0RSxZQUFPLEdBQUc7Z0JBQ2hCLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFFBQVEsRUFBRSxDQUFDO2FBQ1osQ0FBQztZQUVNLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBbUMsQ0FBQztZQUNyRCx1QkFBa0IsR0FBbUIsRUFBRSxDQUFDO1lBRTFDLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBbUMsQ0FBQztZQUNyRCx1QkFBa0IsR0FBbUIsRUFBRSxDQUFDO1FBSStCLENBQUM7UUFFbEY7Ozs7O1dBS0c7UUFDSCxpQ0FBVyxHQUFYLFVBQVksR0FBK0I7WUFDekMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQXVELENBQUM7WUFDM0UsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElB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Q29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RFlOQU1JQ19UWVBFLCBFeHByZXNzaW9uVHlwZSwgRXh0ZXJuYWxFeHByLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtOT09QX0RFRkFVTFRfSU1QT1JUX1JFQ09SREVSLCBSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXR0ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9ufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7SW1wb3J0TWFuYWdlciwgdHJhbnNsYXRlRXhwcmVzc2lvbiwgdHJhbnNsYXRlVHlwZX0gZnJvbSAnLi4vLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7VHlwZUNoZWNrYWJsZURpcmVjdGl2ZU1ldGEsIFR5cGVDaGVja2luZ0NvbmZpZywgVHlwZUN0b3JNZXRhZGF0YX0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHt0c0RlY2xhcmVWYXJpYWJsZX0gZnJvbSAnLi90c191dGlsJztcbmltcG9ydCB7Z2VuZXJhdGVUeXBlQ3RvckRlY2xhcmF0aW9uRm4sIHJlcXVpcmVzSW5saW5lVHlwZUN0b3J9IGZyb20gJy4vdHlwZV9jb25zdHJ1Y3Rvcic7XG5cbi8qKlxuICogQSBjb250ZXh0IHdoaWNoIGhvc3RzIG9uZSBvciBtb3JlIFR5cGUgQ2hlY2sgQmxvY2tzIChUQ0JzKS5cbiAqXG4gKiBBbiBgRW52aXJvbm1lbnRgIHN1cHBvcnRzIHRoZSBnZW5lcmF0aW9uIG9mIFRDQnMgYnkgdHJhY2tpbmcgbmVjZXNzYXJ5IGltcG9ydHMsIGRlY2xhcmF0aW9ucyBvZlxuICogdHlwZSBjb25zdHJ1Y3RvcnMsIGFuZCBvdGhlciBzdGF0ZW1lbnRzIGJleW9uZCB0aGUgdHlwZS1jaGVja2luZyBjb2RlIHdpdGhpbiB0aGUgVENCIGl0c2VsZi5cbiAqIFRocm91Z2ggbWV0aG9kIGNhbGxzIG9uIGBFbnZpcm9ubWVudGAsIHRoZSBUQ0IgZ2VuZXJhdG9yIGNhbiByZXF1ZXN0IGB0cy5FeHByZXNzaW9uYHMgd2hpY2hcbiAqIHJlZmVyZW5jZSBkZWNsYXJhdGlvbnMgaW4gdGhlIGBFbnZpcm9ubWVudGAgZm9yIHRoZXNlIGFydGlmYWN0c2AuXG4gKlxuICogYEVudmlyb25tZW50YCBjYW4gYmUgdXNlZCBpbiBhIHN0YW5kYWxvbmUgZmFzaGlvbiwgb3IgY2FuIGJlIGV4dGVuZGVkIHRvIHN1cHBvcnQgbW9yZSBzcGVjaWFsaXplZFxuICogdXNhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCB7XG4gIHByaXZhdGUgbmV4dElkcyA9IHtcbiAgICBwaXBlSW5zdDogMSxcbiAgICB0eXBlQ3RvcjogMSxcbiAgfTtcblxuICBwcml2YXRlIHR5cGVDdG9ycyA9IG5ldyBNYXA8Q2xhc3NEZWNsYXJhdGlvbiwgdHMuRXhwcmVzc2lvbj4oKTtcbiAgcHJvdGVjdGVkIHR5cGVDdG9yU3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBbXTtcblxuICBwcml2YXRlIHBpcGVJbnN0cyA9IG5ldyBNYXA8Q2xhc3NEZWNsYXJhdGlvbiwgdHMuRXhwcmVzc2lvbj4oKTtcbiAgcHJvdGVjdGVkIHBpcGVJbnN0U3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IGNvbmZpZzogVHlwZUNoZWNraW5nQ29uZmlnLCBwcm90ZWN0ZWQgaW1wb3J0TWFuYWdlcjogSW1wb3J0TWFuYWdlcixcbiAgICAgIHByaXZhdGUgcmVmRW1pdHRlcjogUmVmZXJlbmNlRW1pdHRlciwgcHJvdGVjdGVkIGNvbnRleHRGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gZXhwcmVzc2lvbiByZWZlcnJpbmcgdG8gYSB0eXBlIGNvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gZGlyZWN0aXZlLlxuICAgKlxuICAgKiBEZXBlbmRpbmcgb24gdGhlIHNoYXBlIG9mIHRoZSBkaXJlY3RpdmUgaXRzZWxmLCB0aGlzIGNvdWxkIGJlIGVpdGhlciBhIHJlZmVyZW5jZSB0byBhIGRlY2xhcmVkXG4gICAqIHR5cGUgY29uc3RydWN0b3IsIG9yIHRvIGFuIGlubGluZSB0eXBlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgdHlwZUN0b3JGb3IoZGlyOiBUeXBlQ2hlY2thYmxlRGlyZWN0aXZlTWV0YSk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IGRpclJlZiA9IGRpci5yZWYgYXMgUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4+O1xuICAgIGNvbnN0IG5vZGUgPSBkaXJSZWYubm9kZTtcbiAgICBpZiAodGhpcy50eXBlQ3RvcnMuaGFzKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy50eXBlQ3RvcnMuZ2V0KG5vZGUpICE7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVpcmVzSW5saW5lVHlwZUN0b3Iobm9kZSkpIHtcbiAgICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBoYXMgYWxyZWFkeSBiZWVuIGNyZWF0ZWQgaW5saW5lLCB3ZSBqdXN0IG5lZWQgdG8gY29uc3RydWN0IGEgcmVmZXJlbmNlIHRvXG4gICAgICAvLyBpdC5cbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMucmVmZXJlbmNlKGRpclJlZik7XG4gICAgICBjb25zdCB0eXBlQ3RvckV4cHIgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhyZWYsICduZ1R5cGVDdG9yJyk7XG4gICAgICB0aGlzLnR5cGVDdG9ycy5zZXQobm9kZSwgdHlwZUN0b3JFeHByKTtcbiAgICAgIHJldHVybiB0eXBlQ3RvckV4cHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZuTmFtZSA9IGBfY3RvciR7dGhpcy5uZXh0SWRzLnR5cGVDdG9yKyt9YDtcbiAgICAgIGNvbnN0IG5vZGVUeXBlUmVmID0gdGhpcy5yZWZlcmVuY2VUeXBlKGRpclJlZik7XG4gICAgICBpZiAoIXRzLmlzVHlwZVJlZmVyZW5jZU5vZGUobm9kZVR5cGVSZWYpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgVHlwZVJlZmVyZW5jZU5vZGUgZnJvbSByZWZlcmVuY2UgdG8gJHtkaXJSZWYuZGVidWdOYW1lfWApO1xuICAgICAgfVxuICAgICAgY29uc3QgbWV0YTogVHlwZUN0b3JNZXRhZGF0YSA9IHtcbiAgICAgICAgZm5OYW1lLFxuICAgICAgICBib2R5OiB0cnVlLFxuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBpbnB1dHM6IE9iamVjdC5rZXlzKGRpci5pbnB1dHMpLFxuICAgICAgICAgIG91dHB1dHM6IE9iamVjdC5rZXlzKGRpci5vdXRwdXRzKSxcbiAgICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IHF1ZXJpZXNcbiAgICAgICAgICBxdWVyaWVzOiBkaXIucXVlcmllcyxcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHR5cGVDdG9yID0gZ2VuZXJhdGVUeXBlQ3RvckRlY2xhcmF0aW9uRm4obm9kZSwgbWV0YSwgbm9kZVR5cGVSZWYudHlwZU5hbWUsIHRoaXMuY29uZmlnKTtcbiAgICAgIHRoaXMudHlwZUN0b3JTdGF0ZW1lbnRzLnB1c2godHlwZUN0b3IpO1xuICAgICAgY29uc3QgZm5JZCA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoZm5OYW1lKTtcbiAgICAgIHRoaXMudHlwZUN0b3JzLnNldChub2RlLCBmbklkKTtcbiAgICAgIHJldHVybiBmbklkO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIEdldCBhbiBleHByZXNzaW9uIHJlZmVycmluZyB0byBhbiBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gcGlwZS5cbiAgICovXG4gIHBpcGVJbnN0KHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4+KTogdHMuRXhwcmVzc2lvbiB7XG4gICAgaWYgKHRoaXMucGlwZUluc3RzLmhhcyhyZWYubm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBpcGVJbnN0cy5nZXQocmVmLm5vZGUpICE7XG4gICAgfVxuXG4gICAgY29uc3QgcGlwZVR5cGUgPSB0aGlzLnJlZmVyZW5jZVR5cGUocmVmKTtcbiAgICBjb25zdCBwaXBlSW5zdElkID0gdHMuY3JlYXRlSWRlbnRpZmllcihgX3BpcGUke3RoaXMubmV4dElkcy5waXBlSW5zdCsrfWApO1xuXG4gICAgdGhpcy5waXBlSW5zdFN0YXRlbWVudHMucHVzaCh0c0RlY2xhcmVWYXJpYWJsZShwaXBlSW5zdElkLCBwaXBlVHlwZSkpO1xuICAgIHRoaXMucGlwZUluc3RzLnNldChyZWYubm9kZSwgcGlwZUluc3RJZCk7XG5cbiAgICByZXR1cm4gcGlwZUluc3RJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIGB0cy5FeHByZXNzaW9uYCB0aGF0IHJlZmVyZW5jZXMgdGhlIGdpdmVuIG5vZGUuXG4gICAqXG4gICAqIFRoaXMgbWF5IGludm9sdmUgaW1wb3J0aW5nIHRoZSBub2RlIGludG8gdGhlIGZpbGUgaWYgaXQncyBub3QgZGVjbGFyZWQgdGhlcmUgYWxyZWFkeS5cbiAgICovXG4gIHJlZmVyZW5jZShyZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPHRzLkNsYXNzRGVjbGFyYXRpb24+Pik6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IG5nRXhwciA9IHRoaXMucmVmRW1pdHRlci5lbWl0KHJlZiwgdGhpcy5jb250ZXh0RmlsZSk7XG5cbiAgICAvLyBVc2UgYHRyYW5zbGF0ZUV4cHJlc3Npb25gIHRvIGNvbnZlcnQgdGhlIGBFeHByZXNzaW9uYCBpbnRvIGEgYHRzLkV4cHJlc3Npb25gLlxuICAgIHJldHVybiB0cmFuc2xhdGVFeHByZXNzaW9uKG5nRXhwciwgdGhpcy5pbXBvcnRNYW5hZ2VyLCBOT09QX0RFRkFVTFRfSU1QT1JUX1JFQ09SREVSKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIGB0cy5UeXBlTm9kZWAgdGhhdCByZWZlcmVuY2VzIHRoZSBnaXZlbiBub2RlIGFzIGEgdHlwZS5cbiAgICpcbiAgICogVGhpcyBtYXkgaW52b2x2ZSBpbXBvcnRpbmcgdGhlIG5vZGUgaW50byB0aGUgZmlsZSBpZiBpdCdzIG5vdCBkZWNsYXJlZCB0aGVyZSBhbHJlYWR5LlxuICAgKi9cbiAgcmVmZXJlbmNlVHlwZShyZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPHRzLkNsYXNzRGVjbGFyYXRpb24+Pik6IHRzLlR5cGVOb2RlIHtcbiAgICBjb25zdCBuZ0V4cHIgPSB0aGlzLnJlZkVtaXR0ZXIuZW1pdChyZWYsIHRoaXMuY29udGV4dEZpbGUpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGBFeHByZXNzaW9uVHlwZWAgZnJvbSB0aGUgYEV4cHJlc3Npb25gIGFuZCB0cmFuc2xhdGUgaXQgdmlhIGB0cmFuc2xhdGVUeXBlYC5cbiAgICAvLyBUT0RPKGFseGh1Yik6IHN1cHBvcnQgcmVmZXJlbmNlcyB0byB0eXBlcyB3aXRoIGdlbmVyaWMgYXJndW1lbnRzIGluIGEgY2xlYW4gd2F5LlxuICAgIHJldHVybiB0cmFuc2xhdGVUeXBlKG5ldyBFeHByZXNzaW9uVHlwZShuZ0V4cHIpLCB0aGlzLmltcG9ydE1hbmFnZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgYHRzLlR5cGVOb2RlYCB0aGF0IHJlZmVyZW5jZXMgYSBnaXZlbiB0eXBlIGZyb20gJ0Bhbmd1bGFyL2NvcmUnLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgaW52b2x2ZSBpbXBvcnRpbmcgdGhlIHR5cGUgaW50byB0aGUgZmlsZSwgYW5kIHdpbGwgYWxzbyBhZGQgYSBudW1iZXIgb2YgZ2VuZXJpYyB0eXBlXG4gICAqIHBhcmFtZXRlcnMgKHVzaW5nIGBhbnlgKSBhcyByZXF1ZXN0ZWQuXG4gICAqL1xuICByZWZlcmVuY2VDb3JlVHlwZShuYW1lOiBzdHJpbmcsIHR5cGVQYXJhbUNvdW50OiBudW1iZXIgPSAwKTogdHMuVHlwZU5vZGUge1xuICAgIGNvbnN0IGV4dGVybmFsID0gbmV3IEV4dGVybmFsRXhwcih7XG4gICAgICBtb2R1bGVOYW1lOiAnQGFuZ3VsYXIvY29yZScsXG4gICAgICBuYW1lLFxuICAgIH0pO1xuICAgIGxldCB0eXBlUGFyYW1zOiBUeXBlW118bnVsbCA9IG51bGw7XG4gICAgaWYgKHR5cGVQYXJhbUNvdW50ID4gMCkge1xuICAgICAgdHlwZVBhcmFtcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlUGFyYW1Db3VudDsgaSsrKSB7XG4gICAgICAgIHR5cGVQYXJhbXMucHVzaChEWU5BTUlDX1RZUEUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhbnNsYXRlVHlwZShuZXcgRXhwcmVzc2lvblR5cGUoZXh0ZXJuYWwsIG51bGwsIHR5cGVQYXJhbXMpLCB0aGlzLmltcG9ydE1hbmFnZXIpO1xuICB9XG5cbiAgZ2V0UHJlbHVkZVN0YXRlbWVudHMoKTogdHMuU3RhdGVtZW50W10ge1xuICAgIHJldHVybiBbXG4gICAgICAuLi50aGlzLnBpcGVJbnN0U3RhdGVtZW50cyxcbiAgICAgIC4uLnRoaXMudHlwZUN0b3JTdGF0ZW1lbnRzLFxuICAgIF07XG4gIH1cbn1cbiJdfQ==
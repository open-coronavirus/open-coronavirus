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
        define("@angular/compiler-cli/src/transformers/tsc_pass_through", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/switch"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var switch_1 = require("@angular/compiler-cli/src/ngtsc/switch");
    /**
     * An implementation of the `Program` API which behaves similarly to plain `tsc`.
     *
     * The only Angular specific behavior included in this `Program` is the operation of the Ivy
     * switch to turn on render3 behavior.
     *
     * This allows `ngc` to behave like `tsc` in cases where JIT code needs to be tested.
     */
    var TscPassThroughProgram = /** @class */ (function () {
        function TscPassThroughProgram(rootNames, options, host, oldProgram) {
            this.options = options;
            this.host = host;
            this.tsProgram =
                ts.createProgram(rootNames, options, host, oldProgram && oldProgram.getTsProgram());
        }
        TscPassThroughProgram.prototype.getTsProgram = function () { return this.tsProgram; };
        TscPassThroughProgram.prototype.getTsOptionDiagnostics = function (cancellationToken) {
            return this.tsProgram.getOptionsDiagnostics(cancellationToken);
        };
        TscPassThroughProgram.prototype.getNgOptionDiagnostics = function (cancellationToken) {
            return [];
        };
        TscPassThroughProgram.prototype.getTsSyntacticDiagnostics = function (sourceFile, cancellationToken) {
            return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
        };
        TscPassThroughProgram.prototype.getNgStructuralDiagnostics = function (cancellationToken) {
            return [];
        };
        TscPassThroughProgram.prototype.getTsSemanticDiagnostics = function (sourceFile, cancellationToken) {
            return this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
        };
        TscPassThroughProgram.prototype.getNgSemanticDiagnostics = function (fileName, cancellationToken) {
            return [];
        };
        TscPassThroughProgram.prototype.loadNgStructureAsync = function () { return Promise.resolve(); };
        TscPassThroughProgram.prototype.listLazyRoutes = function (entryRoute) {
            throw new Error('Method not implemented.');
        };
        TscPassThroughProgram.prototype.getLibrarySummaries = function () {
            throw new Error('Method not implemented.');
        };
        TscPassThroughProgram.prototype.getEmittedGeneratedFiles = function () {
            throw new Error('Method not implemented.');
        };
        TscPassThroughProgram.prototype.getEmittedSourceFiles = function () {
            throw new Error('Method not implemented.');
        };
        TscPassThroughProgram.prototype.emit = function (opts) {
            var emitCallback = opts && opts.emitCallback || defaultEmitCallback;
            var emitResult = emitCallback({
                program: this.tsProgram,
                host: this.host,
                options: this.options,
                emitOnlyDtsFiles: false,
                customTransformers: { before: [switch_1.ivySwitchTransform] },
            });
            return emitResult;
        };
        return TscPassThroughProgram;
    }());
    exports.TscPassThroughProgram = TscPassThroughProgram;
    var defaultEmitCallback = function (_a) {
        var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, customTransformers = _a.customTransformers;
        return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjX3Bhc3NfdGhyb3VnaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL3RzY19wYXNzX3Rocm91Z2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFJSCwrQkFBaUM7SUFFakMsaUVBQW1EO0lBSW5EOzs7Ozs7O09BT0c7SUFDSDtRQUdFLCtCQUNJLFNBQWdDLEVBQVUsT0FBNEIsRUFDOUQsSUFBc0IsRUFBRSxVQUF3QjtZQURkLFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQzlELFNBQUksR0FBSixJQUFJLENBQWtCO1lBQ2hDLElBQUksQ0FBQyxTQUFTO2dCQUNWLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQzFGLENBQUM7UUFFRCw0Q0FBWSxHQUFaLGNBQTZCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFckQsc0RBQXNCLEdBQXRCLFVBQXVCLGlCQUNTO1lBQzlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxzREFBc0IsR0FBdEIsVUFBdUIsaUJBQ1M7WUFDOUIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQseURBQXlCLEdBQXpCLFVBQ0ksVUFBb0MsRUFDcEMsaUJBQWtEO1lBQ3BELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBRUQsMERBQTBCLEdBQTFCLFVBQTJCLGlCQUNTO1lBQ2xDLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVELHdEQUF3QixHQUF4QixVQUNJLFVBQW9DLEVBQ3BDLGlCQUFrRDtZQUNwRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUVELHdEQUF3QixHQUF4QixVQUNJLFFBQTJCLEVBQzNCLGlCQUFrRDtZQUNwRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFFRCxvREFBb0IsR0FBcEIsY0FBd0MsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRW5FLDhDQUFjLEdBQWQsVUFBZSxVQUE2QjtZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELG1EQUFtQixHQUFuQjtZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsd0RBQXdCLEdBQXhCO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxxREFBcUIsR0FBckI7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELG9DQUFJLEdBQUosVUFBSyxJQU1KO1lBQ0MsSUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksbUJBQW1CLENBQUM7WUFFdEUsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDO2dCQUM5QixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLGtCQUFrQixFQUFFLEVBQUMsTUFBTSxFQUFFLENBQUMsMkJBQWtCLENBQUMsRUFBQzthQUNuRCxDQUFDLENBQUM7WUFDSCxPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDO1FBQ0gsNEJBQUM7SUFBRCxDQUFDLEFBakZELElBaUZDO0lBakZZLHNEQUFxQjtJQW1GbEMsSUFBTSxtQkFBbUIsR0FDckIsVUFBQyxFQUNvQjtZQURuQixvQkFBTyxFQUFFLHNDQUFnQixFQUFFLHdCQUFTLEVBQUUsd0NBQWlCLEVBQUUsc0NBQWdCLEVBQ3pFLDBDQUFrQjtRQUNoQixPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQ1IsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDO0lBRHpGLENBQ3lGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7R2VuZXJhdGVkRmlsZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2l2eVN3aXRjaFRyYW5zZm9ybX0gZnJvbSAnLi4vbmd0c2Mvc3dpdGNoJztcbmltcG9ydCAqIGFzIGFwaSBmcm9tICcuLi90cmFuc2Zvcm1lcnMvYXBpJztcblxuXG4vKipcbiAqIEFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgUHJvZ3JhbWAgQVBJIHdoaWNoIGJlaGF2ZXMgc2ltaWxhcmx5IHRvIHBsYWluIGB0c2NgLlxuICpcbiAqIFRoZSBvbmx5IEFuZ3VsYXIgc3BlY2lmaWMgYmVoYXZpb3IgaW5jbHVkZWQgaW4gdGhpcyBgUHJvZ3JhbWAgaXMgdGhlIG9wZXJhdGlvbiBvZiB0aGUgSXZ5XG4gKiBzd2l0Y2ggdG8gdHVybiBvbiByZW5kZXIzIGJlaGF2aW9yLlxuICpcbiAqIFRoaXMgYWxsb3dzIGBuZ2NgIHRvIGJlaGF2ZSBsaWtlIGB0c2NgIGluIGNhc2VzIHdoZXJlIEpJVCBjb2RlIG5lZWRzIHRvIGJlIHRlc3RlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRzY1Bhc3NUaHJvdWdoUHJvZ3JhbSBpbXBsZW1lbnRzIGFwaS5Qcm9ncmFtIHtcbiAgcHJpdmF0ZSB0c1Byb2dyYW06IHRzLlByb2dyYW07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICByb290TmFtZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiwgcHJpdmF0ZSBvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zLFxuICAgICAgcHJpdmF0ZSBob3N0OiBhcGkuQ29tcGlsZXJIb3N0LCBvbGRQcm9ncmFtPzogYXBpLlByb2dyYW0pIHtcbiAgICB0aGlzLnRzUHJvZ3JhbSA9XG4gICAgICAgIHRzLmNyZWF0ZVByb2dyYW0ocm9vdE5hbWVzLCBvcHRpb25zLCBob3N0LCBvbGRQcm9ncmFtICYmIG9sZFByb2dyYW0uZ2V0VHNQcm9ncmFtKCkpO1xuICB9XG5cbiAgZ2V0VHNQcm9ncmFtKCk6IHRzLlByb2dyYW0geyByZXR1cm4gdGhpcy50c1Byb2dyYW07IH1cblxuICBnZXRUc09wdGlvbkRpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW58XG4gICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljPiB7XG4gICAgcmV0dXJuIHRoaXMudHNQcm9ncmFtLmdldE9wdGlvbnNEaWFnbm9zdGljcyhjYW5jZWxsYXRpb25Ub2tlbik7XG4gIH1cblxuICBnZXROZ09wdGlvbkRpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW58XG4gICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogUmVhZG9ubHlBcnJheTxhcGkuRGlhZ25vc3RpYz4ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldFRzU3ludGFjdGljRGlhZ25vc3RpY3MoXG4gICAgICBzb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZXx1bmRlZmluZWQsXG4gICAgICBjYW5jZWxsYXRpb25Ub2tlbj86IHRzLkNhbmNlbGxhdGlvblRva2VufHVuZGVmaW5lZCk6IFJlYWRvbmx5QXJyYXk8dHMuRGlhZ25vc3RpYz4ge1xuICAgIHJldHVybiB0aGlzLnRzUHJvZ3JhbS5nZXRTeW50YWN0aWNEaWFnbm9zdGljcyhzb3VyY2VGaWxlLCBjYW5jZWxsYXRpb25Ub2tlbik7XG4gIH1cblxuICBnZXROZ1N0cnVjdHVyYWxEaWFnbm9zdGljcyhjYW5jZWxsYXRpb25Ub2tlbj86IHRzLkNhbmNlbGxhdGlvblRva2VufFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQpOiBSZWFkb25seUFycmF5PGFwaS5EaWFnbm9zdGljPiB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0VHNTZW1hbnRpY0RpYWdub3N0aWNzKFxuICAgICAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGV8dW5kZWZpbmVkLFxuICAgICAgY2FuY2VsbGF0aW9uVG9rZW4/OiB0cy5DYW5jZWxsYXRpb25Ub2tlbnx1bmRlZmluZWQpOiBSZWFkb25seUFycmF5PHRzLkRpYWdub3N0aWM+IHtcbiAgICByZXR1cm4gdGhpcy50c1Byb2dyYW0uZ2V0U2VtYW50aWNEaWFnbm9zdGljcyhzb3VyY2VGaWxlLCBjYW5jZWxsYXRpb25Ub2tlbik7XG4gIH1cblxuICBnZXROZ1NlbWFudGljRGlhZ25vc3RpY3MoXG4gICAgICBmaWxlTmFtZT86IHN0cmluZ3x1bmRlZmluZWQsXG4gICAgICBjYW5jZWxsYXRpb25Ub2tlbj86IHRzLkNhbmNlbGxhdGlvblRva2VufHVuZGVmaW5lZCk6IFJlYWRvbmx5QXJyYXk8YXBpLkRpYWdub3N0aWM+IHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBsb2FkTmdTdHJ1Y3R1cmVBc3luYygpOiBQcm9taXNlPHZvaWQ+IHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyB9XG5cbiAgbGlzdExhenlSb3V0ZXMoZW50cnlSb3V0ZT86IHN0cmluZ3x1bmRlZmluZWQpOiBhcGkuTGF6eVJvdXRlW10ge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgfVxuXG4gIGdldExpYnJhcnlTdW1tYXJpZXMoKTogTWFwPHN0cmluZywgYXBpLkxpYnJhcnlTdW1tYXJ5PiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG5cbiAgZ2V0RW1pdHRlZEdlbmVyYXRlZEZpbGVzKCk6IE1hcDxzdHJpbmcsIEdlbmVyYXRlZEZpbGU+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICBnZXRFbWl0dGVkU291cmNlRmlsZXMoKTogTWFwPHN0cmluZywgdHMuU291cmNlRmlsZT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgfVxuXG4gIGVtaXQob3B0cz86IHtcbiAgICBlbWl0RmxhZ3M/OiBhcGkuRW1pdEZsYWdzLFxuICAgIGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW4sXG4gICAgY3VzdG9tVHJhbnNmb3JtZXJzPzogYXBpLkN1c3RvbVRyYW5zZm9ybWVycyxcbiAgICBlbWl0Q2FsbGJhY2s/OiBhcGkuVHNFbWl0Q2FsbGJhY2ssXG4gICAgbWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrPzogYXBpLlRzTWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrXG4gIH0pOiB0cy5FbWl0UmVzdWx0IHtcbiAgICBjb25zdCBlbWl0Q2FsbGJhY2sgPSBvcHRzICYmIG9wdHMuZW1pdENhbGxiYWNrIHx8IGRlZmF1bHRFbWl0Q2FsbGJhY2s7XG5cbiAgICBjb25zdCBlbWl0UmVzdWx0ID0gZW1pdENhbGxiYWNrKHtcbiAgICAgIHByb2dyYW06IHRoaXMudHNQcm9ncmFtLFxuICAgICAgaG9zdDogdGhpcy5ob3N0LFxuICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgZW1pdE9ubHlEdHNGaWxlczogZmFsc2UsXG4gICAgICBjdXN0b21UcmFuc2Zvcm1lcnM6IHtiZWZvcmU6IFtpdnlTd2l0Y2hUcmFuc2Zvcm1dfSxcbiAgICB9KTtcbiAgICByZXR1cm4gZW1pdFJlc3VsdDtcbiAgfVxufVxuXG5jb25zdCBkZWZhdWx0RW1pdENhbGxiYWNrOiBhcGkuVHNFbWl0Q2FsbGJhY2sgPVxuICAgICh7cHJvZ3JhbSwgdGFyZ2V0U291cmNlRmlsZSwgd3JpdGVGaWxlLCBjYW5jZWxsYXRpb25Ub2tlbiwgZW1pdE9ubHlEdHNGaWxlcyxcbiAgICAgIGN1c3RvbVRyYW5zZm9ybWVyc30pID0+XG4gICAgICAgIHByb2dyYW0uZW1pdChcbiAgICAgICAgICAgIHRhcmdldFNvdXJjZUZpbGUsIHdyaXRlRmlsZSwgY2FuY2VsbGF0aW9uVG9rZW4sIGVtaXRPbmx5RHRzRmlsZXMsIGN1c3RvbVRyYW5zZm9ybWVycyk7XG4iXX0=
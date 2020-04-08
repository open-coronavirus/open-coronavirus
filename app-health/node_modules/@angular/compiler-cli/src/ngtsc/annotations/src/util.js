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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/util", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/reflection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var ConstructorDepErrorKind;
    (function (ConstructorDepErrorKind) {
        ConstructorDepErrorKind[ConstructorDepErrorKind["NO_SUITABLE_TOKEN"] = 0] = "NO_SUITABLE_TOKEN";
    })(ConstructorDepErrorKind = exports.ConstructorDepErrorKind || (exports.ConstructorDepErrorKind = {}));
    function getConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore) {
        var deps = [];
        var errors = [];
        var ctorParams = reflector.getConstructorParameters(clazz);
        if (ctorParams === null) {
            if (reflector.hasBaseClass(clazz)) {
                return null;
            }
            else {
                ctorParams = [];
            }
        }
        ctorParams.forEach(function (param, idx) {
            var token = valueReferenceToExpression(param.typeValueReference, defaultImportRecorder);
            var optional = false, self = false, skipSelf = false, host = false;
            var resolved = compiler_1.R3ResolvedDependencyType.Token;
            (param.decorators || []).filter(function (dec) { return isCore || isAngularCore(dec); }).forEach(function (dec) {
                var name = isCore || dec.import === null ? dec.name : dec.import.name;
                if (name === 'Inject') {
                    if (dec.args === null || dec.args.length !== 1) {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, dec.node, "Unexpected number of arguments to @Inject().");
                    }
                    token = new compiler_1.WrappedNodeExpr(dec.args[0]);
                }
                else if (name === 'Optional') {
                    optional = true;
                }
                else if (name === 'SkipSelf') {
                    skipSelf = true;
                }
                else if (name === 'Self') {
                    self = true;
                }
                else if (name === 'Host') {
                    host = true;
                }
                else if (name === 'Attribute') {
                    if (dec.args === null || dec.args.length !== 1) {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, dec.node, "Unexpected number of arguments to @Attribute().");
                    }
                    token = new compiler_1.WrappedNodeExpr(dec.args[0]);
                    resolved = compiler_1.R3ResolvedDependencyType.Attribute;
                }
                else {
                    throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_UNEXPECTED, dec.node, "Unexpected decorator " + name + " on parameter.");
                }
            });
            if (token instanceof compiler_1.ExternalExpr && token.value.name === 'ChangeDetectorRef' &&
                token.value.moduleName === '@angular/core') {
                resolved = compiler_1.R3ResolvedDependencyType.ChangeDetectorRef;
            }
            if (token === null) {
                errors.push({
                    index: idx,
                    kind: ConstructorDepErrorKind.NO_SUITABLE_TOKEN, param: param,
                });
            }
            else {
                deps.push({ token: token, optional: optional, self: self, skipSelf: skipSelf, host: host, resolved: resolved });
            }
        });
        if (errors.length === 0) {
            return { deps: deps };
        }
        else {
            return { deps: null, errors: errors };
        }
    }
    exports.getConstructorDependencies = getConstructorDependencies;
    function valueReferenceToExpression(valueRef, defaultImportRecorder) {
        if (valueRef === null) {
            return null;
        }
        else if (valueRef.local) {
            if (defaultImportRecorder !== null && valueRef.defaultImportStatement !== null &&
                ts.isIdentifier(valueRef.expression)) {
                defaultImportRecorder.recordImportedIdentifier(valueRef.expression, valueRef.defaultImportStatement);
            }
            return new compiler_1.WrappedNodeExpr(valueRef.expression);
        }
        else {
            // TODO(alxhub): this cast is necessary because the g3 typescript version doesn't narrow here.
            return new compiler_1.ExternalExpr(valueRef);
        }
    }
    exports.valueReferenceToExpression = valueReferenceToExpression;
    function getValidConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore) {
        return validateConstructorDependencies(clazz, getConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore));
    }
    exports.getValidConstructorDependencies = getValidConstructorDependencies;
    function validateConstructorDependencies(clazz, deps) {
        if (deps === null) {
            return null;
        }
        else if (deps.deps !== null) {
            return deps.deps;
        }
        else {
            // TODO(alxhub): this cast is necessary because the g3 typescript version doesn't narrow here.
            var _a = deps.errors[0], param = _a.param, index = _a.index;
            // There is at least one error.
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.PARAM_MISSING_TOKEN, param.nameNode, "No suitable injection token for parameter '" + (param.name || index) + "' of class '" + clazz.name.text + "'.\n" +
                (param.typeNode !== null ? "Found " + param.typeNode.getText() :
                    'no type or decorator'));
        }
    }
    exports.validateConstructorDependencies = validateConstructorDependencies;
    function toR3Reference(valueRef, typeRef, valueContext, typeContext, refEmitter) {
        var value = refEmitter.emit(valueRef, valueContext, imports_1.ImportMode.UseExistingImport);
        var type = refEmitter.emit(typeRef, typeContext, imports_1.ImportMode.ForceNewImport);
        if (value === null || type === null) {
            throw new Error("Could not refer to " + ts.SyntaxKind[valueRef.node.kind]);
        }
        return { value: value, type: type };
    }
    exports.toR3Reference = toR3Reference;
    function isAngularCore(decorator) {
        return decorator.import !== null && decorator.import.from === '@angular/core';
    }
    exports.isAngularCore = isAngularCore;
    function isAngularCoreReference(reference, symbolName) {
        return reference.ownedByModuleGuess === '@angular/core' && reference.debugName === symbolName;
    }
    exports.isAngularCoreReference = isAngularCoreReference;
    function findAngularDecorator(decorators, name, isCore) {
        return decorators.find(function (decorator) { return isAngularDecorator(decorator, name, isCore); });
    }
    exports.findAngularDecorator = findAngularDecorator;
    function isAngularDecorator(decorator, name, isCore) {
        if (isCore) {
            return decorator.name === name;
        }
        else if (isAngularCore(decorator)) {
            return decorator.import.name === name;
        }
        return false;
    }
    exports.isAngularDecorator = isAngularDecorator;
    /**
     * Unwrap a `ts.Expression`, removing outer type-casts or parentheses until the expression is in its
     * lowest level form.
     *
     * For example, the expression "(foo as Type)" unwraps to "foo".
     */
    function unwrapExpression(node) {
        while (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) {
            node = node.expression;
        }
        return node;
    }
    exports.unwrapExpression = unwrapExpression;
    function expandForwardRef(arg) {
        arg = unwrapExpression(arg);
        if (!ts.isArrowFunction(arg) && !ts.isFunctionExpression(arg)) {
            return null;
        }
        var body = arg.body;
        // Either the body is a ts.Expression directly, or a block with a single return statement.
        if (ts.isBlock(body)) {
            // Block body - look for a single return statement.
            if (body.statements.length !== 1) {
                return null;
            }
            var stmt = body.statements[0];
            if (!ts.isReturnStatement(stmt) || stmt.expression === undefined) {
                return null;
            }
            return stmt.expression;
        }
        else {
            // Shorthand body - return as an expression.
            return body;
        }
    }
    /**
     * Possibly resolve a forwardRef() expression into the inner value.
     *
     * @param node the forwardRef() expression to resolve
     * @param reflector a ReflectionHost
     * @returns the resolved expression, if the original expression was a forwardRef(), or the original
     * expression otherwise
     */
    function unwrapForwardRef(node, reflector) {
        node = unwrapExpression(node);
        if (!ts.isCallExpression(node) || node.arguments.length !== 1) {
            return node;
        }
        var fn = ts.isPropertyAccessExpression(node.expression) ? node.expression.name : node.expression;
        if (!ts.isIdentifier(fn)) {
            return node;
        }
        var expr = expandForwardRef(node.arguments[0]);
        if (expr === null) {
            return node;
        }
        var imp = reflector.getImportOfIdentifier(fn);
        if (imp === null || imp.from !== '@angular/core' || imp.name !== 'forwardRef') {
            return node;
        }
        else {
            return expr;
        }
    }
    exports.unwrapForwardRef = unwrapForwardRef;
    /**
     * A foreign function resolver for `staticallyResolve` which unwraps forwardRef() expressions.
     *
     * @param ref a Reference to the declaration of the function being called (which might be
     * forwardRef)
     * @param args the arguments to the invocation of the forwardRef expression
     * @returns an unwrapped argument if `ref` pointed to forwardRef, or null otherwise
     */
    function forwardRefResolver(ref, args) {
        if (!isAngularCoreReference(ref, 'forwardRef') || args.length !== 1) {
            return null;
        }
        return expandForwardRef(args[0]);
    }
    exports.forwardRefResolver = forwardRefResolver;
    /**
     * Combines an array of resolver functions into a one.
     * @param resolvers Resolvers to be combined.
     */
    function combineResolvers(resolvers) {
        return function (ref, args) {
            var e_1, _a;
            try {
                for (var resolvers_1 = tslib_1.__values(resolvers), resolvers_1_1 = resolvers_1.next(); !resolvers_1_1.done; resolvers_1_1 = resolvers_1.next()) {
                    var resolver = resolvers_1_1.value;
                    var resolved = resolver(ref, args);
                    if (resolved !== null) {
                        return resolved;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (resolvers_1_1 && !resolvers_1_1.done && (_a = resolvers_1.return)) _a.call(resolvers_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
    }
    exports.combineResolvers = combineResolvers;
    function isExpressionForwardReference(expr, context, contextSource) {
        if (isWrappedTsNodeExpr(expr)) {
            var node = ts.getOriginalNode(expr.node);
            return node.getSourceFile() === contextSource && context.pos < node.pos;
        }
        else {
            return false;
        }
    }
    exports.isExpressionForwardReference = isExpressionForwardReference;
    function isWrappedTsNodeExpr(expr) {
        return expr instanceof compiler_1.WrappedNodeExpr;
    }
    exports.isWrappedTsNodeExpr = isWrappedTsNodeExpr;
    function readBaseClass(node, reflector, evaluator) {
        if (!reflection_1.isNamedClassDeclaration(node)) {
            // If the node isn't a ts.ClassDeclaration, consider any base class to be dynamic for now.
            return reflector.hasBaseClass(node) ? 'dynamic' : null;
        }
        var baseExpression = reflector.getBaseClassExpression(node);
        if (baseExpression !== null) {
            var baseClass = evaluator.evaluate(baseExpression);
            if (baseClass instanceof imports_1.Reference && reflection_1.isNamedClassDeclaration(baseClass.node)) {
                return baseClass;
            }
            else {
                return 'dynamic';
            }
        }
        return null;
    }
    exports.readBaseClass = readBaseClass;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQXlJO0lBQ3pJLCtCQUFpQztJQUVqQywyRUFBa0U7SUFDbEUsbUVBQTZGO0lBRTdGLHlFQUFpSjtJQUVqSixJQUFZLHVCQUVYO0lBRkQsV0FBWSx1QkFBdUI7UUFDakMsK0ZBQWlCLENBQUE7SUFDbkIsQ0FBQyxFQUZXLHVCQUF1QixHQUF2QiwrQkFBdUIsS0FBdkIsK0JBQXVCLFFBRWxDO0lBZ0JELFNBQWdCLDBCQUEwQixDQUN0QyxLQUF1QixFQUFFLFNBQXlCLEVBQ2xELHFCQUE0QyxFQUFFLE1BQWU7UUFDL0QsSUFBTSxJQUFJLEdBQTJCLEVBQUUsQ0FBQztRQUN4QyxJQUFNLE1BQU0sR0FBMEIsRUFBRSxDQUFDO1FBQ3pDLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRCxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDdkIsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQzthQUNiO2lCQUFNO2dCQUNMLFVBQVUsR0FBRyxFQUFFLENBQUM7YUFDakI7U0FDRjtRQUNELFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsR0FBRztZQUM1QixJQUFJLEtBQUssR0FBRywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUN4RixJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxLQUFL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SSxDQUFDLENBQUM7UUFDOUQsSUFBSSxjQUFjLEtBQUssSUFBSSxFQUFFO1lBQzNCLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDckQsSUFBSSxTQUFTLFlBQVksbUJBQVMsSUFBSSxvQ0FBdUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdFLE9BQU8sU0FBd0MsQ0FBQzthQUNqRDtpQkFBTTtnQkFDTCxPQUFPLFNBQVMsQ0FBQzthQUNsQjtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBbkJELHNDQW1CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFeHByZXNzaW9uLCBFeHRlcm5hbEV4cHIsIFIzRGVwZW5kZW5jeU1ldGFkYXRhLCBSM1JlZmVyZW5jZSwgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLCBXcmFwcGVkTm9kZUV4cHJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Vycm9yQ29kZSwgRmF0YWxEaWFnbm9zdGljRXJyb3J9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RGVmYXVsdEltcG9ydFJlY29yZGVyLCBJbXBvcnRNb2RlLCBSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXR0ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtGb3JlaWduRnVuY3Rpb25SZXNvbHZlciwgUGFydGlhbEV2YWx1YXRvcn0gZnJvbSAnLi4vLi4vcGFydGlhbF9ldmFsdWF0b3InO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBDdG9yUGFyYW1ldGVyLCBEZWNvcmF0b3IsIEltcG9ydCwgUmVmbGVjdGlvbkhvc3QsIFR5cGVWYWx1ZVJlZmVyZW5jZSwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5leHBvcnQgZW51bSBDb25zdHJ1Y3RvckRlcEVycm9yS2luZCB7XG4gIE5PX1NVSVRBQkxFX1RPS0VOLFxufVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvckRlcHMgPSB7XG4gIGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW107XG59IHxcbntcbiAgZGVwczogbnVsbDtcbiAgZXJyb3JzOiBDb25zdHJ1Y3RvckRlcEVycm9yW107XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnN0cnVjdG9yRGVwRXJyb3Ige1xuICBpbmRleDogbnVtYmVyO1xuICBwYXJhbTogQ3RvclBhcmFtZXRlcjtcbiAga2luZDogQ29uc3RydWN0b3JEZXBFcnJvcktpbmQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25zdHJ1Y3RvckRlcGVuZGVuY2llcyhcbiAgICBjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbiwgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCxcbiAgICBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlciwgaXNDb3JlOiBib29sZWFuKTogQ29uc3RydWN0b3JEZXBzfG51bGwge1xuICBjb25zdCBkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdID0gW107XG4gIGNvbnN0IGVycm9yczogQ29uc3RydWN0b3JEZXBFcnJvcltdID0gW107XG4gIGxldCBjdG9yUGFyYW1zID0gcmVmbGVjdG9yLmdldENvbnN0cnVjdG9yUGFyYW1ldGVycyhjbGF6eik7XG4gIGlmIChjdG9yUGFyYW1zID09PSBudWxsKSB7XG4gICAgaWYgKHJlZmxlY3Rvci5oYXNCYXNlQ2xhc3MoY2xhenopKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY3RvclBhcmFtcyA9IFtdO1xuICAgIH1cbiAgfVxuICBjdG9yUGFyYW1zLmZvckVhY2goKHBhcmFtLCBpZHgpID0+IHtcbiAgICBsZXQgdG9rZW4gPSB2YWx1ZVJlZmVyZW5jZVRvRXhwcmVzc2lvbihwYXJhbS50eXBlVmFsdWVSZWZlcmVuY2UsIGRlZmF1bHRJbXBvcnRSZWNvcmRlcik7XG4gICAgbGV0IG9wdGlvbmFsID0gZmFsc2UsIHNlbGYgPSBmYWxzZSwgc2tpcFNlbGYgPSBmYWxzZSwgaG9zdCA9IGZhbHNlO1xuICAgIGxldCByZXNvbHZlZCA9IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5Ub2tlbjtcblxuICAgIChwYXJhbS5kZWNvcmF0b3JzIHx8IFtdKS5maWx0ZXIoZGVjID0+IGlzQ29yZSB8fCBpc0FuZ3VsYXJDb3JlKGRlYykpLmZvckVhY2goZGVjID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0NvcmUgfHwgZGVjLmltcG9ydCA9PT0gbnVsbCA/IGRlYy5uYW1lIDogZGVjLmltcG9ydCAhLm5hbWU7XG4gICAgICBpZiAobmFtZSA9PT0gJ0luamVjdCcpIHtcbiAgICAgICAgaWYgKGRlYy5hcmdzID09PSBudWxsIHx8IGRlYy5hcmdzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9BUklUWV9XUk9ORywgZGVjLm5vZGUsXG4gICAgICAgICAgICAgIGBVbmV4cGVjdGVkIG51bWJlciBvZiBhcmd1bWVudHMgdG8gQEluamVjdCgpLmApO1xuICAgICAgICB9XG4gICAgICAgIHRva2VuID0gbmV3IFdyYXBwZWROb2RlRXhwcihkZWMuYXJnc1swXSk7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdPcHRpb25hbCcpIHtcbiAgICAgICAgb3B0aW9uYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnU2tpcFNlbGYnKSB7XG4gICAgICAgIHNraXBTZWxmID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ1NlbGYnKSB7XG4gICAgICAgIHNlbGYgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnSG9zdCcpIHtcbiAgICAgICAgaG9zdCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdBdHRyaWJ1dGUnKSB7XG4gICAgICAgIGlmIChkZWMuYXJncyA9PT0gbnVsbCB8fCBkZWMuYXJncy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQVJJVFlfV1JPTkcsIGRlYy5ub2RlLFxuICAgICAgICAgICAgICBgVW5leHBlY3RlZCBudW1iZXIgb2YgYXJndW1lbnRzIHRvIEBBdHRyaWJ1dGUoKS5gKTtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbiA9IG5ldyBXcmFwcGVkTm9kZUV4cHIoZGVjLmFyZ3NbMF0pO1xuICAgICAgICByZXNvbHZlZCA9IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5BdHRyaWJ1dGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX1VORVhQRUNURUQsIGRlYy5ub2RlLCBgVW5leHBlY3RlZCBkZWNvcmF0b3IgJHtuYW1lfSBvbiBwYXJhbWV0ZXIuYCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodG9rZW4gaW5zdGFuY2VvZiBFeHRlcm5hbEV4cHIgJiYgdG9rZW4udmFsdWUubmFtZSA9PT0gJ0NoYW5nZURldGVjdG9yUmVmJyAmJlxuICAgICAgICB0b2tlbi52YWx1ZS5tb2R1bGVOYW1lID09PSAnQGFuZ3VsYXIvY29yZScpIHtcbiAgICAgIHJlc29sdmVkID0gUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLkNoYW5nZURldGVjdG9yUmVmO1xuICAgIH1cbiAgICBpZiAodG9rZW4gPT09IG51bGwpIHtcbiAgICAgIGVycm9ycy5wdXNoKHtcbiAgICAgICAgaW5kZXg6IGlkeCxcbiAgICAgICAga2luZDogQ29uc3RydWN0b3JEZXBFcnJvcktpbmQuTk9fU1VJVEFCTEVfVE9LRU4sIHBhcmFtLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlcHMucHVzaCh7dG9rZW4sIG9wdGlvbmFsLCBzZWxmLCBza2lwU2VsZiwgaG9zdCwgcmVzb2x2ZWR9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7ZGVwc307XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtkZXBzOiBudWxsLCBlcnJvcnN9O1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhIGBUeXBlVmFsdWVSZWZlcmVuY2VgIHRvIGFuIGBFeHByZXNzaW9uYCB3aGljaCByZWZlcnMgdG8gdGhlIHR5cGUgYXMgYSB2YWx1ZS5cbiAqXG4gKiBMb2NhbCByZWZlcmVuY2VzIGFyZSBjb252ZXJ0ZWQgdG8gYSBgV3JhcHBlZE5vZGVFeHByYCBvZiB0aGUgVHlwZVNjcmlwdCBleHByZXNzaW9uLCBhbmQgbm9uLWxvY2FsXG4gKiByZWZlcmVuY2VzIGFyZSBjb252ZXJ0ZWQgdG8gYW4gYEV4dGVybmFsRXhwcmAuIE5vdGUgdGhhdCB0aGlzIGlzIG9ubHkgdmFsaWQgaW4gdGhlIGNvbnRleHQgb2YgdGhlXG4gKiBmaWxlIGluIHdoaWNoIHRoZSBgVHlwZVZhbHVlUmVmZXJlbmNlYCBvcmlnaW5hdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVSZWZlcmVuY2VUb0V4cHJlc3Npb24oXG4gICAgdmFsdWVSZWY6IFR5cGVWYWx1ZVJlZmVyZW5jZSwgZGVmYXVsdEltcG9ydFJlY29yZGVyOiBEZWZhdWx0SW1wb3J0UmVjb3JkZXIpOiBFeHByZXNzaW9uO1xuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlUmVmZXJlbmNlVG9FeHByZXNzaW9uKFxuICAgIHZhbHVlUmVmOiBudWxsLCBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlcik6IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gdmFsdWVSZWZlcmVuY2VUb0V4cHJlc3Npb24oXG4gICAgdmFsdWVSZWY6IFR5cGVWYWx1ZVJlZmVyZW5jZSB8IG51bGwsIGRlZmF1bHRJbXBvcnRSZWNvcmRlcjogRGVmYXVsdEltcG9ydFJlY29yZGVyKTogRXhwcmVzc2lvbnxcbiAgICBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlUmVmZXJlbmNlVG9FeHByZXNzaW9uKFxuICAgIHZhbHVlUmVmOiBUeXBlVmFsdWVSZWZlcmVuY2UgfCBudWxsLCBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlcik6IEV4cHJlc3Npb258XG4gICAgbnVsbCB7XG4gIGlmICh2YWx1ZVJlZiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKHZhbHVlUmVmLmxvY2FsKSB7XG4gICAgaWYgKGRlZmF1bHRJbXBvcnRSZWNvcmRlciAhPT0gbnVsbCAmJiB2YWx1ZVJlZi5kZWZhdWx0SW1wb3J0U3RhdGVtZW50ICE9PSBudWxsICYmXG4gICAgICAgIHRzLmlzSWRlbnRpZmllcih2YWx1ZVJlZi5leHByZXNzaW9uKSkge1xuICAgICAgZGVmYXVsdEltcG9ydFJlY29yZGVyLnJlY29yZEltcG9ydGVkSWRlbnRpZmllcihcbiAgICAgICAgICB2YWx1ZVJlZi5leHByZXNzaW9uLCB2YWx1ZVJlZi5kZWZhdWx0SW1wb3J0U3RhdGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkTm9kZUV4cHIodmFsdWVSZWYuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gVE9ETyhhbHhodWIpOiB0aGlzIGNhc3QgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGczIHR5cGVzY3JpcHQgdmVyc2lvbiBkb2Vzbid0IG5hcnJvdyBoZXJlLlxuICAgIHJldHVybiBuZXcgRXh0ZXJuYWxFeHByKHZhbHVlUmVmIGFze21vZHVsZU5hbWU6IHN0cmluZywgbmFtZTogc3RyaW5nfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbGlkQ29uc3RydWN0b3JEZXBlbmRlbmNpZXMoXG4gICAgY2xheno6IENsYXNzRGVjbGFyYXRpb24sIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QsXG4gICAgZGVmYXVsdEltcG9ydFJlY29yZGVyOiBEZWZhdWx0SW1wb3J0UmVjb3JkZXIsIGlzQ29yZTogYm9vbGVhbik6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW118bnVsbCB7XG4gIHJldHVybiB2YWxpZGF0ZUNvbnN0cnVjdG9yRGVwZW5kZW5jaWVzKFxuICAgICAgY2xhenosIGdldENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzKGNsYXp6LCByZWZsZWN0b3IsIGRlZmF1bHRJbXBvcnRSZWNvcmRlciwgaXNDb3JlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUNvbnN0cnVjdG9yRGVwZW5kZW5jaWVzKFxuICAgIGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uLCBkZXBzOiBDb25zdHJ1Y3RvckRlcHMgfCBudWxsKTogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXXxudWxsIHtcbiAgaWYgKGRlcHMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmIChkZXBzLmRlcHMgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZGVwcy5kZXBzO1xuICB9IGVsc2Uge1xuICAgIC8vIFRPRE8oYWx4aHViKTogdGhpcyBjYXN0IGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBnMyB0eXBlc2NyaXB0IHZlcnNpb24gZG9lc24ndCBuYXJyb3cgaGVyZS5cbiAgICBjb25zdCB7cGFyYW0sIGluZGV4fSA9IChkZXBzIGFze2Vycm9yczogQ29uc3RydWN0b3JEZXBFcnJvcltdfSkuZXJyb3JzWzBdO1xuICAgIC8vIFRoZXJlIGlzIGF0IGxlYXN0IG9uZSBlcnJvci5cbiAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgIEVycm9yQ29kZS5QQVJBTV9NSVNTSU5HX1RPS0VOLCBwYXJhbS5uYW1lTm9kZSxcbiAgICAgICAgYE5vIHN1aXRhYmxlIGluamVjdGlvbiB0b2tlbiBmb3IgcGFyYW1ldGVyICcke3BhcmFtLm5hbWUgfHwgaW5kZXh9JyBvZiBjbGFzcyAnJHtjbGF6ei5uYW1lLnRleHR9Jy5cXG5gICtcbiAgICAgICAgICAgIChwYXJhbS50eXBlTm9kZSAhPT0gbnVsbCA/IGBGb3VuZCAke3BhcmFtLnR5cGVOb2RlLmdldFRleHQoKX1gIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdubyB0eXBlIG9yIGRlY29yYXRvcicpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SM1JlZmVyZW5jZShcbiAgICB2YWx1ZVJlZjogUmVmZXJlbmNlLCB0eXBlUmVmOiBSZWZlcmVuY2UsIHZhbHVlQ29udGV4dDogdHMuU291cmNlRmlsZSxcbiAgICB0eXBlQ29udGV4dDogdHMuU291cmNlRmlsZSwgcmVmRW1pdHRlcjogUmVmZXJlbmNlRW1pdHRlcik6IFIzUmVmZXJlbmNlIHtcbiAgY29uc3QgdmFsdWUgPSByZWZFbWl0dGVyLmVtaXQodmFsdWVSZWYsIHZhbHVlQ29udGV4dCwgSW1wb3J0TW9kZS5Vc2VFeGlzdGluZ0ltcG9ydCk7XG4gIGNvbnN0IHR5cGUgPSByZWZFbWl0dGVyLmVtaXQodHlwZVJlZiwgdHlwZUNvbnRleHQsIEltcG9ydE1vZGUuRm9yY2VOZXdJbXBvcnQpO1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZSA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHJlZmVyIHRvICR7dHMuU3ludGF4S2luZFt2YWx1ZVJlZi5ub2RlLmtpbmRdfWApO1xuICB9XG4gIHJldHVybiB7dmFsdWUsIHR5cGV9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbmd1bGFyQ29yZShkZWNvcmF0b3I6IERlY29yYXRvcik6IGRlY29yYXRvciBpcyBEZWNvcmF0b3Ime2ltcG9ydDogSW1wb3J0fSB7XG4gIHJldHVybiBkZWNvcmF0b3IuaW1wb3J0ICE9PSBudWxsICYmIGRlY29yYXRvci5pbXBvcnQuZnJvbSA9PT0gJ0Bhbmd1bGFyL2NvcmUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbmd1bGFyQ29yZVJlZmVyZW5jZShyZWZlcmVuY2U6IFJlZmVyZW5jZSwgc3ltYm9sTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiByZWZlcmVuY2Uub3duZWRCeU1vZHVsZUd1ZXNzID09PSAnQGFuZ3VsYXIvY29yZScgJiYgcmVmZXJlbmNlLmRlYnVnTmFtZSA9PT0gc3ltYm9sTmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbmd1bGFyRGVjb3JhdG9yKFxuICAgIGRlY29yYXRvcnM6IERlY29yYXRvcltdLCBuYW1lOiBzdHJpbmcsIGlzQ29yZTogYm9vbGVhbik6IERlY29yYXRvcnx1bmRlZmluZWQge1xuICByZXR1cm4gZGVjb3JhdG9ycy5maW5kKGRlY29yYXRvciA9PiBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCBuYW1lLCBpc0NvcmUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3I6IERlY29yYXRvciwgbmFtZTogc3RyaW5nLCBpc0NvcmU6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgaWYgKGlzQ29yZSkge1xuICAgIHJldHVybiBkZWNvcmF0b3IubmFtZSA9PT0gbmFtZTtcbiAgfSBlbHNlIGlmIChpc0FuZ3VsYXJDb3JlKGRlY29yYXRvcikpIHtcbiAgICByZXR1cm4gZGVjb3JhdG9yLmltcG9ydC5uYW1lID09PSBuYW1lO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBVbndyYXAgYSBgdHMuRXhwcmVzc2lvbmAsIHJlbW92aW5nIG91dGVyIHR5cGUtY2FzdHMgb3IgcGFyZW50aGVzZXMgdW50aWwgdGhlIGV4cHJlc3Npb24gaXMgaW4gaXRzXG4gKiBsb3dlc3QgbGV2ZWwgZm9ybS5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGhlIGV4cHJlc3Npb24gXCIoZm9vIGFzIFR5cGUpXCIgdW53cmFwcyB0byBcImZvb1wiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwRXhwcmVzc2lvbihub2RlOiB0cy5FeHByZXNzaW9uKTogdHMuRXhwcmVzc2lvbiB7XG4gIHdoaWxlICh0cy5pc0FzRXhwcmVzc2lvbihub2RlKSB8fCB0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgbm9kZSA9IG5vZGUuZXhwcmVzc2lvbjtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gZXhwYW5kRm9yd2FyZFJlZihhcmc6IHRzLkV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9ufG51bGwge1xuICBhcmcgPSB1bndyYXBFeHByZXNzaW9uKGFyZyk7XG4gIGlmICghdHMuaXNBcnJvd0Z1bmN0aW9uKGFyZykgJiYgIXRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKGFyZykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBhcmcuYm9keTtcbiAgLy8gRWl0aGVyIHRoZSBib2R5IGlzIGEgdHMuRXhwcmVzc2lvbiBkaXJlY3RseSwgb3IgYSBibG9jayB3aXRoIGEgc2luZ2xlIHJldHVybiBzdGF0ZW1lbnQuXG4gIGlmICh0cy5pc0Jsb2NrKGJvZHkpKSB7XG4gICAgLy8gQmxvY2sgYm9keSAtIGxvb2sgZm9yIGEgc2luZ2xlIHJldHVybiBzdGF0ZW1lbnQuXG4gICAgaWYgKGJvZHkuc3RhdGVtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzdG10ID0gYm9keS5zdGF0ZW1lbnRzWzBdO1xuICAgIGlmICghdHMuaXNSZXR1cm5TdGF0ZW1lbnQoc3RtdCkgfHwgc3RtdC5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gc3RtdC5leHByZXNzaW9uO1xuICB9IGVsc2Uge1xuICAgIC8vIFNob3J0aGFuZCBib2R5IC0gcmV0dXJuIGFzIGFuIGV4cHJlc3Npb24uXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cbn1cblxuLyoqXG4gKiBQb3NzaWJseSByZXNvbHZlIGEgZm9yd2FyZFJlZigpIGV4cHJlc3Npb24gaW50byB0aGUgaW5uZXIgdmFsdWUuXG4gKlxuICogQHBhcmFtIG5vZGUgdGhlIGZvcndhcmRSZWYoKSBleHByZXNzaW9uIHRvIHJlc29sdmVcbiAqIEBwYXJhbSByZWZsZWN0b3IgYSBSZWZsZWN0aW9uSG9zdFxuICogQHJldHVybnMgdGhlIHJlc29sdmVkIGV4cHJlc3Npb24sIGlmIHRoZSBvcmlnaW5hbCBleHByZXNzaW9uIHdhcyBhIGZvcndhcmRSZWYoKSwgb3IgdGhlIG9yaWdpbmFsXG4gKiBleHByZXNzaW9uIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwRm9yd2FyZFJlZihub2RlOiB0cy5FeHByZXNzaW9uLCByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0KTogdHMuRXhwcmVzc2lvbiB7XG4gIG5vZGUgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUpO1xuICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkgfHwgbm9kZS5hcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBjb25zdCBmbiA9XG4gICAgICB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pID8gbm9kZS5leHByZXNzaW9uLm5hbWUgOiBub2RlLmV4cHJlc3Npb247XG4gIGlmICghdHMuaXNJZGVudGlmaWVyKGZuKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgY29uc3QgZXhwciA9IGV4cGFuZEZvcndhcmRSZWYobm9kZS5hcmd1bWVudHNbMF0pO1xuICBpZiAoZXhwciA9PT0gbnVsbCkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG4gIGNvbnN0IGltcCA9IHJlZmxlY3Rvci5nZXRJbXBvcnRPZklkZW50aWZpZXIoZm4pO1xuICBpZiAoaW1wID09PSBudWxsIHx8IGltcC5mcm9tICE9PSAnQGFuZ3VsYXIvY29yZScgfHwgaW1wLm5hbWUgIT09ICdmb3J3YXJkUmVmJykge1xuICAgIHJldHVybiBub2RlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBleHByO1xuICB9XG59XG5cbi8qKlxuICogQSBmb3JlaWduIGZ1bmN0aW9uIHJlc29sdmVyIGZvciBgc3RhdGljYWxseVJlc29sdmVgIHdoaWNoIHVud3JhcHMgZm9yd2FyZFJlZigpIGV4cHJlc3Npb25zLlxuICpcbiAqIEBwYXJhbSByZWYgYSBSZWZlcmVuY2UgdG8gdGhlIGRlY2xhcmF0aW9uIG9mIHRoZSBmdW5jdGlvbiBiZWluZyBjYWxsZWQgKHdoaWNoIG1pZ2h0IGJlXG4gKiBmb3J3YXJkUmVmKVxuICogQHBhcmFtIGFyZ3MgdGhlIGFyZ3VtZW50cyB0byB0aGUgaW52b2NhdGlvbiBvZiB0aGUgZm9yd2FyZFJlZiBleHByZXNzaW9uXG4gKiBAcmV0dXJucyBhbiB1bndyYXBwZWQgYXJndW1lbnQgaWYgYHJlZmAgcG9pbnRlZCB0byBmb3J3YXJkUmVmLCBvciBudWxsIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZFJlZlJlc29sdmVyKFxuICAgIHJlZjogUmVmZXJlbmNlPHRzLkZ1bmN0aW9uRGVjbGFyYXRpb258dHMuTWV0aG9kRGVjbGFyYXRpb258dHMuRnVuY3Rpb25FeHByZXNzaW9uPixcbiAgICBhcmdzOiBSZWFkb25seUFycmF5PHRzLkV4cHJlc3Npb24+KTogdHMuRXhwcmVzc2lvbnxudWxsIHtcbiAgaWYgKCFpc0FuZ3VsYXJDb3JlUmVmZXJlbmNlKHJlZiwgJ2ZvcndhcmRSZWYnKSB8fCBhcmdzLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBleHBhbmRGb3J3YXJkUmVmKGFyZ3NbMF0pO1xufVxuXG4vKipcbiAqIENvbWJpbmVzIGFuIGFycmF5IG9mIHJlc29sdmVyIGZ1bmN0aW9ucyBpbnRvIGEgb25lLlxuICogQHBhcmFtIHJlc29sdmVycyBSZXNvbHZlcnMgdG8gYmUgY29tYmluZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lUmVzb2x2ZXJzKHJlc29sdmVyczogRm9yZWlnbkZ1bmN0aW9uUmVzb2x2ZXJbXSk6IEZvcmVpZ25GdW5jdGlvblJlc29sdmVyIHtcbiAgcmV0dXJuIChyZWY6IFJlZmVyZW5jZTx0cy5GdW5jdGlvbkRlY2xhcmF0aW9ufHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4sXG4gICAgICAgICAgYXJnczogUmVhZG9ubHlBcnJheTx0cy5FeHByZXNzaW9uPik6IHRzLkV4cHJlc3Npb24gfFxuICAgICAgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCByZXNvbHZlciBvZiByZXNvbHZlcnMpIHtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZXIocmVmLCBhcmdzKTtcbiAgICAgIGlmIChyZXNvbHZlZCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFeHByZXNzaW9uRm9yd2FyZFJlZmVyZW5jZShcbiAgICBleHByOiBFeHByZXNzaW9uLCBjb250ZXh0OiB0cy5Ob2RlLCBjb250ZXh0U291cmNlOiB0cy5Tb3VyY2VGaWxlKTogYm9vbGVhbiB7XG4gIGlmIChpc1dyYXBwZWRUc05vZGVFeHByKGV4cHIpKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmdldE9yaWdpbmFsTm9kZShleHByLm5vZGUpO1xuICAgIHJldHVybiBub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gY29udGV4dFNvdXJjZSAmJiBjb250ZXh0LnBvcyA8IG5vZGUucG9zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNXcmFwcGVkVHNOb2RlRXhwcihleHByOiBFeHByZXNzaW9uKTogZXhwciBpcyBXcmFwcGVkTm9kZUV4cHI8dHMuTm9kZT4ge1xuICByZXR1cm4gZXhwciBpbnN0YW5jZW9mIFdyYXBwZWROb2RlRXhwcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRCYXNlQ2xhc3MoXG4gICAgbm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCxcbiAgICBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IpOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj58J2R5bmFtaWMnfG51bGwge1xuICBpZiAoIWlzTmFtZWRDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgLy8gSWYgdGhlIG5vZGUgaXNuJ3QgYSB0cy5DbGFzc0RlY2xhcmF0aW9uLCBjb25zaWRlciBhbnkgYmFzZSBjbGFzcyB0byBiZSBkeW5hbWljIGZvciBub3cuXG4gICAgcmV0dXJuIHJlZmxlY3Rvci5oYXNCYXNlQ2xhc3Mobm9kZSkgPyAnZHluYW1pYycgOiBudWxsO1xuICB9XG5cbiAgY29uc3QgYmFzZUV4cHJlc3Npb24gPSByZWZsZWN0b3IuZ2V0QmFzZUNsYXNzRXhwcmVzc2lvbihub2RlKTtcbiAgaWYgKGJhc2VFeHByZXNzaW9uICE9PSBudWxsKSB7XG4gICAgY29uc3QgYmFzZUNsYXNzID0gZXZhbHVhdG9yLmV2YWx1YXRlKGJhc2VFeHByZXNzaW9uKTtcbiAgICBpZiAoYmFzZUNsYXNzIGluc3RhbmNlb2YgUmVmZXJlbmNlICYmIGlzTmFtZWRDbGFzc0RlY2xhcmF0aW9uKGJhc2VDbGFzcy5ub2RlKSkge1xuICAgICAgcmV0dXJuIGJhc2VDbGFzcyBhcyBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnZHluYW1pYyc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=
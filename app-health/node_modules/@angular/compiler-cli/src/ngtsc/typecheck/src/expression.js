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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/expression", ["require", "exports", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics");
    var NULL_AS_ANY = ts.createAsExpression(ts.createNull(), ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    var UNDEFINED = ts.createIdentifier('undefined');
    var BINARY_OPS = new Map([
        ['+', ts.SyntaxKind.PlusToken],
        ['-', ts.SyntaxKind.MinusToken],
        ['<', ts.SyntaxKind.LessThanToken],
        ['>', ts.SyntaxKind.GreaterThanToken],
        ['<=', ts.SyntaxKind.LessThanEqualsToken],
        ['>=', ts.SyntaxKind.GreaterThanEqualsToken],
        ['==', ts.SyntaxKind.EqualsEqualsToken],
        ['===', ts.SyntaxKind.EqualsEqualsEqualsToken],
        ['*', ts.SyntaxKind.AsteriskToken],
        ['/', ts.SyntaxKind.SlashToken],
        ['%', ts.SyntaxKind.PercentToken],
        ['!=', ts.SyntaxKind.ExclamationEqualsToken],
        ['!==', ts.SyntaxKind.ExclamationEqualsEqualsToken],
        ['||', ts.SyntaxKind.BarBarToken],
        ['&&', ts.SyntaxKind.AmpersandAmpersandToken],
        ['&', ts.SyntaxKind.AmpersandToken],
        ['|', ts.SyntaxKind.BarToken],
    ]);
    /**
     * Convert an `AST` to TypeScript code directly, without going through an intermediate `Expression`
     * AST.
     */
    function astToTypescript(ast, maybeResolve, config, translateSpan) {
        var translator = new AstTranslator(maybeResolve, config, translateSpan);
        return translator.translate(ast);
    }
    exports.astToTypescript = astToTypescript;
    var AstTranslator = /** @class */ (function () {
        function AstTranslator(maybeResolve, config, translateSpan) {
            this.maybeResolve = maybeResolve;
            this.config = config;
            this.translateSpan = translateSpan;
        }
        AstTranslator.prototype.translate = function (ast) {
            // Skip over an `ASTWithSource` as its `visit` method calls directly into its ast's `visit`,
            // which would prevent any custom resolution through `maybeResolve` for that node.
            if (ast instanceof compiler_1.ASTWithSource) {
                ast = ast.ast;
            }
            // First attempt to let any custom resolution logic provide a translation for the given node.
            var resolved = this.maybeResolve(ast);
            if (resolved !== null) {
                return resolved;
            }
            return ast.visit(this);
        };
        AstTranslator.prototype.visitBinary = function (ast) {
            var lhs = diagnostics_1.wrapForDiagnostics(this.translate(ast.left));
            var rhs = diagnostics_1.wrapForDiagnostics(this.translate(ast.right));
            var op = BINARY_OPS.get(ast.operation);
            if (op === undefined) {
                throw new Error("Unsupported Binary.operation: " + ast.operation);
            }
            var node = ts.createBinary(lhs, op, rhs);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitChain = function (ast) { throw new Error('Method not implemented.'); };
        AstTranslator.prototype.visitConditional = function (ast) {
            var condExpr = this.translate(ast.condition);
            var trueExpr = this.translate(ast.trueExp);
            var falseExpr = this.translate(ast.falseExp);
            var node = ts.createParen(ts.createConditional(condExpr, trueExpr, falseExpr));
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitFunctionCall = function (ast) { throw new Error('Method not implemented.'); };
        AstTranslator.prototype.visitImplicitReceiver = function (ast) {
            throw new Error('Method not implemented.');
        };
        AstTranslator.prototype.visitInterpolation = function (ast) {
            var _this = this;
            // Build up a chain of binary + operations to simulate the string concatenation of the
            // interpolation's expressions. The chain is started using an actual string literal to ensure
            // the type is inferred as 'string'.
            return ast.expressions.reduce(function (lhs, ast) { return ts.createBinary(lhs, ts.SyntaxKind.PlusToken, _this.translate(ast)); }, ts.createLiteral(''));
        };
        AstTranslator.prototype.visitKeyedRead = function (ast) {
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.obj));
            var key = this.translate(ast.key);
            var node = ts.createElementAccess(receiver, key);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitKeyedWrite = function (ast) { throw new Error('Method not implemented.'); };
        AstTranslator.prototype.visitLiteralArray = function (ast) {
            var _this = this;
            var elements = ast.expressions.map(function (expr) { return _this.translate(expr); });
            var node = ts.createArrayLiteral(elements);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitLiteralMap = function (ast) {
            var _this = this;
            var properties = ast.keys.map(function (_a, idx) {
                var key = _a.key;
                var value = _this.translate(ast.values[idx]);
                return ts.createPropertyAssignment(ts.createStringLiteral(key), value);
            });
            var node = ts.createObjectLiteral(properties, true);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitLiteralPrimitive = function (ast) {
            var node;
            if (ast.value === undefined) {
                node = ts.createIdentifier('undefined');
            }
            else if (ast.value === null) {
                node = ts.createNull();
            }
            else {
                node = ts.createLiteral(ast.value);
            }
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitMethodCall = function (ast) {
            var _this = this;
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var method = ts.createPropertyAccess(receiver, ast.name);
            var args = ast.args.map(function (expr) { return _this.translate(expr); });
            var node = ts.createCall(method, undefined, args);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitNonNullAssert = function (ast) {
            var expr = diagnostics_1.wrapForDiagnostics(this.translate(ast.expression));
            var node = ts.createNonNullExpression(expr);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitPipe = function (ast) { throw new Error('Method not implemented.'); };
        AstTranslator.prototype.visitPrefixNot = function (ast) {
            var expression = diagnostics_1.wrapForDiagnostics(this.translate(ast.expression));
            var node = ts.createLogicalNot(expression);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitPropertyRead = function (ast) {
            // This is a normal property read - convert the receiver to an expression and emit the correct
            // TypeScript expression to read the property.
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var node = ts.createPropertyAccess(receiver, ast.name);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitPropertyWrite = function (ast) { throw new Error('Method not implemented.'); };
        AstTranslator.prototype.visitQuote = function (ast) { throw new Error('Method not implemented.'); };
        AstTranslator.prototype.visitSafeMethodCall = function (ast) {
            var _this = this;
            // See the comment in SafePropertyRead above for an explanation of the need for the non-null
            // assertion here.
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var method = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
            var args = ast.args.map(function (expr) { return _this.translate(expr); });
            var expr = ts.createCall(method, undefined, args);
            var whenNull = this.config.strictSafeNavigationTypes ? UNDEFINED : NULL_AS_ANY;
            var node = safeTernary(receiver, expr, whenNull);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        AstTranslator.prototype.visitSafePropertyRead = function (ast) {
            // A safe property expression a?.b takes the form `(a != null ? a!.b : whenNull)`, where
            // whenNull is either of type 'any' or or 'undefined' depending on strictness. The non-null
            // assertion is necessary because in practice 'a' may be a method call expression, which won't
            // have a narrowed type when repeated in the ternary true branch.
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var expr = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
            var whenNull = this.config.strictSafeNavigationTypes ? UNDEFINED : NULL_AS_ANY;
            var node = safeTernary(receiver, expr, whenNull);
            diagnostics_1.addParseSpanInfo(node, this.translateSpan(ast.span));
            return node;
        };
        return AstTranslator;
    }());
    function safeTernary(lhs, whenNotNull, whenNull) {
        var notNullComp = ts.createBinary(lhs, ts.SyntaxKind.ExclamationEqualsToken, ts.createNull());
        var ternary = ts.createConditional(notNullComp, whenNotNull, whenNull);
        return ts.createParen(ternary);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy9leHByZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQW1WO0lBQ25WLCtCQUFpQztJQUdqQyx5RkFBaUY7SUFFakYsSUFBTSxXQUFXLEdBQ2IsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9GLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVuRCxJQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBd0I7UUFDaEQsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDOUIsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDL0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDbEMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNyQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDO1FBQ3pDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUM7UUFDNUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztRQUN2QyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDO1FBQzlDLENBQUMsR0FBRyxF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RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDSCxvQkFBQztJQUFELENBQUMsQUFuS0QsSUFtS0M7SUFFRCxTQUFTLFdBQVcsQ0FDaEIsR0FBa0IsRUFBRSxXQUEwQixFQUFFLFFBQXVCO1FBQ3pFLElBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDaEcsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekUsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QVNULCBBU1RXaXRoU291cmNlLCBBc3RWaXNpdG9yLCBCaW5hcnksIEJpbmRpbmdQaXBlLCBDaGFpbiwgQ29uZGl0aW9uYWwsIEZ1bmN0aW9uQ2FsbCwgSW1wbGljaXRSZWNlaXZlciwgSW50ZXJwb2xhdGlvbiwgS2V5ZWRSZWFkLCBLZXllZFdyaXRlLCBMaXRlcmFsQXJyYXksIExpdGVyYWxNYXAsIExpdGVyYWxQcmltaXRpdmUsIE1ldGhvZENhbGwsIE5vbk51bGxBc3NlcnQsIFBhcnNlU3BhbiwgUHJlZml4Tm90LCBQcm9wZXJ0eVJlYWQsIFByb3BlcnR5V3JpdGUsIFF1b3RlLCBTYWZlTWV0aG9kQ2FsbCwgU2FmZVByb3BlcnR5UmVhZH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7VHlwZUNoZWNraW5nQ29uZmlnfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge0Fic29sdXRlU3BhbiwgYWRkUGFyc2VTcGFuSW5mbywgd3JhcEZvckRpYWdub3N0aWNzfSBmcm9tICcuL2RpYWdub3N0aWNzJztcblxuY29uc3QgTlVMTF9BU19BTlkgPVxuICAgIHRzLmNyZWF0ZUFzRXhwcmVzc2lvbih0cy5jcmVhdGVOdWxsKCksIHRzLmNyZWF0ZUtleXdvcmRUeXBlTm9kZSh0cy5TeW50YXhLaW5kLkFueUtleXdvcmQpKTtcbmNvbnN0IFVOREVGSU5FRCA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoJ3VuZGVmaW5lZCcpO1xuXG5jb25zdCBCSU5BUllfT1BTID0gbmV3IE1hcDxzdHJpbmcsIHRzLlN5bnRheEtpbmQ+KFtcbiAgWycrJywgdHMuU3ludGF4S2luZC5QbHVzVG9rZW5dLFxuICBbJy0nLCB0cy5TeW50YXhLaW5kLk1pbnVzVG9rZW5dLFxuICBbJzwnLCB0cy5TeW50YXhLaW5kLkxlc3NUaGFuVG9rZW5dLFxuICBbJz4nLCB0cy5TeW50YXhLaW5kLkdyZWF0ZXJUaGFuVG9rZW5dLFxuICBbJzw9JywgdHMuU3ludGF4S2luZC5MZXNzVGhhbkVxdWFsc1Rva2VuXSxcbiAgWyc+PScsIHRzLlN5bnRheEtpbmQuR3JlYXRlclRoYW5FcXVhbHNUb2tlbl0sXG4gIFsnPT0nLCB0cy5TeW50YXhLaW5kLkVxdWFsc0VxdWFsc1Rva2VuXSxcbiAgWyc9PT0nLCB0cy5TeW50YXhLaW5kLkVxdWFsc0VxdWFsc0VxdWFsc1Rva2VuXSxcbiAgWycqJywgdHMuU3ludGF4S2luZC5Bc3Rlcmlza1Rva2VuXSxcbiAgWycvJywgdHMuU3ludGF4S2luZC5TbGFzaFRva2VuXSxcbiAgWyclJywgdHMuU3ludGF4S2luZC5QZXJjZW50VG9rZW5dLFxuICBbJyE9JywgdHMuU3ludGF4S2luZC5FeGNsYW1hdGlvbkVxdWFsc1Rva2VuXSxcbiAgWychPT0nLCB0cy5TeW50YXhLaW5kLkV4Y2xhbWF0aW9uRXF1YWxzRXF1YWxzVG9rZW5dLFxuICBbJ3x8JywgdHMuU3ludGF4S2luZC5CYXJCYXJUb2tlbl0sXG4gIFsnJiYnLCB0cy5TeW50YXhLaW5kLkFtcGVyc2FuZEFtcGVyc2FuZFRva2VuXSxcbiAgWycmJywgdHMuU3ludGF4S2luZC5BbXBlcnNhbmRUb2tlbl0sXG4gIFsnfCcsIHRzLlN5bnRheEtpbmQuQmFyVG9rZW5dLFxuXSk7XG5cbi8qKlxuICogQ29udmVydCBhbiBgQVNUYCB0byBUeXBlU2NyaXB0IGNvZGUgZGlyZWN0bHksIHdpdGhvdXQgZ29pbmcgdGhyb3VnaCBhbiBpbnRlcm1lZGlhdGUgYEV4cHJlc3Npb25gXG4gKiBBU1QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3RUb1R5cGVzY3JpcHQoXG4gICAgYXN0OiBBU1QsIG1heWJlUmVzb2x2ZTogKGFzdDogQVNUKSA9PiAodHMuRXhwcmVzc2lvbiB8IG51bGwpLCBjb25maWc6IFR5cGVDaGVja2luZ0NvbmZpZyxcbiAgICB0cmFuc2xhdGVTcGFuOiAoc3BhbjogUGFyc2VTcGFuKSA9PiBBYnNvbHV0ZVNwYW4pOiB0cy5FeHByZXNzaW9uIHtcbiAgY29uc3QgdHJhbnNsYXRvciA9IG5ldyBBc3RUcmFuc2xhdG9yKG1heWJlUmVzb2x2ZSwgY29uZmlnLCB0cmFuc2xhdGVTcGFuKTtcbiAgcmV0dXJuIHRyYW5zbGF0b3IudHJhbnNsYXRlKGFzdCk7XG59XG5cbmNsYXNzIEFzdFRyYW5zbGF0b3IgaW1wbGVtZW50cyBBc3RWaXNpdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIG1heWJlUmVzb2x2ZTogKGFzdDogQVNUKSA9PiAodHMuRXhwcmVzc2lvbiB8IG51bGwpLFxuICAgICAgcHJpdmF0ZSBjb25maWc6IFR5cGVDaGVja2luZ0NvbmZpZyxcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRlU3BhbjogKHNwYW46IFBhcnNlU3BhbikgPT4gQWJzb2x1dGVTcGFuKSB7fVxuXG4gIHRyYW5zbGF0ZShhc3Q6IEFTVCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIC8vIFNraXAgb3ZlciBhbiBgQVNUV2l0aFNvdXJjZWAgYXMgaXRzIGB2aXNpdGAgbWV0aG9kIGNhbGxzIGRpcmVjdGx5IGludG8gaXRzIGFzdCdzIGB2aXNpdGAsXG4gICAgLy8gd2hpY2ggd291bGQgcHJldmVudCBhbnkgY3VzdG9tIHJlc29sdXRpb24gdGhyb3VnaCBgbWF5YmVSZXNvbHZlYCBmb3IgdGhhdCBub2RlLlxuICAgIGlmIChhc3QgaW5zdGFuY2VvZiBBU1RXaXRoU291cmNlKSB7XG4gICAgICBhc3QgPSBhc3QuYXN0O1xuICAgIH1cblxuICAgIC8vIEZpcnN0IGF0dGVtcHQgdG8gbGV0IGFueSBjdXN0b20gcmVzb2x1dGlvbiBsb2dpYyBwcm92aWRlIGEgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIGNvbnN0IHJlc29sdmVkID0gdGhpcy5tYXliZVJlc29sdmUoYXN0KTtcbiAgICBpZiAocmVzb2x2ZWQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXN0LnZpc2l0KHRoaXMpO1xuICB9XG5cbiAgdmlzaXRCaW5hcnkoYXN0OiBCaW5hcnkpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBsaHMgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LmxlZnQpKTtcbiAgICBjb25zdCByaHMgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJpZ2h0KSk7XG4gICAgY29uc3Qgb3AgPSBCSU5BUllfT1BTLmdldChhc3Qub3BlcmF0aW9uKTtcbiAgICBpZiAob3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBCaW5hcnkub3BlcmF0aW9uOiAke2FzdC5vcGVyYXRpb259YCk7XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVCaW5hcnkobGhzLCBvcCBhcyBhbnksIHJocyk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCB0aGlzLnRyYW5zbGF0ZVNwYW4oYXN0LnNwYW4pKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbik6IG5ldmVyIHsgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpOyB9XG5cbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IENvbmRpdGlvbmFsKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgY29uZEV4cHIgPSB0aGlzLnRyYW5zbGF0ZShhc3QuY29uZGl0aW9uKTtcbiAgICBjb25zdCB0cnVlRXhwciA9IHRoaXMudHJhbnNsYXRlKGFzdC50cnVlRXhwKTtcbiAgICBjb25zdCBmYWxzZUV4cHIgPSB0aGlzLnRyYW5zbGF0ZShhc3QuZmFsc2VFeHApO1xuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVQYXJlbih0cy5jcmVhdGVDb25kaXRpb25hbChjb25kRXhwciwgdHJ1ZUV4cHIsIGZhbHNlRXhwcikpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgdGhpcy50cmFuc2xhdGVTcGFuKGFzdC5zcGFuKSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdEZ1bmN0aW9uQ2FsbChhc3Q6IEZ1bmN0aW9uQ2FsbCk6IG5ldmVyIHsgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpOyB9XG5cbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlcik6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICB2aXNpdEludGVycG9sYXRpb24oYXN0OiBJbnRlcnBvbGF0aW9uKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgLy8gQnVpbGQgdXAgYSBjaGFpbiBvZiBiaW5hcnkgKyBvcGVyYXRpb25zIHRvIHNpbXVsYXRlIHRoZSBzdHJpbmcgY29uY2F0ZW5hdGlvbiBvZiB0aGVcbiAgICAvLyBpbnRlcnBvbGF0aW9uJ3MgZXhwcmVzc2lvbnMuIFRoZSBjaGFpbiBpcyBzdGFydGVkIHVzaW5nIGFuIGFjdHVhbCBzdHJpbmcgbGl0ZXJhbCB0byBlbnN1cmVcbiAgICAvLyB0aGUgdHlwZSBpcyBpbmZlcnJlZCBhcyAnc3RyaW5nJy5cbiAgICByZXR1cm4gYXN0LmV4cHJlc3Npb25zLnJlZHVjZShcbiAgICAgICAgKGxocywgYXN0KSA9PiB0cy5jcmVhdGVCaW5hcnkobGhzLCB0cy5TeW50YXhLaW5kLlBsdXNUb2tlbiwgdGhpcy50cmFuc2xhdGUoYXN0KSksXG4gICAgICAgIHRzLmNyZWF0ZUxpdGVyYWwoJycpKTtcbiAgfVxuXG4gIHZpc2l0S2V5ZWRSZWFkKGFzdDogS2V5ZWRSZWFkKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0Lm9iaikpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMudHJhbnNsYXRlKGFzdC5rZXkpO1xuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVFbGVtZW50QWNjZXNzKHJlY2VpdmVyLCBrZXkpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgdGhpcy50cmFuc2xhdGVTcGFuKGFzdC5zcGFuKSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdEtleWVkV3JpdGUoYXN0OiBLZXllZFdyaXRlKTogbmV2ZXIgeyB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7IH1cblxuICB2aXNpdExpdGVyYWxBcnJheShhc3Q6IExpdGVyYWxBcnJheSk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gYXN0LmV4cHJlc3Npb25zLm1hcChleHByID0+IHRoaXMudHJhbnNsYXRlKGV4cHIpKTtcbiAgICBjb25zdCBub2RlID0gdHMuY3JlYXRlQXJyYXlMaXRlcmFsKGVsZW1lbnRzKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIHRoaXMudHJhbnNsYXRlU3Bhbihhc3Quc3BhbikpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsTWFwKGFzdDogTGl0ZXJhbE1hcCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBhc3Qua2V5cy5tYXAoKHtrZXl9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy50cmFuc2xhdGUoYXN0LnZhbHVlc1tpZHhdKTtcbiAgICAgIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQodHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChrZXkpLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwocHJvcGVydGllcywgdHJ1ZSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCB0aGlzLnRyYW5zbGF0ZVNwYW4oYXN0LnNwYW4pKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IExpdGVyYWxQcmltaXRpdmUpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBsZXQgbm9kZTogdHMuRXhwcmVzc2lvbjtcbiAgICBpZiAoYXN0LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5vZGUgPSB0cy5jcmVhdGVJZGVudGlmaWVyKCd1bmRlZmluZWQnKTtcbiAgICB9IGVsc2UgaWYgKGFzdC52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgbm9kZSA9IHRzLmNyZWF0ZU51bGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRzLmNyZWF0ZUxpdGVyYWwoYXN0LnZhbHVlKTtcbiAgICB9XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCB0aGlzLnRyYW5zbGF0ZVNwYW4oYXN0LnNwYW4pKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCByZWNlaXZlciA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QucmVjZWl2ZXIpKTtcbiAgICBjb25zdCBtZXRob2QgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhyZWNlaXZlciwgYXN0Lm5hbWUpO1xuICAgIGNvbnN0IGFyZ3MgPSBhc3QuYXJncy5tYXAoZXhwciA9PiB0aGlzLnRyYW5zbGF0ZShleHByKSk7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZUNhbGwobWV0aG9kLCB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgdGhpcy50cmFuc2xhdGVTcGFuKGFzdC5zcGFuKSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdE5vbk51bGxBc3NlcnQoYXN0OiBOb25OdWxsQXNzZXJ0KTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgZXhwciA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QuZXhwcmVzc2lvbikpO1xuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVOb25OdWxsRXhwcmVzc2lvbihleHByKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIHRoaXMudHJhbnNsYXRlU3Bhbihhc3Quc3BhbikpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRQaXBlKGFzdDogQmluZGluZ1BpcGUpOiBuZXZlciB7IHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTsgfVxuXG4gIHZpc2l0UHJlZml4Tm90KGFzdDogUHJlZml4Tm90KTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgZXhwcmVzc2lvbiA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QuZXhwcmVzc2lvbikpO1xuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVMb2dpY2FsTm90KGV4cHJlc3Npb24pO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgdGhpcy50cmFuc2xhdGVTcGFuKGFzdC5zcGFuKSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IFByb3BlcnR5UmVhZCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIC8vIFRoaXMgaXMgYSBub3JtYWwgcHJvcGVydHkgcmVhZCAtIGNvbnZlcnQgdGhlIHJlY2VpdmVyIHRvIGFuIGV4cHJlc3Npb24gYW5kIGVtaXQgdGhlIGNvcnJlY3RcbiAgICAvLyBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdG8gcmVhZCB0aGUgcHJvcGVydHkuXG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHJlY2VpdmVyLCBhc3QubmFtZSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCB0aGlzLnRyYW5zbGF0ZVNwYW4oYXN0LnNwYW4pKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0UHJvcGVydHlXcml0ZShhc3Q6IFByb3BlcnR5V3JpdGUpOiBuZXZlciB7IHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTsgfVxuXG4gIHZpc2l0UXVvdGUoYXN0OiBRdW90ZSk6IG5ldmVyIHsgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpOyB9XG5cbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgLy8gU2VlIHRoZSBjb21tZW50IGluIFNhZmVQcm9wZXJ0eVJlYWQgYWJvdmUgZm9yIGFuIGV4cGxhbmF0aW9uIG9mIHRoZSBuZWVkIGZvciB0aGUgbm9uLW51bGxcbiAgICAvLyBhc3NlcnRpb24gaGVyZS5cbiAgICBjb25zdCByZWNlaXZlciA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QucmVjZWl2ZXIpKTtcbiAgICBjb25zdCBtZXRob2QgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2Vzcyh0cy5jcmVhdGVOb25OdWxsRXhwcmVzc2lvbihyZWNlaXZlciksIGFzdC5uYW1lKTtcbiAgICBjb25zdCBhcmdzID0gYXN0LmFyZ3MubWFwKGV4cHIgPT4gdGhpcy50cmFuc2xhdGUoZXhwcikpO1xuICAgIGNvbnN0IGV4cHIgPSB0cy5jcmVhdGVDYWxsKG1ldGhvZCwgdW5kZWZpbmVkLCBhcmdzKTtcbiAgICBjb25zdCB3aGVuTnVsbCA9IHRoaXMuY29uZmlnLnN0cmljdFNhZmVOYXZpZ2F0aW9uVHlwZXMgPyBVTkRFRklORUQgOiBOVUxMX0FTX0FOWTtcbiAgICBjb25zdCBub2RlID0gc2FmZVRlcm5hcnkocmVjZWl2ZXIsIGV4cHIsIHdoZW5OdWxsKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIHRoaXMudHJhbnNsYXRlU3Bhbihhc3Quc3BhbikpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdDogU2FmZVByb3BlcnR5UmVhZCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIC8vIEEgc2FmZSBwcm9wZXJ0eSBleHByZXNzaW9uIGE/LmIgdGFrZXMgdGhlIGZvcm0gYChhICE9IG51bGwgPyBhIS5iIDogd2hlbk51bGwpYCwgd2hlcmVcbiAgICAvLyB3aGVuTnVsbCBpcyBlaXRoZXIgb2YgdHlwZSAnYW55JyBvciBvciAndW5kZWZpbmVkJyBkZXBlbmRpbmcgb24gc3RyaWN0bmVzcy4gVGhlIG5vbi1udWxsXG4gICAgLy8gYXNzZXJ0aW9uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGluIHByYWN0aWNlICdhJyBtYXkgYmUgYSBtZXRob2QgY2FsbCBleHByZXNzaW9uLCB3aGljaCB3b24ndFxuICAgIC8vIGhhdmUgYSBuYXJyb3dlZCB0eXBlIHdoZW4gcmVwZWF0ZWQgaW4gdGhlIHRlcm5hcnkgdHJ1ZSBicmFuY2guXG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3QgZXhwciA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKHJlY2VpdmVyKSwgYXN0Lm5hbWUpO1xuICAgIGNvbnN0IHdoZW5OdWxsID0gdGhpcy5jb25maWcuc3RyaWN0U2FmZU5hdmlnYXRpb25UeXBlcyA/IFVOREVGSU5FRCA6IE5VTExfQVNfQU5ZO1xuICAgIGNvbnN0IG5vZGUgPSBzYWZlVGVybmFyeShyZWNlaXZlciwgZXhwciwgd2hlbk51bGwpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgdGhpcy50cmFuc2xhdGVTcGFuKGFzdC5zcGFuKSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2FmZVRlcm5hcnkoXG4gICAgbGhzOiB0cy5FeHByZXNzaW9uLCB3aGVuTm90TnVsbDogdHMuRXhwcmVzc2lvbiwgd2hlbk51bGw6IHRzLkV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9uIHtcbiAgY29uc3Qgbm90TnVsbENvbXAgPSB0cy5jcmVhdGVCaW5hcnkobGhzLCB0cy5TeW50YXhLaW5kLkV4Y2xhbWF0aW9uRXF1YWxzVG9rZW4sIHRzLmNyZWF0ZU51bGwoKSk7XG4gIGNvbnN0IHRlcm5hcnkgPSB0cy5jcmVhdGVDb25kaXRpb25hbChub3ROdWxsQ29tcCwgd2hlbk5vdE51bGwsIHdoZW5OdWxsKTtcbiAgcmV0dXJuIHRzLmNyZWF0ZVBhcmVuKHRlcm5hcnkpO1xufVxuIl19
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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/builtin", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/ts_helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var builtin_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/builtin");
    var dynamic_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic");
    var result_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result");
    var ts_helpers_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/ts_helpers");
    function literalBinaryOp(op) {
        return { op: op, literal: true };
    }
    function referenceBinaryOp(op) {
        return { op: op, literal: false };
    }
    var BINARY_OPERATORS = new Map([
        [ts.SyntaxKind.PlusToken, literalBinaryOp(function (a, b) { return a + b; })],
        [ts.SyntaxKind.MinusToken, literalBinaryOp(function (a, b) { return a - b; })],
        [ts.SyntaxKind.AsteriskToken, literalBinaryOp(function (a, b) { return a * b; })],
        [ts.SyntaxKind.SlashToken, literalBinaryOp(function (a, b) { return a / b; })],
        [ts.SyntaxKind.PercentToken, literalBinaryOp(function (a, b) { return a % b; })],
        [ts.SyntaxKind.AmpersandToken, literalBinaryOp(function (a, b) { return a & b; })],
        [ts.SyntaxKind.BarToken, literalBinaryOp(function (a, b) { return a | b; })],
        [ts.SyntaxKind.CaretToken, literalBinaryOp(function (a, b) { return a ^ b; })],
        [ts.SyntaxKind.LessThanToken, literalBinaryOp(function (a, b) { return a < b; })],
        [ts.SyntaxKind.LessThanEqualsToken, literalBinaryOp(function (a, b) { return a <= b; })],
        [ts.SyntaxKind.GreaterThanToken, literalBinaryOp(function (a, b) { return a > b; })],
        [ts.SyntaxKind.GreaterThanEqualsToken, literalBinaryOp(function (a, b) { return a >= b; })],
        [ts.SyntaxKind.EqualsEqualsToken, literalBinaryOp(function (a, b) { return a == b; })],
        [ts.SyntaxKind.EqualsEqualsEqualsToken, literalBinaryOp(function (a, b) { return a === b; })],
        [ts.SyntaxKind.ExclamationEqualsToken, literalBinaryOp(function (a, b) { return a != b; })],
        [ts.SyntaxKind.ExclamationEqualsEqualsToken, literalBinaryOp(function (a, b) { return a !== b; })],
        [ts.SyntaxKind.LessThanLessThanToken, literalBinaryOp(function (a, b) { return a << b; })],
        [ts.SyntaxKind.GreaterThanGreaterThanToken, literalBinaryOp(function (a, b) { return a >> b; })],
        [ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken, literalBinaryOp(function (a, b) { return a >>> b; })],
        [ts.SyntaxKind.AsteriskAsteriskToken, literalBinaryOp(function (a, b) { return Math.pow(a, b); })],
        [ts.SyntaxKind.AmpersandAmpersandToken, referenceBinaryOp(function (a, b) { return a && b; })],
        [ts.SyntaxKind.BarBarToken, referenceBinaryOp(function (a, b) { return a || b; })]
    ]);
    var UNARY_OPERATORS = new Map([
        [ts.SyntaxKind.TildeToken, function (a) { return ~a; }], [ts.SyntaxKind.MinusToken, function (a) { return -a; }],
        [ts.SyntaxKind.PlusToken, function (a) { return +a; }], [ts.SyntaxKind.ExclamationToken, function (a) { return !a; }]
    ]);
    var StaticInterpreter = /** @class */ (function () {
        function StaticInterpreter(host, checker, dependencyTracker) {
            this.host = host;
            this.checker = checker;
            this.dependencyTracker = dependencyTracker;
        }
        StaticInterpreter.prototype.visit = function (node, context) {
            return this.visitExpression(node, context);
        };
        StaticInterpreter.prototype.visitExpression = function (node, context) {
            var result;
            if (node.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (node.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (node.kind === ts.SyntaxKind.NullKeyword) {
                return null;
            }
            else if (ts.isStringLiteral(node)) {
                return node.text;
            }
            else if (ts.isNoSubstitutionTemplateLiteral(node)) {
                return node.text;
            }
            else if (ts.isTemplateExpression(node)) {
                result = this.visitTemplateExpression(node, context);
            }
            else if (ts.isNumericLiteral(node)) {
                return parseFloat(node.text);
            }
            else if (ts.isObjectLiteralExpression(node)) {
                result = this.visitObjectLiteralExpression(node, context);
            }
            else if (ts.isIdentifier(node)) {
                result = this.visitIdentifier(node, context);
            }
            else if (ts.isPropertyAccessExpression(node)) {
                result = this.visitPropertyAccessExpression(node, context);
            }
            else if (ts.isCallExpression(node)) {
                result = this.visitCallExpression(node, context);
            }
            else if (ts.isConditionalExpression(node)) {
                result = this.visitConditionalExpression(node, context);
            }
            else if (ts.isPrefixUnaryExpression(node)) {
                result = this.visitPrefixUnaryExpression(node, context);
            }
            else if (ts.isBinaryExpression(node)) {
                result = this.visitBinaryExpression(node, context);
            }
            else if (ts.isArrayLiteralExpression(node)) {
                result = this.visitArrayLiteralExpression(node, context);
            }
            else if (ts.isParenthesizedExpression(node)) {
                result = this.visitParenthesizedExpression(node, context);
            }
            else if (ts.isElementAccessExpression(node)) {
                result = this.visitElementAccessExpression(node, context);
            }
            else if (ts.isAsExpression(node)) {
                result = this.visitExpression(node.expression, context);
            }
            else if (ts.isNonNullExpression(node)) {
                result = this.visitExpression(node.expression, context);
            }
            else if (this.host.isClass(node)) {
                result = this.visitDeclaration(node, context);
            }
            else {
                return dynamic_1.DynamicValue.fromUnknownExpressionType(node);
            }
            if (result instanceof dynamic_1.DynamicValue && result.node !== node) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, result);
            }
            return result;
        };
        StaticInterpreter.prototype.visitArrayLiteralExpression = function (node, context) {
            var array = [];
            for (var i = 0; i < node.elements.length; i++) {
                var element = node.elements[i];
                if (ts.isSpreadElement(element)) {
                    array.push.apply(array, tslib_1.__spread(this.visitSpreadElement(element, context)));
                }
                else {
                    array.push(this.visitExpression(element, context));
                }
            }
            return array;
        };
        StaticInterpreter.prototype.visitObjectLiteralExpression = function (node, context) {
            var map = new Map();
            for (var i = 0; i < node.properties.length; i++) {
                var property = node.properties[i];
                if (ts.isPropertyAssignment(property)) {
                    var name_1 = this.stringNameFromPropertyName(property.name, context);
                    // Check whether the name can be determined statically.
                    if (name_1 === undefined) {
                        return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromDynamicString(property.name));
                    }
                    map.set(name_1, this.visitExpression(property.initializer, context));
                }
                else if (ts.isShorthandPropertyAssignment(property)) {
                    var symbol = this.checker.getShorthandAssignmentValueSymbol(property);
                    if (symbol === undefined || symbol.valueDeclaration === undefined) {
                        map.set(property.name.text, dynamic_1.DynamicValue.fromUnknown(property));
                    }
                    else {
                        map.set(property.name.text, this.visitDeclaration(symbol.valueDeclaration, context));
                    }
                }
                else if (ts.isSpreadAssignment(property)) {
                    var spread = this.visitExpression(property.expression, context);
                    if (spread instanceof dynamic_1.DynamicValue) {
                        return dynamic_1.DynamicValue.fromDynamicInput(node, spread);
                    }
                    else if (!(spread instanceof Map)) {
                        throw new Error("Unexpected value in spread assignment: " + spread);
                    }
                    spread.forEach(function (value, key) { return map.set(key, value); });
                }
                else {
                    return dynamic_1.DynamicValue.fromUnknown(node);
                }
            }
            return map;
        };
        StaticInterpreter.prototype.visitTemplateExpression = function (node, context) {
            var pieces = [node.head.text];
            for (var i = 0; i < node.templateSpans.length; i++) {
                var span = node.templateSpans[i];
                var value = this.visit(span.expression, context);
                if (value instanceof result_1.EnumValue) {
                    value = value.resolved;
                }
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ||
                    value == null) {
                    pieces.push("" + value);
                }
                else if (value instanceof dynamic_1.DynamicValue) {
                    return dynamic_1.DynamicValue.fromDynamicInput(node, value);
                }
                else {
                    return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromDynamicString(span.expression));
                }
                pieces.push(span.literal.text);
            }
            return pieces.join('');
        };
        StaticInterpreter.prototype.visitIdentifier = function (node, context) {
            var decl = this.host.getDeclarationOfIdentifier(node);
            if (decl === null) {
                if (node.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword) {
                    return undefined;
                }
                else {
                    return dynamic_1.DynamicValue.fromUnknownIdentifier(node);
                }
            }
            var result = this.visitDeclaration(decl.node, tslib_1.__assign({}, context, joinModuleContext(context, node, decl)));
            if (result instanceof imports_1.Reference) {
                // Only record identifiers to non-synthetic references. Synthetic references may not have the
                // same value at runtime as they do at compile time, so it's not legal to refer to them by the
                // identifier here.
                if (!result.synthetic) {
                    result.addIdentifier(node);
                }
            }
            else if (result instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, result);
            }
            return result;
        };
        StaticInterpreter.prototype.visitDeclaration = function (node, context) {
            if (this.dependencyTracker) {
                this.dependencyTracker.trackFileDependency(node.getSourceFile(), context.originatingFile);
            }
            if (this.host.isClass(node)) {
                return this.getReference(node, context);
            }
            else if (ts.isVariableDeclaration(node)) {
                return this.visitVariableDeclaration(node, context);
            }
            else if (ts.isParameter(node) && context.scope.has(node)) {
                return context.scope.get(node);
            }
            else if (ts.isExportAssignment(node)) {
                return this.visitExpression(node.expression, context);
            }
            else if (ts.isEnumDeclaration(node)) {
                return this.visitEnumDeclaration(node, context);
            }
            else if (ts.isSourceFile(node)) {
                return this.visitSourceFile(node, context);
            }
            else {
                return this.getReference(node, context);
            }
        };
        StaticInterpreter.prototype.visitVariableDeclaration = function (node, context) {
            var value = this.host.getVariableValue(node);
            if (value !== null) {
                return this.visitExpression(value, context);
            }
            else if (isVariableDeclarationDeclared(node)) {
                return this.getReference(node, context);
            }
            else {
                return undefined;
            }
        };
        StaticInterpreter.prototype.visitEnumDeclaration = function (node, context) {
            var _this = this;
            var enumRef = this.getReference(node, context);
            var map = new Map();
            node.members.forEach(function (member) {
                var name = _this.stringNameFromPropertyName(member.name, context);
                if (name !== undefined) {
                    var resolved = member.initializer && _this.visit(member.initializer, context);
                    map.set(name, new result_1.EnumValue(enumRef, name, resolved));
                }
            });
            return map;
        };
        StaticInterpreter.prototype.visitElementAccessExpression = function (node, context) {
            var lhs = this.visitExpression(node.expression, context);
            if (node.argumentExpression === undefined) {
                throw new Error("Expected argument in ElementAccessExpression");
            }
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            var rhs = this.visitExpression(node.argumentExpression, context);
            if (rhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, rhs);
            }
            if (typeof rhs !== 'string' && typeof rhs !== 'number') {
                throw new Error("ElementAccessExpression index should be string or number, got " + typeof rhs + ": " + rhs);
            }
            return this.accessHelper(node, lhs, rhs, context);
        };
        StaticInterpreter.prototype.visitPropertyAccessExpression = function (node, context) {
            var lhs = this.visitExpression(node.expression, context);
            var rhs = node.name.text;
            // TODO: handle reference to class declaration.
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            return this.accessHelper(node, lhs, rhs, context);
        };
        StaticInterpreter.prototype.visitSourceFile = function (node, context) {
            var _this = this;
            var declarations = this.host.getExportsOfModule(node);
            if (declarations === null) {
                return dynamic_1.DynamicValue.fromUnknown(node);
            }
            var map = new Map();
            declarations.forEach(function (decl, name) {
                var value = _this.visitDeclaration(decl.node, tslib_1.__assign({}, context, joinModuleContext(context, node, decl)));
                map.set(name, value);
            });
            return map;
        };
        StaticInterpreter.prototype.accessHelper = function (node, lhs, rhs, context) {
            var strIndex = "" + rhs;
            if (lhs instanceof Map) {
                if (lhs.has(strIndex)) {
                    return lhs.get(strIndex);
                }
                else {
                    return undefined;
                }
            }
            else if (Array.isArray(lhs)) {
                if (rhs === 'length') {
                    return lhs.length;
                }
                else if (rhs === 'slice') {
                    return new builtin_1.ArraySliceBuiltinFn(node, lhs);
                }
                else if (rhs === 'concat') {
                    return new builtin_1.ArrayConcatBuiltinFn(node, lhs);
                }
                if (typeof rhs !== 'number' || !Number.isInteger(rhs)) {
                    return dynamic_1.DynamicValue.fromUnknown(node);
                }
                if (rhs < 0 || rhs >= lhs.length) {
                    throw new Error("Index out of bounds: " + rhs + " vs " + lhs.length);
                }
                return lhs[rhs];
            }
            else if (lhs instanceof imports_1.Reference) {
                var ref = lhs.node;
                if (this.host.isClass(ref)) {
                    var module_1 = owningModule(context, lhs.bestGuessOwningModule);
                    var value = undefined;
                    var member = this.host.getMembersOfClass(ref).find(function (member) { return member.isStatic && member.name === strIndex; });
                    if (member !== undefined) {
                        if (member.value !== null) {
                            value = this.visitExpression(member.value, context);
                        }
                        else if (member.implementation !== null) {
                            value = new imports_1.Reference(member.implementation, module_1);
                        }
                        else if (member.node) {
                            value = new imports_1.Reference(member.node, module_1);
                        }
                    }
                    return value;
                }
                else if (typescript_1.isDeclaration(ref)) {
                    return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromExternalReference(ref, lhs));
                }
            }
            else if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            return dynamic_1.DynamicValue.fromUnknown(node);
        };
        StaticInterpreter.prototype.visitCallExpression = function (node, context) {
            var _this = this;
            var lhs = this.visitExpression(node.expression, context);
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            // If the call refers to a builtin function, attempt to evaluate the function.
            if (lhs instanceof result_1.BuiltinFn) {
                return lhs.evaluate(this.evaluateFunctionArguments(node, context));
            }
            if (!(lhs instanceof imports_1.Reference)) {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node.expression, lhs);
            }
            var fn = this.host.getDefinitionOfFunction(lhs.node);
            if (fn === null) {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node.expression, lhs);
            }
            // If the function corresponds with a tslib helper function, evaluate it with custom logic.
            if (fn.helper !== null) {
                var args_1 = this.evaluateFunctionArguments(node, context);
                return ts_helpers_1.evaluateTsHelperInline(fn.helper, node, args_1);
            }
            if (!isFunctionOrMethodReference(lhs)) {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node.expression, lhs);
            }
            // If the function is foreign (declared through a d.ts file), attempt to resolve it with the
            // foreignFunctionResolver, if one is specified.
            if (fn.body === null) {
                var expr = null;
                if (context.foreignFunctionResolver) {
                    expr = context.foreignFunctionResolver(lhs, node.arguments);
                }
                if (expr === null) {
                    return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromExternalReference(node.expression, lhs));
                }
                // If the function is declared in a different file, resolve the foreign function expression
                // using the absolute module name of that file (if any).
                if (lhs.bestGuessOwningModule !== null) {
                    context = tslib_1.__assign({}, context, { absoluteModuleName: lhs.bestGuessOwningModule.specifier, resolutionContext: node.getSourceFile().fileName });
                }
                var res = this.visitExpression(expr, context);
                if (res instanceof imports_1.Reference) {
                    // This Reference was created synthetically, via a foreign function resolver. The real
                    // runtime value of the function expression may be different than the foreign function
                    // resolved value, so mark the Reference as synthetic to avoid it being misinterpreted.
                    res.synthetic = true;
                }
                return res;
            }
            var body = fn.body;
            if (body.length !== 1 || !ts.isReturnStatement(body[0])) {
                return dynamic_1.DynamicValue.fromUnknown(node);
            }
            var ret = body[0];
            var args = this.evaluateFunctionArguments(node, context);
            var newScope = new Map();
            var calleeContext = tslib_1.__assign({}, context, { scope: newScope });
            fn.parameters.forEach(function (param, index) {
                var arg = args[index];
                if (param.node.dotDotDotToken !== undefined) {
                    arg = args.slice(index);
                }
                if (arg === undefined && param.initializer !== null) {
                    arg = _this.visitExpression(param.initializer, calleeContext);
                }
                newScope.set(param.node, arg);
            });
            return ret.expression !== undefined ? this.visitExpression(ret.expression, calleeContext) :
                undefined;
        };
        StaticInterpreter.prototype.visitConditionalExpression = function (node, context) {
            var condition = this.visitExpression(node.condition, context);
            if (condition instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, condition);
            }
            if (condition) {
                return this.visitExpression(node.whenTrue, context);
            }
            else {
                return this.visitExpression(node.whenFalse, context);
            }
        };
        StaticInterpreter.prototype.visitPrefixUnaryExpression = function (node, context) {
            var operatorKind = node.operator;
            if (!UNARY_OPERATORS.has(operatorKind)) {
                throw new Error("Unsupported prefix unary operator: " + ts.SyntaxKind[operatorKind]);
            }
            var op = UNARY_OPERATORS.get(operatorKind);
            var value = this.visitExpression(node.operand, context);
            if (value instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, value);
            }
            else {
                return op(value);
            }
        };
        StaticInterpreter.prototype.visitBinaryExpression = function (node, context) {
            var tokenKind = node.operatorToken.kind;
            if (!BINARY_OPERATORS.has(tokenKind)) {
                throw new Error("Unsupported binary operator: " + ts.SyntaxKind[tokenKind]);
            }
            var opRecord = BINARY_OPERATORS.get(tokenKind);
            var lhs, rhs;
            if (opRecord.literal) {
                lhs = literal(this.visitExpression(node.left, context));
                rhs = literal(this.visitExpression(node.right, context));
            }
            else {
                lhs = this.visitExpression(node.left, context);
                rhs = this.visitExpression(node.right, context);
            }
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            else if (rhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, rhs);
            }
            else {
                return opRecord.op(lhs, rhs);
            }
        };
        StaticInterpreter.prototype.visitParenthesizedExpression = function (node, context) {
            return this.visitExpression(node.expression, context);
        };
        StaticInterpreter.prototype.evaluateFunctionArguments = function (node, context) {
            var e_1, _a;
            var args = [];
            try {
                for (var _b = tslib_1.__values(node.arguments), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var arg = _c.value;
                    if (ts.isSpreadElement(arg)) {
                        args.push.apply(args, tslib_1.__spread(this.visitSpreadElement(arg, context)));
                    }
                    else {
                        args.push(this.visitExpression(arg, context));
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
            return args;
        };
        StaticInterpreter.prototype.visitSpreadElement = function (node, context) {
            var spread = this.visitExpression(node.expression, context);
            if (spread instanceof dynamic_1.DynamicValue) {
                return [dynamic_1.DynamicValue.fromDynamicInput(node.expression, spread)];
            }
            else if (!Array.isArray(spread)) {
                throw new Error("Unexpected value in spread expression: " + spread);
            }
            else {
                return spread;
            }
        };
        StaticInterpreter.prototype.stringNameFromPropertyName = function (node, context) {
            if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
                return node.text;
            }
            else { // ts.ComputedPropertyName
                var literal_1 = this.visitExpression(node.expression, context);
                return typeof literal_1 === 'string' ? literal_1 : undefined;
            }
        };
        StaticInterpreter.prototype.getReference = function (node, context) {
            return new imports_1.Reference(node, owningModule(context));
        };
        return StaticInterpreter;
    }());
    exports.StaticInterpreter = StaticInterpreter;
    function isFunctionOrMethodReference(ref) {
        return ts.isFunctionDeclaration(ref.node) || ts.isMethodDeclaration(ref.node) ||
            ts.isFunctionExpression(ref.node);
    }
    function literal(value) {
        if (value instanceof dynamic_1.DynamicValue || value === null || value === undefined ||
            typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value;
        }
        throw new Error("Value " + value + " is not literal and cannot be used in this context.");
    }
    function isVariableDeclarationDeclared(node) {
        if (node.parent === undefined || !ts.isVariableDeclarationList(node.parent)) {
            return false;
        }
        var declList = node.parent;
        if (declList.parent === undefined || !ts.isVariableStatement(declList.parent)) {
            return false;
        }
        var varStmt = declList.parent;
        return varStmt.modifiers !== undefined &&
            varStmt.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.DeclareKeyword; });
    }
    var EMPTY = {};
    function joinModuleContext(existing, node, decl) {
        if (decl.viaModule !== null && decl.viaModule !== existing.absoluteModuleName) {
            return {
                absoluteModuleName: decl.viaModule,
                resolutionContext: node.getSourceFile().fileName,
            };
        }
        else {
            return EMPTY;
        }
    }
    function owningModule(context, override) {
        if (override === void 0) { override = null; }
        var specifier = context.absoluteModuleName;
        if (override !== null) {
            specifier = override.specifier;
        }
        if (specifier !== null) {
            return {
                specifier: specifier,
                resolutionContext: context.resolutionContext,
            };
        }
        else {
            return null;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJwcmV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BhcnRpYWxfZXZhbHVhdG9yL3NyYy9pbnRlcnByZXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMsbUVBQXdDO0lBR3hDLGtGQUF3RDtJQUV4RCx5RkFBb0U7SUFDcEUseUZBQXVDO0lBRXZDLHVGQUFtRztJQUNuRywrRkFBb0Q7SUFjcEQsU0FBUyxlQUFlLENBQUMsRUFBMkI7UUFDbEQsT0FBTyxFQUFDLEVBQUUsSUFBQSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsU0FBUyxpQkFBaUIsQ0FBQyxFQUEyQjtRQUNwRCxPQUFPLEVBQUMsRUFBRSxJQUFBLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFtQztRQUNqRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxFQUFMLENBQUssQ0FBQyxDQUFDO1FBQzNELENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxHQUFHLENBQUMsRUFBTCxDQUFLLENBQUMsQ0FBQztRQUMvRCxDQUFDLEVBQUUsQ0FBQyxV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QUM7SUFFakIsU0FBUyxpQkFBaUIsQ0FBQyxRQUFpQixFQUFFLElBQWEsRUFBRSxJQUFpQjtRQUk1RSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDLGtCQUFrQixFQUFFO1lBQzdFLE9BQU87Z0JBQ0wsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ2xDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRO2FBQ2pELENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTyxLQUFLLENBQUM7U0FDZDtJQUNILENBQUM7SUFFRCxTQUFTLFlBQVksQ0FBQyxPQUFnQixFQUFFLFFBQW9DO1FBQXBDLHlCQUFBLEVBQUEsZUFBb0M7UUFDMUUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1FBQzNDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNyQixTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztTQUNoQztRQUNELElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtZQUN0QixPQUFPO2dCQUNMLFNBQVMsV0FBQTtnQkFDVCxpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCO2FBQzdDLENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge093bmluZ01vZHVsZX0gZnJvbSAnLi4vLi4vaW1wb3J0cy9zcmMvcmVmZXJlbmNlcyc7XG5pbXBvcnQge0RlY2xhcmF0aW9uLCBSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge2lzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0FycmF5Q29uY2F0QnVpbHRpbkZuLCBBcnJheVNsaWNlQnVpbHRpbkZufSBmcm9tICcuL2J1aWx0aW4nO1xuaW1wb3J0IHtEeW5hbWljVmFsdWV9IGZyb20gJy4vZHluYW1pYyc7XG5pbXBvcnQge0RlcGVuZGVuY3lUcmFja2VyLCBGb3JlaWduRnVuY3Rpb25SZXNvbHZlcn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuaW1wb3J0IHtCdWlsdGluRm4sIEVudW1WYWx1ZSwgUmVzb2x2ZWRWYWx1ZSwgUmVzb2x2ZWRWYWx1ZUFycmF5LCBSZXNvbHZlZFZhbHVlTWFwfSBmcm9tICcuL3Jlc3VsdCc7XG5pbXBvcnQge2V2YWx1YXRlVHNIZWxwZXJJbmxpbmV9IGZyb20gJy4vdHNfaGVscGVycyc7XG5cblxuLyoqXG4gKiBUcmFja3MgdGhlIHNjb3BlIG9mIGEgZnVuY3Rpb24gYm9keSwgd2hpY2ggaW5jbHVkZXMgYFJlc29sdmVkVmFsdWVgcyBmb3IgdGhlIHBhcmFtZXRlcnMgb2YgdGhhdFxuICogYm9keS5cbiAqL1xudHlwZSBTY29wZSA9IE1hcDx0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbiwgUmVzb2x2ZWRWYWx1ZT47XG5cbmludGVyZmFjZSBCaW5hcnlPcGVyYXRvckRlZiB7XG4gIGxpdGVyYWw6IGJvb2xlYW47XG4gIG9wOiAoYTogYW55LCBiOiBhbnkpID0+IFJlc29sdmVkVmFsdWU7XG59XG5cbmZ1bmN0aW9uIGxpdGVyYWxCaW5hcnlPcChvcDogKGE6IGFueSwgYjogYW55KSA9PiBhbnkpOiBCaW5hcnlPcGVyYXRvckRlZiB7XG4gIHJldHVybiB7b3AsIGxpdGVyYWw6IHRydWV9O1xufVxuXG5mdW5jdGlvbiByZWZlcmVuY2VCaW5hcnlPcChvcDogKGE6IGFueSwgYjogYW55KSA9PiBhbnkpOiBCaW5hcnlPcGVyYXRvckRlZiB7XG4gIHJldHVybiB7b3AsIGxpdGVyYWw6IGZhbHNlfTtcbn1cblxuY29uc3QgQklOQVJZX09QRVJBVE9SUyA9IG5ldyBNYXA8dHMuU3ludGF4S2luZCwgQmluYXJ5T3BlcmF0b3JEZWY+KFtcbiAgW3RzLlN5bnRheEtpbmQuUGx1c1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgKyBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLk1pbnVzVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSAtIGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuQXN0ZXJpc2tUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhICogYildLFxuICBbdHMuU3ludGF4S2luZC5TbGFzaFRva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgLyBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLlBlcmNlbnRUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhICUgYildLFxuICBbdHMuU3ludGF4S2luZC5BbXBlcnNhbmRUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhICYgYildLFxuICBbdHMuU3ludGF4S2luZC5CYXJUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhIHwgYildLFxuICBbdHMuU3ludGF4S2luZC5DYXJldFRva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgXiBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkxlc3NUaGFuVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSA8IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuTGVzc1RoYW5FcXVhbHNUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhIDw9IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuR3JlYXRlclRoYW5Ub2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhID4gYildLFxuICBbdHMuU3ludGF4S2luZC5HcmVhdGVyVGhhbkVxdWFsc1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgPj0gYildLFxuICBbdHMuU3ludGF4S2luZC5FcXVhbHNFcXVhbHNUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhID09IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuRXF1YWxzRXF1YWxzRXF1YWxzVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSA9PT0gYildLFxuICBbdHMuU3ludGF4S2luZC5FeGNsYW1hdGlvbkVxdWFsc1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgIT0gYildLFxuICBbdHMuU3ludGF4S2luZC5FeGNsYW1hdGlvbkVxdWFsc0VxdWFsc1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgIT09IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuTGVzc1RoYW5MZXNzVGhhblRva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgPDwgYildLFxuICBbdHMuU3ludGF4S2luZC5HcmVhdGVyVGhhbkdyZWF0ZXJUaGFuVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSA+PiBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkdyZWF0ZXJUaGFuR3JlYXRlclRoYW5HcmVhdGVyVGhhblRva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgPj4+IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuQXN0ZXJpc2tBc3Rlcmlza1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IE1hdGgucG93KGEsIGIpKV0sXG4gIFt0cy5TeW50YXhLaW5kLkFtcGVyc2FuZEFtcGVyc2FuZFRva2VuLCByZWZlcmVuY2VCaW5hcnlPcCgoYSwgYikgPT4gYSAmJiBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkJhckJhclRva2VuLCByZWZlcmVuY2VCaW5hcnlPcCgoYSwgYikgPT4gYSB8fCBiKV1cbl0pO1xuXG5jb25zdCBVTkFSWV9PUEVSQVRPUlMgPSBuZXcgTWFwPHRzLlN5bnRheEtpbmQsIChhOiBhbnkpID0+IGFueT4oW1xuICBbdHMuU3ludGF4S2luZC5UaWxkZVRva2VuLCBhID0+IH5hXSwgW3RzLlN5bnRheEtpbmQuTWludXNUb2tlbiwgYSA9PiAtYV0sXG4gIFt0cy5TeW50YXhLaW5kLlBsdXNUb2tlbiwgYSA9PiArYV0sIFt0cy5TeW50YXhLaW5kLkV4Y2xhbWF0aW9uVG9rZW4sIGEgPT4gIWFdXG5dKTtcblxuaW50ZXJmYWNlIENvbnRleHQge1xuICBvcmlnaW5hdGluZ0ZpbGU6IHRzLlNvdXJjZUZpbGU7XG4gIC8qKlxuICAgKiBUaGUgbW9kdWxlIG5hbWUgKGlmIGFueSkgd2hpY2ggd2FzIHVzZWQgdG8gcmVhY2ggdGhlIGN1cnJlbnRseSByZXNvbHZpbmcgc3ltYm9scy5cbiAgICovXG4gIGFic29sdXRlTW9kdWxlTmFtZTogc3RyaW5nfG51bGw7XG5cbiAgLyoqXG4gICAqIEEgZmlsZSBuYW1lIHJlcHJlc2VudGluZyB0aGUgY29udGV4dCBpbiB3aGljaCB0aGUgY3VycmVudCBgYWJzb2x1dGVNb2R1bGVOYW1lYCwgaWYgYW55LCB3YXNcbiAgICogcmVzb2x2ZWQuXG4gICAqL1xuICByZXNvbHV0aW9uQ29udGV4dDogc3RyaW5nO1xuICBzY29wZTogU2NvcGU7XG4gIGZvcmVpZ25GdW5jdGlvblJlc29sdmVyPzogRm9yZWlnbkZ1bmN0aW9uUmVzb2x2ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNJbnRlcnByZXRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBob3N0OiBSZWZsZWN0aW9uSG9zdCwgcHJpdmF0ZSBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbiAgICAgIHByaXZhdGUgZGVwZW5kZW5jeVRyYWNrZXI/OiBEZXBlbmRlbmN5VHJhY2tlcikge31cblxuICB2aXNpdChub2RlOiB0cy5FeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdEV4cHJlc3Npb24obm9kZTogdHMuRXhwcmVzc2lvbiwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGxldCByZXN1bHQ6IFJlc29sdmVkVmFsdWU7XG4gICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5UcnVlS2V5d29yZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRmFsc2VLZXl3b3JkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTnVsbEtleXdvcmQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAodHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZS50ZXh0O1xuICAgIH0gZWxzZSBpZiAodHMuaXNOb1N1YnN0aXR1dGlvblRlbXBsYXRlTGl0ZXJhbChub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgICB9IGVsc2UgaWYgKHRzLmlzVGVtcGxhdGVFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0VGVtcGxhdGVFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNOdW1lcmljTGl0ZXJhbChub2RlKSkge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobm9kZS50ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdElkZW50aWZpZXIobm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdFByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRDYWxsRXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzQ29uZGl0aW9uYWxFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0Q29uZGl0aW9uYWxFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcmVmaXhVbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRQcmVmaXhVbmFyeUV4cHJlc3Npb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNOb25OdWxsRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaG9zdC5pc0NsYXNzKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0RGVjbGFyYXRpb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbVVua25vd25FeHByZXNzaW9uVHlwZShub2RlKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSAmJiByZXN1bHQubm9kZSAhPT0gbm9kZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlOiB0cy5BcnJheUxpdGVyYWxFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTpcbiAgICAgIFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGFycmF5OiBSZXNvbHZlZFZhbHVlQXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBub2RlLmVsZW1lbnRzW2ldO1xuICAgICAgaWYgKHRzLmlzU3ByZWFkRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICBhcnJheS5wdXNoKC4uLnRoaXMudmlzaXRTcHJlYWRFbGVtZW50KGVsZW1lbnQsIGNvbnRleHQpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LnB1c2godGhpcy52aXNpdEV4cHJlc3Npb24oZWxlbWVudCwgY29udGV4dCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgbWFwOiBSZXNvbHZlZFZhbHVlTWFwID0gbmV3IE1hcDxzdHJpbmcsIFJlc29sdmVkVmFsdWU+KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xuICAgICAgaWYgKHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5KSkge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5zdHJpbmdOYW1lRnJvbVByb3BlcnR5TmFtZShwcm9wZXJ0eS5uYW1lLCBjb250ZXh0KTtcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgbmFtZSBjYW4gYmUgZGV0ZXJtaW5lZCBzdGF0aWNhbGx5LlxuICAgICAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY1N0cmluZyhwcm9wZXJ0eS5uYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFwLnNldChuYW1lLCB0aGlzLnZpc2l0RXhwcmVzc2lvbihwcm9wZXJ0eS5pbml0aWFsaXplciwgY29udGV4dCkpO1xuICAgICAgfSBlbHNlIGlmICh0cy5pc1Nob3J0aGFuZFByb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSkpIHtcbiAgICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5jaGVja2VyLmdldFNob3J0aGFuZEFzc2lnbm1lbnRWYWx1ZVN5bWJvbChwcm9wZXJ0eSk7XG4gICAgICAgIGlmIChzeW1ib2wgPT09IHVuZGVmaW5lZCB8fCBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbWFwLnNldChwcm9wZXJ0eS5uYW1lLnRleHQsIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihwcm9wZXJ0eSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcC5zZXQocHJvcGVydHkubmFtZS50ZXh0LCB0aGlzLnZpc2l0RGVjbGFyYXRpb24oc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24sIGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0cy5pc1NwcmVhZEFzc2lnbm1lbnQocHJvcGVydHkpKSB7XG4gICAgICAgIGNvbnN0IHNwcmVhZCA9IHRoaXMudmlzaXRFeHByZXNzaW9uKHByb3BlcnR5LmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgICAgICBpZiAoc3ByZWFkIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHNwcmVhZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIShzcHJlYWQgaW5zdGFuY2VvZiBNYXApKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHZhbHVlIGluIHNwcmVhZCBhc3NpZ25tZW50OiAke3NwcmVhZH1gKTtcbiAgICAgICAgfVxuICAgICAgICBzcHJlYWQuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gbWFwLnNldChrZXksIHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21Vbmtub3duKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFRlbXBsYXRlRXhwcmVzc2lvbihub2RlOiB0cy5UZW1wbGF0ZUV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBwaWVjZXM6IHN0cmluZ1tdID0gW25vZGUuaGVhZC50ZXh0XTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUudGVtcGxhdGVTcGFucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc3BhbiA9IG5vZGUudGVtcGxhdGVTcGFuc1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMudmlzaXQoc3Bhbi5leHByZXNzaW9uLCBjb250ZXh0KTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVudW1WYWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlc29sdmVkO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgIHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgcGllY2VzLnB1c2goYCR7dmFsdWV9YCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljU3RyaW5nKHNwYW4uZXhwcmVzc2lvbikpO1xuICAgICAgfVxuICAgICAgcGllY2VzLnB1c2goc3Bhbi5saXRlcmFsLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gcGllY2VzLmpvaW4oJycpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdElkZW50aWZpZXIobm9kZTogdHMuSWRlbnRpZmllciwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGRlY2wgPSB0aGlzLmhvc3QuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIobm9kZSk7XG4gICAgaWYgKGRlY2wgPT09IG51bGwpIHtcbiAgICAgIGlmIChub2RlLm9yaWdpbmFsS2V5d29yZEtpbmQgPT09IHRzLlN5bnRheEtpbmQuVW5kZWZpbmVkS2V5d29yZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bklkZW50aWZpZXIobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgIHRoaXMudmlzaXREZWNsYXJhdGlvbihkZWNsLm5vZGUsIHsuLi5jb250ZXh0LCAuLi5qb2luTW9kdWxlQ29udGV4dChjb250ZXh0LCBub2RlLCBkZWNsKX0pO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBSZWZlcmVuY2UpIHtcbiAgICAgIC8vIE9ubHkgcmVjb3JkIGlkZW50aWZpZXJzIHRvIG5vbi1zeW50aGV0aWMgcmVmZXJlbmNlcy4gU3ludGhldGljIHJlZmVyZW5jZXMgbWF5IG5vdCBoYXZlIHRoZVxuICAgICAgLy8gc2FtZSB2YWx1ZSBhdCBydW50aW1lIGFzIHRoZXkgZG8gYXQgY29tcGlsZSB0aW1lLCBzbyBpdCdzIG5vdCBsZWdhbCB0byByZWZlciB0byB0aGVtIGJ5IHRoZVxuICAgICAgLy8gaWRlbnRpZmllciBoZXJlLlxuICAgICAgaWYgKCFyZXN1bHQuc3ludGhldGljKSB7XG4gICAgICAgIHJlc3VsdC5hZGRJZGVudGlmaWVyKG5vZGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzdWx0IGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXREZWNsYXJhdGlvbihub2RlOiB0cy5EZWNsYXJhdGlvbiwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGlmICh0aGlzLmRlcGVuZGVuY3lUcmFja2VyKSB7XG4gICAgICB0aGlzLmRlcGVuZGVuY3lUcmFja2VyLnRyYWNrRmlsZURlcGVuZGVuY3kobm9kZS5nZXRTb3VyY2VGaWxlKCksIGNvbnRleHQub3JpZ2luYXRpbmdGaWxlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaG9zdC5pc0NsYXNzKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSZWZlcmVuY2Uobm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUGFyYW1ldGVyKG5vZGUpICYmIGNvbnRleHQuc2NvcGUuaGFzKG5vZGUpKSB7XG4gICAgICByZXR1cm4gY29udGV4dC5zY29wZS5nZXQobm9kZSkgITtcbiAgICB9IGVsc2UgaWYgKHRzLmlzRXhwb3J0QXNzaWdubWVudChub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc0VudW1EZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFbnVtRGVjbGFyYXRpb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1NvdXJjZUZpbGUobm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0U291cmNlRmlsZShub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVmZXJlbmNlKG5vZGUsIGNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGU6IHRzLlZhcmlhYmxlRGVjbGFyYXRpb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaG9zdC5nZXRWYXJpYWJsZVZhbHVlKG5vZGUpO1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKHZhbHVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKGlzVmFyaWFibGVEZWNsYXJhdGlvbkRlY2xhcmVkKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSZWZlcmVuY2Uobm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdEVudW1EZWNsYXJhdGlvbihub2RlOiB0cy5FbnVtRGVjbGFyYXRpb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBlbnVtUmVmID0gdGhpcy5nZXRSZWZlcmVuY2Uobm9kZSwgY29udGV4dCkgYXMgUmVmZXJlbmNlPHRzLkVudW1EZWNsYXJhdGlvbj47XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxzdHJpbmcsIEVudW1WYWx1ZT4oKTtcbiAgICBub2RlLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuc3RyaW5nTmFtZUZyb21Qcm9wZXJ0eU5hbWUobWVtYmVyLm5hbWUsIGNvbnRleHQpO1xuICAgICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCByZXNvbHZlZCA9IG1lbWJlci5pbml0aWFsaXplciAmJiB0aGlzLnZpc2l0KG1lbWJlci5pbml0aWFsaXplciwgY29udGV4dCk7XG4gICAgICAgIG1hcC5zZXQobmFtZSwgbmV3IEVudW1WYWx1ZShlbnVtUmVmLCBuYW1lLCByZXNvbHZlZCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtYXA7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0RWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZTogdHMuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgbGhzID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLCBjb250ZXh0KTtcbiAgICBpZiAobm9kZS5hcmd1bWVudEV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhcmd1bWVudCBpbiBFbGVtZW50QWNjZXNzRXhwcmVzc2lvbmApO1xuICAgIH1cbiAgICBpZiAobGhzIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgbGhzKTtcbiAgICB9XG4gICAgY29uc3QgcmhzID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5hcmd1bWVudEV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIGlmIChyaHMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCByaHMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJocyAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIHJocyAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24gaW5kZXggc2hvdWxkIGJlIHN0cmluZyBvciBudW1iZXIsIGdvdCAke3R5cGVvZiByaHN9OiAke3Joc31gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NIZWxwZXIobm9kZSwgbGhzLCByaHMsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlOiB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgbGhzID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLCBjb250ZXh0KTtcbiAgICBjb25zdCByaHMgPSBub2RlLm5hbWUudGV4dDtcbiAgICAvLyBUT0RPOiBoYW5kbGUgcmVmZXJlbmNlIHRvIGNsYXNzIGRlY2xhcmF0aW9uLlxuICAgIGlmIChsaHMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBsaHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NIZWxwZXIobm9kZSwgbGhzLCByaHMsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFNvdXJjZUZpbGUobm9kZTogdHMuU291cmNlRmlsZSwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGRlY2xhcmF0aW9ucyA9IHRoaXMuaG9zdC5nZXRFeHBvcnRzT2ZNb2R1bGUobm9kZSk7XG4gICAgaWYgKGRlY2xhcmF0aW9ucyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihub2RlKTtcbiAgICB9XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxzdHJpbmcsIFJlc29sdmVkVmFsdWU+KCk7XG4gICAgZGVjbGFyYXRpb25zLmZvckVhY2goKGRlY2wsIG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aXNpdERlY2xhcmF0aW9uKFxuICAgICAgICAgIGRlY2wubm9kZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbnRleHQsIC4uLmpvaW5Nb2R1bGVDb250ZXh0KGNvbnRleHQsIG5vZGUsIGRlY2wpLFxuICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICBtYXAuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgcHJpdmF0ZSBhY2Nlc3NIZWxwZXIoXG4gICAgICBub2RlOiB0cy5FeHByZXNzaW9uLCBsaHM6IFJlc29sdmVkVmFsdWUsIHJoczogc3RyaW5nfG51bWJlcixcbiAgICAgIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBzdHJJbmRleCA9IGAke3Joc31gO1xuICAgIGlmIChsaHMgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGlmIChsaHMuaGFzKHN0ckluZGV4KSkge1xuICAgICAgICByZXR1cm4gbGhzLmdldChzdHJJbmRleCkgITtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGxocykpIHtcbiAgICAgIGlmIChyaHMgPT09ICdsZW5ndGgnKSB7XG4gICAgICAgIHJldHVybiBsaHMubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChyaHMgPT09ICdzbGljZScpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVNsaWNlQnVpbHRpbkZuKG5vZGUsIGxocyk7XG4gICAgICB9IGVsc2UgaWYgKHJocyA9PT0gJ2NvbmNhdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheUNvbmNhdEJ1aWx0aW5Gbihub2RlLCBsaHMpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiByaHMgIT09ICdudW1iZXInIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKHJocykpIHtcbiAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChyaHMgPCAwIHx8IHJocyA+PSBsaHMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5kZXggb3V0IG9mIGJvdW5kczogJHtyaHN9IHZzICR7bGhzLmxlbmd0aH1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaHNbcmhzXTtcbiAgICB9IGVsc2UgaWYgKGxocyBpbnN0YW5jZW9mIFJlZmVyZW5jZSkge1xuICAgICAgY29uc3QgcmVmID0gbGhzLm5vZGU7XG4gICAgICBpZiAodGhpcy5ob3N0LmlzQ2xhc3MocmVmKSkge1xuICAgICAgICBjb25zdCBtb2R1bGUgPSBvd25pbmdNb2R1bGUoY29udGV4dCwgbGhzLmJlc3RHdWVzc093bmluZ01vZHVsZSk7XG4gICAgICAgIGxldCB2YWx1ZTogUmVzb2x2ZWRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbWVtYmVyID0gdGhpcy5ob3N0LmdldE1lbWJlcnNPZkNsYXNzKHJlZikuZmluZChcbiAgICAgICAgICAgIG1lbWJlciA9PiBtZW1iZXIuaXNTdGF0aWMgJiYgbWVtYmVyLm5hbWUgPT09IHN0ckluZGV4KTtcbiAgICAgICAgaWYgKG1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG1lbWJlci52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihtZW1iZXIudmFsdWUsIGNvbnRleHQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWVtYmVyLmltcGxlbWVudGF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG5ldyBSZWZlcmVuY2UobWVtYmVyLmltcGxlbWVudGF0aW9uLCBtb2R1bGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWVtYmVyLm5vZGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3IFJlZmVyZW5jZShtZW1iZXIubm9kZSwgbW9kdWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChpc0RlY2xhcmF0aW9uKHJlZikpIHtcbiAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KFxuICAgICAgICAgICAgbm9kZSwgRHluYW1pY1ZhbHVlLmZyb21FeHRlcm5hbFJlZmVyZW5jZShyZWYsIGxocyBhcyBSZWZlcmVuY2U8dHMuRGVjbGFyYXRpb24+KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChsaHMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBsaHMpO1xuICAgIH1cblxuICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbVVua25vd24obm9kZSk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0Q2FsbEV4cHJlc3Npb24obm9kZTogdHMuQ2FsbEV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBsaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIGlmIChsaHMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBsaHMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBjYWxsIHJlZmVycyB0byBhIGJ1aWx0aW4gZnVuY3Rpb24sIGF0dGVtcHQgdG8gZXZhbHVhdGUgdGhlIGZ1bmN0aW9uLlxuICAgIGlmIChsaHMgaW5zdGFuY2VvZiBCdWlsdGluRm4pIHtcbiAgICAgIHJldHVybiBsaHMuZXZhbHVhdGUodGhpcy5ldmFsdWF0ZUZ1bmN0aW9uQXJndW1lbnRzKG5vZGUsIGNvbnRleHQpKTtcbiAgICB9XG5cbiAgICBpZiAoIShsaHMgaW5zdGFuY2VvZiBSZWZlcmVuY2UpKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21JbnZhbGlkRXhwcmVzc2lvblR5cGUobm9kZS5leHByZXNzaW9uLCBsaHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGZuID0gdGhpcy5ob3N0LmdldERlZmluaXRpb25PZkZ1bmN0aW9uKGxocy5ub2RlKTtcbiAgICBpZiAoZm4gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUludmFsaWRFeHByZXNzaW9uVHlwZShub2RlLmV4cHJlc3Npb24sIGxocyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGZ1bmN0aW9uIGNvcnJlc3BvbmRzIHdpdGggYSB0c2xpYiBoZWxwZXIgZnVuY3Rpb24sIGV2YWx1YXRlIGl0IHdpdGggY3VzdG9tIGxvZ2ljLlxuICAgIGlmIChmbi5oZWxwZXIgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmV2YWx1YXRlRnVuY3Rpb25Bcmd1bWVudHMobm9kZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZXZhbHVhdGVUc0hlbHBlcklubGluZShmbi5oZWxwZXIsIG5vZGUsIGFyZ3MpO1xuICAgIH1cblxuICAgIGlmICghaXNGdW5jdGlvbk9yTWV0aG9kUmVmZXJlbmNlKGxocykpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUludmFsaWRFeHByZXNzaW9uVHlwZShub2RlLmV4cHJlc3Npb24sIGxocyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGZ1bmN0aW9uIGlzIGZvcmVpZ24gKGRlY2xhcmVkIHRocm91Z2ggYSBkLnRzIGZpbGUpLCBhdHRlbXB0IHRvIHJlc29sdmUgaXQgd2l0aCB0aGVcbiAgICAvLyBmb3JlaWduRnVuY3Rpb25SZXNvbHZlciwgaWYgb25lIGlzIHNwZWNpZmllZC5cbiAgICBpZiAoZm4uYm9keSA9PT0gbnVsbCkge1xuICAgICAgbGV0IGV4cHI6IHRzLkV4cHJlc3Npb258bnVsbCA9IG51bGw7XG4gICAgICBpZiAoY29udGV4dC5mb3JlaWduRnVuY3Rpb25SZXNvbHZlcikge1xuICAgICAgICBleHByID0gY29udGV4dC5mb3JlaWduRnVuY3Rpb25SZXNvbHZlcihsaHMsIG5vZGUuYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChleHByID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChcbiAgICAgICAgICAgIG5vZGUsIER5bmFtaWNWYWx1ZS5mcm9tRXh0ZXJuYWxSZWZlcmVuY2Uobm9kZS5leHByZXNzaW9uLCBsaHMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIGZ1bmN0aW9uIGlzIGRlY2xhcmVkIGluIGEgZGlmZmVyZW50IGZpbGUsIHJlc29sdmUgdGhlIGZvcmVpZ24gZnVuY3Rpb24gZXhwcmVzc2lvblxuICAgICAgLy8gdXNpbmcgdGhlIGFic29sdXRlIG1vZHVsZSBuYW1lIG9mIHRoYXQgZmlsZSAoaWYgYW55KS5cbiAgICAgIGlmIChsaHMuYmVzdEd1ZXNzT3duaW5nTW9kdWxlICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSB7XG4gICAgICAgICAgLi4uY29udGV4dCxcbiAgICAgICAgICBhYnNvbHV0ZU1vZHVsZU5hbWU6IGxocy5iZXN0R3Vlc3NPd25pbmdNb2R1bGUuc3BlY2lmaWVyLFxuICAgICAgICAgIHJlc29sdXRpb25Db250ZXh0OiBub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzID0gdGhpcy52aXNpdEV4cHJlc3Npb24oZXhwciwgY29udGV4dCk7XG4gICAgICBpZiAocmVzIGluc3RhbmNlb2YgUmVmZXJlbmNlKSB7XG4gICAgICAgIC8vIFRoaXMgUmVmZXJlbmNlIHdhcyBjcmVhdGVkIHN5bnRoZXRpY2FsbHksIHZpYSBhIGZvcmVpZ24gZnVuY3Rpb24gcmVzb2x2ZXIuIFRoZSByZWFsXG4gICAgICAgIC8vIHJ1bnRpbWUgdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIGV4cHJlc3Npb24gbWF5IGJlIGRpZmZlcmVudCB0aGFuIHRoZSBmb3JlaWduIGZ1bmN0aW9uXG4gICAgICAgIC8vIHJlc29sdmVkIHZhbHVlLCBzbyBtYXJrIHRoZSBSZWZlcmVuY2UgYXMgc3ludGhldGljIHRvIGF2b2lkIGl0IGJlaW5nIG1pc2ludGVycHJldGVkLlxuICAgICAgICByZXMuc3ludGhldGljID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgY29uc3QgYm9keSA9IGZuLmJvZHk7XG4gICAgaWYgKGJvZHkubGVuZ3RoICE9PSAxIHx8ICF0cy5pc1JldHVyblN0YXRlbWVudChib2R5WzBdKSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihub2RlKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gYm9keVswXSBhcyB0cy5SZXR1cm5TdGF0ZW1lbnQ7XG5cbiAgICBjb25zdCBhcmdzID0gdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uQXJndW1lbnRzKG5vZGUsIGNvbnRleHQpO1xuICAgIGNvbnN0IG5ld1Njb3BlOiBTY29wZSA9IG5ldyBNYXA8dHMuUGFyYW1ldGVyRGVjbGFyYXRpb24sIFJlc29sdmVkVmFsdWU+KCk7XG4gICAgY29uc3QgY2FsbGVlQ29udGV4dCA9IHsuLi5jb250ZXh0LCBzY29wZTogbmV3U2NvcGV9O1xuICAgIGZuLnBhcmFtZXRlcnMuZm9yRWFjaCgocGFyYW0sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgYXJnID0gYXJnc1tpbmRleF07XG4gICAgICBpZiAocGFyYW0ubm9kZS5kb3REb3REb3RUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFyZyA9IGFyZ3Muc2xpY2UoaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkICYmIHBhcmFtLmluaXRpYWxpemVyICE9PSBudWxsKSB7XG4gICAgICAgIGFyZyA9IHRoaXMudmlzaXRFeHByZXNzaW9uKHBhcmFtLmluaXRpYWxpemVyLCBjYWxsZWVDb250ZXh0KTtcbiAgICAgIH1cbiAgICAgIG5ld1Njb3BlLnNldChwYXJhbS5ub2RlLCBhcmcpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldC5leHByZXNzaW9uICE9PSB1bmRlZmluZWQgPyB0aGlzLnZpc2l0RXhwcmVzc2lvbihyZXQuZXhwcmVzc2lvbiwgY2FsbGVlQ29udGV4dCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdENvbmRpdGlvbmFsRXhwcmVzc2lvbihub2RlOiB0cy5Db25kaXRpb25hbEV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5jb25kaXRpb24sIGNvbnRleHQpO1xuICAgIGlmIChjb25kaXRpb24gaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBjb25kaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLndoZW5UcnVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUud2hlbkZhbHNlLCBjb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZpc2l0UHJlZml4VW5hcnlFeHByZXNzaW9uKG5vZGU6IHRzLlByZWZpeFVuYXJ5RXhwcmVzc2lvbiwgY29udGV4dDogQ29udGV4dCk6XG4gICAgICBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBvcGVyYXRvcktpbmQgPSBub2RlLm9wZXJhdG9yO1xuICAgIGlmICghVU5BUllfT1BFUkFUT1JTLmhhcyhvcGVyYXRvcktpbmQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHByZWZpeCB1bmFyeSBvcGVyYXRvcjogJHt0cy5TeW50YXhLaW5kW29wZXJhdG9yS2luZF19YCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3AgPSBVTkFSWV9PUEVSQVRPUlMuZ2V0KG9wZXJhdG9yS2luZCkgITtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUub3BlcmFuZCwgY29udGV4dCk7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3AodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRCaW5hcnlFeHByZXNzaW9uKG5vZGU6IHRzLkJpbmFyeUV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCB0b2tlbktpbmQgPSBub2RlLm9wZXJhdG9yVG9rZW4ua2luZDtcbiAgICBpZiAoIUJJTkFSWV9PUEVSQVRPUlMuaGFzKHRva2VuS2luZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgYmluYXJ5IG9wZXJhdG9yOiAke3RzLlN5bnRheEtpbmRbdG9rZW5LaW5kXX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcFJlY29yZCA9IEJJTkFSWV9PUEVSQVRPUlMuZ2V0KHRva2VuS2luZCkgITtcbiAgICBsZXQgbGhzOiBSZXNvbHZlZFZhbHVlLCByaHM6IFJlc29sdmVkVmFsdWU7XG4gICAgaWYgKG9wUmVjb3JkLmxpdGVyYWwpIHtcbiAgICAgIGxocyA9IGxpdGVyYWwodGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5sZWZ0LCBjb250ZXh0KSk7XG4gICAgICByaHMgPSBsaXRlcmFsKHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUucmlnaHQsIGNvbnRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGhzID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5sZWZ0LCBjb250ZXh0KTtcbiAgICAgIHJocyA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUucmlnaHQsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAobGhzIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgbGhzKTtcbiAgICB9IGVsc2UgaWYgKHJocyBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHJocyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcFJlY29yZC5vcChsaHMsIHJocyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGU6IHRzLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTpcbiAgICAgIFJlc29sdmVkVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUZ1bmN0aW9uQXJndW1lbnRzKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZUFycmF5IHtcbiAgICBjb25zdCBhcmdzOiBSZXNvbHZlZFZhbHVlQXJyYXkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBub2RlLmFyZ3VtZW50cykge1xuICAgICAgaWYgKHRzLmlzU3ByZWFkRWxlbWVudChhcmcpKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLnZpc2l0U3ByZWFkRWxlbWVudChhcmcsIGNvbnRleHQpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLnZpc2l0RXhwcmVzc2lvbihhcmcsIGNvbnRleHQpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0U3ByZWFkRWxlbWVudChub2RlOiB0cy5TcHJlYWRFbGVtZW50LCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZUFycmF5IHtcbiAgICBjb25zdCBzcHJlYWQgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIGlmIChzcHJlYWQgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBbRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZS5leHByZXNzaW9uLCBzcHJlYWQpXTtcbiAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KHNwcmVhZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCB2YWx1ZSBpbiBzcHJlYWQgZXhwcmVzc2lvbjogJHtzcHJlYWR9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzcHJlYWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmdOYW1lRnJvbVByb3BlcnR5TmFtZShub2RlOiB0cy5Qcm9wZXJ0eU5hbWUsIGNvbnRleHQ6IENvbnRleHQpOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpIHx8IHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlKSB8fCB0cy5pc051bWVyaWNMaXRlcmFsKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZS50ZXh0O1xuICAgIH0gZWxzZSB7ICAvLyB0cy5Db21wdXRlZFByb3BlcnR5TmFtZVxuICAgICAgY29uc3QgbGl0ZXJhbCA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgICByZXR1cm4gdHlwZW9mIGxpdGVyYWwgPT09ICdzdHJpbmcnID8gbGl0ZXJhbCA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFJlZmVyZW5jZShub2RlOiB0cy5EZWNsYXJhdGlvbiwgY29udGV4dDogQ29udGV4dCk6IFJlZmVyZW5jZSB7XG4gICAgcmV0dXJuIG5ldyBSZWZlcmVuY2Uobm9kZSwgb3duaW5nTW9kdWxlKGNvbnRleHQpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uT3JNZXRob2RSZWZlcmVuY2UocmVmOiBSZWZlcmVuY2U8dHMuTm9kZT4pOlxuICAgIHJlZiBpcyBSZWZlcmVuY2U8dHMuRnVuY3Rpb25EZWNsYXJhdGlvbnx0cy5NZXRob2REZWNsYXJhdGlvbnx0cy5GdW5jdGlvbkV4cHJlc3Npb24+IHtcbiAgcmV0dXJuIHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihyZWYubm9kZSkgfHwgdHMuaXNNZXRob2REZWNsYXJhdGlvbihyZWYubm9kZSkgfHxcbiAgICAgIHRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKHJlZi5ub2RlKTtcbn1cblxuZnVuY3Rpb24gbGl0ZXJhbCh2YWx1ZTogUmVzb2x2ZWRWYWx1ZSk6IGFueSB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBWYWx1ZSAke3ZhbHVlfSBpcyBub3QgbGl0ZXJhbCBhbmQgY2Fubm90IGJlIHVzZWQgaW4gdGhpcyBjb250ZXh0LmApO1xufVxuXG5mdW5jdGlvbiBpc1ZhcmlhYmxlRGVjbGFyYXRpb25EZWNsYXJlZChub2RlOiB0cy5WYXJpYWJsZURlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gIGlmIChub2RlLnBhcmVudCA9PT0gdW5kZWZpbmVkIHx8ICF0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KG5vZGUucGFyZW50KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBkZWNsTGlzdCA9IG5vZGUucGFyZW50O1xuICBpZiAoZGVjbExpc3QucGFyZW50ID09PSB1bmRlZmluZWQgfHwgIXRzLmlzVmFyaWFibGVTdGF0ZW1lbnQoZGVjbExpc3QucGFyZW50KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCB2YXJTdG10ID0gZGVjbExpc3QucGFyZW50O1xuICByZXR1cm4gdmFyU3RtdC5tb2RpZmllcnMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgdmFyU3RtdC5tb2RpZmllcnMuc29tZShtb2QgPT4gbW9kLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRGVjbGFyZUtleXdvcmQpO1xufVxuXG5jb25zdCBFTVBUWSA9IHt9O1xuXG5mdW5jdGlvbiBqb2luTW9kdWxlQ29udGV4dChleGlzdGluZzogQ29udGV4dCwgbm9kZTogdHMuTm9kZSwgZGVjbDogRGVjbGFyYXRpb24pOiB7XG4gIGFic29sdXRlTW9kdWxlTmFtZT86IHN0cmluZyxcbiAgcmVzb2x1dGlvbkNvbnRleHQ/OiBzdHJpbmcsXG59IHtcbiAgaWYgKGRlY2wudmlhTW9kdWxlICE9PSBudWxsICYmIGRlY2wudmlhTW9kdWxlICE9PSBleGlzdGluZy5hYnNvbHV0ZU1vZHVsZU5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWJzb2x1dGVNb2R1bGVOYW1lOiBkZWNsLnZpYU1vZHVsZSxcbiAgICAgIHJlc29sdXRpb25Db250ZXh0OiBub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBFTVBUWTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvd25pbmdNb2R1bGUoY29udGV4dDogQ29udGV4dCwgb3ZlcnJpZGU6IE93bmluZ01vZHVsZSB8IG51bGwgPSBudWxsKTogT3duaW5nTW9kdWxlfG51bGwge1xuICBsZXQgc3BlY2lmaWVyID0gY29udGV4dC5hYnNvbHV0ZU1vZHVsZU5hbWU7XG4gIGlmIChvdmVycmlkZSAhPT0gbnVsbCkge1xuICAgIHNwZWNpZmllciA9IG92ZXJyaWRlLnNwZWNpZmllcjtcbiAgfVxuICBpZiAoc3BlY2lmaWVyICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNwZWNpZmllcixcbiAgICAgIHJlc29sdXRpb25Db250ZXh0OiBjb250ZXh0LnJlc29sdXRpb25Db250ZXh0LFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==
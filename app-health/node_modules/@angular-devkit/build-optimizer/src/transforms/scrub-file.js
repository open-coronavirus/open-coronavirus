"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
const ast_utils_1 = require("../helpers/ast-utils");
/**
 * @deprecated From 0.9.0
 */
function testScrubFile(content) {
    const markers = [
        'decorators',
        '__decorate',
        'propDecorators',
        'ctorParameters',
    ];
    return markers.some((marker) => content.indexOf(marker) !== -1);
}
exports.testScrubFile = testScrubFile;
function getScrubFileTransformer(program) {
    return scrubFileTransformer(program.getTypeChecker(), false);
}
exports.getScrubFileTransformer = getScrubFileTransformer;
function getScrubFileTransformerForCore(program) {
    return scrubFileTransformer(program.getTypeChecker(), true);
}
exports.getScrubFileTransformerForCore = getScrubFileTransformerForCore;
function scrubFileTransformer(checker, isAngularCoreFile) {
    return (context) => {
        const transformer = (sf) => {
            const ngMetadata = findAngularMetadata(sf, isAngularCoreFile);
            const tslibImports = findTslibImports(sf);
            const nodes = [];
            ts.forEachChild(sf, checkNodeForDecorators);
            function checkNodeForDecorators(node) {
                if (node.kind !== ts.SyntaxKind.ExpressionStatement) {
                    // TS 2.4 nests decorators inside downleveled class IIFEs, so we
                    // must recurse into them to find the relevant expression statements.
                    return ts.forEachChild(node, checkNodeForDecorators);
                }
                const exprStmt = node;
                if (isDecoratorAssignmentExpression(exprStmt)) {
                    nodes.push(...pickDecorationNodesToRemove(exprStmt, ngMetadata, checker));
                }
                else if (isDecorateAssignmentExpression(exprStmt, tslibImports, checker)
                    || isAngularDecoratorExpression(exprStmt, ngMetadata, tslibImports, checker)) {
                    nodes.push(...pickDecorateNodesToRemove(exprStmt, tslibImports, ngMetadata, checker));
                }
                else if (isPropDecoratorAssignmentExpression(exprStmt)) {
                    nodes.push(...pickPropDecorationNodesToRemove(exprStmt, ngMetadata, checker));
                }
                else if (isCtorParamsAssignmentExpression(exprStmt)) {
                    nodes.push(node);
                }
            }
            const visitor = (node) => {
                // Check if node is a statement to be dropped.
                if (nodes.find((n) => n === node)) {
                    return undefined;
                }
                // Otherwise return node as is.
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitNode(sf, visitor);
        };
        return transformer;
    };
}
function expect(node, kind) {
    if (node.kind !== kind) {
        throw new Error('Invalid node type.');
    }
    return node;
}
exports.expect = expect;
function findAngularMetadata(node, isAngularCoreFile) {
    let specs = [];
    // Find all specifiers from imports of `@angular/core`.
    ts.forEachChild(node, (child) => {
        if (child.kind === ts.SyntaxKind.ImportDeclaration) {
            const importDecl = child;
            if (isAngularCoreImport(importDecl, isAngularCoreFile)) {
                specs.push(...ast_utils_1.collectDeepNodes(importDecl, ts.SyntaxKind.ImportSpecifier));
            }
        }
    });
    // If the current module is a Angular core file, we also consider all declarations in it to
    // potentially be Angular metadata.
    if (isAngularCoreFile) {
        const localDecl = findAllDeclarations(node);
        specs = specs.concat(localDecl);
    }
    return specs;
}
function findAllDeclarations(node) {
    const nodes = [];
    ts.forEachChild(node, (child) => {
        if (child.kind === ts.SyntaxKind.VariableStatement) {
            const vStmt = child;
            vStmt.declarationList.declarations.forEach((decl) => {
                if (decl.name.kind !== ts.SyntaxKind.Identifier) {
                    return;
                }
                nodes.push(decl);
            });
        }
    });
    return nodes;
}
function isAngularCoreImport(node, isAngularCoreFile) {
    if (!(node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier))) {
        return false;
    }
    const importText = node.moduleSpecifier.text;
    // Imports to `@angular/core` are always core imports.
    if (importText === '@angular/core') {
        return true;
    }
    // Relative imports from a Angular core file are also core imports.
    if (isAngularCoreFile && (importText.startsWith('./') || importText.startsWith('../'))) {
        return true;
    }
    return false;
}
// Check if assignment is `Clazz.decorators = [...];`.
function isDecoratorAssignmentExpression(exprStmt) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    const propAccess = expr.left;
    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    if (propAccess.name.text !== 'decorators') {
        return false;
    }
    if (expr.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
        return false;
    }
    if (expr.right.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    return true;
}
// Check if assignment is `Clazz = __decorate([...], Clazz)`.
function isDecorateAssignmentExpression(exprStmt, tslibImports, checker) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const classIdent = expr.left;
    let callExpr;
    if (expr.right.kind === ts.SyntaxKind.CallExpression) {
        callExpr = expr.right;
    }
    else if (expr.right.kind === ts.SyntaxKind.BinaryExpression) {
        // `Clazz = Clazz_1 = __decorate([...], Clazz)` can be found when there are static property
        // accesses.
        const innerExpr = expr.right;
        if (innerExpr.left.kind !== ts.SyntaxKind.Identifier
            || innerExpr.right.kind !== ts.SyntaxKind.CallExpression) {
            return false;
        }
        callExpr = innerExpr.right;
    }
    else {
        return false;
    }
    if (!isTslibHelper(callExpr, '__decorate', tslibImports, checker)) {
        return false;
    }
    if (callExpr.arguments.length !== 2) {
        return false;
    }
    if (callExpr.arguments[1].kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const classArg = callExpr.arguments[1];
    if (classIdent.text !== classArg.text) {
        return false;
    }
    if (callExpr.arguments[0].kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    return true;
}
// Check if expression is `__decorate([smt, __metadata("design:type", Object)], ...)`.
function isAngularDecoratorExpression(exprStmt, ngMetadata, tslibImports, checker) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.CallExpression) {
        return false;
    }
    const callExpr = exprStmt.expression;
    if (!isTslibHelper(callExpr, '__decorate', tslibImports, checker)) {
        return false;
    }
    if (callExpr.arguments.length !== 4) {
        return false;
    }
    if (callExpr.arguments[0].kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    const decorateArray = callExpr.arguments[0];
    // Check first array entry for Angular decorators.
    if (decorateArray.elements.length === 0 || !ts.isCallExpression(decorateArray.elements[0])) {
        return false;
    }
    return decorateArray.elements.some(decoratorCall => {
        if (!ts.isCallExpression(decoratorCall) || !ts.isIdentifier(decoratorCall.expression)) {
            return false;
        }
        const decoratorId = decoratorCall.expression;
        return identifierIsMetadata(decoratorId, ngMetadata, checker);
    });
}
// Check if assignment is `Clazz.propDecorators = [...];`.
function isPropDecoratorAssignmentExpression(exprStmt) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    const propAccess = expr.left;
    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    if (propAccess.name.text !== 'propDecorators') {
        return false;
    }
    if (expr.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
        return false;
    }
    if (expr.right.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
        return false;
    }
    return true;
}
// Check if assignment is `Clazz.ctorParameters = [...];`.
function isCtorParamsAssignmentExpression(exprStmt) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    const propAccess = expr.left;
    if (propAccess.name.text !== 'ctorParameters') {
        return false;
    }
    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    if (expr.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
        return false;
    }
    if (expr.right.kind !== ts.SyntaxKind.FunctionExpression
        && expr.right.kind !== ts.SyntaxKind.ArrowFunction) {
        return false;
    }
    return true;
}
// Remove Angular decorators from`Clazz.decorators = [...];`, or expression itself if all are
// removed.
function pickDecorationNodesToRemove(exprStmt, ngMetadata, checker) {
    const expr = expect(exprStmt.expression, ts.SyntaxKind.BinaryExpression);
    const literal = expect(expr.right, ts.SyntaxKind.ArrayLiteralExpression);
    if (!literal.elements.every((elem) => elem.kind === ts.SyntaxKind.ObjectLiteralExpression)) {
        return [];
    }
    const elements = literal.elements;
    const ngDecorators = elements.filter((elem) => isAngularDecorator(elem, ngMetadata, checker));
    return (elements.length > ngDecorators.length) ? ngDecorators : [exprStmt];
}
// Remove Angular decorators from `Clazz = __decorate([...], Clazz)`, or expression itself if all
// are removed.
function pickDecorateNodesToRemove(exprStmt, tslibImports, ngMetadata, checker) {
    let callExpr;
    if (ts.isCallExpression(exprStmt.expression)) {
        callExpr = exprStmt.expression;
    }
    else if (ts.isBinaryExpression(exprStmt.expression)) {
        const expr = exprStmt.expression;
        if (ts.isCallExpression(expr.right)) {
            callExpr = expr.right;
        }
        else if (ts.isBinaryExpression(expr.right) && ts.isCallExpression(expr.right.right)) {
            callExpr = expr.right.right;
        }
    }
    if (!callExpr) {
        return [];
    }
    const arrLiteral = expect(callExpr.arguments[0], ts.SyntaxKind.ArrayLiteralExpression);
    if (!arrLiteral.elements.every((elem) => elem.kind === ts.SyntaxKind.CallExpression)) {
        return [];
    }
    const elements = arrLiteral.elements;
    const ngDecoratorCalls = elements.filter((el) => {
        if (el.expression.kind !== ts.SyntaxKind.Identifier) {
            return false;
        }
        const id = el.expression;
        return identifierIsMetadata(id, ngMetadata, checker);
    });
    // Remove __metadata calls of type 'design:paramtypes'.
    const metadataCalls = elements.filter((el) => {
        if (!isTslibHelper(el, '__metadata', tslibImports, checker)) {
            return false;
        }
        if (el.arguments.length < 2) {
            return false;
        }
        if (el.arguments[0].kind !== ts.SyntaxKind.StringLiteral) {
            return false;
        }
        return true;
    });
    // Remove all __param calls.
    const paramCalls = elements.filter((el) => {
        if (!isTslibHelper(el, '__param', tslibImports, checker)) {
            return false;
        }
        if (el.arguments.length != 2) {
            return false;
        }
        if (el.arguments[0].kind !== ts.SyntaxKind.NumericLiteral) {
            return false;
        }
        return true;
    });
    ngDecoratorCalls.push(...metadataCalls, ...paramCalls);
    // If all decorators are metadata decorators then return the whole `Class = __decorate([...])'`
    // statement so that it is removed in entirety
    return (elements.length === ngDecoratorCalls.length) ? [exprStmt] : ngDecoratorCalls;
}
// Remove Angular decorators from`Clazz.propDecorators = [...];`, or expression itself if all
// are removed.
function pickPropDecorationNodesToRemove(exprStmt, ngMetadata, checker) {
    const expr = expect(exprStmt.expression, ts.SyntaxKind.BinaryExpression);
    const literal = expect(expr.right, ts.SyntaxKind.ObjectLiteralExpression);
    if (!literal.properties.every((elem) => elem.kind === ts.SyntaxKind.PropertyAssignment &&
        elem.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression)) {
        return [];
    }
    const assignments = literal.properties;
    // Consider each assignment individually. Either the whole assignment will be removed or
    // a particular decorator within will.
    const toRemove = assignments
        .map((assign) => {
        const decorators = expect(assign.initializer, ts.SyntaxKind.ArrayLiteralExpression).elements;
        if (!decorators.every((el) => el.kind === ts.SyntaxKind.ObjectLiteralExpression)) {
            return [];
        }
        const decsToRemove = decorators.filter((expression) => {
            const lit = expect(expression, ts.SyntaxKind.ObjectLiteralExpression);
            return isAngularDecorator(lit, ngMetadata, checker);
        });
        if (decsToRemove.length === decorators.length) {
            return [assign];
        }
        return decsToRemove;
    })
        .reduce((accum, toRm) => accum.concat(toRm), []);
    // If every node to be removed is a property assignment (full property's decorators) and
    // all properties are accounted for, remove the whole assignment. Otherwise, remove the
    // nodes which were marked as safe.
    if (toRemove.length === assignments.length &&
        toRemove.every((node) => node.kind === ts.SyntaxKind.PropertyAssignment)) {
        return [exprStmt];
    }
    return toRemove;
}
function isAngularDecorator(literal, ngMetadata, checker) {
    const types = literal.properties.filter(isTypeProperty);
    if (types.length !== 1) {
        return false;
    }
    const assign = expect(types[0], ts.SyntaxKind.PropertyAssignment);
    if (assign.initializer.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const id = assign.initializer;
    const res = identifierIsMetadata(id, ngMetadata, checker);
    return res;
}
function isTypeProperty(prop) {
    if (prop.kind !== ts.SyntaxKind.PropertyAssignment) {
        return false;
    }
    const assignment = prop;
    if (assignment.name.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const name = assignment.name;
    return name.text === 'type';
}
// Check if an identifier is part of the known Angular Metadata.
function identifierIsMetadata(id, metadata, checker) {
    const symbol = checker.getSymbolAtLocation(id);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        return false;
    }
    return symbol
        .declarations
        .some((spec) => metadata.indexOf(spec) !== -1);
}
// Check if an import is a tslib helper import (`import * as tslib from "tslib";`)
function isTslibImport(node) {
    return !!(node.moduleSpecifier &&
        node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral &&
        node.moduleSpecifier.text === 'tslib' &&
        node.importClause &&
        node.importClause.namedBindings &&
        node.importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport);
}
// Find all namespace imports for `tslib`.
function findTslibImports(node) {
    const imports = [];
    ts.forEachChild(node, (child) => {
        if (child.kind === ts.SyntaxKind.ImportDeclaration) {
            const importDecl = child;
            if (isTslibImport(importDecl)) {
                const importClause = importDecl.importClause;
                const namespaceImport = importClause.namedBindings;
                imports.push(namespaceImport);
            }
        }
    });
    return imports;
}
// Check if an identifier is part of the known tslib identifiers.
function identifierIsTslib(id, tslibImports, checker) {
    const symbol = checker.getSymbolAtLocation(id);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        return false;
    }
    return symbol
        .declarations
        .some((spec) => tslibImports.indexOf(spec) !== -1);
}
// Check if a function call is a tslib helper.
function isTslibHelper(callExpr, helper, tslibImports, checker) {
    let callExprIdent = callExpr.expression;
    if (callExpr.expression.kind !== ts.SyntaxKind.Identifier) {
        if (callExpr.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propAccess = callExpr.expression;
            const left = propAccess.expression;
            callExprIdent = propAccess.name;
            if (left.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }
            const id = left;
            if (!identifierIsTslib(id, tslibImports, checker)) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    // node.text on a name that starts with two underscores will return three instead.
    // Unless it's an expression like tslib.__decorate, in which case it's only 2.
    if (callExprIdent.text !== `_${helper}` && callExprIdent.text !== helper) {
        return false;
    }
    return true;
}

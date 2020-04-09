/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/util" />
import { Expression, R3DependencyMetadata, R3Reference, WrappedNodeExpr } from '@angular/compiler';
import * as ts from 'typescript';
import { DefaultImportRecorder, Reference, ReferenceEmitter } from '../../imports';
import { ForeignFunctionResolver, PartialEvaluator } from '../../partial_evaluator';
import { ClassDeclaration, CtorParameter, Decorator, Import, ReflectionHost, TypeValueReference } from '../../reflection';
export declare enum ConstructorDepErrorKind {
    NO_SUITABLE_TOKEN = 0
}
export declare type ConstructorDeps = {
    deps: R3DependencyMetadata[];
} | {
    deps: null;
    errors: ConstructorDepError[];
};
export interface ConstructorDepError {
    index: number;
    param: CtorParameter;
    kind: ConstructorDepErrorKind;
}
export declare function getConstructorDependencies(clazz: ClassDeclaration, reflector: ReflectionHost, defaultImportRecorder: DefaultImportRecorder, isCore: boolean): ConstructorDeps | null;
/**
 * Convert a `TypeValueReference` to an `Expression` which refers to the type as a value.
 *
 * Local references are converted to a `WrappedNodeExpr` of the TypeScript expression, and non-local
 * references are converted to an `ExternalExpr`. Note that this is only valid in the context of the
 * file in which the `TypeValueReference` originated.
 */
export declare function valueReferenceToExpression(valueRef: TypeValueReference, defaultImportRecorder: DefaultImportRecorder): Expression;
export declare function valueReferenceToExpression(valueRef: null, defaultImportRecorder: DefaultImportRecorder): null;
export declare function valueReferenceToExpression(valueRef: TypeValueReference | null, defaultImportRecorder: DefaultImportRecorder): Expression | null;
export declare function getValidConstructorDependencies(clazz: ClassDeclaration, reflector: ReflectionHost, defaultImportRecorder: DefaultImportRecorder, isCore: boolean): R3DependencyMetadata[] | null;
export declare function validateConstructorDependencies(clazz: ClassDeclaration, deps: ConstructorDeps | null): R3DependencyMetadata[] | null;
export declare function toR3Reference(valueRef: Reference, typeRef: Reference, valueContext: ts.SourceFile, typeContext: ts.SourceFile, refEmitter: ReferenceEmitter): R3Reference;
export declare function isAngularCore(decorator: Decorator): decorator is Decorator & {
    import: Import;
};
export declare function isAngularCoreReference(reference: Reference, symbolName: string): boolean;
export declare function findAngularDecorator(decorators: Decorator[], name: string, isCore: boolean): Decorator | undefined;
export declare function isAngularDecorator(decorator: Decorator, name: string, isCore: boolean): boolean;
/**
 * Unwrap a `ts.Expression`, removing outer type-casts or parentheses until the expression is in its
 * lowest level form.
 *
 * For example, the expression "(foo as Type)" unwraps to "foo".
 */
export declare function unwrapExpression(node: ts.Expression): ts.Expression;
/**
 * Possibly resolve a forwardRef() expression into the inner value.
 *
 * @param node the forwardRef() expression to resolve
 * @param reflector a ReflectionHost
 * @returns the resolved expression, if the original expression was a forwardRef(), or the original
 * expression otherwise
 */
export declare function unwrapForwardRef(node: ts.Expression, reflector: ReflectionHost): ts.Expression;
/**
 * A foreign function resolver for `staticallyResolve` which unwraps forwardRef() expressions.
 *
 * @param ref a Reference to the declaration of the function being called (which might be
 * forwardRef)
 * @param args the arguments to the invocation of the forwardRef expression
 * @returns an unwrapped argument if `ref` pointed to forwardRef, or null otherwise
 */
export declare function forwardRefResolver(ref: Reference<ts.FunctionDeclaration | ts.MethodDeclaration | ts.FunctionExpression>, args: ReadonlyArray<ts.Expression>): ts.Expression | null;
/**
 * Combines an array of resolver functions into a one.
 * @param resolvers Resolvers to be combined.
 */
export declare function combineResolvers(resolvers: ForeignFunctionResolver[]): ForeignFunctionResolver;
export declare function isExpressionForwardReference(expr: Expression, context: ts.Node, contextSource: ts.SourceFile): boolean;
export declare function isWrappedTsNodeExpr(expr: Expression): expr is WrappedNodeExpr<ts.Node>;
export declare function readBaseClass(node: ClassDeclaration, reflector: ReflectionHost, evaluator: PartialEvaluator): Reference<ClassDeclaration> | 'dynamic' | null;

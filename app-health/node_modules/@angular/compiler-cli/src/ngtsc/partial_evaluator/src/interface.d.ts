/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interface" />
import * as ts from 'typescript';
import { Reference } from '../../imports';
import { ReflectionHost } from '../../reflection';
import { ResolvedValue } from './result';
/**
 * Implement this interface to record dependency relations between
 * source files.
 */
export interface DependencyTracker {
    trackFileDependency(dep: ts.SourceFile, src: ts.SourceFile): void;
}
export declare type ForeignFunctionResolver = (node: Reference<ts.FunctionDeclaration | ts.MethodDeclaration | ts.FunctionExpression>, args: ReadonlyArray<ts.Expression>) => ts.Expression | null;
export declare class PartialEvaluator {
    private host;
    private checker;
    private dependencyTracker?;
    constructor(host: ReflectionHost, checker: ts.TypeChecker, dependencyTracker?: DependencyTracker | undefined);
    evaluate(expr: ts.Expression, foreignFunctionResolver?: ForeignFunctionResolver): ResolvedValue;
}

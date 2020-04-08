/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/base_def" />
import { ConstantPool, R3BaseRefMetaData } from '@angular/compiler';
import { PartialEvaluator } from '../../partial_evaluator';
import { ClassDeclaration, ClassMember, Decorator, ReflectionHost } from '../../reflection';
import { AnalysisOutput, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence } from '../../transform';
export declare class BaseDefDecoratorHandler implements DecoratorHandler<R3BaseRefMetaData, R3BaseRefDecoratorDetection> {
    private reflector;
    private evaluator;
    private isCore;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, isCore: boolean);
    readonly precedence = HandlerPrecedence.WEAK;
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<R3BaseRefDecoratorDetection> | undefined;
    analyze(node: ClassDeclaration, metadata: R3BaseRefDecoratorDetection): AnalysisOutput<R3BaseRefMetaData>;
    compile(node: ClassDeclaration, analysis: R3BaseRefMetaData, pool: ConstantPool): CompileResult[] | CompileResult;
}
export interface R3BaseRefDecoratorDetection {
    inputs?: {
        property: ClassMember;
        decorator: Decorator;
    }[];
    outputs?: {
        property: ClassMember;
        decorator: Decorator;
    }[];
    viewQueries?: {
        member: ClassMember;
        decorators: Decorator[];
    }[];
    queries?: {
        member: ClassMember;
        decorators: Decorator[];
    }[];
    host?: ClassMember[];
}

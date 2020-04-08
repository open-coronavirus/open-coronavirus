/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/pipe" />
import { R3PipeMetadata, Statement } from '@angular/compiler';
import { DefaultImportRecorder } from '../../imports';
import { MetadataRegistry } from '../../metadata';
import { PartialEvaluator } from '../../partial_evaluator';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../reflection';
import { AnalysisOutput, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence } from '../../transform';
export interface PipeHandlerData {
    meta: R3PipeMetadata;
    metadataStmt: Statement | null;
}
export declare class PipeDecoratorHandler implements DecoratorHandler<PipeHandlerData, Decorator> {
    private reflector;
    private evaluator;
    private metaRegistry;
    private defaultImportRecorder;
    private isCore;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaRegistry: MetadataRegistry, defaultImportRecorder: DefaultImportRecorder, isCore: boolean);
    readonly precedence = HandlerPrecedence.PRIMARY;
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    analyze(clazz: ClassDeclaration, decorator: Decorator): AnalysisOutput<PipeHandlerData>;
    compile(node: ClassDeclaration, analysis: PipeHandlerData): CompileResult;
}

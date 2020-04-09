/// <amd-module name="@angular/compiler-cli/ngcc/src/analysis/types" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstantPool } from '@angular/compiler';
import * as ts from 'typescript';
import { ClassDeclaration, Decorator } from '../../../src/ngtsc/reflection';
import { CompileResult, DecoratorHandler } from '../../../src/ngtsc/transform';
export interface AnalyzedFile {
    sourceFile: ts.SourceFile;
    analyzedClasses: AnalyzedClass[];
}
export interface AnalyzedClass {
    name: string;
    decorators: Decorator[] | null;
    declaration: ClassDeclaration;
    diagnostics?: ts.Diagnostic[];
    matches: {
        handler: DecoratorHandler<any, any>;
        analysis: any;
    }[];
}
export interface CompiledClass extends AnalyzedClass {
    compilation: CompileResult[];
}
export interface CompiledFile {
    compiledClasses: CompiledClass[];
    sourceFile: ts.SourceFile;
    constantPool: ConstantPool;
}
export declare type DecorationAnalyses = Map<ts.SourceFile, CompiledFile>;
export declare const DecorationAnalyses: MapConstructor;
export interface MatchingHandler<A, M> {
    handler: DecoratorHandler<A, M>;
    detected: M;
}

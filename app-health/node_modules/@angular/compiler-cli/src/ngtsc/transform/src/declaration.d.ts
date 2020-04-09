/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/transform/src/declaration" />
import * as ts from 'typescript';
import { ImportRewriter } from '../../imports';
import { CompileResult } from './api';
import { IvyCompilation } from './compilation';
export declare function declarationTransformFactory(compilation: IvyCompilation): ts.TransformerFactory<ts.Bundle | ts.SourceFile>;
/**
 * Processes .d.ts file text and adds static field declarations, with types.
 */
export declare class DtsFileTransformer {
    private importRewriter;
    private ivyFields;
    private imports;
    constructor(importRewriter: ImportRewriter, importPrefix?: string);
    /**
     * Track that a static field was added to the code for a class.
     */
    recordStaticField(name: string, decls: CompileResult[]): void;
    /**
     * Transform the declaration file and add any declarations which were recorded.
     */
    transform(file: ts.SourceFile, context: ts.TransformationContext): ts.SourceFile;
}

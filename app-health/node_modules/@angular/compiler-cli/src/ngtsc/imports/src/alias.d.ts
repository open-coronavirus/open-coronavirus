/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/imports/src/alias" />
import { Expression } from '@angular/compiler';
import * as ts from 'typescript';
import { ClassDeclaration } from '../../reflection';
import { FileToModuleHost, ReferenceEmitStrategy } from './emitter';
import { ImportMode, Reference } from './references';
export declare class AliasGenerator {
    private fileToModuleHost;
    constructor(fileToModuleHost: FileToModuleHost);
    aliasSymbolName(decl: ClassDeclaration, context: ts.SourceFile): string;
    aliasTo(decl: ClassDeclaration, via: ts.SourceFile): Expression;
}
export declare class AliasStrategy implements ReferenceEmitStrategy {
    emit(ref: Reference<ts.Node>, context: ts.SourceFile, importMode: ImportMode): Expression | null;
}

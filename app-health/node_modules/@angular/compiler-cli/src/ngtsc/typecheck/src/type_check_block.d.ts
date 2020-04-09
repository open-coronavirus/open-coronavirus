/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block" />
import { BoundTarget } from '@angular/compiler';
import * as ts from 'typescript';
import { Reference } from '../../imports';
import { ClassDeclaration } from '../../reflection';
import { TypeCheckBlockMetadata, TypeCheckableDirectiveMeta } from './api';
import { Environment } from './environment';
/**
 * Given a `ts.ClassDeclaration` for a component, and metadata regarding that component, compose a
 * "type check block" function.
 *
 * When passed through TypeScript's TypeChecker, type errors that arise within the type check block
 * function indicate issues in the template itself.
 *
 * @param node the TypeScript node for the component class.
 * @param meta metadata about the component's template and the function being generated.
 * @param importManager an `ImportManager` for the file into which the TCB will be written.
 */
export declare function generateTypeCheckBlock(env: Environment, ref: Reference<ClassDeclaration<ts.ClassDeclaration>>, name: ts.Identifier, meta: TypeCheckBlockMetadata): ts.FunctionDeclaration;
/**
 * Overall generation context for the type check block.
 *
 * `Context` handles operations during code generation which are global with respect to the whole
 * block. It's responsible for variable name allocation and management of any imports needed. It
 * also contains the template metadata itself.
 */
export declare class Context {
    readonly env: Environment;
    readonly boundTarget: BoundTarget<TypeCheckableDirectiveMeta>;
    private pipes;
    private nextId;
    constructor(env: Environment, boundTarget: BoundTarget<TypeCheckableDirectiveMeta>, pipes: Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>);
    /**
     * Allocate a new variable name for use within the `Context`.
     *
     * Currently this uses a monotonically increasing counter, but in the future the variable name
     * might change depending on the type of data being stored.
     */
    allocateId(): ts.Identifier;
    getPipeByName(name: string): ts.Expression;
}
export declare function requiresInlineTypeCheckBlock(node: ClassDeclaration<ts.ClassDeclaration>): boolean;

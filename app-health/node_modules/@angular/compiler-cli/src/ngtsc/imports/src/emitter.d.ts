/// <amd-module name="@angular/compiler-cli/src/ngtsc/imports/src/emitter" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Expression } from '@angular/compiler';
import * as ts from 'typescript';
import { LogicalFileSystem } from '../../file_system';
import { ReflectionHost } from '../../reflection';
import { ImportMode, Reference } from './references';
/**
 * A host which supports an operation to convert a file name into a module name.
 *
 * This operation is typically implemented as part of the compiler host passed to ngtsc when running
 * under a build tool like Bazel or Blaze.
 */
export interface FileToModuleHost {
    fileNameToModuleName(importedFilePath: string, containingFilePath: string): string;
}
/**
 * A particular strategy for generating an expression which refers to a `Reference`.
 *
 * There are many potential ways a given `Reference` could be referred to in the context of a given
 * file. A local declaration could be available, the `Reference` could be importable via a relative
 * import within the project, or an absolute import into `node_modules` might be necessary.
 *
 * Different `ReferenceEmitStrategy` implementations implement specific logic for generating such
 * references. A single strategy (such as using a local declaration) may not always be able to
 * generate an expression for every `Reference` (for example, if no local identifier is available),
 * and may return `null` in such a case.
 */
export interface ReferenceEmitStrategy {
    /**
     * Emit an `Expression` which refers to the given `Reference` in the context of a particular
     * source file, if possible.
     *
     * @param ref the `Reference` for which to generate an expression
     * @param context the source file in which the `Expression` must be valid
     * @param importMode a flag which controls whether imports should be generated or not
     * @returns an `Expression` which refers to the `Reference`, or `null` if none can be generated
     */
    emit(ref: Reference, context: ts.SourceFile, importMode: ImportMode): Expression | null;
}
/**
 * Generates `Expression`s which refer to `Reference`s in a given context.
 *
 * A `ReferenceEmitter` uses one or more `ReferenceEmitStrategy` implementations to produce an
 * `Expression` which refers to a `Reference` in the context of a particular file.
 */
export declare class ReferenceEmitter {
    private strategies;
    constructor(strategies: ReferenceEmitStrategy[]);
    emit(ref: Reference, context: ts.SourceFile, importMode?: ImportMode): Expression;
}
/**
 * A `ReferenceEmitStrategy` which will refer to declarations by any local `ts.Identifier`s, if
 * such identifiers are available.
 */
export declare class LocalIdentifierStrategy implements ReferenceEmitStrategy {
    emit(ref: Reference<ts.Node>, context: ts.SourceFile, importMode: ImportMode): Expression | null;
}
/**
 * A `ReferenceEmitStrategy` which will refer to declarations that come from `node_modules` using
 * an absolute import.
 *
 * Part of this strategy involves looking at the target entry point and identifying the exported
 * name of the targeted declaration, as it might be different from the declared name (e.g. a
 * directive might be declared as FooDirImpl, but exported as FooDir). If no export can be found
 * which maps back to the original directive, an error is thrown.
 */
export declare class AbsoluteModuleStrategy implements ReferenceEmitStrategy {
    protected program: ts.Program;
    protected checker: ts.TypeChecker;
    protected options: ts.CompilerOptions;
    protected host: ts.CompilerHost;
    private reflectionHost;
    /**
     * A cache of the exports of specific modules, because resolving a module to its exports is a
     * costly operation.
     */
    private moduleExportsCache;
    constructor(program: ts.Program, checker: ts.TypeChecker, options: ts.CompilerOptions, host: ts.CompilerHost, reflectionHost: ReflectionHost);
    emit(ref: Reference<ts.Node>, context: ts.SourceFile, importMode: ImportMode): Expression | null;
    private resolveImportName;
    private getExportsOfModule;
    protected enumerateExportsOfModule(specifier: string, fromFile: string): Map<ts.Declaration, string> | null;
}
/**
 * A `ReferenceEmitStrategy` which will refer to declarations via relative paths, provided they're
 * both in the logical project "space" of paths.
 *
 * This is trickier than it sounds, as the two files may be in different root directories in the
 * project. Simply calculating a file system relative path between the two is not sufficient.
 * Instead, `LogicalProjectPath`s are used.
 */
export declare class LogicalProjectStrategy implements ReferenceEmitStrategy {
    private checker;
    private logicalFs;
    constructor(checker: ts.TypeChecker, logicalFs: LogicalFileSystem);
    emit(ref: Reference<ts.Node>, context: ts.SourceFile): Expression | null;
}
/**
 * A `ReferenceEmitStrategy` which uses a `FileToModuleHost` to generate absolute import references.
 */
export declare class FileToModuleStrategy implements ReferenceEmitStrategy {
    private checker;
    private fileToModuleHost;
    constructor(checker: ts.TypeChecker, fileToModuleHost: FileToModuleHost);
    emit(ref: Reference<ts.Node>, context: ts.SourceFile): Expression | null;
}

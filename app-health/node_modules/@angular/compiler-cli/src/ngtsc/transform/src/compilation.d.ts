/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/transform/src/compilation" />
import { ConstantPool } from '@angular/compiler';
import * as ts from 'typescript';
import { ImportRewriter } from '../../imports';
import { IncrementalState } from '../../incremental';
import { IndexingContext } from '../../indexer';
import { PerfRecorder } from '../../perf';
import { ReflectionHost } from '../../reflection';
import { LocalModuleScopeRegistry } from '../../scope';
import { TypeCheckContext } from '../../typecheck';
import { CompileResult, DecoratorHandler } from './api';
/**
 * Manages a compilation of Ivy decorators into static fields across an entire ts.Program.
 *
 * The compilation is stateful - source files are analyzed and records of the operations that need
 * to be performed during the transform/emit process are maintained internally.
 */
export declare class IvyCompilation {
    private handlers;
    private reflector;
    private importRewriter;
    private incrementalState;
    private perf;
    private sourceToFactorySymbols;
    private scopeRegistry;
    /**
     * Tracks classes which have been analyzed and found to have an Ivy decorator, and the
     * information recorded about them for later compilation.
     */
    private ivyClasses;
    /**
     * Tracks factory information which needs to be generated.
     */
    /**
     * Tracks the `DtsFileTransformer`s for each TS file that needs .d.ts transformations.
     */
    private dtsMap;
    private reexportMap;
    private _diagnostics;
    /**
     * @param handlers array of `DecoratorHandler`s which will be executed against each class in the
     * program
     * @param checker TypeScript `TypeChecker` instance for the program
     * @param reflector `ReflectionHost` through which all reflection operations will be performed
     * @param coreImportsFrom a TypeScript `SourceFile` which exports symbols needed for Ivy imports
     * when compiling @angular/core, or `null` if the current program is not @angular/core. This is
     * `null` in most cases.
     */
    constructor(handlers: DecoratorHandler<any, any>[], reflector: ReflectionHost, importRewriter: ImportRewriter, incrementalState: IncrementalState, perf: PerfRecorder, sourceToFactorySymbols: Map<string, Set<string>> | null, scopeRegistry: LocalModuleScopeRegistry);
    readonly exportStatements: Map<string, Map<string, [string, string]>>;
    analyzeSync(sf: ts.SourceFile): void;
    analyzeAsync(sf: ts.SourceFile): Promise<void> | undefined;
    private detectHandlersForClass;
    /**
     * Analyze a source file and produce diagnostics for it (if any).
     */
    private analyze;
    /**
     * Feeds components discovered in the compilation to a context for indexing.
     */
    index(context: IndexingContext): void;
    resolve(): void;
    private recordNgModuleScopeDependencies;
    typeCheck(context: TypeCheckContext): void;
    /**
     * Perform a compilation operation on the given class declaration and return instructions to an
     * AST transformer if any are available.
     */
    compileIvyFieldFor(node: ts.Declaration, constantPool: ConstantPool): CompileResult[] | undefined;
    /**
     * Lookup the `ts.Decorator` which triggered transformation of a particular class declaration.
     */
    ivyDecoratorsFor(node: ts.Declaration): ts.Decorator[];
    /**
     * Process a declaration file and return a transformed version that incorporates the changes
     * made to the source file.
     */
    transformedDtsFor(file: ts.SourceFile, context: ts.TransformationContext): ts.SourceFile;
    readonly diagnostics: ReadonlyArray<ts.Diagnostic>;
    private getDtsTransformer;
}

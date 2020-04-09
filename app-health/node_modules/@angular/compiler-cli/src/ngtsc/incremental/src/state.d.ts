/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/incremental/src/state" />
import * as ts from 'typescript';
import { Reference } from '../../imports';
import { DirectiveMeta, MetadataReader, MetadataRegistry, NgModuleMeta, PipeMeta } from '../../metadata';
import { DependencyTracker } from '../../partial_evaluator';
import { ClassDeclaration } from '../../reflection';
import { ResourceDependencyRecorder } from '../../util/src/resource_recorder';
/**
 * Accumulates state between compilations.
 */
export declare class IncrementalState implements DependencyTracker, MetadataReader, MetadataRegistry, ResourceDependencyRecorder {
    private unchangedFiles;
    private metadata;
    private modifiedResourceFiles;
    private constructor();
    static reconcile(previousState: IncrementalState, oldProgram: ts.Program, newProgram: ts.Program, modifiedResourceFiles: Set<string> | null): IncrementalState;
    static fresh(): IncrementalState;
    safeToSkip(sf: ts.SourceFile): boolean | Promise<boolean>;
    trackFileDependency(dep: ts.SourceFile, src: ts.SourceFile): void;
    getFileDependencies(file: ts.SourceFile): ts.SourceFile[];
    getNgModuleMetadata(ref: Reference<ClassDeclaration>): NgModuleMeta | null;
    registerNgModuleMetadata(meta: NgModuleMeta): void;
    getDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta | null;
    registerDirectiveMetadata(meta: DirectiveMeta): void;
    getPipeMetadata(ref: Reference<ClassDeclaration>): PipeMeta | null;
    registerPipeMetadata(meta: PipeMeta): void;
    recordResourceDependency(file: ts.SourceFile, resourcePath: string): void;
    private ensureMetadata;
    private hasChangedResourceDependencies;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/metadata/src/registry" />
import { Reference } from '../../imports';
import { ClassDeclaration } from '../../reflection';
import { DirectiveMeta, MetadataReader, MetadataRegistry, NgModuleMeta, PipeMeta } from './api';
/**
 * A registry of directive, pipe, and module metadata for types defined in the current compilation
 * unit, which supports both reading and registering.
 */
export declare class LocalMetadataRegistry implements MetadataRegistry, MetadataReader {
    private directives;
    private ngModules;
    private pipes;
    getDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta | null;
    getNgModuleMetadata(ref: Reference<ClassDeclaration>): NgModuleMeta | null;
    getPipeMetadata(ref: Reference<ClassDeclaration>): PipeMeta | null;
    registerDirectiveMetadata(meta: DirectiveMeta): void;
    registerNgModuleMetadata(meta: NgModuleMeta): void;
    registerPipeMetadata(meta: PipeMeta): void;
}
/**
 * A `MetadataRegistry` which registers metdata with multiple delegate `MetadataRegistry` instances.
 */
export declare class CompoundMetadataRegistry implements MetadataRegistry {
    private registries;
    constructor(registries: MetadataRegistry[]);
    registerDirectiveMetadata(meta: DirectiveMeta): void;
    registerNgModuleMetadata(meta: NgModuleMeta): void;
    registerPipeMetadata(meta: PipeMeta): void;
}

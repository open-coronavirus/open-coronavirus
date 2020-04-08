/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/scope/src/local" />
import * as ts from 'typescript';
import { AliasGenerator, Reexport, Reference, ReferenceEmitter } from '../../imports';
import { DirectiveMeta, MetadataReader, MetadataRegistry, NgModuleMeta, PipeMeta } from '../../metadata';
import { ClassDeclaration } from '../../reflection';
import { ExportScope, ScopeData } from './api';
import { DtsModuleScopeResolver } from './dependency';
export interface LocalNgModuleData {
    declarations: Reference<ClassDeclaration>[];
    imports: Reference<ClassDeclaration>[];
    exports: Reference<ClassDeclaration>[];
}
export interface LocalModuleScope extends ExportScope {
    compilation: ScopeData;
    reexports: Reexport[] | null;
}
/**
 * Information about the compilation scope of a registered declaration.
 */
export interface CompilationScope extends ScopeData {
    /** The declaration whose compilation scope is described here. */
    declaration: ClassDeclaration;
    /** The declaration of the NgModule that declares this `declaration`. */
    ngModule: ClassDeclaration;
}
/**
 * A registry which collects information about NgModules, Directives, Components, and Pipes which
 * are local (declared in the ts.Program being compiled), and can produce `LocalModuleScope`s
 * which summarize the compilation scope of a component.
 *
 * This class implements the logic of NgModule declarations, imports, and exports and can produce,
 * for a given component, the set of directives and pipes which are "visible" in that component's
 * template.
 *
 * The `LocalModuleScopeRegistry` has two "modes" of operation. During analysis, data for each
 * individual NgModule, Directive, Component, and Pipe is added to the registry. No attempt is made
 * to traverse or validate the NgModule graph (imports, exports, etc). After analysis, one of
 * `getScopeOfModule` or `getScopeForComponent` can be called, which traverses the NgModule graph
 * and applies the NgModule logic to generate a `LocalModuleScope`, the full scope for the given
 * module or component.
 *
 * The `LocalModuleScopeRegistry` is also capable of producing `ts.Diagnostic` errors when Angular
 * semantics are violated.
 */
export declare class LocalModuleScopeRegistry implements MetadataRegistry {
    private localReader;
    private dependencyScopeReader;
    private refEmitter;
    private aliasGenerator;
    /**
     * Tracks whether the registry has been asked to produce scopes for a module or component. Once
     * this is true, the registry cannot accept registrations of new directives/pipes/modules as it
     * would invalidate the cached scope data.
     */
    private sealed;
    /**
     * A map of components from the current compilation unit to the NgModule which declared them.
     *
     * As components and directives are not distinguished at the NgModule level, this map may also
     * contain directives. This doesn't cause any problems but isn't useful as there is no concept of
     * a directive's compilation scope.
     */
    private declarationToModule;
    private moduleToRef;
    /**
     * A cache of calculated `LocalModuleScope`s for each NgModule declared in the current program.
     *
     * A value of `undefined` indicates the scope was invalid and produced errors (therefore,
     * diagnostics should exist in the `scopeErrors` map).
     */
    private cache;
    /**
     * Tracks whether a given component requires "remote scoping".
     *
     * Remote scoping is when the set of directives which apply to a given component is set in the
     * NgModule's file instead of directly on the ngComponentDef (which is sometimes needed to get
     * around cyclic import issues). This is not used in calculation of `LocalModuleScope`s, but is
     * tracked here for convenience.
     */
    private remoteScoping;
    /**
     * Tracks errors accumulated in the processing of scopes for each module declaration.
     */
    private scopeErrors;
    constructor(localReader: MetadataReader, dependencyScopeReader: DtsModuleScopeResolver, refEmitter: ReferenceEmitter, aliasGenerator: AliasGenerator | null);
    /**
     * Add an NgModule's data to the registry.
     */
    registerNgModuleMetadata(data: NgModuleMeta): void;
    registerDirectiveMetadata(directive: DirectiveMeta): void;
    registerPipeMetadata(pipe: PipeMeta): void;
    getScopeForComponent(clazz: ClassDeclaration): LocalModuleScope | null;
    /**
     * Collects registered data for a module and its directives/pipes and convert it into a full
     * `LocalModuleScope`.
     *
     * This method implements the logic of NgModule imports and exports. It returns the
     * `LocalModuleScope` for the given NgModule if one can be produced, and `null` if no scope is
     * available or the scope contains errors.
     */
    getScopeOfModule(clazz: ClassDeclaration): LocalModuleScope | null;
    /**
     * Retrieves any `ts.Diagnostic`s produced during the calculation of the `LocalModuleScope` for
     * the given NgModule, or `null` if no errors were present.
     */
    getDiagnosticsOfModule(clazz: ClassDeclaration): ts.Diagnostic[] | null;
    /**
     * Returns a collection of the compilation scope for each registered declaration.
     */
    getCompilationScopes(): CompilationScope[];
    /**
     * Implementation of `getScopeOfModule` which accepts a reference to a class and differentiates
     * between:
     *
     * * no scope being available (returns `null`)
     * * a scope being produced with errors (returns `undefined`).
     */
    private getScopeOfModuleReference;
    /**
     * Check whether a component requires remote scoping.
     */
    getRequiresRemoteScope(node: ClassDeclaration): boolean;
    /**
     * Set a component as requiring remote scoping.
     */
    setComponentAsRequiringRemoteScoping(node: ClassDeclaration): void;
    /**
     * Look up the `ExportScope` of a given `Reference` to an NgModule.
     *
     * The NgModule in question may be declared locally in the current ts.Program, or it may be
     * declared in a .d.ts file.
     *
     * @returns `null` if no scope could be found, or `undefined` if an invalid scope
     * was found.
     *
     * May also contribute diagnostics of its own by adding to the given `diagnostics`
     * array parameter.
     */
    private getExportedScope;
    private assertCollecting;
}

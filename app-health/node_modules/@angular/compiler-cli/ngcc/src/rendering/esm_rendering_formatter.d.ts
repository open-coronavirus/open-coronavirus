/// <amd-module name="@angular/compiler-cli/ngcc/src/rendering/esm_rendering_formatter" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import MagicString from 'magic-string';
import * as ts from 'typescript';
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { Import, ImportManager } from '../../../src/ngtsc/translator';
import { CompiledClass } from '../analysis/types';
import { NgccReflectionHost, SwitchableVariableDeclaration } from '../host/ngcc_host';
import { ModuleWithProvidersInfo } from '../analysis/module_with_providers_analyzer';
import { ExportInfo } from '../analysis/private_declarations_analyzer';
import { RenderingFormatter, RedundantDecoratorMap } from './rendering_formatter';
/**
 * A RenderingFormatter that works with ECMAScript Module import and export statements.
 */
export declare class EsmRenderingFormatter implements RenderingFormatter {
    protected host: NgccReflectionHost;
    protected isCore: boolean;
    constructor(host: NgccReflectionHost, isCore: boolean);
    /**
     *  Add the imports at the top of the file, after any imports that are already there.
     */
    addImports(output: MagicString, imports: Import[], sf: ts.SourceFile): void;
    /**
     * Add the exports to the end of the file.
     */
    addExports(output: MagicString, entryPointBasePath: AbsoluteFsPath, exports: ExportInfo[], importManager: ImportManager, file: ts.SourceFile): void;
    /**
     * Add the constants directly after the imports.
     */
    addConstants(output: MagicString, constants: string, file: ts.SourceFile): void;
    /**
     * Add the definitions directly after their decorated class.
     */
    addDefinitions(output: MagicString, compiledClass: CompiledClass, definitions: string): void;
    /**
     * Remove static decorator properties from classes.
     */
    removeDecorators(output: MagicString, decoratorsToRemove: RedundantDecoratorMap): void;
    /**
     * Rewrite the the IVY switch markers to indicate we are in IVY mode.
     */
    rewriteSwitchableDeclarations(outputText: MagicString, sourceFile: ts.SourceFile, declarations: SwitchableVariableDeclaration[]): void;
    /**
     * Add the type parameters to the appropriate functions that return `ModuleWithProviders`
     * structures.
     *
     * This function will only get called on typings files.
     */
    addModuleWithProvidersParams(outputText: MagicString, moduleWithProviders: ModuleWithProvidersInfo[], importManager: ImportManager): void;
    protected findEndOfImports(sf: ts.SourceFile): number;
    /**
     * Check whether the given type is the core Angular `ModuleWithProviders` interface.
     * @param typeName The type to check.
     * @returns true if the type is the core Angular `ModuleWithProviders` interface.
     */
    private isCoreModuleWithProvidersType;
}

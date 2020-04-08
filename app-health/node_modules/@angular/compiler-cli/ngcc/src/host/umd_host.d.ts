/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc/src/host/umd_host" />
import * as ts from 'typescript';
import { Declaration, Import } from '../../../src/ngtsc/reflection';
import { Logger } from '../logging/logger';
import { BundleProgram } from '../packages/bundle_program';
import { Esm5ReflectionHost } from './esm5_host';
export declare class UmdReflectionHost extends Esm5ReflectionHost {
    protected program: ts.Program;
    protected compilerHost: ts.CompilerHost;
    protected umdModules: Map<ts.SourceFile, UmdModule | null>;
    protected umdExports: Map<ts.SourceFile, Map<string, Declaration<ts.Declaration>> | null>;
    protected umdImportPaths: Map<ts.ParameterDeclaration, string | null>;
    constructor(logger: Logger, isCore: boolean, program: ts.Program, compilerHost: ts.CompilerHost, dts?: BundleProgram | null);
    getImportOfIdentifier(id: ts.Identifier): Import | null;
    getDeclarationOfIdentifier(id: ts.Identifier): Declaration | null;
    getExportsOfModule(module: ts.Node): Map<string, Declaration> | null;
    getUmdModule(sourceFile: ts.SourceFile): UmdModule | null;
    getUmdImportPath(importParameter: ts.ParameterDeclaration): string | null;
    getUmdExports(sourceFile: ts.SourceFile): Map<string, Declaration> | null;
    /** Get the top level statements for a module.
     *
     * In UMD modules these are the body of the UMD factory function.
     *
     * @param sourceFile The module whose statements we want.
     * @returns An array of top level statements for the given module.
     */
    protected getModuleStatements(sourceFile: ts.SourceFile): ts.Statement[];
    private computeExportsOfUmdModule;
    private extractUmdExportDeclaration;
    private findUmdImportParameter;
    private getUmdImportedDeclaration;
    private resolveModuleName;
}
export declare function parseStatementForUmdModule(statement: ts.Statement): UmdModule | null;
export declare function getImportsOfUmdModule(umdModule: UmdModule): {
    parameter: ts.ParameterDeclaration;
    path: string;
}[];
interface UmdModule {
    wrapperFn: ts.FunctionExpression;
    factoryFn: ts.FunctionExpression;
}
export declare function stripParentheses(node: ts.Node): ts.Node;
export {};

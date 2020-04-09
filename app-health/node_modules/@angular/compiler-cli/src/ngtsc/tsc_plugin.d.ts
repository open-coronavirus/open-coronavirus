/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/tsc_plugin" />
import { PluginCompilerHost, TscPlugin } from '@bazel/typescript/internal/tsc_wrapped/plugin_api';
import * as ts from 'typescript';
import { SyntheticFilesCompilerHost } from './synthetic_files_compiler_host';
export declare class NgTscPlugin implements TscPlugin {
    private angularCompilerOptions;
    constructor(angularCompilerOptions: unknown);
    wrapHost(inputFiles: string[], compilerHost: ts.CompilerHost): SyntheticFilesCompilerHost;
    wrap(program: ts.Program, config: {}, host: ts.CompilerHost): ts.Program;
    createTransformers(host: PluginCompilerHost): {
        afterDeclarations: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[];
    };
}

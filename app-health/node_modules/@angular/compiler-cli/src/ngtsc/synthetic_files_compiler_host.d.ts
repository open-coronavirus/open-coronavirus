/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/synthetic_files_compiler_host" />
import { PluginCompilerHost } from '@bazel/typescript/internal/tsc_wrapped/plugin_api';
import * as ts from 'typescript';
/**
 * Extension of the TypeScript compiler host that supports files added to the Program which
 * were never on disk.
 *
 * This is used for backwards-compatibility with the ViewEngine compiler, which used ngsummary
 * and ngfactory files as inputs to the program. We call these inputs "synthetic".
 *
 * They need to be program inputs because user code may import from these generated files.
 *
 * TODO(alxhub): remove this after all ng_module users have migrated to Ivy
 */
export declare class SyntheticFilesCompilerHost implements PluginCompilerHost {
    private rootFiles;
    private delegate;
    /**
     * SourceFiles which are added to the program but which never existed on disk.
     */
    syntheticFiles: Map<string, ts.SourceFile>;
    constructor(rootFiles: string[], delegate: ts.CompilerHost, generatedFiles: (rootFiles: string[]) => {
        [fileName: string]: (host: ts.CompilerHost) => ts.SourceFile | undefined;
    });
    fileExists(filePath: string): boolean;
    /** Loads a source file from in-memory map, or delegates. */
    getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile | undefined;
    readonly inputFiles: string[];
    fileNameToModuleId(fileName: string): string;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    writeFile(fileName: string, content: string, writeByteOrderMark: boolean, onError: ((message: string) => void) | undefined, sourceFiles: ReadonlyArray<ts.SourceFile> | undefined): void;
    getCanonicalFileName(path: string): string;
    getCurrentDirectory(): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    getDirectories?: (path: string) => string[];
    readFile(fileName: string): string | undefined;
    trace(s: string): void;
}

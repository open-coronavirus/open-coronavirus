/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { InputFileSystem } from 'webpack';
export declare class NgccProcessor {
    private readonly propertiesToConsider;
    private readonly inputFileSystem;
    private readonly compilationWarnings;
    private readonly compilationErrors;
    private readonly basePath;
    private readonly compilerOptions;
    private _processedModules;
    private _logger;
    private _nodeModulesDirectory;
    private _pathMappings;
    constructor(propertiesToConsider: string[], inputFileSystem: InputFileSystem, compilationWarnings: (Error | string)[], compilationErrors: (Error | string)[], basePath: string, compilerOptions: ts.CompilerOptions);
    processModule(moduleName: string, resolvedModule: ts.ResolvedModule | ts.ResolvedTypeReferenceDirective): void;
    /**
     * Try resolve a package.json file from the resolved .d.ts file.
     */
    private tryResolvePackage;
    private findNodeModulesDirectory;
}

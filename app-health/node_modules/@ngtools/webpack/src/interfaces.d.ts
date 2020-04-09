/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />
import { logging, virtualFs } from '@angular-devkit/core';
import { CompilerOptions } from '@angular/compiler-cli';
import * as fs from 'fs';
import * as ts from 'typescript';
export declare enum PLATFORM {
    Browser = 0,
    Server = 1
}
export interface ContextElementDependency {
}
export interface ContextElementDependencyConstructor {
    new (modulePath: string, name: string): ContextElementDependency;
}
/**
 * Option Constants
 */
export interface AngularCompilerPluginOptions {
    sourceMap?: boolean;
    tsConfigPath: string;
    basePath?: string;
    entryModule?: string;
    mainPath?: string;
    skipCodeGeneration?: boolean;
    hostReplacementPaths?: {
        [path: string]: string;
    } | ((path: string) => string);
    forkTypeChecker?: boolean;
    i18nInFile?: string;
    i18nInFormat?: string;
    i18nOutFile?: string;
    i18nOutFormat?: string;
    locale?: string;
    missingTranslation?: string;
    platform?: PLATFORM;
    nameLazyFiles?: boolean;
    logger?: logging.Logger;
    directTemplateLoading?: boolean;
    discoverLazyRoutes?: boolean;
    additionalLazyModules?: {
        [module: string]: string;
    };
    additionalLazyModuleResources?: string[];
    contextElementDependencyConstructor?: ContextElementDependencyConstructor;
    compilerOptions?: CompilerOptions;
    host?: virtualFs.Host<fs.Stats>;
    platformTransformers?: ts.TransformerFactory<ts.SourceFile>[];
}

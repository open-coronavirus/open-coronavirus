/// <reference types="node" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { experimental, logging, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import * as webpack from 'webpack';
import { WebpackConfigOptions } from '../angular-cli-files/models/build-options';
import { Schema as BrowserBuilderSchema } from '../browser/schema';
import { NormalizedBrowserBuilderSchema } from '../utils';
declare type BrowserWebpackConfigOptions = WebpackConfigOptions<NormalizedBrowserBuilderSchema>;
export declare function generateWebpackConfig(context: BuilderContext, workspaceRoot: string, projectRoot: string, sourceRoot: string | undefined, options: NormalizedBrowserBuilderSchema, webpackPartialGenerator: (wco: BrowserWebpackConfigOptions) => webpack.Configuration[], logger: logging.LoggerApi): Promise<webpack.Configuration[]>;
export declare function generateBrowserWebpackConfigFromWorkspace(options: BrowserBuilderSchema, context: BuilderContext, projectName: string, workspace: experimental.workspace.Workspace, host: virtualFs.Host<fs.Stats>, webpackPartialGenerator: (wco: BrowserWebpackConfigOptions) => webpack.Configuration[], logger: logging.LoggerApi): Promise<webpack.Configuration[]>;
export declare function generateBrowserWebpackConfigFromContext(options: BrowserBuilderSchema, context: BuilderContext, webpackPartialGenerator: (wco: BrowserWebpackConfigOptions) => webpack.Configuration[], host?: virtualFs.Host<fs.Stats>): Promise<{
    workspace: experimental.workspace.Workspace;
    config: webpack.Configuration[];
}>;
export declare function getIndexOutputFile(options: BrowserBuilderSchema): string;
export declare function getIndexInputFile(options: BrowserBuilderSchema): string;
export {};

/// <reference types="node" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { experimental, json, logging, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import * as webpack from 'webpack';
import { IndexHtmlTransform } from '../angular-cli-files/utilities/index-file/write-index-html';
import { ExecutionTransformer } from '../transforms';
import { Schema as BrowserBuilderSchema } from './schema';
export declare type BrowserBuilderOutput = json.JsonObject & BuilderOutput & {
    outputPath: string;
};
export declare function createBrowserLoggingCallback(verbose: boolean, logger: logging.LoggerApi): WebpackLoggingCallback;
export declare function buildBrowserWebpackConfigFromContext(options: BrowserBuilderSchema, context: BuilderContext, host?: virtualFs.Host<fs.Stats>): Promise<{
    workspace: experimental.workspace.Workspace;
    config: webpack.Configuration[];
}>;
export declare function buildWebpackBrowser(options: BrowserBuilderSchema, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
    logging?: WebpackLoggingCallback;
    indexHtml?: IndexHtmlTransform;
}): import("rxjs").Observable<BrowserBuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<json.JsonObject & BrowserBuilderSchema>;
export default _default;

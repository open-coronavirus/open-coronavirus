/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import * as webpack from 'webpack';
/**
 * A webpack plugin that reports status and progress to Architect.
 */
export declare class ArchitectPlugin {
    protected context: BuilderContext;
    constructor(context: BuilderContext);
    apply(compiler: webpack.Compiler): void;
}

/// <amd-module name="@angular/compiler-cli/ngcc/src/analysis/util" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { ClassSymbol, Decorator } from '../../../src/ngtsc/reflection';
import { DecoratorHandler } from '../../../src/ngtsc/transform';
import { AnalyzedClass } from './types';
export declare function isWithinPackage(packagePath: AbsoluteFsPath, sourceFile: ts.SourceFile): boolean;
export declare function analyzeDecorators(symbol: ClassSymbol, decorators: Decorator[] | null, handlers: DecoratorHandler<any, any>[]): AnalyzedClass | null;

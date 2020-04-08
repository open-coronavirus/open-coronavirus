/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/expression" />
import { AST, ParseSpan } from '@angular/compiler';
import * as ts from 'typescript';
import { TypeCheckingConfig } from './api';
import { AbsoluteSpan } from './diagnostics';
/**
 * Convert an `AST` to TypeScript code directly, without going through an intermediate `Expression`
 * AST.
 */
export declare function astToTypescript(ast: AST, maybeResolve: (ast: AST) => (ts.Expression | null), config: TypeCheckingConfig, translateSpan: (span: ParseSpan) => AbsoluteSpan): ts.Expression;

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/partial_evaluator/src/ts_helpers" />
import * as ts from 'typescript';
import { TsHelperFn } from '../../reflection';
import { ResolvedValue, ResolvedValueArray } from './result';
export declare function evaluateTsHelperInline(helper: TsHelperFn, node: ts.Node, args: ResolvedValueArray): ResolvedValue;

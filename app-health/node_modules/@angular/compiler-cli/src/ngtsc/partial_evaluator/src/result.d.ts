/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result" />
import * as ts from 'typescript';
import { Reference } from '../../imports';
import { DynamicValue } from './dynamic';
/**
 * A value resulting from static resolution.
 *
 * This could be a primitive, collection type, reference to a `ts.Node` that declares a
 * non-primitive value, or a special `DynamicValue` type which indicates the value was not
 * available statically.
 */
export declare type ResolvedValue = number | boolean | string | null | undefined | Reference | EnumValue | ResolvedValueArray | ResolvedValueMap | BuiltinFn | DynamicValue<unknown>;
/**
 * An array of `ResolvedValue`s.
 *
 * This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueArray`
 * ->
 * `ResolvedValue`.
 */
export interface ResolvedValueArray extends Array<ResolvedValue> {
}
/**
 * A map of strings to `ResolvedValue`s.
 *
 * This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueMap` ->
 * `ResolvedValue`.
 */ export interface ResolvedValueMap extends Map<string, ResolvedValue> {
}
/**
 * A value member of an enumeration.
 *
 * Contains a `Reference` to the enumeration itself, and the name of the referenced member.
 */
export declare class EnumValue {
    readonly enumRef: Reference<ts.EnumDeclaration>;
    readonly name: string;
    readonly resolved: ResolvedValue;
    constructor(enumRef: Reference<ts.EnumDeclaration>, name: string, resolved: ResolvedValue);
}
/**
 * An implementation of a builtin function, such as `Array.prototype.slice`.
 */
export declare abstract class BuiltinFn {
    abstract evaluate(args: ResolvedValueArray): ResolvedValue;
}

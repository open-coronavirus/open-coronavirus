/// <amd-module name="@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import MagicString from 'magic-string';
import { CompiledClass } from '../analysis/types';
import { EsmRenderingFormatter } from './esm_rendering_formatter';
/**
 * A RenderingFormatter that works with files that use ECMAScript Module `import` and `export`
 * statements, but instead of `class` declarations it uses ES5 `function` wrappers for classes.
 */
export declare class Esm5RenderingFormatter extends EsmRenderingFormatter {
    /**
     * Add the definitions inside the IIFE of each decorated class
     */
    addDefinitions(output: MagicString, compiledClass: CompiledClass, definitions: string): void;
}

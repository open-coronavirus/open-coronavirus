/// <amd-module name="@angular/localize/src/tools/src/translate/source_files/locale_plugin" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PluginObj } from '@babel/core';
import { TranslatePluginOptions } from './source_file_utils';
/**
 * This Babel plugin will replace the following code forms with a string literal containing the
 * given `locale`.
 *
 * * `$localize.locale`                                            -> `"locale"`
 * * `typeof $localize !== "undefined" && $localize.locale`        -> `"locale"`
 * * `xxx && typeof $localize !== "undefined" && $localize.locale` -> `"xxx && locale"`
 * * `$localize.locale || default`                                 -> `"locale" || default`
 *
 * @param locale The name of the locale to inline into the code.
 * @param options Additional options including the name of the `$localize` function.
 */
export declare function makeLocalePlugin(locale: string, { localizeName }?: TranslatePluginOptions): PluginObj;

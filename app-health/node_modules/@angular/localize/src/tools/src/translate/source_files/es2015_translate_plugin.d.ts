/// <amd-module name="@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedTranslation } from '@angular/localize';
import { PluginObj } from '@babel/core';
import { Diagnostics } from '../../diagnostics';
import { TranslatePluginOptions } from './source_file_utils';
export declare function makeEs2015TranslatePlugin(diagnostics: Diagnostics, translations: Record<string, ɵParsedTranslation>, { missingTranslation, localizeName }?: TranslatePluginOptions): PluginObj;

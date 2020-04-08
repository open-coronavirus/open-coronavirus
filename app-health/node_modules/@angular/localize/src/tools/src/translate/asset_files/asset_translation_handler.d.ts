/// <amd-module name="@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Diagnostics } from '../../diagnostics';
import { OutputPathFn } from '../output_path';
import { TranslationBundle, TranslationHandler } from '../translator';
/**
 * Translate an asset file by simply copying it to the appropriate translation output paths.
 */
export declare class AssetTranslationHandler implements TranslationHandler {
    canTranslate(_relativeFilePath: string, _contents: Buffer): boolean;
    translate(diagnostics: Diagnostics, _sourceRoot: string, relativeFilePath: string, contents: Buffer, outputPathFn: OutputPathFn, translations: TranslationBundle[], sourceLocale?: string): void;
}

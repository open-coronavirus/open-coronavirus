/// <amd-module name="@angular/localize/src/tools/src/translate/translation_files/translation_loader" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Diagnostics } from '../../diagnostics';
import { TranslationBundle } from '../translator';
import { TranslationParser } from './translation_parsers/translation_parser';
/**
 * Use this class to load a collection of translation files from disk.
 */
export declare class TranslationLoader {
    private translationParsers;
    /** @deprecated */ private diagnostics?;
    constructor(translationParsers: TranslationParser<any>[], 
    /** @deprecated */ diagnostics?: Diagnostics | undefined);
    /**
     * Load and parse the translation files into a collection of `TranslationBundles`.
     *
     * If there is a locale provided in `translationFileLocales` then this is used rather than the
     * locale extracted from the file itself.
     * If there is neither a provided locale nor a locale parsed from the file, then an error is
     * thrown.
     * If there are both a provided locale and a locale parsed from the file, and they are not the
     * same, then a warning is reported .
     *
     * @param translationFilePaths An array of absolute paths to the translation files.
     * @param translationFileLocales An array of locales for each of the translation files.
     */
    loadBundles(translationFilePaths: string[], translationFileLocales: (string | undefined)[]): TranslationBundle[];
}

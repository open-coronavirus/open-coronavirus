#!/usr/bin/env node
/// <amd-module name="@angular/localize/src/tools/src/translate/main" />
import { OutputPathFn } from './output_path';
import { MissingTranslationStrategy } from './source_files/source_file_utils';
import { Diagnostics } from '../diagnostics';
export interface TranslateFilesOptions {
    /**
     * The root path of the files to translate, either absolute or relative to the current working
     * directory. E.g. `dist/en`
     */
    sourceRootPath: string;
    /**
     * The files to translate, relative to the `root` path.
     */
    sourceFilePaths: string[];
    /**
     * An array of paths to the translation files to load, either absolute or relative to the current
     * working directory.
     */
    translationFilePaths: string[];
    /**
     * A collection of the target locales for the translation files.
     */
    translationFileLocales: (string | undefined)[];
    /**
     * A function that computes the output path of where the translated files will be written.
     * The marker `{{LOCALE}}` will be replaced with the target locale. E.g. `dist/{{LOCALE}}`.
     */
    outputPathFn: OutputPathFn;
    /**
     * An object that will receive any diagnostics messages due to the processing.
     */
    diagnostics: Diagnostics;
    /**
     * How to handle missing translations.
     */
    missingTranslation: MissingTranslationStrategy;
    /**
     * The locale of the source files.
     * If this is provided then a copy of the application will be created with no translation but just
     * the `$localize` calls stripped out.
     */
    sourceLocale?: string;
}
export declare function translateFiles({ sourceRootPath, sourceFilePaths, translationFilePaths, translationFileLocales, outputPathFn, diagnostics, missingTranslation, sourceLocale }: TranslateFilesOptions): void;

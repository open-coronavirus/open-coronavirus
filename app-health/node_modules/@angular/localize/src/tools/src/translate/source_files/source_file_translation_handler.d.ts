/// <amd-module name="@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler" />
import { Diagnostics } from '../../diagnostics';
import { OutputPathFn } from '../output_path';
import { TranslationBundle, TranslationHandler } from '../translator';
import { TranslatePluginOptions } from './source_file_utils';
/**
 * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
 * message.
 */
export declare class SourceFileTranslationHandler implements TranslationHandler {
    private translationOptions;
    private sourceLocaleOptions;
    constructor(translationOptions?: TranslatePluginOptions);
    canTranslate(relativeFilePath: string, _contents: Buffer): boolean;
    translate(diagnostics: Diagnostics, sourceRoot: string, relativeFilePath: string, contents: Buffer, outputPathFn: OutputPathFn, translations: TranslationBundle[], sourceLocale?: string): void;
    private translateFile;
}

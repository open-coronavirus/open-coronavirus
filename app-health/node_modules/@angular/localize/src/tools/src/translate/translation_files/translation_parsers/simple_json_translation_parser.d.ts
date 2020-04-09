/// <amd-module name="@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser" />
import { ParsedTranslationBundle, TranslationParser } from './translation_parser';
/**
 * A translation parser that can parse JSON that has the form:
 *
 * ```
 * {
 *   "locale": "...",
 *   "translations": {
 *     "message-id": "Target message string",
 *     ...
 *   }
 * }
 * ```
 */
export declare class SimpleJsonTranslationParser implements TranslationParser {
    canParse(filePath: string, _contents: string): boolean;
    parse(_filePath: string, contents: string): ParsedTranslationBundle;
}

/// <amd-module name="@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser" />
import { ParsedTranslationBundle, TranslationParser } from './translation_parser';
import { XmlTranslationParserHint } from './translation_utils';
/**
 * A translation parser that can load XB files.
 */
export declare class XtbTranslationParser implements TranslationParser<XmlTranslationParserHint> {
    canParse(filePath: string, contents: string): XmlTranslationParserHint | false;
    parse(filePath: string, contents: string, hint?: XmlTranslationParserHint): ParsedTranslationBundle;
    private extractBundle;
    private extractBundleDeprecated;
}

/// <amd-module name="@angular/localize/src/tools/src/translate/output_path" />
export interface OutputPathFn {
    (locale: string, relativePath: string): string;
}
/**
 * Create a function that will compute the absolute path to where a translated file should be
 * written.
 *
 * The special `{{LOCALE}}` marker will be replaced with the locale code of the current translation.
 * @param outputFolder An absolute path to the folder containing this set of translations.
 */
export declare function getOutputPathFn(outputFolder: string): OutputPathFn;

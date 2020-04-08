/**
 * Extract i18n target options for Build Facade.
 */
export interface Schema {
    /**
     * Target to extract from.
     */
    browserTarget: string;
    /**
     * Output format for the generated file.
     */
    i18nFormat?: I18NFormat;
    /**
     * Specifies the source language of the application.
     */
    i18nLocale?: string;
    /**
     * Name of the file to output.
     */
    outFile?: string;
    /**
     * Path where output will be placed.
     */
    outputPath?: string;
    /**
     * Log progress to the console.
     */
    progress?: boolean;
}
/**
 * Output format for the generated file.
 */
export declare enum I18NFormat {
    Xlf = "xlf",
    Xlf2 = "xlf2",
    Xlif = "xlif",
    Xliff = "xliff",
    Xliff2 = "xliff2",
    Xmb = "xmb"
}

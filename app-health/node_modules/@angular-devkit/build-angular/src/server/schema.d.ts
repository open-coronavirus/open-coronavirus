export interface Schema {
    /**
     * Available on server platform only. Which external dependencies to bundle into the module.
     * By default, all of node_modules will be kept as requires.
     */
    bundleDependencies?: BundleDependencies;
    /**
     * Use a separate bundle containing code used across multiple bundles.
     */
    commonChunk?: boolean;
    /**
     * Delete the output path before building.
     */
    deleteOutputPath?: boolean;
    /**
     * URL where files will be deployed.
     */
    deployUrl?: string;
    /**
     * Output in-file eval sourcemaps.
     * @deprecated
     */
    evalSourceMap?: boolean;
    /**
     * Extract all licenses in a separate file, in the case of production builds only.
     */
    extractLicenses?: boolean;
    /**
     * Replace files with other files in the build.
     */
    fileReplacements?: FileReplacement[];
    /**
     * Run the TypeScript type checker in a forked process.
     */
    forkTypeChecker?: boolean;
    /**
     * Localization file to use for i18n.
     */
    i18nFile?: string;
    /**
     * Format of the localization file specified with --i18n-file.
     */
    i18nFormat?: string;
    /**
     * Locale to use for i18n.
     */
    i18nLocale?: string;
    /**
     * How to handle missing translations for i18n.
     */
    i18nMissingTranslation?: string;
    /**
     * List of additional NgModule files that will be lazy loaded. Lazy router modules will be
     * discovered automatically.
     */
    lazyModules?: string[];
    /**
     * The name of the main entry-point file.
     */
    main: string;
    /**
     * Use file name for lazy loaded chunks.
     */
    namedChunks?: boolean;
    /**
     * Enables optimization of the build output.
     */
    optimization?: OptimizationUnion;
    /**
     * Define the output filename cache-busting hashing mode.
     */
    outputHashing?: OutputHashing;
    /**
     * Path where output will be placed.
     */
    outputPath: string;
    /**
     * Enable and define the file watching poll time period in milliseconds.
     */
    poll?: number;
    /**
     * Do not use the real path when resolving modules.
     */
    preserveSymlinks?: boolean;
    /**
     * Log progress to the console while building.
     */
    progress?: boolean;
    /**
     * The path where style resources will be placed, relative to outputPath.
     */
    resourcesOutputPath?: string;
    /**
     * Show circular dependency warnings on builds.
     */
    showCircularDependencies?: boolean;
    /**
     * Output sourcemaps.
     */
    sourceMap?: SourceMapUnion;
    /**
     * Generates a 'stats.json' file which can be analyzed using tools such as
     * 'webpack-bundle-analyzer'.
     */
    statsJson?: boolean;
    /**
     * Options to pass to style preprocessors
     */
    stylePreprocessorOptions?: StylePreprocessorOptions;
    /**
     * The name of the TypeScript configuration file.
     */
    tsConfig: string;
    /**
     * Use a separate bundle containing only vendor libraries.
     */
    vendorChunk?: boolean;
    /**
     * Resolve vendor packages sourcemaps.
     * @deprecated
     */
    vendorSourceMap?: boolean;
    /**
     * Adds more details to output logging.
     */
    verbose?: boolean;
    /**
     * Run build when files change.
     */
    watch?: boolean;
}
/**
 * Available on server platform only. Which external dependencies to bundle into the module.
 * By default, all of node_modules will be kept as requires.
 */
export declare enum BundleDependencies {
    All = "all",
    None = "none"
}
export interface FileReplacement {
    replace?: string;
    replaceWith?: string;
    src?: string;
    with?: string;
}
/**
 * Enables optimization of the build output.
 */
export declare type OptimizationUnion = boolean | OptimizationClass;
export interface OptimizationClass {
    /**
     * Enables optimization of the scripts output.
     */
    scripts?: boolean;
    /**
     * Enables optimization of the styles output.
     */
    styles?: boolean;
}
/**
 * Define the output filename cache-busting hashing mode.
 */
export declare enum OutputHashing {
    All = "all",
    Bundles = "bundles",
    Media = "media",
    None = "none"
}
/**
 * Output sourcemaps.
 */
export declare type SourceMapUnion = boolean | SourceMapClass;
export interface SourceMapClass {
    /**
     * Output sourcemaps used for error reporting tools.
     */
    hidden?: boolean;
    /**
     * Output sourcemaps for all scripts.
     */
    scripts?: boolean;
    /**
     * Output sourcemaps for all styles.
     */
    styles?: boolean;
    /**
     * Resolve vendor packages sourcemaps.
     */
    vendor?: boolean;
}
/**
 * Options to pass to style preprocessors
 */
export interface StylePreprocessorOptions {
    /**
     * Paths to include. Paths will be resolved to project root.
     */
    includePaths?: string[];
}

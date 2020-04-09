/**
 * Updates your application and its dependencies. See https://update.angular.io/
 */
export interface Schema {
    /**
     * Whether to update all packages in package.json.
     */
    all?: boolean;
    /**
     * Whether to allow updating when the repository contains modified or untracked files.
     */
    allowDirty?: boolean;
    /**
     * If false, will error out if installed packages are incompatible with the update.
     */
    force?: boolean;
    /**
     * Version from which to migrate from. Only available with a single package being updated,
     * and only on migration only.
     */
    from?: string;
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * Only perform a migration, does not update the installed version.
     */
    migrateOnly?: boolean;
    /**
     * Use the largest version, including beta and RCs.
     */
    next?: boolean;
    /**
     * The names of package(s) to update.
     */
    packages?: string[];
    /**
     * Version up to which to apply migrations. Only available with a single package being
     * updated, and only on migrations only. Requires from to be specified. Default to the
     * installed version detected.
     */
    to?: string;
    /**
     * Display additional details about internal operations during execution.
     */
    verbose?: boolean;
}
/**
 * Shows a help message for this command in the console.
 */
export declare type HelpUnion = boolean | HelpEnum;
export declare enum HelpEnum {
    HelpJson = "JSON",
    Json = "json"
}

/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/configuration" />
import { AbsoluteFsPath, FileSystem } from '../../../src/ngtsc/file_system';
import { PackageJsonFormatProperties } from './entry_point';
/**
 * The format of a project level configuration file.
 */
export interface NgccProjectConfig {
    packages: {
        [packagePath: string]: NgccPackageConfig;
    };
}
/**
 * The format of a package level configuration file.
 */
export interface NgccPackageConfig {
    /**
     * The entry-points to configure for this package.
     *
     * In the config file the keys can be paths relative to the package path;
     * but when being read back from the `NgccConfiguration` service, these paths
     * will be absolute.
     */
    entryPoints: {
        [entryPointPath: string]: NgccEntryPointConfig;
    };
}
/**
 * Configuration options for an entry-point.
 *
 * The existence of a configuration for a path tells ngcc that this should be considered for
 * processing as an entry-point.
 */
export interface NgccEntryPointConfig {
    /** Do not process (or even acknowledge the existence of) this entry-point, if true. */
    ignore?: boolean;
    /**
     * This property, if provided, holds values that will override equivalent properties in an
     * entry-point's package.json file.
     */
    override?: PackageJsonFormatProperties;
}
export declare class NgccConfiguration {
    private fs;
    private cache;
    constructor(fs: FileSystem, baseDir: AbsoluteFsPath);
    getConfig(packagePath: AbsoluteFsPath): NgccPackageConfig;
    private loadProjectConfig;
    private loadPackageConfig;
    private evalSrcFile;
    private processEntryPoints;
}

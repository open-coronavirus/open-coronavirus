/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/entry_point" />
import { AbsoluteFsPath, FileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../logging/logger';
import { NgccConfiguration } from './configuration';
/**
 * The possible values for the format of an entry-point.
 */
export declare type EntryPointFormat = 'esm5' | 'esm2015' | 'umd' | 'commonjs';
/**
 * An object containing information about an entry-point, including paths
 * to each of the possible entry-point formats.
 */
export interface EntryPoint {
    /** The name of the package (e.g. `@angular/core`). */
    name: string;
    /** The parsed package.json file for this entry-point. */
    packageJson: EntryPointPackageJson;
    /** The path to the package that contains this entry-point. */
    package: AbsoluteFsPath;
    /** The path to this entry point. */
    path: AbsoluteFsPath;
    /** The path to a typings (.d.ts) file for this entry-point. */
    typings: AbsoluteFsPath;
    /** Is this EntryPoint compiled with the Angular View Engine compiler? */
    compiledByAngular: boolean;
}
export interface PackageJsonFormatProperties {
    fesm2015?: string;
    fesm5?: string;
    es2015?: string;
    esm2015?: string;
    esm5?: string;
    main?: string;
    module?: string;
    types?: string;
    typings?: string;
}
/**
 * The properties that may be loaded from the `package.json` file.
 */
export interface EntryPointPackageJson extends PackageJsonFormatProperties {
    name: string;
    __processed_by_ivy_ngcc__?: {
        [key: string]: string;
    };
}
export declare type EntryPointJsonProperty = keyof (PackageJsonFormatProperties);
export declare const SUPPORTED_FORMAT_PROPERTIES: EntryPointJsonProperty[];
/**
 * Try to create an entry-point from the given paths and properties.
 *
 * @param packagePath the absolute path to the containing npm package
 * @param entryPointPath the absolute path to the potential entry-point.
 * @returns An entry-point if it is valid, `null` otherwise.
 */
export declare function getEntryPointInfo(fs: FileSystem, config: NgccConfiguration, logger: Logger, packagePath: AbsoluteFsPath, entryPointPath: AbsoluteFsPath): EntryPoint | null;
/**
 * Convert a package.json property into an entry-point format.
 *
 * @param property The property to convert to a format.
 * @returns An entry-point format or `undefined` if none match the given property.
 */
export declare function getEntryPointFormat(fs: FileSystem, entryPoint: EntryPoint, property: string): EntryPointFormat | undefined;

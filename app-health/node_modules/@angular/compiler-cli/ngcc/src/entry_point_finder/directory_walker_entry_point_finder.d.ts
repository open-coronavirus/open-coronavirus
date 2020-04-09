/// <amd-module name="@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, FileSystem } from '../../../src/ngtsc/file_system';
import { DependencyResolver, SortedEntryPointsInfo } from '../dependencies/dependency_resolver';
import { Logger } from '../logging/logger';
import { NgccConfiguration } from '../packages/configuration';
import { PathMappings } from '../utils';
import { EntryPointFinder } from './interface';
/**
 * An EntryPointFinder that searches for all entry-points that can be found given a `basePath` and
 * `pathMappings`.
 */
export declare class DirectoryWalkerEntryPointFinder implements EntryPointFinder {
    private fs;
    private config;
    private logger;
    private resolver;
    private sourceDirectory;
    private pathMappings;
    private basePaths;
    constructor(fs: FileSystem, config: NgccConfiguration, logger: Logger, resolver: DependencyResolver, sourceDirectory: AbsoluteFsPath, pathMappings: PathMappings | undefined);
    /**
     * Search the `sourceDirectory`, and sub-directories, using `pathMappings` as necessary, to find
     * all package entry-points.
     */
    findEntryPoints(): SortedEntryPointsInfo;
    /**
     * Look for entry points that need to be compiled, starting at the source directory.
     * The function will recurse into directories that start with `@...`, e.g. `@angular/...`.
     * @param sourceDirectory An absolute path to the root directory where searching begins.
     */
    private walkDirectoryForEntryPoints;
    /**
     * Recurse the folder structure looking for all the entry points
     * @param packagePath The absolute path to an npm package that may contain entry points
     * @returns An array of entry points that were discovered.
     */
    private getEntryPointsForPackage;
    /**
     * Recursively walk a directory and its sub-directories, applying a given
     * function to each directory.
     * @param dir the directory to recursively walk.
     * @param fn the function to apply to each directory.
     */
    private walkDirectory;
}

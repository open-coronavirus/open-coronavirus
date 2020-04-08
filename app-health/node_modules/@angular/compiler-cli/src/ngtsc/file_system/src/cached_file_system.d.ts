/// <amd-module name="@angular/compiler-cli/src/ngtsc/file_system/src/cached_file_system" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, FileStats, FileSystem, PathSegment, PathString } from './types';
/**
 * A wrapper around `FileSystem` that caches hits to `exists()` and
 * `readFile()` to improve performance.
 *
 * Be aware that any changes to the file system from outside of this
 * class could break the cache, leaving it with stale values.
 */
export declare class CachedFileSystem implements FileSystem {
    private delegate;
    private existsCache;
    private readFileCache;
    constructor(delegate: FileSystem);
    exists(path: AbsoluteFsPath): boolean;
    readFile(path: AbsoluteFsPath): string;
    writeFile(path: AbsoluteFsPath, data: string): void;
    symlink(target: AbsoluteFsPath, path: AbsoluteFsPath): void;
    copyFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
    moveFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
    mkdir(path: AbsoluteFsPath): void;
    ensureDir(path: AbsoluteFsPath): void;
    lstat(path: AbsoluteFsPath): FileStats;
    stat(path: AbsoluteFsPath): FileStats;
    readdir(path: AbsoluteFsPath): PathSegment[];
    pwd(): AbsoluteFsPath;
    extname(path: AbsoluteFsPath | PathSegment): string;
    isCaseSensitive(): boolean;
    isRoot(path: AbsoluteFsPath): boolean;
    isRooted(path: string): boolean;
    resolve(...paths: string[]): AbsoluteFsPath;
    dirname<T extends PathString>(file: T): T;
    join<T extends PathString>(basePath: T, ...paths: string[]): T;
    relative<T extends PathString>(from: T, to: T): PathSegment;
    basename(filePath: string, extension?: string | undefined): PathSegment;
    realpath(filePath: AbsoluteFsPath): AbsoluteFsPath;
    getDefaultLibLocation(): AbsoluteFsPath;
    normalize<T extends PathString>(path: T): T;
}

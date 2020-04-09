/// <amd-module name="@angular/compiler-cli/src/ngtsc/file_system/src/invalid_file_system" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, FileStats, FileSystem, PathSegment, PathString } from './types';
/**
 * The default `FileSystem` that will always fail.
 *
 * This is a way of ensuring that the developer consciously chooses and
 * configures the `FileSystem` before using it; particularly important when
 * considering static functions like `absoluteFrom()` which rely on
 * the `FileSystem` under the hood.
 */
export declare class InvalidFileSystem implements FileSystem {
    exists(path: AbsoluteFsPath): boolean;
    readFile(path: AbsoluteFsPath): string;
    writeFile(path: AbsoluteFsPath, data: string): void;
    symlink(target: AbsoluteFsPath, path: AbsoluteFsPath): void;
    readdir(path: AbsoluteFsPath): PathSegment[];
    lstat(path: AbsoluteFsPath): FileStats;
    stat(path: AbsoluteFsPath): FileStats;
    pwd(): AbsoluteFsPath;
    extname(path: AbsoluteFsPath | PathSegment): string;
    copyFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
    moveFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
    mkdir(path: AbsoluteFsPath): void;
    ensureDir(path: AbsoluteFsPath): void;
    isCaseSensitive(): boolean;
    resolve(...paths: string[]): AbsoluteFsPath;
    dirname<T extends PathString>(file: T): T;
    join<T extends PathString>(basePath: T, ...paths: string[]): T;
    isRoot(path: AbsoluteFsPath): boolean;
    isRooted(path: string): boolean;
    relative<T extends PathString>(from: T, to: T): PathSegment;
    basename(filePath: string, extension?: string): PathSegment;
    realpath(filePath: AbsoluteFsPath): AbsoluteFsPath;
    getDefaultLibLocation(): AbsoluteFsPath;
    normalize<T extends PathString>(path: T): T;
}

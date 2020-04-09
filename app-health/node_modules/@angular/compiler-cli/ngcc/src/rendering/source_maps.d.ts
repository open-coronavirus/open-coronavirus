/// <amd-module name="@angular/compiler-cli/ngcc/src/rendering/source_maps" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SourceMapConverter } from 'convert-source-map';
import MagicString from 'magic-string';
import { RawSourceMap } from 'source-map';
import * as ts from 'typescript';
import { FileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../logging/logger';
import { FileToWrite } from './utils';
export interface SourceMapInfo {
    source: string;
    map: SourceMapConverter | null;
    isInline: boolean;
}
/**
 * Get the map from the source (note whether it is inline or external)
 */
export declare function extractSourceMap(fs: FileSystem, logger: Logger, file: ts.SourceFile): SourceMapInfo;
/**
 * Merge the input and output source-maps, replacing the source-map comment in the output file
 * with an appropriate source-map comment pointing to the merged source-map.
 */
export declare function renderSourceAndMap(sourceFile: ts.SourceFile, input: SourceMapInfo, output: MagicString): FileToWrite[];
/**
 * Merge the two specified source-maps into a single source-map that hides the intermediate
 * source-map.
 * E.g. Consider these mappings:
 *
 * ```
 * OLD_SRC -> OLD_MAP -> INTERMEDIATE_SRC -> NEW_MAP -> NEW_SRC
 * ```
 *
 * this will be replaced with:
 *
 * ```
 * OLD_SRC -> MERGED_MAP -> NEW_SRC
 * ```
 */
export declare function mergeSourceMaps(oldMap: RawSourceMap | null, newMap: RawSourceMap): SourceMapConverter;

/// <amd-module name="@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { EntryPoint, EntryPointJsonProperty } from '../packages/entry_point';
import { EntryPointBundle } from '../packages/entry_point_bundle';
import { FileToWrite } from '../rendering/utils';
import { InPlaceFileWriter } from './in_place_file_writer';
/**
 * This FileWriter creates a copy of the original entry-point, then writes the transformed
 * files onto the files in this copy, and finally updates the package.json with a new
 * entry-point format property that points to this new entry-point.
 *
 * If there are transformed typings files in this bundle, they are updated in-place (see the
 * `InPlaceFileWriter`).
 */
export declare class NewEntryPointFileWriter extends InPlaceFileWriter {
    writeBundle(entryPoint: EntryPoint, bundle: EntryPointBundle, transformedFiles: FileToWrite[]): void;
    protected copyBundle(bundle: EntryPointBundle, packagePath: AbsoluteFsPath, ngccFolder: AbsoluteFsPath): void;
    protected writeFile(file: FileToWrite, packagePath: AbsoluteFsPath, ngccFolder: AbsoluteFsPath): void;
    protected updatePackageJson(entryPoint: EntryPoint, formatProperty: EntryPointJsonProperty, ngccFolder: AbsoluteFsPath): void;
}

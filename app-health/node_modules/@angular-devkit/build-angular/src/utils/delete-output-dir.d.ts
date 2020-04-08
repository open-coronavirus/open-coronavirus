/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path, virtualFs } from '@angular-devkit/core';
/**
 * Delete an output directory, but error out if it's the root of the project.
 */
export declare function deleteOutputDir(root: Path, outputPath: Path, host: virtualFs.Host): import("rxjs").Observable<void | null>;

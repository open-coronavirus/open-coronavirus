/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/src/tools/src/diagnostics" />
/**
 * This class is used to collect and then report warnings and errors that occur during the execution
 * of the tools.
 */
export declare class Diagnostics {
    readonly messages: {
        type: 'warning' | 'error';
        message: string;
    }[];
    get hasErrors(): boolean;
    warn(message: string): void;
    error(message: string): void;
    formatDiagnostics(message: string): string;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const colors = require("ansi-colors");
exports.colors = colors;
const tty_1 = require("tty");
// Typings do not contain the function call (added in Node.js v9.9.0)
exports.supportsColor = process.stdout instanceof tty_1.WriteStream &&
    process.stdout.getColorDepth() > 1;
colors.enabled = exports.supportsColor;

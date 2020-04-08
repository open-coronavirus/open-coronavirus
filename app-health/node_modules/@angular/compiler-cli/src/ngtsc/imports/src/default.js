/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/imports/src/default", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    /**
     * An implementation of `DefaultImportRecorder` which does nothing.
     *
     * This is useful when default import tracking isn't required, such as when emitting .d.ts code
     * or for ngcc.
     */
    exports.NOOP_DEFAULT_IMPORT_RECORDER = {
        recordImportedIdentifier: function (id) { return void {}; },
        recordUsedIdentifier: function (id) { return void {}; },
    };
    /**
     * TypeScript has trouble with generating default imports inside of transformers for some module
     * formats. The issue is that for the statement:
     *
     * import X from 'some/module';
     * console.log(X);
     *
     * TypeScript will not use the "X" name in generated code. For normal user code, this is fine
     * because references to X will also be renamed. However, if both the import and any references are
     * added in a transformer, TypeScript does not associate the two, and will leave the "X" references
     * dangling while renaming the import variable. The generated code looks something like:
     *
     * const module_1 = require('some/module');
     * console.log(X); // now X is a dangling reference.
     *
     * Therefore, we cannot synthetically add default imports, and must reuse the imports that users
     * include. Doing this poses a challenge for imports that are only consumed in the type position in
     * the user's code. If Angular reuses the imported symbol in a value position (for example, we
     * see a constructor parameter of type Foo and try to write "inject(Foo)") we will also end up with
     * a dangling reference, as TS will elide the import because it was only used in the type position
     * originally.
     *
     * To avoid this, the compiler must "touch" the imports with `ts.updateImportClause`, and should
     * only do this for imports which are actually consumed. The `DefaultImportTracker` keeps track of
     * these imports as they're encountered and emitted, and implements a transform which can correctly
     * flag the imports as required.
     *
     * This problem does not exist for non-default imports as the compiler can easily insert
     * "import * as X" style imports for those, and the "X" identifier survives transformation.
     */
    var DefaultImportTracker = /** @class */ (function () {
        function DefaultImportTracker() {
            /**
             * A `Map` which tracks the `Map` of default import `ts.Identifier`s to their
             * `ts.ImportDeclaration`s. These declarations are not guaranteed to be used.
             */
            this.sourceFileToImportMap = new Map();
            /**
             * A `Map` which tracks the `Set` of `ts.ImportDeclaration`s for default imports that were used in
             * a given `ts.SourceFile` and need to be preserved.
             */
            this.sourceFileToUsedImports = new Map();
        }
        DefaultImportTracker.prototype.recordImportedIdentifier = function (id, decl) {
            var sf = typescript_1.getSourceFile(id);
            if (!this.sourceFileToImportMap.has(sf)) {
                this.sourceFileToImportMap.set(sf, new Map());
            }
            this.sourceFileToImportMap.get(sf).set(id, decl);
        };
        DefaultImportTracker.prototype.recordUsedIdentifier = function (id) {
            var sf = typescript_1.getSourceFile(id);
            if (!this.sourceFileToImportMap.has(sf)) {
                // The identifier's source file has no registered default imports at all.
                return;
            }
            var identiferToDeclaration = this.sourceFileToImportMap.get(sf);
            if (!identiferToDeclaration.has(id)) {
                // The identifier isn't from a registered default import.
                return;
            }
            var decl = identiferToDeclaration.get(id);
            // Add the default import declaration to the set of used import declarations for the file.
            if (!this.sourceFileToUsedImports.has(sf)) {
                this.sourceFileToUsedImports.set(sf, new Set());
            }
            this.sourceFileToUsedImports.get(sf).add(decl);
        };
        /**
         * Get a `ts.TransformerFactory` which will preserve default imports that were previously marked
         * as used.
         *
         * This transformer must run after any other transformers which call `recordUsedIdentifier`.
         */
        DefaultImportTracker.prototype.importPreservingTransformer = function () {
            var _this = this;
            return function (context) {
                return function (sf) { return _this.transformSourceFile(sf); };
            };
        };
        /**
         * Process a `ts.SourceFile` and replace any `ts.ImportDeclaration`s.
         */
        DefaultImportTracker.prototype.transformSourceFile = function (sf) {
            var originalSf = ts.getOriginalNode(sf);
            // Take a fast path if no import declarations need to be preserved in the file.
            if (!this.sourceFileToUsedImports.has(originalSf)) {
                return sf;
            }
            // There are declarations that need to be preserved.
            var importsToPreserve = this.sourceFileToUsedImports.get(originalSf);
            // Generate a new statement list which preserves any imports present in `importsToPreserve`.
            var statements = sf.statements.map(function (stmt) {
                if (ts.isImportDeclaration(stmt) && importsToPreserve.has(stmt)) {
                    // Preserving an import that's marked as unreferenced (type-only) is tricky in TypeScript.
                    //
                    // Various approaches have been tried, with mixed success:
                    //
                    // 1. Using `ts.updateImportDeclaration` does not cause the import to be retained.
                    //
                    // 2. Using `ts.createImportDeclaration` with the same `ts.ImportClause` causes the import
                    //    to correctly be retained, but when emitting CommonJS module format code, references
                    //    to the imported value will not match the import variable.
                    //
                    // 3. Emitting "import * as" imports instead generates the correct import variable, but
                    //    references are missing the ".default" access. This happens to work for tsickle code
                    //    with goog.module transformations as tsickle strips the ".default" anyway.
                    //
                    // 4. It's possible to trick TypeScript by setting `ts.NodeFlag.Synthesized` on the import
                    //    declaration. This causes the import to be correctly retained and generated, but can
                    //    violate invariants elsewhere in the compiler and cause crashes.
                    //
                    // 5. Using `ts.getMutableClone` seems to correctly preserve the import and correctly
                    //    generate references to the import variable across all module types.
                    //
                    // Therefore, option 5 is the one used here. It seems to be implemented as the correct way
                    // to perform option 4, which preserves all the compiler's invariants.
                    //
                    // TODO(alxhub): discuss with the TypeScript team and determine if there's a better way to
                    // deal with this issue.
                    stmt = ts.getMutableClone(stmt);
                }
                return stmt;
            });
            // Save memory - there's no need to keep these around once the transform has run for the given
            // file.
            this.sourceFileToImportMap.delete(originalSf);
            this.sourceFileToUsedImports.delete(originalSf);
            return ts.updateSourceFileNode(sf, statements);
        };
        return DefaultImportTracker;
    }());
    exports.DefaultImportTracker = DefaultImportTracker;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaW1wb3J0cy9zcmMvZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0VBTUU7Ozs7Ozs7Ozs7OztJQUVGLCtCQUFpQztJQUVqQyxrRkFBd0Q7SUE2QnhEOzs7OztPQUtHO0lBQ1UsUUFBQSw0QkFBNEIsR0FBMEI7UUFDakUsd0JBQXdCLEVBQUUsVUFBQyxFQUFpQixJQUFLLE9BQUEsS0FBSSxFQUFFLEVBQU4sQ0FBTTtRQUN2RCxvQkFBb0IsRUFBRSxVQUFDLEVBQWlCLElBQUssT0FBQSxLQUFJLEVBQUUsRUFBTixDQUFNO0tBQ3BELENBQUM7SUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E2Qkc7SUFDSDtRQUFBO1lBQ0U7OztlQUdHO1lBQ0ssMEJBQXFCLEdBQ3pCLElBQUksR0FBRyxFQUEyRCxDQUFDO1lBRXZFOzs7ZUFHRztZQUNLLDRCQUF1QixHQUFHLElBQUksR0FBRyxFQUE0QyxDQUFDO1FBK0Z4RixDQUFDO1FBOUZDLHVEQUF3QixHQUF4QixVQUF5QixFQUFpQixFQUFFLElBQTBCO1lBQ3BFLElBQU0sRUFBRSxHQUFHLDBCQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxFQUF1QyxDQUFDLENBQUM7YUFDcEY7WUFDRCxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVELG1EQUFvQixHQUFwQixV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QUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUNILDJCQUFDO0lBQUQsQ0FBQyxBQTNHRCxJQTJHQztJQTNHWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogQGxpY2Vuc2VcbiogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4qXG4qIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4qIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldFNvdXJjZUZpbGV9IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuXG4vKipcbiAqIFJlZ2lzdGVycyBhbmQgcmVjb3JkcyB1c2FnZXMgb2YgYHRzLklkZW50aWZlcmBzIHRoYXQgY2FtZSBmcm9tIGRlZmF1bHQgaW1wb3J0IHN0YXRlbWVudHMuXG4gKlxuICogU2VlIGBEZWZhdWx0SW1wb3J0VHJhY2tlcmAgZm9yIGRldGFpbHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdEltcG9ydFJlY29yZGVyIHtcbiAgLyoqXG4gICAqIFJlY29yZCBhbiBhc3NvY2lhdGlvbiBiZXR3ZWVuIGEgYHRzLklkZW50aWZpZXJgIHdoaWNoIG1pZ2h0IGJlIGVtaXR0ZWQgYW5kIHRoZVxuICAgKiBgdHMuSW1wb3J0RGVjbGFyYXRpb25gIGZyb20gd2hpY2ggaXQgY2FtZS5cbiAgICpcbiAgICogQWxvbmUsIHRoaXMgbWV0aG9kIGhhcyBubyBlZmZlY3QgYXMgdGhlIGB0cy5JZGVudGlmaWVyYCBtaWdodCBub3QgYmUgdXNlZCBpbiB0aGUgb3V0cHV0LlxuICAgKiBUaGUgaWRlbnRpZmllciBtdXN0IGxhdGVyIGJlIG1hcmtlZCBhcyB1c2VkIHdpdGggYHJlY29yZFVzZWRJZGVudGlmaWVyYCBpbiBvcmRlciBmb3IgaXRzXG4gICAqIGltcG9ydCB0byBiZSBwcmVzZXJ2ZWQuXG4gICAqL1xuICByZWNvcmRJbXBvcnRlZElkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIsIGRlY2w6IHRzLkltcG9ydERlY2xhcmF0aW9uKTogdm9pZDtcblxuICAvKipcbiAgICogUmVjb3JkIHRoZSBmYWN0IHRoYXQgdGhlIGdpdmVuIGB0cy5JZGVudGlmZXJgIHdpbGwgYmUgZW1pdHRlZCwgYW5kIHRodXMgaXRzXG4gICAqIGB0cy5JbXBvcnREZWNsYXJhdGlvbmAsIGlmIGl0IHdhcyBhIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBkZWZhdWx0IGltcG9ydCwgbXVzdCBiZSBwcmVzZXJ2ZWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgc2FmZWx5IGZvciBhbnkgYHRzLklkZW50aWZlcmAsIHJlZ2FyZGxlc3Mgb2YgaXRzIG9yaWdpbi4gSXQgd2lsbCBvbmx5XG4gICAqIGhhdmUgYW4gZWZmZWN0IGlmIHRoZSBpZGVudGlmaWVyIGNhbWUgZnJvbSBhIGB0cy5JbXBvcnREZWNsYXJhdGlvbmAgZGVmYXVsdCBpbXBvcnQgd2hpY2ggd2FzXG4gICAqIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIGByZWNvcmRJbXBvcnRlZElkZW50aWZpZXJgLlxuICAgKi9cbiAgcmVjb3JkVXNlZElkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiB2b2lkO1xufVxuXG4vKipcbiAqIEFuIGltcGxlbWVudGF0aW9uIG9mIGBEZWZhdWx0SW1wb3J0UmVjb3JkZXJgIHdoaWNoIGRvZXMgbm90aGluZy5cbiAqXG4gKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIGRlZmF1bHQgaW1wb3J0IHRyYWNraW5nIGlzbid0IHJlcXVpcmVkLCBzdWNoIGFzIHdoZW4gZW1pdHRpbmcgLmQudHMgY29kZVxuICogb3IgZm9yIG5nY2MuXG4gKi9cbmV4cG9ydCBjb25zdCBOT09QX0RFRkFVTFRfSU1QT1JUX1JFQ09SREVSOiBEZWZhdWx0SW1wb3J0UmVjb3JkZXIgPSB7XG4gIHJlY29yZEltcG9ydGVkSWRlbnRpZmllcjogKGlkOiB0cy5JZGVudGlmaWVyKSA9PiB2b2lke30sXG4gIHJlY29yZFVzZWRJZGVudGlmaWVyOiAoaWQ6IHRzLklkZW50aWZpZXIpID0+IHZvaWR7fSxcbn07XG5cbi8qKlxuICogVHlwZVNjcmlwdCBoYXMgdHJvdWJsZSB3aXRoIGdlbmVyYXRpbmcgZGVmYXVsdCBpbXBvcnRzIGluc2lkZSBvZiB0cmFuc2Zvcm1lcnMgZm9yIHNvbWUgbW9kdWxlXG4gKiBmb3JtYXRzLiBUaGUgaXNzdWUgaXMgdGhhdCBmb3IgdGhlIHN0YXRlbWVudDpcbiAqXG4gKiBpbXBvcnQgWCBmcm9tICdzb21lL21vZHVsZSc7XG4gKiBjb25zb2xlLmxvZyhYKTtcbiAqXG4gKiBUeXBlU2NyaXB0IHdpbGwgbm90IHVzZSB0aGUgXCJYXCIgbmFtZSBpbiBnZW5lcmF0ZWQgY29kZS4gRm9yIG5vcm1hbCB1c2VyIGNvZGUsIHRoaXMgaXMgZmluZVxuICogYmVjYXVzZSByZWZlcmVuY2VzIHRvIFggd2lsbCBhbHNvIGJlIHJlbmFtZWQuIEhvd2V2ZXIsIGlmIGJvdGggdGhlIGltcG9ydCBhbmQgYW55IHJlZmVyZW5jZXMgYXJlXG4gKiBhZGRlZCBpbiBhIHRyYW5zZm9ybWVyLCBUeXBlU2NyaXB0IGRvZXMgbm90IGFzc29jaWF0ZSB0aGUgdHdvLCBhbmQgd2lsbCBsZWF2ZSB0aGUgXCJYXCIgcmVmZXJlbmNlc1xuICogZGFuZ2xpbmcgd2hpbGUgcmVuYW1pbmcgdGhlIGltcG9ydCB2YXJpYWJsZS4gVGhlIGdlbmVyYXRlZCBjb2RlIGxvb2tzIHNvbWV0aGluZyBsaWtlOlxuICpcbiAqIGNvbnN0IG1vZHVsZV8xID0gcmVxdWlyZSgnc29tZS9tb2R1bGUnKTtcbiAqIGNvbnNvbGUubG9nKFgpOyAvLyBub3cgWCBpcyBhIGRhbmdsaW5nIHJlZmVyZW5jZS5cbiAqXG4gKiBUaGVyZWZvcmUsIHdlIGNhbm5vdCBzeW50aGV0aWNhbGx5IGFkZCBkZWZhdWx0IGltcG9ydHMsIGFuZCBtdXN0IHJldXNlIHRoZSBpbXBvcnRzIHRoYXQgdXNlcnNcbiAqIGluY2x1ZGUuIERvaW5nIHRoaXMgcG9zZXMgYSBjaGFsbGVuZ2UgZm9yIGltcG9ydHMgdGhhdCBhcmUgb25seSBjb25zdW1lZCBpbiB0aGUgdHlwZSBwb3NpdGlvbiBpblxuICogdGhlIHVzZXIncyBjb2RlLiBJZiBBbmd1bGFyIHJldXNlcyB0aGUgaW1wb3J0ZWQgc3ltYm9sIGluIGEgdmFsdWUgcG9zaXRpb24gKGZvciBleGFtcGxlLCB3ZVxuICogc2VlIGEgY29uc3RydWN0b3IgcGFyYW1ldGVyIG9mIHR5cGUgRm9vIGFuZCB0cnkgdG8gd3JpdGUgXCJpbmplY3QoRm9vKVwiKSB3ZSB3aWxsIGFsc28gZW5kIHVwIHdpdGhcbiAqIGEgZGFuZ2xpbmcgcmVmZXJlbmNlLCBhcyBUUyB3aWxsIGVsaWRlIHRoZSBpbXBvcnQgYmVjYXVzZSBpdCB3YXMgb25seSB1c2VkIGluIHRoZSB0eXBlIHBvc2l0aW9uXG4gKiBvcmlnaW5hbGx5LlxuICpcbiAqIFRvIGF2b2lkIHRoaXMsIHRoZSBjb21waWxlciBtdXN0IFwidG91Y2hcIiB0aGUgaW1wb3J0cyB3aXRoIGB0cy51cGRhdGVJbXBvcnRDbGF1c2VgLCBhbmQgc2hvdWxkXG4gKiBvbmx5IGRvIHRoaXMgZm9yIGltcG9ydHMgd2hpY2ggYXJlIGFjdHVhbGx5IGNvbnN1bWVkLiBUaGUgYERlZmF1bHRJbXBvcnRUcmFja2VyYCBrZWVwcyB0cmFjayBvZlxuICogdGhlc2UgaW1wb3J0cyBhcyB0aGV5J3JlIGVuY291bnRlcmVkIGFuZCBlbWl0dGVkLCBhbmQgaW1wbGVtZW50cyBhIHRyYW5zZm9ybSB3aGljaCBjYW4gY29ycmVjdGx5XG4gKiBmbGFnIHRoZSBpbXBvcnRzIGFzIHJlcXVpcmVkLlxuICpcbiAqIFRoaXMgcHJvYmxlbSBkb2VzIG5vdCBleGlzdCBmb3Igbm9uLWRlZmF1bHQgaW1wb3J0cyBhcyB0aGUgY29tcGlsZXIgY2FuIGVhc2lseSBpbnNlcnRcbiAqIFwiaW1wb3J0ICogYXMgWFwiIHN0eWxlIGltcG9ydHMgZm9yIHRob3NlLCBhbmQgdGhlIFwiWFwiIGlkZW50aWZpZXIgc3Vydml2ZXMgdHJhbnNmb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0SW1wb3J0VHJhY2tlciBpbXBsZW1lbnRzIERlZmF1bHRJbXBvcnRSZWNvcmRlciB7XG4gIC8qKlxuICAgKiBBIGBNYXBgIHdoaWNoIHRyYWNrcyB0aGUgYE1hcGAgb2YgZGVmYXVsdCBpbXBvcnQgYHRzLklkZW50aWZpZXJgcyB0byB0aGVpclxuICAgKiBgdHMuSW1wb3J0RGVjbGFyYXRpb25gcy4gVGhlc2UgZGVjbGFyYXRpb25zIGFyZSBub3QgZ3VhcmFudGVlZCB0byBiZSB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBzb3VyY2VGaWxlVG9JbXBvcnRNYXAgPVxuICAgICAgbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBNYXA8dHMuSWRlbnRpZmllciwgdHMuSW1wb3J0RGVjbGFyYXRpb24+PigpO1xuXG4gIC8qKlxuICAgKiBBIGBNYXBgIHdoaWNoIHRyYWNrcyB0aGUgYFNldGAgb2YgYHRzLkltcG9ydERlY2xhcmF0aW9uYHMgZm9yIGRlZmF1bHQgaW1wb3J0cyB0aGF0IHdlcmUgdXNlZCBpblxuICAgKiBhIGdpdmVuIGB0cy5Tb3VyY2VGaWxlYCBhbmQgbmVlZCB0byBiZSBwcmVzZXJ2ZWQuXG4gICAqL1xuICBwcml2YXRlIHNvdXJjZUZpbGVUb1VzZWRJbXBvcnRzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBTZXQ8dHMuSW1wb3J0RGVjbGFyYXRpb24+PigpO1xuICByZWNvcmRJbXBvcnRlZElkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIsIGRlY2w6IHRzLkltcG9ydERlY2xhcmF0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qgc2YgPSBnZXRTb3VyY2VGaWxlKGlkKTtcbiAgICBpZiAoIXRoaXMuc291cmNlRmlsZVRvSW1wb3J0TWFwLmhhcyhzZikpIHtcbiAgICAgIHRoaXMuc291cmNlRmlsZVRvSW1wb3J0TWFwLnNldChzZiwgbmV3IE1hcDx0cy5JZGVudGlmaWVyLCB0cy5JbXBvcnREZWNsYXJhdGlvbj4oKSk7XG4gICAgfVxuICAgIHRoaXMuc291cmNlRmlsZVRvSW1wb3J0TWFwLmdldChzZikgIS5zZXQoaWQsIGRlY2wpO1xuICB9XG5cbiAgcmVjb3JkVXNlZElkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiB2b2lkIHtcbiAgICBjb25zdCBzZiA9IGdldFNvdXJjZUZpbGUoaWQpO1xuICAgIGlmICghdGhpcy5zb3VyY2VGaWxlVG9JbXBvcnRNYXAuaGFzKHNmKSkge1xuICAgICAgLy8gVGhlIGlkZW50aWZpZXIncyBzb3VyY2UgZmlsZSBoYXMgbm8gcmVnaXN0ZXJlZCBkZWZhdWx0IGltcG9ydHMgYXQgYWxsLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpZGVudGlmZXJUb0RlY2xhcmF0aW9uID0gdGhpcy5zb3VyY2VGaWxlVG9JbXBvcnRNYXAuZ2V0KHNmKSAhO1xuICAgIGlmICghaWRlbnRpZmVyVG9EZWNsYXJhdGlvbi5oYXMoaWQpKSB7XG4gICAgICAvLyBUaGUgaWRlbnRpZmllciBpc24ndCBmcm9tIGEgcmVnaXN0ZXJlZCBkZWZhdWx0IGltcG9ydC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGVjbCA9IGlkZW50aWZlclRvRGVjbGFyYXRpb24uZ2V0KGlkKSAhO1xuXG4gICAgLy8gQWRkIHRoZSBkZWZhdWx0IGltcG9ydCBkZWNsYXJhdGlvbiB0byB0aGUgc2V0IG9mIHVzZWQgaW1wb3J0IGRlY2xhcmF0aW9ucyBmb3IgdGhlIGZpbGUuXG4gICAgaWYgKCF0aGlzLnNvdXJjZUZpbGVUb1VzZWRJbXBvcnRzLmhhcyhzZikpIHtcbiAgICAgIHRoaXMuc291cmNlRmlsZVRvVXNlZEltcG9ydHMuc2V0KHNmLCBuZXcgU2V0PHRzLkltcG9ydERlY2xhcmF0aW9uPigpKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2VGaWxlVG9Vc2VkSW1wb3J0cy5nZXQoc2YpICEuYWRkKGRlY2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGB0cy5UcmFuc2Zvcm1lckZhY3RvcnlgIHdoaWNoIHdpbGwgcHJlc2VydmUgZGVmYXVsdCBpbXBvcnRzIHRoYXQgd2VyZSBwcmV2aW91c2x5IG1hcmtlZFxuICAgKiBhcyB1c2VkLlxuICAgKlxuICAgKiBUaGlzIHRyYW5zZm9ybWVyIG11c3QgcnVuIGFmdGVyIGFueSBvdGhlciB0cmFuc2Zvcm1lcnMgd2hpY2ggY2FsbCBgcmVjb3JkVXNlZElkZW50aWZpZXJgLlxuICAgKi9cbiAgaW1wb3J0UHJlc2VydmluZ1RyYW5zZm9ybWVyKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gICAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpID0+IHtcbiAgICAgIHJldHVybiAoc2Y6IHRzLlNvdXJjZUZpbGUpID0+IHsgcmV0dXJuIHRoaXMudHJhbnNmb3JtU291cmNlRmlsZShzZik7IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgYHRzLlNvdXJjZUZpbGVgIGFuZCByZXBsYWNlIGFueSBgdHMuSW1wb3J0RGVjbGFyYXRpb25gcy5cbiAgICovXG4gIHByaXZhdGUgdHJhbnNmb3JtU291cmNlRmlsZShzZjogdHMuU291cmNlRmlsZSk6IHRzLlNvdXJjZUZpbGUge1xuICAgIGNvbnN0IG9yaWdpbmFsU2YgPSB0cy5nZXRPcmlnaW5hbE5vZGUoc2YpIGFzIHRzLlNvdXJjZUZpbGU7XG4gICAgLy8gVGFrZSBhIGZhc3QgcGF0aCBpZiBubyBpbXBvcnQgZGVjbGFyYXRpb25zIG5lZWQgdG8gYmUgcHJlc2VydmVkIGluIHRoZSBmaWxlLlxuICAgIGlmICghdGhpcy5zb3VyY2VGaWxlVG9Vc2VkSW1wb3J0cy5oYXMob3JpZ2luYWxTZikpIHtcbiAgICAgIHJldHVybiBzZjtcbiAgICB9XG5cbiAgICAvLyBUaGVyZSBhcmUgZGVjbGFyYXRpb25zIHRoYXQgbmVlZCB0byBiZSBwcmVzZXJ2ZWQuXG4gICAgY29uc3QgaW1wb3J0c1RvUHJlc2VydmUgPSB0aGlzLnNvdXJjZUZpbGVUb1VzZWRJbXBvcnRzLmdldChvcmlnaW5hbFNmKSAhO1xuXG4gICAgLy8gR2VuZXJhdGUgYSBuZXcgc3RhdGVtZW50IGxpc3Qgd2hpY2ggcHJlc2VydmVzIGFueSBpbXBvcnRzIHByZXNlbnQgaW4gYGltcG9ydHNUb1ByZXNlcnZlYC5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gc2Yuc3RhdGVtZW50cy5tYXAoc3RtdCA9PiB7XG4gICAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihzdG10KSAmJiBpbXBvcnRzVG9QcmVzZXJ2ZS5oYXMoc3RtdCkpIHtcbiAgICAgICAgLy8gUHJlc2VydmluZyBhbiBpbXBvcnQgdGhhdCdzIG1hcmtlZCBhcyB1bnJlZmVyZW5jZWQgKHR5cGUtb25seSkgaXMgdHJpY2t5IGluIFR5cGVTY3JpcHQuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFZhcmlvdXMgYXBwcm9hY2hlcyBoYXZlIGJlZW4gdHJpZWQsIHdpdGggbWl4ZWQgc3VjY2VzczpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gMS4gVXNpbmcgYHRzLnVwZGF0ZUltcG9ydERlY2xhcmF0aW9uYCBkb2VzIG5vdCBjYXVzZSB0aGUgaW1wb3J0IHRvIGJlIHJldGFpbmVkLlxuICAgICAgICAvL1xuICAgICAgICAvLyAyLiBVc2luZyBgdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb25gIHdpdGggdGhlIHNhbWUgYHRzLkltcG9ydENsYXVzZWAgY2F1c2VzIHRoZSBpbXBvcnRcbiAgICAgICAgLy8gICAgdG8gY29ycmVjdGx5IGJlIHJldGFpbmVkLCBidXQgd2hlbiBlbWl0dGluZyBDb21tb25KUyBtb2R1bGUgZm9ybWF0IGNvZGUsIHJlZmVyZW5jZXNcbiAgICAgICAgLy8gICAgdG8gdGhlIGltcG9ydGVkIHZhbHVlIHdpbGwgbm90IG1hdGNoIHRoZSBpbXBvcnQgdmFyaWFibGUuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIDMuIEVtaXR0aW5nIFwiaW1wb3J0ICogYXNcIiBpbXBvcnRzIGluc3RlYWQgZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IGltcG9ydCB2YXJpYWJsZSwgYnV0XG4gICAgICAgIC8vICAgIHJlZmVyZW5jZXMgYXJlIG1pc3NpbmcgdGhlIFwiLmRlZmF1bHRcIiBhY2Nlc3MuIFRoaXMgaGFwcGVucyB0byB3b3JrIGZvciB0c2lja2xlIGNvZGVcbiAgICAgICAgLy8gICAgd2l0aCBnb29nLm1vZHVsZSB0cmFuc2Zvcm1hdGlvbnMgYXMgdHNpY2tsZSBzdHJpcHMgdGhlIFwiLmRlZmF1bHRcIiBhbnl3YXkuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIDQuIEl0J3MgcG9zc2libGUgdG8gdHJpY2sgVHlwZVNjcmlwdCBieSBzZXR0aW5nIGB0cy5Ob2RlRmxhZy5TeW50aGVzaXplZGAgb24gdGhlIGltcG9ydFxuICAgICAgICAvLyAgICBkZWNsYXJhdGlvbi4gVGhpcyBjYXVzZXMgdGhlIGltcG9ydCB0byBiZSBjb3JyZWN0bHkgcmV0YWluZWQgYW5kIGdlbmVyYXRlZCwgYnV0IGNhblxuICAgICAgICAvLyAgICB2aW9sYXRlIGludmFyaWFudHMgZWxzZXdoZXJlIGluIHRoZSBjb21waWxlciBhbmQgY2F1c2UgY3Jhc2hlcy5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gNS4gVXNpbmcgYHRzLmdldE11dGFibGVDbG9uZWAgc2VlbXMgdG8gY29ycmVjdGx5IHByZXNlcnZlIHRoZSBpbXBvcnQgYW5kIGNvcnJlY3RseVxuICAgICAgICAvLyAgICBnZW5lcmF0ZSByZWZlcmVuY2VzIHRvIHRoZSBpbXBvcnQgdmFyaWFibGUgYWNyb3NzIGFsbCBtb2R1bGUgdHlwZXMuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZXJlZm9yZSwgb3B0aW9uIDUgaXMgdGhlIG9uZSB1c2VkIGhlcmUuIEl0IHNlZW1zIHRvIGJlIGltcGxlbWVudGVkIGFzIHRoZSBjb3JyZWN0IHdheVxuICAgICAgICAvLyB0byBwZXJmb3JtIG9wdGlvbiA0LCB3aGljaCBwcmVzZXJ2ZXMgYWxsIHRoZSBjb21waWxlcidzIGludmFyaWFudHMuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRPRE8oYWx4aHViKTogZGlzY3VzcyB3aXRoIHRoZSBUeXBlU2NyaXB0IHRlYW0gYW5kIGRldGVybWluZSBpZiB0aGVyZSdzIGEgYmV0dGVyIHdheSB0b1xuICAgICAgICAvLyBkZWFsIHdpdGggdGhpcyBpc3N1ZS5cbiAgICAgICAgc3RtdCA9IHRzLmdldE11dGFibGVDbG9uZShzdG10KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdG10O1xuICAgIH0pO1xuXG4gICAgLy8gU2F2ZSBtZW1vcnkgLSB0aGVyZSdzIG5vIG5lZWQgdG8ga2VlcCB0aGVzZSBhcm91bmQgb25jZSB0aGUgdHJhbnNmb3JtIGhhcyBydW4gZm9yIHRoZSBnaXZlblxuICAgIC8vIGZpbGUuXG4gICAgdGhpcy5zb3VyY2VGaWxlVG9JbXBvcnRNYXAuZGVsZXRlKG9yaWdpbmFsU2YpO1xuICAgIHRoaXMuc291cmNlRmlsZVRvVXNlZEltcG9ydHMuZGVsZXRlKG9yaWdpbmFsU2YpO1xuXG4gICAgcmV0dXJuIHRzLnVwZGF0ZVNvdXJjZUZpbGVOb2RlKHNmLCBzdGF0ZW1lbnRzKTtcbiAgfVxufVxuIl19
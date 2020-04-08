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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A value member of an enumeration.
     *
     * Contains a `Reference` to the enumeration itself, and the name of the referenced member.
     */
    var EnumValue = /** @class */ (function () {
        function EnumValue(enumRef, name, resolved) {
            this.enumRef = enumRef;
            this.name = name;
            this.resolved = resolved;
        }
        return EnumValue;
    }());
    exports.EnumValue = EnumValue;
    /**
     * An implementation of a builtin function, such as `Array.prototype.slice`.
     */
    var BuiltinFn = /** @class */ (function () {
        function BuiltinFn() {
        }
        return BuiltinFn;
    }());
    exports.BuiltinFn = BuiltinFn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9wYXJ0aWFsX2V2YWx1YXRvci9zcmMvcmVzdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBbUNIOzs7O09BSUc7SUFDSDtRQUNFLG1CQUNhLE9BQXNDLEVBQVcsSUFBWSxFQUM3RCxRQUF1QjtZQUR2QixZQUFPLEdBQVAsT0FBTyxDQUErQjtZQUFXLFNBQUksR0FBSixJQUFJLENBQVE7WUFDN0QsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUFHLENBQUM7UUFDMUMsZ0JBQUM7SUFBRCxDQUFDLEFBSkQsSUFJQztJQUpZLDhCQUFTO0lBTXRCOztPQUVHO0lBQ0g7UUFBQTtRQUE4RixDQUFDO1FBQUQsZ0JBQUM7SUFBRCxDQUFDLEFBQS9GLElBQStGO0lBQXpFLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuXG5pbXBvcnQge0R5bmFtaWNWYWx1ZX0gZnJvbSAnLi9keW5hbWljJztcblxuXG4vKipcbiAqIEEgdmFsdWUgcmVzdWx0aW5nIGZyb20gc3RhdGljIHJlc29sdXRpb24uXG4gKlxuICogVGhpcyBjb3VsZCBiZSBhIHByaW1pdGl2ZSwgY29sbGVjdGlvbiB0eXBlLCByZWZlcmVuY2UgdG8gYSBgdHMuTm9kZWAgdGhhdCBkZWNsYXJlcyBhXG4gKiBub24tcHJpbWl0aXZlIHZhbHVlLCBvciBhIHNwZWNpYWwgYER5bmFtaWNWYWx1ZWAgdHlwZSB3aGljaCBpbmRpY2F0ZXMgdGhlIHZhbHVlIHdhcyBub3RcbiAqIGF2YWlsYWJsZSBzdGF0aWNhbGx5LlxuICovXG5leHBvcnQgdHlwZSBSZXNvbHZlZFZhbHVlID0gbnVtYmVyIHwgYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQgfCBSZWZlcmVuY2UgfCBFbnVtVmFsdWUgfFxuICAgIFJlc29sdmVkVmFsdWVBcnJheSB8IFJlc29sdmVkVmFsdWVNYXAgfCBCdWlsdGluRm4gfCBEeW5hbWljVmFsdWU8dW5rbm93bj47XG5cbi8qKlxuICogQW4gYXJyYXkgb2YgYFJlc29sdmVkVmFsdWVgcy5cbiAqXG4gKiBUaGlzIGlzIGEgcmVpZmllZCB0eXBlIHRvIGFsbG93IHRoZSBjaXJjdWxhciByZWZlcmVuY2Ugb2YgYFJlc29sdmVkVmFsdWVgIC0+IGBSZXNvbHZlZFZhbHVlQXJyYXlgXG4gKiAtPlxuICogYFJlc29sdmVkVmFsdWVgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc29sdmVkVmFsdWVBcnJheSBleHRlbmRzIEFycmF5PFJlc29sdmVkVmFsdWU+IHt9XG5cbi8qKlxuICogQSBtYXAgb2Ygc3RyaW5ncyB0byBgUmVzb2x2ZWRWYWx1ZWBzLlxuICpcbiAqIFRoaXMgaXMgYSByZWlmaWVkIHR5cGUgdG8gYWxsb3cgdGhlIGNpcmN1bGFyIHJlZmVyZW5jZSBvZiBgUmVzb2x2ZWRWYWx1ZWAgLT4gYFJlc29sdmVkVmFsdWVNYXBgIC0+XG4gKiBgUmVzb2x2ZWRWYWx1ZWAuXG4gKi8gZXhwb3J0IGludGVyZmFjZSBSZXNvbHZlZFZhbHVlTWFwIGV4dGVuZHMgTWFwPHN0cmluZywgUmVzb2x2ZWRWYWx1ZT4ge31cblxuLyoqXG4gKiBBIHZhbHVlIG1lbWJlciBvZiBhbiBlbnVtZXJhdGlvbi5cbiAqXG4gKiBDb250YWlucyBhIGBSZWZlcmVuY2VgIHRvIHRoZSBlbnVtZXJhdGlvbiBpdHNlbGYsIGFuZCB0aGUgbmFtZSBvZiB0aGUgcmVmZXJlbmNlZCBtZW1iZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnVtVmFsdWUge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IGVudW1SZWY6IFJlZmVyZW5jZTx0cy5FbnVtRGVjbGFyYXRpb24+LCByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgICByZWFkb25seSByZXNvbHZlZDogUmVzb2x2ZWRWYWx1ZSkge31cbn1cblxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiBhIGJ1aWx0aW4gZnVuY3Rpb24sIHN1Y2ggYXMgYEFycmF5LnByb3RvdHlwZS5zbGljZWAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWlsdGluRm4geyBhYnN0cmFjdCBldmFsdWF0ZShhcmdzOiBSZXNvbHZlZFZhbHVlQXJyYXkpOiBSZXNvbHZlZFZhbHVlOyB9XG4iXX0=
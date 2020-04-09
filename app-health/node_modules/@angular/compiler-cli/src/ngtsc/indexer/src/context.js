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
        define("@angular/compiler-cli/src/ngtsc/indexer/src/context", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A context for storing indexing infromation about components of a program.
     *
     * An `IndexingContext` collects component and template analysis information from
     * `DecoratorHandler`s and exposes them to be indexed.
     */
    var IndexingContext = /** @class */ (function () {
        function IndexingContext() {
            this.components = new Set();
        }
        /**
         * Adds a component to the context.
         */
        IndexingContext.prototype.addComponent = function (info) { this.components.add(info); };
        return IndexingContext;
    }());
    exports.IndexingContext = IndexingContext;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaW5kZXhlci9zcmMvY29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQXdDSDs7Ozs7T0FLRztJQUNIO1FBQUE7WUFDVyxlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7UUFNakQsQ0FBQztRQUpDOztXQUVHO1FBQ0gsc0NBQVksR0FBWixVQUFhLElBQW1CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLHNCQUFDO0lBQUQsQ0FBQyxBQVBELElBT0M7SUFQWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb3VuZFRhcmdldCwgRGlyZWN0aXZlTWV0YSwgUGFyc2VTb3VyY2VGaWxlfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudE1ldGEgZXh0ZW5kcyBEaXJlY3RpdmVNZXRhIHtcbiAgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj47XG4gIC8qKlxuICAgKiBVbnBhcnNlZCBzZWxlY3RvciBvZiB0aGUgZGlyZWN0aXZlLlxuICAgKi9cbiAgc2VsZWN0b3I6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb24gb2YgYSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50SW5mbyB7XG4gIC8qKiBDb21wb25lbnQgVHlwZVNjcmlwdCBjbGFzcyBkZWNsYXJhdGlvbiAqL1xuICBkZWNsYXJhdGlvbjogQ2xhc3NEZWNsYXJhdGlvbjtcblxuICAvKiogQ29tcG9uZW50IHRlbXBsYXRlIHNlbGVjdG9yIGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlIG51bGwuICovXG4gIHNlbGVjdG9yOiBzdHJpbmd8bnVsbDtcblxuICAvKipcbiAgICogQm91bmRUYXJnZXQgY29udGFpbmluZyB0aGUgcGFyc2VkIHRlbXBsYXRlLiBDYW4gYWxzbyBiZSB1c2VkIHRvIHF1ZXJ5IGZvciBkaXJlY3RpdmVzIHVzZWQgaW5cbiAgICogdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgYm91bmRUZW1wbGF0ZTogQm91bmRUYXJnZXQ8Q29tcG9uZW50TWV0YT47XG5cbiAgLyoqIE1ldGFkYXRhIGFib3V0IHRoZSB0ZW1wbGF0ZSAqL1xuICB0ZW1wbGF0ZU1ldGE6IHtcbiAgICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IHRlbXBsYXRlIGlzIGlubGluZSAqL1xuICAgIGlzSW5saW5lOiBib29sZWFuO1xuXG4gICAgLyoqIFRlbXBsYXRlIGZpbGUgcmVjb3JkZWQgYnkgdGVtcGxhdGUgcGFyc2VyICovXG4gICAgZmlsZTogUGFyc2VTb3VyY2VGaWxlO1xuICB9O1xufVxuXG4vKipcbiAqIEEgY29udGV4dCBmb3Igc3RvcmluZyBpbmRleGluZyBpbmZyb21hdGlvbiBhYm91dCBjb21wb25lbnRzIG9mIGEgcHJvZ3JhbS5cbiAqXG4gKiBBbiBgSW5kZXhpbmdDb250ZXh0YCBjb2xsZWN0cyBjb21wb25lbnQgYW5kIHRlbXBsYXRlIGFuYWx5c2lzIGluZm9ybWF0aW9uIGZyb21cbiAqIGBEZWNvcmF0b3JIYW5kbGVyYHMgYW5kIGV4cG9zZXMgdGhlbSB0byBiZSBpbmRleGVkLlxuICovXG5leHBvcnQgY2xhc3MgSW5kZXhpbmdDb250ZXh0IHtcbiAgcmVhZG9ubHkgY29tcG9uZW50cyA9IG5ldyBTZXQ8Q29tcG9uZW50SW5mbz4oKTtcblxuICAvKipcbiAgICogQWRkcyBhIGNvbXBvbmVudCB0byB0aGUgY29udGV4dC5cbiAgICovXG4gIGFkZENvbXBvbmVudChpbmZvOiBDb21wb25lbnRJbmZvKSB7IHRoaXMuY29tcG9uZW50cy5hZGQoaW5mbyk7IH1cbn1cbiJdfQ==
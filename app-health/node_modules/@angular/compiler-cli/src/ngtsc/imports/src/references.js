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
        define("@angular/compiler-cli/src/ngtsc/imports/src/references", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var ImportMode;
    (function (ImportMode) {
        ImportMode[ImportMode["UseExistingImport"] = 0] = "UseExistingImport";
        ImportMode[ImportMode["ForceNewImport"] = 1] = "ForceNewImport";
    })(ImportMode = exports.ImportMode || (exports.ImportMode = {}));
    /**
     * A `ts.Node` plus the context in which it was discovered.
     *
     * A `Reference` is a pointer to a `ts.Node` that was extracted from the program somehow. It
     * contains not only the node itself, but the information regarding how the node was located. In
     * particular, it might track different identifiers by which the node is exposed, as well as
     * potentially a module specifier which might expose the node.
     *
     * The Angular compiler uses `Reference`s instead of `ts.Node`s when tracking classes or generating
     * imports.
     */
    var Reference = /** @class */ (function () {
        function Reference(node, bestGuessOwningModule) {
            if (bestGuessOwningModule === void 0) { bestGuessOwningModule = null; }
            this.node = node;
            this.identifiers = [];
            /**
             * Indicates that the Reference was created synthetically, not as a result of natural value
             * resolution.
             *
             * This is used to avoid misinterpreting the Reference in certain contexts.
             */
            this.synthetic = false;
            this._alias = null;
            this.bestGuessOwningModule = bestGuessOwningModule;
            var id = typescript_1.identifierOfNode(node);
            if (id !== null) {
                this.identifiers.push(id);
            }
        }
        Object.defineProperty(Reference.prototype, "ownedByModuleGuess", {
            /**
             * The best guess at which module specifier owns this particular reference, or `null` if there
             * isn't one.
             */
            get: function () {
                if (this.bestGuessOwningModule !== null) {
                    return this.bestGuessOwningModule.specifier;
                }
                else {
                    return null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Reference.prototype, "hasOwningModuleGuess", {
            /**
             * Whether this reference has a potential owning module or not.
             *
             * See `bestGuessOwningModule`.
             */
            get: function () { return this.bestGuessOwningModule !== null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Reference.prototype, "debugName", {
            /**
             * A name for the node, if one is available.
             *
             * This is only suited for debugging. Any actual references to this node should be made with
             * `ts.Identifier`s (see `getIdentityIn`).
             */
            get: function () {
                var id = typescript_1.identifierOfNode(this.node);
                return id !== null ? id.text : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Reference.prototype, "alias", {
            get: function () { return this._alias; },
            enumerable: true,
            configurable: true
        });
        /**
         * Record a `ts.Identifier` by which it's valid to refer to this node, within the context of this
         * `Reference`.
         */
        Reference.prototype.addIdentifier = function (identifier) { this.identifiers.push(identifier); };
        /**
         * Get a `ts.Identifier` within this `Reference` that can be used to refer within the context of a
         * given `ts.SourceFile`, if any.
         */
        Reference.prototype.getIdentityIn = function (context) {
            return this.identifiers.find(function (id) { return id.getSourceFile() === context; }) || null;
        };
        Reference.prototype.cloneWithAlias = function (alias) {
            var ref = new Reference(this.node, this.bestGuessOwningModule);
            ref.identifiers = tslib_1.__spread(this.identifiers);
            ref._alias = alias;
            return ref;
        };
        Reference.prototype.cloneWithNoIdentifiers = function () {
            var ref = new Reference(this.node, this.bestGuessOwningModule);
            ref._alias = this._alias;
            ref.identifiers = [];
            return ref;
        };
        return Reference;
    }());
    exports.Reference = Reference;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaW1wb3J0cy9zcmMvcmVmZXJlbmNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFLSCxrRkFBMkQ7SUFFM0QsSUFBWSxVQUdYO0lBSEQsV0FBWSxVQUFVO1FBQ3BCLHFFQUFpQixDQUFBO1FBQ2pCLCtEQUFjLENBQUE7SUFDaEIsQ0FBQyxFQUhXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBR3JCO0lBT0Q7Ozs7Ozs7Ozs7T0FVRztJQUNIO1FBMkJFLG1CQUFxQixJQUFPLEVBQUUscUJBQStDO1lBQS9DLHNDQUFBLEVBQUEsNEJBQStDO1lBQXhELFNBQUksR0FBSixJQUFJLENBQUc7WUFacEIsZ0JBQVcsR0FBb0IsRUFBRSxDQUFDO1lBRTFDOzs7OztlQUtHO1lBQ0gsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUVWLFdBQU0sR0FBb0IsSUFBSSxDQUFDO1lBR3JDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztZQUVuRCxJQUFNLEVBQUUsR0FBRyw2QkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDM0I7UUFDSCxDQUFDO1FBTUQsc0JBQUkseUNBQWtCO1lBSnRCOzs7ZUFHRztpQkFDSDtnQkFDRSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxJQUFJLEVBQUU7b0JBQ3ZDLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQztpQkFDN0M7cUJBQU07b0JBQ0wsT0FBTyxJQUFJLENBQUM7aUJBQ2I7WUFDSCxDQUFDOzs7V0FBQTtRQU9ELHNCQUFJLDJDQUFvQjtZQUx4Qjs7OztlQUlHO2lCQUNILGNBQXNDLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBUW5GLHNCQUFJLGdDQUFTO1lBTmI7Ozs7O2VBS0c7aUJBQ0g7Z0JBQ0UsSUFBTSxFQUFFLEdBQUcsNkJBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN0QyxDQUFDOzs7V0FBQTtRQUVELHNCQUFJLDRCQUFLO2lCQUFULGNBQStCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBR3BEOzs7V0FHRztRQUNILGlDQUFhLEdBQWIsVUFBYyxVQUF5QixJQUFVLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyRjs7O1dBR0c7UUFDSCxpQ0FBYSxHQUFiLFVBQWMsT0FBc0I7WUFDbEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxPQUFPLEVBQTlCLENBQThCLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDN0UsQ0FBQztRQUVELGtDQUFjLEdBQWQsVUFBZSxLQUFpQjtZQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2pFLEdBQUcsQ0FBQyxXQUFXLG9CQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4QyxHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNuQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFFRCwwQ0FBc0IsR0FBdEI7WUFDRSxJQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2pFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN6QixHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUNyQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDSCxnQkFBQztJQUFELENBQUMsQUFoR0QsSUFnR0M7SUFoR1ksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXhwcmVzc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7aWRlbnRpZmllck9mTm9kZX0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbmV4cG9ydCBlbnVtIEltcG9ydE1vZGUge1xuICBVc2VFeGlzdGluZ0ltcG9ydCxcbiAgRm9yY2VOZXdJbXBvcnQsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3duaW5nTW9kdWxlIHtcbiAgc3BlY2lmaWVyOiBzdHJpbmc7XG4gIHJlc29sdXRpb25Db250ZXh0OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBgdHMuTm9kZWAgcGx1cyB0aGUgY29udGV4dCBpbiB3aGljaCBpdCB3YXMgZGlzY292ZXJlZC5cbiAqXG4gKiBBIGBSZWZlcmVuY2VgIGlzIGEgcG9pbnRlciB0byBhIGB0cy5Ob2RlYCB0aGF0IHdhcyBleHRyYWN0ZWQgZnJvbSB0aGUgcHJvZ3JhbSBzb21laG93LiBJdFxuICogY29udGFpbnMgbm90IG9ubHkgdGhlIG5vZGUgaXRzZWxmLCBidXQgdGhlIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBob3cgdGhlIG5vZGUgd2FzIGxvY2F0ZWQuIEluXG4gKiBwYXJ0aWN1bGFyLCBpdCBtaWdodCB0cmFjayBkaWZmZXJlbnQgaWRlbnRpZmllcnMgYnkgd2hpY2ggdGhlIG5vZGUgaXMgZXhwb3NlZCwgYXMgd2VsbCBhc1xuICogcG90ZW50aWFsbHkgYSBtb2R1bGUgc3BlY2lmaWVyIHdoaWNoIG1pZ2h0IGV4cG9zZSB0aGUgbm9kZS5cbiAqXG4gKiBUaGUgQW5ndWxhciBjb21waWxlciB1c2VzIGBSZWZlcmVuY2VgcyBpbnN0ZWFkIG9mIGB0cy5Ob2RlYHMgd2hlbiB0cmFja2luZyBjbGFzc2VzIG9yIGdlbmVyYXRpbmdcbiAqIGltcG9ydHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2U8VCBleHRlbmRzIHRzLk5vZGUgPSB0cy5Ob2RlPiB7XG4gIC8qKlxuICAgKiBUaGUgY29tcGlsZXIncyBiZXN0IGd1ZXNzIGF0IGFuIGFic29sdXRlIG1vZHVsZSBzcGVjaWZpZXIgd2hpY2ggb3ducyB0aGlzIGBSZWZlcmVuY2VgLlxuICAgKlxuICAgKiBUaGlzIGlzIHVzdWFsbHkgZGV0ZXJtaW5lZCBieSB0cmFja2luZyB0aGUgaW1wb3J0IHN0YXRlbWVudHMgd2hpY2ggbGVkIHRoZSBjb21waWxlciB0byBhIGdpdmVuXG4gICAqIG5vZGUuIElmIGFueSBvZiB0aGVzZSBpbXBvcnRzIGFyZSBhYnNvbHV0ZSwgaXQncyBhbiBpbmRpY2F0aW9uIHRoYXQgdGhlIG5vZGUgYmVpbmcgaW1wb3J0ZWRcbiAgICogbWlnaHQgY29tZSBmcm9tIHRoYXQgbW9kdWxlLlxuICAgKlxuICAgKiBJdCBpcyBub3QgX2d1YXJhbnRlZWRfIHRoYXQgdGhlIG5vZGUgaW4gcXVlc3Rpb24gaXMgZXhwb3J0ZWQgZnJvbSBpdHMgYGJlc3RHdWVzc093bmluZ01vZHVsZWAgLVxuICAgKiB0aGF0IGlzIG1vc3RseSBhIGNvbnZlbnRpb24gdGhhdCBhcHBsaWVzIGluIGNlcnRhaW4gcGFja2FnZSBmb3JtYXRzLlxuICAgKlxuICAgKiBJZiBgYmVzdEd1ZXNzT3duaW5nTW9kdWxlYCBpcyBgbnVsbGAsIHRoZW4gaXQncyBsaWtlbHkgdGhlIG5vZGUgY2FtZSBmcm9tIHRoZSBjdXJyZW50IHByb2dyYW0uXG4gICAqL1xuICByZWFkb25seSBiZXN0R3Vlc3NPd25pbmdNb2R1bGU6IE93bmluZ01vZHVsZXxudWxsO1xuXG4gIHByaXZhdGUgaWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCB0aGUgUmVmZXJlbmNlIHdhcyBjcmVhdGVkIHN5bnRoZXRpY2FsbHksIG5vdCBhcyBhIHJlc3VsdCBvZiBuYXR1cmFsIHZhbHVlXG4gICAqIHJlc29sdXRpb24uXG4gICAqXG4gICAqIFRoaXMgaXMgdXNlZCB0byBhdm9pZCBtaXNpbnRlcnByZXRpbmcgdGhlIFJlZmVyZW5jZSBpbiBjZXJ0YWluIGNvbnRleHRzLlxuICAgKi9cbiAgc3ludGhldGljID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfYWxpYXM6IEV4cHJlc3Npb258bnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbm9kZTogVCwgYmVzdEd1ZXNzT3duaW5nTW9kdWxlOiBPd25pbmdNb2R1bGV8bnVsbCA9IG51bGwpIHtcbiAgICB0aGlzLmJlc3RHdWVzc093bmluZ01vZHVsZSA9IGJlc3RHdWVzc093bmluZ01vZHVsZTtcblxuICAgIGNvbnN0IGlkID0gaWRlbnRpZmllck9mTm9kZShub2RlKTtcbiAgICBpZiAoaWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaWRlbnRpZmllcnMucHVzaChpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiZXN0IGd1ZXNzIGF0IHdoaWNoIG1vZHVsZSBzcGVjaWZpZXIgb3ducyB0aGlzIHBhcnRpY3VsYXIgcmVmZXJlbmNlLCBvciBgbnVsbGAgaWYgdGhlcmVcbiAgICogaXNuJ3Qgb25lLlxuICAgKi9cbiAgZ2V0IG93bmVkQnlNb2R1bGVHdWVzcygpOiBzdHJpbmd8bnVsbCB7XG4gICAgaWYgKHRoaXMuYmVzdEd1ZXNzT3duaW5nTW9kdWxlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5iZXN0R3Vlc3NPd25pbmdNb2R1bGUuc3BlY2lmaWVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHJlZmVyZW5jZSBoYXMgYSBwb3RlbnRpYWwgb3duaW5nIG1vZHVsZSBvciBub3QuXG4gICAqXG4gICAqIFNlZSBgYmVzdEd1ZXNzT3duaW5nTW9kdWxlYC5cbiAgICovXG4gIGdldCBoYXNPd25pbmdNb2R1bGVHdWVzcygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuYmVzdEd1ZXNzT3duaW5nTW9kdWxlICE9PSBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIG5vZGUsIGlmIG9uZSBpcyBhdmFpbGFibGUuXG4gICAqXG4gICAqIFRoaXMgaXMgb25seSBzdWl0ZWQgZm9yIGRlYnVnZ2luZy4gQW55IGFjdHVhbCByZWZlcmVuY2VzIHRvIHRoaXMgbm9kZSBzaG91bGQgYmUgbWFkZSB3aXRoXG4gICAqIGB0cy5JZGVudGlmaWVyYHMgKHNlZSBgZ2V0SWRlbnRpdHlJbmApLlxuICAgKi9cbiAgZ2V0IGRlYnVnTmFtZSgpOiBzdHJpbmd8bnVsbCB7XG4gICAgY29uc3QgaWQgPSBpZGVudGlmaWVyT2ZOb2RlKHRoaXMubm9kZSk7XG4gICAgcmV0dXJuIGlkICE9PSBudWxsID8gaWQudGV4dCA6IG51bGw7XG4gIH1cblxuICBnZXQgYWxpYXMoKTogRXhwcmVzc2lvbnxudWxsIHsgcmV0dXJuIHRoaXMuX2FsaWFzOyB9XG5cblxuICAvKipcbiAgICogUmVjb3JkIGEgYHRzLklkZW50aWZpZXJgIGJ5IHdoaWNoIGl0J3MgdmFsaWQgdG8gcmVmZXIgdG8gdGhpcyBub2RlLCB3aXRoaW4gdGhlIGNvbnRleHQgb2YgdGhpc1xuICAgKiBgUmVmZXJlbmNlYC5cbiAgICovXG4gIGFkZElkZW50aWZpZXIoaWRlbnRpZmllcjogdHMuSWRlbnRpZmllcik6IHZvaWQgeyB0aGlzLmlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7IH1cblxuICAvKipcbiAgICogR2V0IGEgYHRzLklkZW50aWZpZXJgIHdpdGhpbiB0aGlzIGBSZWZlcmVuY2VgIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXIgd2l0aGluIHRoZSBjb250ZXh0IG9mIGFcbiAgICogZ2l2ZW4gYHRzLlNvdXJjZUZpbGVgLCBpZiBhbnkuXG4gICAqL1xuICBnZXRJZGVudGl0eUluKGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUpOiB0cy5JZGVudGlmaWVyfG51bGwge1xuICAgIHJldHVybiB0aGlzLmlkZW50aWZpZXJzLmZpbmQoaWQgPT4gaWQuZ2V0U291cmNlRmlsZSgpID09PSBjb250ZXh0KSB8fCBudWxsO1xuICB9XG5cbiAgY2xvbmVXaXRoQWxpYXMoYWxpYXM6IEV4cHJlc3Npb24pOiBSZWZlcmVuY2U8VD4ge1xuICAgIGNvbnN0IHJlZiA9IG5ldyBSZWZlcmVuY2UodGhpcy5ub2RlLCB0aGlzLmJlc3RHdWVzc093bmluZ01vZHVsZSk7XG4gICAgcmVmLmlkZW50aWZpZXJzID0gWy4uLnRoaXMuaWRlbnRpZmllcnNdO1xuICAgIHJlZi5fYWxpYXMgPSBhbGlhcztcbiAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgY2xvbmVXaXRoTm9JZGVudGlmaWVycygpOiBSZWZlcmVuY2U8VD4ge1xuICAgIGNvbnN0IHJlZiA9IG5ldyBSZWZlcmVuY2UodGhpcy5ub2RlLCB0aGlzLmJlc3RHdWVzc093bmluZ01vZHVsZSk7XG4gICAgcmVmLl9hbGlhcyA9IHRoaXMuX2FsaWFzO1xuICAgIHJlZi5pZGVudGlmaWVycyA9IFtdO1xuICAgIHJldHVybiByZWY7XG4gIH1cbn1cbiJdfQ==
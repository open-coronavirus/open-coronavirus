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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Represents a value which cannot be determined statically.
     */
    var DynamicValue = /** @class */ (function () {
        function DynamicValue(node, reason, code) {
            this.node = node;
            this.reason = reason;
            this.code = code;
        }
        DynamicValue.fromDynamicInput = function (node, input) {
            return new DynamicValue(node, input, 0 /* DYNAMIC_INPUT */);
        };
        DynamicValue.fromDynamicString = function (node) {
            return new DynamicValue(node, undefined, 1 /* DYNAMIC_STRING */);
        };
        DynamicValue.fromExternalReference = function (node, ref) {
            return new DynamicValue(node, ref, 2 /* EXTERNAL_REFERENCE */);
        };
        DynamicValue.fromUnknownExpressionType = function (node) {
            return new DynamicValue(node, undefined, 3 /* UNKNOWN_EXPRESSION_TYPE */);
        };
        DynamicValue.fromUnknownIdentifier = function (node) {
            return new DynamicValue(node, undefined, 4 /* UNKNOWN_IDENTIFIER */);
        };
        DynamicValue.fromInvalidExpressionType = function (node, value) {
            return new DynamicValue(node, value, 5 /* INVALID_EXPRESSION_TYPE */);
        };
        DynamicValue.fromUnknown = function (node) {
            return new DynamicValue(node, undefined, 6 /* UNKNOWN */);
        };
        DynamicValue.prototype.isFromDynamicInput = function () {
            return this.code === 0 /* DYNAMIC_INPUT */;
        };
        DynamicValue.prototype.isFromDynamicString = function () {
            return this.code === 1 /* DYNAMIC_STRING */;
        };
        DynamicValue.prototype.isFromExternalReference = function () {
            return this.code === 2 /* EXTERNAL_REFERENCE */;
        };
        DynamicValue.prototype.isFromUnknownExpressionType = function () {
            return this.code === 3 /* UNKNOWN_EXPRESSION_TYPE */;
        };
        DynamicValue.prototype.isFromUnknownIdentifier = function () {
            return this.code === 4 /* UNKNOWN_IDENTIFIER */;
        };
        DynamicValue.prototype.isFromInvalidExpressionType = function () {
            return this.code === 5 /* INVALID_EXPRESSION_TYPE */;
        };
        DynamicValue.prototype.isFromUnknown = function () {
            return this.code === 6 /* UNKNOWN */;
        };
        return DynamicValue;
    }());
    exports.DynamicValue = DynamicValue;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcGFydGlhbF9ldmFsdWF0b3Ivc3JjL2R5bmFtaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUF3REg7O09BRUc7SUFDSDtRQUNFLHNCQUNhLElBQWEsRUFBVyxNQUFTLEVBQVUsSUFBd0I7WUFBbkUsU0FBSSxHQUFKLElBQUksQ0FBUztZQUFXLFdBQU0sR0FBTixNQUFNLENBQUc7WUFBVSxTQUFJLEdBQUosSUFBSSxDQUFvQjtRQUFHLENBQUM7UUFFN0UsNkJBQWdCLEdBQXZCLFVBQXdCLElBQWEsRUFBRSxLQUFtQjtZQUN4RCxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLHdCQUFtQyxDQUFDO1FBQ3pFLENBQUM7UUFFTSw4QkFBaUIsR0FBeEIsVUFBeUIsSUFBYTtZQUNwQyxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLHlCQUFvQyxDQUFDO1FBQzlFLENBQUM7UUFFTSxrQ0FBcUIsR0FBNUIsVUFBNkIsSUFBYSxFQUFFLEdBQThCO1lBRXhFLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsNkJBQXdDLENBQUM7UUFDNUUsQ0FBQztRQUVNLHNDQUF5QixHQUFoQyxVQUFpQyxJQUFhO1lBQzVDLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsa0NBQTZDLENBQUM7UUFDdkYsQ0FBQztRQUVNLGtDQUFxQixHQUE1QixVQUE2QixJQUFtQjtZQUM5QyxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLDZCQUF3QyxDQUFDO1FBQ2xGLENBQUM7UUFFTSxzQ0FBeUIsR0FBaEMsVUFBaUMsSUFBYSxFQUFFLEtBQWM7WUFDNUQsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxrQ0FBNkMsQ0FBQztRQUNuRixDQUFDO1FBRU0sd0JBQVcsR0FBbEIsVUFBbUIsSUFBYTtZQUM5QixPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLGtCQUE2QixDQUFDO1FBQ3ZFLENBQUM7UUFFRCx5Q0FBa0IsR0FBbEI7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLDBCQUFxQyxDQUFDO1FBQ3hELENBQUM7UUFFRCwwQ0FBbUIsR0FBbkI7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLDJCQUFzQyxDQUFDO1FBQ3pELENBQUM7UUFFRCw4Q0FBdUIsR0FBdkI7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLCtCQUEwQyxDQUFDO1FBQzdELENBQUM7UUFFRCxrREFBMkIsR0FBM0I7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLG9DQUErQyxDQUFDO1FBQ2xFLENBQUM7UUFFRCw4Q0FBdUIsR0FBdkI7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLCtCQUEwQyxDQUFDO1FBQzdELENBQUM7UUFFRCxrREFBMkIsR0FBM0I7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLG9DQUErQyxDQUFDO1FBQ2xFLENBQUM7UUFFRCxvQ0FBYSxHQUFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxvQkFBK0IsQ0FBQztRQUNsRCxDQUFDO1FBQ0gsbUJBQUM7SUFBRCxDQUFDLEFBNURELElBNERDO0lBNURZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuXG4vKipcbiAqIFRoZSByZWFzb24gd2h5IGEgdmFsdWUgY2Fubm90IGJlIGRldGVybWluZWQgc3RhdGljYWxseS5cbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gRHluYW1pY1ZhbHVlUmVhc29uIHtcbiAgLyoqXG4gICAqIEEgdmFsdWUgY291bGQgbm90IGJlIGRldGVybWluZWQgc3RhdGljYWxseSwgYmVjYXVzZSBpdCBjb250YWlucyBhIHRlcm0gdGhhdCBjb3VsZCBub3QgYmVcbiAgICogZGV0ZXJtaW5lZCBzdGF0aWNhbGx5LlxuICAgKiAoRS5nLiBhIHByb3BlcnR5IGFzc2lnbm1lbnQgb3IgY2FsbCBleHByZXNzaW9uIHdoZXJlIHRoZSBsaHMgaXMgYSBgRHluYW1pY1ZhbHVlYCwgYSB0ZW1wbGF0ZVxuICAgKiBsaXRlcmFsIHdpdGggYSBkeW5hbWljIGV4cHJlc3Npb24sIGFuIG9iamVjdCBsaXRlcmFsIHdpdGggYSBzcHJlYWQgYXNzaWdubWVudCB3aGljaCBjb3VsZCBub3RcbiAgICogYmUgZGV0ZXJtaW5lZCBzdGF0aWNhbGx5LCBldGMuKVxuICAgKi9cbiAgRFlOQU1JQ19JTlBVVCxcblxuICAvKipcbiAgICogQSBzdHJpbmcgY291bGQgbm90IGJlIHN0YXRpY2FsbHkgZXZhbHVhdGVkLlxuICAgKiAoRS5nLiBhIGR5bmFtaWNhbGx5IGNvbnN0cnVjdGVkIG9iamVjdCBwcm9wZXJ0eSBuYW1lIG9yIGEgdGVtcGxhdGUgbGl0ZXJhbCBleHByZXNzaW9uIHRoYXRcbiAgICogY291bGQgbm90IGJlIHN0YXRpY2FsbHkgcmVzb2x2ZWQgdG8gYSBwcmltaXRpdmUgdmFsdWUuKVxuICAgKi9cbiAgRFlOQU1JQ19TVFJJTkcsXG5cbiAgLyoqXG4gICAqIEFuIGV4dGVybmFsIHJlZmVyZW5jZSBjb3VsZCBub3QgYmUgcmVzb2x2ZWQgdG8gYSB2YWx1ZSB3aGljaCBjYW4gYmUgZXZhbHVhdGVkLlxuICAgKiBGb3IgZXhhbXBsZSBhIGNhbGwgZXhwcmVzc2lvbiBmb3IgYSBmdW5jdGlvbiBkZWNsYXJlZCBpbiBgLmQudHNgLCBvciBhY2Nlc3NpbmcgbmF0aXZlIGdsb2JhbHNcbiAgICogc3VjaCBhcyBgd2luZG93YC5cbiAgICovXG4gIEVYVEVSTkFMX1JFRkVSRU5DRSxcblxuICAvKipcbiAgICogQSB0eXBlIG9mIGB0cy5FeHByZXNzaW9uYCB0aGF0IGBTdGF0aWNJbnRlcnByZXRlcmAgZG9lc24ndCBrbm93IGhvdyB0byBldmFsdWF0ZS5cbiAgICovXG4gIFVOS05PV05fRVhQUkVTU0lPTl9UWVBFLFxuXG4gIC8qKlxuICAgKiBBIGRlY2xhcmF0aW9uIG9mIGEgYHRzLklkZW50aWZpZXJgIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICovXG4gIFVOS05PV05fSURFTlRJRklFUixcblxuICAvKipcbiAgICogQSB2YWx1ZSBjb3VsZCBiZSByZXNvbHZlZCwgYnV0IGlzIG5vdCBhbiBhY2NlcHRhYmxlIHR5cGUgZm9yIHRoZSBvcGVyYXRpb24gYmVpbmcgcGVyZm9ybWVkLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYXR0ZW1wdGluZyB0byBjYWxsIGEgbm9uLWNhbGxhYmxlIGV4cHJlc3Npb24uXG4gICAqL1xuICBJTlZBTElEX0VYUFJFU1NJT05fVFlQRSxcblxuICAvKipcbiAgICogQSB2YWx1ZSBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZCBzdGF0aWNhbGx5IGZvciBhbnkgcmVhc29uIG90aGVyIHRoZSBhYm92ZS5cbiAgICovXG4gIFVOS05PV04sXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHZhbHVlIHdoaWNoIGNhbm5vdCBiZSBkZXRlcm1pbmVkIHN0YXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBEeW5hbWljVmFsdWU8UiA9IHVua25vd24+IHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IG5vZGU6IHRzLk5vZGUsIHJlYWRvbmx5IHJlYXNvbjogUiwgcHJpdmF0ZSBjb2RlOiBEeW5hbWljVmFsdWVSZWFzb24pIHt9XG5cbiAgc3RhdGljIGZyb21EeW5hbWljSW5wdXQobm9kZTogdHMuTm9kZSwgaW5wdXQ6IER5bmFtaWNWYWx1ZSk6IER5bmFtaWNWYWx1ZTxEeW5hbWljVmFsdWU+IHtcbiAgICByZXR1cm4gbmV3IER5bmFtaWNWYWx1ZShub2RlLCBpbnB1dCwgRHluYW1pY1ZhbHVlUmVhc29uLkRZTkFNSUNfSU5QVVQpO1xuICB9XG5cbiAgc3RhdGljIGZyb21EeW5hbWljU3RyaW5nKG5vZGU6IHRzLk5vZGUpOiBEeW5hbWljVmFsdWUge1xuICAgIHJldHVybiBuZXcgRHluYW1pY1ZhbHVlKG5vZGUsIHVuZGVmaW5lZCwgRHluYW1pY1ZhbHVlUmVhc29uLkRZTkFNSUNfU1RSSU5HKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tRXh0ZXJuYWxSZWZlcmVuY2Uobm9kZTogdHMuTm9kZSwgcmVmOiBSZWZlcmVuY2U8dHMuRGVjbGFyYXRpb24+KTpcbiAgICAgIER5bmFtaWNWYWx1ZTxSZWZlcmVuY2U8dHMuRGVjbGFyYXRpb24+PiB7XG4gICAgcmV0dXJuIG5ldyBEeW5hbWljVmFsdWUobm9kZSwgcmVmLCBEeW5hbWljVmFsdWVSZWFzb24uRVhURVJOQUxfUkVGRVJFTkNFKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tVW5rbm93bkV4cHJlc3Npb25UeXBlKG5vZGU6IHRzLk5vZGUpOiBEeW5hbWljVmFsdWUge1xuICAgIHJldHVybiBuZXcgRHluYW1pY1ZhbHVlKG5vZGUsIHVuZGVmaW5lZCwgRHluYW1pY1ZhbHVlUmVhc29uLlVOS05PV05fRVhQUkVTU0lPTl9UWVBFKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tVW5rbm93bklkZW50aWZpZXIobm9kZTogdHMuSWRlbnRpZmllcik6IER5bmFtaWNWYWx1ZSB7XG4gICAgcmV0dXJuIG5ldyBEeW5hbWljVmFsdWUobm9kZSwgdW5kZWZpbmVkLCBEeW5hbWljVmFsdWVSZWFzb24uVU5LTk9XTl9JREVOVElGSUVSKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tSW52YWxpZEV4cHJlc3Npb25UeXBlKG5vZGU6IHRzLk5vZGUsIHZhbHVlOiB1bmtub3duKTogRHluYW1pY1ZhbHVlPHVua25vd24+IHtcbiAgICByZXR1cm4gbmV3IER5bmFtaWNWYWx1ZShub2RlLCB2YWx1ZSwgRHluYW1pY1ZhbHVlUmVhc29uLklOVkFMSURfRVhQUkVTU0lPTl9UWVBFKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tVW5rbm93bihub2RlOiB0cy5Ob2RlKTogRHluYW1pY1ZhbHVlIHtcbiAgICByZXR1cm4gbmV3IER5bmFtaWNWYWx1ZShub2RlLCB1bmRlZmluZWQsIER5bmFtaWNWYWx1ZVJlYXNvbi5VTktOT1dOKTtcbiAgfVxuXG4gIGlzRnJvbUR5bmFtaWNJbnB1dCh0aGlzOiBEeW5hbWljVmFsdWU8Uj4pOiB0aGlzIGlzIER5bmFtaWNWYWx1ZTxEeW5hbWljVmFsdWU+IHtcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSBEeW5hbWljVmFsdWVSZWFzb24uRFlOQU1JQ19JTlBVVDtcbiAgfVxuXG4gIGlzRnJvbUR5bmFtaWNTdHJpbmcodGhpczogRHluYW1pY1ZhbHVlPFI+KTogdGhpcyBpcyBEeW5hbWljVmFsdWUge1xuICAgIHJldHVybiB0aGlzLmNvZGUgPT09IER5bmFtaWNWYWx1ZVJlYXNvbi5EWU5BTUlDX1NUUklORztcbiAgfVxuXG4gIGlzRnJvbUV4dGVybmFsUmVmZXJlbmNlKHRoaXM6IER5bmFtaWNWYWx1ZTxSPik6IHRoaXMgaXMgRHluYW1pY1ZhbHVlPFJlZmVyZW5jZTx0cy5EZWNsYXJhdGlvbj4+IHtcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSBEeW5hbWljVmFsdWVSZWFzb24uRVhURVJOQUxfUkVGRVJFTkNFO1xuICB9XG5cbiAgaXNGcm9tVW5rbm93bkV4cHJlc3Npb25UeXBlKHRoaXM6IER5bmFtaWNWYWx1ZTxSPik6IHRoaXMgaXMgRHluYW1pY1ZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSBEeW5hbWljVmFsdWVSZWFzb24uVU5LTk9XTl9FWFBSRVNTSU9OX1RZUEU7XG4gIH1cblxuICBpc0Zyb21Vbmtub3duSWRlbnRpZmllcih0aGlzOiBEeW5hbWljVmFsdWU8Uj4pOiB0aGlzIGlzIER5bmFtaWNWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZSA9PT0gRHluYW1pY1ZhbHVlUmVhc29uLlVOS05PV05fSURFTlRJRklFUjtcbiAgfVxuXG4gIGlzRnJvbUludmFsaWRFeHByZXNzaW9uVHlwZSh0aGlzOiBEeW5hbWljVmFsdWU8Uj4pOiB0aGlzIGlzIER5bmFtaWNWYWx1ZTx1bmtub3duPiB7XG4gICAgcmV0dXJuIHRoaXMuY29kZSA9PT0gRHluYW1pY1ZhbHVlUmVhc29uLklOVkFMSURfRVhQUkVTU0lPTl9UWVBFO1xuICB9XG5cbiAgaXNGcm9tVW5rbm93bih0aGlzOiBEeW5hbWljVmFsdWU8Uj4pOiB0aGlzIGlzIER5bmFtaWNWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZSA9PT0gRHluYW1pY1ZhbHVlUmVhc29uLlVOS05PV047XG4gIH1cbn1cbiJdfQ==
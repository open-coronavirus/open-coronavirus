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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/builtin", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var dynamic_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic");
    var result_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result");
    var ArraySliceBuiltinFn = /** @class */ (function (_super) {
        tslib_1.__extends(ArraySliceBuiltinFn, _super);
        function ArraySliceBuiltinFn(node, lhs) {
            var _this = _super.call(this) || this;
            _this.node = node;
            _this.lhs = lhs;
            return _this;
        }
        ArraySliceBuiltinFn.prototype.evaluate = function (args) {
            if (args.length === 0) {
                return this.lhs;
            }
            else {
                return dynamic_1.DynamicValue.fromUnknown(this.node);
            }
        };
        return ArraySliceBuiltinFn;
    }(result_1.BuiltinFn));
    exports.ArraySliceBuiltinFn = ArraySliceBuiltinFn;
    var ArrayConcatBuiltinFn = /** @class */ (function (_super) {
        tslib_1.__extends(ArrayConcatBuiltinFn, _super);
        function ArrayConcatBuiltinFn(node, lhs) {
            var _this = _super.call(this) || this;
            _this.node = node;
            _this.lhs = lhs;
            return _this;
        }
        ArrayConcatBuiltinFn.prototype.evaluate = function (args) {
            var e_1, _a;
            var result = tslib_1.__spread(this.lhs);
            try {
                for (var args_1 = tslib_1.__values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                    var arg = args_1_1.value;
                    if (arg instanceof dynamic_1.DynamicValue) {
                        result.push(dynamic_1.DynamicValue.fromDynamicInput(this.node, arg));
                    }
                    else if (Array.isArray(arg)) {
                        result.push.apply(result, tslib_1.__spread(arg));
                    }
                    else {
                        result.push(arg);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        };
        return ArrayConcatBuiltinFn;
    }(result_1.BuiltinFn));
    exports.ArrayConcatBuiltinFn = ArrayConcatBuiltinFn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbHRpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcGFydGlhbF9ldmFsdWF0b3Ivc3JjL2J1aWx0aW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBSUgseUZBQXVDO0lBQ3ZDLHVGQUFzRTtJQUV0RTtRQUF5QywrQ0FBUztRQUNoRCw2QkFBb0IsSUFBYSxFQUFVLEdBQXVCO1lBQWxFLFlBQXNFLGlCQUFPLFNBQUc7WUFBNUQsVUFBSSxHQUFKLElBQUksQ0FBUztZQUFVLFNBQUcsR0FBSCxHQUFHLENBQW9COztRQUFhLENBQUM7UUFFaEYsc0NBQVEsR0FBUixVQUFTLElBQXdCO1lBQy9CLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUNqQjtpQkFBTTtnQkFDTCxPQUFPLHNCQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QztRQUNILENBQUM7UUFDSCwwQkFBQztJQUFELENBQUMsQUFWRCxDQUF5QyxrQkFBUyxHQVVqRDtJQVZZLGtEQUFtQjtJQVloQztRQUEwQyxnREFBUztRQUNqRCw4QkFBb0IsSUFBYSxFQUFVLEdBQXVCO1lBQWxFLFlBQXNFLGlCQUFPLFNBQUc7WUFBNUQsVUFBSSxHQUFKLElBQUksQ0FBUztZQUFVLFNBQUcsR0FBSCxHQUFHLENBQW9COztRQUFhLENBQUM7UUFFaEYsdUNBQVEsR0FBUixVQUFTLElBQXdCOztZQUMvQixJQUFNLE1BQU0sb0JBQTJCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Z0JBQ2pELEtBQWtCLElBQUEsU0FBQSxpQkFBQSxJQUFJLENBQUEsMEJBQUEsNENBQUU7b0JBQW5CLElBQU0sR0FBRyxpQkFBQTtvQkFDWixJQUFJLEdBQUcsWUFBWSxzQkFBWSxFQUFFO3dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUM1RDt5QkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQzdCLE1BQU0sQ0FBQyxJQUFJLE9BQVgsTUFBTSxtQkFBUyxHQUFHLEdBQUU7cUJBQ3JCO3lCQUFNO3dCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2xCO2lCQUNGOzs7Ozs7Ozs7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBQ0gsMkJBQUM7SUFBRCxDQUFDLEFBaEJELENBQTBDLGtCQUFTLEdBZ0JsRDtJQWhCWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0R5bmFtaWNWYWx1ZX0gZnJvbSAnLi9keW5hbWljJztcbmltcG9ydCB7QnVpbHRpbkZuLCBSZXNvbHZlZFZhbHVlLCBSZXNvbHZlZFZhbHVlQXJyYXl9IGZyb20gJy4vcmVzdWx0JztcblxuZXhwb3J0IGNsYXNzIEFycmF5U2xpY2VCdWlsdGluRm4gZXh0ZW5kcyBCdWlsdGluRm4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5vZGU6IHRzLk5vZGUsIHByaXZhdGUgbGhzOiBSZXNvbHZlZFZhbHVlQXJyYXkpIHsgc3VwZXIoKTsgfVxuXG4gIGV2YWx1YXRlKGFyZ3M6IFJlc29sdmVkVmFsdWVBcnJheSk6IFJlc29sdmVkVmFsdWUge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubGhzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21Vbmtub3duKHRoaXMubm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheUNvbmNhdEJ1aWx0aW5GbiBleHRlbmRzIEJ1aWx0aW5GbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm9kZTogdHMuTm9kZSwgcHJpdmF0ZSBsaHM6IFJlc29sdmVkVmFsdWVBcnJheSkgeyBzdXBlcigpOyB9XG5cbiAgZXZhbHVhdGUoYXJnczogUmVzb2x2ZWRWYWx1ZUFycmF5KTogUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgcmVzdWx0OiBSZXNvbHZlZFZhbHVlQXJyYXkgPSBbLi4udGhpcy5saHNdO1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQodGhpcy5ub2RlLCBhcmcpKTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=
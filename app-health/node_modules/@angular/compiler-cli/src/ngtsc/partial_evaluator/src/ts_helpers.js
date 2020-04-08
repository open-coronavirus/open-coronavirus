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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/ts_helpers", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var dynamic_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic");
    function evaluateTsHelperInline(helper, node, args) {
        if (helper === reflection_1.TsHelperFn.Spread) {
            return evaluateTsSpreadHelper(node, args);
        }
        else {
            throw new Error("Cannot evaluate unknown helper " + helper + " inline");
        }
    }
    exports.evaluateTsHelperInline = evaluateTsHelperInline;
    function evaluateTsSpreadHelper(node, args) {
        var e_1, _a;
        var result = [];
        try {
            for (var args_1 = tslib_1.__values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var arg = args_1_1.value;
                if (arg instanceof dynamic_1.DynamicValue) {
                    result.push(dynamic_1.DynamicValue.fromDynamicInput(node, arg));
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
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcGFydGlhbF9ldmFsdWF0b3Ivc3JjL3RzX2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBSUgseUVBQTRDO0lBRTVDLHlGQUF1QztJQUd2QyxTQUFnQixzQkFBc0IsQ0FDbEMsTUFBa0IsRUFBRSxJQUFhLEVBQUUsSUFBd0I7UUFDN0QsSUFBSSxNQUFNLEtBQUssdUJBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDaEMsT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQWtDLE1BQU0sWUFBUyxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBUEQsd0RBT0M7SUFFRCxTQUFTLHNCQUFzQixDQUFDLElBQWEsRUFBRSxJQUF3Qjs7UUFDckUsSUFBTSxNQUFNLEdBQXVCLEVBQUUsQ0FBQzs7WUFDdEMsS0FBa0IsSUFBQSxTQUFBLGlCQUFBLElBQUksQ0FBQSwwQkFBQSw0Q0FBRTtnQkFBbkIsSUFBTSxHQUFHLGlCQUFBO2dCQUNaLElBQUksR0FBRyxZQUFZLHNCQUFZLEVBQUU7b0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDdkQ7cUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM3QixNQUFNLENBQUMsSUFBSSxPQUFYLE1BQU0sbUJBQVMsR0FBRyxHQUFFO2lCQUNyQjtxQkFBTTtvQkFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNsQjthQUNGOzs7Ozs7Ozs7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtUc0hlbHBlckZufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcblxuaW1wb3J0IHtEeW5hbWljVmFsdWV9IGZyb20gJy4vZHluYW1pYyc7XG5pbXBvcnQge1Jlc29sdmVkVmFsdWUsIFJlc29sdmVkVmFsdWVBcnJheX0gZnJvbSAnLi9yZXN1bHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXZhbHVhdGVUc0hlbHBlcklubGluZShcbiAgICBoZWxwZXI6IFRzSGVscGVyRm4sIG5vZGU6IHRzLk5vZGUsIGFyZ3M6IFJlc29sdmVkVmFsdWVBcnJheSk6IFJlc29sdmVkVmFsdWUge1xuICBpZiAoaGVscGVyID09PSBUc0hlbHBlckZuLlNwcmVhZCkge1xuICAgIHJldHVybiBldmFsdWF0ZVRzU3ByZWFkSGVscGVyKG5vZGUsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGV2YWx1YXRlIHVua25vd24gaGVscGVyICR7aGVscGVyfSBpbmxpbmVgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBldmFsdWF0ZVRzU3ByZWFkSGVscGVyKG5vZGU6IHRzLk5vZGUsIGFyZ3M6IFJlc29sdmVkVmFsdWVBcnJheSk6IFJlc29sdmVkVmFsdWVBcnJheSB7XG4gIGNvbnN0IHJlc3VsdDogUmVzb2x2ZWRWYWx1ZUFycmF5ID0gW107XG4gIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICBpZiAoYXJnIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXN1bHQucHVzaChEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBhcmcpKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgcmVzdWx0LnB1c2goLi4uYXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==
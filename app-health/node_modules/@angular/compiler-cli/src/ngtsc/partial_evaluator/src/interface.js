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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interface", ["require", "exports", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var interpreter_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter");
    var PartialEvaluator = /** @class */ (function () {
        function PartialEvaluator(host, checker, dependencyTracker) {
            this.host = host;
            this.checker = checker;
            this.dependencyTracker = dependencyTracker;
        }
        PartialEvaluator.prototype.evaluate = function (expr, foreignFunctionResolver) {
            var interpreter = new interpreter_1.StaticInterpreter(this.host, this.checker, this.dependencyTracker);
            return interpreter.visit(expr, {
                originatingFile: expr.getSourceFile(),
                absoluteModuleName: null,
                resolutionContext: expr.getSourceFile().fileName,
                scope: new Map(), foreignFunctionResolver: foreignFunctionResolver,
            });
        };
        return PartialEvaluator;
    }());
    exports.PartialEvaluator = PartialEvaluator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9wYXJ0aWFsX2V2YWx1YXRvci9zcmMvaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBT0gsaUdBQWdEO0lBZWhEO1FBQ0UsMEJBQ1ksSUFBb0IsRUFBVSxPQUF1QixFQUNyRCxpQkFBcUM7WUFEckMsU0FBSSxHQUFKLElBQUksQ0FBZ0I7WUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtZQUNyRCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW9CO1FBQUcsQ0FBQztRQUVyRCxtQ0FBUSxHQUFSLFVBQVMsSUFBbUIsRUFBRSx1QkFBaUQ7WUFDN0UsSUFBTSxXQUFXLEdBQUcsSUFBSSwrQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDM0YsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDN0IsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3JDLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGlCQUFpQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRO2dCQUNoRCxLQUFLLEVBQUUsSUFBSSxHQUFHLEVBQTBDLEVBQUUsdUJBQXVCLHlCQUFBO2FBQ2xGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCx1QkFBQztJQUFELENBQUMsQUFkRCxJQWNDO0lBZFksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5cbmltcG9ydCB7U3RhdGljSW50ZXJwcmV0ZXJ9IGZyb20gJy4vaW50ZXJwcmV0ZXInO1xuaW1wb3J0IHtSZXNvbHZlZFZhbHVlfSBmcm9tICcuL3Jlc3VsdCc7XG5cbi8qKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHRvIHJlY29yZCBkZXBlbmRlbmN5IHJlbGF0aW9ucyBiZXR3ZWVuXG4gKiBzb3VyY2UgZmlsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVwZW5kZW5jeVRyYWNrZXIge1xuICB0cmFja0ZpbGVEZXBlbmRlbmN5KGRlcDogdHMuU291cmNlRmlsZSwgc3JjOiB0cy5Tb3VyY2VGaWxlKTogdm9pZDtcbn1cblxuZXhwb3J0IHR5cGUgRm9yZWlnbkZ1bmN0aW9uUmVzb2x2ZXIgPVxuICAgIChub2RlOiBSZWZlcmVuY2U8dHMuRnVuY3Rpb25EZWNsYXJhdGlvbnx0cy5NZXRob2REZWNsYXJhdGlvbnx0cy5GdW5jdGlvbkV4cHJlc3Npb24+LFxuICAgICBhcmdzOiBSZWFkb25seUFycmF5PHRzLkV4cHJlc3Npb24+KSA9PiB0cy5FeHByZXNzaW9uIHwgbnVsbDtcblxuZXhwb3J0IGNsYXNzIFBhcnRpYWxFdmFsdWF0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaG9zdDogUmVmbGVjdGlvbkhvc3QsIHByaXZhdGUgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4gICAgICBwcml2YXRlIGRlcGVuZGVuY3lUcmFja2VyPzogRGVwZW5kZW5jeVRyYWNrZXIpIHt9XG5cbiAgZXZhbHVhdGUoZXhwcjogdHMuRXhwcmVzc2lvbiwgZm9yZWlnbkZ1bmN0aW9uUmVzb2x2ZXI/OiBGb3JlaWduRnVuY3Rpb25SZXNvbHZlcik6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGludGVycHJldGVyID0gbmV3IFN0YXRpY0ludGVycHJldGVyKHRoaXMuaG9zdCwgdGhpcy5jaGVja2VyLCB0aGlzLmRlcGVuZGVuY3lUcmFja2VyKTtcbiAgICByZXR1cm4gaW50ZXJwcmV0ZXIudmlzaXQoZXhwciwge1xuICAgICAgb3JpZ2luYXRpbmdGaWxlOiBleHByLmdldFNvdXJjZUZpbGUoKSxcbiAgICAgIGFic29sdXRlTW9kdWxlTmFtZTogbnVsbCxcbiAgICAgIHJlc29sdXRpb25Db250ZXh0OiBleHByLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSxcbiAgICAgIHNjb3BlOiBuZXcgTWFwPHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uLCBSZXNvbHZlZFZhbHVlPigpLCBmb3JlaWduRnVuY3Rpb25SZXNvbHZlcixcbiAgICB9KTtcbiAgfVxufVxuIl19
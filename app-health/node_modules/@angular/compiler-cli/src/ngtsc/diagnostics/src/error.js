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
        define("@angular/compiler-cli/src/ngtsc/diagnostics/src/error", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var FatalDiagnosticError = /** @class */ (function () {
        function FatalDiagnosticError(code, node, message) {
            this.code = code;
            this.node = node;
            this.message = message;
            /**
             * @internal
             */
            this._isFatalDiagnosticError = true;
        }
        FatalDiagnosticError.prototype.toDiagnostic = function () {
            return makeDiagnostic(this.code, this.node, this.message);
        };
        return FatalDiagnosticError;
    }());
    exports.FatalDiagnosticError = FatalDiagnosticError;
    function makeDiagnostic(code, node, messageText) {
        node = ts.getOriginalNode(node);
        return {
            category: ts.DiagnosticCategory.Error,
            code: Number('-99' + code.valueOf()),
            file: ts.getOriginalNode(node).getSourceFile(),
            start: node.getStart(undefined, false),
            length: node.getWidth(), messageText: messageText,
        };
    }
    exports.makeDiagnostic = makeDiagnostic;
    function isFatalDiagnosticError(err) {
        return err._isFatalDiagnosticError === true;
    }
    exports.isFatalDiagnosticError = isFatalDiagnosticError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2RpYWdub3N0aWNzL3NyYy9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUlqQztRQUNFLDhCQUFxQixJQUFlLEVBQVcsSUFBYSxFQUFXLE9BQWU7WUFBakUsU0FBSSxHQUFKLElBQUksQ0FBVztZQUFXLFNBQUksR0FBSixJQUFJLENBQVM7WUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFRO1lBRXRGOztlQUVHO1lBQ0gsNEJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBTDBELENBQUM7UUFPMUYsMkNBQVksR0FBWjtZQUNFLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUNILDJCQUFDO0lBQUQsQ0FBQyxBQVhELElBV0M7SUFYWSxvREFBb0I7SUFhakMsU0FBZ0IsY0FBYyxDQUMxQixJQUFlLEVBQUUsSUFBYSxFQUFFLFdBQW1CO1FBQ3JELElBQUksR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE9BQU87WUFDTCxRQUFRLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUs7WUFDckMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLElBQUksRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRTtZQUM5QyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxhQUFBO1NBQ3JDLENBQUM7SUFDSixDQUFDO0lBVkQsd0NBVUM7SUFFRCxTQUFnQixzQkFBc0IsQ0FBQyxHQUFRO1FBQzdDLE9BQU8sR0FBRyxDQUFDLHVCQUF1QixLQUFLLElBQUksQ0FBQztJQUM5QyxDQUFDO0lBRkQsd0RBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Vycm9yQ29kZX0gZnJvbSAnLi9jb2RlJztcblxuZXhwb3J0IGNsYXNzIEZhdGFsRGlhZ25vc3RpY0Vycm9yIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgY29kZTogRXJyb3JDb2RlLCByZWFkb25seSBub2RlOiB0cy5Ob2RlLCByZWFkb25seSBtZXNzYWdlOiBzdHJpbmcpIHt9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2lzRmF0YWxEaWFnbm9zdGljRXJyb3IgPSB0cnVlO1xuXG4gIHRvRGlhZ25vc3RpYygpOiB0cy5EaWFnbm9zdGljV2l0aExvY2F0aW9uIHtcbiAgICByZXR1cm4gbWFrZURpYWdub3N0aWModGhpcy5jb2RlLCB0aGlzLm5vZGUsIHRoaXMubWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VEaWFnbm9zdGljKFxuICAgIGNvZGU6IEVycm9yQ29kZSwgbm9kZTogdHMuTm9kZSwgbWVzc2FnZVRleHQ6IHN0cmluZyk6IHRzLkRpYWdub3N0aWNXaXRoTG9jYXRpb24ge1xuICBub2RlID0gdHMuZ2V0T3JpZ2luYWxOb2RlKG5vZGUpO1xuICByZXR1cm4ge1xuICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgY29kZTogTnVtYmVyKCctOTknICsgY29kZS52YWx1ZU9mKCkpLFxuICAgIGZpbGU6IHRzLmdldE9yaWdpbmFsTm9kZShub2RlKS5nZXRTb3VyY2VGaWxlKCksXG4gICAgc3RhcnQ6IG5vZGUuZ2V0U3RhcnQodW5kZWZpbmVkLCBmYWxzZSksXG4gICAgbGVuZ3RoOiBub2RlLmdldFdpZHRoKCksIG1lc3NhZ2VUZXh0LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYXRhbERpYWdub3N0aWNFcnJvcihlcnI6IGFueSk6IGVyciBpcyBGYXRhbERpYWdub3N0aWNFcnJvciB7XG4gIHJldHVybiBlcnIuX2lzRmF0YWxEaWFnbm9zdGljRXJyb3IgPT09IHRydWU7XG59XG4iXX0=
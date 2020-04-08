(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", ["require", "exports", "tslib", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    /**
     * This error is thrown when there is a problem parsing a translation file.
     */
    var TranslationParseError = /** @class */ (function (_super) {
        tslib_1.__extends(TranslationParseError, _super);
        function TranslationParseError(span, msg, level) {
            if (level === void 0) { level = compiler_1.ParseErrorLevel.ERROR; }
            var _this = _super.call(this, msg) || this;
            _this.span = span;
            _this.msg = msg;
            _this.level = level;
            return _this;
        }
        TranslationParseError.prototype.contextualMessage = function () {
            var ctx = this.span.start.getContext(100, 3);
            return ctx ? this.msg + " (\"" + ctx.before + "[" + compiler_1.ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" :
                this.msg;
        };
        TranslationParseError.prototype.toString = function () {
            var details = this.span.details ? ", " + this.span.details : '';
            return this.contextualMessage() + ": " + this.span.start + details;
        };
        return TranslationParseError;
    }(Error));
    exports.TranslationParseError = TranslationParseError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fcGFyc2VfZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3BhcnNlX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDhDQUFtRTtJQUVuRTs7T0FFRztJQUNIO1FBQTJDLGlEQUFLO1FBQzlDLCtCQUNXLElBQXFCLEVBQVMsR0FBVyxFQUN6QyxLQUE4QztZQUE5QyxzQkFBQSxFQUFBLFFBQXlCLDBCQUFlLENBQUMsS0FBSztZQUZ6RCxZQUdFLGtCQUFNLEdBQUcsQ0FBQyxTQUNYO1lBSFUsVUFBSSxHQUFKLElBQUksQ0FBaUI7WUFBUyxTQUFHLEdBQUgsR0FBRyxDQUFRO1lBQ3pDLFdBQUssR0FBTCxLQUFLLENBQXlDOztRQUV6RCxDQUFDO1FBRUQsaURBQWlCLEdBQWpCO1lBQ0UsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUksSUFBSSxDQUFDLEdBQUcsWUFBTSxHQUFHLENBQUMsTUFBTSxTQUFJLDBCQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFPLEdBQUcsQ0FBQyxLQUFLLFFBQUksQ0FBQyxDQUFDO2dCQUNoRixJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3hCLENBQUM7UUFFRCx3Q0FBUSxHQUFSO1lBQ0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNsRSxPQUFVLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQVMsQ0FBQztRQUNyRSxDQUFDO1FBQ0gsNEJBQUM7SUFBRCxDQUFDLEFBakJELENBQTJDLEtBQUssR0FpQi9DO0lBakJZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7UGFyc2VFcnJvckxldmVsLCBQYXJzZVNvdXJjZVNwYW59IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBUaGlzIGVycm9yIGlzIHRocm93biB3aGVuIHRoZXJlIGlzIGEgcHJvYmxlbSBwYXJzaW5nIGEgdHJhbnNsYXRpb24gZmlsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgc3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgbXNnOiBzdHJpbmcsXG4gICAgICBwdWJsaWMgbGV2ZWw6IFBhcnNlRXJyb3JMZXZlbCA9IFBhcnNlRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIHN1cGVyKG1zZyk7XG4gIH1cblxuICBjb250ZXh0dWFsTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuc3Bhbi5zdGFydC5nZXRDb250ZXh0KDEwMCwgMyk7XG4gICAgcmV0dXJuIGN0eCA/IGAke3RoaXMubXNnfSAoXCIke2N0eC5iZWZvcmV9WyR7UGFyc2VFcnJvckxldmVsW3RoaXMubGV2ZWxdfSAtPl0ke2N0eC5hZnRlcn1cIilgIDpcbiAgICAgICAgICAgICAgICAgdGhpcy5tc2c7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLnNwYW4uZGV0YWlscyA/IGAsICR7dGhpcy5zcGFuLmRldGFpbHN9YCA6ICcnO1xuICAgIHJldHVybiBgJHt0aGlzLmNvbnRleHR1YWxNZXNzYWdlKCl9OiAke3RoaXMuc3Bhbi5zdGFydH0ke2RldGFpbHN9YDtcbiAgfVxufVxuIl19
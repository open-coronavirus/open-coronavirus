(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/logging/console_logger", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var RESET = '\x1b[0m';
    var RED = '\x1b[31m';
    var YELLOW = '\x1b[33m';
    var BLUE = '\x1b[36m';
    exports.DEBUG = BLUE + "Debug:" + RESET;
    exports.WARN = YELLOW + "Warning:" + RESET;
    exports.ERROR = RED + "Error:" + RESET;
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["debug"] = 0] = "debug";
        LogLevel[LogLevel["info"] = 1] = "info";
        LogLevel[LogLevel["warn"] = 2] = "warn";
        LogLevel[LogLevel["error"] = 3] = "error";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    /**
     * A simple logger that outputs directly to the Console.
     *
     * The log messages can be filtered based on severity via the `logLevel`
     * constructor parameter.
     */
    var ConsoleLogger = /** @class */ (function () {
        function ConsoleLogger(logLevel) {
            this.logLevel = logLevel;
        }
        ConsoleLogger.prototype.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.logLevel <= LogLevel.debug)
                console.debug.apply(console, tslib_1.__spread([exports.DEBUG], args));
        };
        ConsoleLogger.prototype.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.logLevel <= LogLevel.info)
                console.info.apply(console, tslib_1.__spread(args));
        };
        ConsoleLogger.prototype.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.logLevel <= LogLevel.warn)
                console.warn.apply(console, tslib_1.__spread([exports.WARN], args));
        };
        ConsoleLogger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.logLevel <= LogLevel.error)
                console.error.apply(console, tslib_1.__spread([exports.ERROR], args));
        };
        return ConsoleLogger;
    }());
    exports.ConsoleLogger = ConsoleLogger;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZV9sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvbG9nZ2luZy9jb25zb2xlX2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFTQSxJQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDeEIsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDO0lBQ3ZCLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQztJQUMxQixJQUFNLElBQUksR0FBRyxVQUFVLENBQUM7SUFFWCxRQUFBLEtBQUssR0FBTSxJQUFJLGNBQVMsS0FBTyxDQUFDO0lBQ2hDLFFBQUEsSUFBSSxHQUFNLE1BQU0sZ0JBQVcsS0FBTyxDQUFDO0lBQ25DLFFBQUEsS0FBSyxHQUFNLEdBQUcsY0FBUyxLQUFPLENBQUM7SUFFNUMsSUFBWSxRQUtYO0lBTEQsV0FBWSxRQUFRO1FBQ2xCLHlDQUFLLENBQUE7UUFDTCx1Q0FBSSxDQUFBO1FBQ0osdUNBQUksQ0FBQTtRQUNKLHlDQUFLLENBQUE7SUFDUCxDQUFDLEVBTFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFLbkI7SUFFRDs7Ozs7T0FLRztJQUNIO1FBQ0UsdUJBQW9CLFFBQWtCO1lBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBRyxDQUFDO1FBQzFDLDZCQUFLLEdBQUw7WUFBTSxjQUFpQjtpQkFBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO2dCQUFqQix5QkFBaUI7O1lBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSztnQkFBRSxPQUFPLENBQUMsS0FBSyxPQUFiLE9BQU8sb0JBQU8sYUFBSyxHQUFLLElBQUksR0FBRTtRQUNyRSxDQUFDO1FBQ0QsNEJBQUksR0FBSjtZQUFLLGNBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLHlCQUFpQjs7WUFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJO2dCQUFFLE9BQU8sQ0FBQyxJQUFJLE9BQVosT0FBTyxtQkFBUyxJQUFJLEdBQUU7UUFDNUQsQ0FBQztRQUNELDRCQUFJLEdBQUo7WUFBSyxjQUFpQjtpQkFBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO2dCQUFqQix5QkFBaUI7O1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSTtnQkFBRSxPQUFPLENBQUMsSUFBSSxPQUFaLE9BQU8sb0JBQU0sWUFBSSxHQUFLLElBQUksR0FBRTtRQUNsRSxDQUFDO1FBQ0QsNkJBQUssR0FBTDtZQUFNLGNBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLHlCQUFpQjs7WUFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLO2dCQUFFLE9BQU8sQ0FBQyxLQUFLLE9BQWIsT0FBTyxvQkFBTyxhQUFLLEdBQUssSUFBSSxHQUFFO1FBQ3JFLENBQUM7UUFDSCxvQkFBQztJQUFELENBQUMsQUFkRCxJQWNDO0lBZFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi9sb2dnZXInO1xuXG5jb25zdCBSRVNFVCA9ICdcXHgxYlswbSc7XG5jb25zdCBSRUQgPSAnXFx4MWJbMzFtJztcbmNvbnN0IFlFTExPVyA9ICdcXHgxYlszM20nO1xuY29uc3QgQkxVRSA9ICdcXHgxYlszNm0nO1xuXG5leHBvcnQgY29uc3QgREVCVUcgPSBgJHtCTFVFfURlYnVnOiR7UkVTRVR9YDtcbmV4cG9ydCBjb25zdCBXQVJOID0gYCR7WUVMTE9XfVdhcm5pbmc6JHtSRVNFVH1gO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gYCR7UkVEfUVycm9yOiR7UkVTRVR9YDtcblxuZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xuICBkZWJ1ZyxcbiAgaW5mbyxcbiAgd2FybixcbiAgZXJyb3IsXG59XG5cbi8qKlxuICogQSBzaW1wbGUgbG9nZ2VyIHRoYXQgb3V0cHV0cyBkaXJlY3RseSB0byB0aGUgQ29uc29sZS5cbiAqXG4gKiBUaGUgbG9nIG1lc3NhZ2VzIGNhbiBiZSBmaWx0ZXJlZCBiYXNlZCBvbiBzZXZlcml0eSB2aWEgdGhlIGBsb2dMZXZlbGBcbiAqIGNvbnN0cnVjdG9yIHBhcmFtZXRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ0xldmVsOiBMb2dMZXZlbCkge31cbiAgZGVidWcoLi4uYXJnczogc3RyaW5nW10pIHtcbiAgICBpZiAodGhpcy5sb2dMZXZlbCA8PSBMb2dMZXZlbC5kZWJ1ZykgY29uc29sZS5kZWJ1ZyhERUJVRywgLi4uYXJncyk7XG4gIH1cbiAgaW5mbyguLi5hcmdzOiBzdHJpbmdbXSkge1xuICAgIGlmICh0aGlzLmxvZ0xldmVsIDw9IExvZ0xldmVsLmluZm8pIGNvbnNvbGUuaW5mbyguLi5hcmdzKTtcbiAgfVxuICB3YXJuKC4uLmFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgaWYgKHRoaXMubG9nTGV2ZWwgPD0gTG9nTGV2ZWwud2FybikgY29uc29sZS53YXJuKFdBUk4sIC4uLmFyZ3MpO1xuICB9XG4gIGVycm9yKC4uLmFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgaWYgKHRoaXMubG9nTGV2ZWwgPD0gTG9nTGV2ZWwuZXJyb3IpIGNvbnNvbGUuZXJyb3IoRVJST1IsIC4uLmFyZ3MpO1xuICB9XG59XG4iXX0=
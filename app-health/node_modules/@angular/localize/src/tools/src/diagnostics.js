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
        define("@angular/localize/src/tools/src/diagnostics", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This class is used to collect and then report warnings and errors that occur during the execution
     * of the tools.
     */
    var Diagnostics = /** @class */ (function () {
        function Diagnostics() {
            this.messages = [];
        }
        Object.defineProperty(Diagnostics.prototype, "hasErrors", {
            get: function () { return this.messages.some(function (m) { return m.type === 'error'; }); },
            enumerable: true,
            configurable: true
        });
        Diagnostics.prototype.warn = function (message) { this.messages.push({ type: 'warning', message: message }); };
        Diagnostics.prototype.error = function (message) { this.messages.push({ type: 'error', message: message }); };
        Diagnostics.prototype.formatDiagnostics = function (message) {
            var errors = this.messages.filter(function (d) { return d.type === 'error'; }).map(function (d) { return ' - ' + d.message; });
            var warnings = this.messages.filter(function (d) { return d.type === 'warning'; }).map(function (d) { return ' - ' + d.message; });
            if (errors.length) {
                message += '\nERRORS:\n' + errors.join('\n');
            }
            if (warnings.length) {
                message += '\nWARNINGS:\n' + warnings.join('\n');
            }
            return message;
        };
        return Diagnostics;
    }());
    exports.Diagnostics = Diagnostics;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2RpYWdub3N0aWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUg7OztPQUdHO0lBQ0g7UUFBQTtZQUNXLGFBQVEsR0FBbUQsRUFBRSxDQUFDO1FBZXpFLENBQUM7UUFkQyxzQkFBSSxrQ0FBUztpQkFBYixjQUFrQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQWxCLENBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ3ZFLDBCQUFJLEdBQUosVUFBSyxPQUFlLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsMkJBQUssR0FBTCxVQUFNLE9BQWUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSx1Q0FBaUIsR0FBakIsVUFBa0IsT0FBZTtZQUMvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFsQixDQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUMzRixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFwQixDQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUMvRixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pCLE9BQU8sSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QztZQUNELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsT0FBTyxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xEO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNILGtCQUFDO0lBQUQsQ0FBQyxBQWhCRCxJQWdCQztJQWhCWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gY29sbGVjdCBhbmQgdGhlbiByZXBvcnQgd2FybmluZ3MgYW5kIGVycm9ycyB0aGF0IG9jY3VyIGR1cmluZyB0aGUgZXhlY3V0aW9uXG4gKiBvZiB0aGUgdG9vbHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBEaWFnbm9zdGljcyB7XG4gIHJlYWRvbmx5IG1lc3NhZ2VzOiB7dHlwZTogJ3dhcm5pbmcnIHwgJ2Vycm9yJywgbWVzc2FnZTogc3RyaW5nfVtdID0gW107XG4gIGdldCBoYXNFcnJvcnMoKSB7IHJldHVybiB0aGlzLm1lc3NhZ2VzLnNvbWUobSA9PiBtLnR5cGUgPT09ICdlcnJvcicpOyB9XG4gIHdhcm4obWVzc2FnZTogc3RyaW5nKSB7IHRoaXMubWVzc2FnZXMucHVzaCh7dHlwZTogJ3dhcm5pbmcnLCBtZXNzYWdlfSk7IH1cbiAgZXJyb3IobWVzc2FnZTogc3RyaW5nKSB7IHRoaXMubWVzc2FnZXMucHVzaCh7dHlwZTogJ2Vycm9yJywgbWVzc2FnZX0pOyB9XG4gIGZvcm1hdERpYWdub3N0aWNzKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5tZXNzYWdlcyAhLmZpbHRlcihkID0+IGQudHlwZSA9PT0gJ2Vycm9yJykubWFwKGQgPT4gJyAtICcgKyBkLm1lc3NhZ2UpO1xuICAgIGNvbnN0IHdhcm5pbmdzID0gdGhpcy5tZXNzYWdlcyAhLmZpbHRlcihkID0+IGQudHlwZSA9PT0gJ3dhcm5pbmcnKS5tYXAoZCA9PiAnIC0gJyArIGQubWVzc2FnZSk7XG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIG1lc3NhZ2UgKz0gJ1xcbkVSUk9SUzpcXG4nICsgZXJyb3JzLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBpZiAod2FybmluZ3MubGVuZ3RoKSB7XG4gICAgICBtZXNzYWdlICs9ICdcXG5XQVJOSU5HUzpcXG4nICsgd2FybmluZ3Muam9pbignXFxuJyk7XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG59XG4iXX0=
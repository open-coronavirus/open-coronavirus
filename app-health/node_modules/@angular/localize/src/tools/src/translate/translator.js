(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translator", ["require", "exports", "tslib", "path", "@angular/localize/src/tools/src/file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var path_1 = require("path");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Translate each file (e.g. source file or static asset) using the given `TranslationHandler`s.
     * The file will be translated by the first handler that returns true for `canTranslate()`.
     */
    var Translator = /** @class */ (function () {
        function Translator(resourceHandlers, diagnostics) {
            this.resourceHandlers = resourceHandlers;
            this.diagnostics = diagnostics;
        }
        Translator.prototype.translateFiles = function (inputPaths, rootPath, outputPathFn, translations, sourceLocale) {
            var _this = this;
            inputPaths.forEach(function (inputPath) {
                var e_1, _a;
                var contents = file_utils_1.FileUtils.readFileBuffer(inputPath);
                var relativePath = path_1.relative(rootPath, inputPath);
                try {
                    for (var _b = tslib_1.__values(_this.resourceHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var resourceHandler = _c.value;
                        if (resourceHandler.canTranslate(relativePath, contents)) {
                            return resourceHandler.translate(_this.diagnostics, rootPath, relativePath, contents, outputPathFn, translations, sourceLocale);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                _this.diagnostics.error("Unable to handle resource file: " + inputPath);
            });
        };
        return Translator;
    }());
    exports.Translator = Translator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEsNkJBQThCO0lBRzlCLHlFQUF3QztJQWlEeEM7OztPQUdHO0lBQ0g7UUFDRSxvQkFBb0IsZ0JBQXNDLEVBQVUsV0FBd0I7WUFBeEUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFzQjtZQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQUcsQ0FBQztRQUVoRyxtQ0FBYyxHQUFkLFVBQ0ksVUFBb0IsRUFBRSxRQUFnQixFQUFFLFlBQTBCLEVBQ2xFLFlBQWlDLEVBQUUsWUFBcUI7WUFGNUQsaUJBZUM7WUFaQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUzs7Z0JBQzFCLElBQU0sUUFBUSxHQUFHLHNCQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLFlBQVksR0FBRyxlQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztvQkFDbkQsS0FBOEIsSUFBQSxLQUFBLGlCQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQSxnQkFBQSw0QkFBRTt3QkFBaEQsSUFBTSxlQUFlLFdBQUE7d0JBQ3hCLElBQUksZUFBZSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLEVBQUU7NEJBQ3hELE9BQU8sZUFBZSxDQUFDLFNBQVMsQ0FDNUIsS0FBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUM5RSxZQUFZLENBQUMsQ0FBQzt5QkFDbkI7cUJBQ0Y7Ozs7Ozs7OztnQkFDRCxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxxQ0FBbUMsU0FBVyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0gsaUJBQUM7SUFBRCxDQUFDLEFBbkJELElBbUJDO0lBbkJZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtyZWxhdGl2ZX0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RmlsZVV0aWxzfSBmcm9tICcuLi9maWxlX3V0aWxzJztcblxuaW1wb3J0IHtPdXRwdXRQYXRoRm59IGZyb20gJy4vb3V0cHV0X3BhdGgnO1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IGhvbGRzIGluZm9ybWF0aW9uIHRvIGJlIHVzZWQgdG8gdHJhbnNsYXRlIGZpbGVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgbG9jYWxlOiBzdHJpbmc7XG4gIHRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPjtcbiAgZGlhZ25vc3RpY3M/OiBEaWFnbm9zdGljcztcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2UgdG8gcHJvdmlkZSBhIGNsYXNzIHRoYXQgY2FuIGhhbmRsZSB0cmFuc2xhdGlvbiBmb3IgdGhlIGdpdmVuIHJlc291cmNlIGluXG4gKiBhbiBhcHByb3ByaWF0ZSBtYW5uZXIuXG4gKlxuICogRm9yIGV4YW1wbGUsIHNvdXJjZSBjb2RlIGZpbGVzIHdpbGwgbmVlZCB0byBiZSB0cmFuc2Zvcm1lZCBpZiB0aGV5IGNvbnRhaW4gYCRsb2NhbGl6ZWAgdGFnZ2VkXG4gKiB0ZW1wbGF0ZSBzdHJpbmdzLCB3aGlsZSBtb3N0IHN0YXRpYyBhc3NldHMgd2lsbCBqdXN0IG5lZWQgdG8gYmUgY29waWVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGZpbGUgY2FuIGJlIHRyYW5zbGF0ZWQgYnkgdGhpcyBoYW5kbGVyLlxuICAgKlxuICAgKiBAcGFyYW0gcmVsYXRpdmVGaWxlUGF0aCBBIHJlbGF0aXZlIHBhdGggZnJvbSB0aGUgc291cmNlUm9vdCB0byB0aGUgcmVzb3VyY2UgZmlsZSB0byBoYW5kbGUuXG4gICAqIEBwYXJhbSBjb250ZW50cyBUaGUgY29udGVudHMgb2YgdGhlIGZpbGUgdG8gaGFuZGxlLlxuICAgKi9cbiAgY2FuVHJhbnNsYXRlKHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcik6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0aGUgZmlsZSBhdCBgcmVsYXRpdmVGaWxlUGF0aGAgY29udGFpbmluZyBgY29udGVudHNgLCB1c2luZyB0aGUgZ2l2ZW4gYHRyYW5zbGF0aW9uc2AsXG4gICAqIGFuZCB3cml0ZSB0aGUgdHJhbnNsYXRlZCBjb250ZW50IHRvIHRoZSBwYXRoIGNvbXB1dGVkIGJ5IGNhbGxpbmcgYG91dHB1dFBhdGhGbigpYC5cbiAgICpcbiAgICogQHBhcmFtIGRpYWdub3N0aWNzIEFuIG9iamVjdCBmb3IgY29sbGVjdGluZyB0cmFuc2xhdGlvbiBkaWFnbm9zdGljIG1lc3NhZ2VzLlxuICAgKiBAcGFyYW0gc291cmNlUm9vdCBBbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSByb290IG9mIHRoZSBmaWxlcyBiZWluZyB0cmFuc2xhdGVkLlxuICAgKiBAcGFyYW0gcmVsYXRpdmVGaWxlUGF0aCBBIHJlbGF0aXZlIHBhdGggZnJvbSB0aGUgc291cmNlUm9vdCB0byB0aGUgZmlsZSB0byB0cmFuc2xhdGUuXG4gICAqIEBwYXJhbSBjb250ZW50cyBUaGUgY29udGVudHMgb2YgdGhlIGZpbGUgdG8gdHJhbnNsYXRlLlxuICAgKiBAcGFyYW0gb3V0cHV0UGF0aEZuIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFic29sdXRlIHBhdGggd2hlcmUgdGhlIG91dHB1dCBmaWxlIHNob3VsZCBiZVxuICAgKiB3cml0dGVuLlxuICAgKiBAcGFyYW0gdHJhbnNsYXRpb25zIEEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgdG8gYXBwbHkgdG8gdGhpcyBmaWxlLlxuICAgKiBAcGFyYW0gc291cmNlTG9jYWxlIFRoZSBsb2NhbGUgb2YgdGhlIG9yaWdpbmFsIGFwcGxpY2F0aW9uIHNvdXJjZS4gSWYgcHJvdmlkZWQgdGhlbiBhblxuICAgKiBhZGRpdGlvbmFsIGNvcHkgb2YgdGhlIGFwcGxpY2F0aW9uIGlzIGNyZWF0ZWQgdW5kZXIgdGhpcyBsb2NhbGUganVzdCB3aXRoIHRoZSBgJGxvY2FsaXplYCBjYWxsc1xuICAgKiBzdHJpcHBlZCBvdXQuXG4gICAqL1xuICB0cmFuc2xhdGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHNvdXJjZVJvb3Q6IHN0cmluZywgcmVsYXRpdmVGaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogQnVmZmVyLFxuICAgICAgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25CdW5kbGVbXSwgc291cmNlTG9jYWxlPzogc3RyaW5nKTogdm9pZDtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgZWFjaCBmaWxlIChlLmcuIHNvdXJjZSBmaWxlIG9yIHN0YXRpYyBhc3NldCkgdXNpbmcgdGhlIGdpdmVuIGBUcmFuc2xhdGlvbkhhbmRsZXJgcy5cbiAqIFRoZSBmaWxlIHdpbGwgYmUgdHJhbnNsYXRlZCBieSB0aGUgZmlyc3QgaGFuZGxlciB0aGF0IHJldHVybnMgdHJ1ZSBmb3IgYGNhblRyYW5zbGF0ZSgpYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlc291cmNlSGFuZGxlcnM6IFRyYW5zbGF0aW9uSGFuZGxlcltdLCBwcml2YXRlIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcykge31cblxuICB0cmFuc2xhdGVGaWxlcyhcbiAgICAgIGlucHV0UGF0aHM6IHN0cmluZ1tdLCByb290UGF0aDogc3RyaW5nLCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbixcbiAgICAgIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25CdW5kbGVbXSwgc291cmNlTG9jYWxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgaW5wdXRQYXRocy5mb3JFYWNoKGlucHV0UGF0aCA9PiB7XG4gICAgICBjb25zdCBjb250ZW50cyA9IEZpbGVVdGlscy5yZWFkRmlsZUJ1ZmZlcihpbnB1dFBhdGgpO1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocm9vdFBhdGgsIGlucHV0UGF0aCk7XG4gICAgICBmb3IgKGNvbnN0IHJlc291cmNlSGFuZGxlciBvZiB0aGlzLnJlc291cmNlSGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKHJlc291cmNlSGFuZGxlci5jYW5UcmFuc2xhdGUocmVsYXRpdmVQYXRoLCBjb250ZW50cykpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb3VyY2VIYW5kbGVyLnRyYW5zbGF0ZShcbiAgICAgICAgICAgICAgdGhpcy5kaWFnbm9zdGljcywgcm9vdFBhdGgsIHJlbGF0aXZlUGF0aCwgY29udGVudHMsIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zLFxuICAgICAgICAgICAgICBzb3VyY2VMb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRpYWdub3N0aWNzLmVycm9yKGBVbmFibGUgdG8gaGFuZGxlIHJlc291cmNlIGZpbGU6ICR7aW5wdXRQYXRofWApO1xuICAgIH0pO1xuICB9XG59XG4iXX0=
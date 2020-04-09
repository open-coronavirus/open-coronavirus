(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_loader", ["require", "exports", "tslib", "@angular/localize/src/tools/src/file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Use this class to load a collection of translation files from disk.
     */
    var TranslationLoader = /** @class */ (function () {
        function TranslationLoader(translationParsers, 
        /** @deprecated */ diagnostics) {
            this.translationParsers = translationParsers;
            this.diagnostics = diagnostics;
        }
        /**
         * Load and parse the translation files into a collection of `TranslationBundles`.
         *
         * If there is a locale provided in `translationFileLocales` then this is used rather than the
         * locale extracted from the file itself.
         * If there is neither a provided locale nor a locale parsed from the file, then an error is
         * thrown.
         * If there are both a provided locale and a locale parsed from the file, and they are not the
         * same, then a warning is reported .
         *
         * @param translationFilePaths An array of absolute paths to the translation files.
         * @param translationFileLocales An array of locales for each of the translation files.
         */
        TranslationLoader.prototype.loadBundles = function (translationFilePaths, translationFileLocales) {
            var _this = this;
            return translationFilePaths.map(function (filePath, index) {
                var e_1, _a, _b;
                var fileContents = file_utils_1.FileUtils.readFile(filePath);
                try {
                    for (var _c = tslib_1.__values(_this.translationParsers), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var translationParser = _d.value;
                        var result = translationParser.canParse(filePath, fileContents);
                        if (!result) {
                            continue;
                        }
                        var _e = translationParser.parse(filePath, fileContents, result), parsedLocale = _e.locale, translations = _e.translations, diagnostics = _e.diagnostics;
                        if (diagnostics.hasErrors) {
                            throw new Error(diagnostics.formatDiagnostics("The translation file \"" + filePath + "\" could not be parsed."));
                        }
                        var providedLocale = translationFileLocales[index];
                        var locale = providedLocale || parsedLocale;
                        if (locale === undefined) {
                            throw new Error("The translation file \"" + filePath + "\" does not contain a target locale and no explicit locale was provided for this file.");
                        }
                        if (parsedLocale !== undefined && providedLocale !== undefined &&
                            parsedLocale !== providedLocale) {
                            diagnostics.warn("The provided locale \"" + providedLocale + "\" does not match the target locale \"" + parsedLocale + "\" found in the translation file \"" + filePath + "\".");
                        }
                        // If we were passed a diagnostics object then copy the messages over to it.
                        if (_this.diagnostics) {
                            (_b = _this.diagnostics.messages).push.apply(_b, tslib_1.__spread(diagnostics.messages));
                        }
                        return { locale: locale, translations: translations, diagnostics: diagnostics };
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                throw new Error("There is no \"TranslationParser\" that can parse this translation file: " + filePath + ".");
            });
        };
        return TranslationLoader;
    }());
    exports.TranslationLoader = TranslationLoader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLHlFQUEyQztJQUkzQzs7T0FFRztJQUNIO1FBQ0UsMkJBQ1ksa0JBQTRDO1FBQ3BELGtCQUFrQixDQUFTLFdBQXlCO1lBRDVDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7WUFDekIsZ0JBQVcsR0FBWCxXQUFXLENBQWM7UUFBRyxDQUFDO1FBRTVEOzs7Ozs7Ozs7Ozs7V0FZRztRQUNILHVDQUFXLEdBQVgsVUFBWSxvQkFBOEIsRUFBRSxzQkFBNEM7WUFBeEYsaUJBd0NDO1lBdENDLE9BQU8sb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQUMsUUFBUSxFQUFFLEtBQUs7O2dCQUM5QyxJQUFNLFlBQVksR0FBRyxzQkFBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7b0JBQ2xELEtBQWdDLElBQUEsS0FBQSxpQkFBQSxLQUFJLENBQUMsa0JBQWtCLENBQUEsZ0JBQUEsNEJBQUU7d0JBQXBELElBQU0saUJBQWlCLFdBQUE7d0JBQzFCLElBQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7d0JBQ2xFLElBQUksQ0FBQyxNQUFNLEVBQUU7NEJBQ1gsU0FBUzt5QkFDVjt3QkFFSyxJQUFBLDREQUNxRCxFQURwRCx3QkFBb0IsRUFBRSw4QkFBWSxFQUFFLDRCQUNnQixDQUFDO3dCQUM1RCxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUU7NEJBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUN6Qyw0QkFBeUIsUUFBUSw0QkFBd0IsQ0FBQyxDQUFDLENBQUM7eUJBQ2pFO3dCQUVELElBQU0sY0FBYyxHQUFHLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNyRCxJQUFNLE1BQU0sR0FBRyxjQUFjLElBQUksWUFBWSxDQUFDO3dCQUM5QyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7NEJBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQ1gsNEJBQXlCLFFBQVEsMkZBQXVGLENBQUMsQ0FBQzt5QkFDL0g7d0JBRUQsSUFBSSxZQUFZLEtBQUssU0FBUyxJQUFJLGNBQWMsS0FBSyxTQUFTOzRCQUMxRCxZQUFZLEtBQUssY0FBYyxFQUFFOzRCQUNuQyxXQUFXLENBQUMsSUFBSSxDQUNaLDJCQUF3QixjQUFjLDhDQUF1QyxZQUFZLDJDQUFvQyxRQUFRLFFBQUksQ0FBQyxDQUFDO3lCQUNoSjt3QkFFRCw0RUFBNEU7d0JBQzVFLElBQUksS0FBSSxDQUFDLFdBQVcsRUFBRTs0QkFDcEIsQ0FBQSxLQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFBLENBQUMsSUFBSSw0QkFBSSxXQUFXLENBQUMsUUFBUSxHQUFFO3lCQUN6RDt3QkFFRCxPQUFPLEVBQUMsTUFBTSxRQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQztxQkFDNUM7Ozs7Ozs7OztnQkFDRCxNQUFNLElBQUksS0FBSyxDQUNYLDZFQUF5RSxRQUFRLE1BQUcsQ0FBQyxDQUFDO1lBQzVGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQTNERCxJQTJEQztJQTNEWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0ZpbGVVdGlsc30gZnJvbSAnLi4vLi4vZmlsZV91dGlscyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlfSBmcm9tICcuLi90cmFuc2xhdG9yJztcbmltcG9ydCB7VHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2Vycy90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG4vKipcbiAqIFVzZSB0aGlzIGNsYXNzIHRvIGxvYWQgYSBjb2xsZWN0aW9uIG9mIHRyYW5zbGF0aW9uIGZpbGVzIGZyb20gZGlzay5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uTG9hZGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHRyYW5zbGF0aW9uUGFyc2VyczogVHJhbnNsYXRpb25QYXJzZXI8YW55PltdLFxuICAgICAgLyoqIEBkZXByZWNhdGVkICovIHByaXZhdGUgZGlhZ25vc3RpY3M/OiBEaWFnbm9zdGljcykge31cblxuICAvKipcbiAgICogTG9hZCBhbmQgcGFyc2UgdGhlIHRyYW5zbGF0aW9uIGZpbGVzIGludG8gYSBjb2xsZWN0aW9uIG9mIGBUcmFuc2xhdGlvbkJ1bmRsZXNgLlxuICAgKlxuICAgKiBJZiB0aGVyZSBpcyBhIGxvY2FsZSBwcm92aWRlZCBpbiBgdHJhbnNsYXRpb25GaWxlTG9jYWxlc2AgdGhlbiB0aGlzIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlXG4gICAqIGxvY2FsZSBleHRyYWN0ZWQgZnJvbSB0aGUgZmlsZSBpdHNlbGYuXG4gICAqIElmIHRoZXJlIGlzIG5laXRoZXIgYSBwcm92aWRlZCBsb2NhbGUgbm9yIGEgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSBmaWxlLCB0aGVuIGFuIGVycm9yIGlzXG4gICAqIHRocm93bi5cbiAgICogSWYgdGhlcmUgYXJlIGJvdGggYSBwcm92aWRlZCBsb2NhbGUgYW5kIGEgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSBmaWxlLCBhbmQgdGhleSBhcmUgbm90IHRoZVxuICAgKiBzYW1lLCB0aGVuIGEgd2FybmluZyBpcyByZXBvcnRlZCAuXG4gICAqXG4gICAqIEBwYXJhbSB0cmFuc2xhdGlvbkZpbGVQYXRocyBBbiBhcnJheSBvZiBhYnNvbHV0ZSBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAqIEBwYXJhbSB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzIEFuIGFycmF5IG9mIGxvY2FsZXMgZm9yIGVhY2ggb2YgdGhlIHRyYW5zbGF0aW9uIGZpbGVzLlxuICAgKi9cbiAgbG9hZEJ1bmRsZXModHJhbnNsYXRpb25GaWxlUGF0aHM6IHN0cmluZ1tdLCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzOiAoc3RyaW5nfHVuZGVmaW5lZClbXSk6XG4gICAgICBUcmFuc2xhdGlvbkJ1bmRsZVtdIHtcbiAgICByZXR1cm4gdHJhbnNsYXRpb25GaWxlUGF0aHMubWFwKChmaWxlUGF0aCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IEZpbGVVdGlscy5yZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uUGFyc2VyIG9mIHRoaXMudHJhbnNsYXRpb25QYXJzZXJzKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zbGF0aW9uUGFyc2VyLmNhblBhcnNlKGZpbGVQYXRoLCBmaWxlQ29udGVudHMpO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnMsIGRpYWdub3N0aWNzfSA9XG4gICAgICAgICAgICB0cmFuc2xhdGlvblBhcnNlci5wYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzLCByZXN1bHQpO1xuICAgICAgICBpZiAoZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKFxuICAgICAgICAgICAgICBgVGhlIHRyYW5zbGF0aW9uIGZpbGUgXCIke2ZpbGVQYXRofVwiIGNvdWxkIG5vdCBiZSBwYXJzZWQuYCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdmlkZWRMb2NhbGUgPSB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzW2luZGV4XTtcbiAgICAgICAgY29uc3QgbG9jYWxlID0gcHJvdmlkZWRMb2NhbGUgfHwgcGFyc2VkTG9jYWxlO1xuICAgICAgICBpZiAobG9jYWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBUaGUgdHJhbnNsYXRpb24gZmlsZSBcIiR7ZmlsZVBhdGh9XCIgZG9lcyBub3QgY29udGFpbiBhIHRhcmdldCBsb2NhbGUgYW5kIG5vIGV4cGxpY2l0IGxvY2FsZSB3YXMgcHJvdmlkZWQgZm9yIHRoaXMgZmlsZS5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJzZWRMb2NhbGUgIT09IHVuZGVmaW5lZCAmJiBwcm92aWRlZExvY2FsZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBwYXJzZWRMb2NhbGUgIT09IHByb3ZpZGVkTG9jYWxlKSB7XG4gICAgICAgICAgZGlhZ25vc3RpY3Mud2FybihcbiAgICAgICAgICAgICAgYFRoZSBwcm92aWRlZCBsb2NhbGUgXCIke3Byb3ZpZGVkTG9jYWxlfVwiIGRvZXMgbm90IG1hdGNoIHRoZSB0YXJnZXQgbG9jYWxlIFwiJHtwYXJzZWRMb2NhbGV9XCIgZm91bmQgaW4gdGhlIHRyYW5zbGF0aW9uIGZpbGUgXCIke2ZpbGVQYXRofVwiLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2Ugd2VyZSBwYXNzZWQgYSBkaWFnbm9zdGljcyBvYmplY3QgdGhlbiBjb3B5IHRoZSBtZXNzYWdlcyBvdmVyIHRvIGl0LlxuICAgICAgICBpZiAodGhpcy5kaWFnbm9zdGljcykge1xuICAgICAgICAgIHRoaXMuZGlhZ25vc3RpY3MubWVzc2FnZXMucHVzaCguLi5kaWFnbm9zdGljcy5tZXNzYWdlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2xvY2FsZSwgdHJhbnNsYXRpb25zLCBkaWFnbm9zdGljc307XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRoZXJlIGlzIG5vIFwiVHJhbnNsYXRpb25QYXJzZXJcIiB0aGF0IGNhbiBwYXJzZSB0aGlzIHRyYW5zbGF0aW9uIGZpbGU6ICR7ZmlsZVBhdGh9LmApO1xuICAgIH0pO1xuICB9XG59XG4iXX0=
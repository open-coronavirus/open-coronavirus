(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", ["require", "exports", "tslib", "@angular/localize/src/tools/src/file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Translate an asset file by simply copying it to the appropriate translation output paths.
     */
    var AssetTranslationHandler = /** @class */ (function () {
        function AssetTranslationHandler() {
        }
        AssetTranslationHandler.prototype.canTranslate = function (_relativeFilePath, _contents) { return true; };
        AssetTranslationHandler.prototype.translate = function (diagnostics, _sourceRoot, relativeFilePath, contents, outputPathFn, translations, sourceLocale) {
            var e_1, _a;
            try {
                for (var translations_1 = tslib_1.__values(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
                    var translation = translations_1_1.value;
                    try {
                        file_utils_1.FileUtils.writeFile(outputPathFn(translation.locale, relativeFilePath), contents);
                    }
                    catch (e) {
                        diagnostics.error(e.message);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (translations_1_1 && !translations_1_1.done && (_a = translations_1.return)) _a.call(translations_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (sourceLocale !== undefined) {
                try {
                    file_utils_1.FileUtils.writeFile(outputPathFn(sourceLocale, relativeFilePath), contents);
                }
                catch (e) {
                    diagnostics.error(e.message);
                }
            }
        };
        return AssetTranslationHandler;
    }());
    exports.AssetTranslationHandler = AssetTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEseUVBQTJDO0lBSTNDOztPQUVHO0lBQ0g7UUFBQTtRQW9CQSxDQUFDO1FBbkJDLDhDQUFZLEdBQVosVUFBYSxpQkFBeUIsRUFBRSxTQUFpQixJQUFhLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwRiwyQ0FBUyxHQUFULFVBQ0ksV0FBd0IsRUFBRSxXQUFtQixFQUFFLGdCQUF3QixFQUFFLFFBQWdCLEVBQ3pGLFlBQTBCLEVBQUUsWUFBaUMsRUFBRSxZQUFxQjs7O2dCQUN0RixLQUEwQixJQUFBLGlCQUFBLGlCQUFBLFlBQVksQ0FBQSwwQ0FBQSxvRUFBRTtvQkFBbkMsSUFBTSxXQUFXLHlCQUFBO29CQUNwQixJQUFJO3dCQUNGLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ25GO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUM5QjtpQkFDRjs7Ozs7Ozs7O1lBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO2dCQUM5QixJQUFJO29CQUNGLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDN0U7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Y7UUFDSCxDQUFDO1FBQ0gsOEJBQUM7SUFBRCxDQUFDLEFBcEJELElBb0JDO0lBcEJZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RmlsZVV0aWxzfSBmcm9tICcuLi8uLi9maWxlX3V0aWxzJztcbmltcG9ydCB7T3V0cHV0UGF0aEZufSBmcm9tICcuLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4uL3RyYW5zbGF0b3InO1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhbiBhc3NldCBmaWxlIGJ5IHNpbXBseSBjb3B5aW5nIGl0IHRvIHRoZSBhcHByb3ByaWF0ZSB0cmFuc2xhdGlvbiBvdXRwdXQgcGF0aHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3NldFRyYW5zbGF0aW9uSGFuZGxlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIGNhblRyYW5zbGF0ZShfcmVsYXRpdmVGaWxlUGF0aDogc3RyaW5nLCBfY29udGVudHM6IEJ1ZmZlcik6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxuICB0cmFuc2xhdGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIF9zb3VyY2VSb290OiBzdHJpbmcsIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcixcbiAgICAgIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlW10sIHNvdXJjZUxvY2FsZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgdHJhbnNsYXRpb24gb2YgdHJhbnNsYXRpb25zKSB7XG4gICAgICB0cnkge1xuICAgICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKG91dHB1dFBhdGhGbih0cmFuc2xhdGlvbi5sb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpLCBjb250ZW50cyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzb3VyY2VMb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgRmlsZVV0aWxzLndyaXRlRmlsZShvdXRwdXRQYXRoRm4oc291cmNlTG9jYWxlLCByZWxhdGl2ZUZpbGVQYXRoKSwgY29udGVudHMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
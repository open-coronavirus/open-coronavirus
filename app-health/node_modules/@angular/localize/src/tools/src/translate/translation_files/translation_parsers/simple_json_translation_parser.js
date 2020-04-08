(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser", ["require", "exports", "@angular/localize", "path", "@angular/localize/src/tools/src/diagnostics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    var path_1 = require("path");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    /**
     * A translation parser that can parse JSON that has the form:
     *
     * ```
     * {
     *   "locale": "...",
     *   "translations": {
     *     "message-id": "Target message string",
     *     ...
     *   }
     * }
     * ```
     */
    var SimpleJsonTranslationParser = /** @class */ (function () {
        function SimpleJsonTranslationParser() {
        }
        SimpleJsonTranslationParser.prototype.canParse = function (filePath, _contents) { return (path_1.extname(filePath) === '.json'); };
        SimpleJsonTranslationParser.prototype.parse = function (_filePath, contents) {
            var _a = JSON.parse(contents), parsedLocale = _a.locale, translations = _a.translations;
            var parsedTranslations = {};
            for (var messageId in translations) {
                var targetMessage = translations[messageId];
                parsedTranslations[messageId] = localize_1.ɵparseTranslation(targetMessage);
            }
            return { locale: parsedLocale, translations: parsedTranslations, diagnostics: new diagnostics_1.Diagnostics() };
        };
        return SimpleJsonTranslationParser;
    }());
    exports.SimpleJsonTranslationParser = SimpleJsonTranslationParser;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBb0Y7SUFDcEYsNkJBQTZCO0lBQzdCLDJFQUFpRDtJQUdqRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSDtRQUFBO1FBWUEsQ0FBQztRQVhDLDhDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFNBQWlCLElBQWEsT0FBTyxDQUFDLGNBQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEcsMkNBQUssR0FBTCxVQUFNLFNBQWlCLEVBQUUsUUFBZ0I7WUFDakMsSUFBQSx5QkFBMkQsRUFBMUQsd0JBQW9CLEVBQUUsOEJBQW9DLENBQUM7WUFDbEUsSUFBTSxrQkFBa0IsR0FBMkMsRUFBRSxDQUFDO1lBQ3RFLEtBQUssSUFBTSxTQUFTLElBQUksWUFBWSxFQUFFO2dCQUNwQyxJQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLDRCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsT0FBTyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxJQUFJLHlCQUFXLEVBQUUsRUFBQyxDQUFDO1FBQ2xHLENBQUM7UUFDSCxrQ0FBQztJQUFELENBQUMsQUFaRCxJQVlDO0lBWlksa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbiwgybVwYXJzZVRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBwYXJzZSBKU09OIHRoYXQgaGFzIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICoge1xuICogICBcImxvY2FsZVwiOiBcIi4uLlwiLFxuICogICBcInRyYW5zbGF0aW9uc1wiOiB7XG4gKiAgICAgXCJtZXNzYWdlLWlkXCI6IFwiVGFyZ2V0IG1lc3NhZ2Ugc3RyaW5nXCIsXG4gKiAgICAgLi4uXG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXIge1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBfY29udGVudHM6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gKGV4dG5hbWUoZmlsZVBhdGgpID09PSAnLmpzb24nKTsgfVxuXG4gIHBhcnNlKF9maWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IHtsb2NhbGU6IHBhcnNlZExvY2FsZSwgdHJhbnNsYXRpb25zfSA9IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgIGNvbnN0IHBhcnNlZFRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiA9IHt9O1xuICAgIGZvciAoY29uc3QgbWVzc2FnZUlkIGluIHRyYW5zbGF0aW9ucykge1xuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZSA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlSWRdO1xuICAgICAgcGFyc2VkVHJhbnNsYXRpb25zW21lc3NhZ2VJZF0gPSDJtXBhcnNlVHJhbnNsYXRpb24odGFyZ2V0TWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiB7bG9jYWxlOiBwYXJzZWRMb2NhbGUsIHRyYW5zbGF0aW9uczogcGFyc2VkVHJhbnNsYXRpb25zLCBkaWFnbm9zdGljczogbmV3IERpYWdub3N0aWNzKCl9O1xuICB9XG59XG4iXX0=
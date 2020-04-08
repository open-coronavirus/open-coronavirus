(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", ["require", "exports", "tslib", "@babel/core", "path", "@angular/localize/src/tools/src/file_utils", "@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/locale_plugin"], factory);
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
    var core_1 = require("@babel/core");
    var path_1 = require("path");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    var es2015_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin");
    var es5_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin");
    var locale_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/locale_plugin");
    /**
     * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
     * message.
     */
    var SourceFileTranslationHandler = /** @class */ (function () {
        function SourceFileTranslationHandler(translationOptions) {
            if (translationOptions === void 0) { translationOptions = {}; }
            this.translationOptions = translationOptions;
            this.sourceLocaleOptions = tslib_1.__assign(tslib_1.__assign({}, this.translationOptions), { missingTranslation: 'ignore' });
        }
        SourceFileTranslationHandler.prototype.canTranslate = function (relativeFilePath, _contents) {
            return path_1.extname(relativeFilePath) === '.js';
        };
        SourceFileTranslationHandler.prototype.translate = function (diagnostics, sourceRoot, relativeFilePath, contents, outputPathFn, translations, sourceLocale) {
            var e_1, _a, e_2, _b;
            var sourceCode = contents.toString('utf8');
            // A short-circuit check to avoid parsing the file into an AST if it does not contain any
            // `$localize` identifiers.
            if (!sourceCode.includes('$localize')) {
                try {
                    for (var translations_1 = tslib_1.__values(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
                        var translation = translations_1_1.value;
                        file_utils_1.FileUtils.writeFile(outputPathFn(translation.locale, relativeFilePath), contents);
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
                    file_utils_1.FileUtils.writeFile(outputPathFn(sourceLocale, relativeFilePath), contents);
                }
            }
            else {
                var ast = core_1.parseSync(sourceCode, { sourceRoot: sourceRoot, filename: relativeFilePath });
                if (!ast) {
                    diagnostics.error("Unable to parse source file: " + path_1.join(sourceRoot, relativeFilePath));
                    return;
                }
                try {
                    // Output a translated copy of the file for each locale.
                    for (var translations_2 = tslib_1.__values(translations), translations_2_1 = translations_2.next(); !translations_2_1.done; translations_2_1 = translations_2.next()) {
                        var translationBundle = translations_2_1.value;
                        this.translateFile(diagnostics, ast, translationBundle, sourceRoot, relativeFilePath, outputPathFn, this.translationOptions);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (translations_2_1 && !translations_2_1.done && (_b = translations_2.return)) _b.call(translations_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (sourceLocale !== undefined) {
                    // Also output a copy of the file for the source locale.
                    // There will be no translations - by definition - so we "ignore" `missingTranslations`.
                    this.translateFile(diagnostics, ast, { locale: sourceLocale, translations: {} }, sourceRoot, relativeFilePath, outputPathFn, this.sourceLocaleOptions);
                }
            }
        };
        SourceFileTranslationHandler.prototype.translateFile = function (diagnostics, ast, translationBundle, sourceRoot, filename, outputPathFn, options) {
            var translated = core_1.transformFromAstSync(ast, undefined, {
                compact: true,
                generatorOpts: { minified: true },
                plugins: [
                    locale_plugin_1.makeLocalePlugin(translationBundle.locale),
                    es2015_translate_plugin_1.makeEs2015TranslatePlugin(diagnostics, translationBundle.translations, options),
                    es5_translate_plugin_1.makeEs5TranslatePlugin(diagnostics, translationBundle.translations, options),
                ],
                filename: filename,
            });
            if (translated && translated.code) {
                file_utils_1.FileUtils.writeFile(outputPathFn(translationBundle.locale, filename), translated.code);
            }
            else {
                diagnostics.error("Unable to translate source file: " + path_1.join(sourceRoot, filename));
                return;
            }
        };
        return SourceFileTranslationHandler;
    }());
    exports.SourceFileTranslationHandler = SourceFileTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILG9DQUE0RDtJQUU1RCw2QkFBbUM7SUFFbkMseUVBQTJDO0lBRzNDLDBIQUFvRTtJQUNwRSxvSEFBOEQ7SUFDOUQsc0dBQWlEO0lBR2pEOzs7T0FHRztJQUNIO1FBR0Usc0NBQW9CLGtCQUErQztZQUEvQyxtQ0FBQSxFQUFBLHVCQUErQztZQUEvQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQTZCO1lBRjNELHdCQUFtQix5Q0FDTSxJQUFJLENBQUMsa0JBQWtCLEtBQUUsa0JBQWtCLEVBQUUsUUFBUSxJQUFFO1FBQ2xCLENBQUM7UUFFdkUsbURBQVksR0FBWixVQUFhLGdCQUF3QixFQUFFLFNBQWlCO1lBQ3RELE9BQU8sY0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssS0FBSyxDQUFDO1FBQzdDLENBQUM7UUFFRCxnREFBUyxHQUFULFVBQ0ksV0FBd0IsRUFBRSxVQUFrQixFQUFFLGdCQUF3QixFQUFFLFFBQWdCLEVBQ3hGLFlBQTBCLEVBQUUsWUFBaUMsRUFBRSxZQUFxQjs7WUFDdEYsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3Qyx5RkFBeUY7WUFDekYsMkJBQTJCO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFOztvQkFDckMsS0FBMEIsSUFBQSxpQkFBQSxpQkFBQSxZQUFZLENBQUEsMENBQUEsb0VBQUU7d0JBQW5DLElBQU0sV0FBVyx5QkFBQTt3QkFDcEIsc0JBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDbkY7Ozs7Ozs7OztnQkFDRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7b0JBQzlCLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDN0U7YUFDRjtpQkFBTTtnQkFDTCxJQUFNLEdBQUcsR0FBRyxnQkFBUyxDQUFDLFVBQVUsRUFBRSxFQUFDLFVBQVUsWUFBQSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ1IsV0FBVyxDQUFDLEtBQUssQ0FBQyxrQ0FBZ0MsV0FBSSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBRyxDQUFDLENBQUM7b0JBQ3hGLE9BQU87aUJBQ1I7O29CQUNELHdEQUF3RDtvQkFDeEQsS0FBZ0MsSUFBQSxpQkFBQSxpQkFBQSxZQUFZLENBQUEsMENBQUEsb0VBQUU7d0JBQXpDLElBQU0saUJBQWlCLHlCQUFBO3dCQUMxQixJQUFJLENBQUMsYUFBYSxDQUNkLFdBQVcsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFDL0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7cUJBQzlCOzs7Ozs7Ozs7Z0JBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO29CQUM5Qix3REFBd0Q7b0JBQ3hELHdGQUF3RjtvQkFDeEYsSUFBSSxDQUFDLGFBQWEsQ0FDZCxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFDLEVBQUUsVUFBVSxFQUN0RSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7aUJBQy9EO2FBQ0Y7UUFDSCxDQUFDO1FBRU8sb0RBQWEsR0FBckIsVUFDSSxXQUF3QixFQUFFLEdBQWlCLEVBQUUsaUJBQW9DLEVBQ2pGLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxZQUEwQixFQUNoRSxPQUErQjtZQUNqQyxJQUFNLFVBQVUsR0FBRywyQkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFO2dCQUN0RCxPQUFPLEVBQUUsSUFBSTtnQkFDYixhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDO2dCQUMvQixPQUFPLEVBQUU7b0JBQ1AsZ0NBQWdCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO29CQUMxQyxtREFBeUIsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQztvQkFDL0UsNkNBQXNCLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7aUJBQzdFO2dCQUNELFFBQVEsVUFBQTthQUNULENBQUMsQ0FBQztZQUNILElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pDLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hGO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyxLQUFLLENBQUMsc0NBQW9DLFdBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFHLENBQUMsQ0FBQztnQkFDcEYsT0FBTzthQUNSO1FBQ0gsQ0FBQztRQUNILG1DQUFDO0lBQUQsQ0FBQyxBQWpFRCxJQWlFQztJQWpFWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge3BhcnNlU3luYywgdHJhbnNmb3JtRnJvbUFzdFN5bmN9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7RmlsZSwgUHJvZ3JhbX0gZnJvbSAnQGJhYmVsL3R5cGVzJztcbmltcG9ydCB7ZXh0bmFtZSwgam9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0ZpbGVVdGlsc30gZnJvbSAnLi4vLi4vZmlsZV91dGlscyc7XG5pbXBvcnQge091dHB1dFBhdGhGbn0gZnJvbSAnLi4vb3V0cHV0X3BhdGgnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuLi90cmFuc2xhdG9yJztcbmltcG9ydCB7bWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbn0gZnJvbSAnLi9lczIwMTVfdHJhbnNsYXRlX3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVUcmFuc2xhdGVQbHVnaW59IGZyb20gJy4vZXM1X3RyYW5zbGF0ZV9wbHVnaW4nO1xuaW1wb3J0IHttYWtlTG9jYWxlUGx1Z2lufSBmcm9tICcuL2xvY2FsZV9wbHVnaW4nO1xuaW1wb3J0IHtUcmFuc2xhdGVQbHVnaW5PcHRpb25zfSBmcm9tICcuL3NvdXJjZV9maWxlX3V0aWxzJztcblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBmaWxlIGJ5IGlubGluaW5nIGFsbCBtZXNzYWdlcyB0YWdnZWQgYnkgYCRsb2NhbGl6ZWAgd2l0aCB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRlZFxuICogbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvbkhhbmRsZXIge1xuICBwcml2YXRlIHNvdXJjZUxvY2FsZU9wdGlvbnM6XG4gICAgICBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0gey4uLnRoaXMudHJhbnNsYXRpb25PcHRpb25zLCBtaXNzaW5nVHJhbnNsYXRpb246ICdpZ25vcmUnfTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0cmFuc2xhdGlvbk9wdGlvbnM6IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSkge31cblxuICBjYW5UcmFuc2xhdGUocmVsYXRpdmVGaWxlUGF0aDogc3RyaW5nLCBfY29udGVudHM6IEJ1ZmZlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBleHRuYW1lKHJlbGF0aXZlRmlsZVBhdGgpID09PSAnLmpzJztcbiAgfVxuXG4gIHRyYW5zbGF0ZShcbiAgICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgc291cmNlUm9vdDogc3RyaW5nLCByZWxhdGl2ZUZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBCdWZmZXIsXG4gICAgICBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdLCBzb3VyY2VMb2NhbGU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBzb3VyY2VDb2RlID0gY29udGVudHMudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAvLyBBIHNob3J0LWNpcmN1aXQgY2hlY2sgdG8gYXZvaWQgcGFyc2luZyB0aGUgZmlsZSBpbnRvIGFuIEFTVCBpZiBpdCBkb2VzIG5vdCBjb250YWluIGFueVxuICAgIC8vIGAkbG9jYWxpemVgIGlkZW50aWZpZXJzLlxuICAgIGlmICghc291cmNlQ29kZS5pbmNsdWRlcygnJGxvY2FsaXplJykpIHtcbiAgICAgIGZvciAoY29uc3QgdHJhbnNsYXRpb24gb2YgdHJhbnNsYXRpb25zKSB7XG4gICAgICAgIEZpbGVVdGlscy53cml0ZUZpbGUob3V0cHV0UGF0aEZuKHRyYW5zbGF0aW9uLmxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCksIGNvbnRlbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChzb3VyY2VMb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKG91dHB1dFBhdGhGbihzb3VyY2VMb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpLCBjb250ZW50cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFzdCA9IHBhcnNlU3luYyhzb3VyY2VDb2RlLCB7c291cmNlUm9vdCwgZmlsZW5hbWU6IHJlbGF0aXZlRmlsZVBhdGh9KTtcbiAgICAgIGlmICghYXN0KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLmVycm9yKGBVbmFibGUgdG8gcGFyc2Ugc291cmNlIGZpbGU6ICR7am9pbihzb3VyY2VSb290LCByZWxhdGl2ZUZpbGVQYXRoKX1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gT3V0cHV0IGEgdHJhbnNsYXRlZCBjb3B5IG9mIHRoZSBmaWxlIGZvciBlYWNoIGxvY2FsZS5cbiAgICAgIGZvciAoY29uc3QgdHJhbnNsYXRpb25CdW5kbGUgb2YgdHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlRmlsZShcbiAgICAgICAgICAgIGRpYWdub3N0aWNzLCBhc3QsIHRyYW5zbGF0aW9uQnVuZGxlLCBzb3VyY2VSb290LCByZWxhdGl2ZUZpbGVQYXRoLCBvdXRwdXRQYXRoRm4sXG4gICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uT3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBpZiAoc291cmNlTG9jYWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gQWxzbyBvdXRwdXQgYSBjb3B5IG9mIHRoZSBmaWxlIGZvciB0aGUgc291cmNlIGxvY2FsZS5cbiAgICAgICAgLy8gVGhlcmUgd2lsbCBiZSBubyB0cmFuc2xhdGlvbnMgLSBieSBkZWZpbml0aW9uIC0gc28gd2UgXCJpZ25vcmVcIiBgbWlzc2luZ1RyYW5zbGF0aW9uc2AuXG4gICAgICAgIHRoaXMudHJhbnNsYXRlRmlsZShcbiAgICAgICAgICAgIGRpYWdub3N0aWNzLCBhc3QsIHtsb2NhbGU6IHNvdXJjZUxvY2FsZSwgdHJhbnNsYXRpb25zOiB7fX0sIHNvdXJjZVJvb3QsXG4gICAgICAgICAgICByZWxhdGl2ZUZpbGVQYXRoLCBvdXRwdXRQYXRoRm4sIHRoaXMuc291cmNlTG9jYWxlT3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2xhdGVGaWxlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBhc3Q6IEZpbGV8UHJvZ3JhbSwgdHJhbnNsYXRpb25CdW5kbGU6IFRyYW5zbGF0aW9uQnVuZGxlLFxuICAgICAgc291cmNlUm9vdDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbixcbiAgICAgIG9wdGlvbnM6IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMpIHtcbiAgICBjb25zdCB0cmFuc2xhdGVkID0gdHJhbnNmb3JtRnJvbUFzdFN5bmMoYXN0LCB1bmRlZmluZWQsIHtcbiAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICBnZW5lcmF0b3JPcHRzOiB7bWluaWZpZWQ6IHRydWV9LFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBtYWtlTG9jYWxlUGx1Z2luKHRyYW5zbGF0aW9uQnVuZGxlLmxvY2FsZSksXG4gICAgICAgIG1ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICAgIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICBdLFxuICAgICAgZmlsZW5hbWUsXG4gICAgfSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgJiYgdHJhbnNsYXRlZC5jb2RlKSB7XG4gICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKG91dHB1dFBhdGhGbih0cmFuc2xhdGlvbkJ1bmRsZS5sb2NhbGUsIGZpbGVuYW1lKSwgdHJhbnNsYXRlZC5jb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoYFVuYWJsZSB0byB0cmFuc2xhdGUgc291cmNlIGZpbGU6ICR7am9pbihzb3VyY2VSb290LCBmaWxlbmFtZSl9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iXX0=
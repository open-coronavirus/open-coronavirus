(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/base_visitor");
    var message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load XLIFF 1.2 files.
     *
     * http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
     * http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
     *
     */
    var Xliff1TranslationParser = /** @class */ (function () {
        function Xliff1TranslationParser() {
        }
        Xliff1TranslationParser.prototype.canParse = function (filePath, contents) {
            return translation_utils_1.canParseXml(filePath, contents, 'xliff', { version: '1.2' });
        };
        Xliff1TranslationParser.prototype.parse = function (filePath, contents, hint) {
            if (hint) {
                return this.extractBundle(hint);
            }
            else {
                return this.extractBundleDeprecated(filePath, contents);
            }
        };
        Xliff1TranslationParser.prototype.extractBundle = function (_a) {
            var e_1, _b;
            var element = _a.element, errors = _a.errors;
            var diagnostics = new diagnostics_1.Diagnostics();
            errors.forEach(function (e) { return translation_utils_1.addParseError(diagnostics, e); });
            if (element.children.length === 0) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, 'Missing expected <file> element', compiler_1.ParseErrorLevel.WARNING);
                return { locale: undefined, translations: {}, diagnostics: diagnostics };
            }
            var files = element.children.filter(translation_utils_1.isNamedElement('file'));
            if (files.length === 0) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            else if (files.length > 1) {
                translation_utils_1.addParseDiagnostic(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            var bundle = { locale: undefined, translations: {}, diagnostics: diagnostics };
            var translationVisitor = new XliffTranslationVisitor();
            var localesFound = new Set();
            try {
                for (var files_1 = tslib_1.__values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    var locale = translation_utils_1.getAttribute(file, 'target-language');
                    if (locale !== undefined) {
                        localesFound.add(locale);
                        bundle.locale = locale;
                    }
                    compiler_1.visitAll(translationVisitor, file.children, bundle);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_b = files_1.return)) _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (localesFound.size > 1) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, "More than one locale found in translation file: " + JSON.stringify(Array.from(localesFound)) + ". Using \"" + bundle.locale + "\"", compiler_1.ParseErrorLevel.WARNING);
            }
            return bundle;
        };
        Xliff1TranslationParser.prototype.extractBundleDeprecated = function (filePath, contents) {
            var hint = this.canParse(filePath, contents);
            if (!hint) {
                throw new Error("Unable to parse \"" + filePath + "\" as XLIFF 1.2 format.");
            }
            var bundle = this.extractBundle(hint);
            if (bundle.diagnostics.hasErrors) {
                var message = bundle.diagnostics.formatDiagnostics("Failed to parse \"" + filePath + "\" as XLIFF 1.2 format");
                throw new Error(message);
            }
            return bundle;
        };
        return Xliff1TranslationParser;
    }());
    exports.Xliff1TranslationParser = Xliff1TranslationParser;
    var XliffFileElementVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XliffFileElementVisitor, _super);
        function XliffFileElementVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XliffFileElementVisitor.prototype.visitElement = function (fileElement) {
            if (fileElement.name === 'file') {
                return { fileElement: fileElement, locale: translation_utils_1.getAttribute(fileElement, 'target-language') };
            }
        };
        return XliffFileElementVisitor;
    }(base_visitor_1.BaseVisitor));
    var XliffTranslationVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XliffTranslationVisitor, _super);
        function XliffTranslationVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XliffTranslationVisitor.prototype.visitElement = function (element, bundle) {
            if (element.name === 'trans-unit') {
                this.visitTransUnitElement(element, bundle);
            }
            else {
                compiler_1.visitAll(this, element.children, bundle);
            }
        };
        XliffTranslationVisitor.prototype.visitTransUnitElement = function (element, bundle) {
            // Error if no `id` attribute
            var id = translation_utils_1.getAttribute(element, 'id');
            if (id === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <trans-unit> element.", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is already a translation with the same id
            if (bundle.translations[id] !== undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + id + "\"", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is no `<target>` child element
            var targetMessage = element.children.find(translation_utils_1.isNamedElement('target'));
            if (targetMessage === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Missing required <target> element', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            try {
                bundle.translations[id] = serializeTargetMessage(targetMessage);
            }
            catch (e) {
                // Capture any errors from serialize the target message
                if (e.span && e.msg && e.level) {
                    translation_utils_1.addParseDiagnostic(bundle.diagnostics, e.span, e.msg, e.level);
                }
                else {
                    throw e;
                }
            }
        };
        return XliffTranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), {
            inlineElements: ['g', 'bx', 'ex', 'bpt', 'ept', 'ph', 'it', 'mrk'],
            placeholder: { elementName: 'x', nameAttribute: 'id' }
        });
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBcUU7SUFHckUsMkVBQWlEO0lBQ2pELHlHQUE0QztJQUM1QywySUFBOEU7SUFDOUUscUpBQXVGO0lBR3ZGLHVJQUE0SjtJQUU1Sjs7Ozs7O09BTUc7SUFDSDtRQUFBO1FBdUVBLENBQUM7UUF0RUMsMENBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsUUFBZ0I7WUFDekMsT0FBTywrQkFBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELHVDQUFLLEdBQUwsVUFBTSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBK0I7WUFFdkUsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6RDtRQUNILENBQUM7UUFFTywrQ0FBYSxHQUFyQixVQUFzQixFQUEyQzs7Z0JBQTFDLG9CQUFPLEVBQUUsa0JBQU07WUFDcEMsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7WUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGlDQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxF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SyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQ2xFLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQztTQUNyRCxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsbUNBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnQsIFBhcnNlRXJyb3JMZXZlbCwgdmlzaXRBbGx9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7ybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0Jhc2VWaXNpdG9yfSBmcm9tICcuLi9iYXNlX3Zpc2l0b3InO1xuaW1wb3J0IHtNZXNzYWdlU2VyaWFsaXplcn0gZnJvbSAnLi4vbWVzc2FnZV9zZXJpYWxpemF0aW9uL21lc3NhZ2Vfc2VyaWFsaXplcic7XG5pbXBvcnQge1RhcmdldE1lc3NhZ2VSZW5kZXJlcn0gZnJvbSAnLi4vbWVzc2FnZV9zZXJpYWxpemF0aW9uL3RhcmdldF9tZXNzYWdlX3JlbmRlcmVyJztcblxuaW1wb3J0IHtQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50LCBhZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIGlzTmFtZWRFbGVtZW50LCBwYXJzZUlubmVyUmFuZ2V9IGZyb20gJy4vdHJhbnNsYXRpb25fdXRpbHMnO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIGxvYWQgWExJRkYgMS4yIGZpbGVzLlxuICpcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3YxLjIvb3MveGxpZmYtY29yZS5odG1sXG4gKiBodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi92MS4yL3hsaWZmLXByb2ZpbGUtaHRtbC94bGlmZi1wcm9maWxlLWh0bWwtMS4yLmh0bWxcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjFUcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyPFhtbFRyYW5zbGF0aW9uUGFyc2VySGludD4ge1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgICByZXR1cm4gY2FuUGFyc2VYbWwoZmlsZVBhdGgsIGNvbnRlbnRzLCAneGxpZmYnLCB7dmVyc2lvbjogJzEuMid9KTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGhpbnQ/OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOlxuICAgICAgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGlmIChoaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZSh7ZWxlbWVudCwgZXJyb3JzfTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBhZGRQYXJzZUVycm9yKGRpYWdub3N0aWNzLCBlKSk7XG5cbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCAnTWlzc2luZyBleHBlY3RlZCA8ZmlsZT4gZWxlbWVudCcsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgICAgcmV0dXJuIHtsb2NhbGU6IHVuZGVmaW5lZCwgdHJhbnNsYXRpb25zOiB7fSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVzID0gZWxlbWVudC5jaGlsZHJlbi5maWx0ZXIoaXNOYW1lZEVsZW1lbnQoJ2ZpbGUnKSk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdObyA8ZmlsZT4gZWxlbWVudHMgZm91bmQgaW4gPHhsaWZmPicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgIH0gZWxzZSBpZiAoZmlsZXMubGVuZ3RoID4gMSkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBmaWxlc1sxXS5zb3VyY2VTcGFuLCAnTW9yZSB0aGFuIG9uZSA8ZmlsZT4gZWxlbWVudCBmb3VuZCBpbiA8eGxpZmY+JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSA9IHtsb2NhbGU6IHVuZGVmaW5lZCwgdHJhbnNsYXRpb25zOiB7fSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHRyYW5zbGF0aW9uVmlzaXRvciA9IG5ldyBYbGlmZlRyYW5zbGF0aW9uVmlzaXRvcigpO1xuICAgIGNvbnN0IGxvY2FsZXNGb3VuZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgY29uc3QgbG9jYWxlID0gZ2V0QXR0cmlidXRlKGZpbGUsICd0YXJnZXQtbGFuZ3VhZ2UnKTtcbiAgICAgIGlmIChsb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsb2NhbGVzRm91bmQuYWRkKGxvY2FsZSk7XG4gICAgICAgIGJ1bmRsZS5sb2NhbGUgPSBsb2NhbGU7XG4gICAgICB9XG4gICAgICB2aXNpdEFsbCh0cmFuc2xhdGlvblZpc2l0b3IsIGZpbGUuY2hpbGRyZW4sIGJ1bmRsZSk7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsZXNGb3VuZC5zaXplID4gMSkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYE1vcmUgdGhhbiBvbmUgbG9jYWxlIGZvdW5kIGluIHRyYW5zbGF0aW9uIGZpbGU6ICR7SlNPTi5zdHJpbmdpZnkoQXJyYXkuZnJvbShsb2NhbGVzRm91bmQpKX0uIFVzaW5nIFwiJHtidW5kbGUubG9jYWxlfVwiYCxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGNvbnN0IGhpbnQgPSB0aGlzLmNhblBhcnNlKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgaWYgKCFoaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMS4yIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIGlmIChidW5kbGUuZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoYEZhaWxlZCB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMS4yIGZvcm1hdGApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG5cbmNsYXNzIFhsaWZmRmlsZUVsZW1lbnRWaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoZmlsZUVsZW1lbnQ6IEVsZW1lbnQpOiBhbnkge1xuICAgIGlmIChmaWxlRWxlbWVudC5uYW1lID09PSAnZmlsZScpIHtcbiAgICAgIHJldHVybiB7ZmlsZUVsZW1lbnQsIGxvY2FsZTogZ2V0QXR0cmlidXRlKGZpbGVFbGVtZW50LCAndGFyZ2V0LWxhbmd1YWdlJyl9O1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBYbGlmZlRyYW5zbGF0aW9uVmlzaXRvciBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUpOiB2b2lkIHtcbiAgICBpZiAoZWxlbWVudC5uYW1lID09PSAndHJhbnMtdW5pdCcpIHtcbiAgICAgIHRoaXMudmlzaXRUcmFuc1VuaXRFbGVtZW50KGVsZW1lbnQsIGJ1bmRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIGJ1bmRsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFRyYW5zVW5pdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSk6IHZvaWQge1xuICAgIC8vIEVycm9yIGlmIG5vIGBpZGAgYXR0cmlidXRlXG4gICAgY29uc3QgaWQgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ2lkJyk7XG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgTWlzc2luZyByZXF1aXJlZCBcImlkXCIgYXR0cmlidXRlIG9uIDx0cmFucy11bml0PiBlbGVtZW50LmAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRXJyb3IgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRyYW5zbGF0aW9uIHdpdGggdGhlIHNhbWUgaWRcbiAgICBpZiAoYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2lkfVwiYCxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVycm9yIGlmIHRoZXJlIGlzIG5vIGA8dGFyZ2V0PmAgY2hpbGQgZWxlbWVudFxuICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSBlbGVtZW50LmNoaWxkcmVuLmZpbmQoaXNOYW1lZEVsZW1lbnQoJ3RhcmdldCcpKTtcbiAgICBpZiAodGFyZ2V0TWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdNaXNzaW5nIHJlcXVpcmVkIDx0YXJnZXQ+IGVsZW1lbnQnLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbaWRdID0gc2VyaWFsaXplVGFyZ2V0TWVzc2FnZSh0YXJnZXRNZXNzYWdlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBDYXB0dXJlIGFueSBlcnJvcnMgZnJvbSBzZXJpYWxpemUgdGhlIHRhcmdldCBtZXNzYWdlXG4gICAgICBpZiAoZS5zcGFuICYmIGUubXNnICYmIGUubGV2ZWwpIHtcbiAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKGJ1bmRsZS5kaWFnbm9zdGljcywgZS5zcGFuLCBlLm1zZywgZS5sZXZlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHNvdXJjZTogRWxlbWVudCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IE1lc3NhZ2VTZXJpYWxpemVyKG5ldyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIoKSwge1xuICAgIGlubGluZUVsZW1lbnRzOiBbJ2cnLCAnYngnLCAnZXgnLCAnYnB0JywgJ2VwdCcsICdwaCcsICdpdCcsICdtcmsnXSxcbiAgICBwbGFjZWhvbGRlcjoge2VsZW1lbnROYW1lOiAneCcsIG5hbWVBdHRyaWJ1dGU6ICdpZCd9XG4gIH0pO1xuICByZXR1cm4gc2VyaWFsaXplci5zZXJpYWxpemUocGFyc2VJbm5lclJhbmdlKHNvdXJjZSkpO1xufVxuIl19
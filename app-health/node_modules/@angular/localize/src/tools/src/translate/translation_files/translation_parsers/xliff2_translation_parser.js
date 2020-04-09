(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
     * A translation parser that can load translations from XLIFF 2 files.
     *
     * http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
     *
     */
    var Xliff2TranslationParser = /** @class */ (function () {
        function Xliff2TranslationParser() {
        }
        Xliff2TranslationParser.prototype.canParse = function (filePath, contents) {
            return translation_utils_1.canParseXml(filePath, contents, 'xliff', { version: '2.0' });
        };
        Xliff2TranslationParser.prototype.parse = function (filePath, contents, hint) {
            if (hint) {
                return this.extractBundle(hint);
            }
            else {
                return this.extractBundleDeprecated(filePath, contents);
            }
        };
        Xliff2TranslationParser.prototype.extractBundle = function (_a) {
            var e_1, _b;
            var element = _a.element, errors = _a.errors;
            var diagnostics = new diagnostics_1.Diagnostics();
            errors.forEach(function (e) { return translation_utils_1.addParseError(diagnostics, e); });
            var locale = translation_utils_1.getAttribute(element, 'trgLang');
            var files = element.children.filter(isFileElement);
            if (files.length === 0) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            else if (files.length > 1) {
                translation_utils_1.addParseDiagnostic(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            var bundle = { locale: locale, translations: {}, diagnostics: diagnostics };
            var translationVisitor = new Xliff2TranslationVisitor();
            try {
                for (var files_1 = tslib_1.__values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    compiler_1.visitAll(translationVisitor, file.children, { bundle: bundle });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_b = files_1.return)) _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return bundle;
        };
        Xliff2TranslationParser.prototype.extractBundleDeprecated = function (filePath, contents) {
            var hint = this.canParse(filePath, contents);
            if (!hint) {
                throw new Error("Unable to parse \"" + filePath + "\" as XLIFF 2.0 format.");
            }
            var bundle = this.extractBundle(hint);
            if (bundle.diagnostics.hasErrors) {
                var message = bundle.diagnostics.formatDiagnostics("Failed to parse \"" + filePath + "\" as XLIFF 2.0 format");
                throw new Error(message);
            }
            return bundle;
        };
        return Xliff2TranslationParser;
    }());
    exports.Xliff2TranslationParser = Xliff2TranslationParser;
    var Xliff2TranslationVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(Xliff2TranslationVisitor, _super);
        function Xliff2TranslationVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Xliff2TranslationVisitor.prototype.visitElement = function (element, _a) {
            var bundle = _a.bundle, unit = _a.unit;
            if (element.name === 'unit') {
                this.visitUnitElement(element, bundle);
            }
            else if (element.name === 'segment') {
                this.visitSegmentElement(element, bundle, unit);
            }
            else {
                compiler_1.visitAll(this, element.children, { bundle: bundle, unit: unit });
            }
        };
        Xliff2TranslationVisitor.prototype.visitUnitElement = function (element, bundle) {
            // Error if no `id` attribute
            var externalId = translation_utils_1.getAttribute(element, 'id');
            if (externalId === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <trans-unit> element.", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is already a translation with the same id
            if (bundle.translations[externalId] !== undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + externalId + "\"", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            compiler_1.visitAll(this, element.children, { bundle: bundle, unit: externalId });
        };
        Xliff2TranslationVisitor.prototype.visitSegmentElement = function (element, bundle, unit) {
            // A `<segment>` element must be below a `<unit>` element
            if (unit === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Invalid <segment> element: should be a child of a <unit> element.', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            var targetMessage = element.children.find(translation_utils_1.isNamedElement('target'));
            if (targetMessage === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Missing required <target> element', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            try {
                bundle.translations[unit] = serializeTargetMessage(targetMessage);
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
        return Xliff2TranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), {
            inlineElements: ['cp', 'sc', 'ec', 'mrk', 'sm', 'em'],
            placeholder: { elementName: 'ph', nameAttribute: 'equiv', bodyAttribute: 'disp' },
            placeholderContainer: { elementName: 'pc', startAttribute: 'equivStart', endAttribute: 'equivEnd' }
        });
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
    function isFileElement(node) {
        return node instanceof compiler_1.Element && node.name === 'file';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBMkU7SUFHM0UsMkVBQWlEO0lBQ2pELHlHQUE0QztJQUM1QywySUFBOEU7SUFDOUUscUpBQXVGO0lBR3ZGLHVJQUE0SjtJQUU1Sjs7Ozs7T0FLRztJQUNIO1FBQUE7UUFtREEsQ0FBQztRQWxEQywwQ0FBUSxHQUFSLFVBQVMsUUFBZ0IsRUFBRSxRQUFnQjtZQUN6QyxPQUFPLCtCQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsdUNBQUssR0FBTCxVQUFNLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxJQUErQjtZQUV2RSxJQUFJLElBQUksRUFBRTtnQkFDUixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakM7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3pEO1FBQ0gsQ0FBQztRQUVPLCtDQUFhLEdBQXJCLFVBQXNCLEVBQTJDOztnQkFBMUMsb0JBQU8sRUFBRSxrQkFBTTtZQUNwQyxJQUFNLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztZQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsaUNBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVB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IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTm9kZSwgUGFyc2VFcnJvckxldmVsLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5pbXBvcnQge01lc3NhZ2VTZXJpYWxpemVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vbWVzc2FnZV9zZXJpYWxpemVyJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXInO1xuXG5pbXBvcnQge1BhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQsIGFkZFBhcnNlRGlhZ25vc3RpYywgYWRkUGFyc2VFcnJvciwgY2FuUGFyc2VYbWwsIGdldEF0dHJpYnV0ZSwgaXNOYW1lZEVsZW1lbnQsIHBhcnNlSW5uZXJSYW5nZX0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gbG9hZCB0cmFuc2xhdGlvbnMgZnJvbSBYTElGRiAyIGZpbGVzLlxuICpcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3hsaWZmLWNvcmUvdjIuMC9vcy94bGlmZi1jb3JlLXYyLjAtb3MuaHRtbFxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXI8WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50PiB7XG4gIGNhblBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnR8ZmFsc2Uge1xuICAgIHJldHVybiBjYW5QYXJzZVhtbChmaWxlUGF0aCwgY29udGVudHMsICd4bGlmZicsIHt2ZXJzaW9uOiAnMi4wJ30pO1xuICB9XG5cbiAgcGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZywgaGludD86IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludCk6XG4gICAgICBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgaWYgKGhpbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dHJhY3RCdW5kbGUoaGludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dHJhY3RCdW5kbGVEZXByZWNhdGVkKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0QnVuZGxlKHtlbGVtZW50LCBlcnJvcnN9OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgZGlhZ25vc3RpY3MgPSBuZXcgRGlhZ25vc3RpY3MoKTtcbiAgICBlcnJvcnMuZm9yRWFjaChlID0+IGFkZFBhcnNlRXJyb3IoZGlhZ25vc3RpY3MsIGUpKTtcblxuICAgIGNvbnN0IGxvY2FsZSA9IGdldEF0dHJpYnV0ZShlbGVtZW50LCAndHJnTGFuZycpO1xuICAgIGNvbnN0IGZpbGVzID0gZWxlbWVudC5jaGlsZHJlbi5maWx0ZXIoaXNGaWxlRWxlbWVudCk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdObyA8ZmlsZT4gZWxlbWVudHMgZm91bmQgaW4gPHhsaWZmPicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgIH0gZWxzZSBpZiAoZmlsZXMubGVuZ3RoID4gMSkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBmaWxlc1sxXS5zb3VyY2VTcGFuLCAnTW9yZSB0aGFuIG9uZSA8ZmlsZT4gZWxlbWVudCBmb3VuZCBpbiA8eGxpZmY+JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVuZGxlID0ge2xvY2FsZSwgdHJhbnNsYXRpb25zOiB7fSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHRyYW5zbGF0aW9uVmlzaXRvciA9IG5ldyBYbGlmZjJUcmFuc2xhdGlvblZpc2l0b3IoKTtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIHZpc2l0QWxsKHRyYW5zbGF0aW9uVmlzaXRvciwgZmlsZS5jaGlsZHJlbiwge2J1bmRsZX0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKSB7XG4gICAgY29uc3QgaGludCA9IHRoaXMuY2FuUGFyc2UoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICBpZiAoIWhpbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBhcyBYTElGRiAyLjAgZm9ybWF0LmApO1xuICAgIH1cbiAgICBjb25zdCBidW5kbGUgPSB0aGlzLmV4dHJhY3RCdW5kbGUoaGludCk7XG4gICAgaWYgKGJ1bmRsZS5kaWFnbm9zdGljcy5oYXNFcnJvcnMpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcy5mb3JtYXREaWFnbm9zdGljcyhgRmFpbGVkIHRvIHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBhcyBYTElGRiAyLjAgZm9ybWF0YCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBidW5kbGU7XG4gIH1cbn1cblxuXG5pbnRlcmZhY2UgVHJhbnNsYXRpb25WaXNpdG9yQ29udGV4dCB7XG4gIHVuaXQ/OiBzdHJpbmc7XG4gIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGU7XG59XG5cbmNsYXNzIFhsaWZmMlRyYW5zbGF0aW9uVmlzaXRvciBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIHtidW5kbGUsIHVuaXR9OiBUcmFuc2xhdGlvblZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBpZiAoZWxlbWVudC5uYW1lID09PSAndW5pdCcpIHtcbiAgICAgIHRoaXMudmlzaXRVbml0RWxlbWVudChlbGVtZW50LCBidW5kbGUpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09PSAnc2VnbWVudCcpIHtcbiAgICAgIHRoaXMudmlzaXRTZWdtZW50RWxlbWVudChlbGVtZW50LCBidW5kbGUsIHVuaXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuLCB7YnVuZGxlLCB1bml0fSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFVuaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUpOiB2b2lkIHtcbiAgICAvLyBFcnJvciBpZiBubyBgaWRgIGF0dHJpYnV0ZVxuICAgIGNvbnN0IGV4dGVybmFsSWQgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ2lkJyk7XG4gICAgaWYgKGV4dGVybmFsSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLFxuICAgICAgICAgIGBNaXNzaW5nIHJlcXVpcmVkIFwiaWRcIiBhdHRyaWJ1dGUgb24gPHRyYW5zLXVuaXQ+IGVsZW1lbnQuYCwgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFcnJvciBpZiB0aGVyZSBpcyBhbHJlYWR5IGEgdHJhbnNsYXRpb24gd2l0aCB0aGUgc2FtZSBpZFxuICAgIGlmIChidW5kbGUudHJhbnNsYXRpb25zW2V4dGVybmFsSWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2V4dGVybmFsSWR9XCJgLCBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIHtidW5kbGUsIHVuaXQ6IGV4dGVybmFsSWR9KTtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRTZWdtZW50RWxlbWVudChcbiAgICAgIGVsZW1lbnQ6IEVsZW1lbnQsIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIHVuaXQ6IHN0cmluZ3x1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAvLyBBIGA8c2VnbWVudD5gIGVsZW1lbnQgbXVzdCBiZSBiZWxvdyBhIGA8dW5pdD5gIGVsZW1lbnRcbiAgICBpZiAodW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgJ0ludmFsaWQgPHNlZ21lbnQ+IGVsZW1lbnQ6IHNob3VsZCBiZSBhIGNoaWxkIG9mIGEgPHVuaXQ+IGVsZW1lbnQuJyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSBlbGVtZW50LmNoaWxkcmVuLmZpbmQoaXNOYW1lZEVsZW1lbnQoJ3RhcmdldCcpKTtcbiAgICBpZiAodGFyZ2V0TWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdNaXNzaW5nIHJlcXVpcmVkIDx0YXJnZXQ+IGVsZW1lbnQnLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbdW5pdF0gPSBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHRhcmdldE1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIENhcHR1cmUgYW55IGVycm9ycyBmcm9tIHNlcmlhbGl6ZSB0aGUgdGFyZ2V0IG1lc3NhZ2VcbiAgICAgIGlmIChlLnNwYW4gJiYgZS5tc2cgJiYgZS5sZXZlbCkge1xuICAgICAgICBhZGRQYXJzZURpYWdub3N0aWMoYnVuZGxlLmRpYWdub3N0aWNzLCBlLnNwYW4sIGUubXNnLCBlLmxldmVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVRhcmdldE1lc3NhZ2Uoc291cmNlOiBFbGVtZW50KTogybVQYXJzZWRUcmFuc2xhdGlvbiB7XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgTWVzc2FnZVNlcmlhbGl6ZXIobmV3IFRhcmdldE1lc3NhZ2VSZW5kZXJlcigpLCB7XG4gICAgaW5saW5lRWxlbWVudHM6IFsnY3AnLCAnc2MnLCAnZWMnLCAnbXJrJywgJ3NtJywgJ2VtJ10sXG4gICAgcGxhY2Vob2xkZXI6IHtlbGVtZW50TmFtZTogJ3BoJywgbmFtZUF0dHJpYnV0ZTogJ2VxdWl2JywgYm9keUF0dHJpYnV0ZTogJ2Rpc3AnfSxcbiAgICBwbGFjZWhvbGRlckNvbnRhaW5lcjpcbiAgICAgICAge2VsZW1lbnROYW1lOiAncGMnLCBzdGFydEF0dHJpYnV0ZTogJ2VxdWl2U3RhcnQnLCBlbmRBdHRyaWJ1dGU6ICdlcXVpdkVuZCd9XG4gIH0pO1xuICByZXR1cm4gc2VyaWFsaXplci5zZXJpYWxpemUocGFyc2VJbm5lclJhbmdlKHNvdXJjZSkpO1xufVxuXG5mdW5jdGlvbiBpc0ZpbGVFbGVtZW50KG5vZGU6IE5vZGUpOiBub2RlIGlzIEVsZW1lbnQge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5uYW1lID09PSAnZmlsZSc7XG59XG4iXX0=
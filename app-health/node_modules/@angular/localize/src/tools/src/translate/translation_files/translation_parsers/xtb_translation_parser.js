(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "path", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
    var path_1 = require("path");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/base_visitor");
    var message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load XB files.
     */
    var XtbTranslationParser = /** @class */ (function () {
        function XtbTranslationParser() {
        }
        XtbTranslationParser.prototype.canParse = function (filePath, contents) {
            var extension = path_1.extname(filePath);
            if (extension !== '.xtb' && extension !== '.xmb') {
                return false;
            }
            return translation_utils_1.canParseXml(filePath, contents, 'translationbundle', {});
        };
        XtbTranslationParser.prototype.parse = function (filePath, contents, hint) {
            if (hint) {
                return this.extractBundle(hint);
            }
            else {
                return this.extractBundleDeprecated(filePath, contents);
            }
        };
        XtbTranslationParser.prototype.extractBundle = function (_a) {
            var element = _a.element, errors = _a.errors;
            var langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
            var bundle = {
                locale: langAttr && langAttr.value,
                translations: {},
                diagnostics: new diagnostics_1.Diagnostics()
            };
            errors.forEach(function (e) { return translation_utils_1.addParseError(bundle.diagnostics, e); });
            var bundleVisitor = new XtbVisitor();
            compiler_1.visitAll(bundleVisitor, element.children, bundle);
            return bundle;
        };
        XtbTranslationParser.prototype.extractBundleDeprecated = function (filePath, contents) {
            var hint = this.canParse(filePath, contents);
            if (!hint) {
                throw new Error("Unable to parse \"" + filePath + "\" as XMB/XTB format.");
            }
            var bundle = this.extractBundle(hint);
            if (bundle.diagnostics.hasErrors) {
                var message = bundle.diagnostics.formatDiagnostics("Failed to parse \"" + filePath + "\" as XMB/XTB format");
                throw new Error(message);
            }
            return bundle;
        };
        return XtbTranslationParser;
    }());
    exports.XtbTranslationParser = XtbTranslationParser;
    var XtbVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XtbVisitor, _super);
        function XtbVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XtbVisitor.prototype.visitElement = function (element, bundle) {
            switch (element.name) {
                case 'translation':
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
                    try {
                        bundle.translations[id] = serializeTargetMessage(element);
                    }
                    catch (error) {
                        if (typeof error === 'string') {
                            bundle.diagnostics.warn("Could not parse message with id \"" + id + "\" - perhaps it has an unrecognised ICU format?\n" +
                                error);
                        }
                        else if (error.span && error.msg && error.level) {
                            translation_utils_1.addParseDiagnostic(bundle.diagnostics, error.span, error.msg, error.level);
                        }
                        else {
                            throw error;
                        }
                    }
                    break;
                default:
                    translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Unexpected <" + element.name + "> tag.", compiler_1.ParseErrorLevel.ERROR);
            }
        };
        return XtbVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), { inlineElements: [], placeholder: { elementName: 'ph', nameAttribute: 'name' } });
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveHRiX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBcUU7SUFFckUsNkJBQTZCO0lBRTdCLDJFQUFpRDtJQUNqRCx5R0FBNEM7SUFDNUMsMklBQThFO0lBQzlFLHFKQUF1RjtJQUd2Rix1SUFBNEk7SUFHNUk7O09BRUc7SUFDSDtRQUFBO1FBNkNBLENBQUM7UUE1Q0MsdUNBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsUUFBZ0I7WUFDekMsSUFBTSxTQUFTLEdBQUcsY0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksU0FBUyxLQUFLLE1BQU0sSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO2dCQUNoRCxPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsT0FBTywrQkFBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUVELG9DQUFLLEdBQUwsVUFBTSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBK0I7WUFFdkUsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6RDtRQUNILENBQUM7UUFFTyw0Q0FBYSxHQUFyQixVQUFzQixFQUEyQztnQkFBMUMsb0JBQU8sRUFBRSxrQkFBTTtZQUNwQyxJQUFNLFFB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Q0FBQyxLQUFLLEVBQUU7NEJBQ2pELHNDQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFDNUU7NkJBQU07NEJBQ0wsTUFBTSxLQUFLLENBQUM7eUJBQ2I7cUJBQ0Y7b0JBQ0QsTUFBTTtnQkFFUjtvQkFDRSxzQ0FBa0IsQ0FDZCxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsaUJBQWUsT0FBTyxDQUFDLElBQUksV0FBUSxFQUMzRSwwQkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQztRQUNILGlCQUFDO0lBQUQsQ0FBQyxBQTFDRCxDQUF5QiwwQkFBVyxHQTBDbkM7SUFFRCxTQUFTLHNCQUFzQixDQUFDLE1BQWU7UUFDN0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxzQ0FBaUIsQ0FDcEMsSUFBSSwrQ0FBcUIsRUFBRSxFQUMzQixFQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ25GLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxtQ0FBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgUGFyc2VFcnJvckxldmVsLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0Jhc2VWaXNpdG9yfSBmcm9tICcuLi9iYXNlX3Zpc2l0b3InO1xuaW1wb3J0IHtNZXNzYWdlU2VyaWFsaXplcn0gZnJvbSAnLi4vbWVzc2FnZV9zZXJpYWxpemF0aW9uL21lc3NhZ2Vfc2VyaWFsaXplcic7XG5pbXBvcnQge1RhcmdldE1lc3NhZ2VSZW5kZXJlcn0gZnJvbSAnLi4vbWVzc2FnZV9zZXJpYWxpemF0aW9uL3RhcmdldF9tZXNzYWdlX3JlbmRlcmVyJztcblxuaW1wb3J0IHtQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50LCBhZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIHBhcnNlSW5uZXJSYW5nZX0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBsb2FkIFhCIGZpbGVzLlxuICovXG5leHBvcnQgY2xhc3MgWHRiVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludHxmYWxzZSB7XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gZXh0bmFtZShmaWxlUGF0aCk7XG4gICAgaWYgKGV4dGVuc2lvbiAhPT0gJy54dGInICYmIGV4dGVuc2lvbiAhPT0gJy54bWInKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjYW5QYXJzZVhtbChmaWxlUGF0aCwgY29udGVudHMsICd0cmFuc2xhdGlvbmJ1bmRsZScsIHt9KTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGhpbnQ/OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOlxuICAgICAgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGlmIChoaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZSh7ZWxlbWVudCwgZXJyb3JzfTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IGxhbmdBdHRyID0gZWxlbWVudC5hdHRycy5maW5kKChhdHRyKSA9PiBhdHRyLm5hbWUgPT09ICdsYW5nJyk7XG4gICAgY29uc3QgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSA9IHtcbiAgICAgIGxvY2FsZTogbGFuZ0F0dHIgJiYgbGFuZ0F0dHIudmFsdWUsXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgICAgZGlhZ25vc3RpY3M6IG5ldyBEaWFnbm9zdGljcygpXG4gICAgfTtcbiAgICBlcnJvcnMuZm9yRWFjaChlID0+IGFkZFBhcnNlRXJyb3IoYnVuZGxlLmRpYWdub3N0aWNzLCBlKSk7XG5cbiAgICBjb25zdCBidW5kbGVWaXNpdG9yID0gbmV3IFh0YlZpc2l0b3IoKTtcbiAgICB2aXNpdEFsbChidW5kbGVWaXNpdG9yLCBlbGVtZW50LmNoaWxkcmVuLCBidW5kbGUpO1xuICAgIHJldHVybiBidW5kbGU7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RCdW5kbGVEZXByZWNhdGVkKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoaW50ID0gdGhpcy5jYW5QYXJzZShmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIGlmICghaGludCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcGFyc2UgXCIke2ZpbGVQYXRofVwiIGFzIFhNQi9YVEIgZm9ybWF0LmApO1xuICAgIH1cbiAgICBjb25zdCBidW5kbGUgPSB0aGlzLmV4dHJhY3RCdW5kbGUoaGludCk7XG4gICAgaWYgKGJ1bmRsZS5kaWFnbm9zdGljcy5oYXNFcnJvcnMpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcy5mb3JtYXREaWFnbm9zdGljcyhgRmFpbGVkIHRvIHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBhcyBYTUIvWFRCIGZvcm1hdGApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG5cbmNsYXNzIFh0YlZpc2l0b3IgZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlKTogYW55IHtcbiAgICBzd2l0Y2ggKGVsZW1lbnQubmFtZSkge1xuICAgICAgY2FzZSAndHJhbnNsYXRpb24nOlxuICAgICAgICAvLyBFcnJvciBpZiBubyBgaWRgIGF0dHJpYnV0ZVxuICAgICAgICBjb25zdCBpZCA9IGdldEF0dHJpYnV0ZShlbGVtZW50LCAnaWQnKTtcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICBgTWlzc2luZyByZXF1aXJlZCBcImlkXCIgYXR0cmlidXRlIG9uIDx0cmFucy11bml0PiBlbGVtZW50LmAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXJyb3IgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRyYW5zbGF0aW9uIHdpdGggdGhlIHNhbWUgaWRcbiAgICAgICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbaWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2lkfVwiYCxcbiAgICAgICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbaWRdID0gc2VyaWFsaXplVGFyZ2V0TWVzc2FnZShlbGVtZW50KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLndhcm4oXG4gICAgICAgICAgICAgICAgYENvdWxkIG5vdCBwYXJzZSBtZXNzYWdlIHdpdGggaWQgXCIke2lkfVwiIC0gcGVyaGFwcyBpdCBoYXMgYW4gdW5yZWNvZ25pc2VkIElDVSBmb3JtYXQ/XFxuYCArXG4gICAgICAgICAgICAgICAgZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3BhbiAmJiBlcnJvci5tc2cgJiYgZXJyb3IubGV2ZWwpIHtcbiAgICAgICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhidW5kbGUuZGlhZ25vc3RpY3MsIGVycm9yLnNwYW4sIGVycm9yLm1zZywgZXJyb3IubGV2ZWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgVW5leHBlY3RlZCA8JHtlbGVtZW50Lm5hbWV9PiB0YWcuYCxcbiAgICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVRhcmdldE1lc3NhZ2Uoc291cmNlOiBFbGVtZW50KTogybVQYXJzZWRUcmFuc2xhdGlvbiB7XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgTWVzc2FnZVNlcmlhbGl6ZXIoXG4gICAgICBuZXcgVGFyZ2V0TWVzc2FnZVJlbmRlcmVyKCksXG4gICAgICB7aW5saW5lRWxlbWVudHM6IFtdLCBwbGFjZWhvbGRlcjoge2VsZW1lbnROYW1lOiAncGgnLCBuYW1lQXR0cmlidXRlOiAnbmFtZSd9fSk7XG4gIHJldHVybiBzZXJpYWxpemVyLnNlcmlhbGl6ZShwYXJzZUlubmVyUmFuZ2Uoc291cmNlKSk7XG59XG4iXX0=
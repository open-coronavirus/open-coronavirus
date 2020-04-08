(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/base_visitor");
    var translation_parse_error_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * This visitor will walk over a set of XML nodes, which represent an i18n message, and serialize
     * them into a message object of type `T`.
     * The type of the serialized message is controlled by the
     */
    var MessageSerializer = /** @class */ (function (_super) {
        tslib_1.__extends(MessageSerializer, _super);
        function MessageSerializer(renderer, config) {
            var _this = _super.call(this) || this;
            _this.renderer = renderer;
            _this.config = config;
            return _this;
        }
        MessageSerializer.prototype.serialize = function (nodes) {
            this.renderer.startRender();
            compiler_1.visitAll(this, nodes);
            this.renderer.endRender();
            return this.renderer.message;
        };
        MessageSerializer.prototype.visitElement = function (element) {
            if (this.config.placeholder && element.name === this.config.placeholder.elementName) {
                var name = translation_utils_1.getAttrOrThrow(element, this.config.placeholder.nameAttribute);
                var body = this.config.placeholder.bodyAttribute &&
                    translation_utils_1.getAttribute(element, this.config.placeholder.bodyAttribute);
                this.visitPlaceholder(name, body);
            }
            else if (this.config.placeholderContainer &&
                element.name === this.config.placeholderContainer.elementName) {
                var start = translation_utils_1.getAttrOrThrow(element, this.config.placeholderContainer.startAttribute);
                var end = translation_utils_1.getAttrOrThrow(element, this.config.placeholderContainer.endAttribute);
                this.visitPlaceholderContainer(start, element.children, end);
            }
            else if (this.config.inlineElements.indexOf(element.name) !== -1) {
                compiler_1.visitAll(this, element.children);
            }
            else {
                throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Invalid element found in message.");
            }
        };
        MessageSerializer.prototype.visitText = function (text) { this.renderer.text(text.value); };
        MessageSerializer.prototype.visitExpansion = function (expansion) {
            this.renderer.startIcu();
            this.renderer.text(expansion.switchValue + ", " + expansion.type + ",");
            compiler_1.visitAll(this, expansion.cases);
            this.renderer.endIcu();
        };
        MessageSerializer.prototype.visitExpansionCase = function (expansionCase) {
            this.renderer.text(" " + expansionCase.value + " {");
            this.renderer.startContainer();
            compiler_1.visitAll(this, expansionCase.expression);
            this.renderer.closeContainer();
            this.renderer.text("}");
        };
        MessageSerializer.prototype.visitContainedNodes = function (nodes) {
            var length = nodes.length;
            var index = 0;
            while (index < length) {
                if (!this.isPlaceholderContainer(nodes[index])) {
                    var startOfContainedNodes = index;
                    while (index < length - 1) {
                        index++;
                        if (this.isPlaceholderContainer(nodes[index])) {
                            break;
                        }
                    }
                    if (index - startOfContainedNodes > 1) {
                        // Only create a container if there are two or more contained Nodes in a row
                        this.renderer.startContainer();
                        compiler_1.visitAll(this, nodes.slice(startOfContainedNodes, index - 1));
                        this.renderer.closeContainer();
                    }
                }
                if (index < length) {
                    nodes[index].visit(this, undefined);
                }
                index++;
            }
        };
        MessageSerializer.prototype.visitPlaceholder = function (name, body) {
            this.renderer.placeholder(name, body);
        };
        MessageSerializer.prototype.visitPlaceholderContainer = function (startName, children, closeName) {
            this.renderer.startPlaceholder(startName);
            this.visitContainedNodes(children);
            this.renderer.closePlaceholder(closeName);
        };
        MessageSerializer.prototype.isPlaceholderContainer = function (node) {
            return node instanceof compiler_1.Element && node.name === this.config.placeholderContainer.elementName;
        };
        return MessageSerializer;
    }(base_visitor_1.BaseVisitor));
    exports.MessageSerializer = MessageSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvbWVzc2FnZV9zZXJpYWxpemF0aW9uL21lc3NhZ2Vfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBMEY7SUFFMUYseUdBQTRDO0lBQzVDLG1KQUFxRjtJQUNyRix1SUFBc0Y7SUFVdEY7Ozs7T0FJRztJQUNIO1FBQTBDLDZDQUFXO1FBQ25ELDJCQUFvQixRQUE0QixFQUFVLE1BQStCO1lBQXpGLFlBQ0UsaUJBQU8sU0FDUjtZQUZtQixjQUFRLEdBQVIsUUFBUSxDQUFvQjtZQUFVLFlBQU0sR0FBTixNQUFNLENBQXlCOztRQUV6RixDQUFDO1FBRUQscUNBQVMsR0FBVCxVQUFVLEtBQWE7WUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM1QixtQkFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDL0IsQ0FBQztRQUVELHdDQUFZLEdBQVosVUFBYSxPQUFnQjtZQUMzQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFO2dCQUNuRixJQUFNLElBQUksR0FBRyxrQ0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDNUUsSUFBTSxJQUFJLEdBQUcs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dkZZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgRXhwYW5zaW9uLCBFeHBhbnNpb25DYXNlLCBOb2RlLCBUZXh0LCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG5pbXBvcnQge0Jhc2VWaXNpdG9yfSBmcm9tICcuLi9iYXNlX3Zpc2l0b3InO1xuaW1wb3J0IHtUcmFuc2xhdGlvblBhcnNlRXJyb3J9IGZyb20gJy4uL3RyYW5zbGF0aW9uX3BhcnNlcnMvdHJhbnNsYXRpb25fcGFyc2VfZXJyb3InO1xuaW1wb3J0IHtnZXRBdHRyT3JUaHJvdywgZ2V0QXR0cmlidXRlfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3V0aWxzJztcblxuaW1wb3J0IHtNZXNzYWdlUmVuZGVyZXJ9IGZyb20gJy4vbWVzc2FnZV9yZW5kZXJlcic7XG5cbmludGVyZmFjZSBNZXNzYWdlU2VyaWFsaXplckNvbmZpZyB7XG4gIGlubGluZUVsZW1lbnRzOiBzdHJpbmdbXTtcbiAgcGxhY2Vob2xkZXI/OiB7ZWxlbWVudE5hbWU6IHN0cmluZzsgbmFtZUF0dHJpYnV0ZTogc3RyaW5nOyBib2R5QXR0cmlidXRlPzogc3RyaW5nO307XG4gIHBsYWNlaG9sZGVyQ29udGFpbmVyPzoge2VsZW1lbnROYW1lOiBzdHJpbmc7IHN0YXJ0QXR0cmlidXRlOiBzdHJpbmc7IGVuZEF0dHJpYnV0ZTogc3RyaW5nO307XG59XG5cbi8qKlxuICogVGhpcyB2aXNpdG9yIHdpbGwgd2FsayBvdmVyIGEgc2V0IG9mIFhNTCBub2Rlcywgd2hpY2ggcmVwcmVzZW50IGFuIGkxOG4gbWVzc2FnZSwgYW5kIHNlcmlhbGl6ZVxuICogdGhlbSBpbnRvIGEgbWVzc2FnZSBvYmplY3Qgb2YgdHlwZSBgVGAuXG4gKiBUaGUgdHlwZSBvZiB0aGUgc2VyaWFsaXplZCBtZXNzYWdlIGlzIGNvbnRyb2xsZWQgYnkgdGhlXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlU2VyaWFsaXplcjxUPiBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogTWVzc2FnZVJlbmRlcmVyPFQ+LCBwcml2YXRlIGNvbmZpZzogTWVzc2FnZVNlcmlhbGl6ZXJDb25maWcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc2VyaWFsaXplKG5vZGVzOiBOb2RlW10pOiBUIHtcbiAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0UmVuZGVyKCk7XG4gICAgdmlzaXRBbGwodGhpcywgbm9kZXMpO1xuICAgIHRoaXMucmVuZGVyZXIuZW5kUmVuZGVyKCk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubWVzc2FnZTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyICYmIGVsZW1lbnQubmFtZSA9PT0gdGhpcy5jb25maWcucGxhY2Vob2xkZXIuZWxlbWVudE5hbWUpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBnZXRBdHRyT3JUaHJvdyhlbGVtZW50LCB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlci5uYW1lQXR0cmlidXRlKTtcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlci5ib2R5QXR0cmlidXRlICYmXG4gICAgICAgICAgZ2V0QXR0cmlidXRlKGVsZW1lbnQsIHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyLmJvZHlBdHRyaWJ1dGUpO1xuICAgICAgdGhpcy52aXNpdFBsYWNlaG9sZGVyKG5hbWUsIGJvZHkpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyQ29udGFpbmVyICYmXG4gICAgICAgIGVsZW1lbnQubmFtZSA9PT0gdGhpcy5jb25maWcucGxhY2Vob2xkZXJDb250YWluZXIuZWxlbWVudE5hbWUpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgdGhpcy5jb25maWcucGxhY2Vob2xkZXJDb250YWluZXIuc3RhcnRBdHRyaWJ1dGUpO1xuICAgICAgY29uc3QgZW5kID0gZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgdGhpcy5jb25maWcucGxhY2Vob2xkZXJDb250YWluZXIuZW5kQXR0cmlidXRlKTtcbiAgICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlckNvbnRhaW5lcihzdGFydCwgZWxlbWVudC5jaGlsZHJlbiwgZW5kKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLmlubGluZUVsZW1lbnRzLmluZGV4T2YoZWxlbWVudC5uYW1lKSAhPT0gLTEpIHtcbiAgICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKGVsZW1lbnQuc291cmNlU3BhbiwgYEludmFsaWQgZWxlbWVudCBmb3VuZCBpbiBtZXNzYWdlLmApO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0KTogdm9pZCB7IHRoaXMucmVuZGVyZXIudGV4dCh0ZXh0LnZhbHVlKTsgfVxuXG4gIHZpc2l0RXhwYW5zaW9uKGV4cGFuc2lvbjogRXhwYW5zaW9uKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zdGFydEljdSgpO1xuICAgIHRoaXMucmVuZGVyZXIudGV4dChgJHtleHBhbnNpb24uc3dpdGNoVmFsdWV9LCAke2V4cGFuc2lvbi50eXBlfSxgKTtcbiAgICB2aXNpdEFsbCh0aGlzLCBleHBhbnNpb24uY2FzZXMpO1xuICAgIHRoaXMucmVuZGVyZXIuZW5kSWN1KCk7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogRXhwYW5zaW9uQ2FzZSk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIudGV4dChgICR7ZXhwYW5zaW9uQ2FzZS52YWx1ZX0ge2ApO1xuICAgIHRoaXMucmVuZGVyZXIuc3RhcnRDb250YWluZXIoKTtcbiAgICB2aXNpdEFsbCh0aGlzLCBleHBhbnNpb25DYXNlLmV4cHJlc3Npb24pO1xuICAgIHRoaXMucmVuZGVyZXIuY2xvc2VDb250YWluZXIoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnRleHQoYH1gKTtcbiAgfVxuXG4gIHZpc2l0Q29udGFpbmVkTm9kZXMobm9kZXM6IE5vZGVbXSk6IHZvaWQge1xuICAgIGNvbnN0IGxlbmd0aCA9IG5vZGVzLmxlbmd0aDtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKCF0aGlzLmlzUGxhY2Vob2xkZXJDb250YWluZXIobm9kZXNbaW5kZXhdKSkge1xuICAgICAgICBjb25zdCBzdGFydE9mQ29udGFpbmVkTm9kZXMgPSBpbmRleDtcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgaWYgKHRoaXMuaXNQbGFjZWhvbGRlckNvbnRhaW5lcihub2Rlc1tpbmRleF0pKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4IC0gc3RhcnRPZkNvbnRhaW5lZE5vZGVzID4gMSkge1xuICAgICAgICAgIC8vIE9ubHkgY3JlYXRlIGEgY29udGFpbmVyIGlmIHRoZXJlIGFyZSB0d28gb3IgbW9yZSBjb250YWluZWQgTm9kZXMgaW4gYSByb3dcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0Q29udGFpbmVyKCk7XG4gICAgICAgICAgdmlzaXRBbGwodGhpcywgbm9kZXMuc2xpY2Uoc3RhcnRPZkNvbnRhaW5lZE5vZGVzLCBpbmRleCAtIDEpKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmNsb3NlQ29udGFpbmVyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBub2Rlc1tpbmRleF0udmlzaXQodGhpcywgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcsIGJvZHk6IHN0cmluZ3x1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnBsYWNlaG9sZGVyKG5hbWUsIGJvZHkpO1xuICB9XG5cbiAgdmlzaXRQbGFjZWhvbGRlckNvbnRhaW5lcihzdGFydE5hbWU6IHN0cmluZywgY2hpbGRyZW46IE5vZGVbXSwgY2xvc2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0UGxhY2Vob2xkZXIoc3RhcnROYW1lKTtcbiAgICB0aGlzLnZpc2l0Q29udGFpbmVkTm9kZXMoY2hpbGRyZW4pO1xuICAgIHRoaXMucmVuZGVyZXIuY2xvc2VQbGFjZWhvbGRlcihjbG9zZU5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1BsYWNlaG9sZGVyQ29udGFpbmVyKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5uYW1lID09PSB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlckNvbnRhaW5lciAhLmVsZW1lbnROYW1lO1xuICB9XG59XG4iXX0=
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", ["require", "exports", "@angular/localize"], factory);
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
    /**
     * A message renderer that outputs `ɵParsedTranslation` objects.
     */
    var TargetMessageRenderer = /** @class */ (function () {
        function TargetMessageRenderer() {
            this.current = { messageParts: [], placeholderNames: [], text: '' };
            this.icuDepth = 0;
        }
        Object.defineProperty(TargetMessageRenderer.prototype, "message", {
            get: function () {
                var _a = this.current, messageParts = _a.messageParts, placeholderNames = _a.placeholderNames;
                return localize_1.ɵmakeParsedTranslation(messageParts, placeholderNames);
            },
            enumerable: true,
            configurable: true
        });
        TargetMessageRenderer.prototype.startRender = function () { };
        TargetMessageRenderer.prototype.endRender = function () { this.storeMessagePart(); };
        TargetMessageRenderer.prototype.text = function (text) { this.current.text += text; };
        TargetMessageRenderer.prototype.placeholder = function (name, body) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.startPlaceholder = function (name) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.closePlaceholder = function (name) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.startContainer = function () { };
        TargetMessageRenderer.prototype.closeContainer = function () { };
        TargetMessageRenderer.prototype.startIcu = function () {
            this.icuDepth++;
            this.text('{');
        };
        TargetMessageRenderer.prototype.endIcu = function () {
            this.icuDepth--;
            this.text('}');
        };
        TargetMessageRenderer.prototype.normalizePlaceholderName = function (name) { return name.replace(/-/g, '_'); };
        TargetMessageRenderer.prototype.renderPlaceholder = function (name) {
            name = this.normalizePlaceholderName(name);
            if (this.icuDepth > 0) {
                this.text("{" + name + "}");
            }
            else {
                this.storeMessagePart();
                this.current.placeholderNames.push(name);
            }
        };
        TargetMessageRenderer.prototype.storeMessagePart = function () {
            this.current.messageParts.push(this.current.text);
            this.current.text = '';
        };
        return TargetMessageRenderer;
    }());
    exports.TargetMessageRenderer = TargetMessageRenderer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBNkU7SUFHN0U7O09BRUc7SUFDSDtRQUFBO1lBQ1UsWUFBTyxHQUFnQixFQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQztZQUMxRSxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBb0N2QixDQUFDO1FBbENDLHNCQUFJLDBDQUFPO2lCQUFYO2dCQUNRLElBQUEsaUJBQStDLEVBQTlDLDhCQUFZLEVBQUUsc0NBQWdDLENBQUM7Z0JBQ3RELE9BQU8saUNBQXNCLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDaEUsQ0FBQzs7O1dBQUE7UUFDRCwyQ0FBVyxHQUFYLGNBQXFCLENBQUM7UUFDdEIseUNBQVMsR0FBVCxjQUFvQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUMsb0NBQUksR0FBSixVQUFLLElBQVksSUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELDJDQUFXLEdBQVgsVUFBWSxJQUFZLEVBQUUsSUFBc0IsSUFBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLGdEQUFnQixHQUFoQixVQUFpQixJQUFZLElBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxnREFBZ0IsR0FBaEIsVUFBaUIsSUFBWSxJQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsOENBQWMsR0FBZCxjQUF3QixDQUFDO1FBQ3pCLDhDQUFjLEdBQWQsY0FBd0IsQ0FBQztRQUN6Qix3Q0FBUSxHQUFSO1lBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUNELHNDQUFNLEdBQU47WUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBQ08sd0RBQXdCLEdBQWhDLFVBQWlDLElBQVksSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxpREFBaUIsR0FBekIsVUFBMEIsSUFBWTtZQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBSSxJQUFJLE1BQUcsQ0FBQyxDQUFDO2FBQ3hCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUM7UUFDTyxnREFBZ0IsR0FBeEI7WUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDekIsQ0FBQztRQUNILDRCQUFDO0lBQUQsQ0FBQyxBQXRDRCxJQXNDQztJQXRDWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb24sIMm1bWFrZVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge01lc3NhZ2VSZW5kZXJlcn0gZnJvbSAnLi9tZXNzYWdlX3JlbmRlcmVyJztcblxuLyoqXG4gKiBBIG1lc3NhZ2UgcmVuZGVyZXIgdGhhdCBvdXRwdXRzIGDJtVBhcnNlZFRyYW5zbGF0aW9uYCBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgVGFyZ2V0TWVzc2FnZVJlbmRlcmVyIGltcGxlbWVudHMgTWVzc2FnZVJlbmRlcmVyPMm1UGFyc2VkVHJhbnNsYXRpb24+IHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBNZXNzYWdlSW5mbyA9IHttZXNzYWdlUGFydHM6IFtdLCBwbGFjZWhvbGRlck5hbWVzOiBbXSwgdGV4dDogJyd9O1xuICBwcml2YXRlIGljdURlcHRoID0gMDtcblxuICBnZXQgbWVzc2FnZSgpOiDJtVBhcnNlZFRyYW5zbGF0aW9uIHtcbiAgICBjb25zdCB7bWVzc2FnZVBhcnRzLCBwbGFjZWhvbGRlck5hbWVzfSA9IHRoaXMuY3VycmVudDtcbiAgICByZXR1cm4gybVtYWtlUGFyc2VkVHJhbnNsYXRpb24obWVzc2FnZVBhcnRzLCBwbGFjZWhvbGRlck5hbWVzKTtcbiAgfVxuICBzdGFydFJlbmRlcigpOiB2b2lkIHt9XG4gIGVuZFJlbmRlcigpOiB2b2lkIHsgdGhpcy5zdG9yZU1lc3NhZ2VQYXJ0KCk7IH1cbiAgdGV4dCh0ZXh0OiBzdHJpbmcpOiB2b2lkIHsgdGhpcy5jdXJyZW50LnRleHQgKz0gdGV4dDsgfVxuICBwbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcsIGJvZHk6IHN0cmluZ3x1bmRlZmluZWQpOiB2b2lkIHsgdGhpcy5yZW5kZXJQbGFjZWhvbGRlcihuYW1lKTsgfVxuICBzdGFydFBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZyk6IHZvaWQgeyB0aGlzLnJlbmRlclBsYWNlaG9sZGVyKG5hbWUpOyB9XG4gIGNsb3NlUGxhY2Vob2xkZXIobmFtZTogc3RyaW5nKTogdm9pZCB7IHRoaXMucmVuZGVyUGxhY2Vob2xkZXIobmFtZSk7IH1cbiAgc3RhcnRDb250YWluZXIoKTogdm9pZCB7fVxuICBjbG9zZUNvbnRhaW5lcigpOiB2b2lkIHt9XG4gIHN0YXJ0SWN1KCk6IHZvaWQge1xuICAgIHRoaXMuaWN1RGVwdGgrKztcbiAgICB0aGlzLnRleHQoJ3snKTtcbiAgfVxuICBlbmRJY3UoKTogdm9pZCB7XG4gICAgdGhpcy5pY3VEZXB0aC0tO1xuICAgIHRoaXMudGV4dCgnfScpO1xuICB9XG4gIHByaXZhdGUgbm9ybWFsaXplUGxhY2Vob2xkZXJOYW1lKG5hbWU6IHN0cmluZykgeyByZXR1cm4gbmFtZS5yZXBsYWNlKC8tL2csICdfJyk7IH1cbiAgcHJpdmF0ZSByZW5kZXJQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gdGhpcy5ub3JtYWxpemVQbGFjZWhvbGRlck5hbWUobmFtZSk7XG4gICAgaWYgKHRoaXMuaWN1RGVwdGggPiAwKSB7XG4gICAgICB0aGlzLnRleHQoYHske25hbWV9fWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlTWVzc2FnZVBhcnQoKTtcbiAgICAgIHRoaXMuY3VycmVudC5wbGFjZWhvbGRlck5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgc3RvcmVNZXNzYWdlUGFydCgpIHtcbiAgICB0aGlzLmN1cnJlbnQubWVzc2FnZVBhcnRzLnB1c2godGhpcy5jdXJyZW50LnRleHQpO1xuICAgIHRoaXMuY3VycmVudC50ZXh0ID0gJyc7XG4gIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VJbmZvIHtcbiAgbWVzc2FnZVBhcnRzOiBzdHJpbmdbXTtcbiAgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW107XG4gIHRleHQ6IHN0cmluZztcbn0iXX0=
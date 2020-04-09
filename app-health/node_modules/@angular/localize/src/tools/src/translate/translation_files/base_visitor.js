(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/base_visitor", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A simple base class for the  `Visitor` interface, which is a noop for every method.
     *
     * Sub-classes only need to override the methods that they care about.
     */
    var BaseVisitor = /** @class */ (function () {
        function BaseVisitor() {
        }
        BaseVisitor.prototype.visitElement = function (_element, _context) { };
        BaseVisitor.prototype.visitAttribute = function (_attribute, _context) { };
        BaseVisitor.prototype.visitText = function (_text, _context) { };
        BaseVisitor.prototype.visitComment = function (_comment, _context) { };
        BaseVisitor.prototype.visitExpansion = function (_expansion, _context) { };
        BaseVisitor.prototype.visitExpansionCase = function (_expansionCase, _context) { };
        return BaseVisitor;
    }());
    exports.BaseVisitor = BaseVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV92aXNpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvYmFzZV92aXNpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBU0E7Ozs7T0FJRztJQUNIO1FBQUE7UUFPQSxDQUFDO1FBTkMsa0NBQVksR0FBWixVQUFhLFFBQWlCLEVBQUUsUUFBYSxJQUFRLENBQUM7UUFDdEQsb0NBQWMsR0FBZCxVQUFlLFVBQXFCLEVBQUUsUUFBYSxJQUFRLENBQUM7UUFDNUQsK0JBQVMsR0FBVCxVQUFVLEtBQVcsRUFBRSxRQUFhLElBQVEsQ0FBQztRQUM3QyxrQ0FBWSxHQUFaLFVBQWEsUUFBaUIsRUFBRSxRQUFhLElBQVEsQ0FBQztRQUN0RCxvQ0FBYyxHQUFkLFVBQWUsVUFBcUIsRUFBRSxRQUFhLElBQVEsQ0FBQztRQUM1RCx3Q0FBa0IsR0FBbEIsVUFBbUIsY0FBNkIsRUFBRSxRQUFhLElBQVEsQ0FBQztRQUMxRSxrQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBUFksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0F0dHJpYnV0ZSwgQ29tbWVudCwgRWxlbWVudCwgRXhwYW5zaW9uLCBFeHBhbnNpb25DYXNlLCBUZXh0LCBWaXNpdG9yfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbi8qKlxuICogQSBzaW1wbGUgYmFzZSBjbGFzcyBmb3IgdGhlICBgVmlzaXRvcmAgaW50ZXJmYWNlLCB3aGljaCBpcyBhIG5vb3AgZm9yIGV2ZXJ5IG1ldGhvZC5cbiAqXG4gKiBTdWItY2xhc3NlcyBvbmx5IG5lZWQgdG8gb3ZlcnJpZGUgdGhlIG1ldGhvZHMgdGhhdCB0aGV5IGNhcmUgYWJvdXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlVmlzaXRvciBpbXBsZW1lbnRzIFZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoX2VsZW1lbnQ6IEVsZW1lbnQsIF9jb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRBdHRyaWJ1dGUoX2F0dHJpYnV0ZTogQXR0cmlidXRlLCBfY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0VGV4dChfdGV4dDogVGV4dCwgX2NvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdENvbW1lbnQoX2NvbW1lbnQ6IENvbW1lbnQsIF9jb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRFeHBhbnNpb24oX2V4cGFuc2lvbjogRXhwYW5zaW9uLCBfY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShfZXhwYW5zaW9uQ2FzZTogRXhwYW5zaW9uQ2FzZSwgX2NvbnRleHQ6IGFueSk6IGFueSB7fVxufVxuIl19
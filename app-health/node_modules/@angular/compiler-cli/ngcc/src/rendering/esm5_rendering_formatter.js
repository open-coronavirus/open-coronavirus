(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/ngcc/src/host/esm5_host", "@angular/compiler-cli/ngcc/src/rendering/esm_rendering_formatter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var esm5_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm5_host");
    var esm_rendering_formatter_1 = require("@angular/compiler-cli/ngcc/src/rendering/esm_rendering_formatter");
    /**
     * A RenderingFormatter that works with files that use ECMAScript Module `import` and `export`
     * statements, but instead of `class` declarations it uses ES5 `function` wrappers for classes.
     */
    var Esm5RenderingFormatter = /** @class */ (function (_super) {
        tslib_1.__extends(Esm5RenderingFormatter, _super);
        function Esm5RenderingFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Add the definitions inside the IIFE of each decorated class
         */
        Esm5RenderingFormatter.prototype.addDefinitions = function (output, compiledClass, definitions) {
            var iifeBody = esm5_host_1.getIifeBody(compiledClass.declaration);
            if (!iifeBody) {
                throw new Error("Compiled class declaration is not inside an IIFE: " + compiledClass.name + " in " + compiledClass.declaration.getSourceFile().fileName);
            }
            var returnStatement = iifeBody.statements.find(ts.isReturnStatement);
            if (!returnStatement) {
                throw new Error("Compiled class wrapper IIFE does not have a return statement: " + compiledClass.name + " in " + compiledClass.declaration.getSourceFile().fileName);
            }
            var insertionPoint = returnStatement.getFullStart();
            output.appendLeft(insertionPoint, '\n' + definitions);
        };
        return Esm5RenderingFormatter;
    }(esm_rendering_formatter_1.EsmRenderingFormatter));
    exports.Esm5RenderingFormatter = Esm5RenderingFormatter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtNV9yZW5kZXJpbmdfZm9ybWF0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3JlbmRlcmluZy9lc201X3JlbmRlcmluZ19mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEsK0JBQWlDO0lBRWpDLDJFQUE4QztJQUM5Qyw0R0FBZ0U7SUFFaEU7OztPQUdHO0lBQ0g7UUFBNEMsa0RBQXFCO1FBQWpFOztRQW9CQSxDQUFDO1FBbkJDOztXQUVHO1FBQ0gsK0NBQWMsR0FBZCxVQUFlLE1BQW1CLEVBQUUsYUFBNEIsRUFBRSxXQUFtQjtZQUNuRixJQUFNLFFBQVEsR0FBRyx1QkFBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQ1gsdURBQXFELGFBQWEsQ0FBQyxJQUFJLFlBQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUN6STtZQUVELElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbUVBQWlFLGFBQWEsQ0FBQyxJQUFJLFlBQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUNySjtZQUVELElBQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0RCxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNILDZCQUFDO0lBQUQsQ0FBQyxBQXBCRCxDQUE0QywrQ0FBcUIsR0FvQmhFO0lBcEJZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0NvbXBpbGVkQ2xhc3N9IGZyb20gJy4uL2FuYWx5c2lzL3R5cGVzJztcbmltcG9ydCB7Z2V0SWlmZUJvZHl9IGZyb20gJy4uL2hvc3QvZXNtNV9ob3N0JztcbmltcG9ydCB7RXNtUmVuZGVyaW5nRm9ybWF0dGVyfSBmcm9tICcuL2VzbV9yZW5kZXJpbmdfZm9ybWF0dGVyJztcblxuLyoqXG4gKiBBIFJlbmRlcmluZ0Zvcm1hdHRlciB0aGF0IHdvcmtzIHdpdGggZmlsZXMgdGhhdCB1c2UgRUNNQVNjcmlwdCBNb2R1bGUgYGltcG9ydGAgYW5kIGBleHBvcnRgXG4gKiBzdGF0ZW1lbnRzLCBidXQgaW5zdGVhZCBvZiBgY2xhc3NgIGRlY2xhcmF0aW9ucyBpdCB1c2VzIEVTNSBgZnVuY3Rpb25gIHdyYXBwZXJzIGZvciBjbGFzc2VzLlxuICovXG5leHBvcnQgY2xhc3MgRXNtNVJlbmRlcmluZ0Zvcm1hdHRlciBleHRlbmRzIEVzbVJlbmRlcmluZ0Zvcm1hdHRlciB7XG4gIC8qKlxuICAgKiBBZGQgdGhlIGRlZmluaXRpb25zIGluc2lkZSB0aGUgSUlGRSBvZiBlYWNoIGRlY29yYXRlZCBjbGFzc1xuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMob3V0cHV0OiBNYWdpY1N0cmluZywgY29tcGlsZWRDbGFzczogQ29tcGlsZWRDbGFzcywgZGVmaW5pdGlvbnM6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGlpZmVCb2R5ID0gZ2V0SWlmZUJvZHkoY29tcGlsZWRDbGFzcy5kZWNsYXJhdGlvbik7XG4gICAgaWYgKCFpaWZlQm9keSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDb21waWxlZCBjbGFzcyBkZWNsYXJhdGlvbiBpcyBub3QgaW5zaWRlIGFuIElJRkU6ICR7Y29tcGlsZWRDbGFzcy5uYW1lfSBpbiAke2NvbXBpbGVkQ2xhc3MuZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJldHVyblN0YXRlbWVudCA9IGlpZmVCb2R5LnN0YXRlbWVudHMuZmluZCh0cy5pc1JldHVyblN0YXRlbWVudCk7XG4gICAgaWYgKCFyZXR1cm5TdGF0ZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQ29tcGlsZWQgY2xhc3Mgd3JhcHBlciBJSUZFIGRvZXMgbm90IGhhdmUgYSByZXR1cm4gc3RhdGVtZW50OiAke2NvbXBpbGVkQ2xhc3MubmFtZX0gaW4gJHtjb21waWxlZENsYXNzLmRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnNlcnRpb25Qb2ludCA9IHJldHVyblN0YXRlbWVudC5nZXRGdWxsU3RhcnQoKTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbnNlcnRpb25Qb2ludCwgJ1xcbicgKyBkZWZpbml0aW9ucyk7XG4gIH1cbn1cbiJdfQ==
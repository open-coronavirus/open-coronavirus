(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/locale_plugin", ["require", "exports", "@babel/types", "@angular/localize/src/tools/src/translate/source_files/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require("@babel/types");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/translate/source_files/source_file_utils");
    /**
     * This Babel plugin will replace the following code forms with a string literal containing the
     * given `locale`.
     *
     * * `$localize.locale`                                            -> `"locale"`
     * * `typeof $localize !== "undefined" && $localize.locale`        -> `"locale"`
     * * `xxx && typeof $localize !== "undefined" && $localize.locale` -> `"xxx && locale"`
     * * `$localize.locale || default`                                 -> `"locale" || default`
     *
     * @param locale The name of the locale to inline into the code.
     * @param options Additional options including the name of the `$localize` function.
     */
    function makeLocalePlugin(locale, _a) {
        var _b = (_a === void 0 ? {} : _a).localizeName, localizeName = _b === void 0 ? '$localize' : _b;
        return {
            visitor: {
                MemberExpression: function (expression) {
                    var obj = expression.get('object');
                    if (!source_file_utils_1.isLocalize(obj, localizeName)) {
                        return;
                    }
                    var property = expression.get('property');
                    if (!property.isIdentifier({ name: 'locale' })) {
                        return;
                    }
                    if (expression.parentPath.isAssignmentExpression() &&
                        expression.parentPath.get('left') === expression) {
                        return;
                    }
                    // Check for the `$localize.locale` being guarded by a check on the existence of
                    // `$localize`.
                    var parent = expression.parentPath;
                    if (parent.isLogicalExpression({ operator: '&&' }) && parent.get('right') === expression) {
                        var left = parent.get('left');
                        if (isLocalizeGuard(left, localizeName)) {
                            // Replace `typeof $localize !== "undefined" && $localize.locale` with
                            // `$localize.locale`
                            parent.replaceWith(expression);
                        }
                        else if (left.isLogicalExpression({ operator: '&&' }) &&
                            isLocalizeGuard(left.get('right'), localizeName)) {
                            // The `$localize` is part of a preceding logical AND.
                            // Replace XXX && typeof $localize !== "undefined" && $localize.locale` with `XXX &&
                            // $localize.locale`
                            left.replaceWith(left.get('left'));
                        }
                    }
                    // Replace the `$localize.locale` with the string literal
                    expression.replaceWith(types_1.stringLiteral(locale));
                }
            }
        };
    }
    exports.makeLocalePlugin = makeLocalePlugin;
    /**
     * Returns true if the expression one of:
     * * `typeof $localize !== "undefined"`
     * * `"undefined" !== typeof $localize`
     * * `typeof $localize != "undefined"`
     * * `"undefined" != typeof $localize`
     *
     * @param expression the expression to check
     * @param localizeName the name of the `$localize` symbol
     */
    function isLocalizeGuard(expression, localizeName) {
        if (!expression.isBinaryExpression() ||
            !(expression.node.operator === '!==' || expression.node.operator === '!=')) {
            return false;
        }
        var left = expression.get('left');
        var right = expression.get('right');
        return (left.isUnaryExpression({ operator: 'typeof' }) &&
            source_file_utils_1.isLocalize(left.get('argument'), localizeName) &&
            right.isStringLiteral({ value: 'undefined' })) ||
            (right.isUnaryExpression({ operator: 'typeof' }) &&
                source_file_utils_1.isLocalize(right.get('argument'), localizeName) &&
                left.isStringLiteral({ value: 'undefined' }));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9sb2NhbGVfcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBUUEsc0NBQTZEO0lBRTdELDhHQUF1RTtJQUV2RTs7Ozs7Ozs7Ozs7T0FXRztJQUNILFNBQWdCLGdCQUFnQixDQUM1QixNQUFjLEVBQUUsRUFBeUQ7WUFBeEQsMkNBQTBCLEVBQTFCLCtDQUEwQjtRQUM3QyxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGdCQUFnQixFQUFoQixVQUFpQixVQUFzQztvQkFDckQsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLDhCQUFVLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUFFO3dCQUNsQyxPQUFPO3FCQUNSO29CQUNELElBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFhLENBQUM7b0JBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUU7d0JBQzVDLE9BQU87cUJBQ1I7b0JBQ0QsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFO3dCQUM5QyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFVLEVBQUU7d0JBQ3BELE9BQU87cUJBQ1I7b0JBQ0QsZ0ZBQWdGO29CQUNoRixlQUFlO29CQUNmLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JDLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLEVBQUU7d0JBQ3RGLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2hDLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDdkMsc0VBQXNFOzRCQUN0RSxxQkFBcUI7NEJBQ3JCLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7eUJBQ2hDOzZCQUFNLElBQ0gsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOzRCQUMxQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDcEQsc0RBQXNEOzRCQUN0RCxvRkFBb0Y7NEJBQ3BGLG9CQUFvQjs0QkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7eUJBQ3BDO3FCQUNGO29CQUNELHlEQUF5RDtvQkFDekQsVUFBVSxDQUFDLFdBQVcsQ0FBQyxxQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBeENELDRDQXdDQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILFNBQVMsZUFBZSxDQUFDLFVBQW9CLEVBQUUsWUFBb0I7UUFDakUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRTtZQUNoQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQzlFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFNLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQztZQUM1Qyw4QkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxDQUFDO1lBQzlDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQztnQkFDN0MsOEJBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVksQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFDLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtNZW1iZXJFeHByZXNzaW9uLCBzdHJpbmdMaXRlcmFsfSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge1RyYW5zbGF0ZVBsdWdpbk9wdGlvbnMsIGlzTG9jYWxpemV9IGZyb20gJy4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG4vKipcbiAqIFRoaXMgQmFiZWwgcGx1Z2luIHdpbGwgcmVwbGFjZSB0aGUgZm9sbG93aW5nIGNvZGUgZm9ybXMgd2l0aCBhIHN0cmluZyBsaXRlcmFsIGNvbnRhaW5pbmcgdGhlXG4gKiBnaXZlbiBgbG9jYWxlYC5cbiAqXG4gKiAqIGAkbG9jYWxpemUubG9jYWxlYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLT4gYFwibG9jYWxlXCJgXG4gKiAqIGB0eXBlb2YgJGxvY2FsaXplICE9PSBcInVuZGVmaW5lZFwiICYmICRsb2NhbGl6ZS5sb2NhbGVgICAgICAgICAtPiBgXCJsb2NhbGVcImBcbiAqICogYHh4eCAmJiB0eXBlb2YgJGxvY2FsaXplICE9PSBcInVuZGVmaW5lZFwiICYmICRsb2NhbGl6ZS5sb2NhbGVgIC0+IGBcInh4eCAmJiBsb2NhbGVcImBcbiAqICogYCRsb2NhbGl6ZS5sb2NhbGUgfHwgZGVmYXVsdGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtPiBgXCJsb2NhbGVcIiB8fCBkZWZhdWx0YFxuICpcbiAqIEBwYXJhbSBsb2NhbGUgVGhlIG5hbWUgb2YgdGhlIGxvY2FsZSB0byBpbmxpbmUgaW50byB0aGUgY29kZS5cbiAqIEBwYXJhbSBvcHRpb25zIEFkZGl0aW9uYWwgb3B0aW9ucyBpbmNsdWRpbmcgdGhlIG5hbWUgb2YgdGhlIGAkbG9jYWxpemVgIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxvY2FsZVBsdWdpbihcbiAgICBsb2NhbGU6IHN0cmluZywge2xvY2FsaXplTmFtZSA9ICckbG9jYWxpemUnfTogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHt9KTogUGx1Z2luT2JqIHtcbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBNZW1iZXJFeHByZXNzaW9uKGV4cHJlc3Npb246IE5vZGVQYXRoPE1lbWJlckV4cHJlc3Npb24+KSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGV4cHJlc3Npb24uZ2V0KCdvYmplY3QnKTtcbiAgICAgICAgaWYgKCFpc0xvY2FsaXplKG9iaiwgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IGV4cHJlc3Npb24uZ2V0KCdwcm9wZXJ0eScpIGFzIE5vZGVQYXRoO1xuICAgICAgICBpZiAoIXByb3BlcnR5LmlzSWRlbnRpZmllcih7bmFtZTogJ2xvY2FsZSd9KSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbi5wYXJlbnRQYXRoLmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSAmJlxuICAgICAgICAgICAgZXhwcmVzc2lvbi5wYXJlbnRQYXRoLmdldCgnbGVmdCcpID09PSBleHByZXNzaW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvciB0aGUgYCRsb2NhbGl6ZS5sb2NhbGVgIGJlaW5nIGd1YXJkZWQgYnkgYSBjaGVjayBvbiB0aGUgZXhpc3RlbmNlIG9mXG4gICAgICAgIC8vIGAkbG9jYWxpemVgLlxuICAgICAgICBjb25zdCBwYXJlbnQgPSBleHByZXNzaW9uLnBhcmVudFBhdGg7XG4gICAgICAgIGlmIChwYXJlbnQuaXNMb2dpY2FsRXhwcmVzc2lvbih7b3BlcmF0b3I6ICcmJid9KSAmJiBwYXJlbnQuZ2V0KCdyaWdodCcpID09PSBleHByZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgbGVmdCA9IHBhcmVudC5nZXQoJ2xlZnQnKTtcbiAgICAgICAgICBpZiAoaXNMb2NhbGl6ZUd1YXJkKGxlZnQsIGxvY2FsaXplTmFtZSkpIHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgYHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZWAgd2l0aFxuICAgICAgICAgICAgLy8gYCRsb2NhbGl6ZS5sb2NhbGVgXG4gICAgICAgICAgICBwYXJlbnQucmVwbGFjZVdpdGgoZXhwcmVzc2lvbik7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgbGVmdC5pc0xvZ2ljYWxFeHByZXNzaW9uKHtvcGVyYXRvcjogJyYmJ30pICYmXG4gICAgICAgICAgICAgIGlzTG9jYWxpemVHdWFyZChsZWZ0LmdldCgncmlnaHQnKSwgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgLy8gVGhlIGAkbG9jYWxpemVgIGlzIHBhcnQgb2YgYSBwcmVjZWRpbmcgbG9naWNhbCBBTkQuXG4gICAgICAgICAgICAvLyBSZXBsYWNlIFhYWCAmJiB0eXBlb2YgJGxvY2FsaXplICE9PSBcInVuZGVmaW5lZFwiICYmICRsb2NhbGl6ZS5sb2NhbGVgIHdpdGggYFhYWCAmJlxuICAgICAgICAgICAgLy8gJGxvY2FsaXplLmxvY2FsZWBcbiAgICAgICAgICAgIGxlZnQucmVwbGFjZVdpdGgobGVmdC5nZXQoJ2xlZnQnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGAkbG9jYWxpemUubG9jYWxlYCB3aXRoIHRoZSBzdHJpbmcgbGl0ZXJhbFxuICAgICAgICBleHByZXNzaW9uLnJlcGxhY2VXaXRoKHN0cmluZ0xpdGVyYWwobG9jYWxlKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZXhwcmVzc2lvbiBvbmUgb2Y6XG4gKiAqIGB0eXBlb2YgJGxvY2FsaXplICE9PSBcInVuZGVmaW5lZFwiYFxuICogKiBgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mICRsb2NhbGl6ZWBcbiAqICogYHR5cGVvZiAkbG9jYWxpemUgIT0gXCJ1bmRlZmluZWRcImBcbiAqICogYFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mICRsb2NhbGl6ZWBcbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiB0aGUgZXhwcmVzc2lvbiB0byBjaGVja1xuICogQHBhcmFtIGxvY2FsaXplTmFtZSB0aGUgbmFtZSBvZiB0aGUgYCRsb2NhbGl6ZWAgc3ltYm9sXG4gKi9cbmZ1bmN0aW9uIGlzTG9jYWxpemVHdWFyZChleHByZXNzaW9uOiBOb2RlUGF0aCwgbG9jYWxpemVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFleHByZXNzaW9uLmlzQmluYXJ5RXhwcmVzc2lvbigpIHx8XG4gICAgICAhKGV4cHJlc3Npb24ubm9kZS5vcGVyYXRvciA9PT0gJyE9PScgfHwgZXhwcmVzc2lvbi5ub2RlLm9wZXJhdG9yID09PSAnIT0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBsZWZ0ID0gZXhwcmVzc2lvbi5nZXQoJ2xlZnQnKTtcbiAgY29uc3QgcmlnaHQgPSBleHByZXNzaW9uLmdldCgncmlnaHQnKTtcblxuICByZXR1cm4gKGxlZnQuaXNVbmFyeUV4cHJlc3Npb24oe29wZXJhdG9yOiAndHlwZW9mJ30pICYmXG4gICAgICAgICAgaXNMb2NhbGl6ZShsZWZ0LmdldCgnYXJndW1lbnQnKSwgbG9jYWxpemVOYW1lKSAmJlxuICAgICAgICAgIHJpZ2h0LmlzU3RyaW5nTGl0ZXJhbCh7dmFsdWU6ICd1bmRlZmluZWQnfSkpIHx8XG4gICAgICAocmlnaHQuaXNVbmFyeUV4cHJlc3Npb24oe29wZXJhdG9yOiAndHlwZW9mJ30pICYmXG4gICAgICAgaXNMb2NhbGl6ZShyaWdodC5nZXQoJ2FyZ3VtZW50JyksIGxvY2FsaXplTmFtZSkgJiZcbiAgICAgICBsZWZ0LmlzU3RyaW5nTGl0ZXJhbCh7dmFsdWU6ICd1bmRlZmluZWQnfSkpO1xufVxuIl19
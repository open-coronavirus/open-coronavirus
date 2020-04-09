(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/utils", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
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
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    function getOriginalSymbol(checker) {
        return function (symbol) {
            return ts.SymbolFlags.Alias & symbol.flags ? checker.getAliasedSymbol(symbol) : symbol;
        };
    }
    exports.getOriginalSymbol = getOriginalSymbol;
    function isDefined(value) {
        return (value !== undefined) && (value !== null);
    }
    exports.isDefined = isDefined;
    function getNameText(name) {
        return ts.isIdentifier(name) || ts.isLiteralExpression(name) ? name.text : name.getText();
    }
    exports.getNameText = getNameText;
    /**
     * Parse down the AST and capture all the nodes that satisfy the test.
     * @param node The start node.
     * @param test The function that tests whether a node should be included.
     * @returns a collection of nodes that satisfy the test.
     */
    function findAll(node, test) {
        var nodes = [];
        findAllVisitor(node);
        return nodes;
        function findAllVisitor(n) {
            if (test(n)) {
                nodes.push(n);
            }
            else {
                n.forEachChild(function (child) { return findAllVisitor(child); });
            }
        }
    }
    exports.findAll = findAll;
    /**
     * Does the given declaration have a name which is an identifier?
     * @param declaration The declaration to test.
     * @returns true if the declaration has an identifier for a name.
     */
    function hasNameIdentifier(declaration) {
        var namedDeclaration = declaration;
        return namedDeclaration.name !== undefined && ts.isIdentifier(namedDeclaration.name);
    }
    exports.hasNameIdentifier = hasNameIdentifier;
    /**
     * Test whether a path is "relative".
     *
     * Relative paths start with `/`, `./` or `../`; or are simply `.` or `..`.
     */
    function isRelativePath(path) {
        return /^\/|^\.\.?($|\/)/.test(path);
    }
    exports.isRelativePath = isRelativePath;
    /**
     * Attempt to resolve a `path` to a file by appending the provided `postFixes`
     * to the `path` and checking if the file exists on disk.
     * @returns An absolute path to the first matching existing file, or `null` if none exist.
     */
    function resolveFileWithPostfixes(fs, path, postFixes) {
        var e_1, _a;
        try {
            for (var postFixes_1 = tslib_1.__values(postFixes), postFixes_1_1 = postFixes_1.next(); !postFixes_1_1.done; postFixes_1_1 = postFixes_1.next()) {
                var postFix = postFixes_1_1.value;
                var testPath = file_system_1.absoluteFrom(path + postFix);
                if (fs.exists(testPath) && fs.stat(testPath).isFile()) {
                    return testPath;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (postFixes_1_1 && !postFixes_1_1.done && (_a = postFixes_1.return)) _a.call(postFixes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    }
    exports.resolveFileWithPostfixes = resolveFileWithPostfixes;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsK0JBQWlDO0lBQ2pDLDJFQUFxRjtJQUVyRixTQUFnQixpQkFBaUIsQ0FBQyxPQUF1QjtRQUN2RCxPQUFPLFVBQVMsTUFBaUI7WUFDL0IsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN6RixDQUFDLENBQUM7SUFDSixDQUFDO0lBSkQsOENBSUM7SUFFRCxTQUFnQixTQUFTLENBQUksS0FBMkI7UUFDdEQsT0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRkQsOEJBRUM7SUFFRCxTQUFnQixXQUFXLENBQUMsSUFBc0M7UUFDaEUsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVGLENBQUM7SUFGRCxrQ0FFQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBZ0IsT0FBTyxDQUFJLElBQWEsRUFBRSxJQUE0QztRQUNwRixJQUFNLEtBQUssR0FBUSxFQUFFLENBQUM7UUFDdEIsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sS0FBSyxDQUFDO1FBRWIsU0FBUyxjQUFjLENBQUMsQ0FBVTtZQUNoQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDWCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7aUJBQU07Z0JBQ0wsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO2FBQ2hEO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFaRCwwQkFZQztJQUVEOzs7O09BSUc7SUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxXQUEyQjtRQUUzRCxJQUFNLGdCQUFnQixHQUFvQyxXQUFXLENBQUM7UUFDdEUsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUpELDhDQUlDO0lBT0Q7Ozs7T0FJRztJQUNILFNBQWdCLGNBQWMsQ0FBQyxJQUFZO1FBQ3pDLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFGRCx3Q0FFQztJQUVEOzs7O09BSUc7SUFDSCxTQUFnQix3QkFBd0IsQ0FDcEMsRUFBYyxFQUFFLElBQW9CLEVBQUUsU0FBbUI7OztZQUMzRCxLQUFzQixJQUFBLGNBQUEsaUJBQUEsU0FBUyxDQUFBLG9DQUFBLDJEQUFFO2dCQUE1QixJQUFNLE9BQU8sc0JBQUE7Z0JBQ2hCLElBQU0sUUFBUSxHQUFHLDBCQUFZLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDckQsT0FBTyxRQUFRLENBQUM7aUJBQ2pCO2FBQ0Y7Ozs7Ozs7OztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVRELDREQVNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtLCBhYnNvbHV0ZUZyb219IGZyb20gJy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcmlnaW5hbFN5bWJvbChjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IChzeW1ib2w6IHRzLlN5bWJvbCkgPT4gdHMuU3ltYm9sIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN5bWJvbDogdHMuU3ltYm9sKSB7XG4gICAgcmV0dXJuIHRzLlN5bWJvbEZsYWdzLkFsaWFzICYgc3ltYm9sLmZsYWdzID8gY2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCkgOiBzeW1ib2w7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQ8VD4odmFsdWU6IFQgfCB1bmRlZmluZWQgfCBudWxsKTogdmFsdWUgaXMgVCB7XG4gIHJldHVybiAodmFsdWUgIT09IHVuZGVmaW5lZCkgJiYgKHZhbHVlICE9PSBudWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVUZXh0KG5hbWU6IHRzLlByb3BlcnR5TmFtZSB8IHRzLkJpbmRpbmdOYW1lKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihuYW1lKSB8fCB0cy5pc0xpdGVyYWxFeHByZXNzaW9uKG5hbWUpID8gbmFtZS50ZXh0IDogbmFtZS5nZXRUZXh0KCk7XG59XG5cbi8qKlxuICogUGFyc2UgZG93biB0aGUgQVNUIGFuZCBjYXB0dXJlIGFsbCB0aGUgbm9kZXMgdGhhdCBzYXRpc2Z5IHRoZSB0ZXN0LlxuICogQHBhcmFtIG5vZGUgVGhlIHN0YXJ0IG5vZGUuXG4gKiBAcGFyYW0gdGVzdCBUaGUgZnVuY3Rpb24gdGhhdCB0ZXN0cyB3aGV0aGVyIGEgbm9kZSBzaG91bGQgYmUgaW5jbHVkZWQuXG4gKiBAcmV0dXJucyBhIGNvbGxlY3Rpb24gb2Ygbm9kZXMgdGhhdCBzYXRpc2Z5IHRoZSB0ZXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEFsbDxUPihub2RlOiB0cy5Ob2RlLCB0ZXN0OiAobm9kZTogdHMuTm9kZSkgPT4gbm9kZSBpcyB0cy5Ob2RlICYgVCk6IFRbXSB7XG4gIGNvbnN0IG5vZGVzOiBUW10gPSBbXTtcbiAgZmluZEFsbFZpc2l0b3Iobm9kZSk7XG4gIHJldHVybiBub2RlcztcblxuICBmdW5jdGlvbiBmaW5kQWxsVmlzaXRvcihuOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRlc3QobikpIHtcbiAgICAgIG5vZGVzLnB1c2gobik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG4uZm9yRWFjaENoaWxkKGNoaWxkID0+IGZpbmRBbGxWaXNpdG9yKGNoaWxkKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRG9lcyB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24gaGF2ZSBhIG5hbWUgd2hpY2ggaXMgYW4gaWRlbnRpZmllcj9cbiAqIEBwYXJhbSBkZWNsYXJhdGlvbiBUaGUgZGVjbGFyYXRpb24gdG8gdGVzdC5cbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGRlY2xhcmF0aW9uIGhhcyBhbiBpZGVudGlmaWVyIGZvciBhIG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNOYW1lSWRlbnRpZmllcihkZWNsYXJhdGlvbjogdHMuRGVjbGFyYXRpb24pOiBkZWNsYXJhdGlvbiBpcyB0cy5EZWNsYXJhdGlvbiZcbiAgICB7bmFtZTogdHMuSWRlbnRpZmllcn0ge1xuICBjb25zdCBuYW1lZERlY2xhcmF0aW9uOiB0cy5EZWNsYXJhdGlvbiZ7bmFtZT86IHRzLk5vZGV9ID0gZGVjbGFyYXRpb247XG4gIHJldHVybiBuYW1lZERlY2xhcmF0aW9uLm5hbWUgIT09IHVuZGVmaW5lZCAmJiB0cy5pc0lkZW50aWZpZXIobmFtZWREZWNsYXJhdGlvbi5uYW1lKTtcbn1cblxuZXhwb3J0IHR5cGUgUGF0aE1hcHBpbmdzID0ge1xuICBiYXNlVXJsOiBzdHJpbmcsXG4gIHBhdGhzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nW119XG59O1xuXG4vKipcbiAqIFRlc3Qgd2hldGhlciBhIHBhdGggaXMgXCJyZWxhdGl2ZVwiLlxuICpcbiAqIFJlbGF0aXZlIHBhdGhzIHN0YXJ0IHdpdGggYC9gLCBgLi9gIG9yIGAuLi9gOyBvciBhcmUgc2ltcGx5IGAuYCBvciBgLi5gLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNSZWxhdGl2ZVBhdGgocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAvXlxcL3xeXFwuXFwuPygkfFxcLykvLnRlc3QocGF0aCk7XG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byByZXNvbHZlIGEgYHBhdGhgIHRvIGEgZmlsZSBieSBhcHBlbmRpbmcgdGhlIHByb3ZpZGVkIGBwb3N0Rml4ZXNgXG4gKiB0byB0aGUgYHBhdGhgIGFuZCBjaGVja2luZyBpZiB0aGUgZmlsZSBleGlzdHMgb24gZGlzay5cbiAqIEByZXR1cm5zIEFuIGFic29sdXRlIHBhdGggdG8gdGhlIGZpcnN0IG1hdGNoaW5nIGV4aXN0aW5nIGZpbGUsIG9yIGBudWxsYCBpZiBub25lIGV4aXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUZpbGVXaXRoUG9zdGZpeGVzKFxuICAgIGZzOiBGaWxlU3lzdGVtLCBwYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcG9zdEZpeGVzOiBzdHJpbmdbXSk6IEFic29sdXRlRnNQYXRofG51bGwge1xuICBmb3IgKGNvbnN0IHBvc3RGaXggb2YgcG9zdEZpeGVzKSB7XG4gICAgY29uc3QgdGVzdFBhdGggPSBhYnNvbHV0ZUZyb20ocGF0aCArIHBvc3RGaXgpO1xuICAgIGlmIChmcy5leGlzdHModGVzdFBhdGgpICYmIGZzLnN0YXQodGVzdFBhdGgpLmlzRmlsZSgpKSB7XG4gICAgICByZXR1cm4gdGVzdFBhdGg7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuIl19
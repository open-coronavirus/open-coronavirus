/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/imports/src/find_export", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    /**
     * Find the name, if any, by which a node is exported from a given file.
     */
    function findExportedNameOfNode(target, file, checker) {
        // First, get the exports of the file.
        var symbol = checker.getSymbolAtLocation(file);
        if (symbol === undefined) {
            return null;
        }
        var exports = checker.getExportsOfModule(symbol);
        // Look for the export which declares the node.
        var found = exports.find(function (sym) { return symbolDeclaresNode(sym, target, checker); });
        if (found === undefined) {
            throw new Error("Failed to find exported name of node (" + target.getText() + ") in '" + file.fileName + "'.");
        }
        return found.name;
    }
    exports.findExportedNameOfNode = findExportedNameOfNode;
    /**
     * Check whether a given `ts.Symbol` represents a declaration of a given node.
     *
     * This is not quite as trivial as just checking the declarations, as some nodes are
     * `ts.ExportSpecifier`s and need to be unwrapped.
     */
    function symbolDeclaresNode(sym, node, checker) {
        return sym.declarations.some(function (decl) {
            if (ts.isExportSpecifier(decl)) {
                var exportedSymbol = checker.getExportSpecifierLocalTargetSymbol(decl);
                if (exportedSymbol !== undefined) {
                    return symbolDeclaresNode(exportedSymbol, node, checker);
                }
            }
            return decl === node;
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZF9leHBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ltcG9ydHMvc3JjL2ZpbmRfZXhwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBRWpDOztPQUVHO0lBQ0gsU0FBZ0Isc0JBQXNCLENBQ2xDLE1BQWUsRUFBRSxJQUFtQixFQUFFLE9BQXVCO1FBQy9ELHNDQUFzQztRQUN0QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkQsK0NBQStDO1FBQy9DLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7UUFDNUUsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQ1gsMkNBQXlDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsY0FBUyxJQUFJLENBQUMsUUFBUSxPQUFJLENBQUMsQ0FBQztTQUMxRjtRQUNELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQztJQUNwQixDQUFDO0lBaEJELHdEQWdCQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxHQUFjLEVBQUUsSUFBYSxFQUFFLE9BQXVCO1FBQ2hGLE9BQU8sR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQy9CLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsbUNBQW1DLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pFLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTtvQkFDaEMsT0FBTyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUMxRDthQUNGO1lBQ0QsT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogRmluZCB0aGUgbmFtZSwgaWYgYW55LCBieSB3aGljaCBhIG5vZGUgaXMgZXhwb3J0ZWQgZnJvbSBhIGdpdmVuIGZpbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRXhwb3J0ZWROYW1lT2ZOb2RlKFxuICAgIHRhcmdldDogdHMuTm9kZSwgZmlsZTogdHMuU291cmNlRmlsZSwgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiBzdHJpbmd8bnVsbCB7XG4gIC8vIEZpcnN0LCBnZXQgdGhlIGV4cG9ydHMgb2YgdGhlIGZpbGUuXG4gIGNvbnN0IHN5bWJvbCA9IGNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihmaWxlKTtcbiAgaWYgKHN5bWJvbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZXhwb3J0cyA9IGNoZWNrZXIuZ2V0RXhwb3J0c09mTW9kdWxlKHN5bWJvbCk7XG5cbiAgLy8gTG9vayBmb3IgdGhlIGV4cG9ydCB3aGljaCBkZWNsYXJlcyB0aGUgbm9kZS5cbiAgY29uc3QgZm91bmQgPSBleHBvcnRzLmZpbmQoc3ltID0+IHN5bWJvbERlY2xhcmVzTm9kZShzeW0sIHRhcmdldCwgY2hlY2tlcikpO1xuICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEZhaWxlZCB0byBmaW5kIGV4cG9ydGVkIG5hbWUgb2Ygbm9kZSAoJHt0YXJnZXQuZ2V0VGV4dCgpfSkgaW4gJyR7ZmlsZS5maWxlTmFtZX0nLmApO1xuICB9XG4gIHJldHVybiBmb3VuZC5uYW1lO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYSBnaXZlbiBgdHMuU3ltYm9sYCByZXByZXNlbnRzIGEgZGVjbGFyYXRpb24gb2YgYSBnaXZlbiBub2RlLlxuICpcbiAqIFRoaXMgaXMgbm90IHF1aXRlIGFzIHRyaXZpYWwgYXMganVzdCBjaGVja2luZyB0aGUgZGVjbGFyYXRpb25zLCBhcyBzb21lIG5vZGVzIGFyZVxuICogYHRzLkV4cG9ydFNwZWNpZmllcmBzIGFuZCBuZWVkIHRvIGJlIHVud3JhcHBlZC5cbiAqL1xuZnVuY3Rpb24gc3ltYm9sRGVjbGFyZXNOb2RlKHN5bTogdHMuU3ltYm9sLCBub2RlOiB0cy5Ob2RlLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gc3ltLmRlY2xhcmF0aW9ucy5zb21lKGRlY2wgPT4ge1xuICAgIGlmICh0cy5pc0V4cG9ydFNwZWNpZmllcihkZWNsKSkge1xuICAgICAgY29uc3QgZXhwb3J0ZWRTeW1ib2wgPSBjaGVja2VyLmdldEV4cG9ydFNwZWNpZmllckxvY2FsVGFyZ2V0U3ltYm9sKGRlY2wpO1xuICAgICAgaWYgKGV4cG9ydGVkU3ltYm9sICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbERlY2xhcmVzTm9kZShleHBvcnRlZFN5bWJvbCwgbm9kZSwgY2hlY2tlcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWNsID09PSBub2RlO1xuICB9KTtcbn1cbiJdfQ==
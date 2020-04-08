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
        define("@angular/compiler-cli/src/ngtsc/entry_point/src/private_export_checker", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    /**
     * Produce `ts.Diagnostic`s for classes that are visible from exported types (e.g. directives
     * exposed by exported `NgModule`s) that are not themselves exported.
     *
     * This function reconciles two concepts:
     *
     * A class is Exported if it's exported from the main library `entryPoint` file.
     * A class is Visible if, via Angular semantics, a downstream consumer can import an Exported class
     * and be affected by the class in question. For example, an Exported NgModule may expose a
     * directive class to its consumers. Consumers that import the NgModule may have the directive
     * applied to elements in their templates. In this case, the directive is considered Visible.
     *
     * `checkForPrivateExports` attempts to verify that all Visible classes are Exported, and report
     * `ts.Diagnostic`s for those that aren't.
     *
     * @param entryPoint `ts.SourceFile` of the library's entrypoint, which should export the library's
     * public API.
     * @param checker `ts.TypeChecker` for the current program.
     * @param refGraph `ReferenceGraph` tracking the visibility of Angular types.
     * @returns an array of `ts.Diagnostic`s representing errors when visible classes are not exported
     * properly.
     */
    function checkForPrivateExports(entryPoint, checker, refGraph) {
        var diagnostics = [];
        // Firstly, compute the exports of the entry point. These are all the Exported classes.
        var topLevelExports = new Set();
        // Do this via `ts.TypeChecker.getExportsOfModule`.
        var moduleSymbol = checker.getSymbolAtLocation(entryPoint);
        if (moduleSymbol === undefined) {
            throw new Error("Internal error: failed to get symbol for entrypoint");
        }
        var exportedSymbols = checker.getExportsOfModule(moduleSymbol);
        // Loop through the exported symbols, de-alias if needed, and add them to `topLevelExports`.
        // TODO(alxhub): use proper iteration when build.sh is removed. (#27762)
        exportedSymbols.forEach(function (symbol) {
            if (symbol.flags & ts.SymbolFlags.Alias) {
                symbol = checker.getAliasedSymbol(symbol);
            }
            var decl = symbol.valueDeclaration;
            if (decl !== undefined) {
                topLevelExports.add(decl);
            }
        });
        // Next, go through each exported class and expand it to the set of classes it makes Visible,
        // using the `ReferenceGraph`. For each Visible class, verify that it's also Exported, and queue
        // an error if it isn't. `checkedSet` ensures only one error is queued per class.
        var checkedSet = new Set();
        // Loop through each Exported class.
        // TODO(alxhub): use proper iteration when the legacy build is removed. (#27762)
        topLevelExports.forEach(function (mainExport) {
            // Loop through each class made Visible by the Exported class.
            refGraph.transitiveReferencesOf(mainExport).forEach(function (transitiveReference) {
                // Skip classes which have already been checked.
                if (checkedSet.has(transitiveReference)) {
                    return;
                }
                checkedSet.add(transitiveReference);
                // Verify that the Visible class is also Exported.
                if (!topLevelExports.has(transitiveReference)) {
                    // This is an error, `mainExport` makes `transitiveReference` Visible, but
                    // `transitiveReference` is not Exported from the entrypoint. Construct a diagnostic to
                    // give to the user explaining the situation.
                    var descriptor = getDescriptorOfDeclaration(transitiveReference);
                    var name_1 = getNameOfDeclaration(transitiveReference);
                    // Construct the path of visibility, from `mainExport` to `transitiveReference`.
                    var visibleVia = 'NgModule exports';
                    var transitivePath = refGraph.pathFrom(mainExport, transitiveReference);
                    if (transitivePath !== null) {
                        visibleVia = transitivePath.map(function (seg) { return getNameOfDeclaration(seg); }).join(' -> ');
                    }
                    var diagnostic = tslib_1.__assign({ category: ts.DiagnosticCategory.Error, code: diagnostics_1.ngErrorCode(diagnostics_1.ErrorCode.SYMBOL_NOT_EXPORTED), file: transitiveReference.getSourceFile() }, getPosOfDeclaration(transitiveReference), { messageText: "Unsupported private " + descriptor + " " + name_1 + ". This " + descriptor + " is visible to consumers via " + visibleVia + ", but is not exported from the top-level library entrypoint." });
                    diagnostics.push(diagnostic);
                }
            });
        });
        return diagnostics;
    }
    exports.checkForPrivateExports = checkForPrivateExports;
    function getPosOfDeclaration(decl) {
        var node = getIdentifierOfDeclaration(decl) || decl;
        return {
            start: node.getStart(),
            length: node.getEnd() + 1 - node.getStart(),
        };
    }
    function getIdentifierOfDeclaration(decl) {
        if ((ts.isClassDeclaration(decl) || ts.isVariableDeclaration(decl) ||
            ts.isFunctionDeclaration(decl)) &&
            decl.name !== undefined && ts.isIdentifier(decl.name)) {
            return decl.name;
        }
        else {
            return null;
        }
    }
    function getNameOfDeclaration(decl) {
        var id = getIdentifierOfDeclaration(decl);
        return id !== null ? id.text : '(unnamed)';
    }
    function getDescriptorOfDeclaration(decl) {
        switch (decl.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                return 'class';
            case ts.SyntaxKind.FunctionDeclaration:
                return 'function';
            case ts.SyntaxKind.VariableDeclaration:
                return 'variable';
            case ts.SyntaxKind.EnumDeclaration:
                return 'enum';
            default:
                return 'declaration';
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZV9leHBvcnRfY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZW50cnlfcG9pbnQvc3JjL3ByaXZhdGVfZXhwb3J0X2NoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBRWpDLDJFQUF5RDtJQUl6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0gsU0FBZ0Isc0JBQXNCLENBQ2xDLFVBQXlCLEVBQUUsT0FBdUIsRUFBRSxRQUF3QjtRQUM5RSxJQUFNLFdBQVcsR0FBb0IsRUFBRSxDQUFDO1FBRXhDLHVGQUF1RjtRQUN2RixJQUFNLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQUVsRCxtREFBbUQ7UUFDbkQsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7U0FDeEU7UUFDRCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFakUsNEZBQTRGO1FBQzVGLHdFQUF3RTtRQUN4RSxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtZQUM1QixJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3ZDLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7WUFDckMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUN0QixlQUFl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QUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsU0FBUyxvQkFBb0IsQ0FBQyxJQUFvQjtRQUNoRCxJQUFNLEVBQUUsR0FBRywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUM3QyxDQUFDO0lBRUQsU0FBUywwQkFBMEIsQ0FBQyxJQUFvQjtRQUN0RCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtnQkFDakMsT0FBTyxPQUFPLENBQUM7WUFDakIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQjtnQkFDcEMsT0FBTyxVQUFVLENBQUM7WUFDcEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQjtnQkFDcEMsT0FBTyxVQUFVLENBQUM7WUFDcEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWU7Z0JBQ2hDLE9BQU8sTUFBTSxDQUFDO1lBQ2hCO2dCQUNFLE9BQU8sYUFBYSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7RXJyb3JDb2RlLCBuZ0Vycm9yQ29kZX0gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge1JlZmVyZW5jZUdyYXBofSBmcm9tICcuL3JlZmVyZW5jZV9ncmFwaCc7XG5cbi8qKlxuICogUHJvZHVjZSBgdHMuRGlhZ25vc3RpY2BzIGZvciBjbGFzc2VzIHRoYXQgYXJlIHZpc2libGUgZnJvbSBleHBvcnRlZCB0eXBlcyAoZS5nLiBkaXJlY3RpdmVzXG4gKiBleHBvc2VkIGJ5IGV4cG9ydGVkIGBOZ01vZHVsZWBzKSB0aGF0IGFyZSBub3QgdGhlbXNlbHZlcyBleHBvcnRlZC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHJlY29uY2lsZXMgdHdvIGNvbmNlcHRzOlxuICpcbiAqIEEgY2xhc3MgaXMgRXhwb3J0ZWQgaWYgaXQncyBleHBvcnRlZCBmcm9tIHRoZSBtYWluIGxpYnJhcnkgYGVudHJ5UG9pbnRgIGZpbGUuXG4gKiBBIGNsYXNzIGlzIFZpc2libGUgaWYsIHZpYSBBbmd1bGFyIHNlbWFudGljcywgYSBkb3duc3RyZWFtIGNvbnN1bWVyIGNhbiBpbXBvcnQgYW4gRXhwb3J0ZWQgY2xhc3NcbiAqIGFuZCBiZSBhZmZlY3RlZCBieSB0aGUgY2xhc3MgaW4gcXVlc3Rpb24uIEZvciBleGFtcGxlLCBhbiBFeHBvcnRlZCBOZ01vZHVsZSBtYXkgZXhwb3NlIGFcbiAqIGRpcmVjdGl2ZSBjbGFzcyB0byBpdHMgY29uc3VtZXJzLiBDb25zdW1lcnMgdGhhdCBpbXBvcnQgdGhlIE5nTW9kdWxlIG1heSBoYXZlIHRoZSBkaXJlY3RpdmVcbiAqIGFwcGxpZWQgdG8gZWxlbWVudHMgaW4gdGhlaXIgdGVtcGxhdGVzLiBJbiB0aGlzIGNhc2UsIHRoZSBkaXJlY3RpdmUgaXMgY29uc2lkZXJlZCBWaXNpYmxlLlxuICpcbiAqIGBjaGVja0ZvclByaXZhdGVFeHBvcnRzYCBhdHRlbXB0cyB0byB2ZXJpZnkgdGhhdCBhbGwgVmlzaWJsZSBjbGFzc2VzIGFyZSBFeHBvcnRlZCwgYW5kIHJlcG9ydFxuICogYHRzLkRpYWdub3N0aWNgcyBmb3IgdGhvc2UgdGhhdCBhcmVuJ3QuXG4gKlxuICogQHBhcmFtIGVudHJ5UG9pbnQgYHRzLlNvdXJjZUZpbGVgIG9mIHRoZSBsaWJyYXJ5J3MgZW50cnlwb2ludCwgd2hpY2ggc2hvdWxkIGV4cG9ydCB0aGUgbGlicmFyeSdzXG4gKiBwdWJsaWMgQVBJLlxuICogQHBhcmFtIGNoZWNrZXIgYHRzLlR5cGVDaGVja2VyYCBmb3IgdGhlIGN1cnJlbnQgcHJvZ3JhbS5cbiAqIEBwYXJhbSByZWZHcmFwaCBgUmVmZXJlbmNlR3JhcGhgIHRyYWNraW5nIHRoZSB2aXNpYmlsaXR5IG9mIEFuZ3VsYXIgdHlwZXMuXG4gKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgdHMuRGlhZ25vc3RpY2BzIHJlcHJlc2VudGluZyBlcnJvcnMgd2hlbiB2aXNpYmxlIGNsYXNzZXMgYXJlIG5vdCBleHBvcnRlZFxuICogcHJvcGVybHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ZvclByaXZhdGVFeHBvcnRzKFxuICAgIGVudHJ5UG9pbnQ6IHRzLlNvdXJjZUZpbGUsIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCByZWZHcmFwaDogUmVmZXJlbmNlR3JhcGgpOiB0cy5EaWFnbm9zdGljW10ge1xuICBjb25zdCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdID0gW107XG5cbiAgLy8gRmlyc3RseSwgY29tcHV0ZSB0aGUgZXhwb3J0cyBvZiB0aGUgZW50cnkgcG9pbnQuIFRoZXNlIGFyZSBhbGwgdGhlIEV4cG9ydGVkIGNsYXNzZXMuXG4gIGNvbnN0IHRvcExldmVsRXhwb3J0cyA9IG5ldyBTZXQ8dHMuRGVjbGFyYXRpb24+KCk7XG5cbiAgLy8gRG8gdGhpcyB2aWEgYHRzLlR5cGVDaGVja2VyLmdldEV4cG9ydHNPZk1vZHVsZWAuXG4gIGNvbnN0IG1vZHVsZVN5bWJvbCA9IGNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihlbnRyeVBvaW50KTtcbiAgaWYgKG1vZHVsZVN5bWJvbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnRlcm5hbCBlcnJvcjogZmFpbGVkIHRvIGdldCBzeW1ib2wgZm9yIGVudHJ5cG9pbnRgKTtcbiAgfVxuICBjb25zdCBleHBvcnRlZFN5bWJvbHMgPSBjaGVja2VyLmdldEV4cG9ydHNPZk1vZHVsZShtb2R1bGVTeW1ib2wpO1xuXG4gIC8vIExvb3AgdGhyb3VnaCB0aGUgZXhwb3J0ZWQgc3ltYm9scywgZGUtYWxpYXMgaWYgbmVlZGVkLCBhbmQgYWRkIHRoZW0gdG8gYHRvcExldmVsRXhwb3J0c2AuXG4gIC8vIFRPRE8oYWx4aHViKTogdXNlIHByb3BlciBpdGVyYXRpb24gd2hlbiBidWlsZC5zaCBpcyByZW1vdmVkLiAoIzI3NzYyKVxuICBleHBvcnRlZFN5bWJvbHMuZm9yRWFjaChzeW1ib2wgPT4ge1xuICAgIGlmIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgICAgc3ltYm9sID0gY2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCk7XG4gICAgfVxuICAgIGNvbnN0IGRlY2wgPSBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbjtcbiAgICBpZiAoZGVjbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0b3BMZXZlbEV4cG9ydHMuYWRkKGRlY2wpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gTmV4dCwgZ28gdGhyb3VnaCBlYWNoIGV4cG9ydGVkIGNsYXNzIGFuZCBleHBhbmQgaXQgdG8gdGhlIHNldCBvZiBjbGFzc2VzIGl0IG1ha2VzIFZpc2libGUsXG4gIC8vIHVzaW5nIHRoZSBgUmVmZXJlbmNlR3JhcGhgLiBGb3IgZWFjaCBWaXNpYmxlIGNsYXNzLCB2ZXJpZnkgdGhhdCBpdCdzIGFsc28gRXhwb3J0ZWQsIGFuZCBxdWV1ZVxuICAvLyBhbiBlcnJvciBpZiBpdCBpc24ndC4gYGNoZWNrZWRTZXRgIGVuc3VyZXMgb25seSBvbmUgZXJyb3IgaXMgcXVldWVkIHBlciBjbGFzcy5cbiAgY29uc3QgY2hlY2tlZFNldCA9IG5ldyBTZXQ8dHMuRGVjbGFyYXRpb24+KCk7XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGVhY2ggRXhwb3J0ZWQgY2xhc3MuXG4gIC8vIFRPRE8oYWx4aHViKTogdXNlIHByb3BlciBpdGVyYXRpb24gd2hlbiB0aGUgbGVnYWN5IGJ1aWxkIGlzIHJlbW92ZWQuICgjMjc3NjIpXG4gIHRvcExldmVsRXhwb3J0cy5mb3JFYWNoKG1haW5FeHBvcnQgPT4ge1xuICAgIC8vIExvb3AgdGhyb3VnaCBlYWNoIGNsYXNzIG1hZGUgVmlzaWJsZSBieSB0aGUgRXhwb3J0ZWQgY2xhc3MuXG4gICAgcmVmR3JhcGgudHJhbnNpdGl2ZVJlZmVyZW5jZXNPZihtYWluRXhwb3J0KS5mb3JFYWNoKHRyYW5zaXRpdmVSZWZlcmVuY2UgPT4ge1xuICAgICAgLy8gU2tpcCBjbGFzc2VzIHdoaWNoIGhhdmUgYWxyZWFkeSBiZWVuIGNoZWNrZWQuXG4gICAgICBpZiAoY2hlY2tlZFNldC5oYXModHJhbnNpdGl2ZVJlZmVyZW5jZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2hlY2tlZFNldC5hZGQodHJhbnNpdGl2ZVJlZmVyZW5jZSk7XG5cbiAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBWaXNpYmxlIGNsYXNzIGlzIGFsc28gRXhwb3J0ZWQuXG4gICAgICBpZiAoIXRvcExldmVsRXhwb3J0cy5oYXModHJhbnNpdGl2ZVJlZmVyZW5jZSkpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBlcnJvciwgYG1haW5FeHBvcnRgIG1ha2VzIGB0cmFuc2l0aXZlUmVmZXJlbmNlYCBWaXNpYmxlLCBidXRcbiAgICAgICAgLy8gYHRyYW5zaXRpdmVSZWZlcmVuY2VgIGlzIG5vdCBFeHBvcnRlZCBmcm9tIHRoZSBlbnRyeXBvaW50LiBDb25zdHJ1Y3QgYSBkaWFnbm9zdGljIHRvXG4gICAgICAgIC8vIGdpdmUgdG8gdGhlIHVzZXIgZXhwbGFpbmluZyB0aGUgc2l0dWF0aW9uLlxuXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBnZXREZXNjcmlwdG9yT2ZEZWNsYXJhdGlvbih0cmFuc2l0aXZlUmVmZXJlbmNlKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGdldE5hbWVPZkRlY2xhcmF0aW9uKHRyYW5zaXRpdmVSZWZlcmVuY2UpO1xuXG4gICAgICAgIC8vIENvbnN0cnVjdCB0aGUgcGF0aCBvZiB2aXNpYmlsaXR5LCBmcm9tIGBtYWluRXhwb3J0YCB0byBgdHJhbnNpdGl2ZVJlZmVyZW5jZWAuXG4gICAgICAgIGxldCB2aXNpYmxlVmlhID0gJ05nTW9kdWxlIGV4cG9ydHMnO1xuICAgICAgICBjb25zdCB0cmFuc2l0aXZlUGF0aCA9IHJlZkdyYXBoLnBhdGhGcm9tKG1haW5FeHBvcnQsIHRyYW5zaXRpdmVSZWZlcmVuY2UpO1xuICAgICAgICBpZiAodHJhbnNpdGl2ZVBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICB2aXNpYmxlVmlhID0gdHJhbnNpdGl2ZVBhdGgubWFwKHNlZyA9PiBnZXROYW1lT2ZEZWNsYXJhdGlvbihzZWcpKS5qb2luKCcgLT4gJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaWFnbm9zdGljOiB0cy5EaWFnbm9zdGljID0ge1xuICAgICAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICAgICAgY29kZTogbmdFcnJvckNvZGUoRXJyb3JDb2RlLlNZTUJPTF9OT1RfRVhQT1JURUQpLFxuICAgICAgICAgIGZpbGU6IHRyYW5zaXRpdmVSZWZlcmVuY2UuZ2V0U291cmNlRmlsZSgpLCAuLi5nZXRQb3NPZkRlY2xhcmF0aW9uKHRyYW5zaXRpdmVSZWZlcmVuY2UpLFxuICAgICAgICAgIG1lc3NhZ2VUZXh0OlxuICAgICAgICAgICAgICBgVW5zdXBwb3J0ZWQgcHJpdmF0ZSAke2Rlc2NyaXB0b3J9ICR7bmFtZX0uIFRoaXMgJHtkZXNjcmlwdG9yfSBpcyB2aXNpYmxlIHRvIGNvbnN1bWVycyB2aWEgJHt2aXNpYmxlVmlhfSwgYnV0IGlzIG5vdCBleHBvcnRlZCBmcm9tIHRoZSB0b3AtbGV2ZWwgbGlicmFyeSBlbnRyeXBvaW50LmAsXG4gICAgICAgIH07XG5cbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaChkaWFnbm9zdGljKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRpYWdub3N0aWNzO1xufVxuXG5mdW5jdGlvbiBnZXRQb3NPZkRlY2xhcmF0aW9uKGRlY2w6IHRzLkRlY2xhcmF0aW9uKToge3N0YXJ0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyfSB7XG4gIGNvbnN0IG5vZGU6IHRzLk5vZGUgPSBnZXRJZGVudGlmaWVyT2ZEZWNsYXJhdGlvbihkZWNsKSB8fCBkZWNsO1xuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBub2RlLmdldFN0YXJ0KCksXG4gICAgbGVuZ3RoOiBub2RlLmdldEVuZCgpICsgMSAtIG5vZGUuZ2V0U3RhcnQoKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0SWRlbnRpZmllck9mRGVjbGFyYXRpb24oZGVjbDogdHMuRGVjbGFyYXRpb24pOiB0cy5JZGVudGlmaWVyfG51bGwge1xuICBpZiAoKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihkZWNsKSB8fCB0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbCkgfHxcbiAgICAgICB0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oZGVjbCkpICYmXG4gICAgICBkZWNsLm5hbWUgIT09IHVuZGVmaW5lZCAmJiB0cy5pc0lkZW50aWZpZXIoZGVjbC5uYW1lKSkge1xuICAgIHJldHVybiBkZWNsLm5hbWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TmFtZU9mRGVjbGFyYXRpb24oZGVjbDogdHMuRGVjbGFyYXRpb24pOiBzdHJpbmcge1xuICBjb25zdCBpZCA9IGdldElkZW50aWZpZXJPZkRlY2xhcmF0aW9uKGRlY2wpO1xuICByZXR1cm4gaWQgIT09IG51bGwgPyBpZC50ZXh0IDogJyh1bm5hbWVkKSc7XG59XG5cbmZ1bmN0aW9uIGdldERlc2NyaXB0b3JPZkRlY2xhcmF0aW9uKGRlY2w6IHRzLkRlY2xhcmF0aW9uKTogc3RyaW5nIHtcbiAgc3dpdGNoIChkZWNsLmtpbmQpIHtcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbjpcbiAgICAgIHJldHVybiAnY2xhc3MnO1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uOlxuICAgICAgcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb246XG4gICAgICByZXR1cm4gJ3ZhcmlhYmxlJztcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuRW51bURlY2xhcmF0aW9uOlxuICAgICAgcmV0dXJuICdlbnVtJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdkZWNsYXJhdGlvbic7XG4gIH1cbn1cbiJdfQ==